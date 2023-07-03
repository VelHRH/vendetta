import { z } from "zod";

export const WrestlerValidator = z.object({
 name: z.string().min(1),
 realname: z.string(),
 sex: z.string(),
 height: z.number(),
 weight: z.number(),
 birth: z.string(),
 city: z.string(),
 country: z.string(),
 isVendetta: z.boolean().optional(),
 styles: z.array(z.string()),
 trainers: z.array(z.string()),
 nicknames: z.array(z.string()),
 careerstart: z.string(),
 moves: z.array(z.string()),
 wrestler_img: z.string().optional(),
});

export type CreateWrestlerPayload = z.infer<typeof WrestlerValidator>;
