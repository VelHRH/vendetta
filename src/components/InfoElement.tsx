import { FC, ReactNode } from "react";

interface InfoElementProps {
 children: ReactNode;
}

const InfoElement: FC<InfoElementProps> = ({ children }) => {
 return (
  <div className="p-1 text-base rounded-md bg-slate-200 dark:bg-slate-800">
   {children}
  </div>
 );
};

export default InfoElement;
