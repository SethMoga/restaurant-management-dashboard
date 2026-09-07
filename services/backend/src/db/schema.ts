import {
  boolean,
  integer,
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const categories = pgTable("categories", {
  id: uuid("id").defaultRandom().primaryKey(),

  name: text("name").notNull(),

  sortOrder: integer("sort_order").notNull().default(0),

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),

  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const menuItems = pgTable("menu_items", {
  id: uuid("id").defaultRandom().primaryKey(),

  categoryId: uuid("category_id")
    .notNull()
    .references(() => categories.id),

  name: text("name").notNull(),

  description: text("description").notNull().default(""),

  price: numeric("price", {
    precision: 10,
    scale: 2,
  }).notNull(),

  sortOrder: integer("sort_order").notNull().default(0),

  isAvailable: boolean("is_available").notNull().default(true),

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),

  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const customers = pgTable("customers", {
  id: uuid("id").defaultRandom().primaryKey(),

  firstName: text("first_name").notNull(),

  lastName: text("last_name").notNull(),

  email: text("email").unique(),

  phone: text("phone"),

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),

  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const orderStatus = pgEnum("order_status", [
  "pending",
  "accepted",
  "preparing",
  "ready",
  "completed",
  "cancelled",
]);

export const orders = pgTable("orders", {
  id: uuid("id").defaultRandom().primaryKey(),

  customerId: uuid("customer_id")
    .notNull()
    .references(() => customers.id),

  status: orderStatus("status").notNull().default("pending"),

  total: numeric("total", {
    precision: 10,
    scale: 2,
  }).notNull(),

  notes: text("notes").notNull().default(""),

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),

  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const orderItems = pgTable("order_items", {
  id: uuid("id").defaultRandom().primaryKey(),

  orderId: uuid("order_id")
    .notNull()
    .references(() => orders.id),

  menuItemId: uuid("menu_item_id")
    .notNull()
    .references(() => menuItems.id),

  quantity: integer("quantity").notNull(),

  unitPrice: numeric("unit_price", {
    precision: 10,
    scale: 2,
  }).notNull(),

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const businessSettings = pgTable("business_settings", {
  id: uuid("id").defaultRandom().primaryKey(),

  acceptingOrders: boolean("accepting_orders").notNull().default(true),

  orderingEnabled: boolean("ordering_enabled").notNull().default(true),

  minimumOrderAmount: numeric("minimum_order_amount", {
    precision: 10,
    scale: 2,
  })
    .notNull()
    .default("0.00"),

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),

  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});