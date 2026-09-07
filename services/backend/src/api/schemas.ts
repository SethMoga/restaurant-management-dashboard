import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { categories, menuItems } from "../db/schema";

export const categorySchema = createSelectSchema(categories);

export const createCategorySchema = createInsertSchema(categories).pick({
  name: true,
  sortOrder: true,
});

export const menuItemSchema = createSelectSchema(menuItems);

export const createMenuItemSchema = createInsertSchema(menuItems).pick({
  categoryId: true,
  name: true,
  description: true,
  price: true,
  sortOrder: true,
  isAvailable: true,
});

export const updateMenuItemSchema = createInsertSchema(menuItems)
  .pick({
    categoryId: true,
    name: true,
    description: true,
    price: true,
    sortOrder: true,
    isAvailable: true,
  })
  .partial();

export const errorSchema = z.object({
  error: z.string(),
});