import createClient from "@/lib/supabase-server";
import { z } from "zod";
import { TournamentValidator } from "@/lib/validators/tournament";

export async function POST(req: Request) {
 try {
  const body = await req.json();
  const tournament = TournamentValidator.parse(body);

  const supabase = createClient();

  if (
   (tournament.type === "Обычный" &&
    tournament.play_off_participants.find((item) =>
     item.items.some((subItem) =>
      Object.values(subItem).some((value) => value === "")
     )
    )) ||
   tournament.play_off_participants.find((item) => item.itemName === "")
  ) {
   throw "There are empty fields";
  }

  if (
   tournament.play_off_participants.some(
    (item, index, array) =>
     array.findIndex((obj) => obj.itemName === item.itemName) !== index
   )
  ) {
   throw "There are duplicate names";
  }

  const { data, error } = await supabase
   .from("tournaments")
   .insert({
    name: tournament.name,
    description: tournament.description,
    start: tournament.start === "" ? null : tournament.start,
    end: tournament.end === "" ? null : tournament.end,
    play_off_participants: tournament.play_off_participants,
    type: tournament.type,
    block_participants:
     tournament.block_participants === undefined ? null : null,
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
