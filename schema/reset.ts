import z from "zod";

export const resetPasswordSchema = z
  .object({
    email: z
      .string()
      .trim()
      .min(1, "L'adresse email est obligatoire.")
      .email("Entrez une adresse email valide."),
    password: z
      .string()
      .min(8, "Le mot de passe doit contenir au moins 8 caractères.")
      .regex(/[A-Z]/, "Le mot de passe doit contenir au moins une majuscule.")
      .regex(/[a-z]/, "Le mot de passe doit contenir au moins une minuscule.")
      .regex(/[0-9]/, "Le mot de passe doit contenir au moins un chiffre."),
    confirm_password: z.string().min(1, "Confirmez le mot de passe."),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Les mots de passe ne correspondent pas.",
    path: ["confirm_password"],
  });
