import { Hono } from "hono";
import { jsxRenderer } from "hono/jsx-renderer";
import { serveStatic } from "hono/bun";

import Dashboard from "@pages/dashboard.tsx";
import Earners from "@pages/earners";
import Layout from "@components/layout.tsx";
import { db } from "@databases/index";
import { zValidator } from "@hono/zod-validator";
import { earnerFormSchema } from "../schema/earners";
import type { UserID } from "@databases/types";
import Login from "@pages/login";
import { loginSchema } from "@schema/login";
import Reset from "@pages/reset";
import History from "@pages/history";
import Users from "@pages/users";
import { addUserSchema } from "@schema/users";
import { SQL } from "bun";
import { deleteCookie, setCookie } from "hono/cookie";

declare module "hono" {
  interface ContextRenderer {
    (
      content: string | Promise<string>,
      props?: {
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
    const flash = deleteCookie(c, "flash", {
      secure: true,
      httpOnly: true,
    });
    console.log(flash);
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
  .get("/login", (c) => {
    return c.render(<Login></Login>, {
      scripts: ["login"],
    });
  })
  .get("/users", (c) => {
    const users = db.users.getAll();
    return c.render(<Users users={users}></Users>, {
      scripts: ["users"],
    });
  })
  .get("/history", (c) => {
    return c.render(<History></History>);
  })
  .get("/reset", (c) => {
    return c.render(<Reset></Reset>);
  })
  .post("api/v1/login", zValidator("form", loginSchema), async (c) => {
    const validated = c.req.valid("form");
    const email = validated.email;

    const user = db.users.getByEmail(email);
    if (user === null) {
      return c.json({ success: false, error: "Invalid credentials" });
    }
    const match = await Bun.password.verify(
      validated.password,
      user.password_hash,
    );
    if (!match) {
      return c.json({ success: false, error: "Invalid crendentials" });
    }
    setCookie(c, "session", user.id.toBase64(), {
      secure: true,
      httpOnly: true,
    });
    setCookie(c, "flash", `Welcome ${user.full_name}`, {
      secure: true,
      httpOnly: true,
    });
    db.users.updateLastLogin(user);
    return c.json({ success: true });
  })
  .post("/api/v1/users", zValidator("form", addUserSchema), async (c) => {
    const validated = c.req.valid("form");
    const user = db.users.getByEmail(validated.email);
    if (user !== null) {
      return c.json({
        success: false,
        error: {
          message: "UNIQUE constraint failed: users.email",
        },
      });
    }
    const password_hash = await Bun.password.hash(validated.password, {
      algorithm: "bcrypt",
      cost: 15,
    });
    try {
      const user = db.users.insert({ ...validated, password_hash });
      return c.json(user);
    } catch (err) {
      if (err instanceof Error && err.name === "SQLiteError") {
        return c.json({
          success: false,
          error: {
            ...err,
            message: err.message,
          },
        });
      }
      console.log(err);
      return c.json(err);
    }
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
    return c.json({ earner });
  });

export default app;
