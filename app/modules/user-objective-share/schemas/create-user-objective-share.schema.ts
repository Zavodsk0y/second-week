import { FastifySchema } from "fastify";
import { z } from "zod";

const schema = z.object({
    email: z.string().email()
});

export type createUserObjectiveShareSchema = z.infer<typeof schema>;
export const createuserObjectiveShareFSchema: FastifySchema = { body: schema };
