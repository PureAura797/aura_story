import crypto from "crypto";
import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "src", "data");
const PASSWORD_FILE = path.join(DATA_DIR, "admin_password.json");
const RECOVERY_FILE = path.join(DATA_DIR, "admin_recovery.json");

/* ─── Helpers ─── */
function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

/** scrypt-based password hashing with random salt */
function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const key = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${key}`;
}

/** Verify password against scrypt hash (salt:key format) */
function verifyHash(password: string, stored: string): boolean {
  // Check if it's the new scrypt format (salt:key)
  if (stored.includes(":")) {
    const [salt, key] = stored.split(":");
    const derivedKey = crypto.scryptSync(password, salt, 64).toString("hex");
    return crypto.timingSafeEqual(Buffer.from(key, "hex"), Buffer.from(derivedKey, "hex"));
  }
  // Legacy SHA256 format — verify and migrate silently
  const legacyHash = crypto.createHash("sha256").update(password).digest("hex");
  return legacyHash === stored;
}

/* ─── Password Verification ─── */
function getSavedPasswordData(): { hash: string; changedAt?: string } | null {
  try {
    if (fs.existsSync(PASSWORD_FILE)) {
      const data = JSON.parse(fs.readFileSync(PASSWORD_FILE, "utf-8"));
      return data.hash ? data : null;
    }
  } catch { /* read-only FS (Vercel) — fall through */ }
  return null;
}

/** Safe file write — silently fails on read-only FS (Vercel) */
function safeWriteJSON(filePath: string, data: unknown): void {
  try {
    ensureDataDir();
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  } catch {
    console.log("[admin-password] Read-only FS, skipping file write");
  }
}

export function verifyPassword(password: string): boolean {
  const saved = getSavedPasswordData();

  if (saved) {
    const isValid = verifyHash(password, saved.hash);

    // Auto-migrate legacy SHA256 → scrypt on successful login
    if (isValid && !saved.hash.includes(":")) {
      safeWriteJSON(PASSWORD_FILE, {
        hash: hashPassword(password),
        changedAt: new Date().toISOString(),
        migratedFrom: "sha256",
      });
      console.log("🔒 Password hash migrated from SHA256 to scrypt");
    }

    return isValid;
  }

  // Fallback to .env.local (works on Vercel without file system)
  const envPassword = process.env.ADMIN_PASSWORD || "pureaura2026";
  if (password === envPassword) {
    // Try to save hash — silently fails on Vercel
    safeWriteJSON(PASSWORD_FILE, {
      hash: hashPassword(password),
      changedAt: new Date().toISOString(),
    });
    console.log("🔒 Initial password saved with scrypt hash");
    return true;
  }

  return false;
}

/* ─── Password Change ─── */
export function changePassword(currentPassword: string, newPassword: string): { success: boolean; error?: string } {
  if (!verifyPassword(currentPassword)) {
    return { success: false, error: "Текущий пароль неверный" };
  }
  if (newPassword.length < 8) {
    return { success: false, error: "Новый пароль должен быть минимум 8 символов" };
  }

  ensureDataDir();
  const data = {
    hash: hashPassword(newPassword),
    changedAt: new Date().toISOString(),
  };
  fs.writeFileSync(PASSWORD_FILE, JSON.stringify(data, null, 2));
  return { success: true };
}

/* ─── Recovery ─── */
interface RecoveryData {
  email: string;
  codeHash: string;  // Now stored as hash, not plain text
  createdAt: string;
  expiresAt: string;
  attempts: number;
}

export async function createRecoveryCode(email: string): Promise<{ code: string; emailSent: boolean }> {
  ensureDataDir();
  const code = crypto.randomInt(100000, 999999).toString();
  const now = new Date();
  const expires = new Date(now.getTime() + 15 * 60 * 1000); // 15 minutes

  // Store hashed code — never plain text
  const data: RecoveryData = {
    email,
    codeHash: crypto.createHash("sha256").update(code).digest("hex"),
    createdAt: now.toISOString(),
    expiresAt: expires.toISOString(),
    attempts: 0,
  };
  fs.writeFileSync(RECOVERY_FILE, JSON.stringify(data, null, 2));

  // ─── Try to send real email via SMTP ───
  const smtpHost = process.env.RECOVERY_SMTP_HOST;
  const smtpPort = parseInt(process.env.RECOVERY_SMTP_PORT || "587");
  const smtpUser = process.env.RECOVERY_SMTP_USER;
  const smtpPass = process.env.RECOVERY_SMTP_PASS;

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
            <p style="color:#666;font-size:11px;margin:16px 0 0">Код действует 15 минут. Если вы не запрашивали сброс — проигнорируйте это письмо.</p>
          </div>
        `,
      });

      console.log(`✅ Recovery code sent to ${email}`);
      return { code, emailSent: true };
    } catch (err) {
      console.error("❌ Failed to send recovery email:", err);
    }
  }

  // ─── Fallback: console log ───
  console.log("╔══════════════════════════════════════════╗");
  console.log("║   📧  RECOVERY CODE (SMTP not configured)║");
  console.log(`║   Email: ${email.padEnd(30)} ║`);
  console.log(`║   Code:  ${code.padEnd(30)} ║`);
  console.log(`║   Expires: ${expires.toLocaleTimeString().padEnd(28)} ║`);
  console.log("╚══════════════════════════════════════════╝");
  console.log("💡 Configure RECOVERY_SMTP_* in .env.local to send real emails");

  return { code, emailSent: false };
}

export function verifyRecoveryCode(code: string): { valid: boolean; error?: string } {
  try {
    if (!fs.existsSync(RECOVERY_FILE)) {
      return { valid: false, error: "Код не запрашивался" };
    }
    const data: RecoveryData = JSON.parse(fs.readFileSync(RECOVERY_FILE, "utf-8"));

    // Check max attempts (brute-force protection)
    if (data.attempts >= 5) {
      fs.unlinkSync(RECOVERY_FILE);
      return { valid: false, error: "Слишком много попыток. Запросите новый код." };
    }

    if (new Date() > new Date(data.expiresAt)) {
      fs.unlinkSync(RECOVERY_FILE);
      return { valid: false, error: "Код истёк. Запросите новый." };
    }

    // Compare hashed code
    const codeHash = crypto.createHash("sha256").update(code).digest("hex");
    if (!crypto.timingSafeEqual(Buffer.from(data.codeHash, "hex"), Buffer.from(codeHash, "hex"))) {
      // Increment attempt counter
      data.attempts += 1;
      fs.writeFileSync(RECOVERY_FILE, JSON.stringify(data, null, 2));
      return { valid: false, error: "Неверный код" };
    }

    return { valid: true };
  } catch {
    return { valid: false, error: "Ошибка проверки кода" };
  }
}

export function resetPasswordWithCode(code: string, newPassword: string): { success: boolean; error?: string } {
  const verification = verifyRecoveryCode(code);
  if (!verification.valid) {
    return { success: false, error: verification.error };
  }

  if (newPassword.length < 8) {
    return { success: false, error: "Пароль должен быть минимум 8 символов" };
  }

  ensureDataDir();
  const data = {
    hash: hashPassword(newPassword),
    changedAt: new Date().toISOString(),
  };
  fs.writeFileSync(PASSWORD_FILE, JSON.stringify(data, null, 2));

  // Clean up recovery file
  if (fs.existsSync(RECOVERY_FILE)) {
    fs.unlinkSync(RECOVERY_FILE);
  }

  return { success: true };
}
