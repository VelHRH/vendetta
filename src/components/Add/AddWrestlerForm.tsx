"use client";
import { FC, useState } from "react";
import Dropdown from "@/components/ui/Dropdown";

const AddWrestlerForm: FC = () => {
 const [sex, setSex] = useState<string>("");
 const [isSelectSex, setIsSelectSex] = useState<boolean>(false);
 return (
  <Dropdown
   array={["Male", "Female", "Undefined"]}
   value={sex}
   setValue={setSex}
   isSelect={isSelectSex}
   setIsSelect={setIsSelectSex}
   placeholder="Choose sex..."
  />
 );
};

export default AddWrestlerForm;
