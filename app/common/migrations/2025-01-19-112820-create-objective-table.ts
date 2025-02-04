import { type Kysely, sql } from "kysely";

export async function up(db: Kysely<any>) {
    await db.schema
        .createTable("objectives")
        .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
        .addColumn("title", "varchar(127)", (col) => col.notNull())
        .addColumn("description", "text")
        .addColumn("creatorId", "uuid", (col) => col.references("users.id").onDelete("cascade").notNull())
        .addColumn("notifyAt", "timestamp")
        .addColumn("createdAt", "timestamp", (col) => col.defaultTo(sql`now()`).notNull())
        .addColumn("updatedAt", "timestamp", (col) => col.defaultTo(sql`now()`).notNull())
        .addColumn("isCompleted", "boolean", (col) => col.defaultTo(sql`false`).notNull())
        .execute();

    await db.schema.createIndex("user_creator_id_index").on("objectives").column("creatorId").execute();
}

export async function down(db: Kysely<any>) {
    await db.schema.dropTable("users").execute();
}
