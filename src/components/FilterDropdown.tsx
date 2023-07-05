"use client";
import { useRouter } from "next/navigation";
import { FC, useEffect, useState } from "react";
import Dropdown from "./ui/Dropdown";

interface FilterDropdownProps {
 array: string[];
 placeholder: string;
 path: string;
}

const FilterDropdown: FC<FilterDropdownProps> = ({
 array,
 placeholder,
 path,
}) => {
 const [currChoice, setCurrChoice] = useState<string>(array[0]);
 const router = useRouter();
 useEffect(() => {
  if (currChoice === array[0]) {
   router.push(path);
  } else {
   router.push(`${path}?filter=${currChoice}`);
  }
 }, [currChoice]);
 return (
  <Dropdown
   array={array}
   value={currChoice}
   setValue={setCurrChoice}
   placeholder={placeholder}
  />
 );
};

export default FilterDropdown;
