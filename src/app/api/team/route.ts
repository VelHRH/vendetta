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
    history: team.history,
    img_url: team.img_url,
   })
   .select()
   .single();
  if (error || !data) throw error.message;

  for (let participant of team.current_participants) {
   const { error: participantsError } = await supabase
    .from("teams_current_participants")
    .insert({
     team_id: data!.id,
     wrestler_id: parseFloat(participant.wrestlerId),
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
     wrestler_id: parseFloat(participant.wrestlerId),
     wrestler_name: participant.wrestlerCurName,
    });

   if (participantsError) throw participantsError.message;
  }

  for (let reign of team.reigns) {
   const titleInfo = reign.find((champion) => champion.titleId !== 0)!;
   for (let champion of reign) {
    if (champion.wrestlerId !== 0) {
     const { error: reignError } = await supabase.from("reigns").insert({
      team_id: data!.id,
      team_name: team.name,
      wrestler_id: champion.wrestlerId,
      title_id: titleInfo.titleId,
      title_name: titleInfo.titleCurName,
      wrestler_name: champion.wrestlerName,
      start: titleInfo.start,
      end: titleInfo.end.length > 0 ? titleInfo.end : null,
     });
     if (reignError) throw reignError;
    }
   }
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

export async function PUT(req: Request) {
 try {
  const body = await req.json();
  const team = TeamValidator.parse(body);

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  const supabase = createClient();

  const { data, error } = await supabase
   .from("teams")
   .update({
    name: team.name,
    creation_date: team.creation_date,
    disband_date: team.disband_date,
    history: team.history,
    img_url: team.img_url,
   })
   .eq("id", id)
   .select()
   .single();
  if (error || !data) throw error.message;

  await supabase
   .from("teams_current_participants")
   .delete()
   .eq("team_id", data!.id);
  await supabase
   .from("teams_former_participants")
   .delete()
   .eq("team_id", data!.id);

  for (let participant of team.current_participants) {
   const { error: participantsError } = await supabase
    .from("teams_current_participants")
    .insert({
     team_id: data!.id,
     wrestler_id: parseFloat(participant.wrestlerId),
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
     wrestler_id: parseFloat(participant.wrestlerId),
     wrestler_name: participant.wrestlerCurName,
    });

   if (participantsError) throw participantsError.message;
  }

  for (let reign of team.reigns) {
   const titleInfo = reign.find((champion) => champion.titleId !== 0)!;
   for (let champion of reign) {
    if (champion.wrestlerId !== 0) {
     const { error: reignError } = await supabase.from("reigns").insert({
      team_id: data!.id,
      team_name: team.name,
      wrestler_id: champion.wrestlerId,
      title_id: titleInfo.titleId,
      title_name: titleInfo.titleCurName,
      wrestler_name: champion.wrestlerName,
      start: titleInfo.start,
      end: titleInfo.end.length > 0 ? titleInfo.end : null,
     });
     if (reignError) throw reignError;
    }
   }
  }

  return new Response(data!.id.toString());
 } catch (err) {
  console.log(err);
  if (err instanceof z.ZodError) {
   return new Response(err.message, { status: 422 });
  }
  if (typeof err === "string") return new Response(err, { status: 400 });
  return new Response("Error while updating", { status: 500 });
 }
}
