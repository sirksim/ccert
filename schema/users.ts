import z from "zod";

export const addUserSchema = z.object({
  first_name: z.string().min(1, "First name is required").max(100),
  last_name: z.string().min(1, "Last name is required").max(100),
  email: z.email(),
  role_id: z.coerce.number().pipe(z.union([z.literal(1), z.literal(2)])),
  password: z.string().min(4),
  confirm_password: z.string().min(4),
});
