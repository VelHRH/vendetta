"use client";

import { useAuth, VIEWS } from "./AuthProvider";
import ResetPassword from "./ResetPassword";
import SignIn from "./SignIn";

import SignUp from "./SignUp";

const Auth = ({ initialView }: { initialView: string }) => {
 let { view } = useAuth();

 if (initialView) {
  view = initialView;
 }

 switch (view) {
  case VIEWS.SIGN_UP:
   return (
    <div className="w-2/5 container mx-auto ">
     <SignUp />
    </div>
   );
  case VIEWS.FORGOTTEN_PASSWORD:
   return (
    <div className="w-2/5 container mx-auto ">
     <ResetPassword />
    </div>
   );
  default:
   return (
    <div className="w-2/5 container mx-auto ">
     <SignIn />
    </div>
   );
 }
};

export default Auth;
