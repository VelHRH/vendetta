import { cn } from "@/lib/utils";
import { FC } from "react";

interface InputProps extends React.HTMLAttributes<HTMLDivElement> {
 value: string;
 setValue: (value: string) => void;
 placeholder: string;
 type?: string;
 isError?: boolean;
 disabled?: boolean;
}

const Input: FC<InputProps> = ({
 setValue,
 value,
 placeholder,
 type,
 isError,
 className,
 disabled,
}) => {
 return (
  <fieldset
   className={cn(
    `relative border-[3px] p-3 w-full duration-500 rounded-md ${
     isError ? "border-red-600" : "border-slate-500"
    }`,
    className
   )}
  >
   <input
    placeholder={placeholder}
    className={`w-full h-full font-medium text-lg outline-none peer focus:placeholder-transparent bg-transparent ${
     disabled && "text-slate-900/20 dark:text-slate-50/20"
    }`}
    onChange={(e) => setValue(e.target.value)}
    value={value}
    disabled={disabled}
    type={type || "text"}
   />
   <legend
    className={`px-2 font-semibold hidden peer-focus:flex leading-[.16rem] ${
     isError ? "text-red-600" : "text-slate-500"
    }`}
   >
    {placeholder}
   </legend>
  </fieldset>
 );
};

export default Input;
