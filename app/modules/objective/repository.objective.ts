import { expressionBuilder, ExpressionWrapper, type Insertable, type Kysely, SqlBool, Transaction } from "kysely";
import { DB, Objectives } from "../../common/types/kysely/db.type";
import { paramsObjectiveSchema } from "./schemas/params-objective.schema";
import { updateObjectiveSchema } from "./schemas/update-objective.schema";

type InsertableObjectiveRowType = Insertable<Objectives>;

export async function insert(con: Kysely<DB> | Transaction<DB>, entity: InsertableObjectiveRowType) {
    return await con.insertInto("objectives").returningAll().values(entity).executeTakeFirstOrThrow();
}

export async function findAll(con: Kysely<DB> | Transaction<DB>, userId: string) {
    return await con.selectFrom("objectives").selectAll().where("creatorId", "=", userId).execute();
}

export async function getAll(con: Kysely<DB> | Transaction<DB>, userId: string, filters: paramsObjectiveSchema) {
    let query = con.selectFrom("objectives").selectAll().where("creatorId", "=", userId);

    // defining expressionBuilder for building sql expressions (ty cap)
    const eb = expressionBuilder<DB, "objectives">();

    // Defining conditions array, checking two query-params, filtering them to recline undefined(empty params)
    const conditions = [
        typeof filters.isCompleted !== "undefined" ? eb("isCompleted", "=", filters.isCompleted) : undefined,
        filters.search ? eb("title", "like", `%${filters.search}%`) : undefined
    ].filter((condition) => condition !== undefined);

    // defining ExpressionWrapper and combine our expressions array with .and method, and 'casting' them to operationNodes
    const filterWrapper = new ExpressionWrapper<DB, "objectives", SqlBool>(eb.and(conditions).toOperationNode());

    query = query
        .where(filterWrapper)
        .$if(Boolean(filters?.orderBy && filters?.orderDirection), (q) => q.orderBy(filters.orderBy!, filters.orderDirection))
        .limit(filters.limit)
        .offset(filters.offset);
    return await query.execute();
}

export async function getById(con: Kysely<DB> | Transaction<DB>, id: string) {
    return await con.selectFrom("objectives").selectAll().where("id", "=", id).executeTakeFirst();
}

export async function update(con: Kysely<DB> | Transaction<DB>, id: string, schema: updateObjectiveSchema) {
    return await con
        .updateTable("objectives")
        .returningAll()
        .set({ ...schema, updatedAt: `now()` })
        .where("id", "=", id)
        .executeTakeFirst();
}
