import createClient from "@/lib/supabase-server";
import { z } from "zod";
import { TeamValidator } from "@/lib/validators/team";

export async function POST(req: Request) {
 try {
  const body = await req.json();
  const team = TeamValidator.parse(body);

  const supabase = createClient();

  const { data, error } = await supabase
   .from("teams")
   .insert({
    name: team.name,
    creation_date: team.creation_date,
    disband_date: team.disband_date,
   })
   .select()
   .single();
  if (error || !data) throw error.message;

  for (let participant of team.current_participants) {
   const { error: participantsError } = await supabase
    .from("teams_current_participants")
    .insert({
     team_id: data!.id,
     wrestler_id: parseFloat(participant.id),
     wrestler_name: participant.wrestlerCurName,
     isLeader: participant.wrestlerCurName === team.leader,
    });

   if (participantsError) throw participantsError.message;
  }

  for (let participant of team.former_participants) {
   const { error: participantsError } = await supabase
    .from("teams_former_participants")
    .insert({
     team_id: data!.id,
     wrestler_id: parseFloat(participant.id),
     wrestler_name: participant.wrestlerCurName,
    });

   if (participantsError) throw participantsError.message;
  }

  return new Response(data!.id.toString());
 } catch (err) {
  console.log(err);
  if (err instanceof z.ZodError) {
   return new Response(err.message, { status: 422 });
  }
  if (typeof err === "string") return new Response(err, { status: 400 });
  return new Response("Error while creating", { status: 500 });
 }
}
