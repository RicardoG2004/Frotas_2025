import { useEffect, useRef, useState } from 'react'
import { z } from 'zod'
import { useForm, useWatch, type Resolver } from 'react-hook-form'
import { useGetProprietariosSelect } from '@/pages/cemiterios/proprietarios/queries/proprietarios-queries'
import { useGetSepulturasTiposSelect } from '@/pages/cemiterios/sepulturas-tipos/queries/sepulturas-tipos-queries'
import { useUpdateSepultura } from '@/pages/cemiterios/sepulturas/queries/sepulturas-mutations'
import { useGetSepultura } from '@/pages/cemiterios/sepulturas/queries/sepulturas-queries'
import { useGetTalhoesSelect } from '@/pages/cemiterios/talhoes/queries/talhoes-queries'
import { SepulturaEstadoLabel } from '@/types/enums/sepultura-estado.enum'
import { SepulturaSituacaoLabel } from '@/types/enums/sepultura-situacao.enum'
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
  Settings,
  Tag,
  Building2,
  Ruler,
  CalendarDays,
  ToggleLeft,
  MessageSquare,
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
  openTipoCreationWindow,
  openTalhaoCreationWindow,
  openProprietarioCreationWindow,
  openTipoViewWindow,
  openTalhaoViewWindow,
  openProprietarioViewWindow,
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

const proprietarioSchema = z.object({
  id: z.string().optional(),
  proprietarioId: z
    .string({
      message: 'O Proprietário é obrigatório',
    })
    .min(1, { message: 'O Proprietário é obrigatório' }),
  cemiterioId: z.string().optional(),
  entidadeId: z.string().optional(),
  data: z.date({ message: 'A Data é obrigatória' }),
  ativo: z.boolean().default(true),
  isProprietario: z.boolean().default(true),
  isResponsavel: z.boolean().default(false),
  isResponsavelGuiaReceita: z.boolean().default(false),
  dataInativacao: z.date().optional(),
  fracao: z.preprocess(
    (v) => (v === null ? undefined : v),
    z.string().optional()
  ),
  observacoes: z.preprocess(
    (v) => (v === null ? undefined : v),
    z.string().optional()
  ),
  historico: z.boolean().default(false),
})

const sepulturaFormSchema = z.object({
  nome: z
    .string({ message: 'O Nome é obrigatório' })
    .min(1, { message: 'O Nome deve ter pelo menos 1 caráter' }),
  talhaoId: z
    .string({ message: 'O Talhão é obrigatório' })
    .min(1, { message: 'O Talhão é obrigatório' }),
  sepulturaTipoId: z
    .string({
      message: 'O Tipo é obrigatório',
    })
    .min(1, { message: 'O Tipo é obrigatório' }),
  sepulturaEstadoId: z.number({
    message: 'O Estado é obrigatório',
  }),
  sepulturaSituacaoId: z.number({
    message: 'A Situação é obrigatória',
  }),
  largura: z.preprocess(
    (v) => (v === '' ? undefined : Number(v)),
    z.number().optional()
  ),
  comprimento: z.preprocess(
    (v) => (v === '' ? undefined : Number(v)),
    z.number().optional()
  ),
  area: z.preprocess(
    (v) => (v === '' ? undefined : Number(v)),
    z.number().optional()
  ),
  profundidade: z.preprocess(
    (v) => (v === '' ? undefined : Number(v)),
    z.number().optional()
  ),
  fila: z.string().optional(),
  coluna: z.string().optional(),
  dataConcessao: z.preprocess(
    (v) => (v ? fromDatabaseDate(v as string) : undefined),
    z.date().optional()
  ),
  dataInicioAluguer: z.preprocess(
    (v) => (v ? fromDatabaseDate(v as string) : undefined),
    z.date().optional()
  ),
  dataFimAluguer: z.preprocess(
    (v) => (v ? fromDatabaseDate(v as string) : undefined),
    z.date().optional()
  ),
  dataInicioReserva: z.preprocess(
    (v) => (v ? fromDatabaseDate(v as string) : undefined),
    z.date().optional()
  ),
  dataFimReserva: z.preprocess(
    (v) => (v ? fromDatabaseDate(v as string) : undefined),
    z.date().optional()
  ),
  dataConhecimento: z.preprocess(
    (v) => (v ? fromDatabaseDate(v as string) : undefined),
    z.date().optional()
  ),
  numeroConhecimento: z.string().optional(),
  fundura1: z.preprocess(
    (v) => (v === null || v === undefined ? false : Boolean(v)),
    z.boolean().default(false)
  ),
  fundura2: z.preprocess(
    (v) => (v === null || v === undefined ? false : Boolean(v)),
    z.boolean().default(false)
  ),
  fundura3: z.preprocess(
    (v) => (v === null || v === undefined ? false : Boolean(v)),
    z.boolean().default(false)
  ),
  anulado: z.preprocess(
    (v) => (v === null || v === undefined ? false : Boolean(v)),
    z.boolean().default(false)
  ),
  dataAnulacao: z.preprocess(
    (v) => (v ? fromDatabaseDate(v as string) : undefined),
    z.date().optional()
  ),
  observacao: z.string().optional(),
  bloqueada: z.preprocess(
    (v) => (v === null || v === undefined ? false : Boolean(v)),
    z.boolean().default(false)
  ),
  litigio: z.preprocess(
    (v) => (v === null || v === undefined ? undefined : Boolean(v)),
    z.boolean().optional()
  ),
  proprietarios: z.array(proprietarioSchema).optional(),
})

type SepulturaFormSchemaType = z.infer<typeof sepulturaFormSchema>

interface SepulturaUpdateFormProps {
  modalClose: () => void
  sepulturaId: string
  initialData: SepulturaFormSchemaType
}

const SepulturaUpdateForm = ({
  modalClose,
  sepulturaId,
  initialData,
}: SepulturaUpdateFormProps) => {
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

  const updateSepulturaMutation = useUpdateSepultura()
  const { data: sepulturaData } = useGetSepultura(sepulturaId)
  const {
    data: talhoesData = [],
    isLoading: isLoadingTalhoes,
    refetch: refetchTalhoes,
  } = useGetTalhoesSelect()
  const {
    data: tiposData = [],
    isLoading: isLoadingTipos,
    refetch: refetchTipos,
  } = useGetSepulturasTiposSelect()
  const {
    data: proprietariosData = [],
    isLoading: isLoadingProprietarios,
    refetch: refetchProprietarios,
  } = useGetProprietariosSelect()

  const effectiveWindowId = windowId || instanceId

  const sepulturaResolver: Resolver<SepulturaFormSchemaType> = async (
    values
  ) => {
    const result = sepulturaFormSchema.safeParse(values)
    if (result.success) {
      // Additional validation for fracao percentages
      const validation = validateFracaoPercentages()
      if (!validation.isValid && validation.total > 0) {
        return {
          values: {},
          errors: {
            proprietarios: {
              type: 'custom',
              message: `As frações devem somar exatamente 100% (atual: ${validation.total.toFixed(1)}%)`,
            },
          },
        }
      }
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

  const form = useForm<SepulturaFormSchemaType>({
    resolver: sepulturaResolver,
    defaultValues: initialData,
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
    criteriaMode: 'all',
  })

  const { setActiveTab } = useTabManager({
    defaultTab: 'identificacao',
    tabKey: `sepultura-${instanceId}`,
  })
  const { handleError } = useSubmitErrorTab<SepulturaFormSchemaType>({
    setActiveTab,
    fieldToTabMap: {
      default: 'identificacao',
      nome: 'identificacao',
      talhaoId: 'identificacao',
      sepulturaTipoId: 'identificacao',
      sepulturaEstadoId: 'identificacao',
      sepulturaSituacaoId: 'identificacao',
      largura: 'dimensoes',
      comprimento: 'dimensoes',
      area: 'dimensoes',
      profundidade: 'dimensoes',
      fila: 'dimensoes',
      coluna: 'dimensoes',
      proprietarios: 'proprietarios',
    },
  })

  // Watch relevant fields for instant reactivity
  const largura = useWatch({ control: form.control, name: 'largura' })
  const comprimento = useWatch({ control: form.control, name: 'comprimento' })
  const profundidade = useWatch({ control: form.control, name: 'profundidade' })
  const fundura1 = useWatch({ control: form.control, name: 'fundura1' })
  const fundura2 = useWatch({ control: form.control, name: 'fundura2' })
  const fundura3 = useWatch({ control: form.control, name: 'fundura3' })

  // Ref to track if profundidade was set by fundura switches
  const isProfundidadeFromFundura = useRef(false)

  // Ref to store normalized API data for change detection
  const normalizedApiDataRef = useRef<any>(null)

  // State to track which proprietarios are expanded
  const [expandedProprietarios, setExpandedProprietarios] = useState<
    Set<number>
  >(new Set())

  // State to track if manual fracao has been set
  const [hasManualFracao, setHasManualFracao] = useState(false)

  // Filter state interface
  interface ProprietarioFilters {
    historico: 'all' | 'true' | 'false'
    ativo: 'all' | 'true' | 'false'
    // Future filters can be added here
    // proprietario: 'all' | 'true' | 'false'
    // responsavel: 'all' | 'true' | 'false'
  }

  // State to track all filters
  const [filters, setFilters] = useState<ProprietarioFilters>({
    historico: 'false',
    ativo: 'all',
  })

  // State to track if filters panel is open
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)

  // Function to generate responsibility badges for a proprietario
  const getResponsibilityBadges = (proprietario: any) => {
    const badges = []

    if (proprietario.proprietario) {
      badges.push({ label: 'Proprietário', variant: 'default' as const })
    }
    if (proprietario.responsavel) {
      badges.push({ label: 'Responsável', variant: 'secondary' as const })
    }
    if (proprietario.responsavelGuiaReceita) {
      badges.push({ label: 'Guia Receita', variant: 'outline' as const })
    }
    if (proprietario.ativo) {
      badges.push({ label: 'Ativo', variant: 'default' as const })
    } else {
      badges.push({ label: 'Inativo', variant: 'destructive' as const })
    }

    // Add historico badge
    if (proprietario.historico) {
      badges.push({ label: 'Histórico', variant: 'destructive' as const })
    }

    // Add fracao percentage badge if available
    if (proprietario.fracao && proprietario.fracao.trim() !== '') {
      badges.push({ label: proprietario.fracao, variant: 'secondary' as const })
    }

    return badges
  }

  // Function to toggle proprietario expansion
  const toggleProprietarioExpansion = (index: number) => {
    setExpandedProprietarios((prev) => {
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
    filterKey: keyof ProprietarioFilters,
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

  // Function to apply filters to proprietarios
  const applyFilters = (proprietarios: any[]) => {
    return proprietarios.filter((proprietario) => {
      // Historico filter
      if (
        filters.historico !== 'all' &&
        proprietario.historico !== (filters.historico === 'true')
      ) {
        return false
      }

      // Ativo filter
      if (
        filters.ativo !== 'all' &&
        proprietario.ativo !== (filters.ativo === 'true')
      ) {
        return false
      }

      return true
    })
  }

  // Utility function to calculate fracao percentages for proprietarios
  const calculateProprietarioPercentages = () => {
    const proprietarios = form.getValues('proprietarios') || []
    const activeProprietarios = proprietarios.filter(
      (p) => p.isProprietario && p.ativo
    )

    if (activeProprietarios.length === 0) {
      return
    }

    // Check if any active proprietario already has a manual fracao set
    const hasExistingManualFracao = activeProprietarios.some(
      (p) => p.fracao && p.fracao.trim() !== ''
    )

    // Only auto-calculate if no manual fracao exists and no manual flag is set
    if (!hasManualFracao && !hasExistingManualFracao) {
      const percentage = Math.round(100 / activeProprietarios.length)

      // Update fracao for each active proprietario
      proprietarios.forEach((proprietario, index) => {
        if (proprietario.isProprietario && proprietario.ativo) {
          form.setValue(`proprietarios.${index}.fracao`, `${percentage}%`)
        } else {
          // Clear fracao for inactive or non-proprietario entries
          form.setValue(`proprietarios.${index}.fracao`, '')
        }
      })
    } else {
      // If manual fracao exists, only clear inactive entries
      proprietarios.forEach((proprietario, index) => {
        if (!proprietario.isProprietario || !proprietario.ativo) {
          form.setValue(`proprietarios.${index}.fracao`, '')
        }
      })
    }
  }

  // Utility function to validate fracao percentages
  const validateFracaoPercentages = () => {
    const proprietarios = form.getValues('proprietarios') || []
    const activeProprietarios = proprietarios.filter(
      (p) => p.isProprietario && p.ativo
    )

    if (activeProprietarios.length === 0) {
      return { isValid: true, total: 0, fracaoValues: [] }
    }

    let total = 0
    const fracaoValues: number[] = []

    activeProprietarios.forEach((proprietario) => {
      const fracaoValue = proprietario.fracao
      if (fracaoValue && fracaoValue.trim() !== '') {
        // Extract number from percentage string (e.g., "20%" -> 20)
        const match = fracaoValue.match(/(\d+(?:\.\d+)?)/)
        if (match) {
          const percentage = parseFloat(match[1])
          total += percentage
          fracaoValues.push(percentage)
        }
      }
    })

    return {
      isValid: Math.abs(total - 100) < 0.01, // Allow for small floating point differences
      total,
      fracaoValues,
    }
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
      form.reset(formData as SepulturaFormSchemaType)
    } else if (sepulturaData?.info?.data) {
      // If no saved data, use the data from the API
      const apiData = sepulturaData.info.data

      // Create normalized data for change detection (matching form structure)
      const normalizedProprietarios = (apiData.proprietarios ?? [])
        .slice()
        .sort((a, b) => {
          if (!a.createdOn || !b.createdOn) return 0
          return (
            new Date(a.createdOn).getTime() - new Date(b.createdOn).getTime()
          )
        })
        .map((proprietario) => ({
          ...proprietario,
          data: fromDatabaseDate(proprietario.data) || new Date(),
          dataInativacao: fromDatabaseDate(proprietario.dataInativacao),
        }))

      // Store normalized data for change detection
      const normalizedApiData = {
        ...apiData,
        proprietarios: normalizedProprietarios,
      }

      // Store the normalized data in a ref or state for change detection
      if (!normalizedApiDataRef.current) {
        normalizedApiDataRef.current = {}
      }
      normalizedApiDataRef.current[sepulturaId] = normalizedApiData

      form.reset({
        nome: apiData.nome,
        talhaoId: apiData.talhaoId,
        sepulturaTipoId: apiData.sepulturaTipoId,
        sepulturaEstadoId: apiData.sepulturaEstadoId,
        sepulturaSituacaoId: apiData.sepulturaSituacaoId,
        largura: apiData.largura,
        comprimento: apiData.comprimento,
        area: apiData.area,
        profundidade: apiData.profundidade,
        fila: apiData.fila,
        coluna: apiData.coluna,
        dataConcessao: apiData.dataConcessao,
        dataInicioAluguer: apiData.dataInicioAluguer,
        dataFimAluguer: apiData.dataFimAluguer,
        dataInicioReserva: apiData.dataInicioReserva,
        dataFimReserva: apiData.dataFimReserva,
        dataConhecimento: apiData.dataConhecimento,
        numeroConhecimento: apiData.numeroConhecimento,
        fundura1: apiData.fundura1,
        fundura2: apiData.fundura2,
        fundura3: apiData.fundura3,
        anulado: apiData.anulado,
        dataAnulacao: apiData.dataAnulacao,
        observacao: apiData.observacao,
        bloqueada: apiData.bloqueada,
        litigio: apiData.litigio,
        proprietarios: normalizedProprietarios,
      })

      // Auto-calculate percentages only if no manual fracao is set
      setTimeout(() => calculateProprietarioPercentages(), 0)
    }
  }, [formData, isInitialized, formId, hasFormData, sepulturaData, sepulturaId])

  // Save form data when it changes
  useEffect(() => {
    const subscription = form.watch((value) => {
      if (value.nome || value.talhaoId || value.sepulturaTipoId) {
        // Use proper change detection by comparing with normalized original values
        const normalizedOriginalData =
          normalizedApiDataRef.current?.[sepulturaId] ||
          sepulturaData?.info?.data ||
          {}
        const hasChanges = detectUpdateFormChanges(
          value,
          normalizedOriginalData
        )

        setFormState(formId, {
          formData: value as SepulturaFormSchemaType,
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
        // Update window title based on nome field
        const newTitle = value.nome || 'Sepultura'
        updateUpdateWindowTitle(effectiveWindowId, newTitle, updateWindowState)
      }
    })
    return () => subscription.unsubscribe()
  }, [form, effectiveWindowId, sepulturaData, formId])

  // Automatically calculate area when all three measures are filled
  useEffect(() => {
    const l = Number(largura)
    const c = Number(comprimento)
    const p = Number(profundidade)
    if (!isNaN(l) && l > 0 && !isNaN(c) && c > 0 && !isNaN(p) && p > 0) {
      const area = l * c
      if (form.getValues('area') !== area) {
        form.setValue('area', area, { shouldValidate: true, shouldDirty: true })
      }
    } else {
      if (form.getValues('area')) {
        form.setValue('area', undefined, {
          shouldValidate: true,
          shouldDirty: true,
        })
      }
    }
  }, [largura, comprimento, profundidade])

  // Automatically update profundidade when fundura switches are toggled
  useEffect(() => {
    // Determine the recommended depth based on active funduras
    let recommendedDepth = 0
    if (fundura3) {
      recommendedDepth = 240
    } else if (fundura2) {
      recommendedDepth = 180
    } else if (fundura1) {
      recommendedDepth = 100
    }
    const currentProfundidade = Number(form.getValues('profundidade'))
    if (recommendedDepth > 0 && currentProfundidade !== recommendedDepth) {
      isProfundidadeFromFundura.current = true
      form.setValue('profundidade', recommendedDepth, {
        shouldValidate: true,
        shouldDirty: true,
      })
    } else if (recommendedDepth === 0 && currentProfundidade > 0) {
      isProfundidadeFromFundura.current = true
      form.setValue('profundidade', 175, {
        shouldValidate: true,
        shouldDirty: true,
      })
    }
  }, [fundura1, fundura2, fundura3])

  // When profundidade is changed manually, update fundura switches accordingly
  useEffect(() => {
    if (isProfundidadeFromFundura.current) {
      isProfundidadeFromFundura.current = false
      return
    }
    const p = Number(profundidade)
    if (!isNaN(p)) {
      if (p >= 220) {
        if (!fundura1)
          form.setValue('fundura1', true, {
            shouldValidate: true,
            shouldDirty: true,
          })
        if (!fundura2)
          form.setValue('fundura2', true, {
            shouldValidate: true,
            shouldDirty: true,
          })
        if (!fundura3)
          form.setValue('fundura3', true, {
            shouldValidate: true,
            shouldDirty: true,
          })
      } else if (p >= 160) {
        if (!fundura1)
          form.setValue('fundura1', true, {
            shouldValidate: true,
            shouldDirty: true,
          })
        if (!fundura2)
          form.setValue('fundura2', true, {
            shouldValidate: true,
            shouldDirty: true,
          })
        if (fundura3)
          form.setValue('fundura3', false, {
            shouldValidate: true,
            shouldDirty: true,
          })
      } else if (p >= 80) {
        if (!fundura1)
          form.setValue('fundura1', true, {
            shouldValidate: true,
            shouldDirty: true,
          })
        if (fundura2)
          form.setValue('fundura2', false, {
            shouldValidate: true,
            shouldDirty: true,
          })
        if (fundura3)
          form.setValue('fundura3', false, {
            shouldValidate: true,
            shouldDirty: true,
          })
      } else {
        if (fundura1)
          form.setValue('fundura1', false, {
            shouldValidate: true,
            shouldDirty: true,
          })
        if (fundura2)
          form.setValue('fundura2', false, {
            shouldValidate: true,
            shouldDirty: true,
          })
        if (fundura3)
          form.setValue('fundura3', false, {
            shouldValidate: true,
            shouldDirty: true,
          })
      }
    }
  }, [profundidade])

  // Handle sequential fundura logic
  const handleFunduraChange = (funduraNumber: 1 | 2 | 3, newValue: boolean) => {
    if (newValue) {
      // When activating a fundura, ensure all previous funduras are also active
      if (funduraNumber === 2 && !form.getValues('fundura1')) {
        form.setValue('fundura1', true, {
          shouldValidate: true,
          shouldDirty: true,
        })
      }
      if (funduraNumber === 3 && !form.getValues('fundura1')) {
        form.setValue('fundura1', true, {
          shouldValidate: true,
          shouldDirty: true,
        })
      }
      if (funduraNumber === 3 && !form.getValues('fundura2')) {
        form.setValue('fundura2', true, {
          shouldValidate: true,
          shouldDirty: true,
        })
      }
      // Set the target fundura
      form.setValue(`fundura${funduraNumber}`, true, {
        shouldValidate: true,
        shouldDirty: true,
      })
    } else {
      // When deactivating a fundura, ensure all subsequent funduras are also deactivated
      if (funduraNumber === 1) {
        form.setValue('fundura2', false, {
          shouldValidate: true,
          shouldDirty: true,
        })
        form.setValue('fundura3', false, {
          shouldValidate: true,
          shouldDirty: true,
        })
      }
      if (funduraNumber === 2) {
        form.setValue('fundura3', false, {
          shouldValidate: true,
          shouldDirty: true,
        })
      }
      // Set the target fundura
      form.setValue(`fundura${funduraNumber}`, false, {
        shouldValidate: true,
        shouldDirty: true,
      })
    }
  }

  const handleClose = () => {
    // Clean up all form instances for the current window
    cleanupWindowForms(effectiveWindowId)

    handleWindowClose(effectiveWindowId, navigate, removeWindow)
  }

  const handleCreateTipo = () => {
    // Open tipo creation in a new window with parent reference
    openTipoCreationWindow(
      navigate,
      effectiveWindowId,
      updateWindowState,
      findWindowByPathAndInstanceId
    )
  }

  const handleViewTipo = () => {
    const tipoId = form.getValues('sepulturaTipoId')
    if (!tipoId) {
      toast.error('Por favor, selecione um tipo primeiro')
      return
    }

    openTipoViewWindow(
      navigate,
      effectiveWindowId,
      tipoId,
      updateWindowState,
      findWindowByPathAndInstanceId
    )
  }

  const handleCreateTalhao = () => {
    // Open talhao creation in a new window with parent reference
    openTalhaoCreationWindow(
      navigate,
      effectiveWindowId,
      updateWindowState,
      findWindowByPathAndInstanceId
    )
  }

  const handleViewTalhao = () => {
    const talhaoId = form.getValues('talhaoId')
    if (!talhaoId) {
      toast.error('Por favor, selecione um talhão primeiro')
      return
    }

    openTalhaoViewWindow(
      navigate,
      effectiveWindowId,
      talhaoId,
      updateWindowState,
      findWindowByPathAndInstanceId
    )
  }

  const handleCreateProprietario = () => {
    // Open proprietario creation in a new window with parent reference
    openProprietarioCreationWindow(
      navigate,
      effectiveWindowId,
      updateWindowState,
      findWindowByPathAndInstanceId
    )
  }

  const handleViewProprietario = (index: number) => {
    const proprietarioId = form.getValues(
      `proprietarios.${index}.proprietarioId`
    )
    if (!proprietarioId) {
      toast.error('Por favor, selecione um proprietário primeiro')
      return
    }

    openProprietarioViewWindow(
      navigate,
      effectiveWindowId,
      proprietarioId,
      updateWindowState,
      findWindowByPathAndInstanceId
    )
  }

  // Use the combined auto-selection and return data hook for tipos
  useAutoSelectionWithReturnData({
    windowId: effectiveWindowId,
    instanceId,
    data: tiposData,
    setValue: (value: string) => form.setValue('sepulturaTipoId', value),
    refetch: refetchTipos,
    itemName: 'Tipo',
    successMessage: 'Tipo selecionado automaticamente',
    manualSelectionMessage:
      'Tipo criado com sucesso. Por favor, selecione-o manualmente.',
    queryKey: ['sepulturas-tipos-select'],
    returnDataKey: `return-data-${effectiveWindowId}-sepultura-tipo`,
  })

  // Use the combined auto-selection and return data hook for talhões
  useAutoSelectionWithReturnData({
    windowId: effectiveWindowId,
    instanceId,
    data: talhoesData,
    setValue: (value: string) => form.setValue('talhaoId', value),
    refetch: refetchTalhoes,
    itemName: 'Talhão',
    successMessage: 'Talhão selecionado automaticamente',
    manualSelectionMessage:
      'Talhão criado com sucesso. Por favor, selecione-o manualmente.',
    queryKey: ['talhoes-select'],
    returnDataKey: `return-data-${effectiveWindowId}-talhao`,
  })

  // Use the combined auto-selection and return data hook for proprietarios
  useAutoSelectionWithReturnData({
    windowId: effectiveWindowId,
    instanceId,
    data: proprietariosData,
    setValue: (value: string) => {
      // Find the current proprietarios array and update the proprietarioId for the last added proprietario
      const currentProprietarios = form.getValues('proprietarios') || []
      if (currentProprietarios.length > 0) {
        const lastIndex = currentProprietarios.length - 1
        form.setValue(`proprietarios.${lastIndex}.proprietarioId`, value)
      }
    },
    refetch: refetchProprietarios,
    itemName: 'Proprietário',
    successMessage: 'Proprietário selecionado automaticamente',
    manualSelectionMessage:
      'Proprietário criado com sucesso. Por favor, selecione-o manualmente.',
    queryKey: ['proprietarios-select'],
    returnDataKey: `return-data-${effectiveWindowId}-proprietario`,
  })

  const onSubmit = async (values: SepulturaFormSchemaType) => {
    try {
      // Convert enum values back to numbers for API submission
      const finalValues = {
        ...values,
        sepulturaEstadoId: values.sepulturaEstadoId,
        sepulturaSituacaoId: values.sepulturaSituacaoId,
      }

      updateFormState(formId, (state) => ({
        ...state,
        isSubmitting: true,
      }))

      const proprietarios = values.proprietarios?.map((p) => {
        const dto: any = {
          id: p.id ?? undefined,
          sepulturaId: sepulturaId,
          data: toDatabaseDate(p.data) || new Date(),
          ativo: p.ativo,
          isProprietario: p.isProprietario,
          isResponsavel: p.isResponsavel,
          isResponsavelGuiaReceita: p.isResponsavelGuiaReceita,
          dataInativacao: toDatabaseDate(p.dataInativacao),
          fracao: p.fracao || undefined,
          observacoes: p.observacoes || undefined,
          historico: p.historico,
        }
        if (p.proprietarioId) dto.proprietarioId = p.proprietarioId
        if (p.entidadeId && p.proprietarioId) {
          dto.entidadeId = p.entidadeId
          dto.proprietarioId = p.proprietarioId
        }
        Object.keys(dto).forEach((k) => dto[k] === undefined && delete dto[k])
        return dto
      })

      const response = await updateSepulturaMutation.mutateAsync({
        id: sepulturaId,
        data: {
          ...finalValues,
          id: sepulturaId,
          dataConcessao: toDatabaseDate(finalValues.dataConcessao),
          dataInicioAluguer: toDatabaseDate(finalValues.dataInicioAluguer),
          dataFimAluguer: toDatabaseDate(finalValues.dataFimAluguer),
          dataInicioReserva: toDatabaseDate(finalValues.dataInicioReserva),
          dataFimReserva: toDatabaseDate(finalValues.dataFimReserva),
          dataConhecimento: toDatabaseDate(finalValues.dataConhecimento),
          dataAnulacao: toDatabaseDate(finalValues.dataAnulacao),
          proprietarios,
        },
      })

      const result = handleApiResponse(
        response,
        'Sepultura atualizada com sucesso',
        'Erro ao atualizar sepultura',
        'Sepultura atualizada com avisos'
      )

      if (result.success) {
        // Close the window
        if (effectiveWindowId) {
          removeWindow(effectiveWindowId)
        }
        modalClose()
      }
    } catch (error) {
      toast.error(handleApiError(error, 'Erro ao atualizar sepultura'))
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
          id='sepulturaUpdateForm'
          onSubmit={form.handleSubmit(onSubmit, handleError)}
          className='space-y-4'
          autoComplete='off'
        >
          <PersistentTabs
            defaultValue='identificacao'
            className='w-full'
            tabKey={`sepultura-${instanceId}`}
          >
            <TabsList>
              <TabsTrigger value='identificacao'>Identificação</TabsTrigger>
              <TabsTrigger value='dimensoes'>
                Dimensões & Localização
              </TabsTrigger>
              <TabsTrigger value='datas'>Datas</TabsTrigger>
              <TabsTrigger value='opcoes'>Opções</TabsTrigger>
              <TabsTrigger value='observacoes'>Observações</TabsTrigger>
              <TabsTrigger value='proprietarios'>Proprietários</TabsTrigger>
            </TabsList>
            <TabsContent value='identificacao'>
              <div className='space-y-6'>
                <Card className='overflow-hidden border-l-4 border-l-primary/20 hover:border-l-primary/40 transition-all duration-200 hover:shadow-md'>
                  <CardHeader className='pb-4'>
                    <div className='flex items-center gap-3'>
                      <div className='flex items-center justify-center w-8 h-8 rounded-md bg-primary/10 text-primary'>
                        <Tag className='h-4 w-4' />
                      </div>
                      <div>
                        <CardTitle className='text-base flex items-center gap-2'>
                          Identificação da Sepultura
                          <Badge variant='secondary' className='text-xs'>
                            Obrigatório
                          </Badge>
                        </CardTitle>
                        <p className='text-sm text-muted-foreground mt-1'>
                          Informações básicas para identificação da sepultura
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className='space-y-6'>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                      <FormField
                        control={form.control}
                        name='nome'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='flex items-center gap-2'>
                              <Tag className='h-4 w-4' />
                              Nome
                            </FormLabel>
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
                        name='talhaoId'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='flex items-center gap-2'>
                              <Building2 className='h-4 w-4' />
                              Talhão
                            </FormLabel>
                            <FormControl>
                              <div className='relative'>
                                <Autocomplete
                                  options={talhoesData.map((talhao) => ({
                                    value: talhao.id || '',
                                    label: talhao.nome,
                                  }))}
                                  value={String(field.value ?? '')}
                                  onValueChange={field.onChange}
                                  placeholder={
                                    isLoadingTalhoes
                                      ? 'A carregar...'
                                      : 'Selecione um talhão'
                                  }
                                  emptyText='Nenhum talhão encontrado.'
                                  disabled={isLoadingTalhoes}
                                  className='px-4 py-6 pr-32 shadow-inner drop-shadow-xl'
                                />
                                <div className='absolute right-12 top-1/2 -translate-y-1/2 flex gap-1'>
                                  <Button
                                    type='button'
                                    variant='outline'
                                    size='sm'
                                    onClick={handleViewTalhao}
                                    className='h-8 w-8 p-0'
                                    title='Ver Talhão'
                                    disabled={!field.value}
                                  >
                                    <Eye className='h-4 w-4' />
                                  </Button>
                                  <Button
                                    type='button'
                                    variant='outline'
                                    size='sm'
                                    onClick={handleCreateTalhao}
                                    className='h-8 w-8 p-0'
                                    title='Criar Novo Talhão'
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
                        name='sepulturaTipoId'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='flex items-center gap-2'>
                              <Tag className='h-4 w-4' />
                              Tipo
                            </FormLabel>
                            <FormControl>
                              <div className='relative'>
                                <Autocomplete
                                  options={tiposData.map((tipo) => ({
                                    value: tipo.id || '',
                                    label: tipo.nome,
                                  }))}
                                  value={String(field.value ?? '')}
                                  onValueChange={field.onChange}
                                  placeholder={
                                    isLoadingTipos
                                      ? 'A carregar...'
                                      : 'Selecione um tipo'
                                  }
                                  emptyText='Nenhum tipo encontrado.'
                                  disabled={isLoadingTipos}
                                  className='px-4 py-6 pr-32 shadow-inner drop-shadow-xl'
                                />
                                <div className='absolute right-12 top-1/2 -translate-y-1/2 flex gap-1'>
                                  <Button
                                    type='button'
                                    variant='outline'
                                    size='sm'
                                    onClick={handleViewTipo}
                                    className='h-8 w-8 p-0'
                                    title='Ver Tipo'
                                    disabled={!field.value}
                                  >
                                    <Eye className='h-4 w-4' />
                                  </Button>
                                  <Button
                                    type='button'
                                    variant='outline'
                                    size='sm'
                                    onClick={handleCreateTipo}
                                    className='h-8 w-8 p-0'
                                    title='Criar Novo Tipo'
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
                        name='sepulturaEstadoId'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='flex items-center gap-2'>
                              <Shield className='h-4 w-4' />
                              Estado
                            </FormLabel>
                            <FormControl>
                              <Autocomplete
                                options={Object.entries(
                                  SepulturaEstadoLabel
                                ).map(([key, label]) => ({
                                  value: key,
                                  label: label,
                                }))}
                                value={String(field.value ?? '')}
                                onValueChange={(value) =>
                                  field.onChange(
                                    value ? Number(value) : undefined
                                  )
                                }
                                placeholder='Selecione um estado'
                                emptyText='Nenhum estado encontrado.'
                                className='px-4 py-6 shadow-inner drop-shadow-xl'
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name='sepulturaSituacaoId'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='flex items-center gap-2'>
                              <Shield className='h-4 w-4' />
                              Situação
                            </FormLabel>
                            <FormControl>
                              <Autocomplete
                                options={Object.entries(
                                  SepulturaSituacaoLabel
                                ).map(([key, label]) => ({
                                  value: key,
                                  label: label,
                                }))}
                                value={String(field.value ?? '')}
                                onValueChange={(value) =>
                                  field.onChange(
                                    value ? Number(value) : undefined
                                  )
                                }
                                placeholder='Selecione uma situação'
                                emptyText='Nenhuma situação encontrada.'
                                className='px-4 py-6 shadow-inner drop-shadow-xl'
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
            </TabsContent>
            <TabsContent value='dimensoes'>
              <div className='space-y-6'>
                <Card className='overflow-hidden border-l-4 border-l-primary/20 hover:border-l-primary/40 transition-all duration-200 hover:shadow-md'>
                  <CardHeader className='pb-4'>
                    <div className='flex items-center gap-3'>
                      <div className='flex items-center justify-center w-8 h-8 rounded-md bg-primary/10 text-primary'>
                        <Ruler className='h-4 w-4' />
                      </div>
                      <div>
                        <CardTitle className='text-base flex items-center gap-2'>
                          Dimensões & Localização
                          <Badge variant='outline' className='text-xs'>
                            Opcional
                          </Badge>
                        </CardTitle>
                        <p className='text-sm text-muted-foreground mt-1'>
                          Defina as dimensões e localização da sepultura
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className='space-y-6'>
                    <div className='grid grid-cols-2 gap-4'>
                      <div className='flex items-center justify-center rounded-lg border p-4 bg-muted/50'>
                        <div className='relative w-full max-w-[300px] aspect-[4/3]'>
                          <svg
                            viewBox='0 0 400 300'
                            className='w-full h-full'
                            preserveAspectRatio='xMidYMid meet'
                          >
                            {/* Background grid */}
                            <pattern
                              id='grid'
                              width='20'
                              height='20'
                              patternUnits='userSpaceOnUse'
                            >
                              <path
                                d='M 20 0 L 0 0 0 20'
                                fill='none'
                                stroke='currentColor'
                                strokeWidth='0.5'
                                className='text-muted-foreground/30'
                              />
                            </pattern>
                            <rect
                              width='100%'
                              height='100%'
                              fill='url(#grid)'
                            />

                            {/* 3D Sepultura shape */}
                            {(() => {
                              // Get raw values
                              const rawWidth = largura ? Number(largura) : 100
                              const rawLength = comprimento
                                ? Number(comprimento)
                                : 75
                              const rawDepth = profundidade
                                ? Number(profundidade)
                                : 25

                              // Perspective factor for isometric view (30 degrees)
                              const perspective = 0.577 // tan(30°) ≈ 0.577

                              // Calculate the 3D bounding box corners
                              // Top face
                              const topFrontLeft = { x: 0, y: 0 }
                              const topFrontRight = { x: rawWidth, y: 0 }
                              const topBackRight = {
                                x: rawWidth + rawLength * perspective,
                                y: rawLength * perspective,
                              }
                              const topBackLeft = {
                                x: 0 + rawLength * perspective,
                                y: rawLength * perspective,
                              }
                              // Bottom face (shifted by depth)
                              const bottomFrontLeft = { x: 0, y: rawDepth }
                              const bottomFrontRight = {
                                x: rawWidth,
                                y: rawDepth,
                              }
                              const bottomBackRight = {
                                x: rawWidth + rawLength * perspective,
                                y: rawLength * perspective + rawDepth,
                              }
                              const bottomBackLeft = {
                                x: 0 + rawLength * perspective,
                                y: rawLength * perspective + rawDepth,
                              }

                              // Find min/max for bounding box
                              const allPoints = [
                                topFrontLeft,
                                topFrontRight,
                                topBackRight,
                                topBackLeft,
                                bottomFrontLeft,
                                bottomFrontRight,
                                bottomBackRight,
                                bottomBackLeft,
                              ]
                              const minX = Math.min(
                                ...allPoints.map((p) => p.x)
                              )
                              const maxX = Math.max(
                                ...allPoints.map((p) => p.x)
                              )
                              const minY = Math.min(
                                ...allPoints.map((p) => p.y)
                              )
                              const maxY = Math.max(
                                ...allPoints.map((p) => p.y)
                              )

                              // SVG viewBox size
                              const viewBoxWidth = 400
                              const viewBoxHeight = 300
                              const padding = 20

                              // Calculate scale to fit bounding box + padding
                              const shapeWidth = maxX - minX
                              const shapeHeight = maxY - minY
                              const scale = Math.min(
                                (viewBoxWidth - 2 * padding) / shapeWidth,
                                (viewBoxHeight - 2 * padding) / shapeHeight
                              )

                              // Offset to center the shape
                              const offsetX =
                                (viewBoxWidth - shapeWidth * scale) / 2 -
                                minX * scale
                              const offsetY =
                                (viewBoxHeight - shapeHeight * scale) / 2 -
                                minY * scale

                              // Helper to scale and offset points
                              const tx = (x: number) => x * scale + offsetX
                              const ty = (y: number) => y * scale + offsetY

                              // Points for polygons
                              const points = {
                                top: {
                                  x1: tx(topFrontLeft.x),
                                  y1: ty(topFrontLeft.y),
                                  x2: tx(topFrontRight.x),
                                  y2: ty(topFrontRight.y),
                                  x3: tx(topBackRight.x),
                                  y3: ty(topBackRight.y),
                                  x4: tx(topBackLeft.x),
                                  y4: ty(topBackLeft.y),
                                },
                                bottom: {
                                  x1: tx(bottomFrontLeft.x),
                                  y1: ty(bottomFrontLeft.y),
                                  x2: tx(bottomFrontRight.x),
                                  y2: ty(bottomFrontRight.y),
                                  x3: tx(bottomBackRight.x),
                                  y3: ty(bottomBackRight.y),
                                  x4: tx(bottomBackLeft.x),
                                  y4: ty(bottomBackLeft.y),
                                },
                              }

                              return (
                                <>
                                  {/* Bottom face */}
                                  <polygon
                                    points={`${points.bottom.x1},${points.bottom.y1} ${points.bottom.x2},${points.bottom.y2} ${points.bottom.x3},${points.bottom.y3} ${points.bottom.x4},${points.bottom.y4}`}
                                    fill='none'
                                    stroke='currentColor'
                                    strokeWidth='2'
                                    className='text-primary/50'
                                  />
                                  {/* Side faces */}
                                  <polygon
                                    points={`${points.top.x1},${points.top.y1} ${points.top.x2},${points.top.y2} ${points.bottom.x2},${points.bottom.y2} ${points.bottom.x1},${points.bottom.y1}`}
                                    fill='none'
                                    stroke='currentColor'
                                    strokeWidth='2'
                                    className='text-primary/70'
                                  />
                                  <polygon
                                    points={`${points.top.x2},${points.top.y2} ${points.top.x3},${points.top.y3} ${points.bottom.x3},${points.bottom.y3} ${points.bottom.x2},${points.bottom.y2}`}
                                    fill='none'
                                    stroke='currentColor'
                                    strokeWidth='2'
                                    className='text-primary/70'
                                  />
                                  <polygon
                                    points={`${points.top.x3},${points.top.y3} ${points.top.x4},${points.top.y4} ${points.bottom.x4},${points.bottom.y4} ${points.bottom.x3},${points.bottom.y3}`}
                                    fill='none'
                                    stroke='currentColor'
                                    strokeWidth='2'
                                    className='text-primary/70'
                                  />
                                  <polygon
                                    points={`${points.top.x4},${points.top.y4} ${points.top.x1},${points.top.y1} ${points.bottom.x1},${points.bottom.y1} ${points.bottom.x4},${points.bottom.y4}`}
                                    fill='none'
                                    stroke='currentColor'
                                    strokeWidth='2'
                                    className='text-primary/70'
                                  />
                                  {/* Top face */}
                                  <polygon
                                    points={`${points.top.x1},${points.top.y1} ${points.top.x2},${points.top.y2} ${points.top.x3},${points.top.y3} ${points.top.x4},${points.top.y4}`}
                                    fill='none'
                                    stroke='currentColor'
                                    strokeWidth='2'
                                    className='text-primary'
                                  />
                                  {/* Measurements */}
                                  {/* Profundidade (depth) label near red line */}
                                  <text
                                    x={
                                      (points.top.x1 + points.bottom.x1) / 2 -
                                      10
                                    }
                                    y={(points.top.y1 + points.bottom.y1) / 2}
                                    textAnchor='end'
                                    className='text-xs fill-muted-foreground'
                                  >
                                    {profundidade
                                      ? `${profundidade} cm`
                                      : 'Profundidade'}
                                  </text>
                                  {/* Comprimento (length) label near green line */}
                                  <text
                                    x={(points.top.x1 + points.top.x4) / 2}
                                    y={(points.top.y1 + points.top.y4) / 2 - 8}
                                    textAnchor='middle'
                                    className='text-xs fill-muted-foreground'
                                  >
                                    {comprimento
                                      ? `${comprimento} cm`
                                      : 'Comprimento'}
                                  </text>
                                  {/* Largura (width) label near yellow line */}
                                  <text
                                    x={(points.top.x1 + points.top.x2) / 2}
                                    y={points.top.y1 - 8}
                                    textAnchor='middle'
                                    className='text-xs fill-muted-foreground'
                                  >
                                    {largura ? `${largura} cm` : 'Largura'}
                                  </text>
                                  {/* Highlight Profundidade (depth) - red */}
                                  <line
                                    x1={points.top.x1}
                                    y1={points.top.y1}
                                    x2={points.bottom.x1}
                                    y2={points.bottom.y1}
                                    stroke='red'
                                    strokeWidth={3}
                                  />
                                  {/* Highlight Comprimento (length) - green */}
                                  <line
                                    x1={points.top.x1}
                                    y1={points.top.y1}
                                    x2={points.top.x4}
                                    y2={points.top.y4}
                                    stroke='green'
                                    strokeWidth={3}
                                  />
                                  {/* Highlight Largura (width) - yellow */}
                                  <line
                                    x1={points.top.x1}
                                    y1={points.top.y1}
                                    x2={points.top.x2}
                                    y2={points.top.y2}
                                    stroke='yellow'
                                    strokeWidth={3}
                                  />
                                </>
                              )
                            })()}

                            {/* Volume text */}
                            <text
                              x='50%'
                              y='50%'
                              textAnchor='middle'
                              dominantBaseline='middle'
                              className='text-sm font-medium fill-muted-foreground'
                            >
                              {form.watch('area')
                                ? `${form.watch('area')} cm²`
                                : 'Área'}
                            </text>
                          </svg>
                        </div>
                      </div>
                      <div className='grid grid-cols-1 gap-4'>
                        <div className='grid grid-cols-2 gap-4'>
                          <FormField
                            control={form.control}
                            name='largura'
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className='flex items-center gap-2'>
                                  <Ruler className='h-4 w-4' />
                                  Largura (cm)
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    type='text'
                                    inputMode='decimal'
                                    pattern='[0-9]*\.?[0-9]*'
                                    step='0.01'
                                    min='0'
                                    placeholder='Largura em centímetros'
                                    onKeyDown={(e) => {
                                      if (
                                        !/[\d.]/.test(e.key) &&
                                        e.key !== 'Backspace' &&
                                        e.key !== 'Delete' &&
                                        e.key !== 'ArrowLeft' &&
                                        e.key !== 'ArrowRight' &&
                                        e.key !== 'Tab'
                                      ) {
                                        e.preventDefault()
                                      }
                                    }}
                                    onInput={(e) => {
                                      const input = e.target as HTMLInputElement
                                      input.value = input.value.replace(
                                        /[^0-9.]/g,
                                        ''
                                      )
                                      // Ensure only one decimal point
                                      const parts = input.value.split('.')
                                      if (parts.length > 2) {
                                        input.value =
                                          parts[0] +
                                          '.' +
                                          parts.slice(1).join('')
                                      }
                                    }}
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
                            name='comprimento'
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className='flex items-center gap-2'>
                                  <Ruler className='h-4 w-4' />
                                  Comprimento (cm)
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    type='text'
                                    inputMode='decimal'
                                    pattern='[0-9]*\.?[0-9]*'
                                    step='0.01'
                                    min='0'
                                    placeholder='Comprimento em centímetros'
                                    onKeyDown={(e) => {
                                      if (
                                        !/[\d.]/.test(e.key) &&
                                        e.key !== 'Backspace' &&
                                        e.key !== 'Delete' &&
                                        e.key !== 'ArrowLeft' &&
                                        e.key !== 'ArrowRight' &&
                                        e.key !== 'Tab'
                                      ) {
                                        e.preventDefault()
                                      }
                                    }}
                                    onInput={(e) => {
                                      const input = e.target as HTMLInputElement
                                      input.value = input.value.replace(
                                        /[^0-9.]/g,
                                        ''
                                      )
                                      // Ensure only one decimal point
                                      const parts = input.value.split('.')
                                      if (parts.length > 2) {
                                        input.value =
                                          parts[0] +
                                          '.' +
                                          parts.slice(1).join('')
                                      }
                                    }}
                                    {...field}
                                    className='px-4 py-6 shadow-inner drop-shadow-xl'
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className='grid grid-cols-2 gap-4'>
                          <FormField
                            control={form.control}
                            name='profundidade'
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className='flex items-center gap-2'>
                                  <Ruler className='h-4 w-4' />
                                  Profundidade (cm)
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    type='text'
                                    inputMode='decimal'
                                    pattern='[0-9]*\.?[0-9]*'
                                    step='0.01'
                                    min='0'
                                    placeholder='Profundidade em centímetros'
                                    onKeyDown={(e) => {
                                      if (
                                        !/[\d.]/.test(e.key) &&
                                        e.key !== 'Backspace' &&
                                        e.key !== 'Delete' &&
                                        e.key !== 'ArrowLeft' &&
                                        e.key !== 'ArrowRight' &&
                                        e.key !== 'Tab'
                                      ) {
                                        e.preventDefault()
                                      }
                                    }}
                                    onInput={(e) => {
                                      const input = e.target as HTMLInputElement
                                      input.value = input.value.replace(
                                        /[^0-9.]/g,
                                        ''
                                      )
                                      // Ensure only one decimal point
                                      const parts = input.value.split('.')
                                      if (parts.length > 2) {
                                        input.value =
                                          parts[0] +
                                          '.' +
                                          parts.slice(1).join('')
                                      }
                                    }}
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
                            name='area'
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className='flex items-center gap-2'>
                                  <Ruler className='h-4 w-4' />
                                  Área (cm²)
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    type='text'
                                    inputMode='decimal'
                                    pattern='[0-9]*\.?[0-9]*'
                                    step='0.01'
                                    min='0'
                                    placeholder='Área em centímetros quadrados'
                                    readOnly
                                    disabled
                                    {...field}
                                    className='px-4 py-6 shadow-inner drop-shadow-xl bg-muted/50'
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className='grid grid-cols-2 gap-4'>
                          <FormField
                            control={form.control}
                            name='fila'
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className='flex items-center gap-2'>
                                  <MapPin className='h-4 w-4' />
                                  Fila
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder='Fila'
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
                            name='coluna'
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className='flex items-center gap-2'>
                                  <MapPin className='h-4 w-4' />
                                  Coluna
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder='Coluna'
                                    {...field}
                                    className='px-4 py-6 shadow-inner drop-shadow-xl'
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className='bg-muted/30 rounded-lg p-4'>
                          <h4 className='text-sm font-medium mb-3 flex items-center gap-2'>
                            <ToggleLeft className='h-4 w-4' />
                            Configurações de Fundura
                          </h4>
                          <div className='grid grid-cols-3 gap-3'>
                            <FormField
                              control={form.control}
                              name='fundura1'
                              render={({ field }) => (
                                <FormItem className='flex flex-row items-center justify-between rounded-lg border p-3 bg-background'>
                                  <FormLabel className='text-sm flex items-center gap-2'>
                                    <div
                                      className={`w-2 h-2 rounded-full ${field.value ? 'bg-green-500' : 'bg-gray-300'}`}
                                    />
                                    Fundura 1
                                  </FormLabel>
                                  <FormControl>
                                    <Switch
                                      checked={field.value}
                                      onCheckedChange={(newValue) => {
                                        handleFunduraChange(1, newValue)
                                      }}
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name='fundura2'
                              render={({ field }) => (
                                <FormItem className='flex flex-row items-center justify-between rounded-lg border p-3 bg-background'>
                                  <FormLabel className='text-sm flex items-center gap-2'>
                                    <div
                                      className={`w-2 h-2 rounded-full ${field.value ? 'bg-green-500' : 'bg-gray-300'}`}
                                    />
                                    Fundura 2
                                  </FormLabel>
                                  <FormControl>
                                    <Switch
                                      checked={field.value}
                                      onCheckedChange={(newValue) => {
                                        handleFunduraChange(2, newValue)
                                      }}
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name='fundura3'
                              render={({ field }) => (
                                <FormItem className='flex flex-row items-center justify-between rounded-lg border p-3 bg-background'>
                                  <FormLabel className='text-sm flex items-center gap-2'>
                                    <div
                                      className={`w-2 h-2 rounded-full ${field.value ? 'bg-green-500' : 'bg-gray-300'}`}
                                    />
                                    Fundura 3
                                  </FormLabel>
                                  <FormControl>
                                    <Switch
                                      checked={field.value}
                                      onCheckedChange={(newValue) => {
                                        handleFunduraChange(3, newValue)
                                      }}
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value='datas'>
              <div className='space-y-6'>
                <Card className='overflow-hidden border-l-4 border-l-primary/20 hover:border-l-primary/40 transition-all duration-200 hover:shadow-md'>
                  <CardHeader className='pb-4'>
                    <div className='flex items-center gap-3'>
                      <div className='flex items-center justify-center w-8 h-8 rounded-md bg-primary/10 text-primary'>
                        <CalendarDays className='h-4 w-4' />
                      </div>
                      <div>
                        <CardTitle className='text-base flex items-center gap-2'>
                          Datas Importantes
                          <Badge variant='outline' className='text-xs'>
                            Opcional
                          </Badge>
                        </CardTitle>
                        <p className='text-sm text-muted-foreground mt-1'>
                          Configure as datas relevantes para esta sepultura
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className='space-y-6'>
                    <div className='grid grid-cols-2 gap-4'>
                      <FormField
                        control={form.control}
                        name='dataInicioAluguer'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='flex items-center gap-2'>
                              <Calendar className='h-4 w-4' />
                              Data Início Aluguer
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
                        name='dataFimAluguer'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='flex items-center gap-2'>
                              <Calendar className='h-4 w-4' />
                              Data Fim Aluguer
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
                        name='dataInicioReserva'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='flex items-center gap-2'>
                              <Calendar className='h-4 w-4' />
                              Data Início Reserva
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
                        name='dataFimReserva'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='flex items-center gap-2'>
                              <Calendar className='h-4 w-4' />
                              Data Fim Reserva
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
                        name='dataConhecimento'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='flex items-center gap-2'>
                              <Calendar className='h-4 w-4' />
                              Data Conhecimento
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
                        name='numeroConhecimento'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='flex items-center gap-2'>
                              <FileText className='h-4 w-4' />
                              Número Conhecimento
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder='Número Conhecimento'
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
                        name='dataConcessao'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='flex items-center gap-2'>
                              <Calendar className='h-4 w-4' />
                              Data Concessão
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
                        name='dataAnulacao'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='flex items-center gap-2'>
                              <Calendar className='h-4 w-4' />
                              Data Anulação
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
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value='opcoes'>
              <div className='space-y-6'>
                <Card className='overflow-hidden border-l-4 border-l-primary/20 hover:border-l-primary/40 transition-all duration-200 hover:shadow-md'>
                  <CardHeader className='pb-4'>
                    <div className='flex items-center gap-3'>
                      <div className='flex items-center justify-center w-8 h-8 rounded-md bg-primary/10 text-primary'>
                        <Settings className='h-4 w-4' />
                      </div>
                      <div>
                        <CardTitle className='text-base flex items-center gap-2'>
                          Configurações da Sepultura
                          <Badge variant='outline' className='text-xs'>
                            Opcional
                          </Badge>
                        </CardTitle>
                        <p className='text-sm text-muted-foreground mt-1'>
                          Configure as opções e status da sepultura
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className='space-y-6'>
                    <div className='grid grid-cols-3 gap-4'>
                      <FormField
                        control={form.control}
                        name='anulado'
                        render={({ field }) => (
                          <FormItem className='flex flex-row items-center justify-between rounded-lg border p-3 bg-background'>
                            <FormLabel className='text-sm flex items-center gap-2'>
                              <div
                                className={`w-2 h-2 rounded-full ${field.value ? 'bg-red-500' : 'bg-gray-300'}`}
                              />
                              Anulado
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
                        name='bloqueada'
                        render={({ field }) => (
                          <FormItem className='flex flex-row items-center justify-between rounded-lg border p-3 bg-background'>
                            <FormLabel className='text-sm flex items-center gap-2'>
                              <div
                                className={`w-2 h-2 rounded-full ${field.value ? 'bg-yellow-500' : 'bg-gray-300'}`}
                              />
                              Bloqueada
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
                        name='litigio'
                        render={({ field }) => (
                          <FormItem className='flex flex-row items-center justify-between rounded-lg border p-3 bg-background'>
                            <FormLabel className='text-sm flex items-center gap-2'>
                              <div
                                className={`w-2 h-2 rounded-full ${field.value ? 'bg-orange-500' : 'bg-gray-300'}`}
                              />
                              Litígio
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
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value='observacoes'>
              <div className='space-y-6'>
                <Card className='overflow-hidden border-l-4 border-l-primary/20 hover:border-l-primary/40 transition-all duration-200 hover:shadow-md'>
                  <CardHeader className='pb-4'>
                    <div className='flex items-center gap-3'>
                      <div className='flex items-center justify-center w-8 h-8 rounded-md bg-primary/10 text-primary'>
                        <MessageSquare className='h-4 w-4' />
                      </div>
                      <div>
                        <CardTitle className='text-base flex items-center gap-2'>
                          Observações
                          <Badge variant='outline' className='text-xs'>
                            Opcional
                          </Badge>
                        </CardTitle>
                        <p className='text-sm text-muted-foreground mt-1'>
                          Adicione observações relevantes sobre a sepultura
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className='space-y-6'>
                    <div className='grid grid-cols-1 gap-4'>
                      <FormField
                        control={form.control}
                        name='observacao'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='flex items-center gap-2'>
                              <MessageSquare className='h-4 w-4' />
                              Observação
                            </FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder='Observação'
                                {...field}
                                value={field.value || ''}
                                className='min-h-[150px] px-4 py-6 shadow-inner drop-shadow-xl'
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
            </TabsContent>
            <TabsContent value='proprietarios'>
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
                      const currentProprietarios =
                        form.getValues('proprietarios') || []

                      // Determine the default values based on existing proprietários
                      const isFirstProprietario =
                        currentProprietarios.length === 0

                      const newProprietario = {
                        id: undefined, // New proprietario
                        proprietarioId: '',
                        data: new Date(),
                        ativo: true,
                        isProprietario: isFirstProprietario, // true if first, false if not first
                        isResponsavel: isFirstProprietario, // true if first, false if not first
                        isResponsavelGuiaReceita: isFirstProprietario, // true if first, false if not first
                        dataInativacao: undefined,
                        fracao: '',
                        observacoes: '',
                        historico: false,
                      }

                      form.setValue('proprietarios', [
                        ...currentProprietarios,
                        newProprietario,
                      ])
                    }}
                    className='flex items-center gap-2'
                  >
                    <Plus className='h-4 w-4' />
                    Adicionar Proprietário
                  </Button>
                </div>

                {/* Collapsible Filters Panel */}
                {isFiltersOpen && (
                  <Card className='border-dashed border-2 border-muted-foreground/20'>
                    <CardHeader className='pb-3'>
                      <CardTitle className='text-sm flex items-center gap-2'>
                        <SlidersHorizontal className='h-4 w-4' />
                        Filtrar Proprietários
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

                {/* Proprietarios List */}
                <div className='space-y-4'>
                  {applyFilters(form.watch('proprietarios') || []).map(
                    (proprietario, index) => {
                      const selectedProprietario = proprietariosData.find(
                        (p) => p.id === proprietario.proprietarioId
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
                                    toggleProprietarioExpansion(index)
                                  }
                                  className='p-1 h-auto'
                                >
                                  {expandedProprietarios.has(index) ? (
                                    <ChevronDown className='h-4 w-4' />
                                  ) : (
                                    <ChevronRight className='h-4 w-4' />
                                  )}
                                </Button>
                                <div className='flex items-center justify-center w-8 h-8 rounded-md bg-primary/10 text-primary'>
                                  <User className='h-4 w-4' />
                                </div>
                                <div className='flex-1'>
                                  <CardTitle className='text-base flex items-center gap-2'>
                                    Proprietário {index + 1}
                                    {proprietario.id && (
                                      <Badge
                                        variant='secondary'
                                        className='text-xs'
                                      >
                                        Existente
                                      </Badge>
                                    )}
                                    {!proprietario.id && (
                                      <Badge
                                        variant='outline'
                                        className='text-xs'
                                      >
                                        Novo
                                      </Badge>
                                    )}
                                  </CardTitle>
                                  {selectedProprietario && (
                                    <p className='text-sm text-muted-foreground mt-1'>
                                      {selectedProprietario.entidade?.nome}
                                    </p>
                                  )}
                                  {!expandedProprietarios.has(index) && (
                                    <div className='flex flex-wrap gap-1 mt-2'>
                                      {getResponsibilityBadges(
                                        proprietario
                                      ).map((badge, badgeIndex) => (
                                        <Badge
                                          key={badgeIndex}
                                          variant={badge.variant}
                                          className='text-xs'
                                        >
                                          {badge.label}
                                        </Badge>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </div>
                              <Button
                                type='button'
                                variant='ghost'
                                size='sm'
                                onClick={() => {
                                  const currentProprietarios =
                                    form.getValues('proprietarios') || []
                                  form.setValue(
                                    'proprietarios',
                                    currentProprietarios.filter(
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
                          {expandedProprietarios.has(index) && (
                            <CardContent className='space-y-6'>
                              {/* Main Information Grid */}
                              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                <FormField
                                  control={form.control}
                                  name={`proprietarios.${index}.proprietarioId`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel className='flex items-center gap-2'>
                                        <User className='h-4 w-4' />
                                        Proprietário
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
                                            options={proprietariosData.map(
                                              (proprietario) => ({
                                                value: proprietario.id || '',
                                                label:
                                                  proprietario.entidade?.nome ||
                                                  `Proprietário ${proprietario.id}`,
                                              })
                                            )}
                                            value={String(field.value ?? '')}
                                            onValueChange={field.onChange}
                                            placeholder={
                                              isLoadingProprietarios
                                                ? 'A carregar...'
                                                : 'Selecione um proprietário'
                                            }
                                            emptyText='Nenhum proprietário encontrado.'
                                            disabled={isLoadingProprietarios}
                                            className='px-4 py-6 pr-32 shadow-inner drop-shadow-xl'
                                          />
                                          <div className='absolute right-12 top-1/2 -translate-y-1/2 flex gap-1'>
                                            <Button
                                              type='button'
                                              variant='outline'
                                              size='sm'
                                              onClick={() =>
                                                handleViewProprietario(index)
                                              }
                                              className='h-8 w-8 p-0'
                                              title='Ver Proprietário'
                                              disabled={!field.value}
                                            >
                                              <Eye className='h-4 w-4' />
                                            </Button>
                                            <Button
                                              type='button'
                                              variant='outline'
                                              size='sm'
                                              onClick={handleCreateProprietario}
                                              className='h-8 w-8 p-0'
                                              title='Criar Novo Proprietário'
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
                                  name={`proprietarios.${index}.fracao`}
                                  render={({ field }) => {
                                    const validation =
                                      validateFracaoPercentages()
                                    const isInvalid =
                                      !validation.isValid &&
                                      validation.total > 0

                                    return (
                                      <FormItem>
                                        <FormLabel className='flex items-center gap-2'>
                                          <User className='h-4 w-4' />
                                          Fração
                                          <Badge
                                            variant='secondary'
                                            className='text-xs'
                                          >
                                            %
                                          </Badge>
                                        </FormLabel>
                                        <FormControl>
                                          <Input
                                            placeholder='Ex: 20%, 80%'
                                            {...field}
                                            className={`px-4 py-6 shadow-inner drop-shadow-xl ${
                                              isInvalid
                                                ? 'border-red-500 focus:border-red-500'
                                                : ''
                                            }`}
                                            onChange={(e) => {
                                              // Allow only numbers and % symbol
                                              const value =
                                                e.target.value.replace(
                                                  /[^0-9.%]/g,
                                                  ''
                                                )

                                              field.onChange(value)
                                              // Set flag when user manually enters fracao
                                              if (value.trim() !== '') {
                                                setHasManualFracao(true)
                                              }
                                            }}
                                            onBlur={(e) => {
                                              // Auto-add % symbol when user finishes typing
                                              let value = e.target.value.trim()
                                              if (
                                                value &&
                                                !value.includes('%') &&
                                                /^\d+(\.\d+)?$/.test(value)
                                              ) {
                                                const newValue = value + '%'
                                                field.onChange(newValue)
                                              }
                                            }}
                                          />
                                        </FormControl>
                                        {isInvalid && (
                                          <p className='text-sm text-red-500'>
                                            Total deve ser 100% (atual:{' '}
                                            {validation.total.toFixed(1)}%)
                                          </p>
                                        )}
                                        <FormMessage />
                                      </FormItem>
                                    )
                                  }}
                                />
                              </div>

                              {/* Dates Grid */}
                              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                <FormField
                                  control={form.control}
                                  name={`proprietarios.${index}.data`}
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
                                  name={`proprietarios.${index}.dataInativacao`}
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
                                    name={`proprietarios.${index}.ativo`}
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
                                                  `proprietarios.${index}.dataInativacao`,
                                                  new Date(),
                                                  {
                                                    shouldValidate: true,
                                                    shouldDirty: true,
                                                  }
                                                )
                                              } else {
                                                // When activating, clear dataInativacao
                                                form.setValue(
                                                  `proprietarios.${index}.dataInativacao`,
                                                  undefined,
                                                  {
                                                    shouldValidate: true,
                                                    shouldDirty: true,
                                                  }
                                                )
                                              }
                                              // Auto-calculate percentages only if no manual fracao is set
                                              setTimeout(
                                                () =>
                                                  calculateProprietarioPercentages(),
                                                0
                                              )
                                            }}
                                          />
                                        </FormControl>
                                      </FormItem>
                                    )}
                                  />
                                  <FormField
                                    control={form.control}
                                    name={`proprietarios.${index}.isProprietario`}
                                    render={({ field }) => (
                                      <FormItem className='flex flex-row items-center justify-between rounded-lg border p-3 bg-background'>
                                        <FormLabel className='text-sm flex items-center gap-2'>
                                          <User className='h-3 w-3' />
                                          Proprietário
                                        </FormLabel>
                                        <FormControl>
                                          <Switch
                                            checked={field.value}
                                            onCheckedChange={(newValue) => {
                                              field.onChange(newValue)
                                              // Auto-calculate percentages only if no manual fracao is set
                                              setTimeout(
                                                () =>
                                                  calculateProprietarioPercentages(),
                                                0
                                              )
                                            }}
                                          />
                                        </FormControl>
                                      </FormItem>
                                    )}
                                  />
                                  <FormField
                                    control={form.control}
                                    name={`proprietarios.${index}.isResponsavel`}
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
                                    name={`proprietarios.${index}.isResponsavelGuiaReceita`}
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
                                  name={`proprietarios.${index}.observacoes`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel className='flex items-center gap-2'>
                                        <MessageSquare className='h-4 w-4' />
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
                                <FormField
                                  control={form.control}
                                  name={`proprietarios.${index}.historico`}
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
                              </div>
                            </CardContent>
                          )}
                        </Card>
                      )
                    }
                  )}

                  {(() => {
                    const proprietarios = form.watch('proprietarios') || []
                    const filteredProprietarios = applyFilters(proprietarios)

                    if (proprietarios.length === 0) {
                      return (
                        <Card className='border-dashed border-2 border-muted-foreground/20'>
                          <CardContent className='flex flex-col items-center justify-center py-12 text-center'>
                            <User className='h-12 w-12 text-muted-foreground/50 mb-4' />
                            <h3 className='text-lg font-medium text-muted-foreground mb-2'>
                              Nenhum proprietário adicionado
                            </h3>
                            <p className='text-sm text-muted-foreground mb-4 max-w-sm'>
                              Adicione proprietários para associar a esta
                              sepultura e gerir as responsabilidades.
                            </p>
                            <Button
                              type='button'
                              variant='outline'
                              size='sm'
                              onClick={() => {
                                const currentProprietarios =
                                  form.getValues('proprietarios') || []

                                const newProprietario = {
                                  id: undefined,
                                  proprietarioId: '',
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

                                form.setValue('proprietarios', [
                                  ...currentProprietarios,
                                  newProprietario,
                                ])
                                // Auto-calculate percentages only if no manual fracao is set
                                setTimeout(
                                  () => calculateProprietarioPercentages(),
                                  0
                                )
                              }}
                              className='flex items-center gap-2'
                            >
                              <Plus className='h-4 w-4' />
                              Adicionar Primeiro Proprietário
                            </Button>
                          </CardContent>
                        </Card>
                      )
                    }

                    if (filteredProprietarios.length === 0) {
                      return (
                        <Card className='border-dashed border-2 border-muted-foreground/20'>
                          <CardContent className='flex flex-col items-center justify-center py-12 text-center'>
                            <AlertCircle className='h-12 w-12 text-muted-foreground/50 mb-4' />
                            <h3 className='text-lg font-medium text-muted-foreground mb-2'>
                              Nenhum proprietário encontrado
                            </h3>
                            <p className='text-sm text-muted-foreground mb-4 max-w-sm'>
                              Não existem proprietários que correspondam ao
                              filtro selecionado.
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
              disabled={updateSepulturaMutation.isPending}
              className='w-full md:w-auto'
            >
              {updateSepulturaMutation.isPending
                ? 'A atualizar...'
                : 'Atualizar'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

export { SepulturaUpdateForm }
