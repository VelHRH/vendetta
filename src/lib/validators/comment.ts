import { z } from "zod";

export const CommentValidator = z.object({
 text: z.string().min(100),
 rating: z.number(),
 author: z.string(),
 type: z.string(),
 itemId: z.number(),
});

export type CreateCommentPayload = z.infer<typeof CommentValidator>;
