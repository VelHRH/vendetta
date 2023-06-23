import Image from "next/image";
import createClient from "@/lib/supabase-server";
import { notFound } from "next/navigation";

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
 return (
  <div className="w-3/4 flex gap-5">
   <div className="w-1/3 aspect-square relative">
    <Image
     alt="Wrestler image"
     src={
      wrestler.wrestler_img ||
      "https://brytpkxacsmzbawwiqcr.supabase.co/storage/v1/object/public/wrestlers/default.png"
     }
     fill
     className="object-cover rounded-md"
    />
   </div>
   <div className="w-2/3 p-3">Real name: {wrestler.real_name}</div>
  </div>
 );
};

export default WrestlerOverview;
