import createClient from "@/lib/supabase-server";
import { z } from "zod";
import { CommentValidator } from "@/lib/validators/comment";

export async function POST(req: Request) {
 try {
  const body = await req.json();
  const comment = CommentValidator.parse(body);

  const supabase = createClient();

  const { error } = await supabase.from("comments").insert({
   type: comment.type,
   author: comment.author,
   text: comment.text,
   item_id: comment.itemId,
   rating: comment.rating,
  });
  if (error) throw error;
  return new Response("Successful");
 } catch (err) {
  console.log(err);
  if (err instanceof z.ZodError) {
   return new Response(err.message, { status: 422 });
  }
  return new Response("Error while creating", { status: 500 });
 }
}
