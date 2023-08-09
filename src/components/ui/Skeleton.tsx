import { cn } from "@/lib/utils";
import { FC } from "react";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

const Skeleton: FC<SkeletonProps> = ({ className }) => {
 return (
  <div
   className={cn("shadow-lg animate-pulse rounded-lg bg-gray-700", className)}
  />
 );
};

export default Skeleton;
