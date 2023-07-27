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
    born: wrestler.birth === "" ? "01-01-2000" : wrestler.birth,
    country: wrestler.country,
    city: wrestler.city,
    moves: wrestler.moves,
    isVendetta: wrestler.isVendetta,
    wrestler_img: wrestler.wrestler_img,
    career_start:
     wrestler.careerstart === "" ? "01-01-2000" : wrestler.careerstart,
   })
   .select();
  if (error) throw error;
  if (wrestler.reigns.length > 0) {
   for (let reign of wrestler.reigns) {
    const { error: reignError } = await supabase.from("reigns").insert({
     wrestler_id: data![0].id,
     title_id: reign.titleId,
     title_name: reign.titleCurName,
     wrestler_name: reign.wrestlerName,
     start: reign.start,
     end: reign.end.length > 0 ? reign.end : null,
    });
    if (reignError) throw reignError;
   }
  }
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
  const wrestler = WrestlerValidator.parse(body);

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  const supabase = createClient();

  const { data, error } = await supabase
   .from("wrestlers")
   .update({
    name: wrestler.name,
    sex: wrestler.sex,
    real_name: wrestler.realname,
    trainer: wrestler.trainers,
    style: wrestler.styles,
    weight: wrestler.weight,
    height: wrestler.height,
    born: wrestler.birth === "" ? "01-01-2000" : wrestler.birth,
    country: wrestler.country,
    city: wrestler.city,
    moves: wrestler.moves,
    isVendetta: wrestler.isVendetta,
    wrestler_img: wrestler.wrestler_img,
    career_start:
     wrestler.careerstart === "" ? "01-01-2000" : wrestler.careerstart,
   })
   .eq("id", parseFloat(id || ""))
   .select();

  await supabase.from("reigns").delete().eq("wrestler_id", data![0].id);
  if (wrestler.reigns.length > 0) {
   for (let reign of wrestler.reigns) {
    const { error: reignError } = await supabase.from("reigns").insert({
     wrestler_id: data![0].id,
     title_id: reign.titleId,
     title_name: reign.titleCurName,
     wrestler_name: reign.wrestlerName,
     start: reign.start,
     end: reign.end.length > 0 ? reign.end : null,
    });
    if (reignError) throw reignError;
   }
  }
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
