import { MigrationBuilder } from "node-pg-migrate";

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createTable("products", {
    id: {
      type: "uuid",
      primaryKey: true,
      default: pgm.func("gen_random_uuid()"),
    },
    name: { type: "varchar(255)", notNull: true },
    description: { type: "text", notNull: false },
    price: { type: "numeric(10,2)", notNull: true },
    stock: { type: "integer", notNull: true, default: 0 },
    created_at: { type: "timestamp", default: pgm.func("now()") },
  });
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropTable("products");
}
