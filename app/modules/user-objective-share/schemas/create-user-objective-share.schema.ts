import { FastifySchema } from "fastify";
import { z } from "zod";

const paramsSchema = z.object({
    id: z.string().uuid(),
    userId: z.string().uuid()
});

export type UserObjectiveShareSchema = z.infer<typeof paramsSchema>;
export const userObjectiveShareFSchema: FastifySchema = { params: paramsSchema };

export interface IUserObjectiveShareFSchema {
    Params: UserObjectiveShareSchema;
}
