import type { FastifySchema } from "fastify";
import { z } from "zod";

const schema = z.object({
    title: z.string().min(1).max(127),
    description: z.string().nullable(),
    creatorId: z.string().uuid(),
    notifyAt: z.string().datetime(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
    isCompleted: z.boolean()
});

export type createObjectiveResponseSchema = z.infer<typeof schema>;
export const createObjectiveResponseFSchema: FastifySchema = { body: schema };
