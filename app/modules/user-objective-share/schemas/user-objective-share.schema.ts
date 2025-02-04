import { FastifySchema } from "fastify";
import { z } from "zod";
import { uuidFSchema, uuidSchema } from "../../../common/schemas/uuid.schema";

const schema = z.object({
    id: z.string()
});

const usersSchema = z.object({
    users: z.array(schema)
});

export type UserObjectiveShareSchema = z.infer<typeof usersSchema>;
export const userObjectiveShareFSchema: FastifySchema = { body: usersSchema, params: uuidFSchema.params };

export interface IUserObjectiveShareFSchema {
    Body: UserObjectiveShareSchema;
    Params: uuidSchema;
}
