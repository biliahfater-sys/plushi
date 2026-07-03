import nodemailer from 'nodemailer';
import { config, isSmtpConfigured } from '../config/env.js';

let transporter = null;

const getTransporter = () => {
  if (!isSmtpConfigured) return null;
  if (transporter) return transporter;

  transporter = nodemailer.createTransport({
    host: config.smtp.host,
    port: config.smtp.port,
    secure: config.smtp.port === 465,
    auth: { user: config.smtp.user, pass: config.smtp.pass },
  });

  return transporter;
};

export const mailService = {
  async send({ to, subject, text, html }) {
    const tx = getTransporter();

    if (!tx) {
      console.log('\n[mail:dev] SMTP не настроен — письмо не отправлено, лог:');
      console.log(`  to:      ${to}`);
      console.log(`  subject: ${subject}`);
      console.log(`  body:\n${text}\n`);
      return { dev: true };
    }

    const info = await tx.sendMail({
      from: config.smtp.from,
      to,
      subject,
      text,
      html,
    });

    return { messageId: info.messageId };
  },
};
