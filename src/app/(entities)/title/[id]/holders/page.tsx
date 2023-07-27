import Reign from "@/components/Row/Reign";
import createClient from "@/lib/supabase-server";

import { notFound } from "next/navigation";

const WrestlerTitles = async ({ params }: { params: { id: string } }) => {
 const supabase = createClient();

 const { data: reigns } = await supabase
  .from("reigns")
  .select("*")
  .eq("title_id", params.id);
 if (!reigns) {
  notFound();
 }
 return (
  <div className="w-full">
   {reigns
    .sort(
     (a, b) =>
      new Date(b.start || new Date()).getTime() -
      new Date(a.start || new Date()).getTime()
    )
    .map((reign, index) => (
     <Reign
      key={reign.id}
      index={index}
      main={reign.wrestler_name}
      link={`/wrestler/${reign.wrestler_id}`}
      matchesLink={`/title/${reign.title_id}/matches`}
      start={reign.start}
      end={reign.end}
     />
    ))}
  </div>
 );
};

export default WrestlerTitles;
