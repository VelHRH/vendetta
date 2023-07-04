import createClient from "@/lib/supabase-server";
import { z } from "zod";
import { ShowValidator } from "@/lib/validators/show";

export async function POST(req: Request) {
 try {
  const body = await req.json();
  const show = ShowValidator.parse(body);

  const supabase = createClient();

  const { data, error } = await supabase
   .from("shows")
   .insert({
    name: show.name,
    upload_date: show.date === "" ? null : show.date,
    promotion: show.promotions,
    type: show.showType,
    location: show.location,
    arena: show.arena,
    attendance: show.attendance,
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
