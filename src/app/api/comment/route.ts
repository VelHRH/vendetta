import createClient from "@/lib/supabase-server";
import { z } from "zod";
import { CommentValidator } from "@/lib/validators/comment";

export async function POST(req: Request) {
 try {
  const body = await req.json();
  const comment = CommentValidator.parse(body);

  const supabase = createClient();

  const { data: comments, error: getCommentsError } = await supabase
   .from(`comments_${comment.type}`)
   .select()
   .eq("item_id", comment.itemId);
  if (getCommentsError) throw getCommentsError;
  if (comments!.find((c) => c.author === comment.authorId))
   throw "The item is already rated by you";

  const { data: item } = await supabase
   .from(comment.type)
   .select()
   .eq("id", comment.itemId)
   .single();

  const { error: commentError } = await supabase
   .from(`comments_${comment.type}`)
   .insert({
    author: comment.authorId,
    text: comment.text,
    item_id: comment.itemId,
    rating: comment.rating,
   });
  if (commentError) throw commentError;

  const { error: ratingError } = await supabase
   .from(comment.type)
   .update({
    avgRating:
     (item!.avgRating * comments.length + comment.rating) /
     (comments.length + 1),
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
   .from(`comments_${body.type}`)
   .select()
   .eq("id", body.id)
   .single();
  if (!comment || commentError) throw "Error with getting this comment";

  const { data: comments } = await supabase
   .from(`comments_${body.type}`)
   .select()
   .eq("item_id", comment.item_id);

  const { data: item, error } = await supabase
   .from(body.type)
   .select()
   .eq("id", comment.item_id)
   .single();
  if (!item || error) throw "Error with getting rated item";

  const { error: updateItemError } = await supabase
   .from(body.type)
   .update({
    avgRating:
     (item.avgRating * comments!.length - comment.rating + body.rating) /
      comments!.length || 0,
   })
   .eq("id", comment.item_id);
  if (updateItemError) throw "Update item error";
  const { error: updateError } = await supabase
   .from(`comments_${body.type}`)
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
   .from(`comments_${body.type}`)
   .select()
   .eq("id", body.id)
   .single();
  if (!comment || commentError) throw "Error with getting this comment";

  const { data: comments } = await supabase
   .from(`comments_${body.type}`)
   .select()
   .eq("item_id", comment.item_id);

  const { data: item, error } = await supabase
   .from(body.type)
   .select()
   .eq("id", comment.item_id)
   .single();
  if (!item || error) throw "Error with getting rated item";

  const { error: updateItemError } = await supabase
   .from(body.type)
   .update({
    avgRating:
     (item.avgRating * comments!.length - comment.rating) /
      (comments!.length - 1) || 0,
   })
   .eq("id", comment.item_id);
  if (updateItemError) throw "Update item error";
  const { error: deleteError } = await supabase
   .from(`comments_${body.type}`)
   .delete()
   .eq("id", body.id);
  if (deleteError) throw "Delete comment error";

  return new Response("Success");
 } catch (err) {
  console.log(err);
  return new Response("Error while deleating", { status: 500 });
 }
}
