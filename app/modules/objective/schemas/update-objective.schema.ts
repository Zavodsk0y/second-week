import type { FastifySchema } from "fastify";
import { z } from "zod";
import { uuidFSchema } from "../../../common/schemas/uuid.schema";

const schema = z.object({
    title: z.string().min(1).max(127).optional(),
    description: z.string().nullable().optional(),
    notifyAt: z.string().datetime().optional(),
    isCompleted: z.boolean().optional()
});

export type updateObjectiveSchema = z.infer<typeof schema>;
export const updateObjectiveFSchema: FastifySchema = { body: schema, params: uuidFSchema.params };
