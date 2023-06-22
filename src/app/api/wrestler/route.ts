import { WrestlerValidator } from "@/lib/validators/wrestler";
import createClient from "@/lib/supabase-server";
import { z } from "zod";

export async function POST(req: Request) {
 try {
  const body = await req.json();
  const wrestler = WrestlerValidator.parse(body);

  const supabase = createClient();

  const { data, error } = await supabase
   .from("wrestlers")
   .insert({
    name: wrestler.name,
    sex: wrestler.sex,
    real_name: wrestler.realname,
    trainer: wrestler.trainers,
    style: wrestler.styles,
    weight: wrestler.weight,
    height: wrestler.height,
    born: wrestler.birth,
    country: wrestler.country,
    city: wrestler.city,
    moves: wrestler.moves,
    career_start: wrestler.careerstart,
   })
   .select();
  if (error) throw error;
  console.log(data);
  return new Response(data![0].id.toString());
 } catch (err) {
  if (err instanceof z.ZodError) {
   return new Response(err.message, { status: 422 });
  }
  return new Response("Error while creating", { status: 500 });
 }
}
