import { cn } from "@/lib/utils";
import { cva, VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import * as React from "react";

const buttonVariants = cva(
 "active:scale-95 inline-flex gap-2 items-center justify-center rounded-md text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:opacity-50 dark:focus:ring-slate-400 disabled:pointer-events-none dark:focus:ring-offset-slate-900",
 {
  variants: {
   variant: {
    default:
     "bg-slate-900 text-slate-100 hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200",
    destructive:
     "hover:bg-red-400 dark:hover:bg-red-400 hover:text-white dark:hover:text-white text-red-400 dark:text-red-400 bg-slate-700 dark:bg-slate-700 border-[1px] border-red-400",
    outline:
     "bg-slate-100 text-slate-900 hover:bg-slate-200 outline outline-1 outline-slate-300",
    subtle:
     "hover:bg-slate-200 bg-transparent dark:hover:bg-slate-800 dark:bg-transparent text-slate-900 dark:text-slate-100 focus:ring-0 focus:ring-offset-0",
   },
   size: {
    default: "h-10 py-2 px-4",
    sm: "h-9 px-2 rounded-md",
    xs: "h-8 px-1.5 rounded-sm",
    lg: "h-11 px-8 rounded-md",
   },
  },
  defaultVariants: {
   variant: "default",
   size: "default",
  },
 }
);

export interface ButtonProps
 extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
 isLoading?: boolean;
 icon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
 ({ className, children, variant, isLoading, icon, size, ...props }, ref) => {
  return (
   <button
    className={cn(buttonVariants({ variant, size, className }))}
    ref={ref}
    disabled={isLoading}
    {...props}
   >
    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>{icon}</>}
    {children}
   </button>
  );
 }
);
Button.displayName = "Button";

export { Button, buttonVariants };
