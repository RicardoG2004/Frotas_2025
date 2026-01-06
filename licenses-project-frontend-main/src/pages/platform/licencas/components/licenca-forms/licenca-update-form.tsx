import { useEffect } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useGetAplicacoesSelect } from '@/pages/application/aplicacoes/queries/aplicacoes-queries'
import { useGetClientesSelect } from '@/pages/platform/clientes/queries/clientes-queries'
import {
  INTERNAL_AREA_ID,
  UPDATER_APP_ID,
  GSLP_MANAGER_APP_ID,
} from '@/pages/platform/licencas/constants'
import { useUpdateLicenca } from '@/pages/platform/licencas/queries/licencas-mutations'
import { Sparkles } from 'lucide-react'
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
  useOwnUpdater: z.boolean().optional(),
  frontendPath: z.string().optional(),
  apiPath: z.string().optional(),
  apiPoolName: z.string().optional(),
  frontendPoolName: z.string().optional(),
  url1: z.string().optional(),
  url2: z.string().optional(),
  url3: z.string().optional(),
  url4: z.string().optional(),
  url5: z.string().optional(),
  url6: z.string().optional(),
  url7: z.string().optional(),
  url8: z.string().optional(),
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
    versaoInstalada?: string
    versaoAplicacao?: string
    useOwnUpdater?: boolean
    frontendPath?: string
    apiPath?: string
    apiPoolName?: string
    frontendPoolName?: string
    url1?: string
    url2?: string
    url3?: string
    url4?: string
    url5?: string
    url6?: string
    url7?: string
    url8?: string
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
      useOwnUpdater: initialData.useOwnUpdater || false,
      frontendPath: initialData.frontendPath || '',
      apiPath: initialData.apiPath || '',
      apiPoolName: initialData.apiPoolName || '',
      frontendPoolName: initialData.frontendPoolName || '',
      url1: initialData.url1 || '',
      url2: initialData.url2 || '',
      url3: initialData.url3 || '',
      url4: initialData.url4 || '',
      url5: initialData.url5 || '',
      url6: initialData.url6 || '',
      url7: initialData.url7 || '',
      url8: initialData.url8 || '',
    },
  })

  const watchClienteId = form.watch('clienteId')
  const watchAplicacaoId = form.watch('aplicacaoId')

  // Check if the selected application belongs to "Gestão Interna" area
  const isInternalArea = watchAplicacaoId
    ? aplicacoesData?.find((a) => a.id === watchAplicacaoId)?.areaId ===
      INTERNAL_AREA_ID
    : false

  // Check application types by ID
  const isUpdaterApp = watchAplicacaoId === UPDATER_APP_ID
  const isGslpManagerApp = watchAplicacaoId === GSLP_MANAGER_APP_ID

  // Generate a short slug from client name (first letters of words or shortened version)
  const generateClientSlug = (clientName: string, sigla?: string): string => {
    // Use sigla if available and valid
    if (sigla && sigla.trim().length > 0) {
      return sigla
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remove accents
        .replace(/[^a-z0-9]/g, '') // Remove special chars
        .trim()
    }

    // Otherwise, create slug from first letters of words
    const words = clientName
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove accents
      .replace(/[^a-zA-Z0-9\s]/g, '') // Remove special chars
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0)

    if (words.length === 0) {
      // Fallback: use first 8 characters of normalized name
      return clientName
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]/g, '')
        .substring(0, 8)
    }

    // If single word, use first 6-8 characters
    if (words.length === 1) {
      return words[0].toLowerCase().substring(0, 8)
    }

    // Multiple words: use first letter of each word (max 4-5 letters)
    const initials = words
      .slice(0, 5)
      .map((word) => word[0].toLowerCase())
      .join('')

    return initials
  }

  // Generate a short slug from application name
  const generateApplicationSlug = (applicationName?: string): string => {
    if (!applicationName) {
      return 'app'
    }

    const nameWords = applicationName
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove accents
      .replace(/[^a-zA-Z0-9\s]/g, '') // Remove special chars
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0)

    if (nameWords.length > 0) {
      // Use first meaningful word
      const meaningfulWord = nameWords[0]
      if (meaningfulWord) {
        return meaningfulWord.toLowerCase().substring(0, 15)
      }
    }

    return 'app'
  }

  // Generate smart names from client and application
  const generateSmartNames = (
    clientName: string,
    sigla?: string,
    applicationName?: string
  ) => {
    const clientSlug = generateClientSlug(clientName, sigla)
    const appSlug = generateApplicationSlug(applicationName)
    const combinedSlug = `${clientSlug}-${appSlug}`

    return {
      frontendPath: `../${combinedSlug}-app`,
      apiPath: `../${combinedSlug}-api`,
      apiPoolName: `${combinedSlug}-api`,
      frontendPoolName: `${combinedSlug}-app`,
    }
  }

  // Function to apply smart name suggestions
  const applySmartNames = (force = false) => {
    if (!watchClienteId || !clientesData) {
      toast.error('Por favor, selecione um cliente primeiro')
      return
    }

    if (!watchAplicacaoId || !aplicacoesData) {
      toast.error('Por favor, selecione uma aplicação primeiro')
      return
    }

    const selectedCliente = clientesData.find((c) => c.id === watchClienteId)
    if (!selectedCliente) return

    const selectedAplicacao = aplicacoesData.find(
      (a) => a.id === watchAplicacaoId
    )
    if (!selectedAplicacao) return

    const currentFrontendPath = form.getValues('frontendPath')
    const currentApiPath = form.getValues('apiPath')
    const currentApiPoolName = form.getValues('apiPoolName')
    const currentFrontendPoolName = form.getValues('frontendPoolName')

    // Check if all fields are empty (for automatic fill)
    const allFieldsEmpty =
      !currentFrontendPath?.trim() &&
      !currentApiPath?.trim() &&
      !currentApiPoolName?.trim() &&
      !currentFrontendPoolName?.trim()

    // Only auto-fill if all fields are empty (unless force is true)
    if (!force && !allFieldsEmpty) {
      return
    }

    // Generate smart names
    const smartNames = generateSmartNames(
      selectedCliente.nome,
      selectedCliente.sigla,
      selectedAplicacao.nome
    )

    // Only fill fields that are empty (preserve existing values)
    let filledCount = 0
    if (!currentFrontendPath?.trim()) {
      form.setValue('frontendPath', smartNames.frontendPath)
      filledCount++
    }
    if (!currentApiPath?.trim()) {
      form.setValue('apiPath', smartNames.apiPath)
      filledCount++
    }
    if (!currentApiPoolName?.trim()) {
      form.setValue('apiPoolName', smartNames.apiPoolName)
      filledCount++
    }
    if (!currentFrontendPoolName?.trim()) {
      form.setValue('frontendPoolName', smartNames.frontendPoolName)
      filledCount++
    }

    if (filledCount > 0) {
      toast.success(
        `Sugestões aplicadas para ${filledCount} campo${filledCount > 1 ? 's' : ''} vazio${filledCount > 1 ? 's' : ''}`
      )
    } else {
      toast.info('Todos os campos já estão preenchidos')
    }
  }

  // Auto-fill IIS fields when client or application changes (only if fields are empty)
  useEffect(() => {
    if (watchClienteId && clientesData && watchAplicacaoId && aplicacoesData) {
      applySmartNames(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchClienteId, watchAplicacaoId, clientesData, aplicacoesData])

  const onSubmit = async (data: LicencaFormSchemaType) => {
    try {
      // Convert empty strings to undefined for optional IIS fields
      const submitData = {
        ...data,
        id: licencaId,
        frontendPath: data.frontendPath?.trim() || undefined,
        apiPath: data.apiPath?.trim() || undefined,
        apiPoolName: data.apiPoolName?.trim() || undefined,
        frontendPoolName: data.frontendPoolName?.trim() || undefined,
      }
      const response = await updateLicenca.mutateAsync({
        id: licencaId,
        data: submitData,
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
        <Tabs defaultValue='general' className='w-full'>
          <TabsList
            className={`grid w-full mb-6 border border-border bg-card shadow-sm ${
              !watchAplicacaoId
                ? 'grid-cols-1'
                : isGslpManagerApp || isUpdaterApp
                  ? 'grid-cols-2'
                  : 'grid-cols-3'
            }`}
          >
            <TabsTrigger
              value='general'
              className='data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:font-semibold data-[state=active]:shadow-md transition-all'
            >
              Geral
            </TabsTrigger>
            <TabsTrigger
              value='urls'
              className='data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:font-semibold data-[state=active]:shadow-md transition-all'
            >
              URLs
            </TabsTrigger>
            {!isGslpManagerApp && !isUpdaterApp && (
              <TabsTrigger
                value='iis'
                className='data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:font-semibold data-[state=active]:shadow-md transition-all'
              >
                Configuração IIS
              </TabsTrigger>
            )}
          </TabsList>
          <TabsContent value='general' className='space-y-4'>
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
                              placeholder='Insira o nome'
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
                              placeholder='Insira o número de utilizadores'
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
                                            backgroundColor:
                                              aplicacoesData.find(
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
                                            backgroundColor:
                                              aplicacao.area.color,
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
                                  <SelectItem
                                    key={cliente.id}
                                    value={cliente.id}
                                  >
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

              <div className='col-span-1 md:col-span-12'>
                <div className='grid grid-cols-1 gap-4 md:grid-cols-12 md:gap-8'>
                  <div className='col-span-1 md:col-span-6'>
                    <FormItem>
                      <FormLabel>Versão Instalada</FormLabel>
                      <FormControl>
                        <Input
                          value={initialData.versaoInstalada || ''}
                          disabled
                          placeholder='Ainda não atualizada'
                          className='px-4 py-6 shadow-inner drop-shadow-xl font-mono bg-muted'
                        />
                      </FormControl>
                      <FormDescription>
                        Esta versão é atualizada automaticamente pelo serviço de
                        atualização
                      </FormDescription>
                    </FormItem>
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
              </div>

              {!isInternalArea && (
                <div className='col-span-1 md:col-span-12'>
                  <FormField
                    control={form.control}
                    name='useOwnUpdater'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Atualizador</FormLabel>
                        <FormControl>
                          <div className='flex h-[50px] items-center justify-between rounded-lg border px-4 shadow-inner drop-shadow-xl'>
                            <span className='text-sm text-muted-foreground'>
                              Usa atualizador próprio do cliente
                            </span>
                            <Switch
                              checked={field.value || false}
                              onCheckedChange={field.onChange}
                            />
                          </div>
                        </FormControl>
                        <FormDescription>
                          Marque esta opção se a licença utiliza o atualizador
                          próprio do cliente
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
            </div>
          </TabsContent>
          <TabsContent value='iis' className='space-y-4'>
            {watchClienteId && (
              <div className='mb-4 flex items-center justify-between rounded-lg border border-border bg-muted/50 p-3'>
                <div className='flex-1'>
                  <p className='text-sm font-medium'>
                    Sugestões baseadas no cliente selecionado
                  </p>
                  <p className='text-xs text-muted-foreground'>
                    Clique no botão para gerar automaticamente os nomes baseados
                    no nome do cliente
                  </p>
                </div>
                <Button
                  type='button'
                  variant='outline'
                  size='sm'
                  onClick={() => applySmartNames(true)}
                  className='ml-4'
                >
                  <Sparkles className='mr-2 h-4 w-4' />
                  Sugerir Nomes
                </Button>
              </div>
            )}
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-8'>
              <div className='space-y-4'>
                <div className='rounded-lg border border-border bg-muted/30 p-4'>
                  <h3 className='mb-4 text-sm font-semibold'>Frontend</h3>
                  <div className='space-y-4'>
                    <FormField
                      control={form.control}
                      name='frontendPath'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Frontend Path</FormLabel>
                          <FormControl>
                            <Input
                              placeholder='../client'
                              {...field}
                              className='px-4 py-6 shadow-inner drop-shadow-xl'
                            />
                          </FormControl>
                          <FormDescription>
                            Caminho para a aplicação frontend
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name='frontendPoolName'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Frontend Pool Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder='gacloud-app'
                              {...field}
                              className='px-4 py-6 shadow-inner drop-shadow-xl'
                            />
                          </FormControl>
                          <FormDescription>
                            Nome do Application Pool IIS para Frontend
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>

              <div className='space-y-4'>
                <div className='rounded-lg border border-border bg-muted/30 p-4'>
                  <h3 className='mb-4 text-sm font-semibold'>API</h3>
                  <div className='space-y-4'>
                    <FormField
                      control={form.control}
                      name='apiPath'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>API Path</FormLabel>
                          <FormControl>
                            <Input
                              placeholder='../api'
                              {...field}
                              className='px-4 py-6 shadow-inner drop-shadow-xl'
                            />
                          </FormControl>
                          <FormDescription>
                            Caminho para a aplicação API
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name='apiPoolName'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>API Pool Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder='gacloud-api'
                              {...field}
                              className='px-4 py-6 shadow-inner drop-shadow-xl'
                            />
                          </FormControl>
                          <FormDescription>
                            Nome do Application Pool IIS para API
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value='urls' className='space-y-4'>
            {isGslpManagerApp ? (
              // GSLP Manager: 4 URLs (2 API URLs + 2 Frontend URLs)
              <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                <div className='space-y-4'>
                  <div className='rounded-lg border border-border bg-muted/30 p-4'>
                    <h3 className='mb-4 text-sm font-semibold'>API URLs</h3>
                    <div className='space-y-4'>
                      <FormField
                        control={form.control}
                        name='url1'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='text-xs'>
                              URL API HTTP
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder='http://api.example.com:8084'
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
                        name='url2'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='text-xs'>
                              URL API HTTPS
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder='https://api.example.com:8094'
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

                <div className='space-y-4'>
                  <div className='rounded-lg border border-border bg-muted/30 p-4'>
                    <h3 className='mb-4 text-sm font-semibold'>
                      Frontend URLs
                    </h3>
                    <div className='space-y-4'>
                      <FormField
                        control={form.control}
                        name='url3'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='text-xs'>
                              URL Frontend HTTP
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder='http://app.example.com:8080'
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
                        name='url4'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='text-xs'>
                              URL Frontend HTTPS
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder='https://app.example.com:8443'
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
              </div>
            ) : isUpdaterApp ? (
              // Updater: only 2 URLs (2 API URLs)
              <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                <div className='space-y-4'>
                  <div className='rounded-lg border border-border bg-muted/30 p-4'>
                    <h3 className='mb-4 text-sm font-semibold'>API URLs</h3>
                    <div className='space-y-4'>
                      <FormField
                        control={form.control}
                        name='url1'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='text-xs'>
                              URL API HTTP
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder='http://api.example.com:8084'
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
                        name='url2'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='text-xs'>
                              URL API HTTPS
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder='https://api.example.com:8094'
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
              </div>
            ) : (
              // Other applications: 8 URLs (2 API + 2 Frontend + 2 Login + 2 Updater)
              <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                <div className='space-y-4'>
                  <div className='rounded-lg border border-border bg-muted/30 p-4'>
                    <h3 className='mb-4 text-sm font-semibold'>API URLs</h3>
                    <div className='space-y-4'>
                      <FormField
                        control={form.control}
                        name='url1'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='text-xs'>
                              URL API HTTP
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder='http://api.example.com:8084'
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
                        name='url2'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='text-xs'>
                              URL API HTTPS
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder='https://api.example.com:8094'
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

                <div className='space-y-4'>
                  <div className='rounded-lg border border-border bg-muted/30 p-4'>
                    <h3 className='mb-4 text-sm font-semibold'>
                      Frontend URLs
                    </h3>
                    <div className='space-y-4'>
                      <FormField
                        control={form.control}
                        name='url3'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='text-xs'>
                              URL Frontend HTTP
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder='http://app.example.com:8080'
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
                        name='url4'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='text-xs'>
                              URL Frontend HTTPS
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder='https://app.example.com:8443'
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

                <div className='space-y-4'>
                  <div className='rounded-lg border border-border bg-muted/30 p-4'>
                    <h3 className='mb-4 text-sm font-semibold'>URL Login</h3>
                    <div className='space-y-4'>
                      <FormField
                        control={form.control}
                        name='url5'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='text-xs'>
                              URL Login HTTP
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder='http://api.example.com:8084'
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
                        name='url6'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='text-xs'>
                              URL Login HTTPS
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder='https://api.example.com:8094'
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

                <div className='space-y-4'>
                  <div className='rounded-lg border border-border bg-muted/30 p-4'>
                    <h3 className='mb-4 text-sm font-semibold'>
                      Updater API URLs
                    </h3>
                    <div className='space-y-4'>
                      <FormField
                        control={form.control}
                        name='url7'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='text-xs'>
                              URL Updater API HTTP
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder='http://updater.example.com:5275'
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
                        name='url8'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='text-xs'>
                              URL Updater API HTTPS
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder='https://updater.example.com:7038'
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
              </div>
            )}
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
