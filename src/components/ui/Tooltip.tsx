import { Info } from "lucide-react";
import { FC } from "react";

interface TooltipProps {
 children: string;
}

const Tooltip: FC<TooltipProps> = ({ children }) => {
 return (
  <div className="group relative flex justify-center">
   <Info size={20} />
   <span className="absolute w-[500px] z-40 top-10 scale-0 rounded bg-slate-800 dark:bg-slate-200 p-2 text-xs text-slate-100 dark:text-slate-900 group-hover:scale-100">
    {children}
   </span>
  </div>
 );
};

export default Tooltip;
