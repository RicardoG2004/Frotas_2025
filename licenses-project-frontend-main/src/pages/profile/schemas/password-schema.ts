import { z } from 'zod'

export const passwordFormSchema = z
  .object({
    password: z
      .string()
      .min(1, { message: 'A palavra-passe atual é obrigatória' }),
    newPassword: z.string().min(8, {
      message: 'A nova palavra-passe deve ter pelo menos 8 caracteres',
    }),
    confirmNewPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: 'As palavras-passe não coincidem',
    path: ['confirmNewPassword'],
  })

export type PasswordFormSchemaType = z.infer<typeof passwordFormSchema>
