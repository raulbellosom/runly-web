// src/lib/mailer.ts
import nodemailer from "nodemailer";
import type { ContactFormPayload } from "./contact-schema";

export function buildContactEmail(payload: ContactFormPayload) {
  const subject = `Nueva solicitud de ${payload.companyName} (${payload.interest})`;
  const text = [
    `Nombre: ${payload.fullName}`,
    `Empresa: ${payload.companyName}`,
    `Correo: ${payload.email}`,
    `Teléfono: ${payload.phone}`,
    `Tamaño de equipo: ${payload.teamSize || "No especificado"}`,
    `Interés: ${payload.interest}`,
    `Idioma del formulario: ${payload.locale}`,
    "",
    "Necesidades:",
    payload.needs,
  ].join("\n");

  return { subject, text };
}

interface MailerConfig {
  from: string;
  to: string;
}

type Transporter = ReturnType<typeof nodemailer.createTransport>;

export function createTransporter(env: {
  SMTP_HOST: string;
  SMTP_PORT: string;
  SMTP_SECURE: string;
  SMTP_USER: string;
  SMTP_PASSWORD: string;
}): Transporter {
  return nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: Number(env.SMTP_PORT) || 587,
    secure: env.SMTP_SECURE === "true",
    auth: { user: env.SMTP_USER, pass: env.SMTP_PASSWORD },
  });
}

export async function sendContactEmail(
  payload: ContactFormPayload,
  transporter: Pick<Transporter, "sendMail">,
  config: MailerConfig,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const { subject, text } = buildContactEmail(payload);
  try {
    await transporter.sendMail({
      from: config.from,
      to: config.to,
      replyTo: payload.email,
      subject,
      text,
    });
    return { ok: true };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "unknown_error" };
  }
}
