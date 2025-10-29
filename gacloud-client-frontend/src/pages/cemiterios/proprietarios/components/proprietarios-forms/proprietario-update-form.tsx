import { useEffect, useRef, useState } from 'react'
import { z } from 'zod'
import { useForm, type Resolver } from 'react-hook-form'
import { useGetEntidadesSelect } from '@/pages/base/entidades/queries/entidades-queries'
import { useUpdateProprietario } from '@/pages/cemiterios/proprietarios/queries/proprietarios-mutations'
import { useGetProprietario } from '@/pages/cemiterios/proprietarios/queries/proprietarios-queries'
import { useGetSepulturasSelect } from '@/pages/cemiterios/sepulturas/queries/sepulturas-queries'
import { UpdateProprietarioDTO } from '@/types/dtos/cemiterios/proprietarios.dtos'
import {
  Plus,
  Trash2,
  Calendar,
  MapPin,
  User,
  Shield,
  FileText,
  Clock,
  AlertCircle,
  ChevronDown,
  ChevronRight,
  SlidersHorizontal,
  Eye,
} from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useFormState, useFormsStore } from '@/stores/use-forms-store'
import { useWindowsStore } from '@/stores/use-windows-store'
import { toDatabaseDate, fromDatabaseDate } from '@/utils/date-utils'
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
  openEntidadeCreationWindow,
  openSepulturaCreationWindow,
  openEntidadeViewWindow,
  openSepulturaViewWindow,
} from '@/utils/window-utils'
import { useAutoSelectionWithReturnData } from '@/hooks/use-auto-selection-with-return-data'
import { useSubmitErrorTab } from '@/hooks/use-submit-error-tab'
import { useTabManager } from '@/hooks/use-tab-manager'
import { Autocomplete } from '@/components/ui/autocomplete'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
  PersistentTabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@/components/ui/persistent-tabs'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'

const sepulturaProprietarioSchema = z.object({
  id: z.string().optional(),
  sepulturaId: z
    .string({
      message: 'A Sepultura é obrigatória',
    })
    .min(1, { message: 'A Sepultura é obrigatória' }),
  data: z.date({ message: 'A Data é obrigatória' }),
  ativo: z.boolean().default(true),
  isProprietario: z.boolean().default(true),
  isResponsavel: z.boolean().default(false),
  isResponsavelGuiaReceita: z.boolean().default(false),
  dataInativacao: z.preprocess(
    (v) => (v ? fromDatabaseDate(v as string) : undefined),
    z.date().optional()
  ),
  fracao: z.string().optional(),
  observacoes: z.string().optional(),
  historico: z.boolean().default(false),
})

const proprietarioFormSchema = z.object({
  cemiterioId: z.string().optional(),
  entidadeId: z
    .string({ message: 'A Entidade é obrigatória' })
    .min(1, { message: 'A Entidade é obrigatória' }),
  sepulturas: z.array(sepulturaProprietarioSchema).default([]),
})

type ProprietarioFormSchemaType = z.infer<typeof proprietarioFormSchema>

interface ProprietarioUpdateFormProps {
  modalClose: () => void
  proprietarioId: string
  initialData: ProprietarioFormSchemaType
}

const ProprietarioUpdateForm = ({
  modalClose,
  proprietarioId,
  initialData,
}: ProprietarioUpdateFormProps) => {
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
  const { findWindowByPathAndInstanceId } = useWindowsStore()

  const updateProprietarioMutation = useUpdateProprietario()
  const { data: proprietarioData } = useGetProprietario(proprietarioId)
  const {
    data: entidadesData = [],
    isLoading: isLoadingEntidades,
    refetch: refetchEntidades,
  } = useGetEntidadesSelect()
  const {
    data: sepulturasData = [],
    isLoading: isLoadingSepulturas,
    refetch: refetchSepulturas,
  } = useGetSepulturasSelect()

  const effectiveWindowId = windowId || instanceId

  const proprietarioResolver: Resolver<ProprietarioFormSchemaType> = async (
    values
  ) => {
    const result = proprietarioFormSchema.safeParse(values)
    if (result.success) {
      return { values: result.data, errors: {} }
    }
    const errors: Record<string, any> = {}
    for (const issue of result.error.issues) {
      const field = String(issue.path[0] || '')
      if (!field) continue
      if (!errors[field]) {
        errors[field] = {
          type: issue.code || 'validation',
          message: issue.message,
        }
      }
    }
    return { values: {}, errors }
  }

  const form = useForm<ProprietarioFormSchemaType>({
    resolver: proprietarioResolver,
    defaultValues: initialData,
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
    criteriaMode: 'all',
  })

  const { setActiveTab } = useTabManager({
    defaultTab: 'identificacao',
    tabKey: `proprietario-${instanceId}`,
  })
  const { handleError } = useSubmitErrorTab<ProprietarioFormSchemaType>({
    setActiveTab,
    fieldToTabMap: {
      default: 'identificacao',
      entidadeId: 'identificacao',
      sepulturas: 'sepulturas',
    },
  })

  // Ref to store normalized API data for change detection
  const normalizedApiDataRef = useRef<any>(null)

  // State to track which sepulturas are expanded
  const [expandedSepulturas, setExpandedSepulturas] = useState<Set<number>>(
    new Set()
  )

  // Filter state interface
  interface SepulturaFilters {
    historico: 'all' | 'true' | 'false'
    ativo: 'all' | 'true' | 'false'
    // Future filters can be added here
    // proprietario: 'all' | 'true' | 'false'
    // responsavel: 'all' | 'true' | 'false'
  }

  // State to track all filters
  const [filters, setFilters] = useState<SepulturaFilters>({
    historico: 'false',
    ativo: 'all',
  })

  // State to track if filters panel is open
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)

  // Function to generate responsibility badges for a sepultura
  const getResponsibilityBadges = (sepultura: any) => {
    const badges = []

    if (sepultura.isProprietario) {
      badges.push({ label: 'Proprietário', variant: 'default' as const })
    }
    if (sepultura.isResponsavel) {
      badges.push({ label: 'Responsável', variant: 'secondary' as const })
    }
    if (sepultura.isResponsavelGuiaReceita) {
      badges.push({ label: 'Guia Receita', variant: 'outline' as const })
    }
    if (sepultura.ativo) {
      badges.push({ label: 'Ativo', variant: 'default' as const })
    } else {
      badges.push({ label: 'Inativo', variant: 'destructive' as const })
    }

    // Add historico badge
    if (sepultura.historico) {
      badges.push({ label: 'Histórico', variant: 'destructive' as const })
    }

    // Add fracao percentage badge if available
    if (sepultura.fracao && sepultura.fracao.trim() !== '') {
      badges.push({ label: sepultura.fracao, variant: 'secondary' as const })
    }

    return badges
  }

  // Function to toggle sepultura expansion
  const toggleSepulturaExpansion = (index: number) => {
    setExpandedSepulturas((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(index)) {
        newSet.delete(index)
      } else {
        newSet.add(index)
      }
      return newSet
    })
  }

  // Function to update a specific filter
  const updateFilter = (
    filterKey: keyof SepulturaFilters,
    value: 'all' | 'true' | 'false'
  ) => {
    setFilters((prev) => ({
      ...prev,
      [filterKey]: value,
    }))
  }

  // Function to clear all filters
  const clearAllFilters = () => {
    setFilters({
      historico: 'all',
      ativo: 'all',
    })
  }

  // Function to check if any filter is active
  const hasActiveFilters = () => {
    return Object.values(filters).some((value) => value !== 'all')
  }

  // Function to get the count of active filters
  const getActiveFiltersCount = () => {
    return Object.values(filters).filter((value) => value !== 'all').length
  }

  // Function to apply filters to sepulturas
  const applyFilters = (sepulturas: any[]) => {
    return sepulturas.filter((sepultura) => {
      // Historico filter
      if (
        filters.historico !== 'all' &&
        sepultura.historico !== (filters.historico === 'true')
      ) {
        return false
      }

      // Ativo filter
      if (
        filters.ativo !== 'all' &&
        sepultura.ativo !== (filters.ativo === 'true')
      ) {
        return false
      }

      return true
    })
  }

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
      form.reset(formData as ProprietarioFormSchemaType)
    } else if (proprietarioData?.info?.data) {
      // If no saved data, use the data from the API
      const apiData = proprietarioData.info.data

      // Create normalized data for change detection (matching form structure)
      const normalizedSepulturas = (apiData.sepulturas ?? [])
        .slice()
        .sort((a, b) => {
          if (!a.createdOn || !b.createdOn) return 0
          return (
            new Date(a.createdOn).getTime() - new Date(b.createdOn).getTime()
          )
        })
        .map((sepultura) => ({
          id: sepultura.id,
          sepulturaId: sepultura.sepulturaId,
          data: fromDatabaseDate(sepultura.data) || new Date(),
          ativo: sepultura.ativo,
          isProprietario: sepultura.isProprietario,
          isResponsavel: sepultura.isResponsavel,
          isResponsavelGuiaReceita: sepultura.isResponsavelGuiaReceita,
          dataInativacao: fromDatabaseDate(sepultura.dataInativacao),
          fracao: sepultura.fracao || '',
          observacoes: sepultura.observacoes || '',
          historico: sepultura.historico,
        }))

      // Store normalized data for change detection
      const normalizedApiData = {
        cemiterioId: apiData.cemiterioId,
        entidadeId: apiData.entidadeId,
        sepulturas: normalizedSepulturas,
      }

      // Store the normalized data in a ref or state for change detection
      if (!normalizedApiDataRef.current) {
        normalizedApiDataRef.current = {}
      }
      normalizedApiDataRef.current[proprietarioId] = normalizedApiData

      form.reset({
        cemiterioId: apiData.cemiterioId,
        entidadeId: apiData.entidadeId,
        sepulturas: normalizedSepulturas,
      })
    }
  }, [
    formData,
    isInitialized,
    formId,
    hasFormData,
    proprietarioData,
    proprietarioId,
  ])

  // Save form data when it changes
  useEffect(() => {
    const subscription = form.watch((value) => {
      if (value) {
        // Use proper change detection by comparing with normalized original values
        const normalizedOriginalData =
          normalizedApiDataRef.current?.[proprietarioId] ||
          proprietarioData?.info?.data ||
          {}
        const hasChanges = detectUpdateFormChanges(
          value,
          normalizedOriginalData
        )

        setFormState(formId, {
          formData: value as ProprietarioFormSchemaType,
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
        // Update window title based on selected entidade
        const selectedEntidade = entidadesData.find(
          (entidade) => entidade.id === value.entidadeId
        )
        const newTitle = selectedEntidade?.nome || 'Proprietário'

        // Always update the window title to ensure it reflects the current state
        updateUpdateWindowTitle(effectiveWindowId, newTitle, updateWindowState)
      }
    })
    return () => subscription.unsubscribe()
  }, [
    form,
    effectiveWindowId,
    proprietarioData,
    formId,
    formData,
    entidadesData,
  ])

  const handleClose = () => {
    // Clean up all form instances for the current window
    cleanupWindowForms(effectiveWindowId)

    handleWindowClose(effectiveWindowId, navigate, removeWindow)
  }

  const handleCreateEntidade = () => {
    // Open entidade creation in a new window with parent reference
    openEntidadeCreationWindow(
      navigate,
      effectiveWindowId,
      updateWindowState,
      findWindowByPathAndInstanceId
    )
  }

  const handleViewEntidade = () => {
    const entidadeId = form.getValues('entidadeId')
    if (!entidadeId) {
      toast.error('Por favor, selecione uma entidade primeiro')
      return
    }

    // Open entidade view in a new window
    openEntidadeViewWindow(
      navigate,
      effectiveWindowId,
      entidadeId,
      updateWindowState,
      findWindowByPathAndInstanceId
    )
  }

  const handleCreateSepultura = () => {
    // Open sepultura creation in a new window with parent reference
    openSepulturaCreationWindow(
      navigate,
      effectiveWindowId,
      updateWindowState,
      findWindowByPathAndInstanceId
    )
  }

  const handleViewSepultura = (index: number) => {
    const sepulturaId = form.getValues(`sepulturas.${index}.sepulturaId`)
    if (!sepulturaId) {
      toast.error('Por favor, selecione uma sepultura primeiro')
      return
    }

    // Open sepultura view in a new window
    openSepulturaViewWindow(
      navigate,
      effectiveWindowId,
      sepulturaId,
      updateWindowState,
      findWindowByPathAndInstanceId
    )
  }

  // Use the combined auto-selection and return data hook for entidades
  useAutoSelectionWithReturnData({
    windowId: effectiveWindowId,
    instanceId,
    data: entidadesData,
    setValue: (value: string) => {
      form.setValue('entidadeId', value, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      })
    },
    refetch: refetchEntidades,
    itemName: 'Entidade',
    successMessage: 'Entidade selecionada automaticamente',
    manualSelectionMessage:
      'Entidade criada com sucesso. Por favor, selecione-a manualmente.',
    queryKey: ['entidades-select'],
    returnDataKey: `return-data-${effectiveWindowId}-entidade`,
  })

  // Use the combined auto-selection and return data hook for sepulturas
  useAutoSelectionWithReturnData({
    windowId: effectiveWindowId,
    instanceId,
    data: sepulturasData,
    setValue: (value: string) => {
      // Find the current sepulturas array and update the sepulturaId for the last added sepultura
      const currentSepulturas = form.getValues('sepulturas') || []
      if (currentSepulturas.length > 0) {
        const lastIndex = currentSepulturas.length - 1
        form.setValue(`sepulturas.${lastIndex}.sepulturaId`, value)
      }
    },
    refetch: refetchSepulturas,
    itemName: 'Sepultura',
    successMessage: 'Sepultura selecionada automaticamente',
    manualSelectionMessage:
      'Sepultura criada com sucesso. Por favor, selecione-a manualmente.',
    queryKey: ['sepulturas-select'],
    returnDataKey: `return-data-${effectiveWindowId}-sepultura`,
  })

  const onSubmit = async (values: ProprietarioFormSchemaType) => {
    try {
      updateFormState(formId, (state) => ({
        ...state,
        isSubmitting: true,
      }))

      // Transform the form data to match the API structure
      const requestData: UpdateProprietarioDTO = {
        id: proprietarioId,
        cemiterioId: values.cemiterioId || '',
        entidadeId: values.entidadeId,
        sepulturas:
          values.sepulturas?.map((sepultura) => ({
            id: sepultura.id,
            sepulturaId: sepultura.sepulturaId,
            data: toDatabaseDate(sepultura.data) || new Date(),
            ativo: sepultura.ativo,
            isProprietario: sepultura.isProprietario,
            isResponsavel: sepultura.isResponsavel,
            isResponsavelGuiaReceita: sepultura.isResponsavelGuiaReceita,
            dataInativacao: toDatabaseDate(sepultura.dataInativacao),
            fracao: sepultura.fracao || undefined,
            observacoes: sepultura.observacoes || undefined,
            historico: sepultura.historico,
          })) || [],
      }

      const response = await updateProprietarioMutation.mutateAsync({
        id: proprietarioId,
        data: requestData,
      })

      const result = handleApiResponse(
        response,
        'Proprietário atualizado com sucesso',
        'Erro ao atualizar proprietário',
        'Proprietário atualizado com avisos'
      )

      if (result.success) {
        // Close the window
        if (effectiveWindowId) {
          removeWindow(effectiveWindowId)
        }
        modalClose()
      }
    } catch (error) {
      toast.error(handleApiError(error, 'Erro ao atualizar proprietário'))
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
          id='proprietarioUpdateForm'
          onSubmit={form.handleSubmit(onSubmit, handleError)}
          className='space-y-4'
          autoComplete='off'
        >
          <PersistentTabs
            defaultValue='identificacao'
            className='w-full'
            tabKey={`proprietario-${instanceId}`}
          >
            <TabsList>
              <TabsTrigger value='identificacao'>Identificação</TabsTrigger>
              <TabsTrigger value='sepulturas'>Sepulturas</TabsTrigger>
            </TabsList>
            <TabsContent value='identificacao'>
              <div className='space-y-6'>
                <Card className='overflow-hidden border-l-4 border-l-primary/20 hover:border-l-primary/40 transition-all duration-200 hover:shadow-md'>
                  <CardHeader className='pb-4'>
                    <div className='flex items-center gap-3'>
                      <div className='flex items-center justify-center w-8 h-8 rounded-md bg-primary/10 text-primary'>
                        <User className='h-4 w-4' />
                      </div>
                      <div>
                        <CardTitle className='text-base flex items-center gap-2'>
                          Identificação do Proprietário
                          <Badge variant='secondary' className='text-xs'>
                            Obrigatório
                          </Badge>
                        </CardTitle>
                        <p className='text-sm text-muted-foreground mt-1'>
                          Selecione a entidade proprietária associada
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className='space-y-6'>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                      <FormField
                        control={form.control}
                        name='entidadeId'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='flex items-center gap-2'>
                              <User className='h-4 w-4' />
                              Entidade
                              <Badge variant='secondary' className='text-xs'>
                                Obrigatório
                              </Badge>
                            </FormLabel>
                            <FormControl>
                              <div className='relative'>
                                <Autocomplete
                                  options={entidadesData.map((entidade) => ({
                                    value: entidade.id || '',
                                    label: entidade.nome,
                                  }))}
                                  value={String(field.value ?? '')}
                                  onValueChange={field.onChange}
                                  placeholder={
                                    isLoadingEntidades
                                      ? 'A carregar...'
                                      : 'Selecione uma entidade'
                                  }
                                  emptyText='Nenhuma entidade encontrada.'
                                  disabled={isLoadingEntidades}
                                  className='px-4 py-6 pr-32 shadow-inner drop-shadow-xl'
                                />
                                <div className='absolute right-12 top-1/2 -translate-y-1/2 flex gap-1'>
                                  <Button
                                    type='button'
                                    variant='outline'
                                    size='sm'
                                    onClick={handleViewEntidade}
                                    className='h-8 w-8 p-0'
                                    title='Ver Entidade'
                                    disabled={!field.value}
                                  >
                                    <Eye className='h-4 w-4' />
                                  </Button>
                                  <Button
                                    type='button'
                                    variant='outline'
                                    size='sm'
                                    onClick={handleCreateEntidade}
                                    className='h-8 w-8 p-0'
                                    title='Criar Nova Entidade'
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
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value='sepulturas'>
              <div className='space-y-6'>
                {/* Header with filter toggle and add button */}
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-2'>
                    <Button
                      type='button'
                      variant='outline'
                      size='sm'
                      onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                      className='flex items-center gap-2'
                      title='Filtros'
                    >
                      <SlidersHorizontal className='h-4 w-4' />
                      {hasActiveFilters() && (
                        <Badge variant='secondary' className='text-xs'>
                          {getActiveFiltersCount()}
                        </Badge>
                      )}
                    </Button>
                    {hasActiveFilters() && (
                      <Button
                        type='button'
                        variant='destructive'
                        size='sm'
                        onClick={clearAllFilters}
                        className='h-7 w-7 p-0'
                        title='Limpar Filtros'
                      >
                        <Trash2 className='h-4 w-4 text-white' />
                      </Button>
                    )}
                  </div>
                  <Button
                    type='button'
                    variant='outline'
                    size='sm'
                    onClick={() => {
                      const currentSepulturas =
                        form.getValues('sepulturas') || []

                      // Determine the default values based on existing sepulturas
                      const isFirstSepultura = currentSepulturas.length === 0

                      const newSepultura = {
                        id: undefined, // New sepultura
                        sepulturaId: '',
                        data: new Date(),
                        ativo: true,
                        isProprietario: isFirstSepultura, // true if first, false if not first
                        isResponsavel: isFirstSepultura, // true if first, false if not first
                        isResponsavelGuiaReceita: isFirstSepultura, // true if first, false if not first
                        dataInativacao: undefined,
                        fracao: '',
                        observacoes: '',
                        historico: false,
                      }

                      form.setValue('sepulturas', [
                        ...currentSepulturas,
                        newSepultura,
                      ])
                    }}
                    className='flex items-center gap-2'
                  >
                    <Plus className='h-4 w-4' />
                    Adicionar Sepultura
                  </Button>
                </div>

                {/* Collapsible Filters Panel */}
                {isFiltersOpen && (
                  <Card className='border-dashed border-2 border-muted-foreground/20'>
                    <CardHeader className='pb-3'>
                      <CardTitle className='text-sm flex items-center gap-2'>
                        <SlidersHorizontal className='h-4 w-4' />
                        Filtrar Sepulturas
                      </CardTitle>
                    </CardHeader>
                    <CardContent className='space-y-4'>
                      <div className='space-y-3'>
                        <div className='flex items-center gap-2'>
                          <span className='text-sm font-medium text-muted-foreground min-w-[80px]'>
                            Histórico:
                          </span>
                          <div className='flex items-center gap-1 bg-muted rounded-lg p-1'>
                            <Button
                              type='button'
                              variant={
                                filters.historico === 'all'
                                  ? 'default'
                                  : 'ghost'
                              }
                              size='sm'
                              onClick={() => updateFilter('historico', 'all')}
                              className='h-7 px-2 text-xs'
                            >
                              Todos
                            </Button>
                            <Button
                              type='button'
                              variant={
                                filters.historico === 'false'
                                  ? 'default'
                                  : 'ghost'
                              }
                              size='sm'
                              onClick={() => updateFilter('historico', 'false')}
                              className='h-7 px-2 text-xs'
                            >
                              Ativos
                            </Button>
                            <Button
                              type='button'
                              variant={
                                filters.historico === 'true'
                                  ? 'default'
                                  : 'ghost'
                              }
                              size='sm'
                              onClick={() => updateFilter('historico', 'true')}
                              className='h-7 px-2 text-xs'
                            >
                              Histórico
                            </Button>
                          </div>
                        </div>
                        <div className='flex items-center gap-2'>
                          <span className='text-sm font-medium text-muted-foreground min-w-[80px]'>
                            Status:
                          </span>
                          <div className='flex items-center gap-1 bg-muted rounded-lg p-1'>
                            <Button
                              type='button'
                              variant={
                                filters.ativo === 'all' ? 'default' : 'ghost'
                              }
                              size='sm'
                              onClick={() => updateFilter('ativo', 'all')}
                              className='h-7 px-2 text-xs'
                            >
                              Todos
                            </Button>
                            <Button
                              type='button'
                              variant={
                                filters.ativo === 'true' ? 'default' : 'ghost'
                              }
                              size='sm'
                              onClick={() => updateFilter('ativo', 'true')}
                              className='h-7 px-2 text-xs'
                            >
                              Ativos
                            </Button>
                            <Button
                              type='button'
                              variant={
                                filters.ativo === 'false' ? 'default' : 'ghost'
                              }
                              size='sm'
                              onClick={() => updateFilter('ativo', 'false')}
                              className='h-7 px-2 text-xs'
                            >
                              Inativos
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Sepulturas List */}
                <div className='space-y-4'>
                  {applyFilters(form.watch('sepulturas') || []).map(
                    (sepultura, index) => {
                      const selectedSepultura = sepulturasData.find(
                        (s) => s.id === sepultura.sepulturaId
                      )

                      return (
                        <Card
                          key={index}
                          className='overflow-hidden border-l-4 border-l-primary/20 hover:border-l-primary/40 transition-all duration-200 hover:shadow-md'
                        >
                          <CardHeader className='pb-4'>
                            <div className='flex items-center justify-between'>
                              <div className='flex items-center gap-3 flex-1'>
                                <Button
                                  type='button'
                                  variant='ghost'
                                  size='sm'
                                  onClick={() =>
                                    toggleSepulturaExpansion(index)
                                  }
                                  className='p-1 h-auto'
                                >
                                  {expandedSepulturas.has(index) ? (
                                    <ChevronDown className='h-4 w-4' />
                                  ) : (
                                    <ChevronRight className='h-4 w-4' />
                                  )}
                                </Button>
                                <div className='flex items-center justify-center w-8 h-8 rounded-md bg-primary/10 text-primary'>
                                  <MapPin className='h-4 w-4' />
                                </div>
                                <div className='flex-1'>
                                  <CardTitle className='text-base flex items-center gap-2'>
                                    Sepultura {index + 1}
                                    {sepultura.id && (
                                      <Badge
                                        variant='secondary'
                                        className='text-xs'
                                      >
                                        Existente
                                      </Badge>
                                    )}
                                    {!sepultura.id && (
                                      <Badge
                                        variant='outline'
                                        className='text-xs'
                                      >
                                        Nova
                                      </Badge>
                                    )}
                                  </CardTitle>
                                  {selectedSepultura && (
                                    <p className='text-sm text-muted-foreground mt-1'>
                                      {selectedSepultura.nome}
                                    </p>
                                  )}
                                  {!expandedSepulturas.has(index) && (
                                    <div className='flex flex-wrap gap-1 mt-2'>
                                      {getResponsibilityBadges(sepultura).map(
                                        (badge, badgeIndex) => (
                                          <Badge
                                            key={badgeIndex}
                                            variant={badge.variant}
                                            className='text-xs'
                                          >
                                            {badge.label}
                                          </Badge>
                                        )
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                              <Button
                                type='button'
                                variant='ghost'
                                size='sm'
                                onClick={() => {
                                  const currentSepulturas =
                                    form.getValues('sepulturas') || []
                                  form.setValue(
                                    'sepulturas',
                                    currentSepulturas.filter(
                                      (_, i) => i !== index
                                    )
                                  )
                                }}
                                className='text-destructive hover:text-destructive hover:bg-destructive/10'
                              >
                                <Trash2 className='h-4 w-4' />
                              </Button>
                            </div>
                          </CardHeader>
                          {expandedSepulturas.has(index) && (
                            <CardContent className='space-y-6'>
                              {/* Main Information Grid */}
                              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                <FormField
                                  control={form.control}
                                  name={`sepulturas.${index}.sepulturaId`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel className='flex items-center gap-2'>
                                        <MapPin className='h-4 w-4' />
                                        Sepultura
                                        <Badge
                                          variant='secondary'
                                          className='text-xs'
                                        >
                                          Obrigatório
                                        </Badge>
                                      </FormLabel>
                                      <FormControl>
                                        <div className='relative'>
                                          <Autocomplete
                                            options={sepulturasData.map(
                                              (sepultura) => ({
                                                value: sepultura.id || '',
                                                label: sepultura.nome,
                                              })
                                            )}
                                            value={String(field.value ?? '')}
                                            onValueChange={field.onChange}
                                            placeholder={
                                              isLoadingSepulturas
                                                ? 'A carregar...'
                                                : 'Selecione uma sepultura'
                                            }
                                            emptyText='Nenhuma sepultura encontrada.'
                                            disabled={isLoadingSepulturas}
                                            className='px-4 py-6 pr-32 shadow-inner drop-shadow-xl'
                                          />
                                          <div className='absolute right-12 top-1/2 -translate-y-1/2 flex gap-1'>
                                            <Button
                                              type='button'
                                              variant='outline'
                                              size='sm'
                                              onClick={() =>
                                                handleViewSepultura(index)
                                              }
                                              className='h-8 w-8 p-0'
                                              title='Ver Sepultura'
                                              disabled={!field.value}
                                            >
                                              <Eye className='h-4 w-4' />
                                            </Button>
                                            <Button
                                              type='button'
                                              variant='outline'
                                              size='sm'
                                              onClick={handleCreateSepultura}
                                              className='h-8 w-8 p-0'
                                              title='Criar Nova Sepultura'
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
                                  name={`sepulturas.${index}.fracao`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel className='flex items-center gap-2'>
                                        <User className='h-4 w-4' />
                                        Fração
                                      </FormLabel>
                                      <FormControl>
                                        <Input
                                          placeholder='Calculado automaticamente'
                                          {...field}
                                          className='px-4 py-6 shadow-inner drop-shadow-xl bg-muted/50'
                                          readOnly
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>

                              {/* Dates Grid */}
                              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                <FormField
                                  control={form.control}
                                  name={`sepulturas.${index}.data`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel className='flex items-center gap-2'>
                                        <Calendar className='h-4 w-4' />
                                        Data de Aquisição
                                        <Badge
                                          variant='secondary'
                                          className='text-xs'
                                        >
                                          Obrigatório
                                        </Badge>
                                      </FormLabel>
                                      <FormControl>
                                        <DatePicker
                                          value={field.value}
                                          onChange={field.onChange}
                                          placeholder='Selecione uma data'
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                <FormField
                                  control={form.control}
                                  name={`sepulturas.${index}.dataInativacao`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel className='flex items-center gap-2'>
                                        <Clock className='h-4 w-4' />
                                        Data de Inativação
                                      </FormLabel>
                                      <FormControl>
                                        <DatePicker
                                          value={field.value}
                                          onChange={field.onChange}
                                          placeholder='Selecione uma data'
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>

                              {/* Status Indicators */}
                              <div className='bg-muted/30 rounded-lg p-4'>
                                <h4 className='text-sm font-medium mb-3 flex items-center gap-2'>
                                  <Shield className='h-4 w-4' />
                                  Status e Responsabilidades
                                </h4>
                                <div className='grid grid-cols-2 md:grid-cols-4 gap-3'>
                                  <FormField
                                    control={form.control}
                                    name={`sepulturas.${index}.ativo`}
                                    render={({ field }) => (
                                      <FormItem className='flex flex-row items-center justify-between rounded-lg border p-3 bg-background'>
                                        <FormLabel className='text-sm flex items-center gap-2'>
                                          <div
                                            className={`w-2 h-2 rounded-full ${field.value ? 'bg-green-500' : 'bg-red-500'}`}
                                          />
                                          Ativo
                                        </FormLabel>
                                        <FormControl>
                                          <Switch
                                            checked={field.value}
                                            onCheckedChange={(newValue) => {
                                              field.onChange(newValue)
                                              // When deactivating, set dataInativacao to current date
                                              if (!newValue) {
                                                form.setValue(
                                                  `sepulturas.${index}.dataInativacao`,
                                                  new Date(),
                                                  {
                                                    shouldValidate: true,
                                                    shouldDirty: true,
                                                  }
                                                )
                                              } else {
                                                // When activating, clear dataInativacao
                                                form.setValue(
                                                  `sepulturas.${index}.dataInativacao`,
                                                  undefined,
                                                  {
                                                    shouldValidate: true,
                                                    shouldDirty: true,
                                                  }
                                                )
                                              }
                                            }}
                                          />
                                        </FormControl>
                                      </FormItem>
                                    )}
                                  />
                                  <FormField
                                    control={form.control}
                                    name={`sepulturas.${index}.isProprietario`}
                                    render={({ field }) => (
                                      <FormItem className='flex flex-row items-center justify-between rounded-lg border p-3 bg-background'>
                                        <FormLabel className='text-sm flex items-center gap-2'>
                                          <User className='h-3 w-3' />
                                          Proprietário
                                        </FormLabel>
                                        <FormControl>
                                          <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                          />
                                        </FormControl>
                                      </FormItem>
                                    )}
                                  />
                                  <FormField
                                    control={form.control}
                                    name={`sepulturas.${index}.isResponsavel`}
                                    render={({ field }) => (
                                      <FormItem className='flex flex-row items-center justify-between rounded-lg border p-3 bg-background'>
                                        <FormLabel className='text-sm flex items-center gap-2'>
                                          <Shield className='h-3 w-3' />
                                          Responsável
                                        </FormLabel>
                                        <FormControl>
                                          <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                          />
                                        </FormControl>
                                      </FormItem>
                                    )}
                                  />
                                  <FormField
                                    control={form.control}
                                    name={`sepulturas.${index}.isResponsavelGuiaReceita`}
                                    render={({ field }) => (
                                      <FormItem className='flex flex-row items-center justify-between rounded-lg border p-3 bg-background'>
                                        <FormLabel className='text-sm flex items-center gap-2'>
                                          <FileText className='h-3 w-3' />
                                          Guia Receita
                                        </FormLabel>
                                        <FormControl>
                                          <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                          />
                                        </FormControl>
                                      </FormItem>
                                    )}
                                  />
                                </div>
                              </div>

                              {/* Additional Options */}
                              <div className='space-y-4'>
                                <FormField
                                  control={form.control}
                                  name={`sepulturas.${index}.historico`}
                                  render={({ field }) => (
                                    <FormItem className='flex flex-row items-center justify-between rounded-lg border p-3 bg-muted/20'>
                                      <FormLabel className='text-sm flex items-center gap-2'>
                                        <AlertCircle className='h-4 w-4' />
                                        Histórico
                                      </FormLabel>
                                      <FormControl>
                                        <Switch
                                          checked={field.value}
                                          onCheckedChange={field.onChange}
                                        />
                                      </FormControl>
                                    </FormItem>
                                  )}
                                />
                                <FormField
                                  control={form.control}
                                  name={`sepulturas.${index}.observacoes`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel className='flex items-center gap-2'>
                                        <FileText className='h-4 w-4' />
                                        Observações
                                      </FormLabel>
                                      <FormControl>
                                        <Textarea
                                          placeholder='Observações sobre esta relação'
                                          {...field}
                                          value={field.value || ''}
                                          className='min-h-[100px] px-4 py-6 shadow-inner drop-shadow-xl'
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>
                            </CardContent>
                          )}
                        </Card>
                      )
                    }
                  )}

                  {(() => {
                    const sepulturas = form.watch('sepulturas') || []
                    const filteredSepulturas = applyFilters(sepulturas)

                    if (sepulturas.length === 0) {
                      return (
                        <Card className='border-dashed border-2 border-muted-foreground/20'>
                          <CardContent className='flex flex-col items-center justify-center py-12 text-center'>
                            <MapPin className='h-12 w-12 text-muted-foreground/50 mb-4' />
                            <h3 className='text-lg font-medium text-muted-foreground mb-2'>
                              Nenhuma sepultura adicionada
                            </h3>
                            <p className='text-sm text-muted-foreground mb-4 max-w-sm'>
                              Adicione sepulturas para associar a este
                              proprietário e gerir as responsabilidades.
                            </p>
                            <Button
                              type='button'
                              variant='outline'
                              size='sm'
                              onClick={() => {
                                const currentSepulturas =
                                  form.getValues('sepulturas') || []

                                const newSepultura = {
                                  id: undefined,
                                  sepulturaId: '',
                                  data: new Date(),
                                  ativo: true,
                                  isProprietario: true,
                                  isResponsavel: true,
                                  isResponsavelGuiaReceita: true,
                                  dataInativacao: undefined,
                                  fracao: '',
                                  observacoes: '',
                                  historico: false,
                                }

                                form.setValue('sepulturas', [
                                  ...currentSepulturas,
                                  newSepultura,
                                ])
                              }}
                              className='flex items-center gap-2'
                            >
                              <Plus className='h-4 w-4' />
                              Adicionar Primeira Sepultura
                            </Button>
                          </CardContent>
                        </Card>
                      )
                    }

                    if (filteredSepulturas.length === 0) {
                      return (
                        <Card className='border-dashed border-2 border-muted-foreground/20'>
                          <CardContent className='flex flex-col items-center justify-center py-12 text-center'>
                            <AlertCircle className='h-12 w-12 text-muted-foreground/50 mb-4' />
                            <h3 className='text-lg font-medium text-muted-foreground mb-2'>
                              Nenhuma sepultura encontrada
                            </h3>
                            <p className='text-sm text-muted-foreground mb-4 max-w-sm'>
                              Não existem sepulturas que correspondam ao filtro
                              selecionado.
                            </p>
                            <Button
                              type='button'
                              variant='outline'
                              size='sm'
                              onClick={clearAllFilters}
                              className='flex items-center gap-2'
                            >
                              Limpar Filtros
                            </Button>
                          </CardContent>
                        </Card>
                      )
                    }

                    return null
                  })()}
                </div>
              </div>
            </TabsContent>
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
              disabled={updateProprietarioMutation.isPending}
              className='w-full md:w-auto'
            >
              {updateProprietarioMutation.isPending
                ? 'A atualizar...'
                : 'Atualizar'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

export { ProprietarioUpdateForm }
