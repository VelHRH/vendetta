import { FC } from "react";

interface InputProps {
 value: string;
 setValue: (value: string) => void;
 placeholder: string;
 type?: string;
 isError?: boolean;
}

const Input: FC<InputProps> = ({
 setValue,
 value,
 placeholder,
 type,
 isError,
}) => {
 return (
  <fieldset
   className={`relative border-[3px] p-3 w-full duration-500 rounded-md ${
    isError ? "border-red-600" : "border-slate-500"
   }`}
  >
   <input
    placeholder={placeholder}
    className={`w-full h-full font-medium text-lg outline-none peer focus:placeholder-transparent bg-transparent`}
    onChange={(e) => setValue(e.target.value)}
    value={value}
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
