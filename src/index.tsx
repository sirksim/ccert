import { Hono } from "hono";
import { jsxRenderer } from "hono/jsx-renderer";
import { serveStatic } from "hono/bun";

import Dashboard from "@pages/dashboard.tsx";
import Certificate from "@pages/certificate.tsx";
import Layout from "@components/layout.tsx";

const app = new Hono();

app.use(
  "/*",
  serveStatic({
    root: "./public",
    onNotFound: (path, c) => {
      console.log(`${path} is not found, you try to access ${c.req.path}`);
    },
  }),
);
app.use(
  "*",
  jsxRenderer(({ children, styles }) => {
    return <Layout styles={styles}>{children}</Layout>;
  }),
);

app
  .get("/", (c) => {
    return c.render(<Dashboard></Dashboard>, {
      styles: ["dashboard"],
    });
  })
  .get("/earners", (c) => {
    return c.render(<Certificate></Certificate>, {
      styles: ["certificate"],
    });
  });

export default app;
