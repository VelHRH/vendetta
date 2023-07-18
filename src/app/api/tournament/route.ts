import createClient from "@/lib/supabase-server";
import { z } from "zod";
import { TournamentValidator } from "@/lib/validators/tournament";

export async function POST(req: Request) {
 try {
  const body = await req.json();
  const tournament = TournamentValidator.parse(body);

  const supabase = createClient();

  const { data, error } = await supabase
   .from("tournaments")
   .insert({
    name: tournament.name,
    winner: tournament.winner,
    description: tournament.description,
    start: tournament.start === "" ? null : tournament.start,
    end: tournament.end === "" ? null : tournament.end,
    play_off_participants: tournament.play_off_participants,
    type: tournament.type,
    block_participants: tournament.block_participants,
    blocks_number: tournament.blocks_number,
   })
   .select();
  if (error) throw error.message;
  return new Response(data![0].id.toString());
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
  const tournament = TournamentValidator.parse(body);

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  const supabase = createClient();

  const { data, error } = await supabase
   .from("tournaments")
   .update({
    name: tournament.name,
    winner: tournament.winner,
    description: tournament.description,
    start: tournament.start === "" ? null : tournament.start,
    end: tournament.end === "" ? null : tournament.end,
    play_off_participants: tournament.play_off_participants,
   })
   .eq("id", id)
   .select();
  if (error) throw error.message;
  return new Response(data![0].id.toString());
 } catch (err) {
  console.log(err);
  if (err instanceof z.ZodError) {
   return new Response(err.message, { status: 422 });
  }
  if (typeof err === "string") return new Response(err, { status: 400 });
  return new Response("Error while updating", { status: 500 });
 }
}
