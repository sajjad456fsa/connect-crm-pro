import dotenv from "dotenv";

dotenv.config();

const env = process.env;

export const config = {
  port: Number(env.PORT ?? 4000),
  databaseUrl: env.DATABASE_URL ?? "postgresql://postgres:postgres@localhost:5432/connectcrm",
  jwtSecret: env.JWT_SECRET ?? "supersecretjwt",
  jwtRefreshSecret: env.JWT_REFRESH_SECRET ?? "supersecretrefresh",
  jwtExpiresIn: env.JWT_EXPIRES_IN ?? "15m",
  jwtRefreshExpiresIn: env.JWT_REFRESH_EXPIRES_IN ?? "7d",
  frontendUrl: env.FRONTEND_URL ?? "http://localhost:3000",
  smtpHost: env.SMTP_HOST ?? "",
  smtpPort: Number(env.SMTP_PORT ?? 587),
  smtpUser: env.SMTP_USER ?? "",
  smtpPass: env.SMTP_PASS ?? "",
};
