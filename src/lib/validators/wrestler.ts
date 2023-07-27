import { z } from "zod";

export const WrestlerValidator = z.object({
 name: z.string().min(1),
 realname: z.string(),
 sex: z.string(),
 height: z.number(),
 weight: z.number(),
 birth: z.string().optional(),
 city: z.string(),
 country: z.string(),
 isVendetta: z.boolean().optional(),
 styles: z.array(z.string()),
 trainers: z.array(z.string()),
 nicknames: z.array(z.string()),
 careerstart: z.string().optional(),
 moves: z.array(z.string()),
 wrestler_img: z.string().optional(),
 reigns: z.array(
  z.object({
   wrestlerName: z.string().min(1),
   titleName: z.string(),
   titleCurName: z.string().min(1),
   titleId: z.number(),
   start: z.string().min(1),
   end: z.string(),
  })
 ),
});

export type CreateWrestlerPayload = z.infer<typeof WrestlerValidator>;
