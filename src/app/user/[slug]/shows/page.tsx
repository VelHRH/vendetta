import ProfileElem from "@/components/Row/ProfileElem";
import Label from "@/components/ui/Label";
import createClient from "@/lib/supabase-server";
import { Frown } from "lucide-react";
import { notFound } from "next/navigation";

const RatedShows = async ({ params }: { params: { slug: string } }) => {
 const supabase = createClient();

 const { data: shows } = await supabase.from("shows").select();

 const { data: profile } = await supabase
  .from("users")
  .select("*, comments_shows(*)")
  .eq("username", params.slug.replace(/%20/g, " "))
  .single();

 if (!profile) {
  notFound();
 }

 return (
  <>
   <Label className="font-bold mb-2 flex justify-center" size="medium">
    Оцененные шоу:
   </Label>
   {profile.comments_shows.length > 0 ? (
    profile.comments_shows
     .sort(
      (a, b) =>
       new Date(b.created_at || new Date()).getTime() -
       new Date(a.created_at || new Date()).getTime()
     )
     .map((comment) => (
      <ProfileElem
       key={comment.id}
       main={shows?.find((w) => w.id === comment.item_id)!.name!}
       id={shows?.find((w) => w.id === comment.item_id)!.id!}
       rating={comment.rating}
       date={comment.created_at}
       type="show"
      />
     ))
   ) : (
    <div className="text-2xl flex gap-3 justify-center items-center">
     <p>Пользователь еще не оценил ни одного шоу</p> <Frown size={40} />
    </div>
   )}
  </>
 );
};

export default RatedShows;
