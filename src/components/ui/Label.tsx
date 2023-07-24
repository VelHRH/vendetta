import { cn } from "@/lib/utils";
import { FC, ReactNode } from "react";

interface LabelProps extends React.HTMLAttributes<HTMLDivElement> {
 size?: "small" | "medium" | "big";
 children: ReactNode;
}

const Label: FC<LabelProps> = ({ size, children, className, ...props }) => {
 return (
  <p
   className={cn(
    `${
     size === "small" ? "text-xl" : size === "medium" ? "text-2xl" : "text-4xl"
    } break-all flex gap-2 items-center flex-wrap`,
    className
   )}
   {...props}
  >
   {children}
  </p>
 );
};

export default Label;
