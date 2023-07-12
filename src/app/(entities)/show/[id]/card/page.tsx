import Image from "next/image";
import createClient from "@/lib/supabase-server";
import { notFound } from "next/navigation";
import Label from "@/components/ui/Label";
import InfoElement from "@/components/InfoElement";
import MatchShowElem from "@/components/Row/MatchShowElem";

const ShowCard = async ({ params }: { params: { id: string } }) => {
 const supabase = createClient();
 const { data: show } = await supabase
  .from("shows")
  .select("*, comments_shows(*), matches(*)")
  .eq("id", params.id)
  .single();
 if (!show) {
  notFound();
 }
 return (
  <>
   <div className="w-full flex flex-col gap-5 pb-10 mb-5 border-b-2 border-slate-500">
    {show.show_img && (
     <div className="w-2/3 container mx-auto relative aspect-video">
      <Image
       src={show.show_img}
       fill
       alt="Poster"
       className="object-cover rounded-md"
      />
     </div>
    )}
    <Label size="small">
     Дата загрузки: <InfoElement>{show.upload_date}</InfoElement>
    </Label>
    <Label size="small">
     Тип шоу: <InfoElement>{show.type}</InfoElement>
    </Label>
    <Label size="small">
     Промоушен(ы):{" "}
     {show.promotion!.map((p) => (
      <InfoElement key={p}>{p}</InfoElement>
     ))}
    </Label>
    <Label size="small">
     Город и страна проведения: <InfoElement>{show.location}</InfoElement>
    </Label>
    <Label size="small">
     Арена: <InfoElement>{show.arena}</InfoElement>
    </Label>
    <Label size="small">
     Посещаемость: <InfoElement>{show.attendance}</InfoElement>
    </Label>
   </div>
   <div className="w-full flex flex-col mb-10">
    <Label className="font-bold self-center">Кард шоу:</Label>
    {show.matches.map((match, index) => (
     <MatchShowElem key={match.id} index={index} matchId={match.id} />
    ))}
   </div>
  </>
 );
};

export default ShowCard;
