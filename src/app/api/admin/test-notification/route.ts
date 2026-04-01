import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { isAdminAuthenticatedFromRequest } from "@/lib/admin-auth";
import { readData } from "@/lib/supabase";

interface SmtpSettings {
  host: string;
  port: number;
  user: string;
  pass: string;
}

interface NotificationSettings {
  email: { enabled: boolean; recipients: string; smtp: SmtpSettings };
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

export async function POST(request: NextRequest) {
  if (!(await isAdminAuthenticatedFromRequest(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { channel } = await request.json();
    if (!channel) {
      return NextResponse.json({ error: "Не указан канал для тестирования" }, { status: 400 });
    }

    // Load settings from Supabase
    const raw = await readData<Partial<NotificationSettings>>("notifications", {});
    const settings: NotificationSettings = {
      email: { ...DEFAULTS.email, ...raw.email, smtp: { ...DEFAULTS.email.smtp, ...(raw.email?.smtp || {}) } },
      telegram: { ...DEFAULTS.telegram, ...raw.telegram },
      max: { ...DEFAULTS.max, ...raw.max },
      webhook: { ...DEFAULTS.webhook, ...raw.webhook },
    };

    const diagnostics: Record<string, unknown> = {
      channel,
      settingsLoaded: true,
      timestamp: new Date().toISOString(),
    };

    // ── EMAIL TEST ──
    if (channel === "email") {
      const { email } = settings;
      diagnostics.enabled = email.enabled;
      diagnostics.recipients = email.recipients || "(пусто)";
      diagnostics.smtpHost = email.smtp.host || "(не задан)";
      diagnostics.smtpPort = email.smtp.port;
      diagnostics.smtpUser = email.smtp.user || "(не задан)";
      diagnostics.smtpPassSet = !!email.smtp.pass;
      diagnostics.secure = email.smtp.port === 465;

      if (!email.enabled) {
        return NextResponse.json({ ok: false, msg: "Канал Email выключен", diagnostics });
      }
      if (!email.recipients) {
        return NextResponse.json({ ok: false, msg: "Не указаны получатели", diagnostics });
      }
      if (!email.smtp.host || !email.smtp.user || !email.smtp.pass) {
        return NextResponse.json({ ok: false, msg: "Не заполнены SMTP-настройки", diagnostics });
      }

      try {
        const transporter = nodemailer.createTransport({
          host: email.smtp.host,
          port: email.smtp.port,
          secure: email.smtp.port === 465,
          auth: { user: email.smtp.user, pass: email.smtp.pass },
          connectionTimeout: 10000,
          greetingTimeout: 10000,
          socketTimeout: 10000,
        });

        // Step 1: Verify SMTP connection
        diagnostics.step = "verify";
        await transporter.verify();
        diagnostics.smtpVerified = true;

        // Step 2: Send test email
        diagnostics.step = "send";
        const recipients = email.recipients.split(",").map((r) => r.trim()).filter(Boolean);
        const info = await transporter.sendMail({
          from: email.smtp.user,
          to: recipients.join(", "),
          subject: "АураЧистоты — Тест Email ✓",
          html: `
            <div style="font-family:system-ui;max-width:480px;margin:0 auto;padding:24px;background:#fff;border:1px solid #e0e0e0;border-radius:8px;">
              <h2 style="color:#0d9488;margin:0 0 12px;">✅ Тест пройден</h2>
              <p style="color:#333;">Email-уведомления работают корректно.</p>
              <hr style="border:none;border-top:1px solid #eee;margin:16px 0;" />
              <p style="font-size:12px;color:#888;">
                SMTP: ${email.smtp.host}:${email.smtp.port}<br/>
                От: ${email.smtp.user}<br/>
                Время: ${new Date().toLocaleString("ru-RU", { timeZone: "Europe/Moscow" })}
              </p>
            </div>
          `,
        });

        diagnostics.messageId = info.messageId;
        diagnostics.accepted = info.accepted;
        diagnostics.rejected = info.rejected;

        return NextResponse.json({ ok: true, msg: "Тест отправлен ✓ Проверьте почту.", diagnostics });
      } catch (smtpError: unknown) {
        const err = smtpError as Error & { code?: string; responseCode?: number; response?: string };
        diagnostics.smtpError = err.message;
        diagnostics.smtpCode = err.code;
        diagnostics.smtpResponseCode = err.responseCode;
        diagnostics.smtpResponse = err.response;

        // Human-readable error translation
        let msg = "Ошибка SMTP";
        if (err.code === "EAUTH" || err.responseCode === 535) {
          msg = "Неверный логин или пароль SMTP. Проверьте пароль приложения.";
        } else if (err.code === "ESOCKET" || err.code === "ECONNREFUSED") {
          msg = `Не удалось подключиться к ${email.smtp.host}:${email.smtp.port}. Проверьте хост и порт.`;
        } else if (err.code === "ECONNECTION") {
          msg = "Сервер отклонил подключение. Возможно, порт заблокирован хостингом.";
        } else if (err.code === "ETIMEDOUT") {
          msg = "Таймаут подключения к SMTP-серверу. Порт может быть заблокирован.";
        } else {
          msg = `SMTP: ${err.message}`;
        }

        return NextResponse.json({ ok: false, msg, diagnostics });
      }
    }

    // ── TELEGRAM TEST ──
    if (channel === "telegram") {
      const { telegram } = settings;
      diagnostics.enabled = telegram.enabled;
      diagnostics.botTokenSet = !!telegram.botToken;
      diagnostics.chatIds = telegram.chatIds || "(пусто)";

      if (!telegram.enabled) {
        return NextResponse.json({ ok: false, msg: "Канал Telegram выключен", diagnostics });
      }
      if (!telegram.botToken || !telegram.chatIds) {
        return NextResponse.json({ ok: false, msg: "Не указан токен бота или Chat ID", diagnostics });
      }

      const chatIds = telegram.chatIds.split(",").map((id) => id.trim()).filter(Boolean);
      const results = await Promise.allSettled(
        chatIds.map(async (chatId) => {
          const res = await fetch(`https://api.telegram.org/bot${telegram.botToken}/sendMessage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              chat_id: chatId,
              text: "✅ *Тест пройден*\n\nTelegram-уведомления работают корректно.\n\n_АураЧистоты — Админ-панель_",
              parse_mode: "Markdown",
            }),
          });
          const data = await res.json();
          if (!data.ok) throw new Error(data.description || "Telegram API error");
          return { chatId, ok: true };
        })
      );

      const succeeded = results.filter((r) => r.status === "fulfilled").length;
      const failed = results.filter((r) => r.status === "rejected");
      diagnostics.results = results.map((r, i) => ({
        chatId: chatIds[i],
        status: r.status,
        error: r.status === "rejected" ? (r as PromiseRejectedResult).reason?.message : undefined,
      }));

      if (failed.length > 0) {
        const firstError = (failed[0] as PromiseRejectedResult).reason?.message;
        return NextResponse.json({
          ok: succeeded > 0,
          msg: succeeded > 0
            ? `Отправлено ${succeeded}/${chatIds.length}. Ошибка: ${firstError}`
            : `Ошибка: ${firstError}`,
          diagnostics,
        });
      }

      return NextResponse.json({ ok: true, msg: `Тест отправлен в ${succeeded} чат(ов) ✓`, diagnostics });
    }

    // ── MAX TEST ──
    if (channel === "max") {
      const { max } = settings;
      if (!max.enabled) return NextResponse.json({ ok: false, msg: "Канал MAX выключен", diagnostics });
      if (!max.botToken || !max.chatIds) return NextResponse.json({ ok: false, msg: "Не указан токен бота или Chat ID", diagnostics });

      const chatIds = max.chatIds.split(",").map((id) => id.trim()).filter(Boolean);
      const results = await Promise.allSettled(
        chatIds.map(async (chatId) => {
          const res = await fetch(`https://api.max.ru/bot${max.botToken}/sendMessage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ chat_id: chatId, text: "✅ Тест пройден\n\nMAX-уведомления работают." }),
          });
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
        })
      );

      const succeeded = results.filter((r) => r.status === "fulfilled").length;
      return NextResponse.json({
        ok: succeeded > 0,
        msg: succeeded > 0 ? `Тест отправлен в ${succeeded} чат(ов) ✓` : "Ошибка отправки",
        diagnostics,
      });
    }

    // ── WEBHOOK TEST ──
    if (channel === "webhook") {
      const { webhook } = settings;
      if (!webhook.enabled) return NextResponse.json({ ok: false, msg: "Webhook выключен", diagnostics });
      if (!webhook.url) return NextResponse.json({ ok: false, msg: "Не указан URL", diagnostics });

      try {
        const res = await fetch(webhook.url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ test: true, source: "pureaura-admin", timestamp: new Date().toISOString() }),
        });
        diagnostics.webhookStatus = res.status;
        if (!res.ok) {
          return NextResponse.json({ ok: false, msg: `Webhook вернул ${res.status}`, diagnostics });
        }
        return NextResponse.json({ ok: true, msg: "Webhook отправлен ✓", diagnostics });
      } catch (e) {
        return NextResponse.json({ ok: false, msg: `Не удалось подключиться: ${(e as Error).message}`, diagnostics });
      }
    }

    return NextResponse.json({ ok: false, msg: `Неизвестный канал: ${channel}` });
  } catch (e) {
    return NextResponse.json({ ok: false, msg: `Ошибка: ${(e as Error).message}` }, { status: 500 });
  }
}
