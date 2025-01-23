import { FastifySchema } from "fastify";
import { z } from "zod";

const schema = z.object({
    id: z.string().uuid()
});

export type uuidSchema = z.TypeOf<typeof schema>;
export const uuidFSchema: FastifySchema = { params: schema };
