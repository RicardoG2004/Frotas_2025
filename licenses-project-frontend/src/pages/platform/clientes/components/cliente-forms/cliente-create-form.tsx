import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCreateCliente } from '@/pages/platform/clientes/queries/clientes-mutations'
import { getErrorMessage, handleApiError } from '@/utils/error-handlers'
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

const clienteFormSchema = z.object({
  nome: z
    .string({ required_error: 'O Nome é obrigatório' })
    .min(1, { message: 'O Nome deve ter pelo menos 1 caráter' }),
  sigla: z
    .string({ required_error: 'A Sigla é obrigatória' })
    .min(1, { message: 'A Sigla deve ter pelo menos 1 caráter' }),
  nif: z
    .string({ required_error: 'O NIF é obrigatório' })
    .length(9, { message: 'O NIF deve ter exatamente 9 caráters' }),
  ativo: z.boolean(),
  dadosExternos: z.boolean(),
  dadosUrl: z
    .string({ required_error: 'A URL dos dados é obrigatória' })
    .min(1, { message: 'A URL dos dados não pode estar vazia' }),
})

type ClienteFormSchemaType = z.infer<typeof clienteFormSchema>

const ClienteCreateForm = ({ modalClose }: { modalClose: () => void }) => {
  const createCliente = useCreateCliente()

  const form = useForm<ClienteFormSchemaType>({
    resolver: zodResolver(clienteFormSchema),
    defaultValues: {
      nome: '',
      sigla: '',
      nif: '',
      ativo: true,
      dadosExternos: false,
      dadosUrl: '',
    },
  })

  const onSubmit = async (data: ClienteFormSchemaType) => {
    try {
      const response = await createCliente.mutateAsync(data)
      if (response.info.succeeded) {
        toast.success('Cliente criado com sucesso!')
        modalClose()
      } else {
        toast.error(getErrorMessage(response, 'Erro ao criar cliente'))
      }
    } catch (error) {
      toast.error(handleApiError(error, 'Erro ao criar cliente'))
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='space-y-4'
        autoComplete='off'
      >
        <div className='grid grid-cols-1 gap-x-8 gap-y-4 md:grid-cols-12'>
          <div className='col-span-full md:col-span-8'>
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
          </div>

          <div className='col-span-full md:col-span-4'>
            <FormField
              control={form.control}
              name='sigla'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sigla</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Introduza a sigla'
                      {...field}
                      className='px-4 py-6 shadow-inner drop-shadow-xl'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className='col-span-full md:col-span-12'>
            <div className='grid grid-cols-1 md:grid-cols-12 gap-x-8 gap-y-4'>
              <div className='col-span-full md:col-span-4'>
                <FormField
                  control={form.control}
                  name='nif'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>NIF</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='Introduza o NIF'
                          {...field}
                          className='px-4 py-6 shadow-inner drop-shadow-xl'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className='col-span-full md:col-span-8'>
                <FormField
                  control={form.control}
                  name='dadosUrl'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL dos Dados</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='Introduza a URL dos dados'
                          {...field}
                          className='px-4 py-6 shadow-inner drop-shadow-xl'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>

          <div className='col-span-full md:col-span-12'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4'>
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

              <FormField
                control={form.control}
                name='dadosExternos'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dados Externos</FormLabel>
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
            disabled={createCliente.isPending}
            className='w-full md:w-auto'
          >
            {createCliente.isPending ? 'A criar...' : 'Criar'}
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default ClienteCreateForm
