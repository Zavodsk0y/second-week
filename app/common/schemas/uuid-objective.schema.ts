import { FastifySchema } from "fastify";
import { z } from "zod";

const schema = z.object({
    id: z.string().uuid()
});

export type uuidObjectiveSchema = z.TypeOf<typeof schema>;
export const uuidObjectiveFSchema: FastifySchema = { params: schema };
