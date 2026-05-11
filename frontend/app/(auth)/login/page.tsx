"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { api, setAuthToken } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) });

  async function onSubmit(values: LoginForm) {
    try {
      setError(null);
      const response = await api.post("/auth/login", values);
      const { accessToken } = response.data;
      setAuthToken(accessToken);
      localStorage.setItem("connect-crm-token", accessToken);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err?.response?.data?.error || "Could not login. Check credentials.");
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6 py-16 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="w-full max-w-lg rounded-[40px] border border-slate-200 bg-white/90 p-10 shadow-2xl shadow-slate-200/40 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/95">
        <div className="mb-8 text-center">
          <p className="text-sm uppercase tracking-[0.35em] text-brand-600">Sign in</p>
          <h1 className="mt-4 text-4xl font-semibold">Welcome back to Connect CRM</h1>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">Use your work account to access the dashboard and manage your sales pipeline.</p>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <Input label="Email" type="email" {...register("email")} error={errors.email?.message} />
          <Input label="Password" type="password" {...register("password")} error={errors.password?.message} />

          {error && <p className="text-sm text-red-500">{error}</p>}

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Signing in..." : "Sign in"}
          </Button>
        </form>
        <div className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
          New to Connect CRM? <a href="/auth/register" className="font-semibold text-brand-600 hover:text-brand-700">Create an account</a>
        </div>
      </div>
    </main>
  );
}
