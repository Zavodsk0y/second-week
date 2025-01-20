import { type Insertable, type Kysely, Transaction } from "kysely";
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

    query = query
        .$if(Boolean(filters?.isCompleted), (q) => q.where("isCompleted", "=", filters.isCompleted!))
        .$if(Boolean(filters?.search), (q) => q.where("title", "like", `%${filters.search}%`))
        .$if(Boolean(filters?.sortCreatedAt), (q) => q.orderBy("createdAt", filters.sortCreatedAt))
        .$if(Boolean(filters?.sortNotifyAt), (q) => q.orderBy("notifyAt", filters.sortNotifyAt))
        .$if(Boolean(filters?.sortTitle), (q) => q.orderBy("title", filters.sortTitle))
        .$if(Boolean(filters?.limit), (q) => q.limit(Number(filters.limit)))
        .$if(Boolean(filters?.offset), (q) => q.offset(Number(filters.offset)));
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
