import { z } from "zod";

export const TitleValidator = z.object({
 name: z.string().min(1),
 promotion: z.string().optional(),
 type: z.string().min(1),
 end: z.string().optional(),
 isActive: z.boolean(),
 start: z.string().min(1),
});

export type CreateTitlePayload = z.infer<typeof TitleValidator>;
