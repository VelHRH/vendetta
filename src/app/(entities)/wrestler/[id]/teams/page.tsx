import Label from "@/components/ui/Label";
import createClient from "@/lib/supabase-server";
import Link from "next/link";

import { notFound } from "next/navigation";

const WrestlerTeams = async ({ params }: { params: { id: string } }) => {
 const supabase = createClient();

 const { data: teams } = await supabase
  .from("teams")
  .select("*, teams_current_participants(*), teams_former_participants(*)");
 if (!teams) {
  notFound();
 }

 const currentTeams = teams.filter(
  (team) =>
   !team.disband_date &&
   team.teams_current_participants.some(
    (p) => p.wrestler_id === parseFloat(params.id)
   )
 );

 const formerTeams = teams.filter(
  (team) =>
   (team.disband_date &&
    team.teams_current_participants.some(
     (p) => p.wrestler_id === parseFloat(params.id)
    )) ||
   team.teams_former_participants.some(
    (p) => p.wrestler_id === parseFloat(params.id)
   )
 );

 return (
  <>
   {currentTeams.length > 0 && (
    <div className="w-full flex flex-col gap-2 mb-7">
     <Label className="font-semibold mb-2">Действующие команды:</Label>
     {currentTeams.map((team) => (
      <Link
       href={`/team/${team.id}`}
       key={team.id}
       className={`flex items-stretch dark:bg-slate-800 bg-slate-200 px-4 py-3 text-xl w-full rounded-md font-semibold hover:bg-slate-300 hover:dark:bg-slate-700 transition-all`}
      >
       {team.name}
      </Link>
     ))}
    </div>
   )}
   {formerTeams.length > 0 && (
    <div className="w-full flex flex-col gap-2">
     <Label className="font-semibold mb-2">Прошлые команды:</Label>
     {formerTeams.map((team) => (
      <Link
       href={`/team/${team.id}`}
       key={team.id}
       className={`flex items-stretch dark:bg-slate-800 bg-slate-200 px-4 py-3 text-xl w-full rounded-md font-semibold hover:bg-slate-300 hover:dark:bg-slate-700 transition-all`}
      >
       {team.name}
      </Link>
     ))}
    </div>
   )}
  </>
 );
};

export default WrestlerTeams;
