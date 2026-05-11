import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center px-6 py-20 text-center">
      <div className="w-full rounded-[36px] border border-slate-200 bg-white/80 p-12 shadow-2xl shadow-slate-200/40 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/80">
        <p className="text-sm uppercase tracking-[0.35em] text-brand-600">Connect CRM Pro</p>
        <h1 className="mt-6 text-5xl font-semibold tracking-tight text-slate-900 dark:text-white">Self-hosted CRM for modern sales teams</h1>
        <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-slate-600 dark:text-slate-300">
          Manage leads, customers, tasks, reports and workflows with a polished enterprise-ready interface built on Next.js, TypeScript, Tailwind, and Prisma.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link href="/auth/login"><Button>Login</Button></Link>
          <Link href="/auth/register"><Button variant="secondary">Create account</Button></Link>
        </div>
      </div>
    </main>
  );
}
