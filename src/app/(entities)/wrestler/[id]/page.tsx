import Image from "next/image";
import createClient from "@/lib/supabase-server";
import { notFound } from "next/navigation";
import Label from "@/components/ui/Label";
import { DEFAULT_IMAGE } from "@/config";

const WrestlerOverview = async ({ params }: { params: { id: string } }) => {
 const supabase = createClient();
 const { data: wrestler } = await supabase
  .from("wrestlers")
  .select("*")
  .eq("id", params.id)
  .single();
 if (!wrestler) {
  notFound();
 }
 const beginCareer = new Date(wrestler.career_start!.toString());
 // @ts-ignore
 const experience = new Date(Date.now() - beginCareer);

 return (
  <div className="w-3/4 flex gap-5">
   <div className="h-80 w-80 aspect-square relative">
    <Image
     alt="Wrestler image"
     src={wrestler.wrestler_img || DEFAULT_IMAGE}
     fill
     className="object-cover rounded-md"
    />
   </div>
   <div className="w-2/3 p-3 flex flex-col gap-10">
    <div className="flex flex-col pb-10 gap-5 border-b-2 border-slate-500 w-full items-start">
     <Label size="medium" className="font-bold mb-3 pb-3">
      Character information:
     </Label>
     <Label size="small">Total matches: 0</Label>
     <Label size="small">
      Start of in-ring career: {beginCareer.toLocaleDateString()}
     </Label>
     <Label size="small">
      Experience: {Math.abs(experience.getUTCFullYear() - 1970) + 4} years
     </Label>
     <Label size="small" className="flex gap-2 items-center">
      Trainers:
      {wrestler.trainer?.map((t) => (
       <div
        className="p-1 text-base rounded-md bg-slate-200 dark:bg-slate-800"
        key={t}
       >
        {t}
       </div>
      ))}
     </Label>
     <Label size="small" className="flex gap-2 items-center">
      Wrestling styles:
      {wrestler.style?.map((s) => (
       <div
        className="p-1 text-base rounded-md bg-slate-200 dark:bg-slate-800"
        key={s}
       >
        {s}
       </div>
      ))}
     </Label>
    </div>
    <div className="flex flex-col pb-10 gap-5 items-start">
     <Label size="medium" className="font-bold mb-3 pb-3">
      Personal information:
     </Label>
    </div>
   </div>
  </div>
 );
};

export default WrestlerOverview;
