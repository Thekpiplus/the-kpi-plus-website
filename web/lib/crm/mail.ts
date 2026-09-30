import nodemailer from "nodemailer";

export function notificationEmail() {
  return (process.env.LEAD_NOTIFICATION_EMAIL ?? "").trim();
}

export function smtpConfigured() {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_FROM);
}

export async function sendMail(input: { to: string; subject: string; text: string; html?: string }) {
  if (!smtpConfigured()) {
    if (process.env.NODE_ENV !== "production") {
      console.info("[crm-mail:dev]", { to: input.to, subject: input.subject, text: input.text });
    }
    throw new Error("smtp_not_configured");
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: process.env.SMTP_USER
      ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS ?? "" }
      : undefined,
  });

  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: input.to,
    subject: input.subject,
    text: input.text,
    html: input.html ?? input.text.replace(/\n/g, "<br>"),
  });
}
