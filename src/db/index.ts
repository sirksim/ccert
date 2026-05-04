import Database, { type SQLQueryBindings } from "bun:sqlite";
import type {
  CertificateID as CertID,
  Certificate,
  Earner,
  EarnerID,
  EarnerWithCertificate,
  InsertCertificateDTO,
  InsertEarnerDTO,
  InsertUserDTO,
  User,
  UserID,
  UserWithRole,
} from "./types";
import { generateId } from "./utils";

const connection = new Database("ccert.db");
export const db = {
  earners: {
    getAll: (): Earner[] => {
      return connection
        .query<Earner, []>("SELECT * FROM earners WHERE deleted_at IS NULL")
        .all();
    },
    getByID: (id: EarnerID): EarnerWithCertificate | null => {
      const stmt = connection.prepare<
        EarnerWithCertificate,
        SQLQueryBindings | SQLQueryBindings[]
      >(`SELECT * FROM earners_with_certificates WHERE earner_id = ?`);
      return stmt.get(id);
    },
    getAllWithCert: (): EarnerWithCertificate[] => {
      return connection
        .query<
          EarnerWithCertificate,
          []
        >("SELECT * FROM earners_with_certificates")
        .all();
    },
    insert: (data: InsertEarnerDTO): Earner => {
      const stmt = connection.prepare<
        Earner,
        SQLQueryBindings | SQLQueryBindings[]
      >(
        `
        INSERT INTO earners(id,last_name,is_laureat,company_name,first_name,profile_url,job_title,created_by)
        VALUES($id,$last_name,$is_laureat,$company_name,$first_name,$profile_url,$job_title,$created_by)
        RETURNING *
        `,
        {
          $id: generateId<EarnerID>(),
          $last_name: data.last_name,
          $first_name: data.first_name,
          $profile_url: data.profile_url,
          $job_title: data.job_title,
          $created_by: data.created_by,
          $company_name: data.company_name,
          $is_laureat: data.is_laureat,
        },
      );
      return stmt.get()!;
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
      const stmt = connection.prepare<User, []>(`SELECT * FROM users`);
      return stmt.all();
    },
    getByID: (id: UserID): UserWithRole | null => {
      const stmt = connection.prepare<
        UserWithRole,
        SQLQueryBindings | SQLQueryBindings[]
      >(`SELECT * FROM users_with_roles WHERE user_id = ?`);
      return stmt.get(id);
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
      const stmt = connection.prepare<
        Certificate,
        SQLQueryBindings | SQLQueryBindings[]
      >(
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
      return stmt.get()!;
    },
  },
  transaction: <T>(callback: () => T): T => {
    const tx = connection.transaction(callback);
    return tx();
  },
};
