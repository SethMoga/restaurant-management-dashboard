import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { createDb } from "../db";
import { categories, menuItems } from "../db/schema";

import {
  categorySchema,
  createCategorySchema,
  createMenuItemSchema,
  errorSchema,
  menuItemSchema,
  updateMenuItemSchema,
} from "./schemas";

const app = new OpenAPIHono();

const getCategoriesRoute = createRoute({
  method: "get",
  path: "/categories",
  tags: ["Menu"],
  responses: {
    200: {
      content: {
        "application/json": {
          schema: categorySchema.array(),
        },
      },
      description: "List all menu categories",
    },
  },
});

app.openapi(getCategoriesRoute, async (c) => {
  const db = createDb();

  const result = await db
    .select()
    .from(categories)
    .orderBy(categories.sortOrder);

  return c.json(result, 200);
});


const createCategoryRoute = createRoute({
  method: "post",
  path: "/categories",
  tags: ["Menu"],
  request: {
    body: {
      content: {
        "application/json": {
          schema: createCategorySchema,
        },
      },
      required: true,
    },
  },
  responses: {
    201: {
      content: {
        "application/json": {
          schema: categorySchema,
        },
      },
      description: "Category created successfully",
    },
  },
});

app.openapi(createCategoryRoute, async (c) => {
  const db = createDb();
  const body = c.req.valid("json");

  const [category] = await db
    .insert(categories)
    .values(body)
    .returning();

  return c.json(category, 201);
});


const getMenuItemsRoute = createRoute({
  method: "get",
  path: "/menu-items",
  tags: ["Menu"],
  responses: {
    200: {
      content: {
        "application/json": {
          schema: menuItemSchema.array(),
        },
      },
      description: "List all menu items",
    },
  },
});

app.openapi(getMenuItemsRoute, async (c) => {
  const db = createDb();

  const result = await db
    .select()
    .from(menuItems)
    .orderBy(menuItems.sortOrder);

  return c.json(result, 200);
});


const createMenuItemRoute = createRoute({
  method: "post",
  path: "/menu-items",
  tags: ["Menu"],
  request: {
    body: {
      content: {
        "application/json": {
          schema: createMenuItemSchema,
        },
      },
      required: true,
    },
  },
  responses: {
    201: {
      content: {
        "application/json": {
          schema: menuItemSchema,
        },
      },
      description: "Menu item created successfully",
    },
    400: {
	  content: {
		"application/json": {
		  schema: errorSchema,
		},
	  },
	  description: "Invalid category",
	},
  },
});

app.openapi(createMenuItemRoute, async (c) => {
  const db = createDb();
  const body = c.req.valid("json");

  const [category] = await db
    .select()
    .from(categories)
    .where(eq(categories.id, body.categoryId))
    .limit(1);

  if (!category) {
    return c.json(
      {
        error: "Category not found",
      },
      400,
    );
  }

  const [menuItem] = await db
    .insert(menuItems)
    .values(body)
    .returning();

  return c.json(menuItem, 201);
});


const updateMenuItemRoute = createRoute({
  method: "patch",
  path: "/menu-items/{id}",
  tags: ["Menu"],
  request: {
    params: z.object({
      id: z.string().uuid(),
    }),
    body: {
      content: {
        "application/json": {
          schema: updateMenuItemSchema,
        },
      },
      required: true,
    },
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: menuItemSchema,
        },
      },
      description: "Menu item updated successfully",
    },
    404: {
      content: {
        "application/json": {
          schema: errorSchema,
        },
      },
      description: "Menu item not found",
    },
  },
});

app.openapi(updateMenuItemRoute, async (c) => {
  const db = createDb();
  const { id } = c.req.valid("param");
  const body = c.req.valid("json");

  const [menuItem] = await db
    .update(menuItems)
    .set({
      ...body,
      updatedAt: new Date(),
    })
    .where(eq(menuItems.id, id))
    .returning();

  if (!menuItem) {
    return c.json(
      {
        error: "Menu item not found",
      },
      404,
    );
  }

  return c.json(menuItem, 200);
});


const deleteMenuItemRoute = createRoute({
  method: "delete",
  path: "/menu-items/{id}",
  tags: ["Menu"],
  request: {
    params: z.object({
      id: z.string().uuid(),
    }),
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: z.object({
            message: z.string(),
          }),
        },
      },
      description: "Menu item deleted successfully",
    },
    404: {
      content: {
        "application/json": {
          schema: errorSchema,
        },
      },
      description: "Menu item not found",
    },
  },
});

app.openapi(deleteMenuItemRoute, async (c) => {
  const db = createDb();
  const { id } = c.req.valid("param");

  const [menuItem] = await db
    .delete(menuItems)
    .where(eq(menuItems.id, id))
    .returning();

  if (!menuItem) {
    return c.json(
      {
        error: "Menu item not found",
      },
      404,
    );
  }

  return c.json(
    {
      message: "Menu item deleted successfully",
    },
    200,
  );
});

export default app;