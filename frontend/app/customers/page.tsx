"use client";

import { useEffect, useState } from "react";
import { api, setAuthToken } from "@/lib/api";
import { Sidebar } from "@/components/ui/sidebar";
import { Card } from "@/components/ui/card";

interface Customer {
  id: string;
  name: string;
  email: string;
  company?: string;
  billingInfo?: string;
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("connect-crm-token");
    if (token) setAuthToken(token);

    api.get("/customers")
      .then((response) => setCustomers(response.data))
      .catch(() => setError("Unable to load customers."));
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-8 dark:bg-slate-950">
      <div className="mx-auto grid max-w-7xl gap-8 xl:grid-cols-[280px_1fr]">
        <Sidebar />
        <section>
          <header className="mb-8 flex items-center justify-between rounded-[28px] border border-slate-200 bg-white/90 p-6 shadow-sm backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/90">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-brand-600">Customers</p>
              <h1 className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">Customer database</h1>
            </div>
            <button className="rounded-2xl bg-brand-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand-600">New customer</button>
          </header>

          <Card>
            <div className="grid gap-4 sm:grid-cols-2">
              {customers.length === 0 ? (
                <p className="text-slate-500">No customers available.</p>
              ) : (
                customers.map((customer) => (
                  <div key={customer.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{customer.name}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{customer.company || "Independent"}</p>
                    <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{customer.email}</p>
                  </div>
                ))
              )}
            </div>
            {error && <p className="mt-4 text-sm text-red-500">{error}</p>}
          </Card>
        </section>
      </div>
    </main>
  );
}
