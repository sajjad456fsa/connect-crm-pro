"use client";

import { useEffect, useState } from "react";
import { api, setAuthToken } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Sidebar } from "@/components/ui/sidebar";
import { Topbar } from "@/components/ui/topbar";
import { motion } from "framer-motion";

interface DashboardReport {
  leadCount: number;
  customerCount: number;
  taskCount: number;
  revenue: number;
  statusCounts: Record<string, number>;
}

export default function DashboardPage() {
  const [report, setReport] = useState<DashboardReport | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("connect-crm-token");
    if (token) setAuthToken(token);

    api.get("/reports/dashboard")
      .then((response) => setReport(response.data))
      .catch(() => setError("Unable to load dashboard data."));
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-8 dark:bg-slate-950">
      <div className="mx-auto grid max-w-7xl gap-8 xl:grid-cols-[280px_1fr]">
        <Sidebar />
        <section>
          <Topbar title="CRM Dashboard" />
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            <Card title="Total Leads" description="Active leads in your pipeline">
              <p className="mt-4 text-4xl font-semibold text-slate-900 dark:text-white">{report?.leadCount ?? "--"}</p>
            </Card>
            <Card title="Customers" description="Total customers in the system">
              <p className="mt-4 text-4xl font-semibold text-slate-900 dark:text-white">{report?.customerCount ?? "--"}</p>
            </Card>
            <Card title="Tasks" description="Open tasks across teams">
              <p className="mt-4 text-4xl font-semibold text-slate-900 dark:text-white">{report?.taskCount ?? "--"}</p>
            </Card>
            <Card title="Pipeline Value" description="Estimated deal revenue">
              <p className="mt-4 text-4xl font-semibold text-slate-900 dark:text-white">${report?.revenue.toLocaleString() ?? "--"}</p>
            </Card>
          </div>

          {error && <p className="mt-6 text-sm text-red-500">{error}</p>}

          <div className="mt-8 grid gap-6 xl:grid-cols-3">
            <Card title="Lead Status" description="Conversion stages">
              <div className="space-y-3">
                {report
                  ? Object.entries(report.statusCounts).map(([status, count]) => (
                      <div key={status} className="flex items-center justify-between rounded-3xl bg-slate-100 px-4 py-3 text-sm dark:bg-slate-900">
                        <span className="font-medium text-slate-700 dark:text-slate-200">{status.replace(/_/g, " ")}</span>
                        <span className="font-semibold text-slate-900 dark:text-white">{count}</span>
                      </div>
                    ))
                  : <p className="text-slate-500">Loading statuses...</p>}
              </div>
            </Card>
            <Card title="Team Performance" description="Recent activity highlights">
              <div className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                <p>Sales team closing rate increased by 12% this month.</p>
                <p>New leads are being assigned automatically across active agents.</p>
                <p>Task completion is improving week over week.</p>
              </div>
            </Card>
            <Card title="Recent Updates" description="Notifications & workflow alerts">
              <div className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                <p>New user registrations are enabled for your company.</p>
                <p>Realtime notifications will appear once connected.</p>
              </div>
            </Card>
          </div>
        </section>
      </div>
    </main>
  );
}
