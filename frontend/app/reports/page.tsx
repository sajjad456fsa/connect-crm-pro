"use client";

import { useEffect, useState } from "react";
import { api, setAuthToken } from "@/lib/api";
import { Sidebar } from "@/components/ui/sidebar";
import { Card } from "@/components/ui/card";

interface ReportData {
  leadCount: number;
  customerCount: number;
  taskCount: number;
  revenue: number;
}

export default function ReportsPage() {
  const [report, setReport] = useState<ReportData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("connect-crm-token");
    if (token) setAuthToken(token);
    api.get("/reports/dashboard")
      .then((response) => setReport(response.data))
      .catch(() => setError("Unable to load reports."));
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-8 dark:bg-slate-950">
      <div className="mx-auto grid max-w-7xl gap-8 xl:grid-cols-[280px_1fr]">
        <Sidebar />
        <section>
          <header className="mb-8 rounded-[28px] border border-slate-200 bg-white/90 p-6 shadow-sm backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/90">
            <p className="text-sm uppercase tracking-[0.35em] text-brand-600">Reports</p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">Sales analytics</h1>
          </header>

          <div className="grid gap-6 md:grid-cols-2">
            <Card title="Revenue Growth">
              <p className="text-slate-600 dark:text-slate-300">Revenue is tracking well. The CRM is ready to display advanced Recharts graphs.</p>
              <p className="mt-4 text-3xl font-semibold text-slate-900 dark:text-white">${report?.revenue.toLocaleString() ?? 0}</p>
            </Card>
            <Card title="Conversion Overview">
              <p className="text-slate-600 dark:text-slate-300">Quick summary of pipeline health and lead conversion performance.</p>
              <p className="mt-4 text-3xl font-semibold text-slate-900 dark:text-white">{report?.leadCount ?? 0} leads</p>
            </Card>
          </div>
          {error && <p className="mt-4 text-sm text-red-500">{error}</p>}
        </section>
      </div>
    </main>
  );
}
