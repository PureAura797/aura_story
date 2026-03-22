import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import nodemailer from "nodemailer";
import { checkRateLimit } from "@/lib/rate-limiter";
import { readData } from "@/lib/supabase";

/** Escape HTML to prevent XSS in email templates */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Strip HTML tags and trim */
function sanitize(str: string, maxLen = 500): string {
  return str.replace(/<[^>]*>/g, "").trim().substring(0, maxLen);
}

const FORM_LIMIT = { prefix: "form", maxAttempts: 10, windowSeconds: 60 };

const DATA_FILE = path.join(process.cwd(), "src/data/notifications.json");

interface NotificationSettings {
  email: { enabled: boolean; recipients: string; smtp: { host: string; port: number; user: string; pass: string } };
  telegram: { enabled: boolean; botToken: string; chatIds: string };
  max: { enabled: boolean; botToken: string; chatIds: string };
  webhook: { enabled: boolean; url: string };
}

const DEFAULTS: NotificationSettings = {
  email: { enabled: false, recipients: "", smtp: { host: "", port: 587, user: "", pass: "" } },
  telegram: { enabled: false, botToken: "", chatIds: "" },
  max: { enabled: false, botToken: "", chatIds: "" },
  webhook: { enabled: false, url: "" },
};

async function loadSettings(): Promise<NotificationSettings> {
  // Primary: read from Supabase (where admin panel saves)
  try {
    const saved = await readData<Partial<NotificationSettings>>("notifications", {});
    if (saved && Object.keys(saved).length > 0) {
      return { ...DEFAULTS, ...saved };
    }
  } catch {}
  // Fallback: local file
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
      return { ...DEFAULTS, ...raw };
    }
  } catch {}
  return DEFAULTS;
}

/** Format form data into a readable message */
function formatMessage(data: Record<string, string>): string {
  const type = data.form_type === "callback" ? "🔔 Обратный звонок" : "📩 Заявка с сайта";
  const lines = [
    type,
    "─────────────────",
    data.name ? `Имя: ${data.name}` : null,
    data.phone ? `Телефон: ${data.phone}` : null,
    data.message ? `Сообщение: ${data.message}` : null,
    `Источник: ${data.source || "сайт"}`,
    `Время: ${data.submitted_at || new Date().toISOString()}`,
  ].filter(Boolean);
  return lines.join("\n");
}

function formatEmailHtml(data: Record<string, string>): string {
  const type = data.form_type === "callback" ? "Обратный звонок" : "Заявка с сайта";
  return `
    <div style="font-family:system-ui,sans-serif;max-width:480px;margin:0 auto;padding:24px;background:#111;color:#fff;border:1px solid #333;">
      <h2 style="margin:0 0 8px;font-size:18px;color:#5eead4;">${type}</h2>
      <hr style="border:none;border-top:1px solid #333;margin:12px 0;" />
      ${data.name ? `<p style="margin:4px 0;"><strong>Имя:</strong> ${escapeHtml(data.name)}</p>` : ""}
      ${data.phone ? `<p style="margin:4px 0;"><strong>Телефон:</strong> <a href="tel:${data.phone.replace(/\D/g, "")}" style="color:#5eead4;">${escapeHtml(data.phone)}</a></p>` : ""}
      ${data.message ? `<p style="margin:4px 0;"><strong>Сообщение:</strong> ${escapeHtml(data.message)}</p>` : ""}
      <hr style="border:none;border-top:1px solid #333;margin:12px 0;" />
      <p style="margin:4px 0;font-size:12px;color:#666;">Источник: ${data.source || "сайт"}</p>
      <p style="margin:4px 0;font-size:12px;color:#666;">Время: ${data.submitted_at || new Date().toISOString()}</p>
    </div>
  `;
}

/** Send email via SMTP */
async function sendEmail(settings: NotificationSettings["email"], data: Record<string, string>) {
  if (!settings.enabled || !settings.recipients || !settings.smtp.host) return;
  const transporter = nodemailer.createTransport({
    host: settings.smtp.host,
    port: settings.smtp.port,
    secure: settings.smtp.port === 465,
    auth: { user: settings.smtp.user, pass: settings.smtp.pass },
  });
  const recipients = settings.recipients.split(",").map((r) => r.trim()).filter(Boolean);
  const type = data.form_type === "callback" ? "Обратный звонок" : "Заявка с сайта";
  await transporter.sendMail({
    from: settings.smtp.user,
    to: recipients.join(", "),
    subject: `АураЧистоты — ${type}`,
    html: formatEmailHtml(data),
  });
}

/** Send Telegram message */
async function sendTelegram(settings: NotificationSettings["telegram"], data: Record<string, string>) {
  if (!settings.enabled || !settings.botToken || !settings.chatIds) return;
  const chatIds = settings.chatIds.split(",").map((id) => id.trim()).filter(Boolean);
  const message = formatMessage(data);
  await Promise.all(
    chatIds.map((chatId) =>
      fetch(`https://api.telegram.org/bot${settings.botToken}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chatId, text: message, parse_mode: "HTML" }),
      })
    )
  );
}

/** Send MAX message */
async function sendMax(settings: NotificationSettings["max"], data: Record<string, string>) {
  if (!settings.enabled || !settings.botToken || !settings.chatIds) return;
  const chatIds = settings.chatIds.split(",").map((id) => id.trim()).filter(Boolean);
  const message = formatMessage(data);
  await Promise.all(
    chatIds.map((chatId) =>
      fetch(`https://api.max.ru/bot${settings.botToken}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chatId, text: message }),
      })
    )
  );
}

/** Send to webhook */
async function sendWebhook(settings: NotificationSettings["webhook"], data: Record<string, string>) {
  if (!settings.enabled || !settings.url) return;
  await fetch(settings.url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function POST(request: NextRequest) {
  try {
    // ── Rate limit (10 req/min per IP) ──
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const limit = checkRateLimit(ip, FORM_LIMIT);
    if (!limit.allowed) {
      return NextResponse.json(
        { error: "Слишком много заявок. Попробуйте позже." },
        { status: 429, headers: { "Retry-After": limit.retryAfterSeconds.toString() } }
      );
    }

    const raw = await request.json();

    // ── Sanitize input ──
    const data: Record<string, string> = {
      name: raw.name ? sanitize(String(raw.name), 100) : "",
      phone: raw.phone ? sanitize(String(raw.phone), 30) : "",
      message: raw.message ? sanitize(String(raw.message), 1000) : "",
      form_type: raw.form_type === "callback" ? "callback" : "form",
      source: raw.source ? sanitize(String(raw.source), 50) : "сайт",
      submitted_at: new Date().toISOString(),
    };

    if (!data.phone && !data.name) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const settings = await loadSettings();

    // Check if any channel is enabled
    const anyEnabled = settings.email.enabled || settings.telegram.enabled || settings.max.enabled || settings.webhook.enabled;

    if (!anyEnabled) {
      // Fallback: try env variable webhook
      const envWebhook = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL;
      if (envWebhook) {
        await fetch(envWebhook, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        return NextResponse.json({ ok: true, channels: ["webhook_env"] });
      }
      return NextResponse.json({ ok: true, channels: [], message: "No notification channels configured" });
    }

    // Send to all enabled channels in parallel
    const results = await Promise.allSettled([
      sendEmail(settings.email, data),
      sendTelegram(settings.telegram, data),
      sendMax(settings.max, data),
      sendWebhook(settings.webhook, data),
    ]);

    const channels: string[] = [];
    const errors: string[] = [];

    if (settings.email.enabled) {
      results[0].status === "fulfilled" ? channels.push("email") : errors.push(`email: ${(results[0] as PromiseRejectedResult).reason}`);
    }
    if (settings.telegram.enabled) {
      results[1].status === "fulfilled" ? channels.push("telegram") : errors.push(`telegram: ${(results[1] as PromiseRejectedResult).reason}`);
    }
    if (settings.max.enabled) {
      results[2].status === "fulfilled" ? channels.push("max") : errors.push(`max: ${(results[2] as PromiseRejectedResult).reason}`);
    }
    if (settings.webhook.enabled) {
      results[3].status === "fulfilled" ? channels.push("webhook") : errors.push(`webhook: ${(results[3] as PromiseRejectedResult).reason}`);
    }

    return NextResponse.json({ ok: true, channels, errors: errors.length ? errors : undefined });
  } catch (error) {
    console.error("Submit form error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
