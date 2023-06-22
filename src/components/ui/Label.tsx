import { cn } from "@/lib/utils";
import { FC } from "react";

interface LabelProps extends React.HTMLAttributes<HTMLDivElement> {
 size?: "small" | "medium" | "big";
 children: string;
}

const Label: FC<LabelProps> = ({ size, children, className, ...props }) => {
 return (
  <p
   className={cn(
    `${
     size === "small" ? "text-xl" : size === "medium" ? "text-2xl" : "text-4xl"
    } text-center`,
    className
   )}
   {...props}
  >
   {children}
  </p>
 );
};

export default Label;
