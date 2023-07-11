import { Info } from "lucide-react";
import { FC } from "react";

interface InfoLabelProps {
 children: string;
}

const InfoLabel: FC<InfoLabelProps> = ({ children }) => {
 return (
  <p className="flex text-slate-500 items-center gap-2">
   <Info size={30} /> <p>{children}</p>
  </p>
 );
};

export default InfoLabel;
