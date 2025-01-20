import { type Insertable, type Kysely, Transaction } from "kysely";
import { DB, Objectives } from "../../common/types/kysely/db.type";
import { updateObjectiveSchema } from "./schemas/update-objective.schema";

type InsertableObjectiveRowType = Insertable<Objectives>;

export async function insert(con: Kysely<DB> | Transaction<DB>, entity: InsertableObjectiveRowType) {
    return await con.insertInto("objectives").returningAll().values(entity).executeTakeFirstOrThrow();
}

export async function getById(con: Kysely<DB> | Transaction<DB>, id: string) {
    return await con.selectFrom("objectives").selectAll().where("id", "=", id).executeTakeFirst();
}

export async function update(con: Kysely<DB> | Transaction<DB>, id: string, schema: updateObjectiveSchema) {
    return await con
        .updateTable("objectives")
        .returningAll()
        .set({ ...schema })
        .where("id", "=", id)
        .executeTakeFirst();
}
