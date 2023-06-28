import { FC } from "react";
import { ChevronsRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Label from "@/components/ui/Label";

const Add: FC = () => {
 return (
  <div className="w-full h-2/3 grid grid-cols-4 grid-rows-3 gap-4">
   <Link
    href="/wrestler/add"
    className={cn(
     buttonVariants({ variant: "subtle" }),
     "flex gap-1 items-center justify-between p-10"
    )}
   >
    <Label size="medium" className="font-bold">
     Add wrestler
    </Label>
    <ChevronsRight size={30} />
   </Link>
   <Link
    href="/show/add"
    className={cn(
     buttonVariants({ variant: "subtle" }),
     "flex gap-1 items-center justify-between p-10"
    )}
   >
    <Label size="medium" className="font-bold">
     Add wrestler
    </Label>
    <ChevronsRight size={30} />
   </Link>
   <Link
    href="/match/add"
    className={cn(
     buttonVariants({ variant: "subtle" }),
     "flex gap-1 items-center justify-between p-10"
    )}
   >
    <Label size="medium" className="font-bold">
     Add wrestler
    </Label>
    <ChevronsRight size={30} />
   </Link>
   <Link
    href="/title/add"
    className={cn(
     buttonVariants({ variant: "subtle" }),
     "flex gap-1 items-center justify-between p-10"
    )}
   >
    <Label size="medium" className="font-bold">
     Add wrestler
    </Label>
    <ChevronsRight size={30} />
   </Link>
  </div>
 );
};

export default Add;
