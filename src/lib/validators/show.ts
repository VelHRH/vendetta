import { z } from "zod";

export const ShowValidator = z.object({
 name: z.string().min(1),
 date: z.string(),
 promotions: z.array(z.string()),
 showType: z.string(),
 location: z.string(),
 arena: z.string(),
 attendance: z.number().optional(),
});

export type CreateShowPayload = z.infer<typeof ShowValidator>;
