import { forwardRef, useEffect, useState } from "react";
import cx from "clsx";

interface DialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

export function Dialog({ open, onOpenChange, children }: DialogProps) {
  const [isOpen, setIsOpen] = useState(open || false);

  useEffect(() => {
    setIsOpen(open || false);
  }, [open]);

  const handleOpenChange = (newOpen: boolean) => {
    setIsOpen(newOpen);
    onOpenChange?.(newOpen);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black/50"
        onClick={() => handleOpenChange(false)}
      />
      <div className="relative z-50 max-h-[90vh] overflow-y-auto">
        {children}
      </div>
    </div>
  );
}

export const DialogContent = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cx(
          "relative rounded-lg border bg-background p-6 shadow-lg",
          className
        )}
        {...props}
      />
    );
  }
);

DialogContent.displayName = "DialogContent";

export const DialogHeader = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cx("flex flex-col space-y-1.5 text-center sm:text-left", className)}
        {...props}
      />
    );
  }
);

DialogHeader.displayName = "DialogHeader";

export const DialogTitle = forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => {
    return (
      <h3
        ref={ref}
        className={cx("text-lg font-semibold leading-none tracking-tight", className)}
        {...props}
      />
    );
  }
);

DialogTitle.displayName = "DialogTitle";

export const DialogTrigger = forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={className}
        {...props}
      />
    );
  }
);

DialogTrigger.displayName = "DialogTrigger";