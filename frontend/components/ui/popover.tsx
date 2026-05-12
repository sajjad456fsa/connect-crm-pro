import { forwardRef, useState } from "react";
import cx from "clsx";

interface PopoverProps {
  children: React.ReactNode;
}

export function Popover({ children }: PopoverProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      {children}
    </div>
  );
}

export const PopoverTrigger = forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, onClick, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={className}
        onClick={(e) => {
          onClick?.(e);
        }}
        {...props}
      />
    );
  }
);

PopoverTrigger.displayName = "PopoverTrigger";

export const PopoverContent = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cx(
          "z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none",
          className
        )}
        {...props}
      />
    );
  }
);

PopoverContent.displayName = "PopoverContent";