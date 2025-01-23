import { FastifySchema } from "fastify";
import { z } from "zod";
import { uuidSchema } from "../../../common/schemas/uuid.schema";

const schema = z.object({
    id: z.string().uuid()
});

export type UserObjectiveShareSchema = z.infer<typeof schema>;
export const userObjectiveShareFSchema: FastifySchema = { body: schema };

export interface IUserObjectiveShareFSchema {
    Body: z.infer<typeof schema>;
    Params: uuidSchema;
}
