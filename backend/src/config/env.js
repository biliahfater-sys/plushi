import 'dotenv/config';

export const config = {
  port: Number(process.env.PORT) || 4000,
  corsOrigin: process.env.CORS_ORIGIN || '*',
  smtp: {
    host: process.env.SMTP_HOST || '',
    port: Number(process.env.SMTP_PORT) || 587,
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
    from: process.env.SMTP_FROM || 'Плюши <noreply@plushi.local>',
  },
  shopEmail: process.env.SHOP_EMAIL || 'orders@plushi.local',
};

export const isSmtpConfigured = Boolean(
  config.smtp.host && config.smtp.user && config.smtp.pass,
);
