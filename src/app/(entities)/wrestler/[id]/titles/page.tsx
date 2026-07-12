import Reign from "@/components/Row/Reign";
import createClient from "@/lib/supabase-server";
import { getBerserkReignStatus } from "@/lib/utils";

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

 const { data: shows } = await supabase
  .from("shows")
  .select("*, matches(*, challanges(*))");
 if (!shows) {
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
    .map((reign, index) => {
     const berserkStatus = getBerserkReignStatus(reign, shows);
     return (
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
      isCrossed={berserkStatus === "holder" && reign.end !== null}
      note={
       berserkStatus === "holder"
        ? reign.end
          ? "владелец титула — не стал чемпионом"
          : "владелец титула — ещё без успешной защиты"
        : undefined
      }
     />
     );
    })}
  </div>
 );
};

export default WrestlerTitles;
