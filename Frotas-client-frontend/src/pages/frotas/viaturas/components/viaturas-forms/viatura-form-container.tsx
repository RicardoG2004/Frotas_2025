import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type ReactNode,
} from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useFieldArray, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
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
import { LicensePlateInput } from '@/components/ui/license-plate-input'
import { NumberInput } from '@/components/ui/number-input'
import { Textarea } from '@/components/ui/textarea'
import { DatePicker } from '@/components/ui/date-picker'
import { Autocomplete, type AutocompleteOption } from '@/components/ui/autocomplete'
import {
  PersistentTabs,
  TabsContent as PersistentTabsContent,
  TabsList as PersistentTabsList,
  TabsTrigger as PersistentTabsTrigger,
} from '@/components/ui/persistent-tabs'
import { Switch } from '@/components/ui/switch'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import {
  Building2,
  BatteryCharging,
  CalendarDays,
  Car,
  CheckSquare,
  CircleDot,
  ClipboardList,
  ClipboardCheck as ClipboardCheckIcon,
  FileText,
  Fingerprint,
  Fuel,
  Gauge,
  Leaf,
  MapPin,
  Package,
  PiggyBank,
  Ruler,
  Settings,
  ShieldCheck,
  ShieldPlus,
  Wrench,
  Flame,
  Eye,
  Plus,
  Trash2,
  type LucideIcon,
  FolderOpen,
  Stamp,
  StickyNote,
  Download,
  File,
} from 'lucide-react'
import { toast } from '@/utils/toast-utils'
import { useTabManager } from '@/hooks/use-tab-manager'
import { useSubmitErrorTab } from '@/hooks/use-submit-error-tab'
import { useAutoSelectionWithReturnData } from '@/hooks/use-auto-selection-with-return-data'
import {
  defaultViaturaFormValues,
  viaturaFormSchema,
  viaturaPropulsaoOptions,
  parseViaturaDocumentosFromPair,
  type ViaturaFormSchemaType,
  type ViaturaPropulsaoType,
  type ViaturaDocumentoFormValue,
} from './viatura-form-schema'
import { useGetMarcasSelect } from '@/pages/frotas/Marcas/queries/marcas-queries'
import { useGetModelosSelect } from '@/pages/frotas/modelos/queries/modelos-queries'
import { useGetTipoViaturasSelect } from '@/pages/frotas/tipo-viaturas/queries/tipo-viaturas-queries'
import { useGetCoresSelect } from '@/pages/frotas/cores/queries/cores-queries'
import { useGetCombustiveisSelect } from '@/pages/frotas/combustiveis/queries/combustiveis-queries'
import { useGetConservatoriasSelect } from '@/pages/base/conservatorias/queries/conservatorias-queries'
import { useGetCategoriasSelect } from '@/pages/frotas/categorias/queries/categorias-queries'
import { useGetLocalizacoesSelect } from '@/pages/base/localizacoes/queries/localizacoes-queries'
import { useGetSetoresSelect } from '@/pages/base/setores/queries/setores-queries'
import { useGetDelegacoesSelect } from '@/pages/base/delegacoes/queries/delegacoes-queries'
import { useGetTerceirosSelect } from '@/pages/base/terceiros/queries/terceiros-queries'
import { useGetFornecedoresSelect } from '@/pages/base/fornecedores/queries/fornecedores-queries'
import { useGetSegurosSelect } from '@/pages/frotas/seguros/queries/seguros-queries'
import { useGetGarantiasSelect } from '@/pages/base/garantias/queries/garantias-queries'
import { useGetEquipamentosSelect } from '@/pages/frotas/equipamentos/queries/equipamentos-queries'
import { useWindowsStore } from '@/stores/use-windows-store'
import { cn } from '@/lib/utils'
import {
  useCurrentWindowId,
  openMarcaCreationWindow,
  openMarcaViewWindow,
  openModeloCreationWindow,
  openModeloViewWindow,
  openTipoViaturaCreationWindow,
  openTipoViaturaViewWindow,
  openCorCreationWindow,
  openCorViewWindow,
  openCategoriaCreationWindow,
  openCategoriaViewWindow,
  openLocalizacaoCreationWindow,
  openLocalizacaoViewWindow,
  openSetorCreationWindow,
  openSetorViewWindow,
  openDelegacaoCreationWindow,
  openDelegacaoViewWindow,
  openConservatoriaCreationWindow,
  openConservatoriaViewWindow,
  openTerceiroCreationWindow,
  openTerceiroViewWindow,
  openFornecedorCreationWindow,
  openFornecedorViewWindow,
  openSeguroCreationWindow,
  openSeguroViewWindow,
  openEquipamentoCreationWindow,
  openEquipamentoViewWindow,
  createEntityCreationWindow,
  createEntityViewWindow,
} from '@/utils/window-utils'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

type ViaturaSelectOptions = {
  marcas: AutocompleteOption[]
  modelos: AutocompleteOption[]
  tipoViaturas: AutocompleteOption[]
  cores: AutocompleteOption[]
  combustiveis: AutocompleteOption[]
  conservatorias: AutocompleteOption[]
  categorias: AutocompleteOption[]
  localizacoes: AutocompleteOption[]
  setores: AutocompleteOption[]
  delegacoes: AutocompleteOption[]
  terceiros: AutocompleteOption[]
  fornecedores: AutocompleteOption[]
  seguros: AutocompleteOption[]
  garantias: AutocompleteOption[]
  equipamentos: AutocompleteOption[]
}

type ViaturaSelectLoading = {
  marcas: boolean
  modelos: boolean
  tipoViaturas: boolean
  cores: boolean
  combustiveis: boolean
  conservatorias: boolean
  categorias: boolean
  localizacoes: boolean
  setores: boolean
  delegacoes: boolean
  terceiros: boolean
  fornecedores: boolean
  seguros: boolean
  garantias: boolean
  equipamentos: boolean
}

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
        <h3 className='text-base font-semibold leading-tight text-foreground'>{title}</h3>
        <p className='text-sm text-muted-foreground'>{description}</p>
      </div>
    </div>
    <div className='mt-4 flex-1 space-y-4'>{children}</div>
  </div>
)

const openGarantiaCreationWindowFn = createEntityCreationWindow(
  '/utilitarios/tabelas/configuracoes/garantias/create'
)
const openGarantiaViewWindowFn = createEntityViewWindow(
  '/utilitarios/tabelas/configuracoes/garantias/update',
  'garantiaId'
)

const FIELD_HEIGHT_CLASS = 'h-12'
const SELECT_WITH_ACTIONS_CLASS = `${FIELD_HEIGHT_CLASS} px-4 pr-32 shadow-inner drop-shadow-xl`
const TEXT_INPUT_CLASS = `${FIELD_HEIGHT_CLASS} px-4 shadow-inner drop-shadow-xl`

const PROPULSAO_DETAILS: Record<
  ViaturaPropulsaoType,
  { label: string; description: string; icon: LucideIcon }
> = {
  combustao: {
    label: 'Combustão',
    description: 'Motor térmico convencional (gasolina, gasóleo, GPL...).',
    icon: Flame,
  },
  hibrido: {
    label: 'Híbrido',
    description: 'Combinação de motor térmico com apoio elétrico.',
    icon: Leaf,
  },
  eletrico: {
    label: 'Elétrico',
    description: 'Propulsão 100% elétrica alimentada por bateria.',
    icon: BatteryCharging,
  },
}

const PROPULSAO_OPTIONS = viaturaPropulsaoOptions.map((value) => ({
  value,
  ...PROPULSAO_DETAILS[value],
}))

const toNumberValue = (value: unknown) =>
  typeof value === 'number' && !Number.isNaN(value) ? value : undefined

const formatDateLabel = (value: Date | string | null | undefined) => {
  if (!value) return null
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return null
  return date.toLocaleDateString('pt-PT')
}

type DocumentosUploaderProps = {
  value?: ViaturaDocumentoFormValue[]
  onChange: (documentos: ViaturaDocumentoFormValue[]) => void
}

const readFileAsDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result)
      } else {
        reject(new Error('Não foi possível ler o ficheiro.'))
      }
    }
    reader.onerror = () => reject(reader.error ?? new Error('Erro ao ler o ficheiro.'))
    reader.readAsDataURL(file)
  })

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

const isImageContentType = (contentType: string) => contentType.startsWith('image/')

const DocumentosUploader = ({ value, onChange }: DocumentosUploaderProps) => {
  const documentos = value ?? []
  const [previewIndex, setPreviewIndex] = useState<number | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const convertFilesToDocumentos = useCallback(async (files: File[]) => {
    if (!files.length) {
      return []
    }

    return Promise.all(
      files.map(async (file) => ({
        nome: file.name || 'documento',
        dados: await readFileAsDataUrl(file),
        contentType: file.type || 'application/octet-stream',
        tamanho: file.size,
      }))
    )
  }, [])

  const appendDocumentos = useCallback(
    (novos: ViaturaDocumentoFormValue[]) => {
      if (novos.length === 0) return
      onChange([...documentos, ...novos])
    },
    [documentos, onChange]
  )

  const handleInputChange = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      const fileList = event.target.files ? Array.from(event.target.files) : []
      const novos = await convertFilesToDocumentos(fileList)
      appendDocumentos(novos)
      event.target.value = ''
    },
    [appendDocumentos, convertFilesToDocumentos]
  )

  const handleAddClick = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  const handleRemove = useCallback(
    (index: number) => {
      const next = documentos.filter((_, i) => i !== index)
      onChange(next)
    },
    [documentos, onChange]
  )

  const handleDownload = useCallback((documento: ViaturaDocumentoFormValue) => {
    if (!documento?.dados) return

    if (documento.dados.startsWith('data:')) {
      const link = document.createElement('a')
      link.href = documento.dados
      link.download = documento.nome || 'documento'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      return
    }

    if (documento.dados.startsWith('http://') || documento.dados.startsWith('https://')) {
      window.open(documento.dados, '_blank')
    }
  }, [])

  const previewDocumento =
    previewIndex !== null ? documentos.at(previewIndex) ?? null : null

  return (
    <div className='space-y-3'>
      <div className='flex items-center gap-2'>
        <Button
          type='button'
          variant='outline'
          size='sm'
          className='h-8 px-2 text-xs font-medium'
          onClick={handleAddClick}
        >
          <Plus className='mr-1 h-3 w-3' aria-hidden />
          Anexar ficheiro
        </Button>
        <input
          ref={fileInputRef}
          type='file'
          className='hidden'
          multiple
          onChange={handleInputChange}
        />
      </div>

      {documentos.length > 0 ? (
        <div className='grid grid-cols-2 gap-3 sm:grid-cols-[repeat(auto-fill,minmax(150px,1fr))]'>
          {documentos.map((documento, index) => {
            const isImage = isImageContentType(documento.contentType)
            const handleOpenDocumento = () => {
              if (isImage && documento.dados.startsWith('data:')) {
                setPreviewIndex(index)
              } else {
                handleDownload(documento)
              }
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
          Ainda não há documentos anexados. Utilize o botão acima para carregar ficheiros.
        </p>
      )}

      {previewDocumento && previewDocumento.dados.startsWith('data:') ? (
        <Dialog
          open
          onOpenChange={(open) => {
            if (!open) {
              setPreviewIndex(null)
            }
          }}
        >
          <DialogContent className='max-w-3xl'>
            <DialogHeader>
              <DialogTitle>{previewDocumento.nome}</DialogTitle>
            </DialogHeader>
            <img
              src={previewDocumento.dados}
              alt={previewDocumento.nome}
              className='max-h-[70vh] w-full object-contain'
            />
          </DialogContent>
        </Dialog>
      ) : null}
    </div>
  )
}

const buildOptions = (
  items: Array<{ id?: string; designacao?: string; descricao?: string; nome?: string }>
): AutocompleteOption[] =>
  items
    .filter((item) => item.id)
    .map((item) => ({
      value: item.id as string,
      label:
        item.designacao ??
        item.descricao ??
        item.nome ??
        '',
    }))

interface ViaturaFormContainerProps {
  initialValues?: Partial<ViaturaFormSchemaType>
  isLoadingInitial?: boolean
  onSubmit: (values: ViaturaFormSchemaType) => Promise<void>
  onCancel: () => void
  submitLabel: string
  tabKey: string
  isSubmitting: boolean
}

const ViaturaFormContainer = ({
  initialValues,
  isLoadingInitial = false,
  onSubmit,
  onCancel,
  submitLabel,
  tabKey,
  isSubmitting,
}: ViaturaFormContainerProps) => {
  const initialFormValues = useMemo<Partial<ViaturaFormSchemaType>>(() => {
    const documentosBase =
      initialValues?.documentos ??
      parseViaturaDocumentosFromPair(initialValues?.urlImagem1, initialValues?.urlImagem2)

    return {
      ...defaultViaturaFormValues,
      ...initialValues,
      documentos: documentosBase?.map((documento) => ({ ...documento })) ?? [],
    }
  }, [initialValues])

  const form = useForm<ViaturaFormSchemaType>({
    resolver: zodResolver(viaturaFormSchema),
    defaultValues: initialFormValues,
    mode: 'onSubmit',
  })

  const navigate = useNavigate()
  const location = useLocation()
  const searchParams = useMemo(() => new URLSearchParams(location.search), [location.search])
  const instanceId = searchParams.get('instanceId') || 'default'
  const currentWindowId = useCurrentWindowId()
  const parentWindowId = currentWindowId || instanceId || 'viaturas-root'
  const updateWindowState = useWindowsStore((state) => state.updateWindowState)
  const findWindowByPathAndInstanceId = useWindowsStore(
    (state) => state.findWindowByPathAndInstanceId
  )

  const inspecoesValues = form.watch('inspecoes') ?? []
  const entidadeFornecedoraTipo = form.watch('entidadeFornecedoraTipo')
  const tipoPropulsao = form.watch('tipoPropulsao')
  const isElectricPropulsion = tipoPropulsao === 'eletrico'
  const isHybridPropulsion = tipoPropulsao === 'hibrido'
  const showCombustivelFields = !isElectricPropulsion || isHybridPropulsion
  const showElectricFields = isElectricPropulsion || isHybridPropulsion
  const motorizacaoSelecionada = tipoPropulsao === 'combustao' || isElectricPropulsion || isHybridPropulsion

  useEffect(() => {
    if (entidadeFornecedoraTipo === 'fornecedor') {
      const currentTerceiro = form.getValues('terceiroId')
      if (currentTerceiro) {
        form.setValue('terceiroId', '', { shouldDirty: true, shouldValidate: true })
      }
    } else if (entidadeFornecedoraTipo === 'terceiro') {
      const currentFornecedor = form.getValues('fornecedorId')
      if (currentFornecedor) {
        form.setValue('fornecedorId', '', { shouldDirty: true, shouldValidate: true })
      }
    } else {
      const currentFornecedor = form.getValues('fornecedorId')
      const currentTerceiro = form.getValues('terceiroId')
      if (currentFornecedor) {
        form.setValue('fornecedorId', '', { shouldDirty: true, shouldValidate: true })
      }
      if (currentTerceiro) {
        form.setValue('terceiroId', '', { shouldDirty: true, shouldValidate: true })
      }
    }
  }, [entidadeFornecedoraTipo, form])

  useEffect(() => {
    form.reset(initialFormValues)
  }, [form, initialFormValues])

  const combustivelSectionIcon =
    isElectricPropulsion || isHybridPropulsion ? BatteryCharging : Fuel
  const combustivelSectionTitle = isElectricPropulsion
    ? 'Energia e autonomia'
    : isHybridPropulsion
      ? 'Combustível e energia'
      : 'Combustível e consumo'
  const combustivelSectionDescription = isElectricPropulsion
    ? 'Defina o consumo elétrico e a autonomia estimada'
    : isHybridPropulsion
      ? 'Defina os consumos híbridos e a autonomia em modo elétrico'
      : 'Defina o combustível e o consumo médio estimado'
  const consumoMedioLabel = isElectricPropulsion
    ? 'Consumo Médio (kWh/100km)'
    : isHybridPropulsion
      ? 'Consumo Médio Combustível (L/100km)'
      : 'Consumo Médio (L/100km)'
  const combustivelGridClass = isElectricPropulsion
    ? 'grid gap-4'
    : 'grid gap-4 sm:grid-cols-[2fr_1fr]'
  const motorSectionIcon = isElectricPropulsion || isHybridPropulsion ? BatteryCharging : Gauge
  const motorSectionTitle = isElectricPropulsion
    ? 'Bateria e performance'
    : isHybridPropulsion
      ? 'Sistema híbrido e performance'
      : 'Motor e performance'
  const motorSectionDescription = isElectricPropulsion
    ? 'Informação sobre a potência e capacidade energética da viatura'
    : isHybridPropulsion
      ? 'Detalhe as especificações térmicas e elétricas do sistema híbrido'
      : 'Especificações de potência do conjunto motor'
  const potenciaLabel = isElectricPropulsion
    ? 'Potência (kW)'
    : isHybridPropulsion
      ? 'Potência combinada (cv)'
      : 'Potência (cv)'
  const identificacaoMecanicaGridClass = isHybridPropulsion
    ? 'grid gap-4'
    : 'grid gap-4 sm:grid-cols-2'

  const {
    fields: inspectionFields,
    append: appendInspection,
    remove: removeInspection,
  } = useFieldArray({
    control: form.control,
    name: 'inspecoes',
    keyName: 'fieldId',
  })

  const {
    data: marcas = [],
    isLoading: isLoadingMarcas,
    refetch: refetchMarcas,
  } = useGetMarcasSelect()
  const {
    data: modelos = [],
    isLoading: isLoadingModelos,
    refetch: refetchModelos,
  } = useGetModelosSelect()
  const {
    data: tipoViaturas = [],
    isLoading: isLoadingTipoViaturas,
    refetch: refetchTipoViaturas,
  } = useGetTipoViaturasSelect()
  const {
    data: cores = [],
    isLoading: isLoadingCores,
    refetch: refetchCores,
  } = useGetCoresSelect()
  const {
    data: combustiveis = [],
    isLoading: isLoadingCombustiveis,
  } = useGetCombustiveisSelect()
  const {
    data: conservatorias = [],
    isLoading: isLoadingConservatorias,
    refetch: refetchConservatorias,
  } = useGetConservatoriasSelect()
  const {
    data: categorias = [],
    isLoading: isLoadingCategorias,
    refetch: refetchCategorias,
  } = useGetCategoriasSelect()
  const {
    data: localizacoes = [],
    isLoading: isLoadingLocalizacoes,
    refetch: refetchLocalizacoes,
  } = useGetLocalizacoesSelect()
  const {
    data: setores = [],
    isLoading: isLoadingSetores,
    refetch: refetchSetores,
  } = useGetSetoresSelect()
  const {
    data: delegacoes = [],
    isLoading: isLoadingDelegacoes,
    refetch: refetchDelegacoes,
  } = useGetDelegacoesSelect()
  const {
    data: terceiros = [],
    isLoading: isLoadingTerceiros,
    refetch: refetchTerceiros,
  } = useGetTerceirosSelect()
  const {
    data: fornecedores = [],
    isLoading: isLoadingFornecedores,
    refetch: refetchFornecedores,
  } = useGetFornecedoresSelect()
  const {
    data: seguros = [],
    isLoading: isLoadingSeguros,
    refetch: refetchSeguros,
  } = useGetSegurosSelect()
  const {
    data: garantias = [],
    isLoading: isLoadingGarantias,
    refetch: refetchGarantias,
  } = useGetGarantiasSelect()
  const {
    data: equipamentos = [],
    isLoading: isLoadingEquipamentos,
    refetch: refetchEquipamentos,
  } = useGetEquipamentosSelect()

  const selectOptions: ViaturaSelectOptions = useMemo(
    () => ({
      marcas: buildOptions(marcas),
      modelos: buildOptions(modelos),
      tipoViaturas: buildOptions(tipoViaturas),
      cores: buildOptions(cores),
      combustiveis: buildOptions(combustiveis),
      conservatorias: buildOptions(conservatorias),
      categorias: buildOptions(categorias),
      localizacoes: buildOptions(localizacoes),
      setores: buildOptions(setores),
      delegacoes: buildOptions(delegacoes),
      terceiros: buildOptions(terceiros),
      fornecedores: buildOptions(fornecedores),
      seguros: buildOptions(seguros),
      garantias: buildOptions(garantias),
      equipamentos: buildOptions(equipamentos),
    }),
    [
      categorias,
      combustiveis,
      conservatorias,
      cores,
      delegacoes,
      equipamentos,
      fornecedores,
      garantias,
      localizacoes,
      marcas,
      modelos,
      seguros,
      setores,
      terceiros,
      tipoViaturas,
    ]
  )

  useEffect(() => {
    if (!isElectricPropulsion || isHybridPropulsion) {
      return
    }

    const currentCombustivel = form.getValues('combustivelId')
    const eletricOption = selectOptions.combustiveis.find((option) => {
      const normalizedLabel = option.label
        ?.toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
      return normalizedLabel?.includes('eletric')
    })

    if (eletricOption && currentCombustivel !== eletricOption.value) {
      form.setValue('combustivelId', eletricOption.value, {
        shouldDirty: true,
        shouldValidate: true,
      })
    }
  }, [form, isElectricPropulsion, isHybridPropulsion, selectOptions.combustiveis])

  const selectLoading: ViaturaSelectLoading = {
    marcas: isLoadingMarcas,
    modelos: isLoadingModelos,
    tipoViaturas: isLoadingTipoViaturas,
    cores: isLoadingCores,
    combustiveis: isLoadingCombustiveis,
    conservatorias: isLoadingConservatorias,
    categorias: isLoadingCategorias,
    localizacoes: isLoadingLocalizacoes,
    setores: isLoadingSetores,
    delegacoes: isLoadingDelegacoes,
    terceiros: isLoadingTerceiros,
    fornecedores: isLoadingFornecedores,
    seguros: isLoadingSeguros,
  garantias: isLoadingGarantias,
    equipamentos: isLoadingEquipamentos,
  }

  const [selectedSeguroId, setSelectedSeguroId] = useState('')
  const segurosSelecionados = form.watch('seguroIds') ?? []
  const [selectedEquipamentoId, setSelectedEquipamentoId] = useState('')
  const [selectedGarantiaId, setSelectedGarantiaId] = useState('')
  const equipamentosSelecionados = form.watch('equipamentoIds') ?? []
  const garantiasSelecionadas = form.watch('garantiaIds') ?? []

  const segurosMap = useMemo(() => {
    const map = new Map<string, string>()
    selectOptions.seguros.forEach((option) => {
      map.set(option.value, option.label)
    })
    return map
  }, [selectOptions.seguros])

  const equipamentosMap = useMemo(() => {
    const map = new Map<string, string>()
    selectOptions.equipamentos.forEach((option) => {
      map.set(option.value, option.label)
    })
    return map
  }, [selectOptions.equipamentos])

  const garantiasMap = useMemo(() => {
    const map = new Map<string, string>()
    selectOptions.garantias.forEach((option) => {
      map.set(option.value, option.label)
    })
    return map
  }, [selectOptions.garantias])

  const segurosSelecionadosDetalhes = useMemo(
    () =>
      segurosSelecionados.map((id) => ({
        id,
        label: segurosMap.get(id) ?? 'Seguro indisponível',
      })),
    [segurosSelecionados, segurosMap]
  )

  const equipamentosSelecionadosDetalhes = useMemo(
    () =>
      equipamentosSelecionados.map((id) => ({
        id,
        label: equipamentosMap.get(id) ?? 'Equipamento indisponível',
      })),
    [equipamentosSelecionados, equipamentosMap]
  )

  const garantiasSelecionadasDetalhes = useMemo(
    () =>
      garantiasSelecionadas.map((id) => ({
        id,
        label: garantiasMap.get(id) ?? 'Garantia indisponível',
      })),
    [garantiasSelecionadas, garantiasMap]
  )

  const addSeguroToForm = (seguroId: string) => {
    if (!seguroId) {
      return
    }

    const current = form.getValues('seguroIds') ?? []
    if (current.includes(seguroId)) {
      toast.warning('Este seguro já foi adicionado')
      return
    }

    form.setValue('seguroIds', [...current, seguroId], {
      shouldDirty: true,
      shouldValidate: true,
    })
    setSelectedSeguroId('')
  }

  const addEquipamentoToForm = (equipamentoId: string) => {
    if (!equipamentoId) {
      return
    }

    const current = form.getValues('equipamentoIds') ?? []
    if (current.includes(equipamentoId)) {
      toast.warning('Este equipamento já foi adicionado')
      return
    }

    form.setValue('equipamentoIds', [...current, equipamentoId], {
      shouldDirty: true,
      shouldValidate: true,
    })
    setSelectedEquipamentoId('')
  }

  const addGarantiaToForm = (garantiaId: string) => {
    if (!garantiaId) {
      return
    }

    const current = form.getValues('garantiaIds') ?? []
    if (current.includes(garantiaId)) {
      toast.warning('Esta garantia já foi adicionada')
      return
    }

    form.setValue('garantiaIds', [...current, garantiaId], {
      shouldDirty: true,
      shouldValidate: true,
    })
    setSelectedGarantiaId('')
  }

  const handleAddEquipamento = () => {
    addEquipamentoToForm(selectedEquipamentoId)
  }

  const handleAddSeguro = () => {
    addSeguroToForm(selectedSeguroId)
  }

  const handleAddGarantia = () => {
    addGarantiaToForm(selectedGarantiaId)
  }

  const getNextInspectionDate = (date: Date) => {
    const next = new Date(date.getTime())
    next.setFullYear(next.getFullYear() + 1)
    return next
  }

  const handleAddInspection = () => {
    const inspections = form.getValues('inspecoes') ?? []
    const lastInspection = inspections[inspections.length - 1]

    if (lastInspection) {
      if (!(lastInspection.dataProximaInspecao instanceof Date)) {
        toast.warning('Defina a data da próxima inspeção antes de adicionar uma nova.')
        return
      }

      const dataInspecao = new Date(lastInspection.dataProximaInspecao)
      appendInspection({
        id: undefined,
        dataInspecao,
        resultado: '',
        dataProximaInspecao: getNextInspectionDate(dataInspecao),
      })

      form.setValue(`inspecoes.${inspections.length - 1}.dataProximaInspecao`, dataInspecao, {
        shouldDirty: true,
        shouldValidate: true,
      })
    } else {
      const today = new Date()
      appendInspection({
        id: undefined,
        dataInspecao: today,
        resultado: '',
        dataProximaInspecao: getNextInspectionDate(today),
      })
    }
  }

  const handleRemoveSeguro = (seguroId: string) => {
    const current = form.getValues('seguroIds') ?? []
    form.setValue(
      'seguroIds',
      current.filter((id) => id !== seguroId),
      { shouldDirty: true, shouldValidate: true }
    )

    setSelectedSeguroId((prev) => (prev === seguroId ? '' : prev))
  }

  const handleRemoveEquipamento = (equipamentoId: string) => {
    const current = form.getValues('equipamentoIds') ?? []
    form.setValue(
      'equipamentoIds',
      current.filter((id) => id !== equipamentoId),
      { shouldDirty: true, shouldValidate: true }
    )

    setSelectedEquipamentoId((prev) => (prev === equipamentoId ? '' : prev))
  }

  const handleRemoveGarantia = (garantiaId: string) => {
    const current = form.getValues('garantiaIds') ?? []
    form.setValue(
      'garantiaIds',
      current.filter((id) => id !== garantiaId),
      { shouldDirty: true, shouldValidate: true }
    )

    setSelectedGarantiaId((prev) => (prev === garantiaId ? '' : prev))
  }

  const handleRemoveInspection = (index: number) => {
    removeInspection(index)

    setTimeout(() => {
      const inspections = form.getValues('inspecoes') ?? []
      const previousIndex = index - 1
      if (
        previousIndex >= 0 &&
        previousIndex < inspections.length &&
        inspections[previousIndex + 1]?.dataInspecao instanceof Date
      ) {
        form.setValue(
          `inspecoes.${previousIndex}.dataProximaInspecao`,
          inspections[previousIndex + 1].dataInspecao,
          { shouldDirty: true, shouldValidate: true }
        )
      }
    })
  }

  const { setActiveTab } = useTabManager({
    defaultTab: 'identificacao',
    tabKey,
  })

  const { handleError } = useSubmitErrorTab<ViaturaFormSchemaType>({
    setActiveTab,
    fieldToTabMap: {
      default: 'identificacao',
      matricula: 'identificacao',
      numero: 'identificacao',
      anoFabrico: 'identificacao',
      mesFabrico: 'identificacao',
      dataAquisicao: 'identificacao',
      dataLivrete: 'identificacao',
      marcaId: 'identificacao',
      modeloId: 'identificacao',
      tipoViaturaId: 'identificacao',
      corId: 'identificacao',
      tipoPropulsao: 'identificacao',
      combustivelId: 'caracterizacao',
      custo: 'caracterizacao',
      despesasIncluidas: 'caracterizacao',
      consumoMedio: 'caracterizacao',
      autonomia: 'caracterizacao',
      nQuadro: 'caracterizacao',
      nMotor: 'caracterizacao',
      cilindrada: 'caracterizacao',
      capacidadeBateria: 'caracterizacao',
      potencia: 'caracterizacao',
      tara: 'caracterizacao',
      lotacao: 'caracterizacao',
      cargaUtil: 'caracterizacao',
      comprimento: 'caracterizacao',
      largura: 'caracterizacao',
      pneusFrente: 'caracterizacao',
      pneusTras: 'caracterizacao',
      conservatoriaId: 'identificacao',
      categoriaId: 'identificacao',
      localizacaoId: 'identificacao',
      setorId: 'identificacao',
      delegacaoId: 'identificacao',
      entidadeFornecedoraTipo: 'caracterizacao',
      terceiroId: 'caracterizacao',
      fornecedorId: 'locacao',
      contrato: 'locacao',
      dataInicial: 'locacao',
      dataFinal: 'locacao',
      valorTotalContrato: 'locacao',
      opcaoCompra: 'locacao',
      nRendas: 'locacao',
      valorRenda: 'locacao',
      valorResidual: 'locacao',
      seguroIds: 'seguros',
      anoImpostoSelo: 'notas',
      anoImpostoCirculacao: 'notas',
      dataValidadeSelo: 'notas',
      cartaoCombustivel: 'notas',
      notasAdicionais: 'notas',
      urlImagem1: 'notas',
      urlImagem2: 'notas',
      equipamentoIds: 'equipamento',
      garantiaIds: 'garantias',
      inspecoes: 'inspecoes',
    },
  })

  const openCreation = (createFn: typeof openMarcaCreationWindow) => {
    createFn(
      navigate,
      parentWindowId,
      updateWindowState,
      findWindowByPathAndInstanceId
    )
  }

  const openView = (
    viewFn: typeof openMarcaViewWindow,
    value: string | null | undefined,
    emptyMessage: string
  ) => {
    if (!value) {
      toast.error(emptyMessage)
      return
    }

    viewFn(
      navigate,
      parentWindowId,
      value,
      updateWindowState,
      findWindowByPathAndInstanceId
    )
  }

  const handleCreateMarca = () => openCreation(openMarcaCreationWindow)
  const handleViewMarca = () =>
    openView(openMarcaViewWindow, form.getValues('marcaId'), 'Por favor, selecione uma marca primeiro')

  const handleCreateModelo = () => openCreation(openModeloCreationWindow)
  const handleViewModelo = () =>
    openView(openModeloViewWindow, form.getValues('modeloId'), 'Por favor, selecione um modelo primeiro')

  const handleCreateTipoViatura = () => openCreation(openTipoViaturaCreationWindow)
  const handleViewTipoViatura = () =>
    openView(
      openTipoViaturaViewWindow,
      form.getValues('tipoViaturaId'),
      'Por favor, selecione um tipo de viatura primeiro'
    )

  const handleCreateCor = () => openCreation(openCorCreationWindow)
  const handleViewCor = () =>
    openView(openCorViewWindow, form.getValues('corId'), 'Por favor, selecione uma cor primeiro')

  const handleCreateCombustivel = () => {
    toast.warning(
      'A criação de combustíveis ainda não está disponível a partir deste formulário.',
      'Funcionalidade indisponível'
    )
  }

  const handleViewCombustivel = () => {
    const combustivelId = form.getValues('combustivelId')
    if (!combustivelId) {
      toast.error('Por favor, selecione um combustível primeiro')
      return
    }

    toast.warning(
      'A visualização de combustíveis ainda não está disponível a partir deste formulário.',
      'Funcionalidade indisponível'
    )
  }

  const handleCreateConservatoria = () => openCreation(openConservatoriaCreationWindow)
  const handleViewConservatoria = () =>
    openView(
      openConservatoriaViewWindow,
      form.getValues('conservatoriaId'),
      'Por favor, selecione uma conservatória primeiro'
    )

  const handleCreateCategoria = () => openCreation(openCategoriaCreationWindow)
  const handleViewCategoria = () =>
    openView(
      openCategoriaViewWindow,
      form.getValues('categoriaId'),
      'Por favor, selecione uma categoria primeiro'
    )

  const handleCreateLocalizacao = () => openCreation(openLocalizacaoCreationWindow)
  const handleViewLocalizacao = () =>
    openView(
      openLocalizacaoViewWindow,
      form.getValues('localizacaoId'),
      'Por favor, selecione uma localização primeiro'
    )

  const handleCreateSetor = () => openCreation(openSetorCreationWindow)
  const handleViewSetor = () =>
    openView(openSetorViewWindow, form.getValues('setorId'), 'Por favor, selecione um setor primeiro')

  const handleCreateDelegacao = () => openCreation(openDelegacaoCreationWindow)
  const handleViewDelegacao = () =>
    openView(
      openDelegacaoViewWindow,
      form.getValues('delegacaoId'),
      'Por favor, selecione uma delegação primeiro'
    )

  const handleCreateTerceiro = () => openCreation(openTerceiroCreationWindow)
  const handleViewTerceiro = () =>
    openView(
      openTerceiroViewWindow,
      form.getValues('terceiroId'),
      'Por favor, selecione um terceiro primeiro'
    )

  const handleCreateFornecedor = () => openCreation(openFornecedorCreationWindow)
  const handleViewFornecedor = () =>
    openView(
      openFornecedorViewWindow,
      form.getValues('fornecedorId'),
      'Por favor, selecione um fornecedor primeiro'
    )

  const handleCreateSeguro = () => openCreation(openSeguroCreationWindow)
  const handleViewSeguro = (seguroId?: string) =>
    openView(
      openSeguroViewWindow,
      seguroId ?? selectedSeguroId,
      'Por favor, selecione um seguro primeiro'
    )

  const handleCreateEquipamento = () => openCreation(openEquipamentoCreationWindow)
  const handleViewEquipamento = (equipamentoId: string) =>
    openView(
      openEquipamentoViewWindow,
      equipamentoId,
      'Não foi possível abrir o equipamento selecionado'
    )

  const handleCreateGarantia = () => openCreation(openGarantiaCreationWindowFn)
  const handleViewGarantia = (garantiaId: string) =>
    openView(
      openGarantiaViewWindowFn,
      garantiaId,
      'Não foi possível abrir a garantia selecionada'
    )

  useAutoSelectionWithReturnData({
    windowId: parentWindowId,
    instanceId,
    data: marcas,
    setValue: (value: string) =>
      form.setValue('marcaId', value, { shouldDirty: true, shouldValidate: true }),
    refetch: refetchMarcas,
    itemName: 'Marca',
    successMessage: 'Marca selecionada automaticamente',
    manualSelectionMessage: 'Marca criada com sucesso. Por favor, selecione-a manualmente.',
    queryKey: ['marcas-select'],
    returnDataKey: `return-data-${parentWindowId}-marca`,
  })

  useAutoSelectionWithReturnData({
    windowId: parentWindowId,
    instanceId,
    data: modelos,
    setValue: (value: string) =>
      form.setValue('modeloId', value, { shouldDirty: true, shouldValidate: true }),
    refetch: refetchModelos,
    itemName: 'Modelo',
    successMessage: 'Modelo selecionado automaticamente',
    manualSelectionMessage: 'Modelo criado com sucesso. Por favor, selecione-o manualmente.',
    queryKey: ['modelos-select'],
    returnDataKey: `return-data-${parentWindowId}-modelo`,
  })

  useAutoSelectionWithReturnData({
    windowId: parentWindowId,
    instanceId,
    data: tipoViaturas,
    setValue: (value: string) =>
      form.setValue('tipoViaturaId', value, { shouldDirty: true, shouldValidate: true }),
    refetch: refetchTipoViaturas,
    itemName: 'Tipo de Viatura',
    successMessage: 'Tipo de viatura selecionado automaticamente',
    manualSelectionMessage:
      'Tipo de viatura criado com sucesso. Por favor, selecione-o manualmente.',
    queryKey: ['tipo-viaturas-select'],
    returnDataKey: `return-data-${parentWindowId}-tipo-viatura`,
  })

  useAutoSelectionWithReturnData({
    windowId: parentWindowId,
    instanceId,
    data: cores,
    setValue: (value: string) =>
      form.setValue('corId', value, { shouldDirty: true, shouldValidate: true }),
    refetch: refetchCores,
    itemName: 'Cor',
    successMessage: 'Cor selecionada automaticamente',
    manualSelectionMessage: 'Cor criada com sucesso. Por favor, selecione-a manualmente.',
    queryKey: ['cores-select'],
    returnDataKey: `return-data-${parentWindowId}-cor`,
  })

  useAutoSelectionWithReturnData({
    windowId: parentWindowId,
    instanceId,
    data: conservatorias,
    setValue: (value: string) =>
      form.setValue('conservatoriaId', value, { shouldDirty: true, shouldValidate: true }),
    refetch: refetchConservatorias,
    itemName: 'Conservatória',
    successMessage: 'Conservatória selecionada automaticamente',
    manualSelectionMessage:
      'Conservatória criada com sucesso. Por favor, selecione-a manualmente.',
    queryKey: ['conservatorias-select'],
    returnDataKey: `return-data-${parentWindowId}-conservatoria`,
  })

  useAutoSelectionWithReturnData({
    windowId: parentWindowId,
    instanceId,
    data: categorias,
    setValue: (value: string) =>
      form.setValue('categoriaId', value, { shouldDirty: true, shouldValidate: true }),
    refetch: refetchCategorias,
    itemName: 'Categoria',
    successMessage: 'Categoria selecionada automaticamente',
    manualSelectionMessage: 'Categoria criada com sucesso. Por favor, selecione-a manualmente.',
    queryKey: ['categorias-select'],
    returnDataKey: `return-data-${parentWindowId}-categoria`,
  })

  useAutoSelectionWithReturnData({
    windowId: parentWindowId,
    instanceId,
    data: localizacoes,
    setValue: (value: string) =>
      form.setValue('localizacaoId', value, { shouldDirty: true, shouldValidate: true }),
    refetch: refetchLocalizacoes,
    itemName: 'Localização',
    successMessage: 'Localização selecionada automaticamente',
    manualSelectionMessage:
      'Localização criada com sucesso. Por favor, selecione-a manualmente.',
    queryKey: ['localizacoes-select'],
    returnDataKey: `return-data-${parentWindowId}-localizacao`,
  })

  useAutoSelectionWithReturnData({
    windowId: parentWindowId,
    instanceId,
    data: setores,
    setValue: (value: string) =>
      form.setValue('setorId', value, { shouldDirty: true, shouldValidate: true }),
    refetch: refetchSetores,
    itemName: 'Setor',
    successMessage: 'Setor selecionado automaticamente',
    manualSelectionMessage: 'Setor criado com sucesso. Por favor, selecione-o manualmente.',
    queryKey: ['setores-select'],
    returnDataKey: `return-data-${parentWindowId}-setor`,
  })

  useAutoSelectionWithReturnData({
    windowId: parentWindowId,
    instanceId,
    data: delegacoes,
    setValue: (value: string) =>
      form.setValue('delegacaoId', value, { shouldDirty: true, shouldValidate: true }),
    refetch: refetchDelegacoes,
    itemName: 'Delegação',
    successMessage: 'Delegação selecionada automaticamente',
    manualSelectionMessage:
      'Delegação criada com sucesso. Por favor, selecione-a manualmente.',
    queryKey: ['delegacoes-select'],
    returnDataKey: `return-data-${parentWindowId}-delegacao`,
  })

  useAutoSelectionWithReturnData({
    windowId: parentWindowId,
    instanceId,
    data: terceiros,
    setValue: (value: string) => {
      form.setValue('entidadeFornecedoraTipo', 'terceiro', {
        shouldDirty: true,
        shouldValidate: true,
      })
      form.setValue('terceiroId', value, { shouldDirty: true, shouldValidate: true })
    },
    refetch: refetchTerceiros,
    itemName: 'Terceiro',
    successMessage: 'Terceiro selecionado automaticamente',
    manualSelectionMessage: 'Terceiro criado com sucesso. Por favor, selecione-o manualmente.',
    queryKey: ['terceiros-select'],
    returnDataKey: `return-data-${parentWindowId}-terceiro`,
  })

  useAutoSelectionWithReturnData({
    windowId: parentWindowId,
    instanceId,
    data: fornecedores,
    setValue: (value: string) => {
      form.setValue('entidadeFornecedoraTipo', 'fornecedor', {
        shouldDirty: true,
        shouldValidate: true,
      })
      form.setValue('fornecedorId', value, { shouldDirty: true, shouldValidate: true })
    },
    refetch: refetchFornecedores,
    itemName: 'Fornecedor',
    successMessage: 'Fornecedor selecionado automaticamente',
    manualSelectionMessage:
      'Fornecedor criado com sucesso. Por favor, selecione-o manualmente.',
    queryKey: ['fornecedores-select'],
    returnDataKey: `return-data-${parentWindowId}-fornecedor`,
  })

  useAutoSelectionWithReturnData({
    windowId: parentWindowId,
    instanceId,
    data: seguros,
    setValue: (value: string) => {
      addSeguroToForm(value)
    },
    refetch: refetchSeguros,
    itemName: 'Seguro',
    successMessage: 'Seguro selecionado automaticamente',
    manualSelectionMessage: 'Seguro criado com sucesso. Por favor, selecione-o manualmente.',
    queryKey: ['seguros-select'],
    returnDataKey: `return-data-${parentWindowId}-seguro`,
  })

  useAutoSelectionWithReturnData({
    windowId: parentWindowId,
    instanceId,
    data: equipamentos,
    setValue: (value: string) => {
      addEquipamentoToForm(value)
    },
    refetch: refetchEquipamentos,
    itemName: 'Equipamento',
    successMessage: 'Equipamento selecionado automaticamente',
    manualSelectionMessage:
      'Equipamento criado com sucesso. Por favor, selecione-o manualmente.',
    queryKey: ['equipamentos-select'],
    returnDataKey: `return-data-${parentWindowId}-equipamento`,
  })

  useAutoSelectionWithReturnData({
    windowId: parentWindowId,
    instanceId,
    data: garantias,
    setValue: (value: string) => {
      addGarantiaToForm(value)
    },
    refetch: refetchGarantias,
    itemName: 'Garantia',
    successMessage: 'Garantia selecionada automaticamente',
    manualSelectionMessage: 'Garantia criada com sucesso. Por favor, selecione-a manualmente.',
    queryKey: ['garantias-select'],
    returnDataKey: `return-data-${parentWindowId}-garantia`,
  })

  const placeholder = (loading: boolean, label: string) =>
    loading ? `A carregar ${label}...` : `Selecione ${label}`

  const handleSubmit = async (values: ViaturaFormSchemaType) => {
    await onSubmit(values)
  }

  if (isLoadingInitial) {
    return (
      <div className='rounded-lg border border-dashed border-muted-foreground/40 p-6 text-sm text-muted-foreground'>
        A carregar dados da viatura...
      </div>
    )
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit, handleError)}
        className='space-y-4'
        autoComplete='off'
      >
        <PersistentTabs defaultValue='identificacao' className='w-full' tabKey={tabKey}>
          <PersistentTabsList>
            <PersistentTabsTrigger value='identificacao'>
              <Car className='mr-2 h-4 w-4' />
              Identificação
            </PersistentTabsTrigger>
            <PersistentTabsTrigger value='caracterizacao'>
              <Settings className='mr-2 h-4 w-4' />
              Caraterização
            </PersistentTabsTrigger>
            <PersistentTabsTrigger value='locacao'>
              <MapPin className='mr-2 h-4 w-4' />
              Locação
            </PersistentTabsTrigger>
            <PersistentTabsTrigger value='inspecoes'>
              <ClipboardCheckIcon className='mr-2 h-4 w-4' />
              Inspeções
            </PersistentTabsTrigger>
            <PersistentTabsTrigger value='seguros'>
              <ShieldCheck className='mr-2 h-4 w-4' />
              Seguros
            </PersistentTabsTrigger>
            <PersistentTabsTrigger value='garantias'>
              <ShieldPlus className='mr-2 h-4 w-4' />
              Garantias
            </PersistentTabsTrigger>
            <PersistentTabsTrigger value='notas'>
              <FileText className='mr-2 h-4 w-4' />
              Notas
            </PersistentTabsTrigger>
            <PersistentTabsTrigger value='equipamento'>
              <Wrench className='mr-2 h-4 w-4' />
              Equipamento Extra
            </PersistentTabsTrigger>
          </PersistentTabsList>

          {/* Identificação */}
          <PersistentTabsContent value='identificacao'>
            <div className='space-y-6'>
              <Card className='overflow-hidden border-l-4 border-l-primary/20 transition-all duration-200 hover:border-l-primary/40 hover:shadow-md'>
                <CardHeader className='pb-4'>
                  <div className='flex items-center gap-3'>
                    <div className='flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary'>
                      <Car className='h-4 w-4' />
                    </div>
                    <div>
                      <CardTitle className='flex items-center gap-2 text-base'>
                        Identificação da Viatura
                        <Badge variant='secondary' className='text-xs'>
                          Obrigatório
                        </Badge>
                      </CardTitle>
                      <p className='mt-1 text-sm text-muted-foreground'>
                        Preencha os dados de identificação e registo da viatura
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className='space-y-8'>
                  <FormSection
                    icon={ClipboardList}
                    title='Dados principais'
                    description='Informações base de identificação e registo'
                  >
                    <div className='grid items-start gap-4 md:grid-cols-[1.35fr_1.65fr] xl:grid-cols-[1.35fr_1.65fr_1.3fr]'>
                      <FormField
                        control={form.control}
                        name='matricula'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='sr-only'>Matrícula</FormLabel>
                            <FormControl>
                              <LicensePlateInput
                                name={field.name}
                                value={field.value ?? ''}
                                onChange={field.onChange}
                                onBlur={field.onBlur}
                                ref={field.ref}
                                className='shadow-inner drop-shadow-xl'
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className='flex flex-col gap-4 md:pr-0'>
                        <FormField
                          control={form.control}
                          name='numero'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Número Interno</FormLabel>
                              <FormControl>
                                <NumberInput
                                  value={toNumberValue(field.value)}
                                  onValueChange={(nextValue) => field.onChange(nextValue)}
                                  onBlur={field.onBlur}
                                  name={field.name}
                                  ref={field.ref}
                                  className={TEXT_INPUT_CLASS}
                                  min={0}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name='dataInicial'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Data de Registo</FormLabel>
                              <FormControl>
                                <DatePicker
                                  value={field.value || undefined}
                                  onChange={field.onChange}
                                  placeholder='Selecione a data de registo'
                                  className={FIELD_HEIGHT_CLASS}
                                  allowClear
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className='md:col-start-2 xl:col-start-3 flex flex-col gap-4 md:pl-0'>
                        <FormField
                          control={form.control}
                          name='anoFabrico'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Ano de Fabrico</FormLabel>
                              <FormControl>
                                <NumberInput
                                  value={toNumberValue(field.value)}
                                  onValueChange={(nextValue) => field.onChange(nextValue)}
                                  onBlur={field.onBlur}
                                  name={field.name}
                                  ref={field.ref}
                                  className={TEXT_INPUT_CLASS}
                                  min={1900}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name='mesFabrico'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Mês de Fabrico</FormLabel>
                              <FormControl>
                                <NumberInput
                                  value={toNumberValue(field.value)}
                                  onValueChange={(nextValue) => field.onChange(nextValue)}
                                  onBlur={field.onBlur}
                                  name={field.name}
                                  ref={field.ref}
                                  className={TEXT_INPUT_CLASS}
                                  min={1}
                                  max={12}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </FormSection>

                  <FormSection
                    icon={BatteryCharging}
                    title='Motorização'
                    description='Selecione o tipo de motorização principal da viatura'
                  >
                    <FormField
                      control={form.control}
                      name='tipoPropulsao'
                      render={({ field }) => (
                        <FormItem className='space-y-4'>
                          <FormLabel>Tipo de motorização</FormLabel>
                          <FormControl>
                            <ToggleGroup
                              type='single'
                              value={field.value}
                              onValueChange={(value) => {
                                if (!value) {
                                  field.onChange('')
                                  return
                                }
                                field.onChange(value)
                              }}
                              className='grid gap-3 md:grid-cols-3'
                            >
                              {PROPULSAO_OPTIONS.map((option) => (
                                <ToggleGroupItem
                                  key={option.value}
                                  value={option.value}
                                  className='flex h-full flex-col items-start gap-3 rounded-xl border border-input bg-background p-4 text-left shadow-sm transition data-[state=on]:border-primary data-[state=on]:bg-primary/10 data-[state=on]:text-primary'
                                >
                                  <div className='flex items-start gap-3'>
                                    <div className='flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary'>
                                      <option.icon className='h-4 w-4' />
                                    </div>
                                    <div className='text-left'>
                                      <p className='text-sm font-semibold leading-tight text-foreground'>
                                        {option.label}
                                      </p>
                                      <p className='mt-1 text-xs leading-snug text-muted-foreground'>
                                        {option.description}
                                      </p>
                                    </div>
                                  </div>
                                </ToggleGroupItem>
                              ))}
                            </ToggleGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </FormSection>

                  <div className='grid gap-6 lg:grid-cols-2'>
                    <FormSection
                      icon={CalendarDays}
                      title='Registos e documentação'
                      description='Datas oficiais e enquadramento legal da viatura'
                      className='h-full'
                    >
                      <div className='grid gap-4 md:grid-cols-2'>
                    <FormField
                      control={form.control}
                      name='dataAquisicao'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Data de Aquisição</FormLabel>
                          <FormControl>
                            <DatePicker
                              value={field.value || undefined}
                              onChange={field.onChange}
                              placeholder='Selecione a data de aquisição'
                              className={FIELD_HEIGHT_CLASS}
                              allowClear
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name='dataLivrete'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Data do Livrete</FormLabel>
                          <FormControl>
                            <DatePicker
                              value={field.value || undefined}
                              onChange={field.onChange}
                              placeholder='Selecione a data do livrete'
                              className={FIELD_HEIGHT_CLASS}
                              allowClear
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                          name='conservatoriaId'
                      render={({ field }) => (
                        <FormItem>
                              <FormLabel>Conservatória</FormLabel>
                          <FormControl>
                                <div className='relative'>
                            <Autocomplete
                                    options={selectOptions.conservatorias}
                              value={field.value}
                              onValueChange={field.onChange}
                                    placeholder={placeholder(
                                      selectLoading.conservatorias,
                                      'a conservatória'
                                    )}
                                    disabled={selectLoading.conservatorias}
                                    className={SELECT_WITH_ACTIONS_CLASS}
                                  />
                                  <div className='absolute right-12 top-1/2 -translate-y-1/2 flex gap-1'>
                                    <Button
                                      type='button'
                                      variant='outline'
                                      size='sm'
                                      onClick={handleViewConservatoria}
                                      className='h-8 w-8 p-0'
                                      title='Ver Conservatória'
                                      disabled={!field.value}
                                    >
                                      <Eye className='h-4 w-4' />
                                    </Button>
                                    <Button
                                      type='button'
                                      variant='outline'
                                      size='sm'
                                      onClick={handleCreateConservatoria}
                                      className='h-8 w-8 p-0'
                                      title='Criar Conservatória'
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
                          name='categoriaId'
                      render={({ field }) => (
                        <FormItem>
                              <FormLabel>Categoria</FormLabel>
                          <FormControl>
                                <div className='relative'>
                            <Autocomplete
                                    options={selectOptions.categorias}
                              value={field.value}
                              onValueChange={field.onChange}
                                    placeholder={placeholder(
                                      selectLoading.categorias,
                                      'a categoria'
                                    )}
                                    disabled={selectLoading.categorias}
                                    className={SELECT_WITH_ACTIONS_CLASS}
                                  />
                                  <div className='absolute right-12 top-1/2 -translate-y-1/2 flex gap-1'>
                                    <Button
                                      type='button'
                                      variant='outline'
                                      size='sm'
                                      onClick={handleViewCategoria}
                                      className='h-8 w-8 p-0'
                                      title='Ver Categoria'
                                      disabled={!field.value}
                                    >
                                      <Eye className='h-4 w-4' />
                                    </Button>
                                    <Button
                                      type='button'
                                      variant='outline'
                                      size='sm'
                                      onClick={handleCreateCategoria}
                                      className='h-8 w-8 p-0'
                                      title='Criar Categoria'
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
                    </FormSection>

                    <FormSection
                      icon={Car}
                      title='Classificação da viatura'
                      description='Selecione marca, modelo e caraterísticas principais'
                      className='h-full'
                    >
                      <div className='grid gap-4 md:grid-cols-2'>
                    <FormField
                      control={form.control}
                          name='marcaId'
                      render={({ field }) => (
                        <FormItem>
                              <FormLabel>Marca</FormLabel>
                          <FormControl>
                                <div className='relative'>
                            <Autocomplete
                                    options={selectOptions.marcas}
                              value={field.value}
                              onValueChange={field.onChange}
                                    placeholder={placeholder(selectLoading.marcas, 'a marca')}
                                    disabled={selectLoading.marcas}
                                    className={SELECT_WITH_ACTIONS_CLASS}
                                  />
                                  <div className='absolute right-12 top-1/2 -translate-y-1/2 flex gap-1'>
                                    <Button
                                      type='button'
                                      variant='outline'
                                      size='sm'
                                      onClick={handleViewMarca}
                                      className='h-8 w-8 p-0'
                                      title='Ver Marca'
                                      disabled={!field.value}
                                    >
                                      <Eye className='h-4 w-4' />
                                    </Button>
                                    <Button
                                      type='button'
                                      variant='outline'
                                      size='sm'
                                      onClick={handleCreateMarca}
                                      className='h-8 w-8 p-0'
                                      title='Criar Marca'
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
                          name='modeloId'
                      render={({ field }) => (
                        <FormItem>
                              <FormLabel>Modelo</FormLabel>
                          <FormControl>
                                <div className='relative'>
                            <Autocomplete
                                    options={selectOptions.modelos}
                              value={field.value}
                              onValueChange={field.onChange}
                                    placeholder={placeholder(selectLoading.modelos, 'o modelo')}
                                    disabled={selectLoading.modelos}
                                    className={SELECT_WITH_ACTIONS_CLASS}
                                  />
                                  <div className='absolute right-12 top-1/2 -translate-y-1/2 flex gap-1'>
                                    <Button
                                      type='button'
                                      variant='outline'
                                      size='sm'
                                      onClick={handleViewModelo}
                                      className='h-8 w-8 p-0'
                                      title='Ver Modelo'
                                      disabled={!field.value}
                                    >
                                      <Eye className='h-4 w-4' />
                                    </Button>
                                    <Button
                                      type='button'
                                      variant='outline'
                                      size='sm'
                                      onClick={handleCreateModelo}
                                      className='h-8 w-8 p-0'
                                      title='Criar Modelo'
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
                          name='tipoViaturaId'
                      render={({ field }) => (
                        <FormItem>
                              <FormLabel>Tipo de Viatura</FormLabel>
                          <FormControl>
                                <div className='relative'>
                            <Autocomplete
                                    options={selectOptions.tipoViaturas}
                              value={field.value}
                              onValueChange={field.onChange}
                                    placeholder={placeholder(
                                      selectLoading.tipoViaturas,
                                      'o tipo de viatura'
                                    )}
                                    disabled={selectLoading.tipoViaturas}
                                    className={SELECT_WITH_ACTIONS_CLASS}
                                  />
                                  <div className='absolute right-12 top-1/2 -translate-y-1/2 flex gap-1'>
                                    <Button
                                      type='button'
                                      variant='outline'
                                      size='sm'
                                      onClick={handleViewTipoViatura}
                                      className='h-8 w-8 p-0'
                                      title='Ver Tipo de Viatura'
                                      disabled={!field.value}
                                    >
                                      <Eye className='h-4 w-4' />
                                    </Button>
                                    <Button
                                      type='button'
                                      variant='outline'
                                      size='sm'
                                      onClick={handleCreateTipoViatura}
                                      className='h-8 w-8 p-0'
                                      title='Criar Tipo de Viatura'
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
                          name='corId'
                      render={({ field }) => (
                        <FormItem>
                              <FormLabel>Cor</FormLabel>
                          <FormControl>
                                <div className='relative'>
                            <Autocomplete
                                    options={selectOptions.cores}
                              value={field.value}
                              onValueChange={field.onChange}
                                    placeholder={placeholder(selectLoading.cores, 'a cor')}
                                    disabled={selectLoading.cores}
                                    className={SELECT_WITH_ACTIONS_CLASS}
                                  />
                                  <div className='absolute right-12 top-1/2 -translate-y-1/2 flex gap-1'>
                                    <Button
                                      type='button'
                                      variant='outline'
                                      size='sm'
                                      onClick={handleViewCor}
                                      className='h-8 w-8 p-0'
                                      title='Ver Cor'
                                      disabled={!field.value}
                                    >
                                      <Eye className='h-4 w-4' />
                                    </Button>
                                    <Button
                                      type='button'
                                      variant='outline'
                                      size='sm'
                                      onClick={handleCreateCor}
                                      className='h-8 w-8 p-0'
                                      title='Criar Cor'
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
                    </FormSection>
                  </div>

                  <FormSection
                    icon={MapPin}
                    title='Atribuição interna'
                    description='Defina a afetação da viatura dentro da organização'
                  >
                    <div className='grid gap-4 md:grid-cols-3'>
                    <FormField
                      control={form.control}
                      name='localizacaoId'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Localização</FormLabel>
                          <FormControl>
                              <div className='relative'>
                            <Autocomplete
                              options={selectOptions.localizacoes}
                              value={field.value}
                              onValueChange={field.onChange}
                                  placeholder={placeholder(
                                    selectLoading.localizacoes,
                                    'a localização'
                                  )}
                              disabled={selectLoading.localizacoes}
                                  className={SELECT_WITH_ACTIONS_CLASS}
                                />
                                <div className='absolute right-12 top-1/2 -translate-y-1/2 flex gap-1'>
                                  <Button
                                    type='button'
                                    variant='outline'
                                    size='sm'
                                    onClick={handleViewLocalizacao}
                                    className='h-8 w-8 p-0'
                                    title='Ver Localização'
                                    disabled={!field.value}
                                  >
                                    <Eye className='h-4 w-4' />
                                  </Button>
                                  <Button
                                    type='button'
                                    variant='outline'
                                    size='sm'
                                    onClick={handleCreateLocalizacao}
                                    className='h-8 w-8 p-0'
                                    title='Criar Localização'
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
                      name='setorId'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Setor</FormLabel>
                          <FormControl>
                              <div className='relative'>
                            <Autocomplete
                              options={selectOptions.setores}
                              value={field.value}
                              onValueChange={field.onChange}
                                  placeholder={placeholder(
                                    selectLoading.setores,
                                    'o setor'
                                  )}
                              disabled={selectLoading.setores}
                                  className={SELECT_WITH_ACTIONS_CLASS}
                                />
                                <div className='absolute right-12 top-1/2 -translate-y-1/2 flex gap-1'>
                                  <Button
                                    type='button'
                                    variant='outline'
                                    size='sm'
                                    onClick={handleViewSetor}
                                    className='h-8 w-8 p-0'
                                    title='Ver Setor'
                                    disabled={!field.value}
                                  >
                                    <Eye className='h-4 w-4' />
                                  </Button>
                                  <Button
                                    type='button'
                                    variant='outline'
                                    size='sm'
                                    onClick={handleCreateSetor}
                                    className='h-8 w-8 p-0'
                                    title='Criar Setor'
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
                      name='delegacaoId'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Delegação</FormLabel>
                          <FormControl>
                              <div className='relative'>
                            <Autocomplete
                              options={selectOptions.delegacoes}
                              value={field.value}
                              onValueChange={field.onChange}
                                  placeholder={placeholder(
                                    selectLoading.delegacoes,
                                    'a delegação'
                                  )}
                              disabled={selectLoading.delegacoes}
                                  className={SELECT_WITH_ACTIONS_CLASS}
                                />
                                <div className='absolute right-12 top-1/2 -translate-y-1/2 flex gap-1'>
                                  <Button
                                    type='button'
                                    variant='outline'
                                    size='sm'
                                    onClick={handleViewDelegacao}
                                    className='h-8 w-8 p-0'
                                    title='Ver Delegação'
                                    disabled={!field.value}
                                  >
                                    <Eye className='h-4 w-4' />
                                  </Button>
                                  <Button
                                    type='button'
                                    variant='outline'
                                    size='sm'
                                    onClick={handleCreateDelegacao}
                                    className='h-8 w-8 p-0'
                                    title='Criar Delegação'
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
                  </FormSection>
                </CardContent>
              </Card>
            </div>
          </PersistentTabsContent>

          {/* Caraterização */}
          <PersistentTabsContent value='caracterizacao'>
            <div className='space-y-6'>
              <Card className='overflow-hidden border-l-4 border-l-primary/20 transition-all duration-200 hover:border-l-primary/40 hover:shadow-md'>
                <CardHeader className='pb-4'>
                  <div className='flex items-center gap-3'>
                    <div className='flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary'>
                      <Settings className='h-4 w-4' />
                    </div>
                    <div>
                      <CardTitle className='flex items-center gap-2 text-base'>
                        Caraterização Técnica
                        <Badge variant='secondary' className='text-xs'>
                          Dados técnicos
                        </Badge>
                      </CardTitle>
                      <p className='mt-1 text-sm text-muted-foreground'>
                        Configure os detalhes técnicos da viatura
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className='space-y-8'>
                  <div className='grid gap-6 lg:grid-cols-2'>
                    <FormSection
                      icon={PiggyBank}
                      title='Aquisição e custos'
                      description='Registe valores financeiros e entidade fornecedora'
                    >
                      <div className='grid gap-4 sm:grid-cols-2'>
                    <FormField
                      control={form.control}
                      name='custo'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Custo (€)</FormLabel>
                          <FormControl>
                                <NumberInput
                                  value={toNumberValue(field.value)}
                                  onValueChange={(nextValue) => field.onChange(nextValue)}
                                  onBlur={field.onBlur}
                                  name={field.name}
                                  ref={field.ref}
                                  className={TEXT_INPUT_CLASS}
                                  step={0.01}
                                  min={0}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name='despesasIncluidas'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Despesas Incluídas (€)</FormLabel>
                          <FormControl>
                                <NumberInput
                                  value={toNumberValue(field.value)}
                                  onValueChange={(nextValue) => field.onChange(nextValue)}
                                  onBlur={field.onBlur}
                                  name={field.name}
                                  ref={field.ref}
                                  className={TEXT_INPUT_CLASS}
                                  step={0.01}
                                  min={0}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                    <FormField
                      control={form.control}
                      name='entidadeFornecedoraTipo'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tipo de entidade fornecedora</FormLabel>
                          <FormControl>
                            <ToggleGroup
                              type='single'
                              value={field.value}
                              onValueChange={(value) => {
                                if (!value) {
                                  field.onChange('')
                                  return
                                }
                                field.onChange(value === field.value ? '' : value)
                              }}
                              className='flex w-full gap-2'
                            >
                              <ToggleGroupItem
                                value='fornecedor'
                                className='flex-1 rounded-md border border-input bg-background px-4 py-3 text-sm data-[state=on]:border-primary data-[state=on]:bg-primary/10 data-[state=on]:text-primary'
                              >
                                Fornecedor
                              </ToggleGroupItem>
                              <ToggleGroupItem
                                value='terceiro'
                                className='flex-1 rounded-md border border-input bg-background px-4 py-3 text-sm data-[state=on]:border-primary data-[state=on]:bg-primary/10 data-[state=on]:text-primary'
                              >
                                Outros Devedores/Credores
                              </ToggleGroupItem>
                            </ToggleGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {!entidadeFornecedoraTipo ? (
                      <FormItem>
                        <FormLabel className='sr-only'>Entidade Fornecedora</FormLabel>
                        <FormControl>
                          <Input
                            disabled
                            placeholder='Selecione a Entidade Fornecedora'
                            className={`${TEXT_INPUT_CLASS} cursor-not-allowed`}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    ) : null}
                    {entidadeFornecedoraTipo === 'fornecedor' ? (
                      <FormField
                        control={form.control}
                        name='fornecedorId'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='sr-only'>Fornecedor</FormLabel>
                            <FormControl>
                              <div className='relative'>
                                <Autocomplete
                                  options={selectOptions.fornecedores}
                                  value={field.value}
                                  onValueChange={field.onChange}
                                  placeholder={placeholder(
                                    selectLoading.fornecedores,
                                    'o fornecedor'
                                  )}
                                  disabled={selectLoading.fornecedores}
                                  className={SELECT_WITH_ACTIONS_CLASS}
                                />
                                <div className='absolute right-12 top-1/2 -translate-y-1/2 flex gap-1'>
                                  <Button
                                    type='button'
                                    variant='outline'
                                    size='sm'
                                    onClick={handleViewFornecedor}
                                    className='h-8 w-8 p-0'
                                    title='Ver Fornecedor'
                                    disabled={!field.value}
                                  >
                                    <Eye className='h-4 w-4' />
                                  </Button>
                                  <Button
                                    type='button'
                                    variant='outline'
                                    size='sm'
                                    onClick={handleCreateFornecedor}
                                    className='h-8 w-8 p-0'
                                    title='Criar Fornecedor'
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
                    ) : null}
                    {entidadeFornecedoraTipo === 'terceiro' ? (
                      <FormField
                        control={form.control}
                        name='terceiroId'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='sr-only'>Outros Devedores/Credores</FormLabel>
                            <FormControl>
                              <div className='relative'>
                                <Autocomplete
                                  options={selectOptions.terceiros}
                                  value={field.value}
                                  onValueChange={field.onChange}
                                  placeholder={placeholder(
                                    selectLoading.terceiros,
                                    'o outro devedor/credor'
                                  )}
                                  disabled={selectLoading.terceiros}
                                  className={SELECT_WITH_ACTIONS_CLASS}
                                />
                                <div className='absolute right-12 top-1/2 -translate-y-1/2 flex gap-1'>
                                  <Button
                                    type='button'
                                    variant='outline'
                                    size='sm'
                                    onClick={handleViewTerceiro}
                                    className='h-8 w-8 p-0'
                                    title='Ver Outros Devedores/Credores'
                                    disabled={!field.value}
                                  >
                                    <Eye className='h-4 w-4' />
                                  </Button>
                                  <Button
                                    type='button'
                                    variant='outline'
                                    size='sm'
                                    onClick={handleCreateTerceiro}
                                    className='h-8 w-8 p-0'
                                    title='Criar Outros Devedores/Credores'
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
                    ) : null}
                    </FormSection>

                    <FormSection
                      icon={combustivelSectionIcon}
                      title={combustivelSectionTitle}
                      description={combustivelSectionDescription}
                    >
                      <div className={combustivelGridClass}>
                        {showCombustivelFields ? (
                          <FormField
                            control={form.control}
                            name='combustivelId'
                            render={({ field }) => (
                              <FormItem className='sm:col-span-2'>
                                <FormLabel>Combustível</FormLabel>
                                <FormControl>
                                  <div className='relative'>
                                    <Autocomplete
                                      options={selectOptions.combustiveis}
                                      value={field.value}
                                      onValueChange={field.onChange}
                                      placeholder={placeholder(
                                        selectLoading.combustiveis,
                                        'o combustível'
                                      )}
                                      disabled={selectLoading.combustiveis || !motorizacaoSelecionada}
                                      className={SELECT_WITH_ACTIONS_CLASS}
                                    />
                                    <div className='absolute right-12 top-1/2 -translate-y-1/2 flex gap-1'>
                                      <Button
                                        type='button'
                                        variant='outline'
                                        size='sm'
                                        onClick={handleViewCombustivel}
                                        className='h-8 w-8 p-0'
                                        title='Ver Combustível'
                                        disabled={!field.value || !motorizacaoSelecionada}
                                      >
                                        <Eye className='h-4 w-4' />
                                      </Button>
                                      <Button
                                        type='button'
                                        variant='outline'
                                        size='sm'
                                        onClick={handleCreateCombustivel}
                                        className='h-8 w-8 p-0'
                                        title='Criar Combustível'
                                        disabled={!motorizacaoSelecionada}
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
                        ) : null}
                        <FormField
                          control={form.control}
                          name='consumoMedio'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{consumoMedioLabel}</FormLabel>
                              <FormControl>
                                <NumberInput
                                  value={toNumberValue(field.value)}
                                  onValueChange={(nextValue) => field.onChange(nextValue)}
                                  onBlur={field.onBlur}
                                  name={field.name}
                                  ref={field.ref}
                                  className={TEXT_INPUT_CLASS}
                                  step={0.1}
                                  min={0}
                                  disabled={!motorizacaoSelecionada}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        {showElectricFields ? (
                          <FormField
                            control={form.control}
                            name='autonomia'
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Autonomia (km)</FormLabel>
                                <FormControl>
                                  <NumberInput
                                    value={toNumberValue(field.value)}
                                    onValueChange={(nextValue) => field.onChange(nextValue)}
                                    onBlur={field.onBlur}
                                    name={field.name}
                                    ref={field.ref}
                                    className={TEXT_INPUT_CLASS}
                                    step={1}
                                    min={0}
                                    disabled={!motorizacaoSelecionada}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        ) : null}
                      </div>
                    </FormSection>
                  </div>

                  <div className='grid gap-6 lg:grid-cols-2'>
                    <FormSection
                      icon={Fingerprint}
                      title='Identificação mecânica'
                      description='Identificadores únicos gravados na viatura'
                    >
                      <div className={identificacaoMecanicaGridClass}>
                    <FormField
                      control={form.control}
                      name='nQuadro'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nº de Quadro</FormLabel>
                          <FormControl>
                                <NumberInput
                                  value={toNumberValue(field.value)}
                                  onValueChange={(nextValue) => field.onChange(nextValue)}
                                  onBlur={field.onBlur}
                                  name={field.name}
                                  ref={field.ref}
                                  className={TEXT_INPUT_CLASS}
                                  min={0}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name='nMotor'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {isElectricPropulsion ? 'Nº de Motor Elétrico' : 'Nº de Motor'}
                          </FormLabel>
                          <FormControl>
                                <NumberInput
                                  value={toNumberValue(field.value)}
                                  onValueChange={(nextValue) => field.onChange(nextValue)}
                                  onBlur={field.onBlur}
                                  name={field.name}
                                  ref={field.ref}
                                  className={TEXT_INPUT_CLASS}
                                  min={0}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                      </div>
                    </FormSection>

                    <FormSection
                      icon={motorSectionIcon}
                      title={motorSectionTitle}
                      description={motorSectionDescription}
                    >
                      <div className='grid gap-4 sm:grid-cols-2'>
                        {showCombustivelFields ? (
                          <FormField
                            control={form.control}
                            name='cilindrada'
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Cilindrada (cm³)</FormLabel>
                                <FormControl>
                                  <NumberInput
                                    value={toNumberValue(field.value)}
                                    onValueChange={(nextValue) => field.onChange(nextValue)}
                                    onBlur={field.onBlur}
                                    name={field.name}
                                    ref={field.ref}
                                    className={TEXT_INPUT_CLASS}
                                    step={0.1}
                                    min={0}
                                    disabled={!motorizacaoSelecionada}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        ) : null}
                        <FormField
                          control={form.control}
                          name='potencia'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{potenciaLabel}</FormLabel>
                              <FormControl>
                                <NumberInput
                                  value={toNumberValue(field.value)}
                                  onValueChange={(nextValue) => field.onChange(nextValue)}
                                  onBlur={field.onBlur}
                                  name={field.name}
                                  ref={field.ref}
                                  className={TEXT_INPUT_CLASS}
                                  min={0}
                                  disabled={!motorizacaoSelecionada}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        {showElectricFields ? (
                          <FormField
                            control={form.control}
                            name='capacidadeBateria'
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Capacidade da Bateria (kWh)</FormLabel>
                                <FormControl>
                                  <NumberInput
                                    value={toNumberValue(field.value)}
                                    onValueChange={(nextValue) => field.onChange(nextValue)}
                                    onBlur={field.onBlur}
                                    name={field.name}
                                    ref={field.ref}
                                    className={TEXT_INPUT_CLASS}
                                    step={0.1}
                                    min={0}
                                    disabled={!motorizacaoSelecionada}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        ) : null}
                      </div>
                    </FormSection>
                  </div>

                  <div className='grid gap-6 lg:grid-cols-2'>
                    <FormSection
                      icon={Package}
                      title='Capacidades operacionais'
                      description='Pesos e capacidades máximas autorizadas'
                    >
                      <div className='grid gap-4 sm:grid-cols-3'>
                    <FormField
                      control={form.control}
                      name='tara'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tara (kg)</FormLabel>
                          <FormControl>
                                <NumberInput
                                  value={toNumberValue(field.value)}
                                  onValueChange={(nextValue) => field.onChange(nextValue)}
                                  onBlur={field.onBlur}
                                  name={field.name}
                                  ref={field.ref}
                                  className={TEXT_INPUT_CLASS}
                                  min={0}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name='lotacao'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Lotação</FormLabel>
                          <FormControl>
                                <NumberInput
                                  value={toNumberValue(field.value)}
                                  onValueChange={(nextValue) => field.onChange(nextValue)}
                                  onBlur={field.onBlur}
                                  name={field.name}
                                  ref={field.ref}
                                  className={TEXT_INPUT_CLASS}
                                  min={0}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name='cargaUtil'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Carga Útil (kg)</FormLabel>
                          <FormControl>
                                <NumberInput
                                  value={toNumberValue(field.value)}
                                  onValueChange={(nextValue) => field.onChange(nextValue)}
                                  onBlur={field.onBlur}
                                  name={field.name}
                                  ref={field.ref}
                                  className={TEXT_INPUT_CLASS}
                                  min={0}
                                />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                      </div>
                    </FormSection>

                    <FormSection
                      icon={Ruler}
                      title='Dimensões exteriores'
                      description='Medidas principais do chassis'
                    >
                      <div className='grid gap-4 sm:grid-cols-2'>
                    <FormField
                      control={form.control}
                      name='comprimento'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Comprimento (mm)</FormLabel>
                          <FormControl>
                                <NumberInput
                                  value={toNumberValue(field.value)}
                                  onValueChange={(nextValue) => field.onChange(nextValue)}
                                  onBlur={field.onBlur}
                                  name={field.name}
                                  ref={field.ref}
                                  className={TEXT_INPUT_CLASS}
                                  min={0}
                                />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name='largura'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Largura (mm)</FormLabel>
                          <FormControl>
                                <NumberInput
                                  value={toNumberValue(field.value)}
                                  onValueChange={(nextValue) => field.onChange(nextValue)}
                                  onBlur={field.onBlur}
                                  name={field.name}
                                  ref={field.ref}
                                  className={TEXT_INPUT_CLASS}
                                  min={0}
                                />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                    </FormSection>
                  </div>

                  <div className='grid gap-6 lg:grid-cols-2'>
                    <FormSection
                      icon={CircleDot}
                      title='Configuração de pneus'
                      description='Registe as referências dos pneus dianteiros e traseiros'
                    >
                      <div className='grid gap-4 sm:grid-cols-2'>
                    <FormField
                      control={form.control}
                      name='pneusFrente'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Pneus Frente</FormLabel>
                          <FormControl>
                            <Input
                              placeholder='Referência dos pneus dianteiros'
                              {...field}
                                  className={TEXT_INPUT_CLASS}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name='pneusTras'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Pneus Traseiros</FormLabel>
                          <FormControl>
                            <Input
                              placeholder='Referência dos pneus traseiros'
                              {...field}
                                  className={TEXT_INPUT_CLASS}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                    </FormSection>

                    <FormSection
                      icon={CheckSquare}
                      title='Utilização comercial'
                      description='Assinale as utilizações específicas desta viatura'
                    >
                      <div className='grid gap-4 sm:grid-cols-2'>
                    <FormField
                      control={form.control}
                      name='marketing'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Marketing</FormLabel>
                          <FormControl>
                            <div className='flex items-center justify-between rounded-lg border border-input bg-background px-4 py-3 shadow-inner drop-shadow-xl'>
                              <span className='text-sm text-muted-foreground'>
                                {field.value ? 'Sim' : 'Não'}
                              </span>
                              <Switch checked={field.value} onCheckedChange={field.onChange} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name='mercadorias'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mercadorias</FormLabel>
                          <FormControl>
                            <div className='flex items-center justify-between rounded-lg border border-input bg-background px-4 py-3 shadow-inner drop-shadow-xl'>
                              <span className='text-sm text-muted-foreground'>
                                {field.value ? 'Sim' : 'Não'}
                              </span>
                              <Switch checked={field.value} onCheckedChange={field.onChange} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                      </div>
                    </FormSection>
                  </div>
                </CardContent>
              </Card>
            </div>
          </PersistentTabsContent>

          {/* Locação */}
          <PersistentTabsContent value='locacao'>
            <div className='space-y-6'>
              <Card className='overflow-hidden border-l-4 border-l-primary/20 transition-all duration-200 hover:border-l-primary/40 hover:shadow-md'>
                <CardHeader className='pb-4'>
                  <div className='flex items-center gap-3'>
                    <div className='flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary'>
                      <Building2 className='h-4 w-4' />
                    </div>
                    <div>
                      <CardTitle className='flex items-center gap-2 text-base'>
                        Locação
                      </CardTitle>
                      <p className='mt-1 text-sm text-muted-foreground'>
                        Indique os dados do contrato de locação da viatura
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className='space-y-8'>
                  <FormSection
                    icon={FileText}
                    title='Contrato de locação'
                    description='Preencha a referência, entidade fornecedora e datas do contrato'
                  >
                    <div className='grid gap-4 md:grid-cols-2'>
                      <FormField
                        control={form.control}
                        name='contrato'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nº de Contrato</FormLabel>
                            <FormControl>
                              <Input
                                placeholder='Referência do contrato'
                                {...field}
                                className={TEXT_INPUT_CLASS}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name='valorTotalContrato'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Valor Total do Contrato (€)</FormLabel>
                            <FormControl>
                              <NumberInput
                                value={toNumberValue(field.value)}
                                onValueChange={(nextValue) => field.onChange(nextValue)}
                                onBlur={field.onBlur}
                                name={field.name}
                                ref={field.ref}
                                className={TEXT_INPUT_CLASS}
                                step={0.01}
                                min={0}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name='fornecedorId'
                        render={({ field }) => (
                          <FormItem className='md:col-span-2'>
                            <FormLabel>Fornecedor</FormLabel>
                            <FormControl>
                              <div className='relative'>
                                <Autocomplete
                                  options={selectOptions.fornecedores}
                                  value={field.value}
                                  onValueChange={field.onChange}
                                  placeholder={placeholder(
                                    selectLoading.fornecedores,
                                    'o fornecedor'
                                  )}
                                  disabled={selectLoading.fornecedores}
                                  className={SELECT_WITH_ACTIONS_CLASS}
                                />
                                <div className='absolute right-12 top-1/2 -translate-y-1/2 flex gap-1'>
                                  <Button
                                    type='button'
                                    variant='outline'
                                    size='sm'
                                    onClick={handleViewFornecedor}
                                    className='h-8 w-8 p-0'
                                    title='Ver Fornecedor'
                                    disabled={!field.value}
                                  >
                                    <Eye className='h-4 w-4' />
                                  </Button>
                                  <Button
                                    type='button'
                                    variant='outline'
                                    size='sm'
                                    onClick={handleCreateFornecedor}
                                    className='h-8 w-8 p-0'
                                    title='Criar Fornecedor'
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
                        name='dataInicial'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Data Inicial</FormLabel>
                            <FormControl>
                              <DatePicker
                                value={field.value || undefined}
                                onChange={field.onChange}
                                placeholder='Selecione a data inicial'
                                className={FIELD_HEIGHT_CLASS}
                                allowClear
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
                                onChange={field.onChange}
                                placeholder='Selecione a data final'
                                className={FIELD_HEIGHT_CLASS}
                                allowClear
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </FormSection>

                  <FormSection
                    icon={PiggyBank}
                    title='Condições financeiras'
                    description='Detalhes de rendas, opção de compra e valor residual'
                  >
                    <div className='grid gap-4 md:grid-cols-3'>
                      <FormField
                        control={form.control}
                        name='opcaoCompra'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Opção de Compra</FormLabel>
                            <FormControl>
                              <div className='flex items-center justify-between rounded-lg border border-input bg-background px-4 py-3 shadow-inner drop-shadow-xl'>
                                <span className='text-sm text-muted-foreground'>
                                  {field.value ? 'Disponível' : 'Não disponível'}
                                </span>
                                <Switch checked={field.value} onCheckedChange={field.onChange} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name='nRendas'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nº de Rendas</FormLabel>
                            <FormControl>
                              <NumberInput
                                value={toNumberValue(field.value)}
                                onValueChange={(nextValue) => field.onChange(nextValue)}
                                onBlur={field.onBlur}
                                name={field.name}
                                ref={field.ref}
                                className={TEXT_INPUT_CLASS}
                                min={0}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name='valorRenda'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Valor da Renda (€)</FormLabel>
                            <FormControl>
                              <NumberInput
                                value={toNumberValue(field.value)}
                                onValueChange={(nextValue) => field.onChange(nextValue)}
                                onBlur={field.onBlur}
                                name={field.name}
                                ref={field.ref}
                                className={TEXT_INPUT_CLASS}
                                step={0.01}
                                min={0}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  <FormField
                    control={form.control}
                    name='valorResidual'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Valor Residual Estimado (€)</FormLabel>
                        <FormControl>
                              <NumberInput
                                value={toNumberValue(field.value)}
                                onValueChange={(nextValue) => field.onChange(nextValue)}
                                onBlur={field.onBlur}
                                name={field.name}
                                ref={field.ref}
                                className={TEXT_INPUT_CLASS}
                                step={0.01}
                                min={0}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                    </FormSection>
                </CardContent>
              </Card>
            </div>
          </PersistentTabsContent>

          {/* Inspeções */}
          <PersistentTabsContent value='inspecoes'>
            <div className='space-y-6'>
              <Card className='overflow-hidden border-l-4 border-l-primary/20 transition-all duration-200 hover:border-l-primary/40 hover:shadow-md'>
                <CardHeader className='pb-4'>
                  <div className='flex items-center gap-3'>
                    <div className='flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary'>
                      <ClipboardCheckIcon className='h-4 w-4' />
                    </div>
                    <div>
                      <CardTitle className='flex items-center gap-2 text-base'>
                        Registo de Inspeções
                      </CardTitle>
                      <p className='mt-1 text-sm text-muted-foreground'>
                        Guarde o histórico das inspeções obrigatórias desta viatura.
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className='space-y-6'>
                  <div className='flex flex-col gap-3 md:flex-row md:items-center md:justify-between'>
                    <p className='text-sm text-muted-foreground'>
                      Adicione cada inspeção com a data realizada, resultado e agende a próxima data.
                    </p>
                    <Button
                      type='button'
                      variant='secondary'
                      size='default'
                      className='md:min-w-[220px]'
                      onClick={handleAddInspection}
                    >
                      Adicionar inspeção
                    </Button>
                  </div>
                  {inspectionFields.length === 0 ? (
                    <div className='rounded-xl border border-dashed border-border/70 bg-muted/5 p-6 text-center shadow-inner'>
                      <div className='mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary'>
                        <ClipboardCheckIcon className='h-6 w-6' />
                      </div>
                      <h4 className='mt-4 text-sm font-semibold text-foreground'>Sem inspeções registadas</h4>
                      <p className='mt-2 text-sm text-muted-foreground'>
                        Registe cada inspeção obrigatória para manter o histórico completo desta viatura.
                      </p>
                    </div>
                  ) : (
                    <div className='space-y-4 rounded-xl border border-border/60 bg-muted/10 p-4 shadow-inner sm:p-5'>
                      <div className='flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'>
                        <div className='flex items-center gap-2 text-sm font-semibold text-foreground'>
                          <ClipboardCheckIcon className='h-4 w-4 text-primary' />
                          Inspeções registadas
                          <Badge variant='secondary' className='rounded-full px-2 py-0 text-xs'>
                            {inspectionFields.length}
                          </Badge>
                        </div>
                        <p className='text-xs text-muted-foreground'>
                          Edite as informações conforme necessário e remova inspeções que já não sejam relevantes.
                        </p>
                      </div>

                      <div className='space-y-4'>
                        {inspectionFields.map((inspection, index) => {
                          const inspectionData = inspecoesValues?.[index]
                          const inspeccaoRealizada = formatDateLabel(inspectionData?.dataInspecao)
                          const proximaInspecao = formatDateLabel(inspectionData?.dataProximaInspecao)

                          return (
                            <div
                              key={inspection.fieldId}
                              className='group space-y-5 rounded-lg border border-border/70 bg-background p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-md md:p-5'
                            >
                              <div className='flex flex-col gap-3 border-b border-border/60 pb-4 sm:flex-row sm:items-center sm:justify-between'>
                                <div className='flex items-center gap-3'>
                                  <div className='flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary'>
                                    <CircleDot className='h-5 w-5' />
                                  </div>
                                  <div>
                                    <p className='text-sm font-semibold text-foreground'>
                                      Inspeção #{index + 1}
                                    </p>
                                    <p className='text-xs text-muted-foreground'>
                                      {inspeccaoRealizada
                                        ? `Realizada em ${inspeccaoRealizada}.`
                                        : 'Data de realização ainda não definida.'}
                                    </p>
                                  </div>
                                </div>
                                <Badge
                                  variant='outline'
                                  className={cn(
                                    'inline-flex items-center gap-1 rounded-full border-primary/30 bg-primary/5 px-3 py-[3px] text-[11px] font-medium text-primary',
                                    !proximaInspecao && 'border-destructive/30 bg-destructive/5 text-destructive'
                                  )}
                                >
                                  <CalendarDays className='h-3.5 w-3.5' />
                                  {proximaInspecao ? `Próxima: ${proximaInspecao}` : 'Próxima inspeção por agendar'}
                                </Badge>
                              </div>

                              <div className='grid gap-4 md:grid-cols-[repeat(3,minmax(0,1fr))]'>
                                <FormField
                                  control={form.control}
                                  name={`inspecoes.${index}.dataInspecao`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Data da inspeção</FormLabel>
                                      <FormControl>
                                        <DatePicker
                                          value={field.value || undefined}
                                          onChange={field.onChange}
                                          allowClear
                                          className={FIELD_HEIGHT_CLASS}
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                <FormField
                                  control={form.control}
                                  name={`inspecoes.${index}.resultado`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Resultado</FormLabel>
                                      <FormControl>
                                        <Input
                                          {...field}
                                          placeholder='Ex.: Aprovado, Reprovado, Com observações'
                                          className={TEXT_INPUT_CLASS}
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                <FormField
                                  control={form.control}
                                  name={`inspecoes.${index}.dataProximaInspecao`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Próxima inspeção</FormLabel>
                                      <FormControl>
                                        <DatePicker
                                          value={field.value || undefined}
                                          onChange={field.onChange}
                                          allowClear
                                          className={FIELD_HEIGHT_CLASS}
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>

                              <div className='flex justify-end'>
                                <Button
                                  type='button'
                                  variant='ghost'
                                  size='sm'
                                  onClick={() => handleRemoveInspection(index)}
                                  className='text-destructive hover:text-destructive'
                                >
                                  <Trash2 className='mr-2 h-4 w-4' />
                                  Remover inspeção
                                </Button>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </PersistentTabsContent>

          {/* Seguros */}
          <PersistentTabsContent value='seguros'>
            <div className='space-y-6'>
              <Card className='overflow-hidden border-l-4 border-l-primary/20 transition-all duration-200 hover:border-l-primary/40 hover:shadow-md'>
                <CardHeader className='pb-4'>
                  <div className='flex items-center gap-3'>
                    <div className='flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary'>
                      <ShieldCheck className='h-4 w-4' />
                    </div>
                    <div>
                      <CardTitle className='flex items-center gap-2 text-base'>
                        Seguros e Obrigações
                      </CardTitle>
                      <p className='mt-1 text-sm text-muted-foreground'>
                        Associe o seguro e dados fiscais
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className='space-y-6'>
                  <FormField
                    control={form.control}
                    name='seguroIds'
                    render={() => (
                      <FormItem>
                        <FormLabel>Seguros</FormLabel>
                        <FormControl>
                          <div className='space-y-4'>
                            <div className='flex flex-col gap-3 md:flex-row md:items-center md:gap-4'>
                              <div className='w-full md:flex-1'>
                                <div className='relative'>
                                  <Autocomplete
                                    options={selectOptions.seguros}
                                    value={selectedSeguroId}
                                    onValueChange={setSelectedSeguroId}
                                    placeholder={placeholder(selectLoading.seguros, 'o seguro')}
                                    disabled={selectLoading.seguros}
                                    className={SELECT_WITH_ACTIONS_CLASS}
                                  />
                                  <div className='absolute right-12 top-1/2 -translate-y-1/2 flex gap-1'>
                                    <Button
                                      type='button'
                                      variant='outline'
                                      size='sm'
                                      onClick={() => handleViewSeguro(selectedSeguroId)}
                                      title='Ver Seguro'
                                      disabled={!selectedSeguroId}
                                      className='h-8 w-8 p-0'
                                    >
                                      <Eye className='h-4 w-4' />
                                    </Button>
                                    <Button
                                      type='button'
                                      variant='outline'
                                      size='sm'
                                      onClick={handleCreateSeguro}
                                      title='Criar Seguro'
                                      className='h-8 w-8 p-0'
                                    >
                                      <Plus className='h-4 w-4' />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                              <Button
                                type='button'
                                variant='secondary'
                                size='default'
                                className='w-full md:w-auto md:min-w-[160px] md:flex-shrink-0 h-12'
                                onClick={handleAddSeguro}
                                disabled={!selectedSeguroId}
                              >
                                Adicionar
                              </Button>
                            </div>
                            {segurosSelecionadosDetalhes.length > 0 ? (
                              <div className='space-y-4 rounded-xl border border-border/60 bg-muted/10 p-4 shadow-inner sm:p-5'>
                                <div className='flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'>
                                  <div className='flex items-center gap-2 text-sm font-semibold text-foreground'>
                                    <ShieldCheck className='h-4 w-4 text-primary' />
                                    Seguros associados
                                    <Badge variant='secondary' className='rounded-full px-2 py-0 text-xs'>
                                      {segurosSelecionadosDetalhes.length}
                                    </Badge>
                                  </div>
                                  <p className='text-xs text-muted-foreground'>
                                    Confirme os seguros em vigor e visualize detalhes sempre que necessário.
                                  </p>
                                </div>

                                <div className='grid gap-3 md:grid-cols-2 xl:grid-cols-3'>
                                  {segurosSelecionadosDetalhes.map(({ id, label }) => {
                                    const seguroIndisponivel = label === 'Seguro indisponível'
                                    return (
                                      <div
                                        key={id}
                                        className='group flex h-full flex-col justify-between gap-4 rounded-lg border border-border/70 bg-background p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-md'
                                      >
                                        <div className='flex items-start gap-3'>
                                          <div className='flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary'>
                                            <ShieldCheck className='h-5 w-5' />
                                          </div>
                                          <div className='min-w-0 space-y-1'>
                                            <div className='flex items-start justify-between gap-2'>
                                              <p className='truncate text-sm font-medium text-foreground'>{label}</p>
                                              {seguroIndisponivel && (
                                                <Badge
                                                  variant='outline'
                                                  className='inline-flex items-center rounded-full border-destructive/30 bg-destructive/10 px-2 py-[2px] text-[11px] font-medium text-destructive'
                                                >
                                                  Indisponível
                                                </Badge>
                                              )}
                                            </div>
                                            <p className='text-xs text-muted-foreground'>
                                              {seguroIndisponivel
                                                ? 'Este seguro já não está disponível. Considere removê-lo da viatura.'
                                                : 'Seguro associado com sucesso.'}
                                            </p>
                                          </div>
                                        </div>
                                        <div className='flex flex-wrap justify-end gap-2'>
                                          <Button
                                            type='button'
                                            variant='outline'
                                            size='sm'
                                            onClick={() => handleViewSeguro(id)}
                                            title='Ver Seguro'
                                            disabled={seguroIndisponivel}
                                            className={cn(
                                              'gap-2',
                                              seguroIndisponivel && 'pointer-events-none opacity-60'
                                            )}
                                          >
                                            <Eye className='h-4 w-4' />
                                            Ver
                                          </Button>
                                          <Button
                                            type='button'
                                            variant='ghost'
                                            size='sm'
                                            onClick={() => handleRemoveSeguro(id)}
                                            title='Remover Seguro'
                                            className='text-destructive hover:text-destructive'
                                          >
                                            <Trash2 className='mr-2 h-4 w-4' />
                                            Remover
                                          </Button>
                                        </div>
                                      </div>
                                    )
                                  })}
                                </div>
                              </div>
                            ) : (
                              <div className='rounded-xl border border-dashed border-border/70 bg-muted/5 p-6 text-center shadow-inner'>
                                <div className='mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary'>
                                  <ShieldCheck className='h-6 w-6' />
                                </div>
                                <h4 className='mt-4 text-sm font-semibold text-foreground'>Sem seguros associados</h4>
                                <p className='mt-2 text-sm text-muted-foreground'>
                                  Adicione um seguro à viatura para manter o registo de apólices sempre atualizado.
                                </p>
                              </div>
                            )}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>
          </PersistentTabsContent>

          {/* Notas */}
          <PersistentTabsContent value='notas'>
            <div className='space-y-6'>
              <Card className='overflow-hidden border-l-4 border-l-primary/20 transition-all duration-200 hover:border-l-primary/40 hover:shadow-md'>
                <CardHeader className='pb-4'>
                  <div className='flex items-center gap-3'>
                    <div className='flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary'>
                      <FileText className='h-4 w-4' />
                    </div>
                    <div>
                      <CardTitle className='flex items-center gap-2 text-base'>
                        Notas, Fiscalidade e Documentação
                      </CardTitle>
                      <p className='mt-1 text-sm text-muted-foreground'>
                        Registe observações, dados fiscais e evidências visuais
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className='space-y-8'>
                  <FormSection
                    icon={StickyNote}
                    title='Notas adicionais'
                    description='Registe observações relevantes sobre a viatura'
                  >
                    <FormField
                      control={form.control}
                      name='notasAdicionais'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Notas Adicionais</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder='Registe notas relevantes sobre a viatura'
                              rows={5}
                              {...field}
                              className='shadow-inner drop-shadow-xl'
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </FormSection>

                  <div className='grid gap-6 lg:grid-cols-2'>
                    <FormSection
                      icon={Stamp}
                      title='Fiscalidade e cartões'
                      description='Dados de impostos e cartão de combustível associados'
                    >
                      <div className='grid gap-4 sm:grid-cols-2'>
                    <FormField
                      control={form.control}
                      name='anoImpostoSelo'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ano Imposto de Selo</FormLabel>
                          <FormControl>
                                <NumberInput
                                  value={toNumberValue(field.value)}
                                  onValueChange={(nextValue) => field.onChange(nextValue)}
                                  onBlur={field.onBlur}
                                  name={field.name}
                                  ref={field.ref}
                                  className={TEXT_INPUT_CLASS}
                                  min={1900}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name='anoImpostoCirculacao'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ano Imposto Circulação</FormLabel>
                          <FormControl>
                                <NumberInput
                                  value={toNumberValue(field.value)}
                                  onValueChange={(nextValue) => field.onChange(nextValue)}
                                  onBlur={field.onBlur}
                                  name={field.name}
                                  ref={field.ref}
                                  className={TEXT_INPUT_CLASS}
                                  min={1900}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                          name='cartaoCombustivel'
                      render={({ field }) => (
                        <FormItem>
                              <FormLabel>Cartão Combustível</FormLabel>
                          <FormControl>
                                <Input
                                  placeholder='Número ou identificação do cartão'
                                  {...field}
                                  className={TEXT_INPUT_CLASS}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  <FormField
                    control={form.control}
                          name='dataValidadeSelo'
                    render={({ field }) => (
                      <FormItem>
                              <FormLabel>Data Validade</FormLabel>
                        <FormControl>
                          <DatePicker
                            value={field.value || undefined}
                            onChange={field.onChange}
                            placeholder='Selecione a data de validade'
                            className={FIELD_HEIGHT_CLASS}
                            allowClear
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                      </div>
                    </FormSection>

                    <FormSection
                      icon={FolderOpen}
                      title='Documentação'
                      description='Anexe documentos, imagens e ficheiros relevantes'
                    >
                      <FormField
                        control={form.control}
                        name='documentos'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Documentos anexados</FormLabel>
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

          {/* Garantias */}
          <PersistentTabsContent value='garantias'>
            <div className='space-y-6'>
              <Card className='overflow-hidden border-l-4 border-l-primary/20 transition-all duration-200 hover:border-l-primary/40 hover:shadow-md'>
                <CardHeader className='pb-4'>
                  <div className='flex items-center gap-3'>
                    <div className='flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary'>
                      <ShieldPlus className='h-4 w-4' />
                    </div>
                    <div>
                      <CardTitle className='flex items-center gap-2 text-base'>
                        Garantias
                      </CardTitle>
                      <p className='mt-1 text-sm text-muted-foreground'>
                        Associe garantias contratuais aplicáveis à viatura
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className='space-y-6'>
                  <FormField
                    control={form.control}
                    name='garantiaIds'
                    render={() => (
                      <FormItem>
                        <FormLabel>Garantia</FormLabel>
                        <FormControl>
                          <div className='space-y-4'>
                            <div className='flex flex-col gap-3 md:flex-row md:items-center md:gap-4'>
                              <div className='flex flex-col gap-2 md:flex-row md:items-center md:gap-2 md:flex-1'>
                                <div className='w-full md:flex-1'>
                                  <div className='relative'>
                                    <Autocomplete
                                      options={selectOptions.garantias}
                                      value={selectedGarantiaId}
                                      onValueChange={setSelectedGarantiaId}
                                      placeholder={placeholder(
                                        selectLoading.garantias,
                                        'a garantia'
                                      )}
                                      disabled={selectLoading.garantias}
                                      className={SELECT_WITH_ACTIONS_CLASS}
                                    />
                                    <div className='absolute right-12 top-1/2 -translate-y-1/2 flex gap-1'>
                                      <Button
                                        type='button'
                                        variant='outline'
                                        size='sm'
                                        onClick={() => handleViewGarantia(selectedGarantiaId)}
                                        title='Ver Garantia'
                                        disabled={!selectedGarantiaId}
                                        className='h-8 w-8 p-0'
                                      >
                                        <Eye className='h-4 w-4' />
                                      </Button>
                                      <Button
                                        type='button'
                                        variant='outline'
                                        size='sm'
                                        onClick={handleCreateGarantia}
                                        title='Criar nova garantia'
                                        className='h-8 w-8 p-0'
                                      >
                                        <Plus className='h-4 w-4' />
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                                <Button
                                  type='button'
                                  variant='secondary'
                                  size='default'
                                  className='w-full md:w-auto md:min-w-[160px] md:flex-shrink-0 h-12'
                                  onClick={handleAddGarantia}
                                  disabled={!selectedGarantiaId}
                                >
                                  Adicionar
                                </Button>
                              </div>
                            </div>
                            {garantiasSelecionadasDetalhes.length > 0 ? (
                              <div className='space-y-4 rounded-xl border border-border/60 bg-muted/10 p-4 shadow-inner sm:p-5'>
                                <div className='flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'>
                                  <div className='flex items-center gap-2 text-sm font-semibold text-foreground'>
                                    <ShieldCheck className='h-4 w-4 text-primary' />
                                    Garantias selecionadas
                                    <Badge variant='secondary' className='rounded-full px-2 py-0 text-xs'>
                                      {garantiasSelecionadasDetalhes.length}
                                    </Badge>
                                  </div>
                                  <p className='text-xs text-muted-foreground'>
                                    Revise as garantias associadas antes de concluir o registo da viatura.
                                  </p>
                                </div>

                                <div className='grid gap-3 md:grid-cols-2 xl:grid-cols-3'>
                                  {garantiasSelecionadasDetalhes.map(({ id, label }) => {
                                    const garantiaIndisponivel = label === 'Garantia indisponível'
                                    return (
                                      <div
                                        key={id}
                                        className='group flex h-full flex-col justify-between gap-3 rounded-lg border border-border/70 bg-background p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-md'
                                      >
                                        <div className='flex items-start gap-3'>
                                          <div className='flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary'>
                                            <ShieldCheck className='h-5 w-5' />
                                          </div>
                                          <div className='min-w-0 space-y-1'>
                                            <div className='flex items-start justify-between gap-2'>
                                              <p className='truncate text-sm font-medium text-foreground'>
                                                {label}
                                              </p>
                                              {garantiaIndisponivel && (
                                                <Badge
                                                  variant='outline'
                                                  className='inline-flex items-center rounded-full border-destructive/30 bg-destructive/10 px-2 py-[2px] text-[11px] font-medium text-destructive'
                                                >
                                                  Indisponível
                                                </Badge>
                                              )}
                                            </div>
                                            <p className='text-xs text-muted-foreground'>
                                              {garantiaIndisponivel
                                                ? 'Esta garantia já não está disponível. Considere removê-la.'
                                                : 'Garantia associada à viatura com sucesso.'}
                                            </p>
                                          </div>
                                        </div>
                                        <div className='flex flex-wrap justify-end gap-2'>
                                          <Button
                                            type='button'
                                            variant='outline'
                                            size='sm'
                                            onClick={() => handleViewGarantia(id)}
                                            title='Ver Garantia'
                                            disabled={garantiaIndisponivel}
                                            className={cn(
                                              'gap-2',
                                              garantiaIndisponivel && 'pointer-events-none opacity-60'
                                            )}
                                          >
                                            <Eye className='h-4 w-4' />
                                            Ver
                                          </Button>
                                          <Button
                                            type='button'
                                            variant='ghost'
                                            size='sm'
                                            onClick={() => handleRemoveGarantia(id)}
                                            title='Remover Garantia'
                                            className='text-destructive hover:text-destructive'
                                          >
                                            <Trash2 className='mr-2 h-4 w-4' />
                                            Remover
                                          </Button>
                                        </div>
                                      </div>
                                    )
                                  })}
                                </div>
                              </div>
                            ) : (
                              <div className='rounded-xl border border-dashed border-border/70 bg-muted/5 p-6 text-center shadow-inner'>
                                <div className='mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary'>
                                  <ShieldPlus className='h-6 w-6' />
                                </div>
                                <h4 className='mt-4 text-sm font-semibold text-foreground'>
                                  Sem garantias associadas
                                </h4>
                                <p className='mt-2 text-sm text-muted-foreground'>
                                  Adicione garantias ativas para manter o histórico de cobertura da viatura.
                                </p>
                              </div>
                            )}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>
          </PersistentTabsContent>

          {/* Equipamento */}
          <PersistentTabsContent value='equipamento'>
            <div className='space-y-6'>
              <Card className='overflow-hidden border-l-4 border-l-primary/20 transition-all duration-200 hover:border-l-primary/40 hover:shadow-md'>
                <CardHeader className='pb-4'>
                  <div className='flex items-center gap-3'>
                    <div className='flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary'>
                      <ClipboardList className='h-4 w-4' />
                    </div>
                    <div>
                      <CardTitle className='flex items-center gap-2 text-base'>
                        Equipamento Extra
                      </CardTitle>
                      <p className='mt-1 text-sm text-muted-foreground'>
                        Associe equipamentos adicionais à viatura
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className='space-y-6'>
                  <FormField
                    control={form.control}
                    name='equipamentoIds'
                    render={() => (
                      <FormItem>
                        <FormLabel>Equipamento</FormLabel>
                        <FormControl>
                          <div className='space-y-4'>
                            <div className='flex flex-col gap-3 md:flex-row md:items-center md:gap-4'>
                              <div className='flex flex-col gap-2 md:flex-row md:items-center md:gap-2 md:flex-1'>
                                <div className='w-full md:flex-1'>
                                  <div className='relative'>
                          <Autocomplete
                            options={selectOptions.equipamentos}
                                      value={selectedEquipamentoId}
                                      onValueChange={setSelectedEquipamentoId}
                                      placeholder={placeholder(
                                        selectLoading.equipamentos,
                                        'o equipamento'
                                      )}
                            disabled={selectLoading.equipamentos}
                                      className={SELECT_WITH_ACTIONS_CLASS}
                                    />
                                    <div className='absolute right-12 top-1/2 -translate-y-1/2 flex gap-1'>
                                      <Button
                                        type='button'
                                        variant='outline'
                                        size='sm'
                                        onClick={() => handleViewEquipamento(selectedEquipamentoId)}
                                        title='Ver Equipamento'
                                        disabled={!selectedEquipamentoId}
                                      className='h-8 w-8 p-0'
                                      >
                                        <Eye className='h-4 w-4' />
                                      </Button>
                                      <Button
                                        type='button'
                                        variant='outline'
                                        size='sm'
                                        onClick={handleCreateEquipamento}
                                        title='Criar novo equipamento'
                                      className='h-8 w-8 p-0'
                                      >
                                        <Plus className='h-4 w-4' />
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                                <Button
                                  type='button'
                                  variant='secondary'
                                  size='default'
                                  className='w-full md:w-auto md:min-w-[160px] md:flex-shrink-0 h-12'
                                  onClick={handleAddEquipamento}
                                  disabled={!selectedEquipamentoId}
                                >
                                  Adicionar
                                </Button>
                              </div>
                            </div>
                            {equipamentosSelecionadosDetalhes.length > 0 ? (
                              <div className='space-y-4 rounded-xl border border-border/60 bg-muted/10 p-4 shadow-inner sm:p-5'>
                                <div className='flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'>
                                  <div className='flex items-center gap-2 text-sm font-semibold text-foreground'>
                                    <CheckSquare className='h-4 w-4 text-primary' />
                                    Equipamentos selecionados
                                    <Badge variant='secondary' className='rounded-full px-2 py-0 text-xs'>
                                      {equipamentosSelecionadosDetalhes.length}
                                    </Badge>
                                  </div>
                                  <p className='text-xs text-muted-foreground'>
                                    Revise os equipamentos associados antes de concluir o registo da viatura.
                                  </p>
                                </div>

                                <div className='grid gap-3 md:grid-cols-2 xl:grid-cols-3'>
                                  {equipamentosSelecionadosDetalhes.map(({ id, label }) => {
                                    const equipamentoIndisponivel = label === 'Equipamento indisponível'
                                    return (
                                      <div
                                        key={id}
                                        className='group flex h-full flex-col justify-between gap-3 rounded-lg border border-border/70 bg-background p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-md'
                                      >
                                        <div className='flex items-start gap-3'>
                                          <div className='flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary'>
                                            <Package className='h-5 w-5' />
                                          </div>
                                          <div className='min-w-0 space-y-1'>
                                            <div className='flex items-start justify-between gap-2'>
                                              <p className='truncate text-sm font-medium text-foreground'>
                                                {label}
                                              </p>
                                              {equipamentoIndisponivel && (
                                                <Badge
                                                  variant='outline'
                                                  className='inline-flex items-center rounded-full border-destructive/30 bg-destructive/10 px-2 py-[2px] text-[11px] font-medium text-destructive'
                                                >
                                                  Indisponível
                                                </Badge>
                                              )}
                                            </div>
                                            <p className='text-xs text-muted-foreground'>
                                              {equipamentoIndisponivel
                                                ? 'Este equipamento já não está disponível. Considere removê-lo.'
                                                : 'Equipamento associado à viatura com sucesso.'}
                                            </p>
                                          </div>
                                        </div>
                                        <div className='flex flex-wrap justify-end gap-2'>
                                          <Button
                                            type='button'
                                            variant='outline'
                                            size='sm'
                                            onClick={() => handleViewEquipamento(id)}
                                            title='Ver Equipamento'
                                            disabled={equipamentoIndisponivel}
                                            className={cn(
                                              'gap-2',
                                              equipamentoIndisponivel && 'pointer-events-none opacity-60'
                                            )}
                                          >
                                            <Eye className='h-4 w-4' />
                                            Ver
                                          </Button>
                                          <Button
                                            type='button'
                                            variant='ghost'
                                            size='sm'
                                            onClick={() => handleRemoveEquipamento(id)}
                                            title='Remover Equipamento'
                                            className='text-destructive hover:text-destructive'
                                          >
                                            <Trash2 className='mr-2 h-4 w-4' />
                                            Remover
                                          </Button>
                                        </div>
                                      </div>
                                    )
                                  })}
                                </div>
                              </div>
                            ) : (
                              <div className='rounded-xl border border-dashed border-border/70 bg-muted/5 p-6 text-center shadow-inner'>
                                <div className='mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary'>
                                  <Package className='h-6 w-6' />
                                </div>
                                <h4 className='mt-4 text-sm font-semibold text-foreground'>Sem equipamentos associados</h4>
                                <p className='mt-2 text-sm text-muted-foreground'>
                                  Adicione equipamentos extra à viatura para registar todos os acessórios relevantes.
                                </p>
                              </div>
                            )}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>
          </PersistentTabsContent>
        </PersistentTabs>

        <div className='flex flex-col gap-2 pt-4 md:flex-row md:justify-end'>
          <Button
            type='button'
            variant='outline'
            onClick={onCancel}
            className='w-full md:w-auto'
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button type='submit' className='w-full md:w-auto' disabled={isSubmitting}>
            {isSubmitting ? 'A guardar...' : submitLabel}
          </Button>
        </div>
      </form>
    </Form>
  )
}

export { ViaturaFormContainer }

