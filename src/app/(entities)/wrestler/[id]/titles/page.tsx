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
      isCrossed={
       reign.title_id === 6 &&
       reign.end !== null &&
       shows
        .filter(
         (show) =>
          show.matches.some((match) =>
           match.challanges.some((chal) => chal.title_id === reign.title_id)
          ) &&
          show.upload_date &&
          new Date(show.upload_date).getTime() >=
           new Date(reign.start || "2000-01-01").getTime() &&
          new Date(show.upload_date).getTime() <=
           new Date(reign.end || "3000-01-01").getTime()
        )
        .flatMap((show) => show.matches)
        .filter((match) =>
         match.challanges.some(
          (chal) => chal.title_id === parseFloat(params.id)
         )
        ).length < 3
      }
     />
    ))}
  </div>
 );
};

export default WrestlerTitles;
