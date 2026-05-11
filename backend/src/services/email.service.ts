import nodemailer from "nodemailer";
import { config } from "../config";

const transporter = nodemailer.createTransport({
  host: config.smtpHost,
  port: config.smtpPort,
  secure: config.smtpPort === 465,
  auth: {
    user: config.smtpUser,
    pass: config.smtpPass,
  },
});

export interface EmailPayload {
  to: string;
  subject: string;
  html: string;
}

export async function sendAuthEmail(payload: EmailPayload) {
  if (!config.smtpHost || !config.smtpUser || !config.smtpPass) {
    console.warn("SMTP credentials are missing, skip sending email");
    return;
  }

  await transporter.sendMail({
    from: `Connect CRM Pro <${config.smtpUser}>`,
    to: payload.to,
    subject: payload.subject,
    html: payload.html,
  });
}
