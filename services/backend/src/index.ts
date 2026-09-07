import { Hono } from "hono";

import { createDb } from "./db";
import menuRoutes from "./api/menu";

const app = new Hono();

app.route("/api", menuRoutes);

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.get("/health/db", async (c) => {
  const db = createDb();
  const result = await db.execute("SELECT 1");

  return c.json({
    database: "connected",
    result,
  });
});

export default app;