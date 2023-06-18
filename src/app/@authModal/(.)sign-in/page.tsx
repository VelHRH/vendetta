import SingIn from "@/components/Auth/SignIn";
import CloseModal from "@/components/CloseModal";
import { FC } from "react";

const page: FC = () => {
 return (
  <CloseModal>
   <SingIn />
  </CloseModal>
 );
};

export default page;
