import { type Insertable, type Kysely, Transaction } from "kysely";
import { DB, UserObjectiveShares } from "../../common/types/kysely/db.type";

type InsertableUserObjectiveSharesRowType = Insertable<UserObjectiveShares>;

export async function insert(con: Kysely<DB> | Transaction<DB>, entity: InsertableUserObjectiveSharesRowType) {
    return await con.insertInto("user-objective-shares").returningAll().values(entity).executeTakeFirstOrThrow();
}
