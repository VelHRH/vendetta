import { z } from 'zod';

export const PollValidator = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  options: z.array(
    z.object({
      name: z.string().min(1),
      url: z.string().optional(),
      voters: z.array(z.string()),
    }),
  ),
  isClosed: z.boolean().optional(),
});

export type CreatePollPayload = z.infer<typeof PollValidator>;
