"use client";

import { useEffect, useState } from "react";
import { api, setAuthToken } from "@/lib/api";
import { Sidebar } from "@/components/ui/sidebar";
import { Card } from "@/components/ui/card";

interface Lead {
  id: string;
  fullName: string;
  company?: string;
  email: string;
  status: string;
  priority: string;
  budget?: number;
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("connect-crm-token");
    if (token) setAuthToken(token);

    api.get("/leads")
      .then((response) => setLeads(response.data))
      .catch(() => setError("Unable to load leads."));
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-8 dark:bg-slate-950">
      <div className="mx-auto grid max-w-7xl gap-8 xl:grid-cols-[280px_1fr]">
        <Sidebar />
        <section>
          <header className="mb-8 flex items-center justify-between rounded-[28px] border border-slate-200 bg-white/90 p-6 shadow-sm backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/90">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-brand-600">Leads</p>
              <h1 className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">Lead pipeline</h1>
            </div>
            <button className="rounded-2xl bg-brand-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand-600">New lead</button>
          </header>

          <Card>
            <div className="overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800">
              <table className="w-full min-w-max border-separate border-spacing-0 text-left text-sm">
                <thead className="bg-slate-100 text-slate-600 dark:bg-slate-900 dark:text-slate-300">
                  <tr>
                    <th className="px-6 py-4">Lead</th>
                    <th className="px-6 py-4">Company</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Priority</th>
                    <th className="px-6 py-4">Budget</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-slate-500">No leads available.</td>
                    </tr>
                  ) : (
                    leads.map((lead) => (
                      <tr key={lead.id} className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
                        <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{lead.fullName}</td>
                        <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{lead.company || "—"}</td>
                        <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{lead.status.replace(/_/g, " ")}</td>
                        <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{lead.priority}</td>
                        <td className="px-6 py-4 text-slate-600 dark:text-slate-300">${lead.budget?.toLocaleString() ?? 0}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            {error && <p className="mt-4 text-sm text-red-500">{error}</p>}
          </Card>
        </section>
      </div>
    </main>
  );
}
