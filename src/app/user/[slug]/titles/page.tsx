import ProfileElem from "@/components/Row/ProfileElem";
import Label from "@/components/ui/Label";
import createClient from "@/lib/supabase-server";
import { Frown } from "lucide-react";
import { notFound } from "next/navigation";

const RatedTitles = async ({ params }: { params: { slug: string } }) => {
 const supabase = createClient();

 const { data: titles } = await supabase
  .from("titles")
  .select("*, match_sides(*, wrestlers(*))");

 const { data: profile } = await supabase
  .from("users")
  .select("*, comments_titles(*)")
  .eq("username", params.slug.replace(/%20/g, " "))
  .single();

 if (!profile) {
  notFound();
 }

 return (
  <>
   <Label className="font-bold mb-2 flex justify-center" size="medium">
    Оцененные команды:
   </Label>
   {profile.comments_titles.length > 0 ? (
    profile.comments_titles
     .sort(
      (a, b) =>
       new Date(b.created_at || new Date()).getTime() -
       new Date(a.created_at || new Date()).getTime()
     )
     .map((comment) => (
      <ProfileElem
       key={comment.id}
       main={titles?.find((w) => w.id === comment.item_id)!.name}
       id={titles?.find((w) => w.id === comment.item_id)!.id!}
       rating={comment.rating}
       date={comment.created_at}
       type="title"
      />
     ))
   ) : (
    <div className="text-2xl flex gap-3 justify-center items-center">
     <p>Пользователь еще не оценил ни одного титула</p> <Frown size={40} />
    </div>
   )}
  </>
 );
};

export default RatedTitles;
