"use client";
import { ratingColor } from "@/lib/utils";
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
  <div className={`w-full text-lg relative`}>
   <button
    onClick={() => setIsSelect(!isSelect)}
    className={`flex items-center justify-between border-[3px] p-3 bg-slate-100 dark:bg-slate-900 w-full border-slate-500 rounded-md ${
     value === ""
      ? "text-slate-400 font-medium"
      : "text-slate-900 dark:text-slate-50 font-semibold"
    }`}
   >
    {value === "" ? placeholder || "Choose..." : value}
    {isSelect ? <ChevronUp /> : <ChevronDown />}
   </button>

   {isSelect && (
    <div className="bg-slate-200 dark:bg-slate-800 rounded-md mt-2 p-2 absolute w-full z-20 shadow-lg shadow-slate-950">
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
