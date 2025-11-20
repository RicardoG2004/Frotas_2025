import { useEffect, useMemo, useRef } from 'react'
import { z } from 'zod'
import { useForm, type DefaultValues } from 'react-hook-form'
import { type Resolver } from 'react-hook-form'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  CreateSeguroDTO,
  PeriodicidadeSeguro,
} from '@/types/dtos/frotas/seguros.dtos'
import { useFormState, useFormsStore } from '@/stores/use-forms-store'
import { useWindowsStore } from '@/stores/use-windows-store'
import { useCreateSeguro } from '@/pages/frotas/seguros/queries/seguros-mutations'
import { useGetSeguradorasSelect } from '@/pages/frotas/seguradoras/queries/seguradoras-queries'
import { handleApiError } from '@/utils/error-handlers'
import { handleApiResponse } from '@/utils/response-handlers'
import { toast } from '@/utils/toast-utils'
import {
  useCurrentWindowId,
  handleWindowClose,
  updateCreateFormData,
  cleanupWindowForms,
  updateCreateWindowTitle,
  setEntityReturnDataWithToastSuppression,
  openSeguradoraCreationWindow,
  openSeguradoraViewWindow,
  detectFormChanges,
} from '@/utils/window-utils'
import { useAutoSelectionWithReturnData } from '@/hooks/use-auto-selection-with-return-data'
import { useSubmitErrorTab } from '@/hooks/use-submit-error-tab'
import { useTabManager } from '@/hooks/use-tab-manager'
import { Autocomplete } from '@/components/ui/autocomplete'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
  RadioGroup,
  RadioGroupItem,
} from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import {
  PersistentTabs,
  TabsList as PersistentTabsList,
  TabsTrigger as PersistentTabsTrigger,
  TabsContent as PersistentTabsContent,
} from '@/components/ui/persistent-tabs'
import { DatePicker } from '@/components/ui/date-picker'
import {
  Shield,
  FileText,
  ShieldCheck,
  Eye,
  Plus,
  Euro,
  ChevronUp,
  ChevronDown,
} from 'lucide-react'

const seguroFormSchema = z.object({
  designacao: z
    .string({ message: 'A Designação é obrigatória' })
    .min(1, { message: 'A Designação é obrigatória' }),
  apolice: z
    .string({ message: 'A Apólice é obrigatória' })
    .min(1, { message: 'A Apólice é obrigatória' }),
  seguradoraId: z
    .string({ message: 'A Seguradora é obrigatória' })
    .min(1, { message: 'A Seguradora é obrigatória' }),
  assistenciaViagem: z.boolean().default(false),
  cartaVerde: z.boolean().default(false),
  valorCobertura: z.coerce
    .number({ message: 'O Valor de Cobertura é obrigatório' })
    .min(0, { message: 'O Valor de Cobertura deve ser maior ou igual a 0' }),
  custoAnual: z.coerce
    .number({ message: 'O Custo Anual é obrigatório' })
    .min(0, { message: 'O Custo Anual deve ser maior ou igual a 0' }),
  riscosCobertos: z
    .string({ message: 'Os Riscos Cobertos são obrigatórios' })
    .min(1, { message: 'Os Riscos Cobertos são obrigatórios' }),
  dataInicial: z.date({ message: 'A Data Inicial é obrigatória' }),
  dataFinal: z.date({ message: 'A Data Final é obrigatória' }),
  periodicidade: z.nativeEnum(PeriodicidadeSeguro, {
    message: 'A Periodicidade é obrigatória',
  }),
})

type SeguroFormSchemaType = z.infer<typeof seguroFormSchema>

interface SeguroCreateFormProps {
  modalClose: () => void
  onSuccess?: (newSeguro: { id: string; designacao: string }) => void
  shouldCloseWindow?: boolean
}

const SeguroCreateForm = ({
  modalClose,
  onSuccess,
  shouldCloseWindow = true,
}: SeguroCreateFormProps) => {
  const location = useLocation()
  const navigate = useNavigate()
  const windowId = useCurrentWindowId()
  const searchParams = new URLSearchParams(location.search)
  const instanceId = searchParams.get('instanceId') || 'default'
  const formId = `seguro-${instanceId}`

  const parentWindowIdFromStorage = sessionStorage.getItem(
    `parent-window-${instanceId}`
  )
  const effectiveWindowId = windowId || instanceId

  const isFirstRender = useRef(true)

  const { formData, isInitialized, hasBeenVisited } = useFormState(formId)
  const { setFormState, updateFormState, resetFormState, hasFormData } =
    useFormsStore()
  const {
    removeWindow,
    updateWindowState,
    findWindowByPathAndInstanceId,
    setWindowReturnData,
  } = useWindowsStore()
  const setWindowHasFormData = useWindowsStore(
    (state) => state.setWindowHasFormData
  )

  const createSeguroMutation = useCreateSeguro()

  const {
    data: seguradorasData = [],
    isLoading: isLoadingSeguradoras,
    refetch: refetchSeguradoras,
  } = useGetSeguradorasSelect()

  const { setActiveTab } = useTabManager({
    defaultTab: 'identificacao',
    tabKey: `seguro-${instanceId}`,
  })
  const { handleError } = useSubmitErrorTab<SeguroFormSchemaType>({
    setActiveTab,
      fieldToTabMap: {
      default: 'identificacao',
      designacao: 'identificacao',
      apolice: 'identificacao',
      seguradoraId: 'identificacao',
      assistenciaViagem: 'coberturas',
      cartaVerde: 'coberturas',
      valorCobertura: 'financeiro',
      custoAnual: 'financeiro',
      riscosCobertos: 'coberturas',
      dataInicial: 'identificacao',
      dataFinal: 'identificacao',
      periodicidade: 'identificacao',
    },
  })

  const defaultValues = useMemo<DefaultValues<SeguroFormSchemaType>>(
    () => ({
      designacao: '',
      apolice: '',
      seguradoraId: '',
      assistenciaViagem: false,
      cartaVerde: false,
      valorCobertura: undefined as unknown as number,
      custoAnual: undefined as unknown as number,
      riscosCobertos: '',
      dataInicial: undefined,
      dataFinal: undefined,
      periodicidade: PeriodicidadeSeguro.Anual,
    }),
    []
  )

  const seguroResolver: Resolver<SeguroFormSchemaType> = async (values) => {
    const result = seguroFormSchema.safeParse(values)
    if (result.success) {
      if (result.data.dataFinal < result.data.dataInicial) {
        return {
          values: {},
          errors: {
            dataFinal: {
              type: 'validation',
              message: 'A Data Final deve ser posterior à Data Inicial',
            },
          },
        }
      }
      return { values: result.data, errors: {} }
    }

    const fieldErrors: Record<string, { type: string; message: string }> = {}
    Object.entries(result.error.flatten().fieldErrors).forEach(
      ([key, value]) => {
        if (value && Array.isArray(value) && value.length > 0) {
          fieldErrors[key] = { type: 'validation', message: value[0] }
        }
      }
    )
    return {
      values: {},
      errors: fieldErrors,
    }
  }

  const form = useForm<SeguroFormSchemaType>({
    resolver: seguroResolver,
    defaultValues,
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
    criteriaMode: 'all',
  })

  useEffect(() => {
    if (isFirstRender.current) {
      if (!hasBeenVisited || !hasFormData(formId)) {
        resetFormState(formId)
        setFormState(formId, {
          formData: {},
          isDirty: false,
          isValid: false,
          isSubmitting: false,
          hasBeenModified: false,
          windowId: effectiveWindowId,
        })
      }
      isFirstRender.current = false
    }
  }, [
    effectiveWindowId,
    formId,
    hasBeenVisited,
    hasFormData,
    resetFormState,
    setFormState,
  ])

  useEffect(() => {
    if (isInitialized && hasFormData(formId)) {
      form.reset(formData as SeguroFormSchemaType)
    }
  }, [formData, form, formId, hasFormData, isInitialized])

  useEffect(() => {
    const subscription = form.watch((value) => {
      const hasChanges = detectFormChanges(value, defaultValues)

      if (JSON.stringify(value) !== JSON.stringify(formData)) {
        setFormState(formId, {
          formData: value as SeguroFormSchemaType,
          isDirty: hasChanges,
          isValid: form.formState.isValid,
          isSubmitting: form.formState.isSubmitting,
          hasBeenModified: hasChanges,
          windowId: effectiveWindowId,
        })

        if (effectiveWindowId) {
          updateCreateFormData(
            effectiveWindowId,
            value,
            setWindowHasFormData,
            defaultValues
          )

          if (value.designacao && value.designacao !== formData?.designacao) {
            updateCreateWindowTitle(
              effectiveWindowId,
              value.designacao || 'Novo Seguro',
              updateWindowState
            )
          }
        }
      }
    })

    return () => subscription.unsubscribe()
  }, [
    defaultValues,
    effectiveWindowId,
    form,
    formData,
    formId,
    setFormState,
    setWindowHasFormData,
    updateWindowState,
  ])

  useAutoSelectionWithReturnData({
    windowId: effectiveWindowId,
    instanceId,
    data: seguradorasData,
    setValue: (value: string) =>
      form.setValue('seguradoraId', value, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      }),
    refetch: refetchSeguradoras,
    itemName: 'Seguradora',
    successMessage: 'Seguradora selecionada automaticamente',
    manualSelectionMessage:
      'Seguradora criada com sucesso. Por favor, selecione-a manualmente.',
    queryKey: ['seguradoras-select'],
    returnDataKey: `return-data-${effectiveWindowId}-seguradora`,
  })

  const handleCreateSeguradora = () => {
    if (!effectiveWindowId) {
      toast.error('Janela inválida para criar seguradora')
      return
    }

    openSeguradoraCreationWindow(
      navigate,
      effectiveWindowId,
      updateWindowState,
      findWindowByPathAndInstanceId
    )
  }

  const handleViewSeguradora = () => {
    const seguradoraId = form.getValues('seguradoraId')
    if (!seguradoraId) {
      toast.error('Selecione uma seguradora primeiro')
      return
    }

    if (!effectiveWindowId) {
      toast.error('Janela inválida para abrir a seguradora')
      return
    }

    openSeguradoraViewWindow(
      navigate,
      effectiveWindowId,
      seguradoraId,
      updateWindowState,
      findWindowByPathAndInstanceId
    )
  }

  const handleClose = () => {
    cleanupWindowForms(effectiveWindowId)

    if (shouldCloseWindow) {
      handleWindowClose(effectiveWindowId, navigate, removeWindow)
    } else {
      modalClose()
    }
  }

  const onSubmit = async (values: SeguroFormSchemaType) => {
    try {
      updateFormState(formId, (state) => ({
        ...state,
        isSubmitting: true,
      }))

      const requestData: CreateSeguroDTO = {
        designacao: values.designacao,
        apolice: values.apolice,
        seguradoraId: values.seguradoraId,
        assistenciaViagem: values.assistenciaViagem,
        cartaVerde: values.cartaVerde,
        valorCobertura: values.valorCobertura,
        custoAnual: values.custoAnual,
        riscosCobertos: values.riscosCobertos,
        dataInicial: values.dataInicial.toISOString(),
        dataFinal: values.dataFinal.toISOString(),
        periodicidade: values.periodicidade,
      }

      const response = await createSeguroMutation.mutateAsync(requestData)
      const result = handleApiResponse(
        response,
        'Seguro criado com sucesso',
        'Erro ao criar seguro',
        'Seguro criado com avisos'
      )

      if (result.success) {
        if (effectiveWindowId) {
          setEntityReturnDataWithToastSuppression(
            effectiveWindowId,
            {
              id: result.data as string,
              nome: values.designacao,
              designacao: values.designacao,
            },
            'seguro',
            setWindowReturnData,
            parentWindowIdFromStorage || undefined,
            instanceId
          )

          setTimeout(() => {
            if (parentWindowIdFromStorage) {
              sessionStorage.removeItem(`parent-window-${instanceId}`)
            }
          }, 2000)
        }

        if (onSuccess) {
          onSuccess({
            id: result.data as string,
            designacao: values.designacao,
          })
        }
        if (effectiveWindowId && shouldCloseWindow) {
          removeWindow(effectiveWindowId)
        }
        modalClose()
      }
    } catch (error) {
      toast.error(handleApiError(error, 'Erro ao criar seguro'))
    } finally {
      updateFormState(formId, (state) => ({
        ...state,
        isSubmitting: false,
      }))
    }
  }

  const renderCurrencyInput = (
    field: any,
    placeholder: string,
    step: number = 0.01
  ) => {
    const stepDecimals = step.toString().includes('.')
      ? step.toString().split('.')[1]?.length ?? 0
      : 0

    const formatDisplayValue = (value: any) => {
      if (
        value === undefined ||
        value === null ||
        (typeof value === 'string' && value.trim() === '')
      ) {
        return ''
      }
      return value
    }

    const adjustValue = (delta: number) => {
      const current =
        typeof field.value === 'number'
          ? field.value
          : parseFloat(field.value || '0') || 0
      const newValue = Math.max(
        0,
        parseFloat((current + delta).toFixed(stepDecimals))
      )
      field.onChange(newValue)
    }

    return (
      <div className='relative'>
        <Input
          type='number'
          step={step}
          min='0'
          placeholder={placeholder}
          value={formatDisplayValue(field.value)}
          onChange={(event) => {
            const value = event.target.value
            if (value === '') {
              field.onChange('')
              return
            }
            const parsed = parseFloat(value)
            if (!Number.isNaN(parsed)) {
              field.onChange(parsed)
            }
          }}
          onWheel={(event) => {
            event.preventDefault()
            const delta = event.deltaY < 0 ? step : -step
            adjustValue(delta)
          }}
          className='px-4 py-6 pr-12 shadow-inner drop-shadow-xl'
        />
        <div className='absolute right-1 top-1/2 -translate-y-1/2 flex flex-col gap-0.5'>
          <Button
            type='button'
            variant='ghost'
            size='icon'
            className='h-6 w-6 rounded hover:bg-primary/10 hover:text-primary transition-colors'
            onClick={() => adjustValue(step)}
          >
            <ChevronUp className='h-3 w-3' />
          </Button>
          <Button
            type='button'
            variant='ghost'
            size='icon'
            className='h-6 w-6 rounded hover:bg-primary/10 hover:text-primary transition-colors'
            onClick={() => adjustValue(-step)}
          >
            <ChevronDown className='h-3 w-3' />
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className='space-y-4'>
      <Form {...form}>
        <form
          id='seguroCreateForm'
          onSubmit={form.handleSubmit(onSubmit, handleError)}
          className='space-y-4'
          autoComplete='off'
        >
          <PersistentTabs
            defaultValue='identificacao'
            className='w-full'
            tabKey={`seguro-${instanceId}`}
          >
            <PersistentTabsList>
              <PersistentTabsTrigger value='identificacao'>
                <Shield className='mr-2 h-4 w-4' />
                Identificação
              </PersistentTabsTrigger>
              <PersistentTabsTrigger value='coberturas'>
                <ShieldCheck className='mr-2 h-4 w-4' />
                Coberturas
              </PersistentTabsTrigger>
              <PersistentTabsTrigger value='financeiro'>
                <Euro className='mr-2 h-4 w-4' />
                Financeiro
              </PersistentTabsTrigger>
            </PersistentTabsList>

            <PersistentTabsContent value='identificacao'>
              <div className='space-y-6'>
                <Card className='overflow-hidden border-l-4 border-l-primary/20 hover:border-l-primary/40 transition-all duration-200 hover:shadow-md'>
                  <CardHeader className='pb-4'>
                    <div className='flex items-center gap-3'>
                      <div className='flex items-center justify-center w-8 h-8 rounded-md bg-primary/10 text-primary'>
                        <Shield className='h-4 w-4' />
                      </div>
                      <div>
                        <CardTitle className='text-base flex items-center gap-2'>
                          Informações do Seguro
                          <Badge variant='secondary' className='text-xs'>
                            Obrigatório
                          </Badge>
                        </CardTitle>
                        <p className='text-sm text-muted-foreground mt-1'>
                          Dados principais do seguro
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className='space-y-6'>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                      <FormField
                        control={form.control}
                        name='designacao'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='flex items-center gap-2'>
                              <FileText className='h-4 w-4' />
                              Designação
                              <Badge variant='secondary' className='text-xs'>
                                Obrigatório
                              </Badge>
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder='Digite a designação do seguro'
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
                        name='apolice'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='flex items-center gap-2'>
                              <FileText className='h-4 w-4' />
                              Apólice
                              <Badge variant='secondary' className='text-xs'>
                                Obrigatório
                              </Badge>
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder='Número da apólice'
                                {...field}
                                className='px-4 py-6 shadow-inner drop-shadow-xl'
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                      <FormField
                        control={form.control}
                        name='seguradoraId'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='flex items-center gap-2'>
                              <ShieldCheck className='h-4 w-4' />
                              Seguradora
                              <Badge variant='secondary' className='text-xs'>
                                Obrigatório
                              </Badge>
                            </FormLabel>
                            <FormControl>
                              <div className='relative'>
                                <Autocomplete
                                  options={seguradorasData.map((seguradora) => ({
                                    value: seguradora.id || '',
                                    label: seguradora.descricao || '',
                                  }))}
                                  value={field.value}
                                  onValueChange={field.onChange}
                                  placeholder={
                                    isLoadingSeguradoras
                                      ? 'A carregar seguradoras...'
                                      : 'Selecione a seguradora'
                                  }
                                  emptyText='Nenhuma seguradora encontrada.'
                                  disabled={isLoadingSeguradoras}
                                  className='px-4 py-5 pr-32 shadow-inner drop-shadow-xl'
                                />
                                <div className='absolute right-12 top-1/2 -translate-y-1/2 flex gap-1'>
                                  <Button
                                    type='button'
                                    variant='outline'
                                    size='sm'
                                    onClick={handleViewSeguradora}
                                    className='h-8 w-8 p-0'
                                    title='Ver Seguradora'
                                    disabled={!field.value}
                                  >
                                    <Eye className='h-4 w-4' />
                                  </Button>
                                  <Button
                                    type='button'
                                    variant='outline'
                                    size='sm'
                                    onClick={handleCreateSeguradora}
                                    className='h-8 w-8 p-0'
                                    title='Criar Nova Seguradora'
                                  >
                                    <Plus className='h-4 w-4' />
                                  </Button>
                                </div>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name='periodicidade'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='flex items-center gap-2 mt-1'>
                              <Shield className='h-4 w-4' />
                              Periodicidade
                              <Badge variant='secondary' className='text-xs'>
                                Obrigatório
                              </Badge>
                            </FormLabel>
                            <FormControl>
                              <div className='pt-2'>
                                <RadioGroup
                                  value={field.value?.toString()}
                                  onValueChange={(value) => {
                                    field.onChange(Number(value) as PeriodicidadeSeguro)
                                  }}
                                  className='flex gap-4'
                                >
                                  <div className='flex items-center space-x-2'>
                                    <RadioGroupItem
                                      value={PeriodicidadeSeguro.Mensal.toString()}
                                      id='periodicidade-mensal'
                                    />
                                    <Label
                                      htmlFor='periodicidade-mensal'
                                      className='cursor-pointer font-normal'
                                    >
                                      Mensal
                                    </Label>
                                  </div>
                                  <div className='flex items-center space-x-2'>
                                    <RadioGroupItem
                                      value={PeriodicidadeSeguro.Trimestral.toString()}
                                      id='periodicidade-trimestral'
                                    />
                                    <Label
                                      htmlFor='periodicidade-trimestral'
                                      className='cursor-pointer font-normal'
                                    >
                                      Trimestral
                                    </Label>
                                  </div>
                                  <div className='flex items-center space-x-2'>
                                    <RadioGroupItem
                                      value={PeriodicidadeSeguro.Anual.toString()}
                                      id='periodicidade-anual'
                                    />
                                    <Label
                                      htmlFor='periodicidade-anual'
                                      className='cursor-pointer font-normal'
                                    >
                                      Anual
                                    </Label>
                                  </div>
                                </RadioGroup>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                      <FormField
                        control={form.control}
                        name='dataInicial'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Data Inicial</FormLabel>
                            <FormControl>
                              <DatePicker
                                value={field.value || undefined}
                                onChange={(date) => field.onChange(date)}
                                placeholder='Selecione a data inicial'
                                allowClear
                                className='h-12'
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name='dataFinal'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Data Final</FormLabel>
                            <FormControl>
                              <DatePicker
                                value={field.value || undefined}
                                onChange={(date) => field.onChange(date)}
                                placeholder='Selecione a data final'
                                allowClear
                                className='h-12'
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </PersistentTabsContent>

            <PersistentTabsContent value='coberturas'>
              <div className='space-y-6'>
                <Card className='overflow-hidden border-l-4 border-l-primary/20 hover:border-l-primary/40 transition-all duration-200 hover:shadow-md'>
                  <CardHeader className='pb-4'>
                    <div className='flex items-center gap-3'>
                      <div className='flex items-center justify-center w-8 h-8 rounded-md bg-primary/10 text-primary'>
                        <ShieldCheck className='h-4 w-4' />
                      </div>
                      <div>
                        <CardTitle className='text-base flex items-center gap-2'>
                          Coberturas e Assistência
                        </CardTitle>
                        <p className='text-sm text-muted-foreground mt-1'>
                          Configure os benefícios incluídos no seguro
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className='space-y-6'>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                      <FormField
                        control={form.control}
                        name='assistenciaViagem'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='flex items-center gap-2'>
                              Assistência em Viagem
                            </FormLabel>
                            <FormControl>
                              <div className='w-full rounded-lg border border-input bg-background px-4 py-3.5 shadow-inner drop-shadow-xl flex items-center justify-between'>
                                <span className='text-sm text-muted-foreground'>
                                  {field.value ? 'Incluída' : 'Não incluída'}
                                </span>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                  disabled={createSeguroMutation.isPending}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name='cartaVerde'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='flex items-center gap-2'>
                              Carta Verde
                            </FormLabel>
                            <FormControl>
                              <div className='w-full rounded-lg border border-input bg-background px-4 py-3.5 shadow-inner drop-shadow-xl flex items-center justify-between'>
                                <span className='text-sm text-muted-foreground'>
                                  {field.value ? 'Incluída' : 'Não incluída'}
                                </span>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                  disabled={createSeguroMutation.isPending}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name='riscosCobertos'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className='flex items-center gap-2'>
                            Riscos Cobertos
                            <Badge variant='secondary' className='text-xs'>
                              Obrigatório
                            </Badge>
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder='Descreva os riscos cobertos pelo seguro'
                              rows={4}
                              {...field}
                              className='shadow-inner drop-shadow-xl'
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </div>
            </PersistentTabsContent>

            <PersistentTabsContent value='financeiro'>
              <div className='space-y-6'>
                <Card className='overflow-hidden border-l-4 border-l-primary/20 hover:border-l-primary/40 transition-all duration-200 hover:shadow-md'>
                  <CardHeader className='pb-4'>
                    <div className='flex items-center gap-3'>
                      <div className='flex items-center justify-center w-8 h-8 rounded-md bg-primary/10 text-primary'>
                        <Euro className='h-4 w-4' />
                      </div>
                      <div>
                        <CardTitle className='text-base flex items-center gap-2'>
                          Valores do Seguro
                        </CardTitle>
                        <p className='text-sm text-muted-foreground mt-1'>
                          Informe os valores financeiros do seguro
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className='space-y-6'>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                      <FormField
                        control={form.control}
                        name='valorCobertura'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='flex items-center gap-2'>
                              Valor Cobertura (€)
                              <Badge variant='secondary' className='text-xs'>
                                Obrigatório
                              </Badge>
                            </FormLabel>
                            <FormControl>
                              {renderCurrencyInput(
                                field,
                                'Valor total coberto pelo seguro'
                              )}
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name='custoAnual'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='flex items-center gap-2'>
                              Custo Anual (€)
                              <Badge variant='secondary' className='text-xs'>
                                Obrigatório
                              </Badge>
                            </FormLabel>
                            <FormControl>
                              {renderCurrencyInput(
                                field,
                                'Custo anual do seguro'
                              )}
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </PersistentTabsContent>
          </PersistentTabs>

          <div className='flex justify-end gap-3 pt-4 border-t'>
            <Button
              type='button'
              variant='outline'
              onClick={handleClose}
              disabled={form.formState.isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              type='submit'
              disabled={form.formState.isSubmitting}
              className='min-w-[120px]'
            >
              {form.formState.isSubmitting ? 'A guardar...' : 'Guardar'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

export { SeguroCreateForm }


