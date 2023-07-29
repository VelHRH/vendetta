import { z } from "zod";

export const TeamValidator = z.object({
 name: z.string().min(1),
 creation_date: z.string().min(1),
 disband_date: z.string().optional(),
 leader: z.string().optional(),
 current_participants: z.array(
  z.object({
   wrestlerName: z.string(),
   wrestlerCurName: z.string(),
   wrestlerId: z.string().min(1),
  })
 ),
 former_participants: z.array(
  z.object({
   wrestlerName: z.string(),
   wrestlerCurName: z.string(),
   wrestlerId: z.string().min(1),
  })
 ),
 reigns: z.array(
  z
   .array(
    z.object({
     wrestlerName: z.string(),
     wrestlerId: z.number(),
     titleName: z.string(),
     titleCurName: z.string(),
     titleId: z.number(),
     start: z.string(),
     end: z.string(),
    })
   )
   .min(1)
 ),
});

export type CreateTeamPayload = z.infer<typeof TeamValidator>;
