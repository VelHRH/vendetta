import { z } from "zod";

export const MatchValidator = z.object({
 participants: z.array(
  z.object({
   itemName: z.string(),
   items: z.array(
    z.object({
     wrestlerName: z.string(),
     wrestlerId: z.string(),
     wrestlerImage: z.string(),
    })
   ),
  })
 ),
 type: z.string(),
 time: z.string().optional(),
 peculiarity: z.string().optional(),
 winner: z
  .array(
   z.object({
    itemName: z.string(),
    items: z.array(
     z.object({
      wrestlerName: z.string(),
      wrestlerId: z.string(),
      wrestlerImage: z.string(),
     })
    ),
   })
  )
  .optional(),
 show: z.number(),
 tournament: z.number().optional(),
});

export type CreateMatchPayload = z.infer<typeof MatchValidator>;
