import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Connect CRM Pro",
  description: "Modern self-hosted CRM for leads, sales, teams, and analytics.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased dark:bg-slate-950 dark:text-slate-100">
        {children}
      </body>
    </html>
  );
}
