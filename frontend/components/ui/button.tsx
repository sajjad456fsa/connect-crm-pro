import { ButtonHTMLAttributes } from "react";
import cx from "clsx";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost" | "secondary";
}

export function Button({ variant = "primary", className, ...props }: ButtonProps) {
  return (
    <button
      className={cx(
        "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-brand-500",
        {
          "bg-brand-500 text-white hover:bg-brand-600": variant === "primary",
          "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50": variant === "secondary",
          "bg-transparent text-brand-600 hover:bg-brand-50": variant === "ghost",
        },
        className
      )}
      {...props}
    />
  );
}
