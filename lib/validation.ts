// ============================================================
// LIB — Validation du formulaire de contact
// Zod schema + type inféré pour React Hook Form
// ============================================================

import { z } from "zod";

export const contactSchema = z.object({
  name: z
    .string()
    .min(2, "Le nom doit faire au moins 2 caractères")
    .max(60, "Nom trop long"),

  email: z
    .string()
    .email("Adresse email invalide"),

  subject: z
    .string()
    .min(5, "Le sujet doit faire au moins 5 caractères")
    .max(100, "Sujet trop long"),

  message: z
    .string()
    .min(20, "Message trop court (min. 20 caractères)")
    .max(1000, "Message trop long (max. 1000 caractères)"),
});

// Type TypeScript inféré automatiquement du schéma Zod
// → utilisé comme type générique dans useForm<ContactFormData>
export type ContactFormData = z.infer<typeof contactSchema>;
