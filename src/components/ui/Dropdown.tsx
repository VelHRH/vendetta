"use client";
import { ChevronDown, ChevronUp } from "lucide-react";
import { FC, useState } from "react";

interface DropdownProps extends React.HTMLAttributes<HTMLDivElement> {
 array: string[];
 value: string;
 setValue: (value: string) => void;
 placeholder: string;
}

const Dropdown: FC<DropdownProps> = ({
 array,
 value,
 setValue,
 placeholder,
 className,
}) => {
 const [isSelect, setIsSelect] = useState<boolean>(false);
 return (
  <div className={`w-full text-lg relative ${className}`}>
   <button
    onClick={() => setIsSelect(!isSelect)}
    className={`flex items-center justify-between border-[3px] p-3 bg-slate-100 dark:bg-slate-900 w-full border-slate-500 rounded-md ${
     value === "" || isSelect
      ? "text-slate-400 font-medium"
      : "text-slate-900 dark:text-slate-50 font-semibold"
    }`}
   >
    {value === "" || isSelect ? placeholder : value}
    {isSelect ? <ChevronUp /> : <ChevronDown />}
   </button>

   {isSelect && (
    <div className="bg-slate-200 dark:bg-slate-800 rounded-md mt-2 p-2 absolute w-full z-20 shadow-lg shadow-slate-950 max-h-60 overflow-auto">
     <button
      onClick={() => {
       setValue("");
       setIsSelect(false);
      }}
      className="rounded-md text-start w-full font-medium p-2 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-500"
     >
      {placeholder}
     </button>
     {array?.map((item, id) => (
      <button
       key={id}
       onClick={() => {
        setValue(item);
        setIsSelect(false);
       }}
       className="rounded-md text-start w-full font-medium p-2 hover:bg-slate-300 dark:hover:bg-slate-700"
      >
       {item}
      </button>
     ))}
    </div>
   )}
  </div>
 );
};

export default Dropdown;
