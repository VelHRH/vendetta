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
 type: z.string().optional(),
 time: z.string().optional(),
 peculiarity: z.string().optional(),
 winner: z.array(z.string().min(1)).min(1),
 show: z.number(),
 ending: z.string(),
 tournament: z.number().optional(),
 order: z.number(),
});

export type CreateMatchPayload = z.infer<typeof MatchValidator>;
