import React, { type ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "destructive";
  size?: "default" | "sm" | "lg" | "icon";
  asChild?: boolean;
}

const variantClasses: Record<string, string> = {
  default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm",
  outline: "border border-border bg-background hover:bg-muted text-foreground",
  ghost: "hover:bg-muted text-foreground",
  destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm",
};

const sizeClasses: Record<string, string> = {
  default: "h-10 px-4 py-2",
  sm: "h-9 rounded-md px-3 text-sm",
  lg: "h-12 rounded-md px-8 text-lg",
  icon: "h-10 w-10",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "default", size = "default", asChild = false, children, ...props }, ref) => {
    const classes = `inline-flex items-center justify-center gap-2 rounded-lg font-medium text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(children as React.ReactElement<any>, {
        className: `${classes} ${(children as React.ReactElement<any>).props.className || ""}`.trim(),
        ref,
      });
    }

    return (
      <button
        ref={ref}
        className={classes}
        {...props}
      >
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";

export { Button };
export type { ButtonProps };
