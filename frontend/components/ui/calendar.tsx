import { forwardRef } from "react";
import cx from "clsx";

interface CalendarProps extends React.HTMLAttributes<HTMLDivElement> {
  // Simplified calendar - in a real app you'd use a proper calendar library
}

export const Calendar = forwardRef<HTMLDivElement, CalendarProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cx("p-3", className)}
        {...props}
      >
        <div className="text-sm text-muted-foreground">
          Calendar component - use a date picker library in production
        </div>
      </div>
    );
  }
);

Calendar.displayName = "Calendar";