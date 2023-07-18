import { z } from "zod";

export const MatchValidator = z.object({
 participants: z.array(
  z.array(
   z.object({
    wrestlerName: z.string(),
    wrestlerCurName: z.string(),
    wrestlerId: z.string().min(1),
    wrestlerImage: z.string(),
    teamName: z.string().optional(),
    teamId: z.string().optional(),
   })
  )
 ),
 type: z.string().optional(),
 time: z.string().optional(),
 peculiarity: z.string().optional(),
 winner: z
  .array(
   z.array(
    z.object({
     wrestlerName: z.string(),
     wrestlerCurName: z.string(),
     wrestlerId: z.string().min(1),
     wrestlerImage: z.string(),
     teamName: z.string().optional(),
     teamId: z.string().optional(),
    })
   )
  )
  .optional(),
 title: z.array(z.object({ id: z.number(), name: z.string() })).optional(),
 show: z.number().min(1),
 ending: z.string().optional(),
 tournament: z.number().min(1).optional(),
 order: z.number(),
});

export type CreateMatchPayload = z.infer<typeof MatchValidator>;
