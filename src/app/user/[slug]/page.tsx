import Label from "@/components/ui/Label";
import Tooltip from "@/components/ui/Tooltip";
import createClient from "@/lib/supabase-server";
import {
 avgShowByMatches,
 avgTeamByMatches,
 avgWrestlerByMatches,
} from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

const RatedMatches = async ({ params }: { params: { slug: string } }) => {
 const supabase = createClient();

 const { data: wrestlers } = await supabase.from("wrestlers").select();
 const { data: teams } = await supabase.from("teams").select();
 const { data: shows } = await supabase.from("shows").select();
 const { data: profile } = await supabase
  .from("users")
  .select()
  .eq("username", params.slug.replace(/%20/g, " "))
  .single();

 if (!profile) {
  notFound();
 }

 const { data: matches } = await supabase
  .from("matches")
  .select("*, comments_matches(*), match_sides(*)");

 return (
  <div className="w-full flex flex-col gap-4">
   <div className="flex flex-col gap-4 p-7 border-[3px] border-slate-300 dark:border-slate-700 rounded-md">
    <div className="flex gap-5 items-center">
     <Label size="medium" className="font-semibold">
      &quot;Best Bout&quot; рестлеры {profile.username}
     </Label>
     <Tooltip>
      ТОП-5 рестлеров по средней оценке пользователя за матч с минимум 5 матчей
     </Tooltip>
    </div>
    <div className="grid grid-cols-5 gap-4">
     {wrestlers!
      .filter(
       (w) =>
        matches!.filter((match: any) =>
         match.match_sides.some((side: any) =>
          side.wrestlers.some(
           (wrestler: any) => wrestler.wrestlerId === w.id.toString()
          )
         )
        ).length >= 5
      )
      .sort(
       (a, b) =>
        avgWrestlerByMatches(matches, b.id.toString(), profile) -
        avgWrestlerByMatches(matches, a.id.toString(), profile)
      )
      .slice(0, 5)
      .map((wrestler) => (
       <Link
        href={`/wrestler/${wrestler.id}`}
        key={wrestler.id}
        className={`rounded-md aspect-square cursor-pointer relative flex flex-col justify-center`}
       >
        <div className="text-center font-bold text-md lg:text-xl">
         {avgWrestlerByMatches(matches, wrestler.id.toString(), profile)}
        </div>
        <Image
         src={wrestlers!.find((w) => w.id === wrestler.id)!.wrestler_img!}
         alt="Wrestler"
         fill
         className="object-cover hover:opacity-0 duration-300"
        />
       </Link>
      ))}
    </div>
   </div>

   <div className="flex flex-col gap-3 p-7 border-[3px] border-slate-300 dark:border-slate-700 rounded-md">
    <div className="flex gap-5 items-center">
     <Label size="medium" className="font-semibold">
      &quot;Best Bout&quot; шоу {profile.username}
     </Label>
     <Tooltip>
      ТОП-3 шоу по средней оценке пользователя за матч с минимум 3 матчами
     </Tooltip>
    </div>
    <div className="grid grid-cols-3 gap-4">
     {shows!
      .filter(
       (s) => matches!.filter((match: any) => match.show === s.id).length >= 3
      )
      .sort(
       (a, b) =>
        avgShowByMatches(matches, b.id, profile) -
        avgShowByMatches(matches, a.id, profile)
      )
      .slice(0, 3)
      .map((show) => (
       <Link
        href={`/show/${show.id}`}
        key={show.id}
        className={`rounded-md aspect-video cursor-pointer relative flex flex-col justify-center`}
       >
        <div className="text-center font-bold text-md lg:text-xl">
         {avgShowByMatches(matches, show.id, profile)}
        </div>
        <Image
         src={shows!.find((w) => w.id === show.id)!.show_img!}
         alt="Show"
         fill
         className="object-cover hover:opacity-0 duration-300"
        />
       </Link>
      ))}
    </div>
   </div>

   <div className="flex flex-col gap-4 p-7 border-[3px] border-slate-300 dark:border-slate-700 rounded-md">
    <div className="flex gap-5 items-center">
     <Label size="medium" className="font-semibold">
      &quot;Best Bout&quot; команды {profile.username}
     </Label>
     <Tooltip>
      ТОП-3 команды по средней оценке пользователя за матч с минимум 3 матчами
     </Tooltip>
    </div>
    <div className="grid grid-cols-3 gap-4">
     {teams!
      .filter(
       (t) =>
        matches!.filter((match: any) =>
         match.match_sides.some((side: any) =>
          side.wrestlers.some(
           (wrestler: any) => wrestler.teamId === t.id.toString()
          )
         )
        ).length >= 3
      )
      .sort(
       (a, b) =>
        avgTeamByMatches(matches, b.id.toString(), profile) -
        avgTeamByMatches(matches, a.id.toString(), profile)
      )
      .slice(0, 3)
      .map((team) => (
       <Link
        href={`/team/${team.id}`}
        key={team.id}
        className={`rounded-md aspect-video cursor-pointer relative flex flex-col justify-center`}
       >
        <div className="text-center font-bold text-md lg:text-xl">
         {avgTeamByMatches(matches, team.id.toString(), profile)}
        </div>
        <Image
         src={teams!.find((t) => t.id === team.id)!.img_url!}
         alt="Team"
         fill
         className="object-cover hover:opacity-0 duration-300"
        />
       </Link>
      ))}
    </div>
   </div>
  </div>
 );
};

export default RatedMatches;
