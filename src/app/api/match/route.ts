import createClient from "@/lib/supabase-server";
import { z } from "zod";
import { MatchValidator } from "@/lib/validators/match";

export async function POST(req: Request) {
 try {
  const body = await req.json();
  console.log(body);
  const match = MatchValidator.parse(body);

  const supabase = createClient();

  const { data, error } = await supabase
   .from("matches")
   .insert({
    type: match.type,
    time: match.time,
    show: match.show,
    tournament: match.tournament,
    ending: match.ending,
    order: match.order,
   })
   .select()
   .single();
  if (error || !data) throw error.message;

  for (let participant of match.participants) {
   const { error: participantsError } = await supabase
    .from("match_sides")
    .insert({
     match_id: data!.id,
     wrestlers: participant,
    });

   if (participantsError) throw participantsError.message;
  }

  if (match.winner && match.winner.length !== 0) {
   for (let winner of match.winner) {
    const { error: winnerError } = await supabase.from("winners").insert({
     match_id: data!.id,
     winner: winner,
    });
    if (winnerError) throw winnerError.message;
   }
  }

  if (match.title) {
   for (let title of match.title) {
    const { error: titleError } = await supabase.from("challanges").insert({
     match_id: data!.id,
     title_id: title.id,
     title_name: title.name,
    });
    if (titleError) throw titleError.message;
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
  const match = MatchValidator.parse(body);

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  const supabase = createClient();

  const { data, error } = await supabase
   .from("matches")
   .update({
    participants: match.participants,
    type: match.type,
    time: match.time,
    show: match.show,
    tournament: match.tournament,
    ending: match.ending,
    order: match.order,
   })
   .eq("id", parseFloat(id || ""))
   .select();
  if (error) throw error;
  return new Response(data![0].id.toString());
 } catch (err) {
  console.log(err);
  if (err instanceof z.ZodError) {
   return new Response(err.message, { status: 422 });
  }
  return new Response("Error while updating", { status: 500 });
 }
}
