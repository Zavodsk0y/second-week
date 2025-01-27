import { type Insertable, type Kysely, Transaction } from "kysely";
import { DB, UserObjectiveShares } from "../../common/types/kysely/db.type";

type InsertableUserObjectiveSharesRowType = Insertable<UserObjectiveShares>;

export async function insert(con: Kysely<DB> | Transaction<DB>, entity: InsertableUserObjectiveSharesRowType) {
    return await con.insertInto("user-objective-shares").returningAll().values(entity).executeTakeFirstOrThrow();
}

export async function findAccessByUserAndObjective(con: Kysely<DB> | Transaction<DB>, userId: string, objectiveId: string) {
    return await con.selectFrom("user-objective-shares").selectAll().where("userId", "=", userId).where("objectiveId", "=", objectiveId).executeTakeFirst();
}

export async function remove(con: Kysely<DB> | Transaction<DB>, entity: InsertableUserObjectiveSharesRowType) {
    return await con.deleteFrom("user-objective-shares").where("userId", "=", entity.userId).where("objectiveId", "=", entity.objectiveId).executeTakeFirst();
}

export async function findAccessesByUserId(con: Kysely<DB> | Transaction<DB>, userId: string) {
    return await con
        .selectFrom("user-objective-shares")
        .innerJoin("objectives", "objectives.id", "user-objective-shares.objectiveId")
        .innerJoin("users", "users.id", "objectives.creatorId")
        .select([
            "users.id as userId",
            "users.login",
            "users.name",
            "objectives.id as objectiveId",
            "objectives.title",
            "objectives.description",
            "objectives.isCompleted",
            "objectives.notifyAt"
        ])
        .where("user-objective-shares.userId", "=", userId)
        .execute();
}

export async function findGrantedUsersByObjectiveId(con: Kysely<DB> | Transaction<DB>, objectiveId: string) {
    return await con
        .selectFrom("user-objective-shares")
        .innerJoin("users", "users.id", "user-objective-shares.userId")
        .select(["users.id", "users.login", "users.name"])
        .where("user-objective-shares.objectiveId", "=", objectiveId)
        .execute();
}
