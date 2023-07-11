import createClient from "@/lib/supabase-server";
import { z } from "zod";
import { MatchValidator } from "@/lib/validators/match";

export async function POST(req: Request) {
 try {
  const body = await req.json();
  const match = MatchValidator.parse(body);

  const supabase = createClient();

  const { data, error } = await supabase
   .from("matches")
   .insert({
    participants: match.participants,
    type: match.type,
    time: match.time,
    show: match.show,
    tournament: match.tournament,
    winner: match.winner,
   })
   .select();
  if (error) throw error;
  return new Response(data![0].id.toString());
 } catch (err) {
  console.log(err);
  if (err instanceof z.ZodError) {
   return new Response(err.message, { status: 422 });
  }
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
    winner: match.winner,
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
