import { useState, useEffect } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useGetPerfis } from '@/pages/platform/perfis-admin/queries/perfis-admin-queries'
import { useCreateUser } from '@/pages/platform/utilizadores-admin/queries/utilizadores-admin-mutations'
import { Eye, EyeOff } from 'lucide-react'
import { useAuthStore } from '@/stores/auth-store'
import { getErrorMessage, handleApiError } from '@/utils/error-handlers'
import { toast } from '@/utils/toast-utils'
import { roleConfigAdmin } from '@/constants/roles'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const utilizadorAdminFormSchema = z
  .object({
    firstName: z
      .string({ required_error: 'O Nome é obrigatório' })
      .min(1, { message: 'O Nome deve ter pelo menos 1 caráter' }),
    lastName: z
      .string({ required_error: 'O Apelido é obrigatório' })
      .min(1, { message: 'O Apelido deve ter pelo menos 1 caráter' }),
    email: z
      .string({ required_error: 'O Email é obrigatório' })
      .email({ message: 'Email inválido' }),
    password: z
      .string({ required_error: 'A Password é obrigatória' })
      .min(8, { message: 'A Password deve ter pelo menos 8 caracteres' }),
    confirmPassword: z.string({
      required_error: 'A Confirmação de Password é obrigatória',
    }),
    perfilId: z.string().optional(),
    roleId: z.string({ required_error: 'O Role é obrigatório' }),
  })
  .superRefine((data, ctx) => {
    if (data.roleId.toLowerCase() === 'client' && !data.perfilId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Perfil é obrigatório para utilizadores com role Client',
        path: ['perfilId'],
      })
    }
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'As passwords não coincidem',
        path: ['confirmPassword'],
      })
    }
  })

type UtilizadorAdminFormSchemaType = z.infer<typeof utilizadorAdminFormSchema>

interface UtilizadorAdminCreateFormProps {
  modalClose: () => void
}

export function UtilizadorAdminCreateForm({
  modalClose,
}: UtilizadorAdminCreateFormProps) {
  const { clienteId, licencaId } = useAuthStore()
  const { data: perfisData } = useGetPerfis(licencaId)
  const createUtilizador = useCreateUser()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [showPerfilField, setShowPerfilField] = useState(false)

  const form = useForm<UtilizadorAdminFormSchemaType>({
    resolver: zodResolver(utilizadorAdminFormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      perfilId: '',
      roleId: '',
    },
  })

  // Watch for role changes to show/hide perfil field
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'roleId') {
        setShowPerfilField((value.roleId?.toLowerCase() ?? '') === 'client')

        // Clear perfil when switching to admin role
        if ((value.roleId?.toLowerCase() ?? '') !== 'client') {
          form.setValue('perfilId', '')
        }
      }
    })

    return () => subscription.unsubscribe()
  }, [form])

  const onSubmit = async (data: UtilizadorAdminFormSchemaType) => {
    try {
      const { confirmPassword, ...submitData } = data

      // Only include perfilId if role is client
      if (submitData.roleId.toLowerCase() !== 'client') {
        delete submitData.perfilId
      }

      const finalData = {
        ...submitData,
        clienteId: clienteId,
        licencaId: licencaId,
      }

      console.log('Submitting user data:', finalData)

      const response = await createUtilizador.mutateAsync(finalData)

      console.log('Create user response:', response)

      if (response.info.succeeded) {
        toast.success('Utilizador criado com sucesso!')
      } else {
        toast.error(getErrorMessage(response, 'Erro ao criar utilizador'))
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      toast.error(handleApiError(error, 'Erro ao criar utilizador'))
    } finally {
      modalClose()
      form.reset()
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='space-y-4 w-full'
        autoComplete='off'
      >
        <div className='grid grid-cols-1 gap-4 md:gap-8'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8'>
            <FormField
              control={form.control}
              name='firstName'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Introduza o nome'
                      {...field}
                      className='px-4 py-6 shadow-inner drop-shadow-xl'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='lastName'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Apelido</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Introduza o apelido'
                      {...field}
                      className='px-4 py-6 shadow-inner drop-shadow-xl'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type='email'
                    placeholder='Introduza o email'
                    {...field}
                    className='px-4 py-6 shadow-inner drop-shadow-xl'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8'>
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className='relative'>
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        placeholder='Introduza a password'
                        {...field}
                        className='px-4 py-6 shadow-inner drop-shadow-xl'
                      />
                      <button
                        type='button'
                        onClick={() => setShowPassword(!showPassword)}
                        className='absolute right-3 top-1/2 -translate-y-1/2'
                      >
                        {showPassword ? (
                          <EyeOff className='h-5 w-5 text-gray-500' />
                        ) : (
                          <Eye className='h-5 w-5 text-gray-500' />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='confirmPassword'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirmar Password</FormLabel>
                  <FormControl>
                    <div className='relative'>
                      <Input
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder='Confirme a password'
                        {...field}
                        className='px-4 py-6 shadow-inner drop-shadow-xl'
                      />
                      <button
                        type='button'
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className='absolute right-3 top-1/2 -translate-y-1/2'
                      >
                        {showConfirmPassword ? (
                          <EyeOff className='h-5 w-5 text-gray-500' />
                        ) : (
                          <Eye className='h-5 w-5 text-gray-500' />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8'>
            <FormField
              control={form.control}
              name='roleId'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className='px-4 py-6 shadow-inner drop-shadow-xl'>
                        <SelectValue placeholder='Selecione uma role' />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(roleConfigAdmin).map(([role]) => (
                          <SelectItem key={role} value={role}>
                            <div className='flex items-center gap-2'>
                              <div
                                className='h-4 w-4 rounded-full'
                                style={{
                                  backgroundColor:
                                    roleConfigAdmin[
                                      role as keyof typeof roleConfigAdmin
                                    ].color,
                                }}
                              />
                              <span>
                                {
                                  roleConfigAdmin[
                                    role as keyof typeof roleConfigAdmin
                                  ].label
                                }
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {showPerfilField && (
              <FormField
                control={form.control}
                name='perfilId'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Perfil</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className='px-4 py-6 shadow-inner drop-shadow-xl'>
                          <SelectValue placeholder='Selecione um perfil' />
                        </SelectTrigger>
                        <SelectContent>
                          {perfisData?.map((perfil) => (
                            <SelectItem key={perfil.id} value={perfil.id || ''}>
                              <div className='flex items-center gap-2 max-w-[200px] md:max-w-full'>
                                <span className='truncate'>{perfil.nome}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>
        </div>

        <div className='flex flex-col-reverse md:flex-row justify-end gap-4 md:gap-8 pt-4'>
          <Button
            type='button'
            variant='outline'
            onClick={modalClose}
            className='w-full md:w-24'
          >
            Cancelar
          </Button>
          <Button
            type='submit'
            className='w-full md:w-24'
            disabled={createUtilizador.isPending}
          >
            {createUtilizador.isPending ? 'A criar...' : 'Criar'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
