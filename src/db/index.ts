import Database, { type SQLQueryBindings } from "bun:sqlite";
import type {
  CertificateID as CertID,
  Certificate,
  Earner,
  EarnerID,
  InsertCertificateDTO,
  InsertEarnerDTO,
  InsertUserDTO,
  User,
  UserID,
} from "./types";
import { generateId } from "./utils";
import { use } from "hono/jsx";

const connection = new Database("ccert.db");
export const db = {
  earners: {
    getAll: (): Earner[] => {
      return connection
        .query("SELECT * FROM earners WHERE deleted_at IS NULL")
        .all() as Earner[];
    },
    insert: (data: InsertEarnerDTO): Earner => {
      const stmt = connection.prepare(
        `
        INSERT INTO earners(id,last_name,first_name,profile_url,job_title,created_by)
        VALUES($id,$last_name,$first_name,$profile_url,$job_title,$created_by)
        RETURNING *
        `,
        {
          $id: generateId<EarnerID>(),
          $last_name: data.last_name,
          $first_name: data.first_name,
          $profile_url: data.profile_url,
          $job_title: data.job_title,
          $created_by: data.created_by,
        },
      );
      console.log(stmt.toString());
      const earner: Earner = {};
      return earner;
    },
  },
  users: {
    updateLastLogin: (user: User) => {
      connection.run(
        `UPDATE users SET last_login = datetime('now') WHERE id = ?`,
        [user.id],
      );
    },
    getAll: (): User[] => {
      const stmt = connection.prepare<
        User,
        SQLQueryBindings | SQLQueryBindings[]
      >(`SELECT * FROM users`);
      return stmt.all();
    },
    getByEmail: (email: string): User | null => {
      const stmt = connection.prepare<
        User,
        SQLQueryBindings | SQLQueryBindings[]
      >(`SELECT * FROM users WHERE email = ?`);
      return stmt.get(email);
    },
    insert: (data: InsertUserDTO): User => {
      const stmt = connection.prepare<
        User,
        SQLQueryBindings | SQLQueryBindings[]
      >(
        `
        INSERT INTO users(id,last_name,first_name,email,password_hash,role_id)
        VALUES($id,$last_name,$first_name,$email,$password_hash,$role_id)
        RETURNING *
        `,
        {
          $id: generateId<UserID>(),
          $last_name: data.last_name,
          $first_name: data.first_name,
          $email: data.email,
          $password_hash: data.password_hash,
          $role_id: data.role_id,
        },
      );
      const changes = stmt.run();
      return connection
        .prepare<
          User,
          SQLQueryBindings | SQLQueryBindings[]
        >(`SELECT * FROM users WHERE rowid = ?`)
        .get(changes.lastInsertRowid)!;
    },
  },
  certificate: {
    insert: (data: InsertCertificateDTO): Certificate => {
      const query = connection.prepare(
        `
        INSERT INTO certificates(id,code,earner_id,created_by,issued_at)
        VALUES($id,$code,$earner_id,$created_by,$issued_at)
        RETURNING *
        `,
        {
          $id: generateId<CertID>(),
          $code: data.code,
          $earner_id: data.earner_id,
          $created_by: data.created_by,
          $issued_at: data.issued_at,
        },
      );
      console.log(query.toString());
      const cert: Certificate = {};

      return cert;
    },
  },
  transaction: <T>(callback: () => T): T => {
    const tx = connection.transaction(callback);
    return tx();
  },
};
