import Image from "next/image";
import createClient from "@/lib/supabase-server";
import Label from "@/components/ui/Label";
import { DEFAULT_IMAGE } from "@/config";
import { notFound } from "next/navigation";
import Comment from "@/components/Comment";
import CommentForm from "@/components/Add/CommentForm";
import InfoElement from "@/components/InfoElement";
import RatingBlock from "@/components/RatingBlock";
import { formatDateToDdMmYyyy } from "@/lib/utils";

const WrestlerOverview = async ({ params }: { params: { id: string } }) => {
 const supabase = createClient();
 const { data: wrestler } = await supabase
  .from("wrestlers")
  .select("*, comments_wrestlers(*)")
  .eq("id", params.id)
  .single();
 if (!wrestler) {
  notFound();
 }
 const { data: shows } = await supabase
  .from("shows")
  .select("*, matches(*, comments_matches(*), match_sides(*), winners(*))");
 const matches = [...shows!]
  .flatMap((show) => show.matches)
  .filter(
   (match) =>
    match.match_sides.some((side) =>
     side.wrestlers.some((wrestler) => wrestler.wrestlerId === params.id)
    ) && match.time
  );
 const results = [...shows!]
  .flatMap((show) => show.matches)
  .filter((match) =>
   match.winners.some((winner) =>
    matches?.some((m) => m.id === winner.match_id)
   )
  );

 const wins = [...results!].filter((result) =>
  result.winners.some((winner) =>
   winner.winner.some((wrestler) => wrestler.wrestlerId === params.id)
  )
 );

 const {
  data: { user },
 } = await supabase.auth.getUser();

 const { data: profile } = await supabase
  .from("users")
  .select()
  .eq("id", user?.id)
  .single();

 const loggedUserComment = user
  ? wrestler.comments_wrestlers.find((com) => com.author === user.id)
  : undefined;

 const now = new Date();

 const beginCareer = new Date(wrestler.career_start?.toString() || "");
 const experience = new Date(
  new Date(now.getFullYear() + 4, now.getMonth(), now.getDate()).getTime() -
   beginCareer.getTime()
 );

 const birthday = new Date(wrestler.born?.toString() || "");

 const age = new Date(
  new Date(now.getFullYear() + 4, now.getMonth(), now.getDate()).getTime() -
   birthday.getTime()
 );

 return (
  <>
   <div className="w-full flex gap-5">
    <div className="h-80 w-80 aspect-square relative">
     <Image
      alt="Wrestler image"
      src={wrestler.wrestler_img || DEFAULT_IMAGE}
      fill
      className="object-cover rounded-md"
     />
    </div>
    <div className="flex-1 p-3 flex flex-col gap-10">
     <div className="flex flex-col pb-10 gap-5 border-b-2 border-slate-500 w-full items-start">
      <Label size="medium" className="font-bold mb-3 pb-3">
       Информация о персонаже:
      </Label>
      {wrestler.nickname && (
       <Label size="small">
        Также извест(ен/на) как:{" "}
        {wrestler.nickname.map((t) => (
         <InfoElement key={t}>{t}</InfoElement>
        ))}
       </Label>
      )}

      <Label size="small">
       Всего матчей: <InfoElement>{matches?.length}</InfoElement>
      </Label>

      {wins.length > 0 && (
       <Label size="small">
        Победы:{" "}
        <InfoElement>
         {wins.length} ({((wins.length * 100) / matches.length).toFixed(2)} %)
        </InfoElement>
       </Label>
      )}
      {matches!.length - results!.length > 0 && (
       <Label size="small">
        Ничьи:{" "}
        <InfoElement>
         {matches!.length - results!.length} (
         {(
          ((matches!.length - results!.length) * 100) /
          matches.length
         ).toFixed(2)}{" "}
         %)
        </InfoElement>
       </Label>
      )}
      {results!.length - wins.length > 0 && (
       <Label size="small">
        Поражения:{" "}
        <InfoElement>
         {results!.length - wins.length} (
         {(((results!.length - wins.length) * 100) / matches.length).toFixed(2)}{" "}
         %)
        </InfoElement>
       </Label>
      )}
      {wrestler.career_start && (
       <>
        <Label size="small">
         Начало карьеры:{" "}
         <InfoElement>{formatDateToDdMmYyyy(beginCareer)}</InfoElement>
        </Label>
        <Label size="small">
         Опыт:{" "}
         <InfoElement>
          {wrestler.age - Math.abs(age.getUTCFullYear()) + Math.abs(experience.getUTCFullYear())} years
         </InfoElement>
        </Label>
       </>
      )}
      <Label size="small">
       Статус:{" "}
       <InfoElement>
        {wrestler.isVendetta ? "подписан Vendetta" : "на правах фрилансера"}
       </InfoElement>
      </Label>
      <Label size="small" className="flex gap-2 items-center">
       Тренеры:{" "}
       {wrestler.trainer?.map((t) => (
        <InfoElement key={t}>{t}</InfoElement>
       ))}
      </Label>
      <Label size="small" className="flex gap-2 items-center">
       Рестлинг-стили:{" "}
       {wrestler.style?.map((s) => (
        <InfoElement key={s}>{s}</InfoElement>
       ))}
      </Label>
     </div>
     <div className="flex flex-col pb-10 gap-5 items-start">
      <Label size="medium" className="font-bold mb-3 pb-3">
       Персональная информация:
      </Label>
      <Label size="small">
       Настоящее имя: <InfoElement>{wrestler.real_name}</InfoElement>
      </Label>
      <Label size="small">
       Пол: <InfoElement>{wrestler.sex}</InfoElement>
      </Label>
      {wrestler.born && (
       <>
        <Label size="small">
         Возраст:{" "}
         <InfoElement>
          {wrestler.age} years
         </InfoElement>
        </Label>
        <Label size="small">
         День рождения: <InfoElement>{wrestler.born}</InfoElement>
        </Label>
       </>
      )}
      <Label size="small">
       Место рождения:{" "}
       <InfoElement>
        {wrestler.city}, {wrestler.country}
       </InfoElement>
      </Label>
      <Label size="small">
       Рост: <InfoElement>{wrestler.height} cm</InfoElement>
      </Label>
      <Label size="small">
       Вес: <InfoElement>{wrestler.weight} kg</InfoElement>
      </Label>
     </div>
    </div>
    <RatingBlock
     comments={wrestler.comments_wrestlers}
     avgRating={wrestler.avgRating}
    />
   </div>

   {user && (
    <>
     <Label className="font-bold self-start">Your comment:</Label>
     {!loggedUserComment ? (
      <CommentForm
       type="wrestlers"
       itemId={parseFloat(params.id)}
       authorId={profile!.id}
       author={profile!.username || ""}
      />
     ) : (
      <Comment
       authorId={profile!.id}
       rating={loggedUserComment.rating}
       date={loggedUserComment.created_at!.toString()}
       text={loggedUserComment.text}
       id={loggedUserComment.id}
       type="wrestlers"
      />
     )}
    </>
   )}

   <Label className="font-bold self-start mt-10">Comments:</Label>
   <div className="flex flex-col gap-4 w-full mt-2 mb-5">
    {wrestler.comments_wrestlers.length !== 0
     ? wrestler.comments_wrestlers
        .sort((a, b) => b.created_at.localeCompare(a.created_at))
        .map((comment) => (
         <Comment
          key={comment.id}
          authorId={comment.author || ""}
          rating={comment.rating}
          date={comment.created_at?.toString() || ""}
          text={comment.text}
         />
        ))
     : "No comments here yet."}
   </div>
  </>
 );
};

export default WrestlerOverview;
