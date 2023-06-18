import { FC } from "react";

interface InputProps {
 value: string;
 setValue: (value: string) => void;
 placeholder: string;
 type?: string;
}

const Input: FC<InputProps> = ({ setValue, value, placeholder, type }) => {
 return (
  <fieldset
   className={`relative border-[3px] p-3 w-full border-slate-500 duration-500 rounded-md`}
  >
   <input
    placeholder={placeholder}
    className={`w-full h-full font-medium text-lg outline-none peer focus:placeholder-transparent bg-transparent`}
    onChange={(e) => setValue(e.target.value)}
    value={value}
    type={type || "text"}
   />
   <legend className="px-2 font-semibold text-slate-500 hidden peer-focus:flex leading-[.16rem]">
    {placeholder}
   </legend>
  </fieldset>
 );
};

export default Input;
