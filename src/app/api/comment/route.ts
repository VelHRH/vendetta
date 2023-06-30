import createClient from "@/lib/supabase-server";
import { z } from "zod";
import { CommentValidator } from "@/lib/validators/comment";

export async function POST(req: Request) {
 try {
  const body = await req.json();
  const comment = CommentValidator.parse(body);

  const supabase = createClient();

  const { data, error } = await supabase
   .from(comment.type)
   .select()
   .eq("id", comment.itemId)
   .single();
  if (error) throw error;
  if (data.ratings?.find((c: Json) => c.authorId === comment.authorId))
   throw new Error();

  const { error: commentError } = await supabase.from("comments").insert({
   type: comment.type,
   author: { id: comment.authorId, username: comment.author },
   text: comment.text,
   item_id: comment.itemId,
   rating: comment.rating,
  });
  if (commentError) throw commentError;

  let ratings = data?.ratings!;
  ratings.push({ authorId: comment.authorId, rating: comment.rating });
  const { error: ratingError } = await supabase
   .from(comment.type)
   .update({
    ratings,
    avgRating:
     (data?.avgRating! * (ratings.length - 1) + comment.rating) /
     ratings.length,
   })
   .eq("id", comment.itemId);
  if (ratingError) throw ratingError;
  return new Response("Successful");
 } catch (err) {
  console.log(err);
  if (err instanceof z.ZodError) {
   return new Response(err.message, { status: 422 });
  }
  return new Response("Error while creating", { status: 500 });
 }
}
