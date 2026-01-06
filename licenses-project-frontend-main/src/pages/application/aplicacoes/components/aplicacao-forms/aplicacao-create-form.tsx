import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCreateAplicacao } from '@/pages/application/aplicacoes/queries/aplicacoes-mutations'
import { useGetAreasSelect } from '@/pages/application/areas/queries/areas-queries'
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

const aplicacaoFormSchema = z.object({
  nome: z
    .string({ required_error: 'O Nome é obrigatório' })
    .min(1, { message: 'O Nome deve ter pelo menos 1 caráter' }),
  descricao: z
    .string({ required_error: 'A Descrição é obrigatória' })
    .min(1, { message: 'A Descrição deve ter pelo menos 1 caráter' }),
  ativo: z.boolean(),
  areaId: z.string({ required_error: 'A Área é obrigatória' }),
})

type AplicacaoFormSchemaType = z.infer<typeof aplicacaoFormSchema>

interface AplicacaoCreateFormProps {
  modalClose: () => void
  preSelectedAreaId?: string
}

const AplicacaoCreateForm = ({
  modalClose,
  preSelectedAreaId,
}: AplicacaoCreateFormProps) => {
  const { data: areasData } = useGetAreasSelect()
  const createAplicacaoMutation = useCreateAplicacao()

  const form = useForm<AplicacaoFormSchemaType>({
    resolver: zodResolver(aplicacaoFormSchema),
    defaultValues: {
      nome: '',
      descricao: '',
      ativo: true,
      areaId: preSelectedAreaId || '',
    },
  })

  const onSubmit = async (values: AplicacaoFormSchemaType) => {
    try {
      const response = await createAplicacaoMutation.mutateAsync({
        nome: values.nome,
        descricao: values.descricao || '',
        versao: '1.0.0',
        ativo: values.ativo,
        areaId: values.areaId,
      })

      if (response.info.succeeded) {
        toast.success('Aplicação criada com sucesso')
        modalClose()
      } else {
        toast.error(getErrorMessage(response, 'Erro ao criar aplicação'))
      }
    } catch (error) {
      toast.error(handleApiError(error, 'Erro ao criar aplicação'))
    }
  }

  return (
    <div className='space-y-4'>
      <Form {...form}>
        <form
          id='aplicacaoCreateForm'
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
              name='areaId'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Área</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className='px-4 py-6 shadow-inner drop-shadow-xl'>
                        <SelectValue placeholder='Selecione uma área'>
                          {field.value &&
                            areasData?.find((a) => a.id === field.value) && (
                              <div className='flex items-center gap-2'>
                                <div
                                  className='h-4 w-4 rounded-full'
                                  style={{
                                    backgroundColor: areasData?.find(
                                      (a) => a.id === field.value
                                    )?.color,
                                  }}
                                />
                                <span>
                                  {
                                    areasData?.find((a) => a.id === field.value)
                                      ?.nome
                                  }
                                </span>
                              </div>
                            )}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {areasData?.map((area) => (
                          <SelectItem key={area.id || ''} value={area.id || ''}>
                            <div className='flex items-center gap-2'>
                              <div
                                className='h-4 w-4 rounded-full'
                                style={{ backgroundColor: area.color }}
                              />
                              {area.nome}
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
              disabled={createAplicacaoMutation.isPending}
              className='w-full md:w-auto'
            >
              {createAplicacaoMutation.isPending ? 'A criar...' : 'Criar'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

export default AplicacaoCreateForm
