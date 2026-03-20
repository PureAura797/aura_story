import { TOTP, Secret } from "otpauth";
import crypto from "crypto";
import QRCode from "qrcode";
import { readData, writeData } from "./supabase";

/* ─── Types ─── */
interface TwoFactorData {
  secret: string;      // Base32-encoded secret
  enabled: boolean;
  backupCodes: string[]; // hashed backup codes
  createdAt: string;
}

const DATA_KEY = "admin_2fa";
const APP_NAME = "АураЧистоты Админ";
const ADMIN_USER = "admin";

const DEFAULT_2FA: TwoFactorData = {
  secret: "",
  enabled: false,
  backupCodes: [],
  createdAt: "",
};

/* ─── Helpers ─── */
function hashCode(code: string): string {
  return crypto.createHash("sha256").update(code.toLowerCase().trim()).digest("hex");
}

function createTOTP(secret: string): TOTP {
  return new TOTP({
    issuer: APP_NAME,
    label: ADMIN_USER,
    algorithm: "SHA1",
    digits: 6,
    period: 30,
    secret: Secret.fromBase32(secret),
  });
}

/* ─── Public API ─── */

/** Check if 2FA is currently enabled */
export async function is2FAEnabled(): Promise<boolean> {
  const data = await readData<TwoFactorData>(DATA_KEY, DEFAULT_2FA);
  return data.enabled && !!data.secret;
}

/** Generate a new TOTP secret + QR code for setup */
export async function setup2FA(): Promise<{
  secret: string;
  qrDataUrl: string;
  backupCodes: string[];
}> {
  // Generate random secret
  const secret = new Secret({ size: 20 });
  const base32 = secret.base32;

  // Generate human-readable backup codes (8 codes, 8 chars each)
  const rawBackupCodes: string[] = [];
  for (let i = 0; i < 8; i++) {
    rawBackupCodes.push(
      crypto.randomBytes(4).toString("hex") // 8-char hex string
    );
  }

  // Generate QR data URL
  const totp = createTOTP(base32);
  const otpauthUri = totp.toString();
  const qrDataUrl = await QRCode.toDataURL(otpauthUri, {
    width: 256,
    margin: 2,
    color: { dark: "#ffffff", light: "#0a0a0c" },
  });

  // Store (not yet enabled) with hashed backup codes
  await writeData<TwoFactorData>(DATA_KEY, {
    secret: base32,
    enabled: false,
    backupCodes: rawBackupCodes.map(hashCode),
    createdAt: new Date().toISOString(),
  });

  return { secret: base32, qrDataUrl, backupCodes: rawBackupCodes };
}

/** Verify a TOTP code and enable 2FA if correct (first-time activation) */
export async function enable2FA(code: string): Promise<boolean> {
  const data = await readData<TwoFactorData>(DATA_KEY, DEFAULT_2FA);
  if (!data.secret) return false;

  const totp = createTOTP(data.secret);
  const delta = totp.validate({ token: code, window: 1 });

  if (delta === null) return false;

  // Enable
  await writeData<TwoFactorData>(DATA_KEY, { ...data, enabled: true });
  return true;
}

/** Disable 2FA entirely */
export async function disable2FA(): Promise<void> {
  await writeData<TwoFactorData>(DATA_KEY, DEFAULT_2FA);
}

/** Verify a TOTP code during login */
export async function verifyTOTP(code: string): Promise<boolean> {
  const data = await readData<TwoFactorData>(DATA_KEY, DEFAULT_2FA);
  if (!data.enabled || !data.secret) return false;

  const totp = createTOTP(data.secret);
  const delta = totp.validate({ token: code, window: 1 });
  return delta !== null;
}

/** Verify a backup code (one-time use, gets consumed) */
export async function verifyBackupCode(code: string): Promise<boolean> {
  const data = await readData<TwoFactorData>(DATA_KEY, DEFAULT_2FA);
  if (!data.enabled) return false;

  const hashed = hashCode(code);
  const idx = data.backupCodes.indexOf(hashed);
  if (idx === -1) return false;

  // Remove used backup code
  const remaining = [...data.backupCodes];
  remaining.splice(idx, 1);
  await writeData<TwoFactorData>(DATA_KEY, { ...data, backupCodes: remaining });

  return true;
}
