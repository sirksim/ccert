import { Hono } from "hono";
import { jsxRenderer } from "hono/jsx-renderer";
import { serveStatic } from "hono/bun";

import Dashboard from "@pages/dashboard.tsx";
import Earners from "@pages/earners";
import Layout from "@components/layout.tsx";
import { db } from "@databases/index";
import { zValidator } from "@hono/zod-validator";
import { earnerFormSchema } from "../schema/earners";
import type { Certificate, Earner, EarnerID, UserID } from "@databases/types";
import Login from "@pages/login";
import { loginSchema } from "@schema/login";
import Reset from "@pages/reset";
import History from "@pages/history";
import Users from "@pages/users";
import { addUserSchema } from "@schema/users";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";
import Profile from "@pages/profile";
import type { SQL } from "bun";
import EditUser from "@components/editUser";
import EditEarner from "@components/editEarner";

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
declare module "hono/jsx" {
  namespace JSX {
    interface IntrinsicElements {
      "relative-time": {
        datetime: string;
      };
    }
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
  .get("/profile", (c) => {
    return c.render(<Profile></Profile>, {
      styles: ["profile"],
    });
  })
  .get("/earners", (c) => {
    const earners = db.earners.getAllWithCert();
    return c.render(<Earners earners={earners}></Earners>, {
      styles: ["earners"],
      scripts: ["earners", "relative-time-element"],
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
  .get("/api/v1/edit/user", (c) => {
    const id = Uint8Array.fromBase64(c.req.query("id")!);
    const user = db.users.getByID(id as UserID);
    if (user === null) {
      return c.json({ success: false, error: "Server Error" }, 500);
    }
    return c.html(<EditUser user={user}></EditUser>);
  })
  .get("/api/v1/edit/earner", (c) => {
    const id = Uint8Array.fromBase64(c.req.query("id")!);
    const earner = db.earners.getByID(id as EarnerID);
    if (earner === null) {
      return c.json({ success: false, error: "Server Error" }, 500);
    }
    return c.html(<EditEarner earner={earner}></EditEarner>);
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
      setCookie(c, "flash", `${user.full_name}`, {
        httpOnly: true,
        secure: true,
      });
      return c.json({ success: true });
    } catch (e) {
      if (e instanceof Error && e.name === "SQLiteError") {
        return c.json({
          success: false,
          error: {
            ...e,
            message: e.message,
          },
        });
      }
      console.log(e);
      return c.json(e);
    }
  })
  .post("/api/v1/earners", zValidator("form", earnerFormSchema), (c) => {
    const validated = c.req.valid("form");
    let earner = {} as Earner,
      cert = {} as Certificate;
    try {
      db.transaction(() => {
        const session = getCookie(c, "session");
        if (session === undefined) {
          return c.json({ success: false });
        }
        const created_by = Uint8Array.fromBase64(session) as UserID;
        earner = db.earners.insert({
          company_name: validated.company_name,
          first_name: validated.first_name,
          job_title: validated.job_title,
          last_name: validated.last_name,
          profile_url: validated.profile_url,
          is_laureat: validated.is_laureat || 0,
          created_by,
        });

        cert = db.certificate.insert({
          earner_id: earner.id,
          code: validated.code,
          issued_at: validated.issued_at,
          created_by,
        });
      });
      setCookie(
        c,
        "flash",
        `Added ${earner.full_name} with code ${cert.code}`,
        {
          secure: true,
          httpOnly: true,
        },
      );
      return c.json({ success: true });
    } catch (e) {
      if (e instanceof Error && e.name === "SQLiteError") {
        const error = e as SQL.SQLiteError;
        switch (error.code) {
          case "SQLITE_CONSTRAINT_DATATYPE":
            console.log(e.message);
            return c.json({ success: false }, 500);
          default:
            return c.json({ success: false });
        }
      }
      return c.json({ success: false, e });
    }
  });

export default app;
