import { useMemo, useEffect, useRef } from 'react'
import { z } from 'zod'
import { format, parseISO } from 'date-fns'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useGetAplicacoes } from '@/pages/application/aplicacoes/queries/aplicacoes-queries'
import { useUpdateAppUpdate } from '@/pages/application/app-updates/queries/app-updates-mutations'
import { UpdateType } from '@/types/dtos'
import { getErrorMessage, handleApiError } from '@/utils/error-handlers'
import { toast } from '@/utils/toast-utils'
import { isVersionGreater } from '@/utils/version-utils'
import { Button } from '@/components/ui/button'
import { DatePicker } from '@/components/ui/date-picker'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { ClienteMultiSelect } from '../cliente-multi-select'

// Semantic versioning regex: X.Y.Z where X, Y, Z are non-negative integers
const semanticVersionRegex = /^\d+\.\d+\.\d+$/

interface AppUpdateUpdateFormProps {
  modalClose: () => void
  updateId: string
  aplicacaoId: string
  initialData: {
    versao: string
    descricao: string
    dataLancamento: string
    ativo: boolean
    versaoMinima: string | null
    tipoUpdate: UpdateType
    notasAtualizacao: string | null
    clienteIds?: string[] | null
  }
}

const AppUpdateUpdateForm = ({
  modalClose,
  updateId,
  aplicacaoId,
  initialData,
}: AppUpdateUpdateFormProps) => {
  const updateUpdateMutation = useUpdateAppUpdate()
  const { data: aplicacoesData } = useGetAplicacoes()

  // Get current application version
  const aplicacao = aplicacoesData?.info.data?.find(
    (app) => app.id === aplicacaoId
  )
  const currentAppVersion = aplicacao?.versao
  const currentAppVersionRef = useRef(currentAppVersion)
  const initialVersionRef = useRef(initialData.versao)

  // Update ref when version changes
  useEffect(() => {
    currentAppVersionRef.current = currentAppVersion
  }, [currentAppVersion])

  // Create schema with dynamic version check using ref
  const appUpdateFormSchema = useMemo(
    () =>
      z.object({
        versao: z
          .string({ required_error: 'A Versão é obrigatória' })
          .min(1, { message: 'A Versão deve ter pelo menos 1 caráter' })
          .regex(semanticVersionRegex, {
            message: 'A Versão deve seguir o formato X.Y.Z (ex: 1.2.3)',
          })
          .refine(
            (val) => {
              const version = currentAppVersionRef.current
              const initialVersion = initialVersionRef.current

              // Allow the same version as the initial version (updating existing update)
              if (val === initialVersion) return true

              // If no current version, allow any
              if (!version) return true

              // If changing version, it must be greater than current app version
              return isVersionGreater(val, version)
            },
            () => {
              const version = currentAppVersionRef.current
              return {
                message: version
                  ? `A versão deve ser superior à versão atual da aplicação (${version})`
                  : 'A versão deve ser válida',
              }
            }
          ),
        descricao: z
          .string({ required_error: 'A Descrição é obrigatória' })
          .min(1, { message: 'A Descrição deve ter pelo menos 1 caráter' }),
        dataLancamento: z.date({
          required_error: 'A Data de Lançamento é obrigatória',
        }),
        ativo: z.boolean().default(true),
        versaoMinima: z
          .string()
          .optional()
          .refine((val) => !val || semanticVersionRegex.test(val), {
            message: 'A Versão Mínima deve seguir o formato X.Y.Z (ex: 1.2.3)',
          }),
        tipoUpdate: z.nativeEnum(UpdateType).default(UpdateType.Both),
        notasAtualizacao: z.string().optional(),
        clienteIds: z.array(z.string()).optional(),
      }),
    []
  )
  type AppUpdateFormSchemaType = z.infer<typeof appUpdateFormSchema>

  const form = useForm<AppUpdateFormSchemaType>({
    resolver: zodResolver(appUpdateFormSchema),
    defaultValues: {
      versao: initialData.versao,
      descricao: initialData.descricao,
      dataLancamento: parseISO(initialData.dataLancamento),
      ativo: initialData.ativo,
      versaoMinima: initialData.versaoMinima ?? undefined,
      tipoUpdate: initialData.tipoUpdate || UpdateType.Both,
      notasAtualizacao: initialData.notasAtualizacao || '',
      clienteIds: initialData.clienteIds || [],
    },
  })

  const onSubmit = async (values: AppUpdateFormSchemaType) => {
    try {
      const response = await updateUpdateMutation.mutateAsync({
        id: updateId,
        data: {
          versao: values.versao,
          descricao: values.descricao,
          dataLancamento: format(
            values.dataLancamento,
            "yyyy-MM-dd'T'HH:mm:ss"
          ),
          ativo: values.ativo,
          obrigatorio: true,
          versaoMinima: values.versaoMinima || undefined,
          tipoUpdate: values.tipoUpdate,
          aplicacaoId: aplicacaoId,
          notasAtualizacao: values.notasAtualizacao || undefined,
          clienteIds:
            values.clienteIds && values.clienteIds.length > 0
              ? values.clienteIds
              : undefined,
        },
      })

      if (response.info.succeeded) {
        toast.success('Atualização atualizada com sucesso')
        modalClose()
      } else {
        toast.error(getErrorMessage(response, 'Erro ao atualizar atualização'))
      }
    } catch (error) {
      toast.error(handleApiError(error, 'Erro ao atualizar atualização'))
    }
  }

  return (
    <div className='space-y-4'>
      <Form {...form}>
        <form
          id='appUpdateUpdateForm'
          onSubmit={form.handleSubmit(onSubmit, () => {
            toast.error('Por favor, corrija os erros no formulário')
          })}
          className='space-y-4'
          autoComplete='off'
        >
          <Tabs defaultValue='general' className='w-full'>
            <TabsList className='grid w-full grid-cols-3 mb-6'>
              <TabsTrigger
                value='general'
                className='data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:font-semibold data-[state=active]:shadow-md transition-all'
              >
                Geral
              </TabsTrigger>
              <TabsTrigger
                value='description'
                className='data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:font-semibold data-[state=active]:shadow-md transition-all'
              >
                Descrição
              </TabsTrigger>
              <TabsTrigger
                value='clients'
                className='data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:font-semibold data-[state=active]:shadow-md transition-all'
              >
                Clientes
              </TabsTrigger>
            </TabsList>

            <TabsContent value='general' className='space-y-4'>
              <div className='grid grid-cols-1 gap-x-8 gap-y-4 md:grid-cols-4'>
                <FormField
                  control={form.control}
                  name='versao'
                  render={({ field }) => (
                    <FormItem className='md:col-span-1'>
                      <FormLabel>Versão</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='Ex: 1.2.3'
                          {...field}
                          className='px-4 py-6 shadow-inner drop-shadow-xl'
                        />
                      </FormControl>
                      <FormDescription>
                        Formato: X.Y.Z (ex: 1.2.3)
                        {currentAppVersion && (
                          <span className='block mt-1 text-xs text-muted-foreground'>
                            Versão atual da aplicação: {currentAppVersion}
                          </span>
                        )}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='versaoMinima'
                  render={({ field }) => (
                    <FormItem className='md:col-span-1'>
                      <FormLabel>Versão Mínima</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='Ex: 1.0.0'
                          {...field}
                          className='px-4 py-6 shadow-inner drop-shadow-xl'
                        />
                      </FormControl>
                      <FormDescription>
                        Versão mínima necessária para aplicar esta atualização
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='dataLancamento'
                  render={({ field }) => (
                    <FormItem className='md:col-span-2'>
                      <FormLabel>Data de Lançamento</FormLabel>
                      <FormControl>
                        <DatePicker
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='tipoUpdate'
                  render={({ field }) => (
                    <FormItem className='md:col-span-2'>
                      <FormLabel>Tipo de Atualização</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={(value) =>
                            field.onChange(Number(value) as UpdateType)
                          }
                          value={field.value.toString()}
                        >
                          <SelectTrigger className='px-4 py-6 shadow-inner drop-shadow-xl'>
                            <SelectValue placeholder='Selecione o tipo de atualização' />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value={UpdateType.API.toString()}>
                              API
                            </SelectItem>
                            <SelectItem value={UpdateType.Frontend.toString()}>
                              Frontend
                            </SelectItem>
                            <SelectItem value={UpdateType.Both.toString()}>
                              Ambos (API + Frontend)
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormDescription>
                        Tipo de atualização: API, Frontend ou ambos
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='ativo'
                  render={({ field }) => (
                    <FormItem className='md:col-span-2'>
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
            </TabsContent>

            <TabsContent value='description' className='space-y-4'>
              <FormField
                control={form.control}
                name='descricao'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='Introduza a descrição da atualização'
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
                name='notasAtualizacao'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notas de Atualização</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='Introduza as notas de atualização (opcional)'
                        {...field}
                        className='shadow-inner drop-shadow-xl'
                        rows={4}
                      />
                    </FormControl>
                    <FormDescription>
                      Notas de lançamento que serão exibidas aos utilizadores
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </TabsContent>

            <TabsContent value='clients' className='space-y-4'>
              <FormField
                control={form.control}
                name='clienteIds'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Clientes (Opcional)</FormLabel>
                    <FormControl>
                      <ClienteMultiSelect
                        value={field.value || []}
                        onChange={field.onChange}
                        aplicacaoId={aplicacaoId}
                      />
                    </FormControl>
                    <FormDescription>
                      Selecione clientes específicos para esta atualização.
                      Apenas clientes com licença para esta aplicação são
                      exibidos. Se nenhum cliente for selecionado, a atualização
                      será lançada para todos os clientes com licença.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </TabsContent>
          </Tabs>

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
              disabled={updateUpdateMutation.isPending}
              className='w-full md:w-auto'
            >
              {updateUpdateMutation.isPending ? 'A atualizar...' : 'Atualizar'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

export default AppUpdateUpdateForm
