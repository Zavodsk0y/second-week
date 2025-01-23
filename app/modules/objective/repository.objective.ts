import { expressionBuilder, ExpressionWrapper, type Insertable, type Kysely, RawBuilder, SqlBool, Transaction } from "kysely";
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
    const conditions: Array<ExpressionWrapper<DB, "objectives", SqlBool> | RawBuilder<any>> = [];

    const eb = expressionBuilder<DB, "objectives">();
    if (filters.isCompleted !== undefined) conditions.push(eb("objectives.isCompleted", "=", filters.isCompleted));
    if (filters.search !== undefined) conditions.push(eb("objectives.title", "like", `%${filters.search}%`));

    query = query
        .where((eb) => eb.and(conditions))
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
