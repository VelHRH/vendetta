import createClient from "@/lib/supabase-server";
import Label from "@/components/ui/Label";
import WrestlerElem from "@/components/Row/WrestlerElem";
import { normalizeRating } from "@/lib/utils";
import SortButton from "@/components/SortButton";
import { notFound } from "next/navigation";
import SectionButton from "@/components/SectionButton";

const StrangerWrestlers = async ({
 searchParams,
}: {
 searchParams: { sort: string };
}) => {
 const supabase = createClient();
 const { data: wrestlers } = await supabase
  .from("wrestlers")
  .select("*, comments_wrestlers(*), reigns(*)")
  .eq("isVendetta", false);
 if (!wrestlers) {
  notFound();
 }
 const {
  data: { user },
 } = await supabase.auth.getUser();

 const { data: profile } = await supabase
  .from("users")
  .select("*, comments_wrestlers(*)")
  .eq("id", user?.id)
  .single();
 return (
  <div className="w-full font-semibold">
   <Label className="font-bold mb-5 justify-center">Другие рестлеры</Label>
   <div className="flex gap-2">
    <SectionButton link={`/wrestler`} isMain={1}>
     Vendetta
    </SectionButton>
    <SectionButton link={`/wrestler/stranger`}>Без контракта</SectionButton>
    <SectionButton link={`/wrestler/all`}>Все</SectionButton>
   </div>
   <div className="flex justify-between items-center py-2 mt-5 gap-3">
    <p className="text-center w-1/2">Рестлер</p>
    <p className="text-center flex-1">Последнее шоу</p>
    <p className="text-center w-32">
     <SortButton
      value="rating"
      className={`${
       searchParams.sort !== "your" &&
       searchParams.sort !== "number" &&
       "text-amber-500"
      }`}
     >
      Рейтинг
     </SortButton>
    </p>
    {profile && (
     <p className="text-center w-32">
      <SortButton
       value="your"
       className={`${searchParams.sort === "your" && "text-amber-500"}`}
      >
       Ваш
      </SortButton>
     </p>
    )}
    <p className="text-center w-32">
     <SortButton
      value="number"
      className={`${searchParams.sort === "number" && "text-amber-500"}`}
     >
      Оценок
     </SortButton>
    </p>
   </div>
   {wrestlers
    .sort((a, b) =>
     searchParams.sort === "your"
      ? (profile!.comments_wrestlers.find((c) => c.item_id === b.id)?.rating ||
         -1) -
        (profile!.comments_wrestlers.find((c) => c.item_id === a.id)?.rating ||
         -1)
      : searchParams.sort === "number"
      ? b.comments_wrestlers.length - a.comments_wrestlers.length
      : normalizeRating({
         ratings: b.comments_wrestlers.length,
         avgRating: b.avgRating,
        }) -
        normalizeRating({
         ratings: a.comments_wrestlers.length,
         avgRating: a.avgRating,
        })
    )
    .map((wrestler, index) => (
     <WrestlerElem
      key={index}
      reigns={wrestler.reigns}
      place={index + 1}
      wrestler={wrestler}
      comments={wrestler.comments_wrestlers}
      yourComments={
       !profile
        ? undefined
        : profile?.comments_wrestlers.find((c) => c.item_id === wrestler.id)
           ?.rating || -1
      }
     />
    ))}
  </div>
 );
};

export default StrangerWrestlers;
