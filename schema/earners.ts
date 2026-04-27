import type { CertificateID, EarnerID, UserID } from "@databases/types";
import { z } from "zod";

const uuidBufferSchema = z
  .instanceof(Uint8Array)
  .refine((buf) => buf.length === 16, {
    message: "ID must be a 16-byte Buffer",
  });

export const insertEarnerSchema = z.object({
  id: uuidBufferSchema.transform((val) => val as EarnerID),
  first_name: z.string().min(1, "First name is required").max(100),
  last_name: z.string().min(1, "Last name is required").max(100),
  profile_url: z.url("Must be a valid URL"),
  job_title: z.string().min(2, "Job title is required"),
  company_name: z.string().min(2, "Company name is required"),
  is_laureat: z.coerce
    .number()
    .pipe(z.union([z.literal(0), z.literal(1)]))
    .transform((val) => (val === 1 ? (1 as const) : undefined))
    .optional(),
  created_by: uuidBufferSchema.transform((val) => val as UserID),
  cert_id: uuidBufferSchema.transform((val) => val as CertificateID),
  code: z.string().trim().min(3, "Certificate code is required"),
  issued_at: z.iso.date("Must be a valid date format (YYYY-MM-DD)"),
});

export const earnerFormSchema = insertEarnerSchema.omit({
  id: true,
  cert_id: true,
  created_by: true,
});

export type EarnerFormInput = z.infer<typeof earnerFormSchema>;
