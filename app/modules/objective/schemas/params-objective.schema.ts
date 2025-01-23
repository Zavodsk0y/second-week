import type { FastifySchema } from "fastify";
import { z } from "zod";

const SortOrders = z.enum(["asc", "desc"]);
const SortFields = z.enum(["notifyAt", "createdAt", "title"]);

const schema = z.object({
    search: z.string().optional(),
    isCompleted: z
        .enum(["true", "false"])
        .transform((val) => val === "true")
        .optional(),
    orderBy: SortFields.optional(),
    orderDirection: SortOrders.optional(),
    limit: z
        .string()
        .transform((val) => Number(val))
        .refine((val) => !isNaN(val)),
    offset: z
        .string()
        .transform((val) => Number(val))
        .refine((val) => !isNaN(val))
});

export type paramsObjectiveSchema = z.infer<typeof schema>;
export const paramsObjectiveFSchema: FastifySchema = { querystring: schema };

export interface IQueryParamsFSchema {
    Querystring: paramsObjectiveSchema;
}
