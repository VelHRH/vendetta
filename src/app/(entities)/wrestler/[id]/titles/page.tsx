import Reign from "@/components/Row/Reign";
import createClient from "@/lib/supabase-server";

import { notFound } from "next/navigation";

const WrestlerTitles = async ({ params }: { params: { id: string } }) => {
 const supabase = createClient();

 const { data: wrestler } = await supabase
  .from("wrestlers")
  .select("*, reigns(*)")
  .eq("id", params.id)
  .single();
 if (!wrestler) {
  notFound();
 }
 return (
  <div className="w-full">
   {wrestler.reigns
    .sort(
     (a, b) =>
      new Date(b.start || new Date()).getTime() -
      new Date(a.start || new Date()).getTime()
    )
    .map((reign, index) => (
     <Reign
      key={reign.id}
      index={index}
      main={
       reign.title_name +
       (reign.wrestler_name !== wrestler.name
        ? ` (as ${reign.wrestler_name})`
        : "")
      }
      link={`/title/${reign.title_id}`}
      matchesLink={`/title/${reign.title_id}/matches?start=${reign.start}${
       reign.end ? `&end=${reign.end}` : ""
      }`}
      start={reign.start}
      end={reign.end}
     />
    ))}
  </div>
 );
};

export default WrestlerTitles;
