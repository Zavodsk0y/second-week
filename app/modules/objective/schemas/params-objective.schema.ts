import type { FastifySchema } from "fastify";
import { z } from "zod";

const SortOrders = z.enum(["asc", "desc"]);
const SortFields = z.enum(["notifyAt", "createdAt", "title"]);

const schema = z.object({
    search: z.string().optional(),
    isCompleted: z.boolean().optional(),
    orderBy: SortFields.optional(),
    orderDirection: SortOrders.optional(),
    limit: z.string().transform(Number),
    offset: z.string().transform(Number)
});

export type paramsObjectiveSchema = z.infer<typeof schema>;
export const paramsObjectiveFSchema: FastifySchema = { querystring: schema };
