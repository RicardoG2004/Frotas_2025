import { useEffect, useRef, useMemo } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { type Resolver } from 'react-hook-form'
import { useGetTaxasIvaSelect } from '@/pages/base/taxasIva/queries/taxasIva-queries'
import { useUpdateServico } from '@/pages/frotas/servicos/queries/servicos-mutations'
import { useGetServico } from '@/pages/frotas/servicos/queries/servicos-queries'
import { UpdateServicoDTO } from '@/types/dtos/frotas/servicos.dtos'
import { Package, AlertCircle, DollarSign, Eye, Plus, ChevronUp, ChevronDown } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useFormState, useFormsStore } from '@/stores/use-forms-store'
import { useWindowsStore } from '@/stores/use-windows-store'
import { handleApiError } from '@/utils/error-handlers'
import { handleApiResponse } from '@/utils/response-handlers'
import { toast } from '@/utils/toast-utils'
import {
  useCurrentWindowId,
  handleWindowClose,
  updateWindowFormData,
  cleanupWindowForms,
  updateUpdateWindowTitle,
  detectUpdateFormChanges,
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
  PersistentTabs,
  TabsList as PersistentTabsList,
  TabsTrigger as PersistentTabsTrigger,
  TabsContent as PersistentTabsContent,
} from '@/components/ui/persistent-tabs'

const ServicoFormSchema = z.object({
  designacao: z
    .string({ message: 'A Designação é obrigatória' })
    .min(1, { message: 'A Designação é obrigatória' }),
  anos: z
    .number({ message: 'Os Anos são obrigatórios' })
    .min(0, { message: 'Os Anos devem ser maior ou igual a 0' }),
  kms: z
    .number({ message: 'Os KMs são obrigatórios' })
    .min(0, { message: 'Os KMs devem ser maior ou igual a 0' }),
  tipo: z
    .string({ message: 'O Tipo é obrigatório' })
    .min(1, { message: 'O Tipo é obrigatório' }),
  taxaIvaId: z.string().optional(),
  custo: z
    .number({ message: 'O Custo é obrigatório' })
    .min(0, { message: 'O Custo deve ser maior ou igual a 0' }),
})

type ServicoFormSchemaType = z.infer<typeof ServicoFormSchema>

interface servicoUpdateFormProps {
  modalClose: () => void
  servicoId: string
  initialData: ServicoFormSchemaType
}

const ServicoUpdateForm = ({
  modalClose,
  servicoId,
  initialData,
}: ServicoUpdateFormProps) => {
  const location = useLocation()
  const navigate = useNavigate()
  const windowId = useCurrentWindowId()
  const searchParams = new URLSearchParams(location.search)
  const instanceId = searchParams.get('instanceId') || 'default'
  const formId = instanceId

  // Use a ref to track if this is the first render
  const isFirstRender = useRef(true)

  const { formData, isInitialized, hasBeenVisited } = useFormState(formId)
  const { setFormState, updateFormState, resetFormState, hasFormData } =
    useFormsStore()
  const { removeWindow } = useWindowsStore()
  const setWindowHasFormData = useWindowsStore(
    (state) => state.setWindowHasFormData
  )
  const updateWindowState = useWindowsStore((state) => state.updateWindowState)

  const { setActiveTab } = useTabManager({
    defaultTab: 'identificacao',
    tabKey: `servico-${instanceId}`,
  })
  const { handleError } = useSubmitErrorTab<ServicoFormSchemaType>({
    setActiveTab,
    fieldToTabMap: {
      default: 'identificacao',
      designacao: 'identificacao',
      tipo: 'identificacao',
      anos: 'detalhes',
      kms: 'detalhes',
      taxaIvaId: 'custos',
      custo: 'custos',
    },
  })

  const updateServicoMutation = useUpdateServico()
  const { data: servicoData } = useGetServico(servicoId)
  const {
    data: taxasIvaData = [],
    isLoading: isLoadingTaxasIva,
    refetch: refetchTaxasIva,
  } = useGetTaxasIvaSelect()

  const effectiveWindowId = windowId || instanceId

  const servicoResolver: Resolver<ServicoFormSchemaType> = async (values) => {
    const result = ServicoFormSchema.safeParse(values)
    if (result.success) {
      return { values: result.data, errors: {} }
    }
    const fieldErrors: any = {}
    Object.entries(result.error.flatten().fieldErrors).forEach(
      ([key, value]) => {
        if (value && value.length > 0) {
          fieldErrors[key] = { type: 'validation', message: value[0] }
        }
      }
    )
    return {
      values: {},
      errors: fieldErrors,
    }
  }

  const form = useForm<ServicoFormSchemaType>({
    resolver: servicoResolver,
    defaultValues: initialData,
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
    criteriaMode: 'all',
  })

  // Calcular custo total baseado no custo e taxa de IVA
  const custoTotal = useMemo(() => {
    const custo = form.watch('custo') || 0
    const taxaIvaId = form.watch('taxaIvaId')
    
    if (!taxaIvaId || taxaIvaId.trim() === '' || !custo) return custo

    const taxaIvaSelecionada = taxasIvaData.find((t) => t.id === taxaIvaId)
    if (!taxaIvaSelecionada) return custo

    const valorIva = (custo * taxaIvaSelecionada.valor) / 100
    return custo + valorIva
  }, [form.watch('custo'), form.watch('taxaIvaId'), taxasIvaData])

  // Ref to store normalized API data for change detection
  const normalizedApiDataRef = useRef<any>(null)

  // Initialize form state on first render
  useEffect(() => {
    if (isFirstRender.current) {
      // If this form has never been visited before or doesn't have data, reset it
      if (!hasBeenVisited || !hasFormData(formId)) {
        resetFormState(formId)
        // Set initial form data with windowId
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
  }, [formId, hasBeenVisited, resetFormState, hasFormData, initialData])

  // Load saved form data if available and the form has been initialized
  useEffect(() => {
    if (isInitialized && hasFormData(formId)) {
      form.reset(formData as ServicoFormSchemaType)
    } else if (servicoData?.info?.data) {
      // If no saved data, use the data from the API
      const apiData = servicoData.info.data

      // Create normalized data for change detection (matching form structure)
      const normalizedApiData = {
        designacao: apiData.designacao,
        anos: apiData.anos,
        kms: apiData.kms,
        tipo: apiData.tipo,
        taxaIvaId: apiData.taxaIvaId,
        custo: apiData.custo,
      }

      // Store the normalized data in a ref or state for change detection
      if (!normalizedApiDataRef.current) {
        normalizedApiDataRef.current = {}
      }
      normalizedApiDataRef.current[servicoId] = normalizedApiData

      form.reset(normalizedApiData)
    }
  }, [formData, isInitialized, formId, hasFormData, servicoData, servicoId])

  // Save form data when it changes
  useEffect(() => {
    const subscription = form.watch((value) => {
      if (value) {
        // Use proper change detection by comparing with normalized original values
        const normalizedOriginalData =
          normalizedApiDataRef.current?.[servicoId] ||
          servicoData?.info?.data ||
          {}
        const hasChanges = detectUpdateFormChanges(
          value,
          normalizedOriginalData
        )

        setFormState(formId, {
          formData: value as ServicoFormSchemaType,
          isDirty: hasChanges,
          isValid: form.formState.isValid,
          isSubmitting: form.formState.isSubmitting,
          hasBeenModified: hasChanges,
        })

        // Update window hasFormData flag
        updateWindowFormData(
          effectiveWindowId,
          hasChanges,
          setWindowHasFormData
        )
        // Update window title based on designacao
        const newTitle = value.designacao || 'Serviço'

        // Always update the window title to ensure it reflects the current state
        updateUpdateWindowTitle(effectiveWindowId, newTitle, updateWindowState)
      }
    })
    return () => subscription.unsubscribe()
  }, [form, effectiveWindowId, servicoData, formId, formData])

  const handleClose = () => {
    // Clean up all form instances for the current window
    cleanupWindowForms(effectiveWindowId)

    handleWindowClose(effectiveWindowId, navigate, removeWindow)
  }

  // Use the combined auto-selection and return data hook for taxas IVA
  useAutoSelectionWithReturnData({
    windowId: effectiveWindowId,
    instanceId,
    data: taxasIvaData,
    setValue: (value: string) => {
      form.setValue('taxaIvaId', value, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      })
    },
    refetch: refetchTaxasIva,
    itemName: 'Taxa de IVA',
    successMessage: 'Taxa de IVA selecionada automaticamente',
    manualSelectionMessage:
      'Taxa de IVA criada com sucesso. Por favor, selecione-a manualmente.',
    queryKey: ['taxasIva-select'],
    returnDataKey: `return-data-${effectiveWindowId}-taxaIva`,
  })

  const onSubmit = async (values: ServicoFormSchemaType) => {
    try {
      updateFormState(formId, (state) => ({
        ...state,
        isSubmitting: true,
      }))

      // Transform the form data to match the API structure
      const requestData: UpdateServicoDTO = {
        designacao: values.designacao,
        anos: values.anos,
        kms: values.kms,
        tipo: values.tipo,
        taxaIvaId: values.taxaIvaId && values.taxaIvaId.trim() !== '' ? values.taxaIvaId : undefined,
        custo: values.custo,
      }

      const response = await updateServicoMutation.mutateAsync({
        id: servicoId,
        data: requestData,
      })
      const result = handleApiResponse(
        response,
        'Serviço atualizado com sucesso',
        'Erro ao atualizar Serviço',
        'Serviço atualizado com avisos'
      )

      if (result.success) {
        // Close the window
        if (effectiveWindowId) {
          removeWindow(effectiveWindowId)
        }
        modalClose()
      }
    } catch (error) {
      toast.error(handleApiError(error, 'Erro ao atualizar Serviço'))
    } finally {
      updateFormState(formId, (state) => ({
        ...state,
        isSubmitting: false,
      }))
    }
  }

  return (
    <div className='space-y-4'>
      <Form {...form}>
        <form
          id='servicoUpdateForm'
          onSubmit={form.handleSubmit(onSubmit, handleError)}
          className='space-y-4'
          autoComplete='off'
        >
          <PersistentTabs
            defaultValue='identificacao'
            className='w-full'
            tabKey={`servico-${instanceId}`}
          >
            <PersistentTabsList>
              <PersistentTabsTrigger value='identificacao'>
                <Package className='mr-2 h-4 w-4' />
                Identificação
              </PersistentTabsTrigger>
              <PersistentTabsTrigger value='detalhes'>
                <AlertCircle className='mr-2 h-4 w-4' />
                Detalhes
              </PersistentTabsTrigger>
              <PersistentTabsTrigger value='custos'>
                <DollarSign className='mr-2 h-4 w-4' />
                Custos
              </PersistentTabsTrigger>
            </PersistentTabsList>
            <PersistentTabsContent value='identificacao'>
              <div className='space-y-6'>
                <Card className='overflow-hidden border-l-4 border-l-primary/20 hover:border-l-primary/40 transition-all duration-200 hover:shadow-md'>
                  <CardHeader className='pb-4'>
                    <div className='flex items-center gap-3'>
                      <div className='flex items-center justify-center w-8 h-8 rounded-md bg-primary/10 text-primary'>
                        <Package className='h-4 w-4' />
                      </div>
                      <div>
                        <CardTitle className='text-base flex items-center gap-2'>
                          Identificação do Serviço
                          <Badge variant='secondary' className='text-xs'>
                            Obrigatório
                          </Badge>
                        </CardTitle>
                        <p className='text-sm text-muted-foreground mt-1'>
                          Informações básicas do Serviço
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
                              <Package className='h-4 w-4' />
                              Designação
                              <Badge variant='secondary' className='text-xs'>
                                Obrigatório
                              </Badge>
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder='Digite a designação'
                                {...field}
                                value={String(field.value ?? '')}
                                className='px-4 py-6 shadow-inner'
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name='tipo'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='flex items-center gap-2'>
                              <Package className='h-4 w-4' />
                              Tipo
                              <Badge variant='secondary' className='text-xs'>
                                Obrigatório
                              </Badge>
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder='Digite o tipo'
                                {...field}
                                value={String(field.value ?? '')}
                                className='px-4 py-6 shadow-inner'
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
            <PersistentTabsContent value='detalhes'>
              <div className='space-y-6'>
                <Card className='overflow-hidden border-l-4 border-l-primary/20 hover:border-l-primary/40 transition-all duration-200 hover:shadow-md'>
                  <CardHeader className='pb-4'>
                    <div className='flex items-center gap-3'>
                      <div className='flex items-center justify-center w-8 h-8 rounded-md bg-primary/10 text-primary'>
                        <AlertCircle className='h-4 w-4' />
                      </div>
                      <div>
                        <CardTitle className='text-base flex items-center gap-2'>
                          Detalhes do Serviço
                          <Badge variant='secondary' className='text-xs'>
                            Obrigatório
                          </Badge>
                        </CardTitle>
                        <p className='text-sm text-muted-foreground mt-1'>
                          Informações sobre uso e desgaste
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className='space-y-6'>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                      <FormField
                        control={form.control}
                        name='anos'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='flex items-center gap-2'>
                              <AlertCircle className='h-4 w-4' />
                              Anos
                              <Badge variant='secondary' className='text-xs'>
                                Obrigatório
                              </Badge>
                            </FormLabel>
                            <FormControl>
                              <div className='relative'>
                                <Input
                                  type='number'
                                  placeholder='0'
                                  {...field}
                                  onChange={(e) => {
                                    const value = e.target.value
                                    field.onChange(value === '' ? '' : parseInt(value))
                                  }}
                                  onWheel={(e) => {
                                    e.currentTarget.blur()
                                    const currentValue = typeof field.value === 'number' ? field.value : 0
                                    const delta = e.deltaY < 0 ? 1 : -1
                                    const newValue = Math.max(0, currentValue + delta)
                                    field.onChange(newValue)
                                    setTimeout(() => e.currentTarget.focus(), 0)
                                  }}
                                  value={field.value === 0 ? '' : field.value}
                                  step='1'
                                  min='0'
                                  className='px-4 py-6 pr-12 shadow-inner drop-shadow-xl'
                                />
                                <div className='absolute right-1 top-1/2 -translate-y-1/2 flex flex-col gap-0.5'>
                                  <Button
                                    type='button'
                                    variant='ghost'
                                    size='icon'
                                    className='h-6 w-6 rounded hover:bg-primary/10 hover:text-primary transition-colors'
                                    onClick={() => {
                                      const currentValue = typeof field.value === 'number' ? field.value : 0
                                      const newValue = currentValue + 1
                                      field.onChange(newValue)
                                    }}
                                  >
                                    <ChevronUp className='h-3 w-3' />
                                  </Button>
                                  <Button
                                    type='button'
                                    variant='ghost'
                                    size='icon'
                                    className='h-6 w-6 rounded hover:bg-primary/10 hover:text-primary transition-colors'
                                    onClick={() => {
                                      const currentValue = typeof field.value === 'number' ? field.value : 0
                                      const newValue = Math.max(0, currentValue - 1)
                                      field.onChange(newValue)
                                    }}
                                  >
                                    <ChevronDown className='h-3 w-3' />
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
                        name='kms'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='flex items-center gap-2'>
                              <AlertCircle className='h-4 w-4' />
                              KMs
                              <Badge variant='secondary' className='text-xs'>
                                Obrigatório
                              </Badge>
                            </FormLabel>
                            <FormControl>
                              <div className='relative'>
                                <Input
                                  type='number'
                                  placeholder='0'
                                  {...field}
                                  onChange={(e) => {
                                    const value = e.target.value
                                    field.onChange(value === '' ? '' : parseInt(value))
                                  }}
                                  onWheel={(e) => {
                                    e.currentTarget.blur()
                                    const currentValue = typeof field.value === 'number' ? field.value : 0
                                    const delta = e.deltaY < 0 ? 1 : -1
                                    const newValue = Math.max(0, currentValue + delta)
                                    field.onChange(newValue)
                                    setTimeout(() => e.currentTarget.focus(), 0)
                                  }}
                                  value={field.value === 0 ? '' : field.value}
                                  step='1'
                                  min='0'
                                  className='px-4 py-6 pr-12 shadow-inner drop-shadow-xl'
                                />
                                <div className='absolute right-1 top-1/2 -translate-y-1/2 flex flex-col gap-0.5'>
                                  <Button
                                    type='button'
                                    variant='ghost'
                                    size='icon'
                                    className='h-6 w-6 rounded hover:bg-primary/10 hover:text-primary transition-colors'
                                    onClick={() => {
                                      const currentValue = typeof field.value === 'number' ? field.value : 0
                                      const newValue = currentValue + 1
                                      field.onChange(newValue)
                                    }}
                                  >
                                    <ChevronUp className='h-3 w-3' />
                                  </Button>
                                  <Button
                                    type='button'
                                    variant='ghost'
                                    size='icon'
                                    className='h-6 w-6 rounded hover:bg-primary/10 hover:text-primary transition-colors'
                                    onClick={() => {
                                      const currentValue = typeof field.value === 'number' ? field.value : 0
                                      const newValue = Math.max(0, currentValue - 1)
                                      field.onChange(newValue)
                                    }}
                                  >
                                    <ChevronDown className='h-3 w-3' />
                                  </Button>
                                </div>
                              </div>
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
            <PersistentTabsContent value='custos'>
              <div className='space-y-6'>
                <Card className='overflow-hidden border-l-4 border-l-primary/20 hover:border-l-primary/40 transition-all duration-200 hover:shadow-md'>
                  <CardHeader className='pb-4'>
                    <div className='flex items-center gap-3'>
                      <div className='flex items-center justify-center w-8 h-8 rounded-md bg-primary/10 text-primary'>
                        <DollarSign className='h-4 w-4' />
                      </div>
                      <div>
                        <CardTitle className='text-base flex items-center gap-2'>
                          Informações de Custos
                          <Badge variant='secondary' className='text-xs'>
                            Obrigatório
                          </Badge>
                        </CardTitle>
                        <p className='text-sm text-muted-foreground mt-1'>
                          Custos e impostos do Serviço
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className='space-y-6'>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4 items-start'>
                      <FormField
                        control={form.control}
                        name='taxaIvaId'
                        render={({ field }) => (
                          <FormItem className='flex flex-col'>
                            <FormLabel className='flex items-center gap-2 min-h-[28px]'>
                              <DollarSign className='h-4 w-4' />
                              Taxa de IVA
                            </FormLabel>
                            <FormControl>
                              <div className='relative'>
                                <Autocomplete
                                  options={taxasIvaData.map((taxaIva) => ({
                                    value: taxaIva.id || '',
                                    label: `${taxaIva.descricao} (${taxaIva.valor}%)`,
                                  }))}
                                  value={String(field.value ?? '')}
                                  onValueChange={field.onChange}
                                  placeholder={
                                    isLoadingTaxasIva
                                      ? 'A carregar...'
                                      : 'Selecione uma taxa de IVA'
                                  }
                                  emptyText='Nenhuma taxa de IVA encontrada.'
                                  disabled={isLoadingTaxasIva}
                                  className='px-4 py-6 pr-32 shadow-inner drop-shadow-xl'
                                />
                                <div className='absolute right-12 top-1/2 -translate-y-1/2 flex gap-1'>
                                  <Button
                                    type='button'
                                    variant='outline'
                                    size='sm'
                                    onClick={() => {
                                      const taxaIvaId = form.getValues('taxaIvaId')
                                      if (!taxaIvaId) {
                                        toast.error('Por favor, selecione uma taxa de IVA primeiro')
                                        return
                                      }
                                      const instanceId = crypto.randomUUID()
                                      navigate(
                                        `/utilitarios/tabelas/configuracoes/taxas-iva/update?taxaIvaId=${taxaIvaId}&instanceId=${instanceId}`
                                      )
                                    }}
                                    className='h-8 w-8 p-0'
                                    title='Ver Taxa de IVA'
                                    disabled={!field.value}
                                  >
                                    <Eye className='h-4 w-4' />
                                  </Button>
                                  <Button
                                    type='button'
                                    variant='outline'
                                    size='sm'
                                    onClick={() => {
                                      const instanceId = crypto.randomUUID()
                                      // Store the parent window ID in sessionStorage
                                      if (effectiveWindowId) {
                                        sessionStorage.setItem(
                                          `parent-window-${instanceId}`,
                                          effectiveWindowId
                                        )
                                      }
                                      navigate(
                                        `/utilitarios/tabelas/configuracoes/taxas-iva/create?instanceId=${instanceId}`
                                      )
                                    }}
                                    className='h-8 w-8 p-0'
                                    title='Criar Taxa de IVA'
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
                        name='custo'
                        render={({ field }) => (
                          <FormItem className='flex flex-col'>
                            <FormLabel className='flex items-center gap-2 min-h-[28px]'>
                              <DollarSign className='h-4 w-4' />
                              Custo
                              <Badge variant='secondary' className='text-xs'>
                                Obrigatório
                              </Badge>
                            </FormLabel>
                            <FormControl>
                              <div className='relative'>
                                <Input
                                  type='number'
                                  placeholder='0'
                                  {...field}
                                  onChange={(e) => {
                                    const value = e.target.value
                                    field.onChange(value === '' ? '' : parseFloat(value))
                                  }}
                                  onWheel={(e) => {
                                    e.currentTarget.blur()
                                    const currentValue = typeof field.value === 'number' ? field.value : 0
                                    const delta = e.deltaY < 0 ? 0.1 : -0.1
                                    const newValue = Math.max(0, parseFloat((currentValue + delta).toFixed(2)))
                                    field.onChange(newValue)
                                    setTimeout(() => e.currentTarget.focus(), 0)
                                  }}
                                  value={field.value === 0 ? '' : field.value}
                                  step='0.01'
                                  min='0'
                                  className='px-4 py-6 pr-12 shadow-inner drop-shadow-xl'
                                />
                                <div className='absolute right-1 top-1/2 -translate-y-1/2 flex flex-col gap-0.5'>
                                  <Button
                                    type='button'
                                    variant='ghost'
                                    size='icon'
                                    className='h-6 w-6 rounded hover:bg-primary/10 hover:text-primary transition-colors'
                                    onClick={() => {
                                      const currentValue = typeof field.value === 'number' ? field.value : 0
                                      const newValue = parseFloat((currentValue + 0.1).toFixed(2))
                                      field.onChange(newValue)
                                    }}
                                  >
                                    <ChevronUp className='h-3 w-3' />
                                  </Button>
                                  <Button
                                    type='button'
                                    variant='ghost'
                                    size='icon'
                                    className='h-6 w-6 rounded hover:bg-primary/10 hover:text-primary transition-colors'
                                    onClick={() => {
                                      const currentValue = typeof field.value === 'number' ? field.value : 0
                                      const newValue = Math.max(0, parseFloat((currentValue - 0.1).toFixed(2)))
                                      field.onChange(newValue)
                                    }}
                                  >
                                    <ChevronDown className='h-3 w-3' />
                                  </Button>
                                </div>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className='space-y-2'>
                        <label className='flex items-center gap-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>
                          <DollarSign className='h-4 w-4' />
                          Custo Total (com IVA)
                        </label>
                        <div className='relative'>
                          <Input
                            type='text'
                            value={custoTotal.toFixed(2) + ' €'}
                            disabled
                            className='px-4 py-6 shadow-inner bg-muted text-muted-foreground font-semibold'
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </PersistentTabsContent>
          </PersistentTabs>
          <div className='flex flex-col justify-end space-y-2 pt-4 md:flex-row md:space-x-4 md:space-y-0'>
            <Button
              type='button'
              variant='outline'
              onClick={handleClose}
              className='w-full md:w-auto'
            >
              Cancelar
            </Button>
            <Button
              type='submit'
              disabled={updateServicoMutation.isPending}
              className='w-full md:w-auto'
            >
              {updateServicoMutation.isPending ? 'A atualizar...' : 'Atualizar'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

export { ServicoUpdateForm }


