"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { api, setAuthToken } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const registerSchema = z.object({
  name: z.string().min(3, "Enter your full name"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({ resolver: zodResolver(registerSchema) });

  async function onSubmit(values: RegisterForm) {
    try {
      setError(null);
      const response = await api.post("/auth/register", values);
      const { accessToken } = response.data;
      setAuthToken(accessToken);
      localStorage.setItem("connect-crm-token", accessToken);
      setSuccess("Account created. Check your inbox for verification.");
      router.push("/dashboard");
    } catch (err: any) {
      setError(err?.response?.data?.error || "Unable to register at this time.");
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6 py-16 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="w-full max-w-lg rounded-[40px] border border-slate-200 bg-white/90 p-10 shadow-2xl shadow-slate-200/40 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/95">
        <div className="mb-8 text-center">
          <p className="text-sm uppercase tracking-[0.35em] text-brand-600">Create account</p>
          <h1 className="mt-4 text-4xl font-semibold">Start your sales workflow</h1>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">Register with your team email and access lead management, analytics, and automations.</p>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <Input label="Full name" type="text" {...register("name")} error={errors.name?.message} />
          <Input label="Email" type="email" {...register("email")} error={errors.email?.message} />
          <Input label="Password" type="password" {...register("password")} error={errors.password?.message} />

          {error && <p className="text-sm text-red-500">{error}</p>}
          {success && <p className="text-sm text-emerald-600">{success}</p>}

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Creating account..." : "Create account"}
          </Button>
        </form>
        <div className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
          Already have an account? <a href="/auth/login" className="font-semibold text-brand-600 hover:text-brand-700">Sign in</a>
        </div>
      </div>
    </main>
  );
}
