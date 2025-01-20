import type { FastifySchema } from "fastify";
import { z } from "zod";

const schema = z.object({
    isCompleted: z.enum(["true", "false"]).optional()
});

export type paramsObjectiveSchema = z.infer<typeof schema>;
export const paramsObjectiveFSchema: FastifySchema = { params: schema };
