import crypto from "crypto";
import { readData, writeData } from "./supabase";

/* ─── Helpers ─── */

/** scrypt-based password hashing with random salt */
function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const key = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${key}`;
}

/** Verify password against scrypt hash (salt:key format) */
function verifyHash(password: string, stored: string): boolean {
  if (stored.includes(":")) {
    const [salt, key] = stored.split(":");
    const derivedKey = crypto.scryptSync(password, salt, 64).toString("hex");
    return crypto.timingSafeEqual(Buffer.from(key, "hex"), Buffer.from(derivedKey, "hex"));
  }
  // Legacy SHA256 format
  const legacyHash = crypto.createHash("sha256").update(password).digest("hex");
  return legacyHash === stored;
}

/* ─── Password Verification (Supabase) ─── */

interface PasswordData {
  hash: string;
  changedAt?: string;
}

async function getSavedPasswordData(): Promise<PasswordData | null> {
  const data = await readData<PasswordData | null>("password", null);
  return data?.hash ? data : null;
}

export async function verifyPassword(password: string): Promise<boolean> {
  const saved = await getSavedPasswordData();

  if (saved) {
    const isValid = verifyHash(password, saved.hash);

    // Auto-migrate legacy SHA256 → scrypt
    if (isValid && !saved.hash.includes(":")) {
      await writeData("password", {
        hash: hashPassword(password),
        changedAt: new Date().toISOString(),
        migratedFrom: "sha256",
      });
    }
    return isValid;
  }

  // Fallback to env var (first login)
  const envPassword = process.env.ADMIN_PASSWORD || "pureaura2026";
  if (password === envPassword) {
    await writeData("password", {
      hash: hashPassword(password),
      changedAt: new Date().toISOString(),
    });
    console.log("🔒 Password saved to Supabase with scrypt hash");
    return true;
  }

  return false;
}

/* ─── Password Change ─── */
export async function changePassword(
  currentPassword: string,
  newPassword: string
): Promise<{ success: boolean; error?: string }> {
  if (!(await verifyPassword(currentPassword))) {
    return { success: false, error: "Текущий пароль неверный" };
  }
  if (newPassword.length < 8) {
    return { success: false, error: "Новый пароль должен быть минимум 8 символов" };
  }

  await writeData("password", {
    hash: hashPassword(newPassword),
    changedAt: new Date().toISOString(),
  });
  return { success: true };
}

/* ─── Recovery (Supabase) ─── */

interface RecoveryData {
  email: string;
  codeHash: string;
  createdAt: string;
  expiresAt: string;
  attempts: number;
}

export async function createRecoveryCode(
  email: string
): Promise<{ code: string; emailSent: boolean }> {
  const code = crypto.randomInt(100000, 999999).toString();
  const now = new Date();
  const expires = new Date(now.getTime() + 15 * 60 * 1000);

  await writeData<RecoveryData>("recovery", {
    email,
    codeHash: crypto.createHash("sha256").update(code).digest("hex"),
    createdAt: now.toISOString(),
    expiresAt: expires.toISOString(),
    attempts: 0,
  });

  // ─── Try SMTP ───
  const smtpHost = process.env.RECOVERY_SMTP_HOST;
  const smtpUser = process.env.RECOVERY_SMTP_USER;
  const smtpPass = process.env.RECOVERY_SMTP_PASS;
  const smtpPort = parseInt(process.env.RECOVERY_SMTP_PORT || "587");

  if (smtpHost && smtpUser && smtpPass) {
    try {
      const nodemailer = await import("nodemailer");
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: { user: smtpUser, pass: smtpPass },
      });
      await transporter.sendMail({
        from: `"PureAura Admin" <${smtpUser}>`,
        to: email,
        subject: "Код восстановления пароля — PureAura",
        html: `
          <div style="font-family:system-ui;max-width:400px;margin:0 auto;padding:32px;background:#0a0a0c;color:#fff;border:1px solid rgba(255,255,255,0.08)">
            <h2 style="margin:0 0 16px;font-size:18px;font-weight:700">Восстановление пароля</h2>
            <p style="color:#999;font-size:13px;margin:0 0 24px">Ваш код для сброса пароля админ-панели:</p>
            <div style="background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);padding:16px;text-align:center;font-size:32px;letter-spacing:0.3em;font-weight:700;font-family:monospace">${code}</div>
            <p style="color:#666;font-size:11px;margin:16px 0 0">Код действует 15 минут.</p>
          </div>
        `,
      });
      return { code, emailSent: true };
    } catch (err) {
      console.error("❌ Failed to send recovery email:", err);
    }
  }

  // Fallback: console
  console.log(`📧 Recovery code for ${email}: ${code} (expires in 15 min)`);
  return { code, emailSent: false };
}

export async function verifyRecoveryCode(
  code: string
): Promise<{ valid: boolean; error?: string }> {
  const data = await readData<RecoveryData | null>("recovery", null);
  if (!data) return { valid: false, error: "Код не запрашивался" };

  if (data.attempts >= 5) {
    await writeData("recovery", null);
    return { valid: false, error: "Слишком много попыток. Запросите новый код." };
  }

  if (new Date() > new Date(data.expiresAt)) {
    await writeData("recovery", null);
    return { valid: false, error: "Код истёк. Запросите новый." };
  }

  const codeHash = crypto.createHash("sha256").update(code).digest("hex");
  if (
    !crypto.timingSafeEqual(
      Buffer.from(data.codeHash, "hex"),
      Buffer.from(codeHash, "hex")
    )
  ) {
    data.attempts += 1;
    await writeData("recovery", data);
    return { valid: false, error: "Неверный код" };
  }

  return { valid: true };
}

export async function resetPasswordWithCode(
  code: string,
  newPassword: string
): Promise<{ success: boolean; error?: string }> {
  const verification = await verifyRecoveryCode(code);
  if (!verification.valid) return { success: false, error: verification.error };

  if (newPassword.length < 8) {
    return { success: false, error: "Пароль должен быть минимум 8 символов" };
  }

  await writeData("password", {
    hash: hashPassword(newPassword),
    changedAt: new Date().toISOString(),
  });
  await writeData("recovery", null);
  return { success: true };
}
