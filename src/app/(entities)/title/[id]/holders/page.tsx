import Reign from "@/components/Row/Reign";
import createClient from "@/lib/supabase-server";

import { notFound } from "next/navigation";

const WrestlerTitles = async ({ params }: { params: { id: string } }) => {
 const supabase = createClient();

 const { data: fetchedReigns } = await supabase
  .from("reigns")
  .select("*")
  .eq("title_id", params.id);
 if (!fetchedReigns) {
  notFound();
 }

 const reigns = fetchedReigns
  .filter(
   (reign, index, self) =>
    index ===
    self.findIndex(
     (r) =>
      r.start === reign.start &&
      r.end === reign.end &&
      r.team_id === reign.team_id
    )
  )
  .sort(
   (a, b) =>
    new Date(b.start || new Date()).getTime() -
    new Date(a.start || new Date()).getTime()
  );
 return (
  <div className="w-full">
   {reigns.map((reign, index) => (
    <Reign
     key={reign.id}
     index={index}
     main={reign.team_name || reign.wrestler_name}
     link={`/team/${reign.team_id || reign.wrestler_id}`}
     matchesLink={`/title/${reign.title_id}/matches?start=${reign.start}${
      reign.end ? `&end=${reign.end}` : ""
     }`}
     start={reign.start}
     end={reign.end}
     withVacant={
      reign.end && reign.end !== reigns[index - 1]?.start
       ? reigns[index - 1] !== undefined
         ? reigns[index - 1].start
         : "сейчас"
       : undefined
     }
    />
   ))}
  </div>
 );
};

export default WrestlerTitles;
