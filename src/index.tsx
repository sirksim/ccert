import { Hono } from "hono";
import { jsxRenderer } from "hono/jsx-renderer";
import { serveStatic } from "hono/bun";

import Dashboard from "@pages/dashboard.tsx";
import Earners from "@pages/earners";
import Layout from "@components/layout.tsx";
import { db } from "@databases/index";
import { zValidator } from "@hono/zod-validator";
import { earnerFormSchema } from "../schema/earners";
import { generateId } from "@databases/utils";
import type { CertificateID, EarnerID, UserID } from "@databases/types";

declare module "hono" {
  interface ContextRenderer {
    (
      content: string | Promise<string>,
      props: {
        styles?: string[];
        scripts?: string[];
      },
    ): Response;
  }
}
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
  jsxRenderer((props) => {
    return (
      <Layout scripts={props.scripts} styles={props.styles}>
        {props.children}
      </Layout>
    );
  }),
);

app
  .get("/", (c) => {
    return c.render(<Dashboard></Dashboard>, {
      styles: ["dashboard"],
    });
  })
  .get("/earners", (c) => {
    const earners = db.earners.getAll();
    return c.render(<Earners earners={earners}></Earners>, {
      styles: ["earners"],
      scripts: ["earners"],
    });
  })
  .post("/api/v1/earners", zValidator("form", earnerFormSchema), (c) => {
    const validated = c.req.valid("form");
    let earner, cert;
    db.transaction(() => {
      const created_by = Buffer.from(Bun.randomUUIDv7()) as unknown as UserID,
        earner = db.earners.insert({
          company_name: validated.company_name,
          first_name: validated.first_name,
          job_title: validated.job_title,
          last_name: validated.last_name,
          profile_url: validated.profile_url,
          is_laureat: validated.is_laureat,
          created_by,
        });

      cert = db.certificate.insert({
        earner_id: earner.id, // Link the certificate to the newly created earner
        created_by,
        code: validated.code,
        issued_at: validated.issued_at,
      });
    });
    return c.json(validated);
  });

export default app;
