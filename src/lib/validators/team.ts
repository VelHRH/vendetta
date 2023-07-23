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
   id: z.string().min(1),
  })
 ),
 former_participants: z.array(
  z.object({
   wrestlerName: z.string(),
   wrestlerCurName: z.string(),
   id: z.string().min(1),
  })
 ),
});

export type CreateTeamPayload = z.infer<typeof TeamValidator>;
