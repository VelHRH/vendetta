import MatchNoResult from "@/components/Row/MatchNoResult";
import ProfileElem from "@/components/Row/ProfileElem";
import Label from "@/components/ui/Label";
import createClient from "@/lib/supabase-server";
import { Frown } from "lucide-react";
import { notFound } from "next/navigation";

const RatedMatches = async ({ params }: { params: { slug: string } }) => {
 const supabase = createClient();

 const { data: matches } = await supabase
  .from("matches")
  .select("*, match_sides(*)");

 const { data: profile } = await supabase
  .from("users")
  .select("*, comments_matches(*)")
  .eq("username", params.slug.replace(/%20/g, " "))
  .single();

 if (!profile) {
  notFound();
 }

 return (
  <>
   <Label className="font-bold mb-2 flex justify-center" size="medium">
    Оцененные матчи:
   </Label>
   {profile.comments_matches.length > 0 ? (
    profile.comments_matches
     .sort(
      (a, b) =>
       new Date(b.created_at || new Date()).getTime() -
       new Date(a.created_at || new Date()).getTime()
     )
     .map((comment) => (
      <ProfileElem
       key={comment.id}
       main={
        <MatchNoResult
         match_sides={
          matches?.find((w) => w.id === comment.item_id)!.match_sides!
         }
        />
       }
       id={matches?.find((w) => w.id === comment.item_id)!.id!}
       rating={comment.rating}
       date={comment.created_at}
       type="match"
      />
     ))
   ) : (
    <div className="text-2xl flex gap-3 justify-center items-center">
     <p>Пользователь еще не оценил ни одного матча</p> <Frown size={40} />
    </div>
   )}
  </>
 );
};

export default RatedMatches;
