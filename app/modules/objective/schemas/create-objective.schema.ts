import type { FastifySchema } from "fastify";
import { z } from "zod";

const schema = z.object({
    title: z.string().min(1).max(127),
    description: z.string().nullable().optional(),
    notifyAt: z.string().datetime().nullable().optional()
});

export type createObjectiveSchema = z.infer<typeof schema>;
export const createObjectiveFSchema: FastifySchema = { body: schema };

export interface ICreateObjectiveFSchema {
    Body: createObjectiveSchema;
}
