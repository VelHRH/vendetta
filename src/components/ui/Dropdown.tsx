"use client";
import { ChevronDown, ChevronUp } from "lucide-react";
import { FC } from "react";

interface DropdownProps {
 array: string[];
 value: string;
 setValue: (value: string) => void;
 isSelect: boolean;
 setIsSelect: (value: boolean) => void;
 placeholder?: string;
}

const Dropdown: FC<DropdownProps> = ({
 array,
 value,
 setValue,
 isSelect,
 setIsSelect,
 placeholder,
}) => {
 return (
  <div className={`w-full p-1`}>
   <button
    onClick={() => setIsSelect(!isSelect)}
    className={`flex items-center justify-between font-semibold border-[3px] p-3 w-full border-slate-500 rounded-md ${
     value === "" ? "text-slate-500" : "text-slate-900 dark:text-slate-50"
    }`}
   >
    {value === "" ? placeholder || "Choose..." : value}
    {isSelect ? <ChevronUp /> : <ChevronDown />}
   </button>

   {isSelect && (
    <div className="bg-slate-200 dark:bg-slate-800 rounded-md mt-2 p-2">
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
