import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useGetAplicacoesSelect } from '@/pages/application/aplicacoes/queries/aplicacoes-queries'
import { useGetClientesSelect } from '@/pages/platform/clientes/queries/clientes-queries'
import { useUpdateLicenca } from '@/pages/platform/licencas/queries/licencas-mutations'
import { getErrorMessage, handleApiError } from '@/utils/error-handlers'
import { toast } from '@/utils/toast-utils'
import { Button } from '@/components/ui/button'
import { DatePicker } from '@/components/ui/date-picker'
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

const licencaFormSchema = z.object({
  nome: z
    .string({ required_error: 'O Nome é obrigatório' })
    .min(1, { message: 'O Nome deve ter pelo menos 1 caráter' }),
  dataInicio: z.date({ required_error: 'A Data de Início é obrigatória' }),
  dataFim: z.date({ required_error: 'A Data de Fim é obrigatória' }),
  numeroUtilizadores: z.number().min(1, { message: 'Mínimo de 1 utilizador' }),
  ativo: z.boolean(),
  aplicacaoId: z.string({ required_error: 'A Aplicação é obrigatória' }),
  clienteId: z.string({ required_error: 'O Cliente é obrigatório' }),
})

type LicencaFormSchemaType = z.infer<typeof licencaFormSchema>

interface LicencaUpdateFormProps {
  modalClose: () => void
  licencaId: string
  initialData: {
    nome: string
    dataInicio?: string | Date
    dataFim?: string | Date
    numeroUtilizadores: number
    ativo: boolean
    aplicacaoId: string
    clienteId: string
  }
}

const LicencaUpdateForm = ({
  modalClose,
  licencaId,
  initialData,
}: LicencaUpdateFormProps) => {
  const { data: aplicacoesData } = useGetAplicacoesSelect()
  const { data: clientesData } = useGetClientesSelect()
  const updateLicenca = useUpdateLicenca()

  const form = useForm<LicencaFormSchemaType>({
    resolver: zodResolver(licencaFormSchema),
    defaultValues: {
      nome: initialData.nome,
      dataInicio: initialData.dataInicio
        ? new Date(initialData.dataInicio)
        : undefined,
      dataFim: initialData.dataFim ? new Date(initialData.dataFim) : undefined,
      numeroUtilizadores: initialData.numeroUtilizadores,
      ativo: initialData.ativo,
      aplicacaoId: initialData.aplicacaoId,
      clienteId: initialData.clienteId,
    },
  })

  const onSubmit = async (data: LicencaFormSchemaType) => {
    try {
      const response = await updateLicenca.mutateAsync({
        id: licencaId,
        data: { ...data, id: licencaId },
      })
      if (response.info.succeeded) {
        toast.success('Licença atualizada com sucesso!')
        modalClose()
      } else {
        toast.error(getErrorMessage(response, 'Erro ao atualizar licença'))
      }
    } catch (error) {
      toast.error(handleApiError(error, 'Erro ao atualizar licença'))
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='w-full space-y-4'
        autoComplete='off'
      >
        <div className='grid grid-cols-1 gap-4 md:grid-cols-12 md:gap-8'>
          <div className='col-span-1 md:col-span-12'>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-12 md:gap-8'>
              <div className='col-span-1 md:col-span-8'>
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

              <div className='col-span-1 md:col-span-4'>
                <FormField
                  control={form.control}
                  name='numeroUtilizadores'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Número de Utilizadores</FormLabel>
                      <FormControl>
                        <Input
                          type='number'
                          placeholder='Introduza o número de utilizadores'
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
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

          <div className='col-span-1 md:col-span-12'>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-8'>
              <FormField
                control={form.control}
                name='dataInicio'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data Início</FormLabel>
                    <FormControl>
                      <DatePicker
                        {...field}
                        className='w-full'
                        placeholder='Selecione a data de início'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='dataFim'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data Fim</FormLabel>
                    <FormControl>
                      <DatePicker
                        {...field}
                        className='w-full'
                        placeholder='Selecione a data de fim'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className='col-span-1 md:col-span-12'>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-12 md:gap-8'>
              <div className='col-span-1 md:col-span-6'>
                <FormField
                  control={form.control}
                  name='aplicacaoId'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Aplicação</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger className='px-4 py-6 shadow-inner drop-shadow-xl'>
                            <SelectValue placeholder='Selecione uma aplicação'>
                              {field.value && aplicacoesData && (
                                <div className='flex items-center gap-2'>
                                  {aplicacoesData.find(
                                    (a) => a.id === field.value
                                  )?.area && (
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
                                    aplicacoesData.find(
                                      (a) => a.id === field.value
                                    )?.nome
                                  }
                                </div>
                              )}
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            {aplicacoesData?.map((aplicacao) => (
                              <SelectItem
                                key={aplicacao.id}
                                value={aplicacao.id}
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
              </div>

              <div className='col-span-1 md:col-span-6'>
                <FormField
                  control={form.control}
                  name='clienteId'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cliente</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger className='px-4 py-6 shadow-inner drop-shadow-xl'>
                            <SelectValue placeholder='Selecione um cliente' />
                          </SelectTrigger>
                          <SelectContent>
                            {clientesData?.map((cliente) => (
                              <SelectItem key={cliente.id} value={cliente.id}>
                                {cliente.nome}
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
          </div>

          <div className='col-span-1 md:col-span-6'>
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
            disabled={updateLicenca.isPending}
            className='w-full md:w-auto'
          >
            {updateLicenca.isPending ? 'A atualizar...' : 'Atualizar'}
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default LicencaUpdateForm
