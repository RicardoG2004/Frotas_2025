import { useEffect } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useGetClientesSelect } from '@/pages/platform/clientes/queries/clientes-queries'
import { useGetLicencasByCliente } from '@/pages/platform/licencas/queries/licencas-queries'
import { useUpdateUtilizador } from '@/pages/platform/utilizadores/queries/utilizadores-mutations'
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
import { Switch } from '@/components/ui/switch'

const utilizadorFormSchema = z.object({
  firstName: z
    .string()
    .min(1, { message: 'O Nome deve ter pelo menos 1 caráter' }),
  lastName: z
    .string()
    .min(1, { message: 'O Apelido deve ter pelo menos 1 caráter' }),
  email: z.string().email({ message: 'Email inválido' }),
  roleId: z.string().min(1, { message: 'Role é obrigatória' }),
  clienteId: z.string({ required_error: 'O Cliente é obrigatório' }),
  perfilId: z.string().optional(),
  licencaId: z.string().min(1, { message: 'A Licença é obrigatória' }),
  isActive: z.boolean().default(true),
})

type UtilizadorFormSchemaType = z.infer<typeof utilizadorFormSchema>

interface UtilizadorUpdateFormProps {
  modalClose: () => void
  utilizadorId: string
  initialData: {
    firstName: string
    lastName: string
    email: string
    clienteId: string
    roleId: string
    isActive: boolean
    perfilId?: string
    licencaId?: string
  }
}

export function UtilizadorUpdateForm({
  modalClose,
  utilizadorId,
  initialData,
}: UtilizadorUpdateFormProps) {
  const { data: clientesData } = useGetClientesSelect()
  const updateUtilizador = useUpdateUtilizador()

  console.log('Initial data:', initialData)

  const form = useForm<UtilizadorFormSchemaType>({
    resolver: zodResolver(utilizadorFormSchema),
    defaultValues: {
      firstName: initialData.firstName,
      lastName: initialData.lastName,
      email: initialData.email,
      clienteId: initialData.clienteId,
      perfilId: initialData.perfilId ?? '',
      roleId: initialData.roleId,
      licencaId: initialData.licencaId ?? undefined,
      isActive: initialData.isActive,
    },
  })
  const watchClienteId = form.watch('clienteId')
  const watchRole = form.watch('roleId')
  const { data: licencasData } = useGetLicencasByCliente(watchClienteId)

  console.log('Licencas data:', licencasData)
  console.log('Initial licencaId:', initialData.licencaId)

  useEffect(() => {
    if (licencasData && initialData.licencaId) {
      const licencaExists = licencasData.some(
        (licenca) =>
          licenca.id.toLowerCase() === initialData.licencaId!.toLowerCase()
      )
      if (licencaExists) {
        const currentValue = form.getValues('licencaId')
        if (!currentValue) {
          form.setValue('licencaId', initialData.licencaId)
        }
      }
    }
  }, [licencasData])

  useEffect(() => {
    console.log('Role changed:', watchRole)
    console.log('Available licenses:', licencasData)
    console.log('Initial license:', initialData.licencaId)
  }, [watchRole, licencasData, initialData.licencaId, form])

  useEffect(() => {
    console.log('Initial license ID:', initialData.licencaId)
    console.log(
      'Available licenses:',
      licencasData?.map((l) => l.id)
    )
    console.log('Form license value:', form.getValues('licencaId'))
  }, [licencasData, initialData.licencaId, form])

  const onSubmit = async (data: UtilizadorFormSchemaType) => {
    try {
      console.log('DATA', data)
      const response = await updateUtilizador.mutateAsync({
        id: utilizadorId,
        data: {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          roleId: data.roleId,
          isActive: data.isActive,
          perfilId: data.perfilId || '',
          licencaId: data.licencaId || '',
          clienteId: initialData.clienteId,
        },
      })

      if (response.info.succeeded) {
        toast.success('Utilizador atualizado com sucesso!')
        modalClose()
      } else {
        toast.error(getErrorMessage(response, 'Erro ao atualizar utilizador'))
      }
    } catch (error) {
      toast.error(handleApiError(error, 'Erro ao atualizar utilizador'))
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
              name='clienteId'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cliente</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled
                    >
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
                    <Select
                      onValueChange={field.onChange}
                      value={field.value || ''}
                    >
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

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8'>
            <FormField
              control={form.control}
              name='isActive'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estado</FormLabel>
                  <FormControl>
                    <div className='flex h-[50px] items-center justify-between rounded-lg border px-4 shadow-inner drop-shadow-xl'>
                      <span className='text-sm text-muted-foreground'>
                        Ativo
                      </span>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </div>
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
            disabled={updateUtilizador.isPending}
            className='w-full md:w-auto'
          >
            {updateUtilizador.isPending ? 'A atualizar...' : 'Atualizar'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
