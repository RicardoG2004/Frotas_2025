import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { PerfilDTO } from '@/types/dtos'
import { useAuthStore } from '@/stores/auth-store'
import { handleApiError } from '@/utils/error-handlers'
import { toast } from '@/utils/toast-utils'
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
import { Switch } from '@/components/ui/switch'
import { useUpdatePerfil } from '../../queries/perfis-admin-mutations'

const formSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  ativo: z.boolean(),
})

type PerfilUpdateFormProps = {
  modalClose: () => void
  perfilId: string
  initialData: PerfilDTO
}

export default function PerfilAdminUpdateForm({
  modalClose,
  perfilId,
  initialData,
}: PerfilUpdateFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: initialData.nome,
      ativo: initialData.ativo,
    },
  })
  const { licencaId } = useAuthStore()
  const updatePerfilMutation = useUpdatePerfil()

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await updatePerfilMutation.mutateAsync({
        licencaId: licencaId,
        id: perfilId,
        data: values,
      })
      modalClose()
    } catch (error) {
      toast.error(handleApiError(error, 'Erro ao atualizar perfil'))
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='space-y-4'
        autoComplete='off'
      >
        <FormField
          control={form.control}
          name='nome'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='ativo'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Estado</FormLabel>
              <FormControl>
                <div className='flex h-[50px] items-center justify-between rounded-lg border px-4 shadow-inner drop-shadow-xl'>
                  <span className='text-sm text-muted-foreground'>Ativo</span>
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
            disabled={updatePerfilMutation.isPending}
            className='w-full md:w-auto'
          >
            {updatePerfilMutation.isPending ? 'A atualizar...' : 'Atualizar'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
