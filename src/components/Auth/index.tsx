"use client";

import { useAuth, VIEWS } from "./AuthProvider";
import SignIn from "./SignIn";

import SignUp from "./SignUp";

const Auth = ({ initialView }: { initialView: string }) => {
 let { view } = useAuth();

 if (initialView) {
  view = initialView;
 }

 switch (view) {
  case VIEWS.SIGN_UP:
   return <SignUp />;
  default:
   return (
    <div className="w-2/5 container mx-auto ">
     <SignIn />
    </div>
   );
 }
};

export default Auth;
