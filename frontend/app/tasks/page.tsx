"use client";

import { useEffect, useState } from "react";
import { api, setAuthToken } from "@/lib/api";
import { Sidebar } from "@/components/ui/sidebar";
import { Card } from "@/components/ui/card";

interface Task {
  id: string;
  title: string;
  status: string;
  dueDate?: string;
  priority: string;
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("connect-crm-token");
    if (token) setAuthToken(token);

    api.get("/tasks")
      .then((response) => setTasks(response.data))
      .catch(() => setError("Unable to load tasks."));
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-8 dark:bg-slate-950">
      <div className="mx-auto grid max-w-7xl gap-8 xl:grid-cols-[280px_1fr]">
        <Sidebar />
        <section>
          <header className="mb-8 flex items-center justify-between rounded-[28px] border border-slate-200 bg-white/90 p-6 shadow-sm backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/90">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-brand-600">Tasks</p>
              <h1 className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">Team tasks</h1>
            </div>
            <button className="rounded-2xl bg-brand-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand-600">Add task</button>
          </header>

          <Card>
            <div className="space-y-4">
              {tasks.length === 0 ? (
                <p className="text-slate-500">No tasks assigned yet.</p>
              ) : (
                tasks.map((task) => (
                  <div key={task.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{task.title}</h3>
                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{task.status.replace(/_/g, " ")}</p>
                      </div>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600 dark:bg-slate-800 dark:text-slate-300">{task.priority}</span>
                    </div>
                    <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">Due {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No due date"}</p>
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
