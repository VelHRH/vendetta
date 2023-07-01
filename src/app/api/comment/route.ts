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
    ratings: ratings,
    avgRating:
     (data?.avgRating! * (ratings.length - 1) + comment.rating) /
     ratings.length,
   })
   .eq("id", comment.itemId);
  if (ratingError) throw ratingError;
  return new Response("Success");
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
  const supabase = createClient();

  const { data: comment, error: commentError } = await supabase
   .from("comments")
   .select()
   .eq("id", body.id)
   .single();
  if (!comment || commentError) throw "Error with getting this comment";

  const { data, error } = await supabase
   .from(comment.type)
   .select()
   .eq("id", comment.item_id)
   .single();
  if (!data || error) throw "Error with getting rated item";

  data.ratings![
   data.ratings!.findIndex((d: any) => d.authorId === comment.author!.id)
  ].rating = body.rating;
  const { error: updateItemError } = await supabase
   .from(comment.type)
   .update({
    avgRating:
     data.ratings?.length! !== 0
      ? (data.avgRating * data.ratings?.length! -
         comment.rating +
         body.rating) /
        data.ratings?.length!
      : 0,
    ratings: data.ratings!,
   })
   .eq("id", comment.item_id);
  if (updateItemError) throw "Update item error";
  const { error: updateError } = await supabase
   .from("comments")
   .update({
    rating: body.rating,
    text: body.text,
   })
   .eq("id", body.id);
  if (updateError) throw "Update comment error";

  return new Response("Success");
 } catch (err) {
  console.log(err);
  if (err instanceof z.ZodError) {
   return new Response(err.message, { status: 422 });
  }
  return new Response("Error while updating", { status: 500 });
 }
}

export async function PATCH(req: Request) {
 try {
  const body = await req.json();
  const supabase = createClient();
  const { data: comment, error: commentError } = await supabase
   .from("comments")
   .select()
   .eq("id", body.id)
   .single();
  if (!comment || commentError) throw "Error with getting this comment";

  const { data, error } = await supabase
   .from(comment.type)
   .select()
   .eq("id", comment.item_id)
   .single();
  if (!data || error) throw "Error with getting rated item";

  data.ratings!.splice(
   data.ratings!.findIndex((d: any) => d.authorId === comment.author!.id),
   1
  );
  const { error: updateError } = await supabase
   .from(comment.type)
   .update({
    avgRating:
     data.ratings?.length! !== 0
      ? (data.avgRating * (data.ratings?.length! + 1) - comment.rating) /
        data.ratings?.length!
      : 0,
    ratings: data.ratings!,
   })
   .eq("id", comment.item_id);
  if (updateError) throw "Update item error";

  const { error: deleteError } = await supabase
   .from("comments")
   .delete()
   .eq("id", body.id);
  if (deleteError) throw "Delete comment error";

  return new Response("Success");
 } catch (err) {
  console.log(err);
  return new Response("Error while creating", { status: 500 });
 }
}
