import { FC } from "react";
import createClient from "@/lib/supabase-server";
import Label from "@/components/ui/Label";

const Wrestlers = async () => {
 const supabase = createClient();
 const { data: wrestlers } = await supabase.from("wrestlers").select("*");
 return (
  <div className="w-full">
   <Label className="font-bold mb-5">All wrestlers</Label>
   {wrestlers?.map((wrestler, index) => (
    <button
     key={wrestler.id}
     className="w-full dark:bg-slate-800 bg-slate-200 mt-2 flex justify-between p-2 rounded-xl hover:scale-105 duration-200"
    >
     <p>
      {index + 1}. {wrestler.name}
     </p>
     {wrestler.avgRating}
    </button>
   ))}
  </div>
 );
};

export default Wrestlers;
