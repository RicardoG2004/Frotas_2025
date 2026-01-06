import { z } from 'zod'

export const profileFormSchema = z.object({
  firstName: z
    .string()
    .min(1, { message: 'O Nome deve ter pelo menos 1 caráter' }),
  lastName: z
    .string()
    .min(1, { message: 'O Apelido deve ter pelo menos 1 caráter' }),
  email: z.string().email({ message: 'Email inválido' }),
  phoneNumber: z.string().optional(),
})

export type ProfileFormSchemaType = z.infer<typeof profileFormSchema>
