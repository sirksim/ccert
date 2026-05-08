export type Brand<T1, T2> = T1 & { readonly __brand: T2 };

export type UserID = Brand<Uint8Array, "UserID">;
export type UserRoleID = Brand<number, "UserRoleID">;
export type EarnerID = Brand<Uint8Array, "EarnerID">;
export type CertificateID = Brand<Uint8Array, "CertificateID">;

export type UserRole = {
  id: UserRoleID;
  name: string; // 'Admin' | 'Editor'
};

export type User = {
  id: UserID;
  email: string;
  password_hash: string;
  last_name: string;
  first_name: string;
  full_name: string;
  role_id: UserRoleID;
  last_login: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

export type Earner = {
  id: EarnerID;
  last_name: string;
  first_name: string;
  full_name: string;
  profile_url: string;
  job_title: string;
  company_name: string;
  is_laureat: 0 | 1;
  created_by: UserID;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

export type Certificate = {
  id: CertificateID;
  code: string;
  earner_id: EarnerID;
  created_by: UserID;
  issued_at: string;
  validity_years: number;
  expiry_date: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

export type CertificateWithStatus = Certificate & {
  status: "valide" | "expiré";
};

export type InsertUserDTO = {
  email: string;
  password_hash: string;
  last_name: string;
  first_name: string;
  role_id: number;
};

export type InsertEarnerDTO = {
  last_name: string;
  first_name: string;
  profile_url: string;
  job_title: string;
  company_name: string;
  is_laureat: 0 | 1;
  created_by: UserID;
};

export type InsertCertificateDTO = {
  code: string;
  earner_id: EarnerID;
  created_by: UserID;
  issued_at: string;
  validity_years?: number;
};

export type EarnerWithCertificate = {
  earner_id: EarnerID;
  first_name: string;
  last_name: string;
  full_name: string;
  profile_url: string;
  job_title: string;
  company_name: string;
  is_laureat: 0 | 1;
  earner_created_at: string;
  certificate_id: CertificateID | null; // Nullable due to LEFT JOIN
  certificate_code: string | null;
  issued_at: string | null;
  validity_years: number | null;
  expiry_date: string | null;
  certificate_status: "valide" | "expiré" | null;
};

export type UserWithRole = {
  user_id: UserID;
  email: string;
  first_name: string;
  last_name: string;
  role_id: number;
  role_name: string;
  last_login: string | null;
  created_at: string;
  updated_at: string;
};

export type AuditLogID = string & { readonly brand: unique symbol };

export type AuditAction = "CREATE" | "UPDATE" | "DELETE" | "LOGIN";
export type EntityType = "earner" | "certificate" | "user";

export type AuditLog = {
  id: AuditLogID;
  user_id: UserID;
  action: AuditAction;
  entity_type: EntityType;
  entity_id: string | Buffer | null;
  details: string;
  created_at: string;
};

export type InsertAuditLogDTO = {
  user_id: UserID;
  action: AuditAction;
  entity_type: EntityType;
  entity_id: any;
  details: any;
};
export type ExpandedAuditLog = {
  log_id: AuditLogID;
  action: AuditAction;
  entity_type: EntityType;
  entity_id: string | Buffer | null;
  details: string;
  created_at: string;
  actor_id: UserID | null;
  actor_first_name: string | null;
  actor_last_name: string | null;
  actor_email: string | null;
  actor_full_name: string | null;
};
