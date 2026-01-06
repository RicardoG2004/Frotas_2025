import { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useGetClientesSelect } from '@/pages/platform/clientes/queries/clientes-queries'
import { useGetLicencasByCliente } from '@/pages/platform/licencas/queries/licencas-queries'
import { useCreateUtilizador } from '@/pages/platform/utilizadores/queries/utilizadores-mutations'
import { Eye, EyeOff } from 'lucide-react'
import { getErrorMessage, handleApiError } from '@/utils/error-handlers'
import { toast } from '@/utils/toast-utils'
import { roleConfig } from '@/constants/roles'
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

const utilizadorFormSchema = z
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
    clienteId: z.string({ required_error: 'O Cliente é obrigatório' }),
    perfilId: z.string({ required_error: 'O Perfil é obrigatório' }),
    roleId: z.string({ required_error: 'O Role é obrigatório' }),
    licencaId: z.string({ required_error: 'A Licença é obrigatória' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As passwords não coincidem',
    path: ['confirmPassword'],
  })

type UtilizadorFormSchemaType = z.infer<typeof utilizadorFormSchema>

interface UtilizadorCreateFormProps {
  modalClose: () => void
}

export function UtilizadorCreateForm({
  modalClose,
}: UtilizadorCreateFormProps) {
  const { data: clientesData } = useGetClientesSelect()
  const createUtilizador = useCreateUtilizador()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const form = useForm<UtilizadorFormSchemaType>({
    resolver: zodResolver(utilizadorFormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      clienteId: undefined,
      perfilId: '',
      roleId: '',
      licencaId: '',
    },
  })

  const watchClienteId = form.watch('clienteId')
  const watchRole = form.watch('roleId')
  console.log('Selected role:', watchRole)
  const { data: licencasData } = useGetLicencasByCliente(watchClienteId)

  const onSubmit = async (data: UtilizadorFormSchemaType) => {
    try {
      const { confirmPassword, ...submitData } = data

      const response = await createUtilizador.mutateAsync(submitData)

      if (response.info.succeeded) {
        toast.success('Utilizador criado com sucesso!')
        modalClose()
      } else {
        toast.error(getErrorMessage(response, 'Erro ao criar utilizador'))
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      toast.error(handleApiError(error, 'Erro ao criar utilizador'))
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

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8'>
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
                        {Object.entries(roleConfig).map(([role, config]) => (
                          <SelectItem key={role} value={role}>
                            <div className='flex items-center gap-2'>
                              <div
                                className='h-4 w-4 rounded-full'
                                style={{
                                  backgroundColor: config.color,
                                }}
                              />
                              <span>{config.label}</span>
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
          </div>

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
              name='clienteId'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cliente</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className='px-4 py-6 shadow-inner drop-shadow-xl'>
                        <SelectValue placeholder='Selecione um cliente' />
                      </SelectTrigger>
                      <SelectContent>
                        {clientesData?.map((cliente) => (
                          <SelectItem key={cliente.id} value={cliente.id}>
                            <div className='flex items-center gap-2 max-w-[200px] md:max-w-full'>
                              <span className='truncate'>{cliente.nome}</span>
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

            <FormField
              control={form.control}
              name='licencaId'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Licença</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className='px-4 py-6 shadow-inner drop-shadow-xl'>
                        <SelectValue placeholder='Selecione uma licença' />
                      </SelectTrigger>
                      <SelectContent>
                        {licencasData?.map((licenca) => (
                          <SelectItem key={licenca.id} value={licenca.id}>
                            {licenca.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className='flex flex-col justify-end space-y-2 pt-4 md:flex-row md:space-x-4 md:space-y-0'>
          <Button
            type='button'
            variant='outline'
            onClick={modalClose}
            className='w-full md:w-auto'
          >
            Cancelar
          </Button>

          <Button
            type='submit'
            disabled={createUtilizador.isPending}
            className='w-full md:w-auto'
          >
            {createUtilizador.isPending ? 'A criar...' : 'Criar'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
