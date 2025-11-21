import { useEffect, useMemo, useRef, useState, useCallback, type ComponentType, type ChangeEvent, type ReactNode } from 'react'
import { z } from 'zod'
import { useForm, useWatch } from 'react-hook-form'
import { type Resolver } from 'react-hook-form'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  UpdateSeguroDTO,
  PeriodicidadeSeguro,
  MetodoPagamentoSeguro,
  MetodoPagamentoSeguroConfig,
} from '@/types/dtos/frotas/seguros.dtos'
import { useFormState, useFormsStore } from '@/stores/use-forms-store'
import { useWindowsStore } from '@/stores/use-windows-store'
import { useUpdateSeguro } from '@/pages/frotas/seguros/queries/seguros-mutations'
import { SegurosService } from '@/lib/services/frotas/seguros-service'
import state from '@/states/state'
import { useGetSeguradorasSelect } from '@/pages/frotas/seguradoras/queries/seguradoras-queries'
import { handleApiError } from '@/utils/error-handlers'
import { handleApiResponse } from '@/utils/response-handlers'
import { toast } from '@/utils/toast-utils'
import {
  useCurrentWindowId,
  handleWindowClose,
  updateWindowFormData,
  cleanupWindowForms,
  updateUpdateWindowTitle,
  setEntityReturnDataWithToastSuppression,
  openSeguradoraCreationWindow,
  openSeguradoraViewWindow,
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
import { NumberInput } from '@/components/ui/number-input'
import { Textarea } from '@/components/ui/textarea'
import {
  RadioGroup,
  RadioGroupItem,
} from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
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
  CalendarDays,
  Building2,
  Repeat,
  Smartphone,
  CreditCard,
  Wallet,
  Banknote,
  MoreHorizontal,
  FolderOpen,
  File,
  Download,
  Printer,
  Trash2,
  Loader2,
  FolderPlus,
  type LucideIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'

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
  riscosCobertos: z.string().optional(),
  valorCobertura: z.coerce
    .number({ message: 'O Valor de Cobertura é obrigatório' })
    .nullable()
    .refine((val) => val === null || val >= 0, {
      message: 'O Valor de Cobertura deve ser maior ou igual a 0',
    })
    .transform((val) => val ?? 0),
  custoAnual: z.coerce
    .number({ message: 'O Custo Anual é obrigatório' })
    .nullable()
    .refine((val) => val === null || val >= 0, {
      message: 'O Custo Anual deve ser maior ou igual a 0',
    })
    .transform((val) => val ?? 0),
  dataInicial: z.date({ message: 'A Data Inicial é obrigatória' }),
  dataFinal: z.date({ message: 'A Data Final é obrigatória' }),
  periodicidade: z.nativeEnum(PeriodicidadeSeguro, {
    message: 'A Periodicidade é obrigatória',
  }),
  metodoPagamento: z.nativeEnum(MetodoPagamentoSeguro).optional(),
  dataPagamento: z.date().optional().nullable(),
  documentos: z
    .array(
      z.object({
        nome: z.string().min(1),
        dados: z.string().min(1),
        contentType: z.string().min(1),
        tamanho: z.number().nonnegative(),
        pasta: z.string().max(120).optional().nullable(),
      })
    )
    .optional()
    .default([]),
})

type SeguroFormSchemaType = z.infer<typeof seguroFormSchema>

interface SeguroUpdateFormProps {
  modalClose: () => void
  seguroId: string
  initialData: SeguroFormSchemaType
  onSuccess?: (updatedSeguro: { id: string; designacao: string }) => void
  shouldCloseWindow?: boolean
}

const SeguroUpdateForm = ({
  modalClose,
  seguroId,
  initialData,
  onSuccess,
  shouldCloseWindow = true,
}: SeguroUpdateFormProps) => {
  const location = useLocation()
  const navigate = useNavigate()
  const windowId = useCurrentWindowId()
  const searchParams = new URLSearchParams(location.search)
  const instanceId = searchParams.get('instanceId') || 'default'
  const formId = `seguro-update-${instanceId}`

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

  const updateSeguroMutation = useUpdateSeguro()

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
      riscosCobertos: 'coberturas',
      valorCobertura: 'financeiro',
      custoAnual: 'financeiro',
      dataInicial: 'identificacao',
      dataFinal: 'identificacao',
      periodicidade: 'identificacao',
      metodoPagamento: 'financeiro',
      dataPagamento: 'financeiro',
    },
  })

  const updateFormResolver: Resolver<SeguroFormSchemaType> = async (values) => {
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
    resolver: updateFormResolver,
    defaultValues: initialData,
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
    criteriaMode: 'all',
  })

  const initialValuesRef = useRef(initialData)
  const hasResetFormRef = useRef(false)

  // Update ref when initialData changes
  useEffect(() => {
    initialValuesRef.current = initialData
  }, [initialData])

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
    // Only reset form once when initialData is first loaded with valid data
    // Don't reset if formData changes (that's from user input)
    if (!hasResetFormRef.current && initialData.designacao) {
      hasResetFormRef.current = true
      // Get formData from store only once at initialization
      const storedFormData = hasFormData(formId) ? formData : null
      
      // Store the currently focused element
      const activeElement = document.activeElement
      const wasTextareaFocused = activeElement?.tagName === 'TEXTAREA'
      const wasInputFocused = activeElement?.tagName === 'INPUT'
      const wasFocused = wasTextareaFocused || wasInputFocused
      
      if (isInitialized && storedFormData) {
        // Merge formData with initialData, but prioritize initialData for enum fields
        const mergedData = {
          ...initialData,
          ...(storedFormData as SeguroFormSchemaType),
          // Always use initialData for enum fields if they exist
          periodicidade:
            initialData.periodicidade !== undefined &&
            initialData.periodicidade !== null
              ? initialData.periodicidade
              : (storedFormData as SeguroFormSchemaType)?.periodicidade !== undefined &&
                (storedFormData as SeguroFormSchemaType)?.periodicidade !== null
              ? Number((storedFormData as SeguroFormSchemaType).periodicidade)
              : PeriodicidadeSeguro.Anual,
          metodoPagamento:
            initialData.metodoPagamento !== undefined &&
            initialData.metodoPagamento !== null
              ? initialData.metodoPagamento
              : (storedFormData as SeguroFormSchemaType)?.metodoPagamento !== undefined &&
                (storedFormData as SeguroFormSchemaType)?.metodoPagamento !== null
              ? Number((storedFormData as SeguroFormSchemaType).metodoPagamento)
              : undefined,
        }
        
        // Reset form
        form.reset(mergedData)
        
        // Restore focus if it was on a textarea or input
        if (wasFocused && activeElement) {
          requestAnimationFrame(() => {
            (activeElement as HTMLElement).focus()
          })
        }
      } else {
        // Reset form
        form.reset(initialData)
        
        // Restore focus if it was on a textarea or input
        if (wasFocused && activeElement) {
          requestAnimationFrame(() => {
            (activeElement as HTMLElement).focus()
          })
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialData.designacao, isInitialized])

  // Watch only specific fields
  const watchedFields = useWatch({
    control: form.control,
    name: [
      'designacao',
      'apolice',
      'seguradoraId',
      'assistenciaViagem',
      'cartaVerde',
      'riscosCobertos',
      'valorCobertura',
      'custoAnual',
      'dataInicial',
      'dataFinal',
      'periodicidade',
      'metodoPagamento',
      'dataPagamento',
    ] as const,
  })

  // Update state only when watched fields change (not valorCobertura, custoAnual)
  useEffect(() => {
    // Don't update state if number inputs are focused
    const activeElement = document.activeElement
    const fieldName = activeElement?.getAttribute('name')
    if (
      (activeElement?.tagName === 'INPUT' && activeElement.getAttribute('type') === 'number' && 
       (fieldName === 'valorCobertura' || fieldName === 'custoAnual'))
    ) {
      return
    }

    const updateTimeoutRef = setTimeout(() => {
      // Double-check that fields are not focused before updating
      const currentActive = document.activeElement
      const currentFieldName = currentActive?.getAttribute('name')
      if (
        (currentActive?.tagName === 'INPUT' && currentActive.getAttribute('type') === 'number' && 
         (currentFieldName === 'valorCobertura' || currentFieldName === 'custoAnual'))
      ) {
        return
      }

      const fullValue = form.getValues()
      const hasChanges = detectUpdateFormChanges(
        fullValue,
        initialValuesRef.current
      )

      setFormState(formId, {
        formData: fullValue as SeguroFormSchemaType,
        isDirty: hasChanges,
        isValid: form.formState.isValid,
        isSubmitting: form.formState.isSubmitting,
        hasBeenModified: hasChanges,
        windowId: effectiveWindowId,
      })

      if (effectiveWindowId) {
        updateWindowFormData(effectiveWindowId, hasChanges, setWindowHasFormData)
        updateUpdateWindowTitle(
          effectiveWindowId,
          fullValue.designacao || 'Seguro',
          updateWindowState
        )
      }
    }, 300) // Debounce state updates

    return () => {
      clearTimeout(updateTimeoutRef)
    }
  }, [
    watchedFields,
    effectiveWindowId,
    form,
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

      const documentosPayload = encodeSeguroDocumentos(values.documentos)

      const requestData: UpdateSeguroDTO = {
        designacao: values.designacao,
        apolice: values.apolice,
        seguradoraId: values.seguradoraId,
        assistenciaViagem: values.assistenciaViagem,
        cartaVerde: values.cartaVerde,
        riscosCobertos: values.riscosCobertos,
        valorCobertura: values.valorCobertura,
        custoAnual: values.custoAnual,
        dataInicial: values.dataInicial.toISOString(),
        dataFinal: values.dataFinal.toISOString(),
        periodicidade: values.periodicidade,
        metodoPagamento: values.metodoPagamento,
        dataPagamento: values.dataPagamento?.toISOString(),
        documentos: documentosPayload || undefined,
      }

      const response = await updateSeguroMutation.mutateAsync({
        id: seguroId,
        data: requestData,
      })
      const result = handleApiResponse(
        response,
        'Seguro atualizado com sucesso',
        'Erro ao atualizar seguro',
        'Seguro atualizado com avisos'
      )

      if (result.success) {
        if (effectiveWindowId) {
          setEntityReturnDataWithToastSuppression(
            effectiveWindowId,
            {
              id: seguroId,
              nome: values.designacao,
              designacao: values.designacao,
            },
            'seguro',
            setWindowReturnData,
            parentWindowIdFromStorage || undefined,
            instanceId
          )
        }

        if (onSuccess) {
          onSuccess({
            id: seguroId,
            designacao: values.designacao,
          })
        }

        if (effectiveWindowId && shouldCloseWindow) {
          removeWindow(effectiveWindowId)
        }
        modalClose()
      }
    } catch (error) {
      toast.error(handleApiError(error, 'Erro ao atualizar seguro'))
    } finally {
      updateFormState(formId, (state) => ({
        ...state,
        isSubmitting: false,
      }))
    }
  }

  // Componente FormSection
  type FormSectionProps = {
    icon: LucideIcon
    title: string
    description: string
    children: ReactNode
    className?: string
  }

  const FormSection = ({
    icon: Icon,
    title,
    description,
    children,
    className,
  }: FormSectionProps) => (
    <div
      className={cn(
        'flex h-full flex-col rounded-xl border border-border bg-card p-4 shadow-sm md:p-5',
        className
      )}
    >
      <div className='flex items-start gap-3'>
        <div className='flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary'>
          <Icon className='h-4 w-4' />
        </div>
        <div>
          <h3 className='text-base font-semibold leading-tight text-foreground'>
            {title}
          </h3>
          <p className='text-sm text-muted-foreground'>{description}</p>
        </div>
      </div>
      <div className='mt-4 flex-1 space-y-4'>{children}</div>
    </div>
  )

  // Tipos e funções auxiliares para documentos (mesmas do create-form)
  type SeguroDocumentoFormValue = {
    nome: string
    dados: string
    contentType: string
    tamanho: number
    pasta?: string | null
  }

  const DOCUMENTOS_STORAGE_VERSION = 1

  // Função para sanitizar documento
  const sanitizeDocumento = (documento: unknown): SeguroDocumentoFormValue | null => {
    if (typeof documento !== 'object' || documento === null) return null
    const doc = documento as Record<string, unknown>
    if (
      typeof doc.nome === 'string' &&
      typeof doc.dados === 'string' &&
      typeof doc.contentType === 'string' &&
      typeof doc.tamanho === 'number'
    ) {
      return {
        nome: doc.nome,
        dados: doc.dados,
        contentType: doc.contentType,
        tamanho: doc.tamanho,
        pasta: typeof doc.pasta === 'string' ? doc.pasta : null,
      }
    }
    return null
  }

  // Função para parsear documentos de string JSON
  const parseSeguroDocumentos = (
    payload?: string | null | undefined
  ): SeguroDocumentoFormValue[] => {
    if (!payload) {
      return []
    }

    const trimmed = payload.trim()
    if (!trimmed) {
      return []
    }

    try {
      const parsed = JSON.parse(trimmed) as {
        version?: number
        files?: unknown[]
      }

      if (
        parsed &&
        Array.isArray(parsed.files) &&
        (parsed.version === undefined || parsed.version === DOCUMENTOS_STORAGE_VERSION)
      ) {
        return parsed.files
          .map(sanitizeDocumento)
          .filter((doc): doc is SeguroDocumentoFormValue => doc !== null)
      }
    } catch (_error) {
      // Não é JSON, continuar para os formatos legacy
    }

    // Suporte para formatos legacy (base64 e URLs)
    if (trimmed.startsWith('data:')) {
      const matches = trimmed.match(/^data:([^;]+);base64,(.+)$/)
      if (matches) {
        const mimeType = matches[1]
        const base64Data = matches[2]
        const estimatedSize = Math.round((base64Data.length * 3) / 4)
        const extension = mimeType.split('/')[1]?.split(';')[0] || 'bin'
        return [
          {
            nome: `documento.${extension}`,
            dados: trimmed,
            contentType: mimeType,
            tamanho: estimatedSize,
            pasta: null,
          },
        ]
      }
    }

    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
      const lastSegment = trimmed.split('/').pop()
      return [
        {
          nome: lastSegment && lastSegment.length < 120 ? lastSegment : 'documento',
          dados: trimmed,
          contentType: 'application/octet-stream',
          tamanho: 0,
          pasta: null,
        },
      ]
    }

    // Suporte para caminhos relativos (novo formato)
    if (trimmed.startsWith('uploads/')) {
      const segments = trimmed.split('/')
      const fileName = segments[segments.length - 1] || 'documento'
      return [
        {
          nome: fileName,
          dados: trimmed,
          contentType: 'application/octet-stream',
          tamanho: 0,
          pasta: segments.length > 3 ? segments[segments.length - 2] : null,
        },
      ]
    }

    return []
  }

  // Função para codificar documentos em string JSON
  const encodeSeguroDocumentos = (
    documentos: SeguroDocumentoFormValue[] | undefined
  ): string => {
    if (!documentos?.length) {
      return ''
    }

    return JSON.stringify({
      version: DOCUMENTOS_STORAGE_VERSION,
      files: documentos.map((documento) => ({
        nome: documento.nome,
        dados: documento.dados,
        contentType: documento.contentType,
        tamanho: documento.tamanho,
        pasta: documento.pasta ?? undefined,
      })),
    })
  }

  type DocumentosUploaderProps = {
    value?: SeguroDocumentoFormValue[]
    onChange: (documentos: SeguroDocumentoFormValue[]) => void
  }

  const formatFileSize = (bytes?: number) => {
    if (bytes === undefined || bytes === null) {
      return '0 Bytes'
    }
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${Math.round((bytes / Math.pow(k, i)) * 100) / 100} ${sizes[i]}`
  }

  const isImageContentType = (contentType: string) =>
    contentType.startsWith('image/')
  const isPdfContentType = (contentType: string, nome?: string) => {
    if (contentType === 'application/pdf') {
      return true
    }
    return nome?.toLowerCase().endsWith('.pdf') ?? false
  }

  const FOLDER_FILTER_ALL = '__folder_all__'
  const FOLDER_FILTER_NONE = '__folder_none__'

  const normalizeFolderName = (folder?: string | null) => {
    const trimmed = folder?.trim()
    return trimmed && trimmed.length > 0 ? trimmed : undefined
  }

  const getDocumentoViewerUrl = (
    documento?: SeguroDocumentoFormValue | null
  ) => {
    if (!documento?.dados) return null
    // Se for base64 (data:), retornar como está
    if (documento.dados.startsWith('data:')) return documento.dados
    // Se for URL completa, retornar como está
    if (
      documento.dados.startsWith('http://') ||
      documento.dados.startsWith('https://')
    ) {
      return documento.dados
    }
    // Se for caminho relativo, construir URL completa
    if (documento.dados.startsWith('uploads/')) {
      const baseUrl = state.URL.replace(/\/$/, '')
      return `${baseUrl}/${documento.dados}`
    }
    return null
  }

  const convertDataUrlToBlobUrl = (dataUrl: string) => {
    try {
      const match = dataUrl.match(/^data:(.*?)(;base64)?,(.*)$/)
      if (!match) return null
      const mimeType = match[1] || 'application/octet-stream'
      const isBase64 = !!match[2]
      const data = match[3] ?? ''
      const byteCharacters = isBase64 ? atob(data) : decodeURIComponent(data)
      const byteArrays = new Uint8Array(byteCharacters.length)
      for (let i = 0; i < byteCharacters.length; i++) {
        byteArrays[i] = byteCharacters.charCodeAt(i)
      }
      const blob = new Blob([byteArrays], { type: mimeType })
      return URL.createObjectURL(blob)
    } catch {
      return null
    }
  }

  type ProcessingDocumento = {
    id: string
    nome: string
    dados: string
    contentType: string
    tamanho: number
    previewUrl: string
    file: File
    pasta?: string
  }

  // Componente DocumentosUploader simplificado (mesmo do create-form)
  const DocumentosUploader = ({
    value,
    onChange,
  }: DocumentosUploaderProps) => {
    // Garantir que value seja sempre um array
    let documentos: SeguroDocumentoFormValue[] = []
    if (Array.isArray(value)) {
      documentos = value
    } else if (value && typeof value === 'string') {
      // Se for string, fazer parse
      documentos = parseSeguroDocumentos(value)
    } else {
      documentos = []
    }
    const [previewIndex, setPreviewIndex] = useState<number | null>(null)
    const fileInputRef = useRef<HTMLInputElement | null>(null)
    const documentosRef = useRef<SeguroDocumentoFormValue[]>(documentos)
    const cancelledProcessingIdsRef = useRef<Set<string>>(new Set())
    const [manualFolders, setManualFolders] = useState<string[]>([])
    const [selectedFolder, setSelectedFolder] = useState<string>(FOLDER_FILTER_NONE)
    const [isFolderDialogOpen, setIsFolderDialogOpen] = useState(false)
    const [folderNameInput, setFolderNameInput] = useState('')
    const [pendingFolderForUpload, setPendingFolderForUpload] = useState<
      string | undefined
    >(undefined)
    const [processingDocumentos, setProcessingDocumentos] = useState<
      ProcessingDocumento[]
    >([])
    const [isFolderViewerOpen, setIsFolderViewerOpen] = useState(false)
    const [folderViewerFolder, setFolderViewerFolder] = useState<string | null>(
      null
    )
    const processingDocumentosRef = useRef<ProcessingDocumento[]>(
      processingDocumentos
    )

    useEffect(() => {
      documentosRef.current = documentos
    }, [documentos])

    useEffect(() => {
      processingDocumentosRef.current = processingDocumentos
    }, [processingDocumentos])

    useEffect(() => {
      return () => {
        processingDocumentosRef.current.forEach((doc) => {
          URL.revokeObjectURL(doc.previewUrl)
        })
      }
    }, [])

    const folderOptions = useMemo(() => {
      const folderSet = new Set<string>(manualFolders)
      documentos.forEach((documento) => {
        const normalized = normalizeFolderName(documento.pasta ?? undefined)
        if (normalized) {
          folderSet.add(normalized)
        }
      })
      processingDocumentos.forEach((documento) => {
        const normalized = normalizeFolderName(documento.pasta)
        if (normalized) {
          folderSet.add(normalized)
        }
      })
      return Array.from(folderSet).sort((a, b) =>
        a.localeCompare(b, 'pt-PT')
      )
    }, [documentos, manualFolders, processingDocumentos])

    const folderCounts = useMemo(() => {
      const counts = new Map<string, number>()
      const increment = (folderKey?: string) => {
        const key = folderKey ?? FOLDER_FILTER_NONE
        counts.set(key, (counts.get(key) ?? 0) + 1)
      }
      documentos.forEach((documento) => {
        increment(normalizeFolderName(documento.pasta ?? undefined))
      })
      processingDocumentos.forEach((documento) => {
        increment(normalizeFolderName(documento.pasta))
      })
      return counts
    }, [documentos, processingDocumentos])

    useEffect(() => {
      if (
        selectedFolder !== FOLDER_FILTER_ALL &&
        selectedFolder !== FOLDER_FILTER_NONE &&
        !folderOptions.includes(selectedFolder)
      ) {
        setSelectedFolder(FOLDER_FILTER_ALL)
      }
    }, [folderOptions, selectedFolder])

    const resolveCurrentFolder = useCallback(() => {
      if (
        selectedFolder === FOLDER_FILTER_ALL ||
        selectedFolder === FOLDER_FILTER_NONE
      ) {
        return undefined
      }
      return selectedFolder
    }, [selectedFolder])

    const handleSelectFolderValue = useCallback((folder?: string) => {
      if (!folder) {
        setSelectedFolder(FOLDER_FILTER_NONE)
        return
      }
      setSelectedFolder(folder)
    }, [])

    const handleOpenFolderDialog = useCallback(() => {
      setFolderNameInput('')
      setIsFolderDialogOpen(true)
    }, [])

    const handleConfirmCreateFolder = useCallback(() => {
      const normalized = normalizeFolderName(folderNameInput)
      if (!normalized) {
        toast.error('Indique um nome para a pasta.')
        return
      }
      setManualFolders((prev) => {
        if (prev.includes(normalized)) {
          return prev
        }
        return [...prev, normalized]
      })
      setSelectedFolder(normalized)
      setIsFolderDialogOpen(false)
      setFolderNameInput('')
      toast.success(`Pasta "${normalized}" criada.`)
    }, [folderNameInput])

    const handleCloseFolderDialog = useCallback(() => {
      setIsFolderDialogOpen(false)
      setFolderNameInput('')
    }, [])

    const handleRequestUploadForFolder = useCallback(
      (folder?: string) => {
        if (!folder) {
          toast.error('Selecione uma pasta existente para anexar ficheiros.')
          return
        }
        handleSelectFolderValue(folder)
        setPendingFolderForUpload(folder)
        fileInputRef.current?.click()
      },
      [handleSelectFolderValue]
    )

    const handleOpenFolderViewer = useCallback(
      (folder?: string | null) => {
        const normalized = folder
          ? normalizeFolderName(folder) ?? null
          : null
        handleSelectFolderValue(normalized ?? undefined)
        setFolderViewerFolder(normalized)
        setIsFolderViewerOpen(true)
      },
      [handleSelectFolderValue]
    )

    const convertFilesToDocumentos = useCallback(async (
      files: File[],
      pasta?: string
    ) => {
      if (!files.length) {
        return []
      }

      const seguroService = SegurosService('seguro')

      return Promise.all(
        files.map(async (file) => {
          try {
            // Fazer upload do ficheiro para o servidor
            const uploadResponse = await seguroService.uploadDocumento(
              file,
              seguroId, // seguroId já está disponível no escopo
              pasta ?? null
            )

            if (!uploadResponse.info?.data) {
              throw new Error('Resposta de upload inválida')
            }

            const caminho = uploadResponse.info.data

            return {
              nome: file.name || 'documento',
              dados: caminho, // Guardar apenas o caminho
              contentType: file.type || 'application/octet-stream',
              tamanho: file.size,
              pasta: pasta ?? null,
            }
          } catch (error) {
            console.error('Erro ao fazer upload:', error)
            throw error
          }
        })
      )
    }, [seguroId])

    const appendDocumentos = useCallback(
      (novos: SeguroDocumentoFormValue[]) => {
        if (novos.length === 0) return
        onChange([...documentosRef.current, ...novos])
      },
      [onChange]
    )

    const handleInputChange = useCallback(
      async (event: ChangeEvent<HTMLInputElement>) => {
        const fileList = event.target.files
          ? Array.from(event.target.files)
          : []
        if (!fileList.length) {
          event.target.value = ''
          return
        }

        const targetFolder = pendingFolderForUpload ?? resolveCurrentFolder()

        const tempDocs: ProcessingDocumento[] = fileList.map((file) => ({
          id: crypto.randomUUID
            ? crypto.randomUUID()
            : Math.random().toString(36).slice(2),
          nome: file.name || 'documento',
          dados: '',
          contentType: file.type || 'application/octet-stream',
          tamanho: file.size,
          previewUrl: URL.createObjectURL(file),
          file,
          pasta: targetFolder,
        }))

        setProcessingDocumentos((prev) => [...prev, ...tempDocs])

        tempDocs.forEach((tempDoc) => {
          convertFilesToDocumentos([tempDoc.file], tempDoc.pasta)
            .then((novos) => {
              if (!novos.length) return
              if (cancelledProcessingIdsRef.current.has(tempDoc.id)) {
                return
              }
              appendDocumentos(novos)
            })
            .catch((error) => {
              console.error('Erro ao fazer upload:', error)
              toast.error(
                `Não foi possível fazer upload do ficheiro ${tempDoc.nome}.`
              )
            })
            .finally(() => {
              setProcessingDocumentos((prev) =>
                prev.filter((doc) => doc.id !== tempDoc.id)
              )
              cancelledProcessingIdsRef.current.delete(tempDoc.id)
              URL.revokeObjectURL(tempDoc.previewUrl)
            })
        })

        event.target.value = ''
        setPendingFolderForUpload(undefined)
      },
      [
        appendDocumentos,
        convertFilesToDocumentos,
        pendingFolderForUpload,
        resolveCurrentFolder,
      ]
    )

    const handleAddClick = useCallback(() => {
      handleSelectFolderValue(undefined)
      setPendingFolderForUpload(undefined)
      fileInputRef.current?.click()
    }, [handleSelectFolderValue])

    const [confirmDeleteFolder, setConfirmDeleteFolder] = useState<
      string | null
    >(null)
    const handleDeleteFolder = useCallback((folderName: string) => {
      const normalized = normalizeFolderName(folderName)
      if (!normalized) return
      setConfirmDeleteFolder(normalized)
    }, [])

    const folderCards = useMemo(
      () =>
        folderOptions.map((folder) => ({
          key: folder,
          folder,
          label: folder,
          description: 'Clique para ver e gerir os documentos desta pasta',
          count: folderCounts.get(folder) ?? 0,
        })),
      [folderCounts, folderOptions]
    )

    const unassignedDocuments = useMemo(
      () =>
        documentos
          .map((documento, index) => ({ documento, index }))
          .filter(
            ({ documento }) =>
              !normalizeFolderName(documento.pasta ?? undefined)
          ),
      [documentos]
    )
    const unassignedProcessingDocumentos = useMemo(
      () =>
        processingDocumentos.filter(
          (documento) => !normalizeFolderName(documento.pasta)
        ),
      [processingDocumentos]
    )
    const folderViewerDocuments = useMemo(() => {
      if (folderViewerFolder === null) {
        return documentos
          .map((documento, index) => ({ documento, index }))
          .filter(
            ({ documento }) =>
              !normalizeFolderName(documento.pasta ?? undefined)
          )
      }
      return documentos
        .map((documento, index) => ({ documento, index }))
        .filter(
          ({ documento }) =>
            normalizeFolderName(documento.pasta ?? undefined) ===
            folderViewerFolder
        )
    }, [documentos, folderViewerFolder])

    const folderViewerProcessingDocumentos = useMemo(() => {
      if (folderViewerFolder === null) {
        return processingDocumentos.filter(
          (documento) => !normalizeFolderName(documento.pasta ?? undefined)
        )
      }
      return processingDocumentos.filter(
        (documento) =>
          normalizeFolderName(documento.pasta ?? undefined) ===
          folderViewerFolder
      )
    }, [processingDocumentos, folderViewerFolder])
    const unassignedCount =
      unassignedDocuments.length + unassignedProcessingDocumentos.length

    const handleRemove = useCallback(
      (index: number) => {
        const next = documentosRef.current.filter((_, i) => i !== index)
        onChange(next)
      },
      [onChange]
    )

    const handleDownload = useCallback(
      (documento: SeguroDocumentoFormValue) => {
        if (!documento?.dados) return

        // Se for base64 (formato legacy)
        if (documento.dados.startsWith('data:')) {
          const link = document.createElement('a')
          link.href = documento.dados
          link.download = documento.nome || 'documento'
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          return
        }

        // Se for URL completa
        if (
          documento.dados.startsWith('http://') ||
          documento.dados.startsWith('https://')
        ) {
          window.open(documento.dados, '_blank', 'noopener,noreferrer')
          return
        }

        // Se for caminho relativo (novo formato)
        if (documento.dados.startsWith('uploads/')) {
          const baseUrl = state.URL.replace(/\/$/, '')
          const downloadUrl = `${baseUrl}/client/frotas/documentos/download/${documento.dados}`
          window.open(downloadUrl, '_blank', 'noopener,noreferrer')
        }
      },
      []
    )

    const handleOpenInNewTab = useCallback(
      (documento: SeguroDocumentoFormValue) => {
        const viewerUrl = getDocumentoViewerUrl(documento)
        if (!viewerUrl) return
        window.open(viewerUrl, '_blank', 'noopener,noreferrer')
      },
      []
    )

    const handlePrint = useCallback(
      (documento: SeguroDocumentoFormValue) => {
        const viewerUrl = getDocumentoViewerUrl(documento)
        if (!viewerUrl) return

        if (!viewerUrl.startsWith('data:')) {
          toast.warning(
            'Para imprimir este tipo de ficheiro, utilize o botão "Abrir num separador" e imprima a partir do navegador.'
          )
          handleOpenInNewTab(documento)
          return
        }

        const blobUrl = convertDataUrlToBlobUrl(viewerUrl)
        if (!blobUrl) {
          toast.error('Não foi possível preparar o ficheiro para impressão.')
          return
        }

        const iframe = document.createElement('iframe')
        iframe.style.position = 'fixed'
        iframe.style.right = '-9999px'
        iframe.style.bottom = '0'
        iframe.style.width = '0'
        iframe.style.height = '0'
        iframe.style.border = '0'
        iframe.src = blobUrl
        document.body.appendChild(iframe)

        const cleanUp = () => {
          setTimeout(() => {
            iframe.remove()
            URL.revokeObjectURL(blobUrl)
          }, 500)
        }

        iframe.onload = () => {
          try {
            iframe.contentWindow?.focus()
            iframe.contentWindow?.print()
          } catch {
            toast.error(
              'O navegador bloqueou a impressão automática. Utilize o botão "Abrir num separador".'
            )
          } finally {
            cleanUp()
          }
        }
      },
      [handleOpenInNewTab]
    )

    const previewDocumento =
      previewIndex !== null ? documentos.at(previewIndex) ?? null : null
    const canUploadFromToolbar = selectedFolder !== FOLDER_FILTER_ALL

    return (
      <div className='space-y-3'>
        <div className='flex items-center gap-2'>
          <Button
            type='button'
            variant='outline'
            size='sm'
            className='h-8 px-2 text-xs font-medium'
            disabled={!canUploadFromToolbar}
            title={
              canUploadFromToolbar
                ? 'Anexar ficheiro à pasta selecionada'
                : 'Selecione ou crie uma pasta antes de anexar ficheiros.'
            }
            onClick={handleAddClick}
          >
            <Plus className='mr-1 h-3 w-3' aria-hidden />
            Anexar ficheiro
          </Button>
          <Button
            type='button'
            variant='default'
            size='sm'
            className='h-8 gap-2 px-2 text-xs font-medium'
            onClick={handleOpenFolderDialog}
          >
            <FolderPlus className='h-3 w-3' />
            Criar pasta
          </Button>
          <input
            ref={fileInputRef}
            type='file'
            className='hidden'
            multiple
            onChange={handleInputChange}
          />
        </div>

        <div className='space-y-3'>
          <div className='h-[170px] overflow-y-auto px-3 py-2 rounded-2xl border border-border/60 bg-card/60 documentation-scroll'>
            <div className='flex flex-wrap gap-3'>
              <div className='rounded-2xl border border-border/70 bg-card/70 p-2.5 shadow-sm transition hover:border-primary/50 hover:shadow-md text-[13px] w-fit min-w-[120px]'>
                <div className='flex items-center justify-between gap-3'>
                  <div className='flex items-center gap-3'>
                    <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary flex-shrink-0'>
                      <FolderOpen className='h-5 w-5' />
                    </div>
                    <div>
                      <p className='text-sm font-semibold text-foreground'>
                        Sem pasta
                      </p>
                      <p className='text-[11px] text-muted-foreground whitespace-nowrap'>
                        {unassignedCount} documento(s)
                      </p>
                    </div>
                  </div>
                </div>
                <div className='mt-4 flex flex-wrap gap-2'>
                  <Button
                    type='button'
                    size='sm'
                    variant='secondary'
                    className='gap-2 text-xs'
                    onClick={() => handleOpenFolderViewer(null)}
                  >
                    <FolderOpen className='h-3 w-3' />
                    Ver documentos
                  </Button>
                </div>
              </div>

              {folderCards.map((card) => (
                <div
                  key={card.key}
                  className='rounded-2xl border border-border/70 bg-card/70 p-2.5 shadow-sm transition hover:border-primary/50 hover:shadow-md text-[13px] w-fit min-w-[120px]'
                >
                  <div className='flex items-start gap-3'>
                    <button
                      type='button'
                      onClick={() => handleDeleteFolder(card.folder)}
                      className='group relative flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary flex-shrink-0 transition hover:bg-destructive/10 cursor-pointer'
                      title='Eliminar pasta'
                    >
                      <FolderOpen className='h-5 w-5 transition-opacity group-hover:opacity-0' />
                      <Trash2 className='h-5 w-5 text-destructive absolute opacity-0 transition-opacity group-hover:opacity-100' />
                    </button>
                    <div className='flex-1 min-w-0'>
                      <p className='text-sm font-semibold text-foreground break-words'>
                        {card.label}
                      </p>
                      <p className='text-[11px] text-muted-foreground whitespace-nowrap'>
                        {card.count} documento(s)
                      </p>
                    </div>
                  </div>
                  <div className='mt-4 flex flex-wrap gap-2'>
                    <Button
                      type='button'
                      size='sm'
                      variant='secondary'
                      className='gap-2 text-xs'
                      onClick={() => handleOpenFolderViewer(card.folder)}
                    >
                      <FolderOpen className='h-3 w-3' />
                      Ver documentos
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <AlertDialog
          open={confirmDeleteFolder !== null}
          onOpenChange={(open) => {
            if (!open) {
              setConfirmDeleteFolder(null)
            }
          }}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Tem a certeza?</AlertDialogTitle>
              <AlertDialogDescription>
                {confirmDeleteFolder
                  ? `A pasta "${confirmDeleteFolder}" será eliminada e os seus ficheiros passarão para "Sem pasta".`
                  : null}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel
                onClick={() => {
                  setConfirmDeleteFolder(null)
                }}
              >
                Cancelar
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  const normalized = normalizeFolderName(confirmDeleteFolder)
                  if (!normalized) {
                    setConfirmDeleteFolder(null)
                    return
                  }

                  const updatedDocs = documentosRef.current.map((documento) =>
                    documento.pasta === normalized
                      ? { ...documento, pasta: undefined }
                      : documento
                  )
                  onChange(updatedDocs)

                  setProcessingDocumentos((prev) =>
                    prev.map((documento) =>
                      documento.pasta === normalized
                        ? { ...documento, pasta: undefined }
                        : documento
                    )
                  )

                  setManualFolders((prev) =>
                    prev.filter((folder) => folder !== normalized)
                  )
                  if (selectedFolder === normalized) {
                    setSelectedFolder(FOLDER_FILTER_NONE)
                  }
                  toast.success(
                    `Pasta "${normalized}" removida. Os ficheiros passaram para "Sem pasta".`
                  )
                  setConfirmDeleteFolder(null)
                }}
              >
                Eliminar pasta
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <Dialog
          open={isFolderViewerOpen}
          onOpenChange={(open) => {
            setIsFolderViewerOpen(open)
            if (!open) {
              setFolderViewerFolder(null)
              setPendingFolderForUpload(undefined)
            }
          }}
        >
          <DialogContent className='max-w-4xl'>
            <DialogHeader>
              <DialogTitle className='text-lg font-semibold'>
                Documentos na pasta {folderViewerFolder ?? 'Sem pasta'}
              </DialogTitle>
            </DialogHeader>
            <div className='space-y-4'>
              {folderViewerDocuments.length > 0 ? (
                <div className='grid grid-cols-2 gap-3 sm:grid-cols-[repeat(auto-fill,minmax(180px,1fr))]'>
                  {folderViewerDocuments.map(({ documento, index }) => {
                    const handleOpenDocumento = () => {
                      setPreviewIndex(index)
                    }

                    return (
                      <div
                        key={`${documento.nome}-${index}`}
                        className='group relative rounded-xl border border-border/40 bg-card shadow-sm ring-1 ring-transparent transition hover:border-primary/40 hover:shadow-md hover:ring-primary/10'
                      >
                        <button
                          type='button'
                          onClick={handleOpenDocumento}
                          className='flex h-28 w-full flex-col items-center justify-center gap-2 px-3 text-center text-xs font-medium text-foreground'
                        >
                          <div className='flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary transition group-hover:bg-primary/20 group-hover:text-primary-foreground'>
                            <File className='h-4 w-4' aria-hidden />
                          </div>
                          <span className='line-clamp-2 max-w-[130px] text-[11px] leading-tight text-primary'>
                            {documento.nome}
                          </span>
                          <span className='text-[10px] text-muted-foreground'>
                            {formatFileSize(documento.tamanho)}
                          </span>
                        </button>
                        <Button
                          type='button'
                          variant='ghost'
                          size='icon'
                          className='absolute right-1 top-1 h-6 w-6 text-muted-foreground transition hover:text-destructive'
                          onClick={(event) => {
                            event.stopPropagation()
                            handleRemove(index)
                          }}
                          title='Remover'
                        >
                          <Trash2 className='h-3 w-3' />
                        </Button>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <p className='text-xs text-muted-foreground'>
                  Ainda não existem documentos nesta pasta. Utilize o botão
                  abaixo para anexar novos ficheiros.
                </p>
              )}

              {folderViewerProcessingDocumentos.length > 0 ? (
                <div className='rounded-lg border border-dashed border-border/60 bg-muted/30 p-3'>
                  <p className='text-xs font-semibold uppercase tracking-wide text-muted-foreground'>
                    Em processamento
                  </p>
                  <div className='mt-2 grid grid-cols-2 gap-2 sm:grid-cols-[repeat(auto-fill,minmax(160px,1fr))]'>
                    {folderViewerProcessingDocumentos.map((documento) => (
                      <div
                        key={documento.id}
                        className='flex flex-col items-center justify-center rounded-lg border border-border/40 bg-background/80 p-3 text-center text-xs text-muted-foreground'
                      >
                        <Loader2 className='mb-2 h-4 w-4 animate-spin text-primary' />
                        <span className='line-clamp-2 text-[11px] text-foreground'>
                          {documento.nome}
                        </span>
                        <span className='text-[10px] text-muted-foreground'>
                          {formatFileSize(documento.tamanho)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
            <DialogFooter className='mt-4'>
              <Button
                type='button'
                onClick={() =>
                  handleRequestUploadForFolder(folderViewerFolder ?? undefined)
                }
                disabled={!folderViewerFolder}
              >
                <Plus className='mr-2 h-4 w-4' />
                Anexar ficheiros
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog
          open={isFolderDialogOpen}
          onOpenChange={(open) => {
            if (!open) {
              handleCloseFolderDialog()
            } else {
              setIsFolderDialogOpen(true)
            }
          }}
        >
          <DialogContent className='sm:max-w-md'>
            <DialogHeader>
              <DialogTitle>Criar nova pasta</DialogTitle>
            </DialogHeader>
            <div className='space-y-2'>
              <Label
                htmlFor='new-folder-name'
                className='text-xs font-medium text-muted-foreground'
              >
                Nome da pasta
              </Label>
              <Input
                id='new-folder-name'
                placeholder='Ex: Contratos, seguros...'
                value={folderNameInput}
                onChange={(event) => setFolderNameInput(event.target.value)}
                autoFocus
              />
            </div>
            <DialogFooter className='pt-2'>
              <Button
                type='button'
                variant='ghost'
                onClick={handleCloseFolderDialog}
              >
                Cancelar
              </Button>
              <Button type='button' onClick={handleConfirmCreateFolder}>
                Criar pasta
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {previewDocumento ? (
          <Dialog
            open
            onOpenChange={(open) => {
              if (!open) {
                setPreviewIndex(null)
              }
            }}
          >
            <DialogContent className='max-w-5xl'>
              <DialogHeader>
                <DialogTitle className='flex flex-col gap-1'>
                  <span>{previewDocumento.nome}</span>
                  <span className='text-xs font-normal text-muted-foreground'>
                    {formatFileSize(previewDocumento.tamanho)} ·{' '}
                    {previewDocumento.contentType}
                  </span>
                </DialogTitle>
              </DialogHeader>
              <div className='flex flex-wrap gap-2 border-b border-border/60 pb-3'>
                <Button
                  type='button'
                  size='sm'
                  variant='secondary'
                  className='gap-2 text-xs'
                  onClick={() => handleDownload(previewDocumento)}
                >
                  <Download className='h-3 w-3' />
                  Descarregar
                </Button>
                <Button
                  type='button'
                  size='sm'
                  variant='outline'
                  className='gap-2 text-xs'
                  onClick={() => handlePrint(previewDocumento)}
                >
                  <Printer className='h-3 w-3' />
                  Imprimir
                </Button>
              </div>
              <div className='h-[70vh] rounded-lg border border-border/60 bg-muted/40'>
                {(() => {
                  const viewerUrl = getDocumentoViewerUrl(previewDocumento)
                  if (!viewerUrl) {
                    return (
                      <div className='flex h-full flex-col items-center justify-center gap-2 p-6 text-center text-sm text-muted-foreground'>
                        <File className='h-8 w-8 text-muted-foreground/70' />
                        <span>
                          Não foi possível gerar uma pré-visualização para este
                          documento.
                        </span>
                      </div>
                    )
                  }

                  if (isImageContentType(previewDocumento.contentType)) {
                    return (
                      <img
                        src={viewerUrl}
                        alt={previewDocumento.nome}
                        className='h-full w-full rounded-lg object-contain'
                      />
                    )
                  }

                  if (
                    isPdfContentType(
                      previewDocumento.contentType,
                      previewDocumento.nome
                    )
                  ) {
                    return (
                      <iframe
                        title={previewDocumento.nome}
                        src={viewerUrl}
                        className='h-full w-full rounded-lg'
                      />
                    )
                  }

                  return (
                    <iframe
                      title={previewDocumento.nome}
                      src={viewerUrl}
                      className='h-full w-full rounded-lg'
                    />
                  )
                })()}
              </div>
            </DialogContent>
          </Dialog>
        ) : null}
      </div>
    )
  }


  return (
    <div className='space-y-4'>
      <Form {...form}>
        <form
          id='seguroUpdateForm'
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
                            <FormLabel className='flex items-center gap-2 mt-2'>
                              <Shield className='h-4 w-4' />
                              Periodicidade
                              <Badge variant='secondary' className='text-xs'>
                                Obrigatório
                              </Badge>
                            </FormLabel>
                            <FormControl>
                              <div className='pt-4'>
                                <RadioGroup
                                  value={
                                    field.value !== undefined &&
                                    field.value !== null
                                      ? field.value.toString()
                                      : PeriodicidadeSeguro.Anual.toString()
                                  }
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
                    <div className='grid gap-6 lg:grid-cols-[1.2fr_0.1fr_1.3fr]'>
                      <div className='space-y-4'>
                        <div className='grid grid-cols-2 gap-4'>
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
                                      disabled={updateSeguroMutation.isPending}
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
                                      disabled={updateSeguroMutation.isPending}
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
                                <FileText className='h-4 w-4' />
                                Riscos Cobertos
                              </FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder='Digite os riscos cobertos pelo seguro (opcional)'
                                  {...field}
                                  value={field.value ?? ''}
                                  className='px-4 py-3 shadow-inner drop-shadow-xl min-h-[200px] resize-y'
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div></div>
                      <FormSection
                        icon={FolderOpen}
                        title='Documentação'
                        description='Anexe documentos, imagens e ficheiros relevantes'
                        className='h-full'
                      >
                        <FormField
                          control={form.control}
                          name='documentos'
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <DocumentosUploader
                                  value={field.value}
                                  onChange={(next) => field.onChange(next)}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </FormSection>
                    </div>
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
                              <NumberInput
                                step={0.01}
                                min={0}
                                placeholder='Valor total coberto pelo seguro'
                                value={field.value ?? undefined}
                                onValueChange={(value) => {
                                  field.onChange(value ?? null)
                                }}
                                className='shadow-inner drop-shadow-xl'
                              />
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
                              <NumberInput
                                step={0.01}
                                min={0}
                                placeholder='Custo anual do seguro'
                                value={field.value ?? undefined}
                                onValueChange={(value) => {
                                  field.onChange(value ?? null)
                                }}
                                className='shadow-inner drop-shadow-xl'
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
                        name='metodoPagamento'
                        render={({ field }) => {
                          const getIcon = (iconName: string) => {
                            const iconMap: Record<string, ComponentType<any>> = {
                              Building2,
                              Repeat,
                              Smartphone,
                              CreditCard,
                              Wallet,
                              Banknote,
                              FileText,
                              MoreHorizontal,
                            }
                            return iconMap[iconName] || MoreHorizontal
                          }

                          const selectedMethod =
                            field.value !== undefined && field.value !== null
                              ? MetodoPagamentoSeguroConfig[
                                  Number(field.value) as MetodoPagamentoSeguro
                                ]
                              : null

                          const [isDialogOpen, setIsDialogOpen] = useState(false)

                          return (
                            <FormItem>
                              <FormLabel className='flex items-center gap-2'>
                                <Euro className='h-4 w-4' />
                                Método de Pagamento
                              </FormLabel>
                              <FormControl>
                                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                  <DialogTrigger asChild>
                                    <Button
                                      type='button'
                                      variant='outline'
                                      className='w-full justify-start px-4 py-6 shadow-inner drop-shadow-xl'
                                    >
                                      {selectedMethod ? (
                                        <div className='flex items-center gap-3'>
                                          {selectedMethod.image ? (
                                            <img
                                              src={selectedMethod.image}
                                              alt={selectedMethod.label}
                                              className='w-8 h-8 object-contain'
                                            />
                                          ) : (
                                            <div
                                              className={`w-8 h-8 rounded-full ${selectedMethod.color} flex items-center justify-center text-white`}
                                            >
                                              {(() => {
                                                const Icon = getIcon(
                                                  selectedMethod.icon
                                                )
                                                return <Icon className='h-4 w-4' />
                                              })()}
                                            </div>
                                          )}
                                          <span>{selectedMethod.label}</span>
                                        </div>
                                      ) : (
                                        <span className='text-muted-foreground'>
                                          Selecione o método de pagamento
                                        </span>
                                      )}
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className='max-w-md'>
                                    <DialogHeader>
                                      <DialogTitle className='text-base'>
                                        Selecione o Método de Pagamento
                                      </DialogTitle>
                                      <DialogDescription>
                                        Escolha o método de pagamento utilizado para este seguro.
                                      </DialogDescription>
                                    </DialogHeader>
                                    <div className='flex flex-col gap-1.5 py-2 max-h-[60vh] overflow-y-auto'>
                                      {Object.entries(
                                        MetodoPagamentoSeguroConfig
                                      ).map(([key, config]) => {
                                        const value =
                                          Number(key) as MetodoPagamentoSeguro
                                        const Icon = getIcon(config.icon)
                                        const isSelected =
                                          field.value !== undefined &&
                                          field.value !== null &&
                                          Number(field.value) === value

                                        return (
                                          <button
                                            key={key}
                                            type='button'
                                            onClick={() => {
                                              field.onChange(
                                                isSelected ? undefined : value
                                              )
                                              setIsDialogOpen(false)
                                            }}
                                            className={`
                                              relative flex items-center gap-2 px-2 py-1.5 rounded border transition-all
                                              ${
                                                isSelected
                                                  ? 'border-primary bg-primary/10'
                                                  : 'border-input bg-background hover:border-primary/50 hover:bg-primary/5'
                                              }
                                            `}
                                          >
                                            {config.image ? (
                                              <div className='w-6 h-6 flex items-center justify-center flex-shrink-0'>
                                                <img
                                                  src={config.image}
                                                  alt={config.label}
                                                  className='w-full h-full object-contain'
                                                />
                                              </div>
                                            ) : (
                                              <div
                                                className={`w-6 h-6 rounded-full ${config.color} flex items-center justify-center text-white flex-shrink-0`}
                                              >
                                                <Icon className='h-3 w-3' />
                                              </div>
                                            )}
                                            <span
                                              className={`text-xs font-medium flex-1 text-left ${
                                                isSelected
                                                  ? 'text-primary'
                                                  : 'text-muted-foreground'
                                              }`}
                                            >
                                              {config.label}
                                            </span>
                                            {isSelected && (
                                              <div className='flex-shrink-0'>
                                                <ShieldCheck className='h-3 w-3 text-primary' />
                                              </div>
                                            )}
                                          </button>
                                        )
                                      })}
                                    </div>
                                  </DialogContent>
                                </Dialog>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )
                        }}
                      />
                      <FormField
                        control={form.control}
                        name='dataPagamento'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='flex items-center gap-2'>
                              <CalendarDays className='h-4 w-4' />
                              Data de Pagamento
                            </FormLabel>
                            <FormControl>
                              <DatePicker
                                value={field.value || undefined}
                                onChange={(date) => field.onChange(date)}
                                placeholder='Selecione a data de pagamento'
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

export { SeguroUpdateForm }


