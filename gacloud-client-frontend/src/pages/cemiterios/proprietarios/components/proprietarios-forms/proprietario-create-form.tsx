import { useEffect, useRef, useState } from 'react'
import { z } from 'zod'
import { useForm, type Resolver } from 'react-hook-form'
import { useGetEntidadesSelect } from '@/pages/base/entidades/queries/entidades-queries'
import { useGetSepulturasSelect } from '@/pages/cemiterios/sepulturas/queries/sepulturas-queries'
import { CreateProprietarioDTO } from '@/types/dtos/cemiterios/proprietarios.dtos'
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
  ChevronDown,
  ChevronRight,
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
  updateCreateFormData,
  cleanupWindowForms,
  updateCreateWindowTitle,
  setEntityReturnDataWithToastSuppression,
  openEntidadeCreationWindow,
  openSepulturaCreationWindow,
  openEntidadeViewWindow,
  openSepulturaViewWindow,
  detectFormChanges,
} from '@/utils/window-utils'
import { useAutoSelectionWithReturnData } from '@/hooks/use-auto-selection-with-return-data'
import { useCemiterioSelection } from '@/hooks/use-cemiterio-selection'
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
  TabsList as PersistentTabsList,
  TabsTrigger as PersistentTabsTrigger,
  TabsContent as PersistentTabsContent,
} from '@/components/ui/persistent-tabs'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { useCreateProprietario } from '../../queries/proprietarios-mutations'

const proprietarioSchema = z.object({
  sepulturaId: z
    .string({ message: 'A Sepultura é obrigatória' })
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
  sepulturas: z.array(proprietarioSchema).default([]),
})

type ProprietarioFormSchemaType = z.infer<typeof proprietarioFormSchema>

interface ProprietarioCreateFormProps {
  modalClose: () => void
  preSelectedEntidadeId?: string
  onSuccess?: (newProprietario: { id: string; entidadeNome: string }) => void
  shouldCloseWindow?: boolean
}

const ProprietarioCreateForm = ({
  modalClose,
  preSelectedEntidadeId,
  onSuccess,
  shouldCloseWindow = true,
}: ProprietarioCreateFormProps) => {
  const location = useLocation()
  const navigate = useNavigate()
  const windowId = useCurrentWindowId()
  const searchParams = new URLSearchParams(location.search)
  const instanceId = searchParams.get('instanceId') || 'default'
  const formId = `proprietario-${instanceId}`

  // Get parent window ID from sessionStorage as fallback
  const parentWindowIdFromStorage = sessionStorage.getItem(
    `parent-window-${instanceId}`
  )
  const effectiveWindowId = windowId || instanceId

  // Use a ref to track if this is the first render
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

  const createProprietarioMutation = useCreateProprietario()
  const { selectedCemiterio } = useCemiterioSelection()

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

  // Define default values for proper change detection
  const defaultValues = {
    cemiterioId: selectedCemiterio?.id || '',
    entidadeId: '',
    sepulturas: [],
  }

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
    defaultValues,
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

  // State to track which sepulturas are expanded
  const [expandedSepulturas, setExpandedSepulturas] = useState<Set<number>>(
    new Set()
  )

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
  }, [formId, hasBeenVisited, resetFormState, hasFormData])

  // Load saved form data if available and the form has been initialized
  useEffect(() => {
    if (isInitialized && hasFormData(formId)) {
      // Sort sepulturas by data (oldest first)
      if (formData && Array.isArray(formData.sepulturas)) {
        formData.sepulturas = formData.sepulturas.slice().sort((a, b) => {
          const dateA = new Date(a.createdOn ?? '').getTime()
          const dateB = new Date(b.createdOn ?? '').getTime()
          return dateA - dateB
        })
      }
      form.reset(formData as ProprietarioFormSchemaType)
    } else if (preSelectedEntidadeId) {
      // If no saved data, use the pre-selected values
      form.reset({
        cemiterioId: selectedCemiterio?.id || '',
        entidadeId: preSelectedEntidadeId || '',
        sepulturas: [],
      })
    }
  }, [
    formData,
    isInitialized,
    formId,
    hasFormData,
    preSelectedEntidadeId,
    selectedCemiterio?.id,
  ])

  // Save form data when it changes
  useEffect(() => {
    const subscription = form.watch((value) => {
      // Use proper change detection by comparing with default values
      const hasChanges = detectFormChanges(value, defaultValues)

      // Only update the form state if the values are different from the current state
      if (JSON.stringify(value) !== JSON.stringify(formData)) {
        setFormState(formId, {
          formData: value as ProprietarioFormSchemaType,
          isDirty: hasChanges,
          isValid: form.formState.isValid,
          isSubmitting: form.formState.isSubmitting,
          hasBeenModified: hasChanges,
          windowId: effectiveWindowId,
        })

        // Update window hasFormData flag using the utility function
        if (effectiveWindowId) {
          updateCreateFormData(
            effectiveWindowId,
            value,
            setWindowHasFormData,
            defaultValues
          )
          // Update window title based on selected entidade
          const selectedEntidade = entidadesData.find(
            (entidade) => entidade.id === value.entidadeId
          )
          const newTitle = selectedEntidade?.nome || 'Criar Proprietário'

          // Always update the window title to ensure it reflects the current state
          updateCreateWindowTitle(
            effectiveWindowId,
            newTitle,
            updateWindowState
          )
        }
      }
    })
    return () => subscription.unsubscribe()
  }, [form, effectiveWindowId, formId, formData, entidadesData, defaultValues])

  // Use the combined auto-selection hook for entidades (create form doesn't need return data)
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
    returnDataKey: `return-data-${effectiveWindowId}-entidade`, // Not used in create forms, but required by hook
  })

  // Use the combined auto-selection hook for sepulturas (create form doesn't need return data)
  useAutoSelectionWithReturnData({
    windowId: effectiveWindowId,
    instanceId,
    data: sepulturasData,
    setValue: (value: string) => {
      const currentSepulturas = form.getValues('sepulturas') || []
      const existingSepultura = currentSepulturas.find(
        (s) => s.sepulturaId === value
      )
      if (!existingSepultura) {
        const newSepultura = {
          sepulturaId: value,
          data: new Date(),
          ativo: true,
          isProprietario: true,
          isResponsavel: false,
          isResponsavelGuiaReceita: false,
          dataInativacao: undefined,
          fracao: '',
          observacoes: '',
          historico: false,
        }
        form.setValue('sepulturas', [...currentSepulturas, newSepultura])
      }
    },
    refetch: refetchSepulturas,
    itemName: 'Sepultura',
    successMessage: 'Sepultura adicionada automaticamente',
    manualSelectionMessage:
      'Sepultura criada com sucesso. Por favor, adicione-a manualmente.',
    queryKey: ['sepulturas-select'],
    returnDataKey: `return-data-${effectiveWindowId}-sepultura`, // Not used in create forms, but required by hook
  })

  const handleClose = () => {
    // Clean up all form instances for the current window
    cleanupWindowForms(effectiveWindowId)

    if (shouldCloseWindow) {
      handleWindowClose(effectiveWindowId, navigate, removeWindow)
    } else {
      modalClose()
    }
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
    const sepulturas = form.getValues('sepulturas')
    const sepulturaId = sepulturas?.[index]?.sepulturaId
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

  const onSubmit = async (values: ProprietarioFormSchemaType) => {
    try {
      updateFormState(formId, (state) => ({
        ...state,
        isSubmitting: true,
      }))

      // Use the selected cemiterio from auth store
      if (!selectedCemiterio) {
        toast.error('Nenhum cemitério selecionado')
        return
      }

      const selectedEntidade = entidadesData.find(
        (entidade) => entidade.id === values.entidadeId
      )

      if (!selectedEntidade) {
        toast.error('Entidade não encontrada')
        return
      }

      // Transform the form data to match the API structure
      const requestData: CreateProprietarioDTO = {
        cemiterioId: selectedCemiterio.id,
        entidadeId: values.entidadeId,
        sepulturas:
          values.sepulturas?.map((sepultura) => ({
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

      const response = await createProprietarioMutation.mutateAsync(requestData)

      const result = handleApiResponse(
        response,
        'Proprietário criado com sucesso',
        'Erro ao criar proprietário',
        'Proprietário criado com avisos'
      )

      if (result.success) {
        console.log('Proprietario created successfully:', response.info.data)

        // Set return data for parent window if this window was opened from another window
        if (effectiveWindowId) {
          setEntityReturnDataWithToastSuppression(
            effectiveWindowId,
            { id: response.info.data, entidadeNome: selectedEntidade.nome },
            'proprietario',
            setWindowReturnData,
            parentWindowIdFromStorage || undefined,
            instanceId
          )

          // Clean up sessionStorage after a delay to ensure parent window has time to read it
          setTimeout(() => {
            if (parentWindowIdFromStorage) {
              sessionStorage.removeItem(`parent-window-${instanceId}`)
            }
          }, 2000) // 2 second delay
        }

        if (onSuccess) {
          console.log('Calling onSuccess callback with:', {
            id: response.info.data,
            entidadeNome: selectedEntidade.nome,
          })
          onSuccess({
            id: response.info.data,
            entidadeNome: selectedEntidade.nome,
          })
        }
        // Only close the window if shouldCloseWindow is true
        if (effectiveWindowId && shouldCloseWindow) {
          removeWindow(effectiveWindowId)
        }
        // Always call modalClose to close the modal
        modalClose()
      }
    } catch (error) {
      toast.error(
        handleApiError(error, 'Erro ao criar proprietário de cemitério')
      )
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
          id='proprietarioCreateForm'
          onSubmit={form.handleSubmit(onSubmit, handleError)}
          className='space-y-4'
          autoComplete='off'
        >
          <PersistentTabs
            defaultValue='identificacao'
            className='w-full'
            tabKey={`proprietario-${instanceId}`}
          >
            <PersistentTabsList>
              <PersistentTabsTrigger value='identificacao'>
                Identificação
              </PersistentTabsTrigger>
              <PersistentTabsTrigger value='sepulturas'>
                Sepulturas
              </PersistentTabsTrigger>
              <PersistentTabsTrigger value='opcoes'>
                Opções
              </PersistentTabsTrigger>
            </PersistentTabsList>
            <PersistentTabsContent value='identificacao'>
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
                                  value={field.value}
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
            </PersistentTabsContent>
            <PersistentTabsContent value='sepulturas'>
              <div className='space-y-6'>
                {/* Header with add button */}
                <div className='flex items-center justify-end'>
                  <Button
                    type='button'
                    variant='outline'
                    size='sm'
                    onClick={() => {
                      const currentSepulturas =
                        form.getValues('sepulturas') || []

                      // Add a new sepultura with default values
                      const newSepultura = {
                        sepulturaId: '',
                        data: new Date(),
                        ativo: true,
                        isProprietario: true,
                        isResponsavel: false,
                        isResponsavelGuiaReceita: false,
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

                {/* Sepulturas List */}
                <div className='space-y-4'>
                  {form.watch('sepulturas')?.map((sepultura, index) => {
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
                                onClick={() => toggleSepulturaExpansion(index)}
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
                                  <Badge variant='outline' className='text-xs'>
                                    Nova
                                  </Badge>
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
                                          value={field.value}
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
                                          onCheckedChange={field.onChange}
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
                  })}

                  {(!form.watch('sepulturas') ||
                    form.watch('sepulturas')?.length === 0) && (
                    <Card className='border-dashed border-2 border-muted-foreground/20'>
                      <CardContent className='flex flex-col items-center justify-center py-12 text-center'>
                        <MapPin className='h-12 w-12 text-muted-foreground/50 mb-4' />
                        <h3 className='text-lg font-medium text-muted-foreground mb-2'>
                          Nenhuma sepultura adicionada
                        </h3>
                        <p className='text-sm text-muted-foreground mb-4 max-w-sm'>
                          Adicione sepulturas para associar a este proprietário
                          e gerir as responsabilidades.
                        </p>
                        <Button
                          type='button'
                          variant='outline'
                          size='sm'
                          onClick={() => {
                            const currentSepulturas =
                              form.getValues('sepulturas') || []

                            const newSepultura = {
                              sepulturaId: '',
                              data: new Date(),
                              ativo: true,
                              isProprietario: true,
                              isResponsavel: false,
                              isResponsavelGuiaReceita: false,
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
                  )}
                </div>
              </div>
            </PersistentTabsContent>

            <PersistentTabsContent value='opcoes'>
              <div className='space-y-6'>
                <Card className='overflow-hidden border-l-4 border-l-primary/20 hover:border-l-primary/40 transition-all duration-200 hover:shadow-md'>
                  <CardHeader className='pb-4'>
                    <div className='flex items-center gap-3'>
                      <div className='flex items-center justify-center w-8 h-8 rounded-md bg-primary/10 text-primary'>
                        <Settings className='h-4 w-4' />
                      </div>
                      <div>
                        <CardTitle className='text-base flex items-center gap-2'>
                          Configurações Adicionais
                          <Badge variant='outline' className='text-xs'>
                            Opcional
                          </Badge>
                        </CardTitle>
                        <p className='text-sm text-muted-foreground mt-1'>
                          Configurações e opções adicionais para o proprietário
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className='space-y-6'>
                    <div className='text-sm text-muted-foreground'>
                      Configurações adicionais podem ser adicionadas aqui.
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
              disabled={createProprietarioMutation.isPending}
              className='w-full md:w-auto'
            >
              {createProprietarioMutation.isPending ? 'A criar...' : 'Criar'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

export { ProprietarioCreateForm }
