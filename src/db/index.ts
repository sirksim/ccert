import Database, { SQLiteError, type SQLQueryBindings } from "bun:sqlite";
import type {
  AuditLog,
  AuditLogID,
  CertificateID as CertID,
  Certificate,
  Earner,
  EarnerID,
  EarnerWithCertificate,
  ExpandedAuditLog,
  InsertAuditLogDTO,
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
  dashboard: {
    getStats: () => {
      const certificateStats = connection
        .prepare<
          {
            total_certificates: number;
            valid_certificates: number;
            expired_certificates: number;
            expiring_soon: number;
          },
          []
        >(
          `
          SELECT
            COUNT(*) AS total_certificates,
            SUM(CASE WHEN status = 'valide' THEN 1 ELSE 0 END) AS valid_certificates,
            SUM(CASE WHEN status = 'expiré' THEN 1 ELSE 0 END) AS expired_certificates,
            SUM(
              CASE
                WHEN date(expiry_date) BETWEEN date('now') AND date('now', '+30 days') THEN 1
                ELSE 0
              END
            ) AS expiring_soon
          FROM certificates_with_status
          `,
        )
        .get();

      const totalEarners = connection
        .prepare<
          { total: number },
          []
        >(`SELECT COUNT(*) AS total FROM earners WHERE deleted_at IS NULL`)
        .get();

      const totalUsers = connection
        .prepare<
          { total: number },
          []
        >(`SELECT COUNT(*) AS total FROM users WHERE deleted_at IS NULL`)
        .get();

      return {
        totalCertificates: certificateStats?.total_certificates ?? 0,
        validCertificates: certificateStats?.valid_certificates ?? 0,
        expiredCertificates: certificateStats?.expired_certificates ?? 0,
        expiringSoon: certificateStats?.expiring_soon ?? 0,
        totalEarners: totalEarners?.total ?? 0,
        totalUsers: totalUsers?.total ?? 0,
      };
    },
    getExpiringSoon: (): EarnerWithCertificate[] => {
      return connection
        .prepare<EarnerWithCertificate, []>(
          `
          SELECT * FROM earners_with_certificates
          WHERE expiry_date IS NOT NULL
            AND date(expiry_date) BETWEEN date('now') AND date('now', '+30 days')
          ORDER BY expiry_date ASC
          LIMIT 5
          `,
        )
        .all();
    },
    getRecentAdditions: (): EarnerWithCertificate[] => {
      return connection
        .prepare<EarnerWithCertificate, []>(
          `
          SELECT * FROM earners_with_certificates
          ORDER BY earner_created_at DESC
          LIMIT 5
          `,
        )
        .all();
    },
  },
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
    getAllWithCertPaginated: (
      limit: number,
      offset: number,
    ): EarnerWithCertificate[] => {
      return connection
        .prepare<EarnerWithCertificate, SQLQueryBindings | SQLQueryBindings[]>(
          `
          SELECT * FROM earners_with_certificates
          ORDER BY earner_created_at DESC
          LIMIT $limit OFFSET $offset
          `,
        )
        .all({ $limit: limit, $offset: offset });
    },
    countWithCert: (): number => {
      const result = connection
        .prepare<
          { total: number },
          []
        >(`SELECT COUNT(*) AS total FROM earners_with_certificates`)
        .get();

      return result?.total ?? 0;
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
    update: (id: EarnerID, data: Partial<InsertEarnerDTO>) => {
      const stmt = connection.prepare(`
            UPDATE earners
            SET
              first_name = COALESCE($first_name, first_name),
              last_name = COALESCE($last_name, last_name),
              profile_url = COALESCE($profile_url, profile_url),
              job_title = COALESCE($job_title, job_title),
              company_name = COALESCE($company_name, company_name),
              is_laureat = COALESCE($is_laureat, is_laureat),
              updated_at = datetime('now')
            WHERE id = $id
          `);
      stmt.run({
        $id: id,
        $first_name: data.first_name ?? null,
        $last_name: data.last_name ?? null,
        $profile_url: data.profile_url ?? null,
        $job_title: data.job_title ?? null,
        $company_name: data.company_name ?? null,
        $is_laureat: data.is_laureat ?? null,
      });
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
    getPaginated: (limit: number, offset: number): User[] => {
      return connection
        .prepare<User, SQLQueryBindings | SQLQueryBindings[]>(
          `
          SELECT * FROM users
          WHERE deleted_at IS NULL
          ORDER BY created_at DESC
          LIMIT $limit OFFSET $offset
          `,
        )
        .all({ $limit: limit, $offset: offset });
    },
    count: (): number => {
      const result = connection
        .prepare<
          { total: number },
          []
        >(`SELECT COUNT(*) AS total FROM users WHERE deleted_at IS NULL`)
        .get();

      return result?.total ?? 0;
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
      >(`SELECT * FROM users WHERE email = ? AND deleted_at IS NULL`);
      return stmt.get(email);
    },
    updatePassword: (id: UserID, passwordHash: string) => {
      connection
        .prepare(
          `
          UPDATE users
          SET password_hash = $passwordHash,
              updated_at = datetime('now')
          WHERE id = $id AND deleted_at IS NULL
          `,
        )
        .run({ $id: id, $passwordHash: passwordHash });
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
    updateByEarner: (
      id: EarnerID,
      data: { code?: string; issued_at?: string },
    ) => {
      const stmt = connection.prepare(`
            UPDATE certificates
            SET
              code = COALESCE($code, code),
              issued_at = COALESCE($issued_at, issued_at)
            WHERE earner_id = $earnerId
          `);

      stmt.run({
        $earnerId: id,
        $code: data.code ?? null,
        $issued_at: data.issued_at ?? null,
      });
    },
  },
  auditLogs: {
    getExpanded: () => {
      return connection
        .prepare<ExpandedAuditLog, SQLQueryBindings | SQLQueryBindings[]>(
          `
          SELECT * FROM audit_logs_expanded
          ORDER BY created_at DESC
        `,
        )
        .all();
    },
    insert: (data: InsertAuditLogDTO) => {
      const stmt = connection.prepare<
        AuditLog,
        SQLQueryBindings | SQLQueryBindings[]
      >(`
        INSERT INTO audit_logs (id, user_id, action, entity_type, entity_id, details)
        VALUES ($id, $user_id, $action, $entity_type, $entity_id, $details)
      `);
      const changes = stmt.run({
        $id: generateId<AuditLogID>(),
        $user_id: data.user_id,
        $action: data.action,
        $entity_type: data.entity_type,
        $entity_id: data.entity_id,
        $details: JSON.stringify(data.details),
      });
      return connection
        .prepare<
          AuditLog,
          SQLQueryBindings | SQLQueryBindings[]
        >(`SELECT * FROM audit_logs WHERE rowid = ?`)
        .get(changes.lastInsertRowid)!;
    },
    getHistoryForEarner: (earnerId: EarnerID) => {
      return connection
        .prepare(
          `
         SELECT a.*, u.first_name, u.last_name
         FROM audit_logs a
         JOIN users u ON a.user_id = u.id
         WHERE a.entity_id = $earnerId
         ORDER BY a.created_at DESC
       `,
        )
        .all({ $earnerId: earnerId });
    },
  },
  transaction: <T>(callback: () => T): T => {
    const tx = connection.transaction(callback);
    return tx();
  },
};
