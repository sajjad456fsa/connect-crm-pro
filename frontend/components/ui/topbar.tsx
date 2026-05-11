"use client";

import { motion } from "framer-motion";

export function Topbar({ title }: { title: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="mb-8 flex items-center justify-between rounded-[28px] border border-slate-200 bg-white/90 px-6 py-5 shadow-sm backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/90">
      <div>
        <p className="text-sm uppercase tracking-[0.28em] text-brand-600">Dashboard</p>
        <h1 className="mt-1 text-3xl font-semibold text-slate-900 dark:text-white">{title}</h1>
      </div>
      <div className="rounded-2xl bg-slate-100 px-4 py-3 text-sm text-slate-700 shadow-sm dark:bg-slate-900 dark:text-slate-200">
        Managed with modern analytics
      </div>
    </motion.div>
  );
}
