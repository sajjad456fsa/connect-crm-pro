"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { api, setAuthToken } from "@/lib/api";
import { Sidebar } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const settingsSchema = z.object({
  companyName: z.string().optional(),
  companyEmail: z.string().email().optional(),
  brandColor: z.string().optional(),
  smtpHost: z.string().optional(),
  smtpPort: z.string().optional(),
  smtpUser: z.string().optional(),
});

type SettingsForm = z.infer<typeof settingsSchema>;

export default function SettingsPage() {
  const [message, setMessage] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SettingsForm>({ resolver: zodResolver(settingsSchema) });

  useEffect(() => {
    const token = localStorage.getItem("connect-crm-token");
    if (token) setAuthToken(token);

    api.get("/settings")
      .then((response) => reset(response.data))
      .catch(() => setMessage("Unable to load settings."));
  }, [reset]);

  async function onSubmit(values: SettingsForm) {
    try {
      setMessage(null);
      await api.put("/settings", values);
      setMessage("Settings saved successfully.");
    } catch {
      setMessage("Unable to save settings.");
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-8 dark:bg-slate-950">
      <div className="mx-auto grid max-w-7xl gap-8 xl:grid-cols-[280px_1fr]">
        <Sidebar />
        <section>
          <header className="mb-8 rounded-[28px] border border-slate-200 bg-white/90 p-6 shadow-sm backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/90">
            <p className="text-sm uppercase tracking-[0.35em] text-brand-600">Settings</p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">Company & security</h1>
          </header>

          <form className="space-y-6 rounded-[32px] border border-slate-200 bg-white/90 p-8 shadow-sm backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/90" onSubmit={handleSubmit(onSubmit)}>
            <Input label="Company name" type="text" {...register("companyName")} />
            <Input label="Company email" type="email" {...register("companyEmail")} error={errors.companyEmail?.message} />
            <Input label="Brand color" type="text" {...register("brandColor")} />
            <Input label="SMTP host" type="text" {...register("smtpHost")} />
            <Input label="SMTP port" type="text" {...register("smtpPort")} />
            <Input label="SMTP user" type="text" {...register("smtpUser")} />
            <Button type="submit" className="w-fit">Save settings</Button>
            {message && <p className="text-sm text-slate-600 dark:text-slate-300">{message}</p>}
          </form>
        </section>
      </div>
    </main>
  );
}
