import type { FastifySchema } from "fastify";
import { z } from "zod";

const SortOrders = z.enum(["asc", "desc"]);

const schema = z.object({
    search: z.string().optional(),
    isCompleted: z.boolean().optional(),
    sortCreatedAt: SortOrders.optional(),
    sortTitle: SortOrders.optional(),
    sortNotifyAt: SortOrders.optional(),
    limit: z.number(),
    offset: z.number()
});

export type paramsObjectiveSchema = z.infer<typeof schema>;
export const paramsObjectiveFSchema: FastifySchema = { params: schema };
