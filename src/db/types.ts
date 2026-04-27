export type Brand<T1, T2> = T1 & { readonly __brand: T2 };

export type UserID = Brand<Uint8Array, "UserID">;
export type UserRoleID = Brand<number, "UserRoleID">;
export type EarnerID = Brand<Uint8Array, "EarnerID">;
export type CertificateID = Brand<Uint8Array, "CertificateID">;

export type UserRole = {
  id: UserRoleID;
  name: string; // 'Admin' | 'Editor'
};

// ==========================================
// 2. Users Table
// ==========================================
export type User = {
  id: UserID;
  email: string;
  password_hash: string;
  last_name: string;
  first_name: string;
  role_id: UserRoleID;
  last_login: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

// ==========================================
// 3. Earners Table
// ==========================================
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

// ==========================================
// 4. Certificates Table
// ==========================================
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

// ==========================================
// 5. Certificates View (with Status)
// ==========================================
// We can extend the base Certificate type to add the calculated status
export type CertificateWithStatus = Certificate & {
  status: "valide" | "expiré";
};

// ==========================================
// DTOs (Data Transfer Objects) for Inserts
// ==========================================
// These exclude generated columns (created_at, updated_at, full_name, etc.)
// which SQLite handles automatically.

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
  is_laureat?: 0 | 1;
  created_by: UserID;
};

export type InsertCertificateDTO = {
  code: string;
  earner_id: EarnerID;
  created_by: UserID;
  issued_at: string;
  validity_years?: number;
};
