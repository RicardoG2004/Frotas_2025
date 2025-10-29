import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAuthStore } from '@/stores/auth-store'
import { getErrorMessage, handleApiError } from '@/utils/error-handlers'
import { toast } from '@/utils/toast-utils'
import { Button } from '@/components/ui/button'
import { FormField, FormItem, FormLabel } from '@/components/ui/form'
import { FormControl, FormMessage } from '@/components/ui/form'
import { Form } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { useCreatePerfil } from '../../queries/perfis-admin-mutations'

const perfilAdminFormSchema = z.object({
  nome: z
    .string({ required_error: 'O Nome é obrigatório' })
    .min(1, { message: 'O Nome deve ter pelo menos 1 caráter' }),
  ativo: z.boolean(),
})

type PerfilAdminFormSchemaType = z.infer<typeof perfilAdminFormSchema>

interface PerfilAdminCreateFormProps {
  modalClose: () => void
}

const PerfilAdminCreateForm = ({ modalClose }: PerfilAdminCreateFormProps) => {
  const createPerfilMutation = useCreatePerfil()
  const { licencaId } = useAuthStore()

  const form = useForm<PerfilAdminFormSchemaType>({
    resolver: zodResolver(perfilAdminFormSchema),
    defaultValues: {
      nome: '',
      ativo: true,
    },
  })

  const onSubmit = async (values: PerfilAdminFormSchemaType) => {
    try {
      const response = await createPerfilMutation.mutateAsync({
        licencaId,
        data: {
          nome: values.nome,
          ativo: values.ativo,
        },
      })

      if (response.info.succeeded) {
        toast.success('Perfil criado com sucesso')
        modalClose()
      } else {
        toast.error(getErrorMessage(response, 'Erro ao criar perfil'))
      }
    } catch (error) {
      toast.error(handleApiError(error, 'Erro ao criar perfil'))
    }
  }

  return (
    <div className='space-y-4'>
      <Form {...form}>
        <form
          id='perfilCreateForm'
          onSubmit={form.handleSubmit(onSubmit)}
          className='space-y-4'
          autoComplete='off'
        >
          <div className='grid grid-cols-1 gap-x-8 gap-y-4'>
            <FormField
              control={form.control}
              name='nome'
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

            {/* <FormField
                control={form.control}
                name='ativo'
                render={({ field }) => (
                  <FormItem>
                    <div className='flex items-center space-x-2'>
                      <FormLabel>Ativo</FormLabel>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}

            <FormField
              control={form.control}
              name='ativo'
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
              disabled={createPerfilMutation.isPending}
              className='w-full md:w-auto'
            >
              {createPerfilMutation.isPending ? 'A criar...' : 'Criar'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

export default PerfilAdminCreateForm
