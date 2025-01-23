import { FastifySchema } from "fastify";
import { z } from "zod";

const paramsSchema = z.object({
    id: z.string().uuid()
});

export type uuidSchema = z.TypeOf<typeof paramsSchema>;
export const uuidFSchema: FastifySchema = { params: paramsSchema };

export interface IGetByUuidFSchema {
    Params: uuidSchema;
}
