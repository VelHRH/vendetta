import { z } from "zod";

export const TournamentValidator = z.object({
 name: z.string().min(1),
 description: z.string().min(1),
 start: z.string().optional(),
 end: z.string().optional(),
 play_off_participants: z.array(
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
 block_participants: z.array(z.string()).optional(),
 type: z.string(),
});

export type CreateTournamentPayload = z.infer<typeof TournamentValidator>;
