import createClient from "@/lib/supabase-server";
import { z } from "zod";

import { TitleValidator } from "@/lib/validators/title";

export async function POST(req: Request) {
 try {
  const body = await req.json();
  const title = TitleValidator.parse(body);

  const supabase = createClient();

  const { data, error } = await supabase
   .from("titles")
   .insert({
    name: title.name,
    start: title.start,
    promotion: title.promotion || "Vendetta Federation",
    type: title.type,
    isActive: title.isActive,
    end: title.end,
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
  const title = TitleValidator.parse(body);

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  const supabase = createClient();

  const { data, error } = await supabase
   .from("titles")
   .update({
    name: title.name,
    start: title.start,
    promotion: title.promotion || "Vendetta Federation",
    type: title.type,
    isActive: title.isActive,
    end: title.end,
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
