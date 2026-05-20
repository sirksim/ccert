import z from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "L'adresse email est obligatoire.")
    .email("Entrez une adresse email valide."),
  password: z
    .string()
    .min(1, "Le mot de passe est obligatoire.")
    .min(4, "Le mot de passe doit contenir au moins 4 caractères."),
});
