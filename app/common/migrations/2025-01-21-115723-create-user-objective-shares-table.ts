import { type Kysely, sql } from "kysely";

export async function up(db: Kysely<any>) {
    await db.schema
        .createTable("user-objective-shares")
        .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
        .addColumn("userId", "uuid", (col) => col.references("users.id").onDelete("cascade").notNull())
        .addColumn("objectiveId", "uuid", (col) => col.references("objectives.id").onDelete("cascade").notNull())
        .execute();

    await db.schema.createIndex("user_id_index").on("user-objective-shares").column("userId").execute();
    await db.schema.createIndex("objective_id_index").on("user-objective-shares").column("objectiveId").execute();
}

export async function down(db: Kysely<any>) {
    await db.schema.dropTable("users").execute();
}
