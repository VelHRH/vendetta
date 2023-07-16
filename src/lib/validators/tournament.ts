import { z } from "zod";

export const TournamentValidator = z.object({
 name: z.string().min(1),
 description: z.string().min(1),
 start: z.string().optional(),
 end: z.string().optional(),
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
 play_off_participants: z.array(
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
 block_participants: z.array(z.string()).optional(),
 type: z.string(),
});

export type CreateTournamentPayload = z.infer<typeof TournamentValidator>;
