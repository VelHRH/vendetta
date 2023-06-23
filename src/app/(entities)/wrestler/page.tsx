import createClient from "@/lib/supabase-server";
import Label from "@/components/ui/Label";
import WrestlerElem from "@/components/Wrestler/WrestlerElem";

const Wrestlers = async () => {
 const supabase = createClient();
 const { data: wrestlers } = await supabase.from("wrestlers").select("*");
 return (
  <div className="w-full font-semibold">
   <Label className="font-bold mb-5">All wrestlers</Label>
   <div className="flex justify-between items-center p-2">
    <p className="text-center w-1/2">Wrestler</p>
    <p className="text-center flex-1">Last show</p>
    <p className="text-center w-32">Rating</p>
   </div>
   {wrestlers?.map((wrestler, index) => (
    <WrestlerElem key={index} place={index + 1} wrestler={wrestler} />
   ))}
  </div>
 );
};

export default Wrestlers;
