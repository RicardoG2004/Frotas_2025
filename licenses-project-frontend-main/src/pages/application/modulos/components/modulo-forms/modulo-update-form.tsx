import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useGetAplicacoesSelect } from '@/pages/application/aplicacoes/queries/aplicacoes-queries'
import { useUpdateModulo } from '@/pages/application/modulos/queries/modulos-mutations'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'

const moduloFormSchema = z.object({
  nome: z
    .string({ required_error: 'O Nome é obrigatório' })
    .min(1, { message: 'O Nome deve ter pelo menos 1 caráter' }),
  descricao: z.string().optional(),
  ativo: z.boolean().default(true),
  aplicacaoId: z.string({ required_error: 'A Aplicação é obrigatória' }),
})

type ModuloFormSchemaType = z.infer<typeof moduloFormSchema>

interface ModuloUpdateFormProps {
  modalClose: () => void
  moduloId: string
  initialData: {
    nome: string
    descricao?: string
    ativo: boolean
    aplicacaoId: string
  }
}

const ModuloUpdateForm = ({
  modalClose,
  moduloId,
  initialData,
}: ModuloUpdateFormProps) => {
  const { data: aplicacoesData } = useGetAplicacoesSelect()
  const updateModuloMutation = useUpdateModulo()

  const form = useForm<ModuloFormSchemaType>({
    resolver: zodResolver(moduloFormSchema),
    defaultValues: {
      nome: initialData.nome,
      descricao: initialData.descricao || '',
      ativo: initialData.ativo,
      aplicacaoId: initialData.aplicacaoId,
    },
  })

  const onSubmit = async (values: ModuloFormSchemaType) => {
    try {
      const response = await updateModuloMutation.mutateAsync({
        id: moduloId,
        data: {
          id: moduloId,
          nome: values.nome,
          descricao: values.descricao || '',
          ativo: values.ativo,
          aplicacaoId: values.aplicacaoId,
        },
      })

      if (response.info.succeeded) {
        toast.success('Aplicação atualizada com sucesso')
        modalClose()
      } else {
        toast.error(getErrorMessage(response, 'Erro ao atualizar aplicação'))
      }
    } catch (error) {
      toast.error(handleApiError(error, 'Erro ao atualizar aplicação'))
    }
  }

  return (
    <div className='space-y-4'>
      <Form {...form}>
        <form
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

            <FormField
              control={form.control}
              name='descricao'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Introduza a descrição'
                      {...field}
                      className='shadow-inner drop-shadow-xl'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='aplicacaoId'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Aplicação</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className='px-4 py-6 shadow-inner drop-shadow-xl'>
                        <SelectValue placeholder='Selecione uma aplicação'>
                          {field.value && aplicacoesData && (
                            <div className='flex items-center gap-2'>
                              {aplicacoesData.find((a) => a.id === field.value)
                                ?.area && (
                                <div
                                  className='h-4 w-4 rounded-full'
                                  style={{
                                    backgroundColor: aplicacoesData.find(
                                      (a) => a.id === field.value
                                    )?.area?.color,
                                  }}
                                />
                              )}
                              {
                                aplicacoesData.find((a) => a.id === field.value)
                                  ?.nome
                              }
                            </div>
                          )}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {aplicacoesData?.map((aplicacao) => (
                          <SelectItem
                            key={aplicacao.id || ''}
                            value={aplicacao.id || ''}
                          >
                            <div className='flex items-center gap-2'>
                              {aplicacao.area && (
                                <div
                                  className='h-4 w-4 rounded-full'
                                  style={{
                                    backgroundColor: aplicacao.area.color,
                                  }}
                                />
                              )}
                              {aplicacao.nome}
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
              disabled={updateModuloMutation.isPending}
              className='w-full md:w-auto'
            >
              {updateModuloMutation.isPending ? 'Atualizando...' : 'Atualizar'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

export default ModuloUpdateForm
