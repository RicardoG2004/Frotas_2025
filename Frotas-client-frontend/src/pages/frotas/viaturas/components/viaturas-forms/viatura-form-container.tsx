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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { LicensePlateDisplay } from '@/components/ui/license-plate-display'
import ReactFlagsSelect from 'react-flags-select'
import { countries } from '@/data/countries'
import { formatLicensePlate, getLicensePlateConfig } from '@/data/license-plate-configs'
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
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
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
  Printer,
  Loader2,
  FolderPlus,
  User,
  AlertTriangle,
  ChevronUp,
  Save,
  Clock,
  Camera,
  X,
  Plug,
} from 'lucide-react'
import { toast } from '@/utils/toast-utils'
import { useTabManager } from '@/hooks/use-tab-manager'
import { useSubmitErrorTab } from '@/hooks/use-submit-error-tab'
import { useAutoSelectionWithReturnData } from '@/hooks/use-auto-selection-with-return-data'
import { calcularIUC } from '@/utils/iuc-calculator'
import { calcularProximaInspecao, calcularPrimeiraInspecao } from '@/utils/inspecao-helper'
import type { CategoriaInspecao } from '@/types/dtos/frotas/tipo-viaturas.dtos'
import { mapearDesignacaoParaCategoriaInspecao } from '@/utils/tipo-viatura-helper'
import {
  defaultViaturaFormValues,
  viaturaFormSchema,
  viaturaPropulsaoOptions,
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
import { useGetFuncionariosSelect } from '@/pages/base/funcionarios/queries/funcionarios-queries'
import { useGetConcelhosSelect } from '@/pages/base/concelhos/queries/concelhos-queries'
import { useGetFreguesiasSelect } from '@/pages/base/freguesias/queries/freguesias-queries'
import { useGetCodigosPostaisSelect } from '@/pages/base/codigospostais/queries/codigospostais-queries'
import { useWindowsStore } from '@/stores/use-windows-store'
import { cn } from '@/lib/utils'
import { ViaturasService } from '@/lib/services/frotas/viaturas-service'
import state from '@/states/state'
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
  openFuncionarioCreationWindow,
  openFuncionarioViewWindow,
  createEntityCreationWindow,
  createEntityViewWindow,
} from '@/utils/window-utils'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
} from '@/components/ui/alert-dialog'

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
  funcionarios: AutocompleteOption[]
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
  funcionarios: boolean
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
  hibridoPlugIn: {
    label: 'Híbrido Plug-In',
    description: 'Híbrido com bateria recarregável através de tomada elétrica.',
    icon: Plug,
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

const PADRAO_CO2_OPTIONS = [
  { value: 'NEDC', label: 'NEDC', description: 'Novo Ciclo Europeu de Condução' },
  { value: 'WLTP', label: 'WLTP', description: 'Procedimento de Teste Mundial Harmonizado para Veículos Ligeiros' },
] as const

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
  viaturaId?: string
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

const isImageContentType = (contentType?: string) => {
  if (!contentType) return false
  return contentType.startsWith('image/')
}

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

type FotoViaturaUploaderProps = {
  value: ViaturaDocumentoFormValue[]
  onChange: (documentos: ViaturaDocumentoFormValue[]) => void
  viaturaId?: string
}

const fixImageOrientation = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    // Primeiro ler como ArrayBuffer para obter orientação EXIF
    const reader = new FileReader()
    
    reader.onload = async (e) => {
      if (!e.target?.result) {
        reject(new Error('Erro ao ler ficheiro'))
        return
      }
      const arrayBuffer = e.target.result as ArrayBuffer
      const exifOrientation = getOrientationFromArrayBuffer(arrayBuffer)
      
      // Se não precisa de correção, retornar data URL normal
      if (exifOrientation === 1) {
        const dataUrl = await readFileAsDataUrl(file)
        resolve(dataUrl)
        return
      }
      
      // Ler como imagem para aplicar transformações
      const img = new Image()
      const imgUrl = URL.createObjectURL(file)
      
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        
        if (!ctx) {
          URL.revokeObjectURL(imgUrl)
          reject(new Error('Não foi possível criar contexto do canvas'))
          return
        }

        let width = img.width
        let height = img.height
        
        // Aplicar transformações baseadas na orientação EXIF
        switch (exifOrientation) {
          case 2:
            canvas.width = width
            canvas.height = height
            ctx.transform(-1, 0, 0, 1, width, 0)
            break
          case 3:
            canvas.width = width
            canvas.height = height
            ctx.transform(-1, 0, 0, -1, width, height)
            break
          case 4:
            canvas.width = width
            canvas.height = height
            ctx.transform(1, 0, 0, -1, 0, height)
            break
          case 5:
            canvas.width = height
            canvas.height = width
            ctx.transform(0, 1, 1, 0, 0, 0)
            break
          case 6:
            canvas.width = height
            canvas.height = width
            ctx.transform(0, 1, -1, 0, height, 0)
            break
          case 7:
            canvas.width = height
            canvas.height = width
            ctx.transform(0, -1, -1, 0, height, width)
            break
          case 8:
            canvas.width = height
            canvas.height = width
            ctx.transform(0, -1, 1, 0, 0, width)
            break
          default:
            canvas.width = width
            canvas.height = height
        }

        ctx.drawImage(img, 0, 0)
        URL.revokeObjectURL(imgUrl)
        resolve(canvas.toDataURL('image/jpeg', 0.92))
      }
      
      img.onerror = () => {
        URL.revokeObjectURL(imgUrl)
        reject(new Error('Erro ao carregar imagem'))
      }
      
      img.src = imgUrl
    }
    
    reader.onerror = () => reject(new Error('Erro ao ler ficheiro'))
    reader.readAsArrayBuffer(file)
  })
}

const getOrientationFromArrayBuffer = (arrayBuffer: ArrayBuffer): number => {
  const view = new DataView(arrayBuffer)
  
  // Procurar pelo marcador APP1 (EXIF)
  if (view.getUint16(0, false) !== 0xffd8) {
    return 1 // Não é JPEG válido
  }

  const length = view.byteLength
  let offset = 2

  while (offset < length) {
    if (view.getUint16(offset, false) !== 0xffe1) {
      offset += 2
      const markerLength = view.getUint16(offset, false)
      offset += 2 + markerLength
      continue
    }

    // APP1 encontrado
    offset += 2
    const exifLength = view.getUint16(offset, false)
    offset += 2

    // Verificar se é EXIF
    if (offset + 6 > length) return 1
    const exifHeader = String.fromCharCode(
      view.getUint8(offset),
      view.getUint8(offset + 1),
      view.getUint8(offset + 2),
      view.getUint8(offset + 3),
      view.getUint8(offset + 4),
      view.getUint8(offset + 5)
    )
    
    if (exifHeader !== 'Exif\0\0') {
      offset += exifLength
      continue
    }

    offset += 6
    const tiffOffset = offset

    // Verificar byte order
    const byteOrder = view.getUint16(tiffOffset, false)
    let littleEndian = byteOrder === 0x4949

    offset = tiffOffset + 2

    // Verificar magic number
    if (view.getUint16(offset, littleEndian) !== 0x002a) {
      return 1
    }

    offset = tiffOffset + 4
    const ifdOffset = view.getUint32(offset, littleEndian)
    offset = tiffOffset + ifdOffset

    // Número de entradas IFD
    const numEntries = view.getUint16(offset, littleEndian)
    offset += 2

    // Procurar tag de orientação (0x0112)
    for (let i = 0; i < numEntries; i++) {
      if (view.getUint16(offset, littleEndian) === 0x0112) {
        offset += 2
        const format = view.getUint16(offset, littleEndian)
        offset += 2
        const numComponents = view.getUint32(offset, littleEndian)
        offset += 4

        if (format === 3 && numComponents === 1) {
          const value = view.getUint16(offset, littleEndian)
          return value
        }
        break
      }
      offset += 12
    }

    return 1
  }

  return 1 // Orientação padrão
}

const FotoViaturaUploader = ({ value, onChange, viaturaId }: FotoViaturaUploaderProps) => {
  const documentos = value ?? []
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [processingFile, setProcessingFile] = useState<File | null>(null)
  const [processingPreviewUrl, setProcessingPreviewUrl] = useState<string | null>(null)
  const [isViewerOpen, setIsViewerOpen] = useState(false)

  // Encontrar a primeira imagem nos documentos
  const fotoPrincipal = useMemo(() => {
    return documentos.find((doc) => isImageContentType(doc.contentType)) ?? null
  }, [documentos])

  const fotoUrl = useMemo(() => {
    if (processingPreviewUrl) {
      console.log('[FotoViaturaUploader] Usando preview temporário:', processingPreviewUrl)
      return processingPreviewUrl
    }
    if (!fotoPrincipal?.dados) {
      console.log('[FotoViaturaUploader] Nenhuma foto encontrada')
      return null
    }
    const url = getDocumentoViewerUrl(fotoPrincipal)
    console.log('[FotoViaturaUploader] URL da foto:', url, 'dados:', fotoPrincipal.dados)
    return url
  }, [fotoPrincipal, processingPreviewUrl])

  useEffect(() => {
    return () => {
      if (processingPreviewUrl) {
        URL.revokeObjectURL(processingPreviewUrl)
      }
    }
  }, [processingPreviewUrl])

  const convertFileToDocumento = useCallback(async (file: File) => {
    const viaturaService = ViaturasService('viatura')
    
    try {
      console.log('[FotoViaturaUploader] Iniciando upload...', {
        fileName: file.name,
        viaturaId: viaturaId || 'undefined (criação)',
      })
      
      // Fazer upload do ficheiro para o servidor
      const uploadResponse = await viaturaService.uploadDocumento(
        file,
        viaturaId, // viaturaId pode ser undefined se for criação
        null // Sem pasta para imagem principal
      )

      console.log('[FotoViaturaUploader] Upload resposta:', uploadResponse)

      if (!uploadResponse.info?.data) {
        throw new Error('Resposta de upload inválida')
      }

      const caminho = uploadResponse.info.data
      
      console.log('[FotoViaturaUploader] Upload sucesso! Caminho:', caminho)

      return {
        nome: file.name || 'foto-viatura.jpg',
        dados: caminho, // Guardar apenas o caminho
        contentType: file.type || 'image/jpeg',
        tamanho: file.size,
      }
    } catch (error) {
      console.error('[FotoViaturaUploader] Erro ao fazer upload:', error)
      throw error
    }
  }, [viaturaId])

  const handleInputChange = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      const fileList = event.target.files ? Array.from(event.target.files) : []
      if (!fileList.length) {
        event.target.value = ''
        return
      }

      const file = fileList[0]
      if (!file.type.startsWith('image/')) {
        toast.error('Por favor, selecione um ficheiro de imagem.')
        event.target.value = ''
        return
      }

      // Criar preview temporário
      const previewUrl = URL.createObjectURL(file)
      setProcessingFile(file)
      setProcessingPreviewUrl(previewUrl)

      try {
        const novoDocumento = await convertFileToDocumento(file)
        
        console.log('[FotoViaturaUploader] Novo documento criado:', novoDocumento)
        
        // Remover foto anterior se existir
        const outrosDocumentos = documentos.filter((doc) => !isImageContentType(doc.contentType))
        
        // Adicionar nova foto como primeiro documento
        const novosDocumentos = [novoDocumento, ...outrosDocumentos]
        console.log('[FotoViaturaUploader] Atualizando documentos:', novosDocumentos)
        onChange(novosDocumentos)
        toast.success('Foto adicionada com sucesso.')
      } catch (error) {
        toast.error('Não foi possível processar a imagem.')
      } finally {
        setProcessingFile(null)
        setProcessingPreviewUrl(null)
        URL.revokeObjectURL(previewUrl)
        event.target.value = ''
      }
    },
    [documentos, onChange, convertFileToDocumento]
  )

  const handleRemove = useCallback(() => {
    const outrosDocumentos = documentos.filter((doc) => !isImageContentType(doc.contentType))
    onChange(outrosDocumentos)
    toast.success('Foto removida.')
  }, [documentos, onChange])

  const handleClick = useCallback(() => {
    if (fotoUrl) {
      setIsViewerOpen(true)
    } else {
      fileInputRef.current?.click()
    }
  }, [fotoUrl])

  const handleImageClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    setIsViewerOpen(true)
  }, [])

  return (
    <div className='flex flex-col items-center gap-3'>
      <div
        onClick={handleClick}
        className={cn(
          'relative flex aspect-square w-full max-w-[240px] cursor-pointer items-center justify-center overflow-hidden rounded-lg transition-all duration-200',
          fotoUrl
            ? 'border-2 border-border bg-card shadow-sm hover:border-red-500/60 hover:shadow-[0_0_20px_rgba(220,38,38,0.35)] hover:scale-105'
            : 'border border-border/60 bg-muted/20 hover:border-primary/50 hover:bg-muted/30'
        )}
      >
        <input
          ref={fileInputRef}
          type='file'
          className='hidden'
          accept='image/*'
          onChange={handleInputChange}
        />
        {fotoUrl ? (
          <>
            <img
              src={fotoUrl}
              alt='Foto da viatura'
              className='h-full w-full object-contain cursor-pointer'
              style={{ imageOrientation: 'from-image' }}
              onClick={handleImageClick}
            />
            {processingFile && (
              <div className='absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm'>
                <Loader2 className='h-8 w-8 animate-spin text-primary' />
              </div>
            )}
            <div className='absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity hover:opacity-100 pointer-events-none' />
            <Button
              type='button'
              variant='destructive'
              size='icon'
              className='absolute right-2 top-2 h-8 w-8 shadow-lg opacity-0 transition-opacity hover:opacity-100 z-10'
              onClick={(e) => {
                e.stopPropagation()
                handleRemove()
              }}
              disabled={processingFile !== null}
            >
              <X className='h-4 w-4' />
            </Button>
          </>
        ) : (
          <div className='flex flex-col items-center gap-3 text-center p-6'>
            <div className='flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary/15'>
              <Camera className='h-7 w-7' />
            </div>
            <div className='space-y-1'>
              <p className='text-sm font-semibold text-foreground'>Adicionar foto da viatura</p>
              <p className='text-xs text-muted-foreground'>Clique ou arraste uma imagem</p>
            </div>
          </div>
        )}
      </div>

      <Dialog open={isViewerOpen} onOpenChange={setIsViewerOpen}>
        <DialogContent className='max-w-4xl max-h-[90vh] p-0'>
          <div className='flex items-center justify-center p-6'>
            {fotoUrl && (
              <img
                src={fotoUrl}
                alt='Foto da viatura'
                className='max-h-[70vh] w-auto object-contain rounded-lg'
                style={{ imageOrientation: 'from-image' }}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

const getDocumentoViewerUrl = (documento?: ViaturaDocumentoFormValue | null) => {
  if (!documento?.dados) return null
  // Se for base64 (data:), retornar como está
  if (documento.dados.startsWith('data:')) return documento.dados
  // Se for URL completa, retornar como está
  if (documento.dados.startsWith('http://') || documento.dados.startsWith('https://')) {
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

const DocumentosUploader = ({ value, onChange, viaturaId }: DocumentosUploaderProps) => {
  const documentos = value ?? []
  const [previewIndex, setPreviewIndex] = useState<number | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const documentosRef = useRef<ViaturaDocumentoFormValue[]>(documentos)
  const cancelledProcessingIdsRef = useRef<Set<string>>(new Set())
  const [manualFolders, setManualFolders] = useState<string[]>([])
  const [selectedFolder, setSelectedFolder] = useState<string>(FOLDER_FILTER_NONE)
  const [isFolderDialogOpen, setIsFolderDialogOpen] = useState(false)
  const [folderNameInput, setFolderNameInput] = useState('')
  const [pendingFolderForUpload, setPendingFolderForUpload] = useState<string | undefined>(undefined)
  const [processingDocumentos, setProcessingDocumentos] = useState<ProcessingDocumento[]>([])
  const [isFolderViewerOpen, setIsFolderViewerOpen] = useState(false)
  const [folderViewerFolder, setFolderViewerFolder] = useState<string | null>(null)
  const processingDocumentosRef = useRef<ProcessingDocumento[]>(processingDocumentos)

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
    return Array.from(folderSet).sort((a, b) => a.localeCompare(b, 'pt-PT'))
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
    if (selectedFolder === FOLDER_FILTER_ALL || selectedFolder === FOLDER_FILTER_NONE) {
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
      const normalized = folder ? normalizeFolderName(folder) ?? null : null
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

    const viaturaService = ViaturasService('viatura')

    return Promise.all(
      files.map(async (file) => {
        try {
          console.log('[DocumentosUploader] Iniciando upload...', {
            fileName: file.name,
            viaturaId: viaturaId || 'undefined (criação)',
            pasta: pasta || 'sem pasta',
          })
          
          // Fazer upload do ficheiro para o servidor
          const uploadResponse = await viaturaService.uploadDocumento(
            file,
            viaturaId, // viaturaId pode ser undefined se for criação
            pasta ?? null
          )

          console.log('[DocumentosUploader] Upload resposta:', uploadResponse)

          if (!uploadResponse.info?.data) {
            throw new Error('Resposta de upload inválida')
          }

          const caminho = uploadResponse.info.data
          
          console.log('[DocumentosUploader] Upload sucesso! Caminho:', caminho)

          return {
            nome: file.name || 'documento',
            dados: caminho, // Guardar apenas o caminho
            contentType: file.type || 'application/octet-stream',
            tamanho: file.size,
            pasta: pasta ?? null,
          }
        } catch (error) {
          console.error('[DocumentosUploader] Erro ao fazer upload:', error)
          throw error
        }
      })
    )
  }, [viaturaId])

  const appendDocumentos = useCallback(
    (novos: ViaturaDocumentoFormValue[]) => {
      if (novos.length === 0) return
      onChange([...documentosRef.current, ...novos])
    },
    [onChange]
  )

  const handleInputChange = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      const fileList = event.target.files ? Array.from(event.target.files) : []
      if (!fileList.length) {
        event.target.value = ''
        return
      }

      const targetFolder = pendingFolderForUpload ?? resolveCurrentFolder()

      const tempDocs: ProcessingDocumento[] = fileList.map((file) => ({
        id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2),
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
          .catch(() => {
            toast.error(`Não foi possível processar o ficheiro ${tempDoc.nome}.`)
          })
          .finally(() => {
            setProcessingDocumentos((prev) => prev.filter((doc) => doc.id !== tempDoc.id))
            cancelledProcessingIdsRef.current.delete(tempDoc.id)
            URL.revokeObjectURL(tempDoc.previewUrl)
          })
      })

      event.target.value = ''
      setPendingFolderForUpload(undefined)
    },
    [appendDocumentos, convertFilesToDocumentos, pendingFolderForUpload, resolveCurrentFolder]
  )

  const handleAddClick = useCallback(() => {
    handleSelectFolderValue(undefined)
    setPendingFolderForUpload(undefined)
    fileInputRef.current?.click()
  }, [handleSelectFolderValue])

  const [confirmDeleteFolder, setConfirmDeleteFolder] = useState<string | null>(null)
  const handleDeleteFolder = useCallback(
    (folderName: string) => {
      const normalized = normalizeFolderName(folderName)
      if (!normalized) return
      setConfirmDeleteFolder(normalized)
    },
    []
  )

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
        .filter(({ documento }) => !normalizeFolderName(documento.pasta ?? undefined)),
    [documentos]
  )
  const unassignedProcessingDocumentos = useMemo(
    () => processingDocumentos.filter((documento) => !normalizeFolderName(documento.pasta)),
    [processingDocumentos]
  )
  const folderViewerDocuments = useMemo(() => {
    if (folderViewerFolder === null) {
      return documentos
        .map((documento, index) => ({ documento, index }))
        .filter(({ documento }) => !normalizeFolderName(documento.pasta ?? undefined))
    }
    return documentos
      .map((documento, index) => ({ documento, index }))
      .filter(
        ({ documento }) => normalizeFolderName(documento.pasta ?? undefined) === folderViewerFolder
      )
  }, [documentos, folderViewerFolder])

  const folderViewerProcessingDocumentos = useMemo(() => {
    if (folderViewerFolder === null) {
      return processingDocumentos.filter(
        (documento) => !normalizeFolderName(documento.pasta ?? undefined)
      )
    }
    return processingDocumentos.filter(
      (documento) => normalizeFolderName(documento.pasta ?? undefined) === folderViewerFolder
    )
  }, [processingDocumentos, folderViewerFolder])
  const unassignedCount = unassignedDocuments.length + unassignedProcessingDocumentos.length

  const handleRemove = useCallback(
    (index: number) => {
      const next = documentosRef.current.filter((_, i) => i !== index)
      onChange(next)
    },
    [onChange]
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
  }, [])

  const handleOpenInNewTab = useCallback((documento: ViaturaDocumentoFormValue) => {
    const viewerUrl = getDocumentoViewerUrl(documento)
    if (!viewerUrl) return
    window.open(viewerUrl, '_blank', 'noopener,noreferrer')
  }, [])

  const handlePrint = useCallback(
    (documento: ViaturaDocumentoFormValue) => {
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
          toast.error('O navegador bloqueou a impressão automática. Utilize o botão "Abrir num separador".')
        } finally {
          cleanUp()
        }
      }
    },
    [handleOpenInNewTab]
  )

  const previewDocumento =
    previewIndex !== null ? documentos.at(previewIndex) ?? null : null
  const hasAnyDocs = documentos.length > 0 || processingDocumentos.length > 0
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
          <div className='grid grid-cols-3 gap-3'>
            <div className='rounded-2xl border border-border/70 bg-card/70 p-2.5 shadow-sm transition hover:border-primary/50 hover:shadow-md text-[13px]'>
              <div className='flex items-center justify-between gap-3'>
                <div className='flex items-center gap-3'>
                  <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary'>
                    <FolderOpen className='h-5 w-5' />
                  </div>
                  <div>
                    <p className='text-sm font-semibold text-foreground'>Sem pasta</p>
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
                className='rounded-2xl border border-border/70 bg-card/70 p-2.5 shadow-sm transition hover:border-primary/50 hover:shadow-md text-[13px]'
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
                    <p className='text-sm font-semibold text-foreground'>{card.label}</p>
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
                  documento.pasta === normalized ? { ...documento, pasta: undefined } : documento
                )
                onChange(updatedDocs)

                setProcessingDocumentos((prev) =>
                  prev.map((documento) =>
                    documento.pasta === normalized ? { ...documento, pasta: undefined } : documento
                  )
                )

                setManualFolders((prev) => prev.filter((folder) => folder !== normalized))
                if (selectedFolder === normalized) {
                  setSelectedFolder(FOLDER_FILTER_NONE)
                }
                toast.success(`Pasta "${normalized}" removida. Os ficheiros passaram para "Sem pasta".`)
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
                Ainda não existem documentos nesta pasta. Utilize o botão abaixo para anexar novos ficheiros.
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
                      <span className='line-clamp-2 text-[11px] text-foreground'>{documento.nome}</span>
                      <span className='text-[10px] text-muted-foreground'>{formatFileSize(documento.tamanho)}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
          <DialogFooter className='mt-4'>
            <Button
              type='button'
              onClick={() => handleRequestUploadForFolder(folderViewerFolder ?? undefined)}
              disabled={!folderViewerFolder}
            >
              <Plus className='mr-2 h-4 w-4' />
              Anexar ficheiros
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {hasAnyDocs ? null : null}

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
            <Label htmlFor='new-folder-name' className='text-xs font-medium text-muted-foreground'>
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
            <Button type='button' variant='ghost' onClick={handleCloseFolderDialog}>
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
                  {formatFileSize(previewDocumento.tamanho)} · {previewDocumento.contentType}
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
                      <span>Não foi possível gerar uma pré-visualização para este documento.</span>
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

                if (isPdfContentType(previewDocumento.contentType, previewDocumento.nome)) {
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
  onCancel?: () => void
  submitLabel: string
  tabKey: string
  isSubmitting: boolean
  viaturaId?: string
}

export function ViaturaFormContainer({
  initialValues,
  isLoadingInitial = false,
  onSubmit,
  onCancel,
  submitLabel,
  tabKey,
  isSubmitting,
  viaturaId,
}: ViaturaFormContainerProps) {
  // Códigos dos países europeus suportados (apenas os da lista fornecida)
  const europeanCountryCodes = useMemo(() => ['PT', 'ES', 'FR', 'IT', 'DE', 'NL', 'BE', 'GB', 'AT', 'CH', 'PL', 'CZ', 'SE', 'DK', 'FI', 'LU'], [])
  
  // Filtra apenas os países europeus do objeto countries
  const europeanCountries = useMemo(() => {
    const filtered: Record<string, string> = {}
    europeanCountryCodes.forEach((code) => {
      if (countries[code as keyof typeof countries]) {
        filtered[code] = countries[code as keyof typeof countries]
      }
    })
    return filtered
  }, [europeanCountryCodes])

  const initialFormValues = useMemo<Partial<ViaturaFormSchemaType>>(() => {
    return {
      ...defaultViaturaFormValues,
      ...initialValues,
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
  const acidentesValues = form.watch('acidentes') ?? []
  const multasValues = form.watch('multas') ?? []
  const entidadeFornecedoraTipo = form.watch('entidadeFornecedoraTipo')
  
  const [savedAcidentes, setSavedAcidentes] = useState<Set<string>>(new Set())
  const [expandedAcidentes, setExpandedAcidentes] = useState<Set<string>>(new Set())
  const [activeAcidenteTab, setActiveAcidenteTab] = useState<Record<string, string>>({})
  const [savedMultas, setSavedMultas] = useState<Set<string>>(new Set())
  const [expandedMultas, setExpandedMultas] = useState<Set<string>>(new Set())
  const tipoPropulsao = form.watch('tipoPropulsao')
  const isElectricPropulsion = tipoPropulsao === 'eletrico'
  const isHybridPropulsion = tipoPropulsao === 'hibrido' || tipoPropulsao === 'hibridoPlugIn'
  const isPlugInHybrid = tipoPropulsao === 'hibridoPlugIn'
  const showCombustivelFields = !isElectricPropulsion || isHybridPropulsion
  // Para HEV: não mostrar capacidade bateria, voltagem, autonomia
  // Para PHEV: mostrar todos os campos elétricos
  const showElectricFields = isElectricPropulsion || isPlugInHybrid
  const motorizacaoSelecionada = tipoPropulsao === 'combustao' || isElectricPropulsion || isHybridPropulsion

  useEffect(() => {
    if (entidadeFornecedoraTipo === 'fornecedor') {
      const currentTerceiro = form.getValues('terceiroId')
      if (currentTerceiro) {
        form.setValue('terceiroId', null, { shouldDirty: true, shouldValidate: true })
      }
    } else if (entidadeFornecedoraTipo === 'terceiro') {
      const currentFornecedor = form.getValues('fornecedorId')
      if (currentFornecedor) {
        form.setValue('fornecedorId', null, { shouldDirty: true, shouldValidate: true })
      }
    } else {
      const currentFornecedor = form.getValues('fornecedorId')
      const currentTerceiro = form.getValues('terceiroId')
      if (currentFornecedor) {
        form.setValue('fornecedorId', null, { shouldDirty: true, shouldValidate: true })
      }
      if (currentTerceiro) {
        form.setValue('terceiroId', null, { shouldDirty: true, shouldValidate: true })
      }
    }
  }, [entidadeFornecedoraTipo, form])

  // Reset do formulário apenas na montagem inicial ou quando initialValues muda externamente
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    // Só reseta se os valores iniciais mudaram significativamente (ex: carregou nova viatura)
    if (initialValues && !form.formState.isDirty) {
      form.reset(initialFormValues)
    }
  }, [viaturaId])

  const combustivelSectionIcon =
    isElectricPropulsion || isHybridPropulsion ? BatteryCharging : Fuel
  const combustivelSectionTitle = isElectricPropulsion
    ? 'Energia e autonomia'
    : isPlugInHybrid
      ? 'Combustível e energia elétrica'
      : isHybridPropulsion
        ? 'Combustível e consumo'
        : 'Combustível e consumo'
  const combustivelSectionDescription = isElectricPropulsion
    ? 'Defina o consumo elétrico e a autonomia estimada'
    : isPlugInHybrid
      ? 'Defina os consumos de combustível e elétrico, e a autonomia em modo elétrico'
      : isHybridPropulsion
        ? 'Defina o combustível e o consumo médio estimado'
        : 'Defina o combustível e o consumo médio estimado'
  const consumoMedioLabel = isElectricPropulsion
    ? 'Consumo Médio (kWh/100km)'
    : isPlugInHybrid
      ? 'Consumo Médio Combustível (L/100km)'
      : isHybridPropulsion
        ? 'Consumo Médio (L/100km)'
        : 'Consumo Médio (L/100km)'
  const combustivelGridClass = isElectricPropulsion
    ? 'grid gap-4'
    : 'grid gap-4 sm:grid-cols-[2fr_1fr]'
  const motorSectionIcon = isElectricPropulsion || isHybridPropulsion ? BatteryCharging : Gauge
  const motorSectionTitle = isElectricPropulsion
    ? 'Bateria e performance'
    : isPlugInHybrid
      ? 'Sistema híbrido plug-in e performance'
      : isHybridPropulsion
        ? 'Motor e performance'
        : 'Motor e performance'
  const motorSectionDescription = isElectricPropulsion
    ? 'Informação sobre a potência e capacidade energética da viatura'
    : isPlugInHybrid
      ? 'Detalhe as especificações do motor térmico e do sistema elétrico'
      : isHybridPropulsion
        ? 'Especificações de potência do conjunto motor'
        : 'Especificações de potência do conjunto motor'
  const potenciaLabel = isElectricPropulsion
    ? 'Potência (kW)'
    : isPlugInHybrid
      ? 'Potência Motor Térmico (cv)'
      : isHybridPropulsion
        ? 'Potência (cv)'
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
    fields: acidenteFields,
    append: appendAcidente,
    remove: removeAcidente,
  } = useFieldArray({
    control: form.control,
    name: 'acidentes',
    keyName: 'fieldId',
  })

  const {
    fields: multaFields,
    append: appendMulta,
    remove: removeMulta,
  } = useFieldArray({
    control: form.control,
    name: 'multas',
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
  const {
    data: funcionarios = [],
    isLoading: isLoadingFuncionarios,
    refetch: refetchFuncionarios,
  } = useGetFuncionariosSelect()
  const {
    data: concelhos = [],
    isLoading: isLoadingConcelhos,
  } = useGetConcelhosSelect()
  const {
    data: freguesias = [],
    isLoading: isLoadingFreguesias,
  } = useGetFreguesiasSelect()
  const {
    data: codigosPostais = [],
    isLoading: isLoadingCodigosPostais,
  } = useGetCodigosPostaisSelect()

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
      funcionarios: buildOptions(funcionarios),
    }),
    [
      categorias,
      combustiveis,
      conservatorias,
      cores,
      delegacoes,
      equipamentos,
      fornecedores,
      funcionarios,
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
    funcionarios: isLoadingFuncionarios,
  }

  const [selectedSeguroId, setSelectedSeguroId] = useState('')
  const segurosSelecionados = form.watch('seguroIds') ?? []
  const [selectedEquipamentoId, setSelectedEquipamentoId] = useState('')
  const [selectedGarantiaId, setSelectedGarantiaId] = useState('')
  const [selectedCondutorId, setSelectedCondutorId] = useState('')
  const equipamentosSelecionados = form.watch('equipamentoIds') ?? []
  const garantiasSelecionadas = form.watch('garantiaIds') ?? []
  const condutoresSelecionados = form.watch('condutorIds') ?? []
  const condutoresDocumentos = form.watch('condutoresDocumentos') ?? {}
  
  // Estado para controlar o diálogo de upload de documentos do condutor
  const [condutorUploadDialogOpen, setCondutorUploadDialogOpen] = useState(false)
  const [condutorUploadDialogCondutorId, setCondutorUploadDialogCondutorId] = useState<string | null>(null)
  const condutorUploadFileInputRef = useRef<HTMLInputElement | null>(null)
  
  // Estado para controlar a visualização de documentos do condutor
  const [condutorViewerOpen, setCondutorViewerOpen] = useState(false)
  const [condutorViewerDocumento, setCondutorViewerDocumento] = useState<ViaturaDocumentoFormValue | null>(null)

  // Estado para controlar o diálogo de upload de documentos da inspeção
  const [inspecaoUploadDialogOpen, setInspecaoUploadDialogOpen] = useState(false)
  const [inspecaoUploadDialogIndex, setInspecaoUploadDialogIndex] = useState<number | null>(null)
  const inspecaoUploadFileInputRef = useRef<HTMLInputElement | null>(null)
  
  // Estado para controlar a visualização de documentos da inspeção
  const [inspecaoViewerOpen, setInspecaoViewerOpen] = useState(false)
  const [inspecaoViewerDocumento, setInspecaoViewerDocumento] = useState<ViaturaDocumentoFormValue | null>(null)
  
  // Estado para controlar o diálogo de listagem de documentos da inspeção
  const [inspecaoDocumentosDialogOpen, setInspecaoDocumentosDialogOpen] = useState(false)
  const [inspecaoDocumentosDialogIndex, setInspecaoDocumentosDialogIndex] = useState<number | null>(null)

  // Estados para modal de visualização de documentos de condutor
  const [condutorDocumentosDialogOpen, setCondutorDocumentosDialogOpen] = useState(false)
  const [condutorDocumentosDialogCondutorId, setCondutorDocumentosDialogCondutorId] = useState<string | null>(null)

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

  const condutoresMap = useMemo(() => {
    const map = new Map<string, string>()
    selectOptions.funcionarios.forEach((option) => {
      map.set(option.value, option.label)
    })
    return map
  }, [selectOptions.funcionarios])

  // Mapa para associar funcionários aos seus cargos
  const condutoresCargosMap = useMemo(() => {
    const map = new Map<string, string>()
    funcionarios.forEach((funcionario) => {
      if (funcionario.id && funcionario.cargo?.designacao) {
        map.set(funcionario.id, funcionario.cargo.designacao)
      }
    })
    return map
  }, [funcionarios])

  const combustiveisMap = useMemo(() => {
    const map = new Map<string, string>()
    selectOptions.combustiveis.forEach((option) => {
      map.set(option.value, option.label)
    })
    return map
  }, [selectOptions.combustiveis])

  // Map criado para lookup rápido: dado um tipoViaturaId, retorna a categoriaInspecao
  // Porquê usar Map: O(1) lookup time, muito mais rápido que array.find() em loops
  // useMemo: só recalcula quando tipoViaturas muda, otimiza performance
  // ATUALIZADO: Agora mapeia baseado na designação do tipo de viatura
  const tipoViaturasCategoriaMap = useMemo(() => {
    const map = new Map<string, CategoriaInspecao | undefined>()
    tipoViaturas.forEach((tipoViatura) => {
      if (tipoViatura.id && tipoViatura.designacao) {
        // Mapear designação para categoria de inspeção
        const categoriaInspecao = mapearDesignacaoParaCategoriaInspecao(tipoViatura.designacao)
        map.set(tipoViatura.id, categoriaInspecao)
      }
    })
    return map
  }, [tipoViaturas])

  // Campos para cálculo do IUC
  const combustivelId = form.watch('combustivelId')
  const anoImpostoCirculacao = form.watch('anoImpostoCirculacao')
  const dataLivrete = form.watch('dataLivrete')
  const anoFabrico = form.watch('anoFabrico')
  const cilindrada = form.watch('cilindrada')
  const emissoesCO2 = form.watch('emissoesCO2')
  const padraoCO2 = form.watch('padraoCO2')
  const voltagemTotal = form.watch('voltagemTotal')
  const tara = form.watch('tara')
  const cargaUtil = form.watch('cargaUtil')
  const mercadorias = form.watch('mercadorias')
  
  // Calcular IUC
  const iucResult = useMemo(() => {
    const nomeCombustivel = combustivelId ? combustiveisMap.get(combustivelId) : null
    return calcularIUC(
      nomeCombustivel,
      anoImpostoCirculacao || null,
      dataLivrete || null,
      anoFabrico || null,
      cilindrada || null,
      tipoPropulsao || null,
      emissoesCO2 || null,
      (padraoCO2 && (padraoCO2 === 'NEDC' || padraoCO2 === 'WLTP') ? padraoCO2 as 'NEDC' | 'WLTP' : undefined),
      voltagemTotal || null,
      tara || null,
      cargaUtil || null,
      mercadorias || false
    )
  }, [combustivelId, anoImpostoCirculacao, dataLivrete, anoFabrico, cilindrada, tipoPropulsao, emissoesCO2, padraoCO2, voltagemTotal, tara, cargaUtil, mercadorias, combustiveisMap])

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

  const condutoresSelecionadosDetalhes = useMemo(
    () =>
      condutoresSelecionados.map((id) => ({
        id,
        label: condutoresMap.get(id) ?? 'Condutor indisponível',
      })),
    [condutoresSelecionados, condutoresMap]
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

  const addCondutorToForm = (condutorId: string) => {
    if (!condutorId) {
      return
    }

    const current = form.getValues('condutorIds') ?? []
    if (current.includes(condutorId)) {
      toast.warning('Este condutor já foi adicionado')
      return
    }

    form.setValue('condutorIds', [...current, condutorId], {
      shouldDirty: true,
      shouldValidate: true,
    })
    setSelectedCondutorId('')
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

  const handleAddCondutor = () => {
    addCondutorToForm(selectedCondutorId)
  }

  // Função que calcula a próxima data de inspeção baseado nas regras portuguesas
  // Porquê atualizar: Antes sempre adicionava 1 ano, agora aplica regras corretas
  const getNextInspectionDate = (date: Date) => {
    // Obter o tipo de viatura selecionado no formulário
    const tipoViaturaId = form.getValues('tipoViaturaId')
    // Obter a data de matrícula (necessária para calcular idade do veículo)
    const dataLivrete = form.getValues('dataLivrete')
    // Buscar a categoria de inspeção do tipo de viatura selecionado
    const categoriaInspecao = tipoViaturaId ? tipoViaturasCategoriaMap.get(tipoViaturaId) : undefined
    
    // Se temos categoria e data de matrícula, usar as regras específicas
    if (categoriaInspecao && dataLivrete) {
      return calcularProximaInspecao(categoriaInspecao, date, dataLivrete)
    }
    
    // Fallback: se não temos categoria ou data de matrícula, usar regra padrão anual
    // Porquê fallback: Garante que sempre retorna uma data válida, mesmo sem dados completos
    const next = new Date(date.getTime())
    next.setFullYear(next.getFullYear() + 1)
    return next
  }

  // Função chamada quando o utilizador clica para adicionar uma nova inspeção
  // Porquê atualizar: Agora calcula automaticamente datas baseadas nas regras portuguesas
  const handleAddInspection = () => {
    const inspections = form.getValues('inspecoes') ?? []
    const lastInspection = inspections[inspections.length - 1]
    // Obter dados necessários para cálculo
    const tipoViaturaId = form.getValues('tipoViaturaId')
    const dataLivrete = form.getValues('dataLivrete')
    const categoriaInspecao = tipoViaturaId ? tipoViaturasCategoriaMap.get(tipoViaturaId) : undefined
    
    // Verificar se a data de matrícula está preenchida
    if (!dataLivrete) {
      toast.warning('Por favor, preencha a "Data do Livrete" antes de adicionar uma inspeção. Esta informação é necessária para calcular as datas de inspeção corretamente.')
      return
    }

    if (lastInspection) {
      // Se já existe uma inspeção anterior, determinar a data da nova inspeção
      // Porquê: Usar a data da próxima inspeção se existir, senão usar a data da inspeção anterior + 1 ano
      let dataInspecao: Date
      
      if (lastInspection.dataProximaInspecao instanceof Date && !isNaN(lastInspection.dataProximaInspecao.getTime())) {
        // Se a última inspeção tem data da próxima definida, usar essa data
        dataInspecao = new Date(lastInspection.dataProximaInspecao)
      } else if (lastInspection.dataInspecao instanceof Date && !isNaN(lastInspection.dataInspecao.getTime())) {
        // Se não tem próxima, usar a data da inspeção anterior e calcular a próxima
        dataInspecao = new Date(lastInspection.dataInspecao)
        // Adicionar um ano como base, mas será recalculado abaixo
        dataInspecao.setFullYear(dataInspecao.getFullYear() + 1)
      } else {
        // Se não tem nenhuma data válida, usar hoje
        dataInspecao = new Date()
      }
      
      // Calcular próxima inspeção usando as regras (bienal/anual conforme categoria e idade)
      const proximaInspecao = categoriaInspecao && dataLivrete
        ? calcularProximaInspecao(categoriaInspecao, dataInspecao, dataLivrete)
        : getNextInspectionDate(dataInspecao) // Fallback se não temos dados completos
      
      // Garantir que a próxima inspeção é uma Date válida
      if (!(proximaInspecao instanceof Date) || isNaN(proximaInspecao.getTime())) {
        toast.error('Erro ao calcular a data da próxima inspeção.')
        return
      }
      
      appendInspection({
        id: undefined,
        dataInspecao,
        resultado: 'Pendente', // Valor padrão para passar validação, utilizador pode alterar depois
        dataProximaInspecao: proximaInspecao,
        documentos: [], // Array vazio de documentos, utilizador pode adicionar depois
      })

      // Se a última inspeção não tinha data da próxima definida, atualizar agora
      if (!(lastInspection.dataProximaInspecao instanceof Date) || isNaN(lastInspection.dataProximaInspecao.getTime())) {
        form.setValue(`inspecoes.${inspections.length - 1}.dataProximaInspecao`, dataInspecao, {
          shouldDirty: true,
          shouldValidate: true,
        })
      }
    } else {
      // Primeira inspeção - calcular baseado na primeira inspeção obrigatória
      // Porquê: A primeira inspeção tem datas específicas (4 anos para ligeiros, 2 para mercadorias, 1 para pesados)
      // IMPORTANTE: Se o veículo já é antigo e passou da primeira inspeção, usar HOJE
      // (não a data histórica, pois o cliente pode não querer registar inspeções antigas)
      const hoje = new Date()
      let dataPrimeiraInspecao = hoje
      
      // Se temos categoria e data de matrícula, calcular quando deveria ser a primeira inspeção
      if (categoriaInspecao && dataLivrete) {
        const primeiraInspecao = calcularPrimeiraInspecao(categoriaInspecao, dataLivrete)
        // Se a primeira inspeção AINDA NÃO chegou, usar a data calculada
        // Se a primeira inspeção JÁ PASSOU, usar HOJE (cliente começa a registar a partir de agora)
        if (primeiraInspecao && primeiraInspecao > hoje) {
          dataPrimeiraInspecao = primeiraInspecao
        }
        // Se primeiraInspecao <= hoje, mantém dataPrimeiraInspecao = hoje (já está definido acima)
      }
      
      // Calcular quando será a próxima inspeção após esta primeira
      // Porquê: Já preenche automaticamente a próxima data, facilitando para o utilizador
      // A idade do veículo na data da inspeção será usada para calcular a próxima (bienal vs anual)
      const proximaInspecao = categoriaInspecao && dataLivrete
        ? calcularProximaInspecao(categoriaInspecao, dataPrimeiraInspecao, dataLivrete)
        : getNextInspectionDate(dataPrimeiraInspecao)
      
      // Garantir que as datas são objetos Date válidos
      // Porquê: O schema de validação espera objetos Date, não strings ou null
      if (!(dataPrimeiraInspecao instanceof Date) || isNaN(dataPrimeiraInspecao.getTime())) {
        toast.error('Erro ao calcular a data da primeira inspeção. Por favor, verifique a data de matrícula.')
        return
      }
      
      if (!(proximaInspecao instanceof Date) || isNaN(proximaInspecao.getTime())) {
        toast.error('Erro ao calcular a data da próxima inspeção. Por favor, verifique a data de matrícula.')
        return
      }
      
      appendInspection({
        id: undefined,
        dataInspecao: dataPrimeiraInspecao,
        resultado: 'Pendente', // Valor padrão para passar validação, utilizador pode alterar depois
        dataProximaInspecao: proximaInspecao,
        documentos: [], // Array vazio de documentos, utilizador pode adicionar depois
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

  const handleRemoveCondutor = (condutorId: string) => {
    const current = form.getValues('condutorIds') ?? []
    form.setValue(
      'condutorIds',
      current.filter((id) => id !== condutorId),
      { shouldDirty: true, shouldValidate: true }
    )

    setSelectedCondutorId((prev) => (prev === condutorId ? '' : prev))
    
    // Remover também os documentos associados ao condutor
    const currentDocumentos = form.getValues('condutoresDocumentos') ?? {}
    const { [condutorId]: _, ...restDocumentos } = currentDocumentos
    form.setValue('condutoresDocumentos', restDocumentos, {
      shouldDirty: true,
      shouldValidate: false,
    })
  }
  
  // Função para abrir o diálogo de upload de documentos do condutor
  const handleOpenCondutorUploadDialog = (condutorId: string) => {
    setCondutorUploadDialogCondutorId(condutorId)
    setCondutorUploadDialogOpen(true)
  }

  // Função para abrir o modal de visualização de documentos do condutor
  const handleOpenCondutorDocumentosDialog = (condutorId: string) => {
    setCondutorDocumentosDialogCondutorId(condutorId)
    setCondutorDocumentosDialogOpen(true)
  }

  // Função para fechar o modal de visualização de documentos do condutor
  const handleCloseCondutorDocumentosDialog = () => {
    setCondutorDocumentosDialogOpen(false)
    setCondutorDocumentosDialogCondutorId(null)
  }
  
  // Função para fechar o diálogo de upload
  const handleCloseCondutorUploadDialog = () => {
    setCondutorUploadDialogOpen(false)
    setCondutorUploadDialogCondutorId(null)
    if (condutorUploadFileInputRef.current) {
      condutorUploadFileInputRef.current.value = ''
    }
  }
  
  // Função para processar o upload de ficheiros do condutor
  const handleCondutorFileUpload = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      const fileList = event.target.files ? Array.from(event.target.files) : []
      if (!fileList.length || !condutorUploadDialogCondutorId) {
        event.target.value = ''
        return
      }

      try {
        const viaturaService = ViaturasService('viatura')
        
        const novosDocumentos = await Promise.all(
          fileList.map(async (file) => {
            try {
              // Fazer upload do ficheiro usando o mesmo sistema que os documentos da viatura
              const uploadResponse = await viaturaService.uploadDocumento(
                file,
                viaturaId,
                null // sem pasta para documentos de condutor
              )

              if (!uploadResponse.info?.data) {
                throw new Error('Resposta de upload inválida')
              }

              const caminho = uploadResponse.info.data

              return {
                nome: file.name || 'documento',
                dados: caminho, // Guardar o caminho retornado pelo servidor
                contentType: file.type || 'application/octet-stream',
                tamanho: file.size,
              }
            } catch (error) {
              console.error('[handleCondutorFileUpload] Erro ao fazer upload:', error)
              throw error
            }
          })
        )

        const currentDocumentos = form.getValues('condutoresDocumentos') ?? {}
        const documentosExistentes = currentDocumentos[condutorUploadDialogCondutorId] ?? []
        form.setValue(
          'condutoresDocumentos',
          {
            ...currentDocumentos,
            [condutorUploadDialogCondutorId]: [...documentosExistentes, ...novosDocumentos],
          },
          { shouldDirty: true, shouldValidate: false }
        )

        toast.success(`${fileList.length} ficheiro(s) anexado(s) com sucesso.`)
      } catch (error) {
        console.error('[handleCondutorFileUpload] Erro ao fazer upload:', error)
        toast.error('Não foi possível processar o(s) ficheiro(s).')
      } finally {
        event.target.value = ''
      }
    },
    [condutorUploadDialogCondutorId, form, viaturaId]
  )
  
  // Função para remover um documento do condutor
  const handleRemoveCondutorDocumento = (condutorId: string, documentoIndex: number) => {
    const currentDocumentos = form.getValues('condutoresDocumentos') ?? {}
    const documentos = currentDocumentos[condutorId] ?? []
    const novosDocumentos = documentos.filter((_, index) => index !== documentoIndex)
    
    if (novosDocumentos.length === 0) {
      const { [condutorId]: _, ...restDocumentos } = currentDocumentos
      form.setValue('condutoresDocumentos', restDocumentos, {
        shouldDirty: true,
        shouldValidate: false,
      })
    } else {
      form.setValue(
        'condutoresDocumentos',
        {
          ...currentDocumentos,
          [condutorId]: novosDocumentos,
        },
        { shouldDirty: true, shouldValidate: false }
      )
    }
    toast.success('Documento removido.')
  }
  
  // Função para visualizar um documento do condutor
  const handleViewCondutorDocumento = (documento: ViaturaDocumentoFormValue) => {
    if (!documento?.dados) return
    setCondutorViewerDocumento(documento)
    setCondutorViewerOpen(true)
  }
  
  // Função para fazer download de um documento do condutor
  const handleDownloadCondutorDocumento = (documento: ViaturaDocumentoFormValue) => {
    if (!documento?.dados) return

    if (documento.dados.startsWith('data:')) {
      const link = document.createElement('a')
      link.href = documento.dados
      link.download = documento.nome || 'documento'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } else if (documento.dados.startsWith('http://') || documento.dados.startsWith('https://')) {
      window.open(documento.dados, '_blank')
    }
  }
  
  // Função para abrir o diálogo de upload de documentos da inspeção
  const handleOpenInspecaoUploadDialog = (inspecaoIndex: number) => {
    setInspecaoUploadDialogIndex(inspecaoIndex)
    setInspecaoUploadDialogOpen(true)
  }
  
  // Função para fechar o diálogo de upload de documentos da inspeção
  const handleCloseInspecaoUploadDialog = () => {
    setInspecaoUploadDialogOpen(false)
    setInspecaoUploadDialogIndex(null)
    if (inspecaoUploadFileInputRef.current) {
      inspecaoUploadFileInputRef.current.value = ''
    }
  }
  
  // Função para processar o upload de ficheiros da inspeção
  const handleInspecaoFileUpload = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      const fileList = event.target.files ? Array.from(event.target.files) : []
      if (!fileList.length || inspecaoUploadDialogIndex === null) {
        event.target.value = ''
        return
      }

      try {
        const viaturaService = ViaturasService('viatura')
        
        const novosDocumentos = await Promise.all(
          fileList.map(async (file) => {
            try {
              // Fazer upload do ficheiro para o servidor
              const uploadResponse = await viaturaService.uploadDocumento(
                file,
                viaturaId, // viaturaId pode ser undefined se for criação
                null // sem pasta específica para inspeções
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
                pasta: null,
              }
            } catch (error) {
              console.error('Erro ao fazer upload:', error)
              throw error
            }
          })
        )

        const currentInspecoes = form.getValues('inspecoes') ?? []
        const inspecaoAtual = currentInspecoes[inspecaoUploadDialogIndex]
        if (!inspecaoAtual) {
          event.target.value = ''
          return
        }

        const documentosExistentes = inspecaoAtual.documentos ?? []
        const novosDocumentosCompletos = [...documentosExistentes, ...novosDocumentos]

        form.setValue(
          `inspecoes.${inspecaoUploadDialogIndex}.documentos`,
          novosDocumentosCompletos,
          { shouldDirty: true, shouldValidate: false }
        )

        toast.success(`${fileList.length} ficheiro(s) anexado(s) com sucesso.`)
      } catch (error) {
        toast.error('Não foi possível processar o(s) ficheiro(s).')
      } finally {
        event.target.value = ''
      }
    },
    [inspecaoUploadDialogIndex, form, viaturaId]
  )
  
  // Função para remover um documento da inspeção
  const handleRemoveInspecaoDocumento = (inspecaoIndex: number, documentoIndex: number) => {
    const currentInspecoes = form.getValues('inspecoes') ?? []
    const inspecaoAtual = currentInspecoes[inspecaoIndex]
    if (!inspecaoAtual) return

    const documentos = inspecaoAtual.documentos ?? []
    const novosDocumentos = documentos.filter((_, index) => index !== documentoIndex)
    
    form.setValue(
      `inspecoes.${inspecaoIndex}.documentos`,
      novosDocumentos,
      { shouldDirty: true, shouldValidate: false }
    )
    toast.success('Documento removido.')
  }
  
  // Função para abrir o diálogo de documentos da inspeção
  const handleOpenInspecaoDocumentosDialog = (inspecaoIndex: number) => {
    setInspecaoDocumentosDialogIndex(inspecaoIndex)
    setInspecaoDocumentosDialogOpen(true)
  }
  
  // Função para fechar o diálogo de documentos da inspeção
  const handleCloseInspecaoDocumentosDialog = () => {
    setInspecaoDocumentosDialogOpen(false)
    setInspecaoDocumentosDialogIndex(null)
  }
  
  // Função para visualizar um documento da inspeção
  const handleViewInspecaoDocumento = (documento: ViaturaDocumentoFormValue) => {
    if (!documento?.dados) return
    setInspecaoViewerDocumento(documento)
    setInspecaoViewerOpen(true)
  }
  
  // Função para fazer download de um documento da inspeção
  const handleDownloadInspecaoDocumento = (documento: ViaturaDocumentoFormValue) => {
    if (!documento?.dados) return

    if (documento.dados.startsWith('data:')) {
      const link = document.createElement('a')
      link.href = documento.dados
      link.download = documento.nome || 'documento'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } else if (documento.dados.startsWith('http://') || documento.dados.startsWith('https://')) {
      window.open(documento.dados, '_blank')
    }
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

  const handleAddAcidente = () => {
    appendAcidente({
      id: undefined,
      condutorId: '',
      dataHora: undefined as any,
      hora: '',
      culpa: false,
      descricaoAcidente: '',
      descricaoDanos: '',
      local: '',
      concelhoId: '',
      freguesiaId: '',
      codigoPostalId: '',
      localReparacao: '',
    })
  }


  // Inicializar hora dos acidentes vindos do backend e abas ativas
  useEffect(() => {
    if (acidentesValues && acidentesValues.length > 0) {
      acidentesValues.forEach((acidente, index) => {
        if (acidente?.dataHora && !acidente.hora) {
          const hora = `${acidente.dataHora.getHours().toString().padStart(2, '0')}:${acidente.dataHora.getMinutes().toString().padStart(2, '0')}`
          form.setValue(`acidentes.${index}.hora`, hora, { shouldDirty: false })
        }
      })
      
      // Inicializar abas ativas para acidentes sem aba definida
      if (acidenteFields && acidenteFields.length > 0) {
        acidenteFields.forEach((acidente) => {
          if (acidente && !activeAcidenteTab[acidente.fieldId]) {
            setActiveAcidenteTab((prev) => ({
              ...prev,
              [acidente.fieldId]: 'informacoes',
            }))
          }
        })
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [acidentesValues?.length, acidenteFields.length])


  const handleRemoveAcidente = (index: number) => {
    const acidente = acidenteFields[index]
    if (acidente) {
      setSavedAcidentes((prev) => {
        const next = new Set(prev)
        next.delete(acidente.fieldId)
        return next
      })
      setExpandedAcidentes((prev) => {
        const next = new Set(prev)
        next.delete(acidente.fieldId)
        return next
      })
    }
    removeAcidente(index)
  }

  // Handlers para botões de ação dos campos de acidentes
  const handleViewCondutor = (condutorId: string | undefined) => {
    if (condutorId) {
      navigate(`/base/funcionarios/${condutorId}`)
    }
  }

  const handleCreateCondutor = () => {
    navigate('/base/funcionarios/create')
  }

  const handleViewConcelho = (concelhoId: string | undefined) => {
    if (concelhoId) {
      navigate(`/base/concelhos/${concelhoId}`)
    }
  }

  const handleCreateConcelho = () => {
    navigate('/base/concelhos/create')
  }

  const handleViewFreguesia = (freguesiaId: string | undefined) => {
    if (freguesiaId) {
      navigate(`/base/freguesias/${freguesiaId}`)
    }
  }

  const handleCreateFreguesia = () => {
    navigate('/base/freguesias/create')
  }

  const handleViewCodigoPostal = (codigoPostalId: string | undefined) => {
    if (codigoPostalId) {
      navigate(`/base/codigos-postais/${codigoPostalId}`)
    }
  }

  const handleCreateCodigoPostal = () => {
    navigate('/base/codigos-postais/create')
  }

  const handleSaveAcidente = (index: number) => {
    const acidente = acidenteFields[index]
    if (!acidente) return

    const acidenteData = acidentesValues?.[index]
    if (!acidenteData) return

    // Validar campos obrigatórios
    const errors = form.formState.errors.acidentes?.[index]
    if (errors) {
      toast.error('Por favor, preencha todos os campos obrigatórios antes de guardar.')
      return
    }

    if (!acidenteData.condutorId || !acidenteData.dataHora) {
      toast.error('Por favor, preencha os campos obrigatórios: Condutor e Data.')
      return
    }

    // Combinar data e hora
    if (acidenteData.dataHora && acidenteData.hora) {
      const [hours, minutes] = acidenteData.hora.split(':').map(Number)
      const dataComHora = new Date(acidenteData.dataHora)
      dataComHora.setHours(hours || 0, minutes || 0, 0, 0)
      form.setValue(`acidentes.${index}.dataHora`, dataComHora, { shouldDirty: true })
    }

    setSavedAcidentes((prev) => new Set(prev).add(acidente.fieldId))
    setExpandedAcidentes((prev) => {
      const next = new Set(prev)
      next.delete(acidente.fieldId)
      return next
    })
    toast.success('Acidente guardado com sucesso.')
  }

  const handleToggleExpandAcidente = (index: number) => {
    const acidente = acidenteFields[index]
    if (!acidente) return

    setExpandedAcidentes((prev) => {
      const next = new Set(prev)
      if (next.has(acidente.fieldId)) {
        next.delete(acidente.fieldId)
      } else {
        next.add(acidente.fieldId)
      }
      return next
    })
  }

  const handleAddMulta = () => {
    appendMulta({
      id: undefined,
      condutorId: '',
      dataHora: undefined as any,
      hora: '',
      local: '',
      motivo: '',
      valor: 0,
    })
  }

  // Inicializar hora das multas vindas do backend
  useEffect(() => {
    if (multasValues && multasValues.length > 0) {
      multasValues.forEach((multa, index) => {
        if (multa?.dataHora && !multa.hora) {
          const hora = `${multa.dataHora.getHours().toString().padStart(2, '0')}:${multa.dataHora.getMinutes().toString().padStart(2, '0')}`
          form.setValue(`multas.${index}.hora`, hora, { shouldDirty: false })
        }
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [multasValues?.length, multaFields.length])

  const handleRemoveMulta = (index: number) => {
    const multa = multaFields[index]
    if (multa) {
      setSavedMultas((prev) => {
        const next = new Set(prev)
        next.delete(multa.fieldId)
        return next
      })
      setExpandedMultas((prev) => {
        const next = new Set(prev)
        next.delete(multa.fieldId)
        return next
      })
    }
    removeMulta(index)
  }

  const handleSaveMulta = (index: number) => {
    const multa = multaFields[index]
    if (!multa) return

    const multaData = multasValues?.[index]
    if (!multaData) return

    // Validar campos obrigatórios
    const errors = form.formState.errors.multas?.[index]
    if (errors) {
      toast.error('Por favor, preencha todos os campos obrigatórios antes de guardar.')
      return
    }

    if (!multaData.condutorId || !multaData.dataHora || !multaData.local || !multaData.motivo || multaData.valor === undefined) {
      toast.error('Por favor, preencha os campos obrigatórios: Condutor, Data, Local, Motivo e Valor.')
      return
    }

    // Combinar data e hora
    if (multaData.dataHora && multaData.hora) {
      const [hours, minutes] = multaData.hora.split(':').map(Number)
      const dataComHora = new Date(multaData.dataHora)
      dataComHora.setHours(hours || 0, minutes || 0, 0, 0)
      form.setValue(`multas.${index}.dataHora`, dataComHora, { shouldDirty: true })
    }

    setSavedMultas((prev) => new Set(prev).add(multa.fieldId))
    setExpandedMultas((prev) => {
      const next = new Set(prev)
      next.delete(multa.fieldId)
      return next
    })
    toast.success('Multa guardada com sucesso.')
  }

  const handleToggleExpandMulta = (index: number) => {
    const multa = multaFields[index]
    if (!multa) return

    setExpandedMultas((prev) => {
      const next = new Set(prev)
      if (next.has(multa.fieldId)) {
        next.delete(multa.fieldId)
      } else {
        next.add(multa.fieldId)
      }
      return next
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
      condutorIds: 'condutores',
      inspecoes: 'inspecoes',
      acidentes: 'acidentes',
      multas: 'multas',
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

  const handleCreateFuncionario = () => openCreation(openFuncionarioCreationWindow)
  const handleViewFuncionario = (funcionarioId: string) =>
    openView(
      openFuncionarioViewWindow,
      funcionarioId,
      'Não foi possível abrir o funcionário selecionado'
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

  useAutoSelectionWithReturnData({
    windowId: parentWindowId,
    instanceId,
    data: funcionarios,
    setValue: (value: string) => {
      addCondutorToForm(value)
    },
    refetch: refetchFuncionarios,
    itemName: 'Funcionário',
    successMessage: 'Condutor selecionado automaticamente',
    manualSelectionMessage:
      'Funcionário criado com sucesso. Por favor, selecione-o manualmente.',
    queryKey: ['funcionarios-select'],
    returnDataKey: `return-data-${parentWindowId}-funcionario`,
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
            <PersistentTabsTrigger value='identificacao' className='h-9 px-3 py-1.5'>
              <Car className='mr-1.5 h-3.5 w-3.5' />
              Identificação
            </PersistentTabsTrigger>
            <PersistentTabsTrigger value='caracterizacao' className='h-9 px-3 py-1.5'>
              <Settings className='mr-1.5 h-3.5 w-3.5' />
              Caraterização
            </PersistentTabsTrigger>
            <PersistentTabsTrigger value='locacao' className='h-9 px-3 py-1.5'>
              <MapPin className='mr-1.5 h-3.5 w-3.5' />
              Locação
            </PersistentTabsTrigger>
            <PersistentTabsTrigger value='inspecoes' className='h-9 px-3 py-1.5'>
              <ClipboardCheckIcon className='mr-1.5 h-3.5 w-3.5' />
              Inspeções
            </PersistentTabsTrigger>
            <PersistentTabsTrigger value='seguros' className='h-9 px-3 py-1.5'>
              <ShieldCheck className='mr-1.5 h-3.5 w-3.5' />
              Seguros
            </PersistentTabsTrigger>
            <PersistentTabsTrigger value='garantias' className='h-9 px-3 py-1.5'>
              <ShieldPlus className='mr-1.5 h-3.5 w-3.5' />
              Garantias
            </PersistentTabsTrigger>
            <PersistentTabsTrigger value='notas' className='h-9 px-3 py-1.5'>
              <FileText className='mr-1.5 h-3.5 w-3.5' />
              Notas
            </PersistentTabsTrigger>
            <PersistentTabsTrigger value='equipamento' className='h-9 px-3 py-1.5'>
              <Wrench className='mr-1.5 h-3.5 w-3.5' />
              Equipamento Extra
            </PersistentTabsTrigger>
            <PersistentTabsTrigger value='condutores' className='h-9 px-3 py-1.5'>
              <User className='mr-1.5 h-3.5 w-3.5' />
              Condutores
            </PersistentTabsTrigger>
            <PersistentTabsTrigger value='acidentes' className='h-9 px-3 py-1.5'>
              <AlertTriangle className='mr-1.5 h-3.5 w-3.5' />
              Danos/Acidentes
            </PersistentTabsTrigger>
            <PersistentTabsTrigger value='multas' className='h-9 px-3 py-1.5'>
              <FileText className='mr-1.5 h-3.5 w-3.5' />
              Multas
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
                      <div className='flex flex-col gap-4'>
                        <FormField
                          control={form.control}
                          name='imagem'
                          render={({ field }) => (
                            <FormItem className='mt-8'>
                              <FormLabel className='sr-only'>Foto da Viatura</FormLabel>
                              <FormControl>
                                <FotoViaturaUploader
                                  value={field.value ?? []}
                                  onChange={field.onChange}
                                  viaturaId={viaturaId}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
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
                        <FormField
                          control={form.control}
                          name='countryCode'
                          render={({ field }) => (
                            <FormItem className='relative z-50 w-full'>
                              <FormLabel className='text-sm'>País</FormLabel>
                              <FormControl>
                                <ReactFlagsSelect
                                  selected={field.value || 'PT'}
                                  onSelect={(code) => {
                                    // Limpa a matrícula quando o país muda
                                    if (field.value !== code) {
                                      form.setValue('matricula', '')
                                    }
                                    field.onChange(code)
                                  }}
                                  countries={europeanCountryCodes}
                                  customLabels={europeanCountries}
                                  searchable
                                  searchPlaceholder='Procurar país...'
                                  placeholder='Selecione um país'
                                  className='flag-select'
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
                        <FormField
                          control={form.control}
                          name='matricula'
                          render={({ field }) => {
                            const countryCode = form.watch('countryCode') || 'PT'
                            const config = getLicensePlateConfig(countryCode)
                            
                            const handleMatriculaChange = (value: string) => {
                              // Formata automaticamente baseado no país
                              const formatted = formatLicensePlate(value, countryCode)
                              field.onChange(formatted)
                            }

                            return (
                              <FormItem>
                                <FormLabel className='sr-only'>Matrícula</FormLabel>
                                <FormControl>
                                  <div className='flex justify-center py-2'>
                                    <LicensePlateDisplay
                                      countryCode={countryCode}
                                      plateId={field.value ?? ''}
                                      height={80}
                                      editable
                                      onChange={handleMatriculaChange}
                                      onBlur={field.onBlur}
                                      name={field.name}
                                      ref={field.ref}
                                    />
                                  </div>
                                </FormControl>
                                {config && (
                                  <p className='text-xs text-muted-foreground mt-1 text-center'>
                                    {config.description}
                                  </p>
                                )}
                                <FormMessage />
                              </FormItem>
                            )
                          }}
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
                          <FormLabel className='sr-only'>Tipo de motorização</FormLabel>
                          <FormControl>
                            <ToggleGroup
                              type='single'
                              value={field.value || undefined}
                              onValueChange={(value) => {
                                // Permite deselecionar: se clicar novamente no item selecionado, value será undefined
                                field.onChange(value || '')
                              }}
                              className='grid gap-3 md:grid-cols-2'
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
                              value={field.value ?? ''}
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
                              value={field.value ?? ''}
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
                              value={field.value ?? ''}
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
                              value={field.value ?? ''}
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
                              value={field.value ?? ''}
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
                              value={field.value ?? ''}
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
                              value={field.value ?? ''}
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
                              value={field.value ?? ''}
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
                              value={field.value ?? ''}
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
                                  value={field.value ?? ''}
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
                                  value={field.value ?? ''}
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
                                      value={field.value ?? ''}
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
                          <>
                            <FormField
                              control={form.control}
                              name='autonomia'
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>
                                    {isPlugInHybrid ? 'Autonomia Elétrica (km)' : 'Autonomia (km)'}
                                  </FormLabel>
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
                            {isPlugInHybrid ? (
                              <FormField
                                control={form.control}
                                name='consumoEletrico'
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Consumo Elétrico (kWh/100km)</FormLabel>
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
                          </>
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
                          <>
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
                            {isPlugInHybrid ? (
                              <>
                                <FormField
                                  control={form.control}
                                  name='potenciaMotorEletrico'
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Potência Motor Elétrico (kW)</FormLabel>
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
                                <FormField
                                  control={form.control}
                                  name='potenciaCombinada'
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Potência Combinada (cv)</FormLabel>
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
                                <FormField
                                  control={form.control}
                                  name='tempoCarregamento'
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Tempo de Carregamento (horas)</FormLabel>
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
                                          placeholder='Tempo de carregamento lento/AC'
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </>
                            ) : null}
                            {isElectricPropulsion ? (
                              <FormField
                                control={form.control}
                                name='voltagemTotal'
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Voltagem Total (V)</FormLabel>
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
                                        placeholder='Para cálculo IUC elétricos'
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            ) : null}
                          </>
                        ) : null}
                        {showCombustivelFields ? (
                          <>
                            <FormField
                              control={form.control}
                              name='emissoesCO2'
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Emissões CO₂ (g/km)</FormLabel>
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
                                      placeholder='Para cálculo IUC (matrícula ≥ julho 2007)'
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name='padraoCO2'
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Padrão CO₂</FormLabel>
                                  <FormControl>
                                    <Select
                                      value={field.value || undefined}
                                      onValueChange={(value) => {
                                        field.onChange(value || '')
                                      }}
                                      disabled={!motorizacaoSelecionada || !form.watch('emissoesCO2')}
                                    >
                                      <SelectTrigger className={TEXT_INPUT_CLASS}>
                                        <SelectValue placeholder='Selecione o padrão CO₂' />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {PADRAO_CO2_OPTIONS.map((option) => (
                                          <SelectItem key={option.value} value={option.value}>
                                            <div className='flex flex-col'>
                                              <span className='font-medium'>{option.label}</span>
                                              <span className='text-xs text-muted-foreground'>
                                                {option.description}
                                              </span>
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
                          </>
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
                                  value={field.value ?? ''}
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

                  <div className='grid gap-6 md:grid-cols-2'>
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

                    <FormSection
                      icon={FolderOpen}
                      title='Documentação do Contrato'
                      description='Anexe documentos do contrato de locação (contratos, faturas, etc.)'
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
                                viaturaId={viaturaId}
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
                    <div className='space-y-3'>
                      <div className='flex items-center justify-between rounded-lg border border-border/60 bg-muted/5 px-3 py-2'>
                        <div className='flex items-center gap-2'>
                          <div className='flex h-7 w-7 items-center justify-center rounded-md bg-primary/10 text-primary'>
                            <ClipboardCheckIcon className='h-3.5 w-3.5' />
                          </div>
                          <div>
                            <h3 className='text-xs font-semibold text-foreground'>
                              Inspeções Registadas
                            </h3>
                            <p className='text-[10px] text-muted-foreground'>
                              {inspectionFields.length} inspeção{inspectionFields.length !== 1 ? 'ões' : ''} no histórico
                            </p>
                          </div>
                        </div>
                        <Badge variant='secondary' className='rounded-full px-2 py-0.5 text-[10px] font-medium'>
                          {inspectionFields.length} total
                        </Badge>
                      </div>

                      <div className='grid gap-2.5 md:grid-cols-2 lg:grid-cols-3'>
                        {inspectionFields.map((inspection, index) => {
                          const inspectionData = inspecoesValues?.[index]
                          const inspeccaoRealizada = formatDateLabel(inspectionData?.dataInspecao)
                          const proximaInspecao = formatDateLabel(inspectionData?.dataProximaInspecao)
                          const documentos = inspectionData?.documentos || []
                          const documentosCount = documentos.length
                          const resultado = inspectionData?.resultado?.toLowerCase() || ''
                          const isAprovado = resultado.includes('aprovado') || resultado.includes('aprovada')
                          const isReprovado = resultado.includes('reprovado') || resultado.includes('reprovada') || resultado.includes('rejeitado')

                          // Determinar cor do badge de resultado
                          const resultadoBadgeVariant = isAprovado
                            ? 'default'
                            : isReprovado
                              ? 'destructive'
                              : 'secondary'

                          // Determinar se a próxima inspeção está próxima ou atrasada
                          const hoje = new Date()
                          const proximaInspecaoDate = inspectionData?.dataProximaInspecao
                          const isProximaInspecaoProxima =
                            proximaInspecaoDate &&
                            proximaInspecaoDate instanceof Date &&
                            proximaInspecaoDate <= new Date(hoje.getTime() + 30 * 24 * 60 * 60 * 1000) &&
                            proximaInspecaoDate >= hoje
                          const isProximaInspecaoAtrasada =
                            proximaInspecaoDate &&
                            proximaInspecaoDate instanceof Date &&
                            proximaInspecaoDate < hoje

                          return (
                            <div
                              key={inspection.fieldId}
                              className='group relative flex h-full flex-col overflow-hidden rounded-lg border border-border/60 bg-background shadow-sm transition-all duration-200 hover:border-primary/40 hover:shadow-md'
                            >
                              {/* Header com gradiente sutil */}
                              <div className='relative border-b border-border/50 bg-gradient-to-r from-muted/30 to-muted/10 px-2.5 py-2'>
                                <div className='flex items-start justify-between gap-1.5'>
                                  <div className='flex items-start gap-1.5 flex-1 min-w-0'>
                                    <div
                                      className={cn(
                                        'flex h-6 w-6 flex-shrink-0 items-center justify-center rounded shadow-sm transition-colors',
                                        isAprovado
                                          ? 'bg-green-500/10 text-green-600 dark:text-green-400'
                                          : isReprovado
                                            ? 'bg-red-500/10 text-red-600 dark:text-red-400'
                                            : 'bg-primary/10 text-primary'
                                      )}
                                    >
                                      <ClipboardCheckIcon className='h-3 w-3' />
                                    </div>
                                    <div className='min-w-0 flex-1'>
                                      <div className='flex items-center gap-1 mb-0.5'>
                                        <h4 className='text-[10px] font-semibold text-foreground truncate'>
                                          Inspeção #{index + 1}
                                        </h4>
                                        {resultado && (
                                          <Badge
                                            variant={resultadoBadgeVariant}
                                            className={cn(
                                              'rounded-full px-1 py-0 text-[8px] font-medium leading-none',
                                              isAprovado && 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20',
                                              isReprovado && 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20'
                                            )}
                                          >
                                            {inspectionData.resultado}
                                          </Badge>
                                        )}
                                      </div>
                                      {inspeccaoRealizada && (
                                        <div className='flex items-center gap-0.5 text-[9px] text-muted-foreground'>
                                          <CalendarDays className='h-2 w-2' />
                                          <span>Realizada em {inspeccaoRealizada}</span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Conteúdo principal */}
                              <div className='flex-1 flex flex-col space-y-2.5 p-3'>
                                {/* Campos de edição - em linha */}
                                <div className='grid grid-cols-3 gap-2'>
                                  <FormField
                                    control={form.control}
                                    name={`inspecoes.${index}.dataInspecao`}
                                    render={({ field }) => (
                                      <FormItem className='space-y-0.5'>
                                        <FormLabel className='text-[9px] font-medium leading-tight text-left'>Data da Inspeção</FormLabel>
                                        <FormControl>
                                          <DatePicker
                                            value={field.value || undefined}
                                            onChange={field.onChange}
                                            allowClear
                                            className='h-7 text-[8px] justify-center px-2 [&_svg]:mr-1 [&_svg]:h-3 [&_svg]:w-3'
                                          />
                                        </FormControl>
                                        <FormMessage className='text-[8px]' />
                                      </FormItem>
                                    )}
                                  />
                                  <FormField
                                    control={form.control}
                                    name={`inspecoes.${index}.resultado`}
                                    render={({ field }) => (
                                      <FormItem className='space-y-0.5'>
                                        <FormLabel className='text-[9px] font-medium leading-tight'>Resultado</FormLabel>
                                        <FormControl>
                                          <Input
                                            {...field}
                                            placeholder='Ex.: Aprovado'
                                            className='h-[1.75rem] text-[9.5px] px-2 py-0.5 shadow-inner'
                                          />
                                        </FormControl>
                                        <FormMessage className='text-[8px]' />
                                      </FormItem>
                                    )}
                                  />
                                  <FormField
                                    control={form.control}
                                    name={`inspecoes.${index}.dataProximaInspecao`}
                                    render={({ field }) => (
                                      <FormItem className='space-y-0.5'>
                                        <FormLabel className='text-[9px] font-medium leading-tight text-left'>Próxima Inspeção</FormLabel>
                                        <FormControl>
                                          <DatePicker
                                            value={field.value || undefined}
                                            onChange={field.onChange}
                                            allowClear
                                            className='h-7 text-[8px] justify-center px-2 [&_svg]:mr-1 [&_svg]:h-3 [&_svg]:w-3'
                                          />
                                        </FormControl>
                                        <FormMessage className='text-[8px]' />
                                      </FormItem>
                                    )}
                                  />
                                </div>

                                {/* Informações adicionais - apenas se necessário */}
                                {(isProximaInspecaoAtrasada || isProximaInspecaoProxima) && proximaInspecao && (
                                  <div className='space-y-1 pt-1.5 border-t border-border/30 mt-auto'>
                                    <div
                                      className={cn(
                                        'rounded border px-1.5 py-0.5',
                                        isProximaInspecaoAtrasada
                                          ? 'border-red-500/30 bg-red-500/5'
                                          : 'border-amber-500/30 bg-amber-500/5'
                                      )}
                                    >
                                      <div className='flex items-center gap-1'>
                                        <CalendarDays
                                          className={cn(
                                            'h-2.5 w-2.5 flex-shrink-0',
                                            isProximaInspecaoAtrasada
                                              ? 'text-red-600 dark:text-red-400'
                                              : 'text-amber-600 dark:text-amber-400'
                                          )}
                                        />
                                        <p
                                          className={cn(
                                            'text-[9px] font-medium leading-tight',
                                            isProximaInspecaoAtrasada
                                              ? 'text-red-700 dark:text-red-300'
                                              : 'text-amber-700 dark:text-amber-300'
                                          )}
                                        >
                                          {isProximaInspecaoAtrasada
                                            ? '⚠️ Atrasada'
                                            : '⏰ Em breve'}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>

                              {/* Footer com ações */}
                              <div className='border-t border-border/50 bg-muted/20 px-2.5 py-1.5'>
                                <div className='flex items-center justify-between gap-1'>
                                  <div className='flex items-center gap-1'>
                                    <Button
                                      type='button'
                                      variant='outline'
                                      size='sm'
                                      onClick={() => handleOpenInspecaoUploadDialog(index)}
                                      className='h-5 gap-0.5 text-[9px] px-1.5'
                                    >
                                      <FileText className='h-2.5 w-2.5' />
                                      Anexar
                                    </Button>
                                    <Button
                                      type='button'
                                      variant='outline'
                                      size='sm'
                                      onClick={() => handleOpenInspecaoDocumentosDialog(index)}
                                      disabled={documentosCount === 0}
                                      className='h-5 gap-0.5 text-[9px] px-1.5'
                                    >
                                      <Eye className='h-2.5 w-2.5' />
                                      Ver documentos
                                    </Button>
                                  </div>
                                  <Button
                                    type='button'
                                    variant='ghost'
                                    size='sm'
                                    onClick={() => handleRemoveInspection(index)}
                                    className='h-5 gap-0.5 text-[9px] px-1.5 text-destructive hover:text-destructive hover:bg-destructive/10'
                                  >
                                    <Trash2 className='h-2.5 w-2.5' />
                                    Remover
                                  </Button>
                                </div>
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
                              className='shadow-inner drop-shadow-xl documentation-scroll resize-none pr-3'
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
                      
                      {/* Exibição automática do IUC */}
                      {iucResult.valor !== null ? (
                        <div className='mt-4 rounded-lg border border-primary/20 bg-primary/5 p-4'>
                          <div className='flex items-center gap-2'>
                            <PiggyBank className='h-4 w-4 text-primary' />
                            <FormLabel className='text-sm font-semibold text-foreground'>
                              Imposto Único de Circulação (IUC) - 2026
                            </FormLabel>
                          </div>
                          <div className='mt-2'>
                            {iucResult.valor === 0 ? (
                              <p className='text-xl font-bold text-green-600 dark:text-green-400'>
                                Isento
                              </p>
                            ) : (
                              <p className='text-2xl font-bold text-primary'>
                                {iucResult.valor.toFixed(2)}€
                              </p>
                            )}
                            <p className='mt-1 text-xs text-muted-foreground'>
                              {iucResult.mensagem}
                            </p>
                            {iucResult.detalhes && (
                              <p className='mt-2 text-xs text-muted-foreground/80 italic'>
                                {iucResult.detalhes}
                              </p>
                            )}
                            {!iucResult.calculoCompleto && (
                              <p className='mt-2 text-xs text-amber-600 dark:text-amber-400'>
                                ⚠️ Cálculo parcial - faltam dados adicionais
                              </p>
                            )}
                          </div>
                        </div>
                      ) : iucResult.mensagem && (
                        <div className='mt-4 rounded-lg border border-muted bg-muted/30 p-4'>
                          <div className='flex items-center gap-2'>
                            <PiggyBank className='h-4 w-4 text-muted-foreground' />
                            <FormLabel className='text-sm font-medium text-muted-foreground'>
                              Imposto Único de Circulação (IUC)
                            </FormLabel>
                          </div>
                          <p className='mt-2 text-xs text-muted-foreground'>
                            {iucResult.mensagem}
                          </p>
                          {iucResult.detalhes && (
                            <p className='mt-2 text-xs text-muted-foreground/80 italic'>
                              {iucResult.detalhes}
                            </p>
                          )}
                        </div>
                      )}
                    </FormSection>

                    <FormSection
                      icon={FolderOpen}
                      title='Documentação'
                      description='Anexe documentos relevantes da viatura (documentos, fotos, certificados, etc.)'
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
                                viaturaId={viaturaId}
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

          {/* Condutores */}
          <PersistentTabsContent value='condutores'>
            <div className='space-y-6'>
              <Card className='overflow-hidden border-l-4 border-l-primary/20 transition-all duration-200 hover:border-l-primary/40 hover:shadow-md'>
                <CardHeader className='pb-4'>
                  <div className='flex items-center gap-3'>
                    <div className='flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary'>
                      <User className='h-4 w-4' />
                    </div>
                    <div>
                      <CardTitle className='flex items-center gap-2 text-base'>
                        Condutores
                      </CardTitle>
                      <p className='mt-1 text-sm text-muted-foreground'>
                        Associe funcionários como condutores da viatura
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className='space-y-6'>
                  <FormField
                    control={form.control}
                    name='condutorIds'
                    render={() => (
                      <FormItem>
                        <FormLabel>Condutor</FormLabel>
                        <FormControl>
                          <div className='space-y-4'>
                            <div className='flex flex-col gap-3 md:flex-row md:items-center md:gap-4'>
                              <div className='flex flex-col gap-2 md:flex-row md:items-center md:gap-2 md:flex-1'>
                                <div className='w-full md:flex-1'>
                                  <div className='relative'>
                          <Autocomplete
                            options={selectOptions.funcionarios}
                                      value={selectedCondutorId}
                                      onValueChange={setSelectedCondutorId}
                                      placeholder={placeholder(
                                        selectLoading.funcionarios,
                                        'o condutor'
                                      )}
                            disabled={selectLoading.funcionarios}
                                      className={SELECT_WITH_ACTIONS_CLASS}
                                    />
                                    <div className='absolute right-12 top-1/2 -translate-y-1/2 flex gap-1'>
                                      <Button
                                        type='button'
                                        variant='outline'
                                        size='sm'
                                        onClick={() => handleViewFuncionario(selectedCondutorId)}
                                        title='Ver Funcionário'
                                        disabled={!selectedCondutorId}
                                      className='h-8 w-8 p-0'
                                      >
                                        <Eye className='h-4 w-4' />
                                      </Button>
                                      <Button
                                        type='button'
                                        variant='outline'
                                        size='sm'
                                        onClick={handleCreateFuncionario}
                                        title='Criar novo funcionário'
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
                                  onClick={handleAddCondutor}
                                  disabled={!selectedCondutorId}
                                >
                                  Adicionar
                                </Button>
                              </div>
                            </div>
                            {condutoresSelecionadosDetalhes.length > 0 ? (
                              <div className='space-y-4 rounded-xl border border-border/60 bg-muted/10 p-4 shadow-inner sm:p-5'>
                                <div className='flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'>
                                  <div className='flex items-center gap-2 text-sm font-semibold text-foreground'>
                                    <CheckSquare className='h-4 w-4 text-primary' />
                                    Condutores selecionados
                                    <Badge variant='secondary' className='rounded-full px-2 py-0 text-xs'>
                                      {condutoresSelecionadosDetalhes.length}
                                    </Badge>
                                  </div>
                                  <p className='text-xs text-muted-foreground'>
                                    Revise os condutores associados antes de concluir o registo da viatura.
                                  </p>
                                </div>

                                <div className='grid gap-3 md:grid-cols-2 xl:grid-cols-3'>
                                  {condutoresSelecionadosDetalhes.map(({ id, label }) => {
                                    const condutorIndisponivel = label === 'Condutor indisponível'
                                    const condutorDocumentos = condutoresDocumentos[id] ?? []
                                    return (
                                      <div
                                        key={id}
                                        className='group flex h-full flex-col justify-between gap-3 rounded-lg border border-border/70 bg-background p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-md'
                                      >
                                        <div className='flex items-start gap-3'>
                                          <div className='flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary'>
                                            <User className='h-5 w-5' />
                                          </div>
                                          <div className='min-w-0 flex-1 space-y-1'>
                                            <div className='flex items-start justify-between gap-2'>
                                              <p className='truncate text-sm font-medium text-foreground'>
                                                {label}
                                              </p>
                                              {condutorIndisponivel && (
                                                <Badge
                                                  variant='outline'
                                                  className='inline-flex items-center rounded-full border-destructive/30 bg-destructive/10 px-2 py-[2px] text-[11px] font-medium text-destructive'
                                                >
                                                  Indisponível
                                                </Badge>
                                              )}
                                            </div>
                                            {!condutorIndisponivel && condutoresCargosMap.get(id) && (
                                              <p className='text-xs text-muted-foreground'>
                                                {condutoresCargosMap.get(id)}
                                              </p>
                                            )}
                                            {condutorIndisponivel && (
                                              <p className='text-xs text-muted-foreground'>
                                                Este condutor já não está disponível. Considere removê-lo.
                                              </p>
                                            )}
                                            {condutorDocumentos.length > 0 && (
                                              <div className='mt-2'>
                                                <Badge 
                                                  variant='secondary' 
                                                  className='cursor-pointer hover:bg-secondary/80'
                                                  onClick={() => handleOpenCondutorDocumentosDialog(id)}
                                                >
                                                  <FileText className='mr-1 h-3 w-3' />
                                                  {condutorDocumentos.length} {condutorDocumentos.length === 1 ? 'documento' : 'documentos'}
                                                </Badge>
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                        <div className='flex flex-wrap justify-end gap-2'>
                                          <Button
                                            type='button'
                                            variant='outline'
                                            size='sm'
                                            onClick={() => handleOpenCondutorUploadDialog(id)}
                                            title='Anexar Ficheiros'
                                            disabled={condutorIndisponivel}
                                            className={cn(
                                              'gap-2',
                                              condutorIndisponivel && 'pointer-events-none opacity-60'
                                            )}
                                          >
                                            <FileText className='h-4 w-4' />
                                            Anexar
                                          </Button>
                                          <Button
                                            type='button'
                                            variant='outline'
                                            size='sm'
                                            onClick={() => handleViewFuncionario(id)}
                                            title='Ver Funcionário'
                                            disabled={condutorIndisponivel}
                                            className={cn(
                                              'gap-2',
                                              condutorIndisponivel && 'pointer-events-none opacity-60'
                                            )}
                                          >
                                            <Eye className='h-4 w-4' />
                                            Ver
                                          </Button>
                                          <Button
                                            type='button'
                                            variant='ghost'
                                            size='sm'
                                            onClick={() => handleRemoveCondutor(id)}
                                            title='Remover Condutor'
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
                                  <User className='h-6 w-6' />
                                </div>
                                <h4 className='mt-4 text-sm font-semibold text-foreground'>Sem condutores associados</h4>
                                <p className='mt-2 text-sm text-muted-foreground'>
                                  Adicione funcionários como condutores da viatura para registar todos os condutores autorizados.
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

          {/* Avaliação de Danos/Acidentes */}
          <PersistentTabsContent value='acidentes'>
            <div className='space-y-6'>
              <Card className='overflow-hidden border-l-4 border-l-primary/20 transition-all duration-200 hover:border-l-primary/40 hover:shadow-md'>
                <CardHeader className='pb-4'>
                  <div className='flex items-center gap-3'>
                    <div className='flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary'>
                      <AlertTriangle className='h-4 w-4' />
                    </div>
                    <div>
                      <CardTitle className='flex items-center gap-2 text-base'>
                        Avaliação de Danos/Acidentes
                      </CardTitle>
                      <p className='mt-1 text-sm text-muted-foreground'>
                        Registe acidentes e danos ocorridos com esta viatura.
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className='space-y-6'>
                  <div className='flex flex-col gap-3 md:flex-row md:items-center md:justify-between'>
                    <p className='text-sm text-muted-foreground'>
                      Adicione registos de acidentes e danos com todas as informações relevantes.
                    </p>
                    <Button
                      type='button'
                      variant='secondary'
                      size='default'
                      className='md:min-w-[220px]'
                      onClick={handleAddAcidente}
                    >
                      Adicionar
                    </Button>
                  </div>
                  {acidenteFields.length === 0 ? (
                    <div className='rounded-xl border border-dashed border-border/70 bg-muted/5 p-6 text-center shadow-inner'>
                      <div className='mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary'>
                        <AlertTriangle className='h-6 w-6' />
                      </div>
                      <h4 className='mt-4 text-sm font-semibold text-foreground'>
                        Sem acidentes/danos registados
                      </h4>
                      <p className='mt-2 text-sm text-muted-foreground'>
                        Clique em "Adicionar" para registar um acidente ou dano ocorrido com esta viatura.
                      </p>
                    </div>
                  ) : (
                    <div className='space-y-4 rounded-xl border border-border/60 bg-muted/10 p-4 shadow-inner sm:p-5'>
                      <div className='flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'>
                        <div className='flex items-center gap-2 text-sm font-semibold text-foreground'>
                          <AlertTriangle className='h-4 w-4 text-primary' />
                          Acidentes/Danos registados
                          <Badge variant='secondary' className='rounded-full px-2 py-0 text-xs'>
                            {acidenteFields.length}
                          </Badge>
                        </div>
                        <p className='text-xs text-muted-foreground'>
                          Edite as informações conforme necessário e remova registos que já não sejam relevantes.
                        </p>
                      </div>

                      <div className='space-y-4'>
                        {acidenteFields.map((acidente, index) => {
                          const acidenteData = acidentesValues?.[index]
                          const dataHoraFormatada = formatDateLabel(acidenteData?.dataHora)
                          // Se o acidente tem ID, considerar como guardado automaticamente
                          const hasId = !!acidenteData?.id
                          const isSaved = hasId || savedAcidentes.has(acidente.fieldId)
                          const isExpanded = expandedAcidentes.has(acidente.fieldId)
                          
                          const condutorNome = acidenteData?.condutorId
                            ? selectOptions.funcionarios.find((f) => f.value === acidenteData.condutorId)?.label || 'Não definido'
                            : 'Não definido'

                          return (
                            <div
                              key={acidente.fieldId}
                              className={cn(
                                'group rounded-lg border border-border/70 bg-background p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-md md:p-5',
                                isSaved && !isExpanded && 'space-y-3'
                              )}
                            >
                              <div className='flex flex-col gap-3 border-b border-border/60 pb-4 sm:flex-row sm:items-center sm:justify-between'>
                                <div className='flex items-center gap-3'>
                                  <div className='flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary'>
                                    <AlertTriangle className='h-5 w-5' />
                                  </div>
                                  <div>
                                    <div className='flex items-center gap-2'>
                                      <p className='text-sm font-semibold text-foreground'>
                                        Acidente/Dano #{index + 1}
                                      </p>
                                      {isSaved && (
                                        <Badge variant='outline' className='rounded-full border-primary/30 bg-primary/10 text-primary font-medium text-[10px]'>
                                          Guardado
                                        </Badge>
                                      )}
                                    </div>
                                    <p className='text-xs text-muted-foreground'>
                                      {dataHoraFormatada
                                        ? `Ocorrido em ${dataHoraFormatada}.`
                                        : 'Data/hora ainda não definida.'}
                                    </p>
                                  </div>
                                </div>
                                <div className='flex items-center gap-2'>
                                  {isSaved ? (
                                    <>
                                      <Button
                                        type='button'
                                        variant='outline'
                                        size='sm'
                                        onClick={() => handleToggleExpandAcidente(index)}
                                        className='gap-2'
                                      >
                                        {isExpanded ? (
                                          <>
                                            <ChevronUp className='h-4 w-4' />
                                            Ocultar
                                          </>
                                        ) : (
                                          <>
                                            <Eye className='h-4 w-4' />
                                            Ver dados
                                          </>
                                        )}
                                      </Button>
                                      <Button
                                        type='button'
                                        variant='ghost'
                                        size='sm'
                                        onClick={() => handleRemoveAcidente(index)}
                                        className='text-destructive hover:text-destructive'
                                      >
                                        <Trash2 className='h-4 w-4' />
                                      </Button>
                                    </>
                                  ) : (
                                    <>
                                      <Button
                                        type='button'
                                        variant='default'
                                        size='sm'
                                        onClick={() => handleSaveAcidente(index)}
                                        className='gap-2'
                                      >
                                        <Save className='h-4 w-4' />
                                        Guardar
                                      </Button>
                                      <Button
                                        type='button'
                                        variant='ghost'
                                        size='sm'
                                        onClick={() => handleRemoveAcidente(index)}
                                        className='text-destructive hover:text-destructive'
                                      >
                                        <Trash2 className='h-4 w-4' />
                                      </Button>
                                    </>
                                  )}
                                </div>
                              </div>

                              {isSaved && !isExpanded ? (
                                <Card className='border-l-4 border-l-primary/50 shadow-sm'>
                                  <CardContent className='p-4'>
                                    <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
                                      <div className='flex items-start gap-3 rounded-lg bg-muted/50 p-3 transition-colors hover:bg-muted/70'>
                                        <div className='mt-0.5 rounded-full bg-primary/10 p-2'>
                                          <User className='h-4 w-4 text-primary' />
                                        </div>
                                        <div className='flex-1 space-y-1'>
                                          <p className='text-xs font-semibold uppercase tracking-wide text-muted-foreground'>
                                            Condutor
                                          </p>
                                          <p className='text-sm font-medium text-foreground'>{condutorNome || 'Não definido'}</p>
                                        </div>
                                      </div>
                                      <div className='flex items-start gap-3 rounded-lg bg-muted/50 p-3 transition-colors hover:bg-muted/70'>
                                        <div className='mt-0.5 rounded-full bg-primary/10 p-2'>
                                          <CalendarDays className='h-4 w-4 text-primary' />
                                        </div>
                                        <div className='flex-1 space-y-1'>
                                          <p className='text-xs font-semibold uppercase tracking-wide text-muted-foreground'>
                                            Data
                                          </p>
                                          <p className='text-sm font-medium text-foreground'>
                                            {dataHoraFormatada || 'Não definida'}
                                          </p>
                                        </div>
                                      </div>
                                      <div className='flex items-start gap-3 rounded-lg bg-muted/50 p-3 transition-colors hover:bg-muted/70'>
                                        <div className='mt-0.5 rounded-full bg-primary/10 p-2'>
                                          <MapPin className='h-4 w-4 text-primary' />
                                        </div>
                                        <div className='flex-1 space-y-1'>
                                          <p className='text-xs font-semibold uppercase tracking-wide text-muted-foreground'>
                                            Local
                                          </p>
                                          <p className='text-sm font-medium text-foreground'>
                                            {acidenteData?.local || 'Não definido'}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              ) : (
                                <Tabs
                                  value={activeAcidenteTab[acidente.fieldId] || 'informacoes'}
                                  onValueChange={(value) => {
                                    setActiveAcidenteTab((prev) => ({
                                      ...prev,
                                      [acidente.fieldId]: value,
                                    }))
                                  }}
                                  className='w-full'
                                >
                                  <div className='mb-4'>
                                    <TabsList className='inline-flex h-8 items-center justify-start rounded-md bg-muted p-0.5 text-muted-foreground w-full'>
                                      <TabsTrigger 
                                        value='informacoes' 
                                        className='inline-flex items-center justify-center whitespace-nowrap rounded-sm px-2.5 py-1 text-xs font-medium transition-all focus-visible:outline-none focus-visible:ring-0 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm gap-1.5 flex-1 h-7'
                                      >
                                        <FileText className='h-3 w-3' />
                                        <span>Informações</span>
                                      </TabsTrigger>
                                      <TabsTrigger 
                                        value='localizacao' 
                                        className='inline-flex items-center justify-center whitespace-nowrap rounded-sm px-2.5 py-1 text-xs font-medium transition-all focus-visible:outline-none focus-visible:ring-0 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm gap-1.5 flex-1 h-7'
                                      >
                                        <MapPin className='h-3 w-3' />
                                        <span>Localização</span>
                                      </TabsTrigger>
                                      <TabsTrigger 
                                        value='reparacao' 
                                        className='inline-flex items-center justify-center whitespace-nowrap rounded-sm px-2.5 py-1 text-xs font-medium transition-all focus-visible:outline-none focus-visible:ring-0 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm gap-1.5 flex-1 h-7'
                                      >
                                        <Wrench className='h-3 w-3' />
                                        <span>Reparação</span>
                                      </TabsTrigger>
                                    </TabsList>
                                  </div>

                                  <TabsContent value='informacoes' className='space-y-6 mt-0'>
                                    <Card className='border-l-4 border-l-primary/50 shadow-sm'>
                                      <CardHeader className='pb-3'>
                                        <div className='flex items-center gap-2'>
                                          <div className='rounded-full bg-primary/10 p-2'>
                                            <User className='h-4 w-4 text-primary' />
                                          </div>
                                          <div>
                                            <CardTitle className='text-base font-semibold'>Informações Básicas</CardTitle>
                                            <CardDescription className='text-xs'>Dados principais do acidente</CardDescription>
                                          </div>
                                        </div>
                                      </CardHeader>
                                      <CardContent className='space-y-4'>
                                        <div className='grid gap-4 md:grid-cols-2'>
                                          <FormField
                                            control={form.control}
                                            name={`acidentes.${index}.condutorId`}
                                            render={({ field }) => (
                                              <FormItem>
                                                <FormLabel>Condutor *</FormLabel>
                                                <FormControl>
                                                  <div className='relative'>
                                                    <Autocomplete
                                                      options={selectOptions.funcionarios}
                                                      value={field.value}
                                                      onValueChange={field.onChange}
                                                      placeholder={placeholder(
                                                        selectLoading.funcionarios,
                                                        'o condutor'
                                                      )}
                                                      disabled={selectLoading.funcionarios}
                                                      className={SELECT_WITH_ACTIONS_CLASS}
                                                    />
                                                    <div className='absolute right-12 top-1/2 -translate-y-1/2 flex gap-1'>
                                                      <Button
                                                        type='button'
                                                        variant='outline'
                                                        size='sm'
                                                        onClick={() => handleViewCondutor(field.value)}
                                                        title='Ver Condutor'
                                                        disabled={!field.value}
                                                        className='h-8 w-8 p-0'
                                                      >
                                                        <Eye className='h-4 w-4' />
                                                      </Button>
                                                      <Button
                                                        type='button'
                                                        variant='outline'
                                                        size='sm'
                                                        onClick={handleCreateCondutor}
                                                        title='Criar novo condutor'
                                                        className='h-8 w-8 p-0'
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
                                        name={`acidentes.${index}.dataHora`}
                                        render={({ field }) => (
                                          <FormItem>
                                            <FormLabel>Data *</FormLabel>
                                            <FormControl>
                                              <DatePicker
                                                value={field.value || undefined}
                                                onChange={(date) => {
                                                  field.onChange(date)
                                                  // Manter a hora se já existir
                                                  if (date && acidentesValues?.[index]?.hora) {
                                                    const [hours, minutes] = acidentesValues[index].hora.split(':').map(Number)
                                                    date.setHours(hours || 0, minutes || 0, 0, 0)
                                                  }
                                                }}
                                                placeholder='Selecione a data'
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
                                        name={`acidentes.${index}.hora`}
                                        render={({ field }) => {
                                          // Se não há valor mas há dataHora, extrair a hora
                                          const currentValue = field.value || (acidenteData?.dataHora
                                            ? `${acidenteData.dataHora.getHours().toString().padStart(2, '0')}:${acidenteData.dataHora.getMinutes().toString().padStart(2, '0')}`
                                            : '')
                                          
                                          const [hours, minutes] = currentValue ? currentValue.split(':').map(Number) : [0, 0]
                                          const displayHours = isNaN(hours) ? 0 : hours
                                          const displayMinutes = isNaN(minutes) ? 0 : minutes
                                          const formattedTime = `${String(displayHours).padStart(2, '0')}:${String(displayMinutes).padStart(2, '0')}`

                                          const updateTime = (newHours: number, newMinutes: number) => {
                                            const formatted = `${String(newHours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')}`
                                            field.onChange(formatted)
                                            // Atualizar dataHora com a hora
                                            if (acidentesValues?.[index]?.dataHora) {
                                              const dataComHora = new Date(acidentesValues[index].dataHora)
                                              dataComHora.setHours(newHours || 0, newMinutes || 0, 0, 0)
                                              form.setValue(`acidentes.${index}.dataHora`, dataComHora, { shouldDirty: true })
                                            }
                                          }

                                          const [isSelectingHours, setIsSelectingHours] = useState(true)
                                          const [isDragging, setIsDragging] = useState<'hour' | 'minute' | null>(null)
                                          const clockRef = useRef<HTMLDivElement>(null)
                                          const startHour24Ref = useRef<number | null>(null)
                                          const startAngleRef = useRef<number | null>(null)
                                          const lastAngleRef = useRef<number | null>(null)
                                          const unwrappedAngleRef = useRef<number>(0)
                                          
                                          // Converter para formato 12h para o relógio analógico
                                          const hour12 = displayHours % 12 || 12
                                          
                                          // Calcular ângulos dos ponteiros
                                          // No CSS rotate(), 0deg aponta para a direita (3 horas)
                                          // Para apontar para o topo (12 horas), precisamos de -90 graus
                                          // Os números estão posicionados com: angle = (i * 30) - 90
                                          // onde i=0 é 12 (topo), i=1 é 1, i=2 é 2, etc.
                                          
                                          // Para as horas: hour12 === 12 significa posição 0 (topo)
                                          const hourPosition = hour12 === 12 ? 0 : hour12
                                          // Cada hora = 30 graus, cada minuto move 0.5 graus
                                          // Se está no 6 quando deveria estar no 12, está 180 graus deslocado
                                          // Precisamos adicionar 180 graus para compensar
                                          // O cálculo base é: (hourPosition * 30) - 90 para começar no topo
                                          // Mas como está 180 graus deslocado, adicionamos 180: -90 + 180 = 90
                                          // Mas 90 graus aponta para baixo (6 horas), então precisamos -90
                                          // Na verdade, se está no 6 e deveria estar no 12, é só inverter: -180 + 180 = 0, mas isso aponta para a direita
                                          // Vamos usar: (hourPosition * 30) - 90 (que é o correto para o topo)
                                          const hourAngle = (hourPosition * 30) + (displayMinutes * 0.5) - 90
                                          
                                          // Para os minutos: 0 minutos = topo
                                          // Cada minuto = 6 graus (360/60)
                                          const minuteAngle = (displayMinutes * 6) - 90

                                          const calculateAngleFromMouse = (clientX: number, clientY: number) => {
                                            if (!clockRef.current) return 0
                                            const rect = clockRef.current.getBoundingClientRect()
                                            const centerX = rect.left + rect.width / 2
                                            const centerY = rect.top + rect.height / 2
                                            const clickX = clientX - centerX
                                            const clickY = clientY - centerY
                                            
                                            // Calcular ângulo do mouse (em graus)
                                            let angle = Math.atan2(clickY, clickX) * (180 / Math.PI) + 90
                                            // Normalizar para 0-360
                                            if (angle < 0) angle += 360
                                            return angle
                                          }

                                          const handlePointerMouseDown = (e: React.MouseEvent<HTMLDivElement>, type: 'hour' | 'minute') => {
                                            e.preventDefault()
                                            e.stopPropagation()
                                            setIsDragging(type)
                                            setIsSelectingHours(type === 'hour')
                                            
                                            const angle = calculateAngleFromMouse(e.clientX, e.clientY)
                                            
                                            if (type === 'hour') {
                                              startHour24Ref.current = displayHours
                                              startAngleRef.current = angle
                                            } else {
                                              let newMinute = Math.round(angle / 6)
                                              if (newMinute >= 60) newMinute = 0
                                              if (newMinute < 0) newMinute = 0
                                              updateTime(displayHours, newMinute)
                                            }
                                          }

                                          useEffect(() => {
                                            if (!isDragging) {
                                              startHour24Ref.current = null
                                              startAngleRef.current = null
                                              lastAngleRef.current = null
                                              unwrappedAngleRef.current = 0
                                              return
                                            }

                                            const handleMouseMove = (e: MouseEvent) => {
                                              const angle = calculateAngleFromMouse(e.clientX, e.clientY)
                                              
                                              if (isDragging === 'hour') {
                                                const startHour24 = startHour24Ref.current
                                                const startAngle = startAngleRef.current
                                                
                                                if (startAngle !== null && startHour24 !== null) {
                                                  if (lastAngleRef.current === null) {
                                                    // Primeira vez: inicializar
                                                    lastAngleRef.current = angle
                                                    unwrappedAngleRef.current = startAngle
                                                  } else {
                                                    // Calcular diferença de ângulo
                                                    let delta = angle - lastAngleRef.current
                                                    
                                                    // Normalizar delta para o caminho mais curto
                                                    if (delta > 180) {
                                                      delta -= 360
                                                    } else if (delta < -180) {
                                                      delta += 360
                                                    }
                                                    
                                                    // Acumular no ângulo desenrolado
                                                    unwrappedAngleRef.current += delta
                                                    
                                                    lastAngleRef.current = angle
                                                  }
                                                  
                                                  // Calcular rotação total desde o início
                                                  const totalRotation = unwrappedAngleRef.current - startAngle
                                                  
                                                  // Converter para horas: 360 graus = 24 horas, então 15 graus = 1 hora
                                                  const hoursDelta = totalRotation / 15
                                                  
                                                  // Calcular nova hora
                                                  let newHour24 = startHour24 + hoursDelta
                                                  
                                                  // Normalizar para 0-23
                                                  newHour24 = ((newHour24 % 24) + 24) % 24
                                                  
                                                  const finalHour = Math.round(newHour24)
                                                  
                                                  // Atualizar sempre que está no range válido
                                                  if (finalHour >= 0 && finalHour <= 23) {
                                                    updateTime(finalHour, displayMinutes)
                                                  }
                                                }
                                              } else {
                                                let newMinute = Math.round(angle / 6)
                                                if (newMinute >= 60) newMinute = 0
                                                if (newMinute < 0) newMinute = 0
                                                updateTime(displayHours, newMinute)
                                              }
                                            }

                                            const handleMouseUp = () => {
                                              setIsDragging(null)
                                              startHour24Ref.current = null
                                              startAngleRef.current = null
                                              lastAngleRef.current = null
                                              unwrappedAngleRef.current = 0
                                            }

                                            window.addEventListener('mousemove', handleMouseMove)
                                            window.addEventListener('mouseup', handleMouseUp)

                                            return () => {
                                              window.removeEventListener('mousemove', handleMouseMove)
                                              window.removeEventListener('mouseup', handleMouseUp)
                                            }
                                          }, [isDragging, displayHours, displayMinutes, updateTime])

                                          const handleClockClick = (e: React.MouseEvent<HTMLDivElement>) => {
                                            const rect = e.currentTarget.getBoundingClientRect()
                                            const centerX = rect.left + rect.width / 2
                                            const centerY = rect.top + rect.height / 2
                                            const clickX = e.clientX - centerX
                                            const clickY = e.clientY - centerY
                                            
                                            // Calcular ângulo do clique (em graus)
                                            // Math.atan2 retorna em radianos, converter para graus
                                            // +90 para ajustar: atan2 começa à direita (0°), queremos no topo (0°)
                                            let angle = Math.atan2(clickY, clickX) * (180 / Math.PI) + 90
                                            // Normalizar para 0-360
                                            if (angle < 0) angle += 360

                                            if (isSelectingHours) {
                                              // Cada hora = 30 graus (360/12)
                                              let newHour12 = Math.round(angle / 30)
                                              if (newHour12 === 0 || newHour12 === 12) newHour12 = 12
                                              
                                              // Converter de 12h para 24h
                                              // Se estamos na parte da tarde (PM), adicionar 12
                                              const isPM = displayHours >= 12
                                              const hour24 = newHour12 === 12 
                                                ? (isPM ? 12 : 0)
                                                : (isPM ? newHour12 + 12 : newHour12)
                                              
                                              updateTime(hour24, displayMinutes)
                                            } else {
                                              // Cada minuto = 6 graus (360/60)
                                              let newMinute = Math.round(angle / 6)
                                              // Normalizar para 0-59
                                              if (newMinute >= 60) newMinute = 0
                                              if (newMinute < 0) newMinute = 0
                                              updateTime(displayHours, newMinute)
                                            }
                                          }
                                          
                                          return (
                                            <FormItem>
                                              <FormLabel>Hora</FormLabel>
                                              <FormControl>
                                                <Popover>
                                                  <PopoverTrigger asChild>
                                                    <Button
                                                      type='button'
                                                      variant='outline'
                                                      className={`${TEXT_INPUT_CLASS} w-full justify-start pl-10 font-normal`}
                                                    >
                                                      <Clock className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
                                                      {currentValue ? formattedTime : 'Selecione a hora'}
                                                    </Button>
                                                  </PopoverTrigger>
                                                  <PopoverContent className='w-auto p-6' align='start'>
                                                    <div className='space-y-4'>
                                                      {/* Relógio Analógico */}
                                                      <div className='relative w-48 h-48 mx-auto'>
                                                        <div
                                                          ref={clockRef}
                                                          className='relative w-full h-full rounded-full border-4 border-border bg-gradient-to-br from-background to-muted/20 shadow-lg cursor-pointer hover:border-primary/50 transition-colors'
                                                          onClick={handleClockClick}
                                                        >
                                                          {/* Marcações principais das horas */}
                                                          {Array.from({ length: 12 }).map((_, i) => {
                                                            // i=0 = 12 horas (topo), i=1 = 1 hora, etc.
                                                            // Para posicionar: 12 horas no topo = -90 graus
                                                            // Cada hora = 30 graus
                                                            const hourNumber = i === 0 ? 12 : i
                                                            const angle = (i * 30) - 90 // -90 para começar no topo
                                                            const rad = (angle * Math.PI) / 180
                                                            const radius = 75 // Ajustado para o relógio menor (192px / 2.56)
                                                            const centerX = 92 // Centro ajustado um pouco para a esquerda
                                                            const centerY = 92 // Centro ajustado um pouco para cima
                                                            const x = centerX + radius * Math.cos(rad)
                                                            const y = centerY + radius * Math.sin(rad)
                                                            
                                                            return (
                                                              <div
                                                                key={i}
                                                                className='absolute text-base font-bold text-foreground select-none'
                                                                style={{
                                                                  left: `${x}px`,
                                                                  top: `${y}px`,
                                                                  transform: 'translate(-50%, -50%)',
                                                                }}
                                                              >
                                                                {hourNumber}
                                                              </div>
                                                            )
                                                          })}

                                                          {/* Marcações dos minutos (pequenos pontos) */}
                                                          {Array.from({ length: 60 }).map((_, i) => {
                                                            if (i % 5 === 0) return null // Já desenhado nas horas
                                                            const angle = (i * 6) - 90
                                                            const rad = (angle * Math.PI) / 180
                                                            const radius = 90 // Encostado à borda (192px / 2 = 96, menos 4px de borda = 92, usando 90 para ficar próximo)
                                                            const centerX = 92 // Centro ajustado um pouco para a esquerda
                                                            const centerY = 92 // Centro ajustado um pouco para cima
                                                            const x = centerX + radius * Math.cos(rad)
                                                            const y = centerY + radius * Math.sin(rad)
                                                            
                                                            return (
                                                              <div
                                                                key={i}
                                                                className='absolute w-1 h-1 rounded-full bg-muted-foreground/30'
                                                                style={{
                                                                  left: `${x}px`,
                                                                  top: `${y}px`,
                                                                  transform: 'translate(-50%, -50%)',
                                                                }}
                                                              />
                                                            )
                                                          })}

                                                          {/* Ponteiro das horas */}
                                                          <div
                                                            className='absolute bg-foreground transition-transform duration-300 ease-out z-20 cursor-grab active:cursor-grabbing'
                                                            style={{
                                                              left: '50%',
                                                              top: '50%',
                                                              width: isSelectingHours ? '4px' : '2px',
                                                              height: '45px',
                                                              transform: `translate(-50%, -100%) rotate(${hourAngle + 90}deg)`,
                                                              transformOrigin: '50% 100%',
                                                              opacity: isSelectingHours ? 1 : 0.5,
                                                              borderRadius: '2px 2px 0 0',
                                                              pointerEvents: isDragging === 'hour' ? 'auto' : 'auto',
                                                            }}
                                                            onMouseDown={(e) => handlePointerMouseDown(e, 'hour')}
                                                          />

                                                          {/* Ponteiro dos minutos */}
                                                          <div
                                                            className='absolute bg-foreground transition-transform duration-300 ease-out z-30 cursor-grab active:cursor-grabbing'
                                                            style={{
                                                              left: '50%',
                                                              top: '50%',
                                                              width: !isSelectingHours ? '3px' : '2px',
                                                              height: '64px',
                                                              transform: `translate(-50%, -100%) rotate(${minuteAngle + 90}deg)`,
                                                              transformOrigin: '50% 100%',
                                                              opacity: !isSelectingHours ? 1 : 0.5,
                                                              borderRadius: '2px 2px 0 0',
                                                              pointerEvents: isDragging === 'minute' ? 'auto' : 'auto',
                                                            }}
                                                            onMouseDown={(e) => handlePointerMouseDown(e, 'minute')}
                                                          />

                                                          {/* Centro do relógio */}
                                                          <div className='absolute left-1/2 top-1/2 w-5 h-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground border-4 border-background shadow-md z-10' />
                                                        </div>
                                                      </div>

                                                      {/* Input manual */}
                                                      <div className='flex items-center justify-center gap-2 pt-2 border-t'>
                                                        <Input
                                                          type='number'
                                                          min={0}
                                                          max={23}
                                                          value={displayHours}
                                                          onChange={(e) => {
                                                            const val = parseInt(e.target.value) || 0
                                                            const clamped = Math.max(0, Math.min(23, val))
                                                            updateTime(clamped, displayMinutes)
                                                          }}
                                                          className='w-16 text-center'
                                                          placeholder='00'
                                                        />
                                                        <span className='text-lg font-medium'>:</span>
                                                        <Input
                                                          type='number'
                                                          min={0}
                                                          max={59}
                                                          value={displayMinutes}
                                                          onChange={(e) => {
                                                            const val = parseInt(e.target.value) || 0
                                                            const clamped = Math.max(0, Math.min(59, val))
                                                            updateTime(displayHours, clamped)
                                                          }}
                                                          className='w-16 text-center'
                                                          placeholder='00'
                                                        />
                                                      </div>
                                                    </div>
                                                  </PopoverContent>
                                                </Popover>
                                              </FormControl>
                                              <FormMessage />
                                            </FormItem>
                                          )
                                        }}
                                      />

                                      <FormField
                                        control={form.control}
                                        name={`acidentes.${index}.culpa`}
                                        render={({ field }) => (
                                          <FormItem>
                                            <FormLabel>Culpa</FormLabel>
                                            <FormControl>
                                              <div className='flex items-center gap-3 rounded-md border border-input bg-background px-4 py-3 h-12'>
                                                <Switch
                                                  checked={field.value}
                                                  onCheckedChange={field.onChange}
                                                />
                                                <span className='text-sm font-medium text-foreground'>
                                                  {field.value ? 'Sim' : 'Não'}
                                                </span>
                                              </div>
                                            </FormControl>
                                            <FormMessage />
                                          </FormItem>
                                        )}
                                      />
                                        </div>
                                      </CardContent>
                                    </Card>

                                    <Card className='border-l-4 border-l-primary/50 shadow-sm'>
                                      <CardHeader className='pb-3'>
                                        <div className='flex items-center gap-2'>
                                          <div className='rounded-full bg-primary/10 p-2'>
                                            <FileText className='h-4 w-4 text-primary' />
                                          </div>
                                          <div>
                                            <CardTitle className='text-base font-semibold'>Descrições</CardTitle>
                                            <CardDescription className='text-xs'>Detalhes do acidente e danos</CardDescription>
                                          </div>
                                        </div>
                                      </CardHeader>
                                      <CardContent className='space-y-4'>
                                        <FormField
                                          control={form.control}
                                          name={`acidentes.${index}.descricaoDanos`}
                                          render={({ field }) => (
                                            <FormItem>
                                              <FormLabel>Descrição dos Danos</FormLabel>
                                              <FormControl>
                                                <Textarea
                                                  {...field}
                                                  placeholder='Descreva detalhadamente os danos ocorridos na viatura'
                                                  className='min-h-[120px] resize-y'
                                                />
                                              </FormControl>
                                              <FormMessage />
                                            </FormItem>
                                          )}
                                        />

                                        <FormField
                                          control={form.control}
                                          name={`acidentes.${index}.descricaoAcidente`}
                                          render={({ field }) => (
                                            <FormItem>
                                              <FormLabel>Descrição do Acidente</FormLabel>
                                              <FormControl>
                                                <Textarea
                                                  {...field}
                                                  placeholder='Descreva detalhadamente o acidente ocorrido'
                                                  className='min-h-[120px] resize-y'
                                                />
                                              </FormControl>
                                              <FormMessage />
                                            </FormItem>
                                          )}
                                        />
                                      </CardContent>
                                    </Card>
                                  </TabsContent>

                                  <TabsContent value='localizacao' className='space-y-6 mt-0'>
                                    <Card className='border-l-4 border-l-primary/50 shadow-sm'>
                                      <CardHeader className='pb-3'>
                                        <div className='flex items-center gap-2'>
                                          <div className='rounded-full bg-primary/10 p-2'>
                                            <MapPin className='h-4 w-4 text-primary' />
                                          </div>
                                          <div>
                                            <CardTitle className='text-base font-semibold'>Localização</CardTitle>
                                            <CardDescription className='text-xs'>Localização geográfica do acidente</CardDescription>
                                          </div>
                                        </div>
                                      </CardHeader>
                                      <CardContent className='space-y-4'>
                                        <div className='grid gap-4 md:grid-cols-2'>
                                          <FormField
                                            control={form.control}
                                            name={`acidentes.${index}.local`}
                                            render={({ field }) => (
                                              <FormItem>
                                                <FormLabel>Local *</FormLabel>
                                                <FormControl>
                                                  <Input
                                                    {...field}
                                                    placeholder='Local do acidente'
                                                    className={TEXT_INPUT_CLASS}
                                                  />
                                                </FormControl>
                                                <FormMessage />
                                              </FormItem>
                                            )}
                                          />

                                      <FormField
                                        control={form.control}
                                        name={`acidentes.${index}.concelhoId`}
                                        render={({ field }) => (
                                          <FormItem>
                                            <FormLabel>Concelho</FormLabel>
                                            <FormControl>
                                              <div className='relative'>
                                                <Autocomplete
                                                  options={concelhos.map((concelho) => ({
                                                    value: concelho.id || '',
                                                    label: concelho.nome,
                                                  }))}
                                                  value={field.value}
                                                  onValueChange={field.onChange}
                                                  placeholder={
                                                    isLoadingConcelhos
                                                      ? 'A carregar...'
                                                      : 'Selecione o concelho'
                                                  }
                                                  emptyText='Nenhum concelho encontrado.'
                                                  disabled={isLoadingConcelhos}
                                                  className={SELECT_WITH_ACTIONS_CLASS}
                                                />
                                                <div className='absolute right-12 top-1/2 -translate-y-1/2 flex gap-1'>
                                                  <Button
                                                    type='button'
                                                    variant='outline'
                                                    size='sm'
                                                    onClick={() => handleViewConcelho(field.value)}
                                                    title='Ver Concelho'
                                                    disabled={!field.value}
                                                    className='h-8 w-8 p-0'
                                                  >
                                                    <Eye className='h-4 w-4' />
                                                  </Button>
                                                  <Button
                                                    type='button'
                                                    variant='outline'
                                                    size='sm'
                                                    onClick={handleCreateConcelho}
                                                    title='Criar novo concelho'
                                                    className='h-8 w-8 p-0'
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
                                        name={`acidentes.${index}.freguesiaId`}
                                        render={({ field }) => (
                                          <FormItem>
                                            <FormLabel>Freguesia</FormLabel>
                                            <FormControl>
                                              <div className='relative'>
                                                <Autocomplete
                                                  options={freguesias.map((freguesia) => ({
                                                    value: freguesia.id || '',
                                                    label: freguesia.nome,
                                                  }))}
                                                  value={field.value}
                                                  onValueChange={field.onChange}
                                                  placeholder={
                                                    isLoadingFreguesias
                                                      ? 'A carregar...'
                                                      : 'Selecione a freguesia'
                                                  }
                                                  emptyText='Nenhuma freguesia encontrada.'
                                                  disabled={isLoadingFreguesias}
                                                  className={SELECT_WITH_ACTIONS_CLASS}
                                                />
                                                <div className='absolute right-12 top-1/2 -translate-y-1/2 flex gap-1'>
                                                  <Button
                                                    type='button'
                                                    variant='outline'
                                                    size='sm'
                                                    onClick={() => handleViewFreguesia(field.value)}
                                                    title='Ver Freguesia'
                                                    disabled={!field.value}
                                                    className='h-8 w-8 p-0'
                                                  >
                                                    <Eye className='h-4 w-4' />
                                                  </Button>
                                                  <Button
                                                    type='button'
                                                    variant='outline'
                                                    size='sm'
                                                    onClick={handleCreateFreguesia}
                                                    title='Criar nova freguesia'
                                                    className='h-8 w-8 p-0'
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
                                        name={`acidentes.${index}.codigoPostalId`}
                                        render={({ field }) => (
                                          <FormItem>
                                            <FormLabel>Código Postal</FormLabel>
                                            <FormControl>
                                              <div className='relative'>
                                                <Autocomplete
                                                  options={codigosPostais.map((codigo) => ({
                                                    value: codigo.id || '',
                                                    label: `${codigo.codigo} - ${codigo.localidade}`,
                                                  }))}
                                                  value={field.value}
                                                  onValueChange={field.onChange}
                                                  placeholder={
                                                    isLoadingCodigosPostais
                                                      ? 'A carregar...'
                                                      : 'Selecione o código postal'
                                                  }
                                                  emptyText='Nenhum código postal encontrado.'
                                                  disabled={isLoadingCodigosPostais}
                                                  className={SELECT_WITH_ACTIONS_CLASS}
                                                />
                                                <div className='absolute right-12 top-1/2 -translate-y-1/2 flex gap-1'>
                                                  <Button
                                                    type='button'
                                                    variant='outline'
                                                    size='sm'
                                                    onClick={() => handleViewCodigoPostal(field.value)}
                                                    title='Ver Código Postal'
                                                    disabled={!field.value}
                                                    className='h-8 w-8 p-0'
                                                  >
                                                    <Eye className='h-4 w-4' />
                                                  </Button>
                                                  <Button
                                                    type='button'
                                                    variant='outline'
                                                    size='sm'
                                                    onClick={handleCreateCodigoPostal}
                                                    title='Criar novo código postal'
                                                    className='h-8 w-8 p-0'
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
                                  </TabsContent>

                                  <TabsContent value='reparacao' className='space-y-6 mt-0'>
                                    <Card className='border-l-4 border-l-primary/50 shadow-sm'>
                                      <CardHeader className='pb-3'>
                                        <div className='flex items-center gap-2'>
                                          <div className='rounded-full bg-primary/10 p-2'>
                                            <Wrench className='h-4 w-4 text-primary' />
                                          </div>
                                          <div>
                                            <CardTitle className='text-base font-semibold'>Reparação</CardTitle>
                                            <CardDescription className='text-xs'>Informações sobre a reparação do veículo</CardDescription>
                                          </div>
                                        </div>
                                      </CardHeader>
                                      <CardContent className='space-y-4'>
                                        <FormField
                                          control={form.control}
                                          name={`acidentes.${index}.localReparacao`}
                                          render={({ field }) => (
                                            <FormItem>
                                              <FormLabel>Local de Reparação</FormLabel>
                                              <FormControl>
                                                <Input
                                                  {...field}
                                                  placeholder='Local onde foi feita a reparação'
                                                  className={TEXT_INPUT_CLASS}
                                                />
                                              </FormControl>
                                              <FormMessage />
                                            </FormItem>
                                          )}
                                        />
                                      </CardContent>
                                    </Card>
                                  </TabsContent>
                                </Tabs>
                              )}
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

          {/* Multas */}
          <PersistentTabsContent value='multas'>
            <div className='space-y-6'>
              <Card className='overflow-hidden border-l-4 border-l-primary/20 transition-all duration-200 hover:border-l-primary/40 hover:shadow-md'>
                <CardHeader className='pb-4'>
                  <div className='flex items-center gap-3'>
                    <div className='flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary'>
                      <FileText className='h-4 w-4' />
                    </div>
                    <div>
                      <CardTitle className='flex items-center gap-2 text-base'>
                        Multas
                      </CardTitle>
                      <p className='mt-1 text-sm text-muted-foreground'>
                        Registe multas aplicadas a esta viatura.
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className='space-y-6'>
                  <div className='flex flex-col gap-3 md:flex-row md:items-center md:justify-between'>
                    <p className='text-sm text-muted-foreground'>
                      Adicione registos de multas com todas as informações relevantes.
                    </p>
                    <Button
                      type='button'
                      variant='secondary'
                      size='default'
                      className='md:min-w-[220px]'
                      onClick={handleAddMulta}
                    >
                      Adicionar
                    </Button>
                  </div>
                  {multaFields.length === 0 ? (
                    <div className='rounded-xl border border-dashed border-border/70 bg-muted/5 p-6 text-center shadow-inner'>
                      <div className='mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary'>
                        <FileText className='h-6 w-6' />
                      </div>
                      <h4 className='mt-4 text-sm font-semibold text-foreground'>
                        Sem multas registadas
                      </h4>
                      <p className='mt-2 text-sm text-muted-foreground'>
                        Clique em "Adicionar" para registar uma multa aplicada a esta viatura.
                      </p>
                    </div>
                  ) : (
                    <div className='space-y-4 rounded-xl border border-border/60 bg-muted/10 p-4 shadow-inner sm:p-5'>
                      <div className='flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'>
                        <div className='flex items-center gap-2 text-sm font-semibold text-foreground'>
                          <FileText className='h-4 w-4 text-primary' />
                          Multas registadas
                          <Badge variant='secondary' className='rounded-full px-2 py-0 text-xs'>
                            {multaFields.length}
                          </Badge>
                        </div>
                        <p className='text-xs text-muted-foreground'>
                          Edite as informações conforme necessário e remova registos que já não sejam relevantes.
                        </p>
                      </div>

                      <div className='space-y-4'>
                        {multaFields.map((multa, index) => {
                          const multaData = multasValues?.[index]
                          const dataHoraFormatada = formatDateLabel(multaData?.dataHora)
                          const hasId = !!multaData?.id
                          const isSaved = hasId || savedMultas.has(multa.fieldId)
                          const isExpanded = expandedMultas.has(multa.fieldId)
                          
                          const condutorNome = multaData?.condutorId
                            ? selectOptions.funcionarios.find((f) => f.value === multaData.condutorId)?.label || 'Não definido'
                            : 'Não definido'

                          return (
                            <div
                              key={multa.fieldId}
                              className={cn(
                                'group rounded-lg border border-border/70 bg-background p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-md md:p-5',
                                isSaved && !isExpanded && 'space-y-3'
                              )}
                            >
                              <div className='flex flex-col gap-3 border-b border-border/60 pb-4 sm:flex-row sm:items-center sm:justify-between'>
                                <div className='flex items-center gap-3'>
                                  <div className='flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary'>
                                    <FileText className='h-5 w-5' />
                                  </div>
                                  <div>
                                    <div className='flex items-center gap-2'>
                                      <p className='text-sm font-semibold text-foreground'>
                                        Multa #{index + 1}
                                      </p>
                                      {isSaved && (
                                        <Badge variant='outline' className='rounded-full border-primary/30 bg-primary/10 text-primary font-medium text-[10px]'>
                                          Guardado
                                        </Badge>
                                      )}
                                    </div>
                                    <p className='text-xs text-muted-foreground'>
                                      {dataHoraFormatada
                                        ? `Aplicada em ${dataHoraFormatada}.`
                                        : 'Data/hora ainda não definida.'}
                                    </p>
                                  </div>
                                </div>
                                <div className='flex items-center gap-2'>
                                  {isSaved ? (
                                    <>
                                      <Button
                                        type='button'
                                        variant='outline'
                                        size='sm'
                                        onClick={() => handleToggleExpandMulta(index)}
                                        className='gap-2'
                                      >
                                        {isExpanded ? (
                                          <>
                                            <ChevronUp className='h-4 w-4' />
                                            Ocultar
                                          </>
                                        ) : (
                                          <>
                                            <Eye className='h-4 w-4' />
                                            Ver dados
                                          </>
                                        )}
                                      </Button>
                                      <Button
                                        type='button'
                                        variant='ghost'
                                        size='sm'
                                        onClick={() => handleRemoveMulta(index)}
                                        className='text-destructive hover:text-destructive'
                                      >
                                        <Trash2 className='h-4 w-4' />
                                      </Button>
                                    </>
                                  ) : (
                                    <>
                                      <Button
                                        type='button'
                                        variant='default'
                                        size='sm'
                                        onClick={() => handleSaveMulta(index)}
                                        className='gap-2'
                                      >
                                        <Save className='h-4 w-4' />
                                        Guardar
                                      </Button>
                                      <Button
                                        type='button'
                                        variant='ghost'
                                        size='sm'
                                        onClick={() => handleRemoveMulta(index)}
                                        className='text-destructive hover:text-destructive'
                                      >
                                        <Trash2 className='h-4 w-4' />
                                      </Button>
                                    </>
                                  )}
                                </div>
                              </div>

                              {isSaved && !isExpanded ? (
                                <Card className='border-l-4 border-l-primary/50 shadow-sm'>
                                  <CardContent className='p-4'>
                                    <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
                                      <div className='flex items-start gap-3 rounded-lg bg-muted/50 p-3 transition-colors hover:bg-muted/70'>
                                        <div className='mt-0.5 rounded-full bg-primary/10 p-2'>
                                          <User className='h-4 w-4 text-primary' />
                                        </div>
                                        <div className='flex-1 space-y-1'>
                                          <p className='text-xs font-semibold uppercase tracking-wide text-muted-foreground'>
                                            Condutor
                                          </p>
                                          <p className='text-sm font-medium text-foreground'>{condutorNome || 'Não definido'}</p>
                                        </div>
                                      </div>
                                      <div className='flex items-start gap-3 rounded-lg bg-muted/50 p-3 transition-colors hover:bg-muted/70'>
                                        <div className='mt-0.5 rounded-full bg-primary/10 p-2'>
                                          <CalendarDays className='h-4 w-4 text-primary' />
                                        </div>
                                        <div className='flex-1 space-y-1'>
                                          <p className='text-xs font-semibold uppercase tracking-wide text-muted-foreground'>
                                            Data
                                          </p>
                                          <p className='text-sm font-medium text-foreground'>
                                            {dataHoraFormatada || 'Não definida'}
                                          </p>
                                        </div>
                                      </div>
                                      <div className='flex items-start gap-3 rounded-lg bg-muted/50 p-3 transition-colors hover:bg-muted/70'>
                                        <div className='mt-0.5 rounded-full bg-primary/10 p-2'>
                                          <PiggyBank className='h-4 w-4 text-primary' />
                                        </div>
                                        <div className='flex-1 space-y-1'>
                                          <p className='text-xs font-semibold uppercase tracking-wide text-muted-foreground'>
                                            Valor
                                          </p>
                                          <p className='text-sm font-medium text-foreground'>
                                            {multaData?.valor !== undefined ? `${multaData.valor.toFixed(2)} €` : 'Não definido'}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              ) : (
                                <Card className='border-l-4 border-l-primary/50 shadow-sm'>
                                  <CardHeader className='pb-3'>
                                    <div className='flex items-center gap-2'>
                                      <div className='rounded-full bg-primary/10 p-2'>
                                        <FileText className='h-4 w-4 text-primary' />
                                      </div>
                                      <div>
                                        <CardTitle className='text-base font-semibold'>Informações da Multa</CardTitle>
                                        <CardDescription className='text-xs'>Dados da multa aplicada</CardDescription>
                                      </div>
                                    </div>
                                  </CardHeader>
                                  <CardContent className='space-y-4'>
                                    <div className='grid gap-4 md:grid-cols-2'>
                                      <FormField
                                        control={form.control}
                                        name={`multas.${index}.condutorId`}
                                        render={({ field }) => (
                                          <FormItem>
                                            <FormLabel>Condutor *</FormLabel>
                                            <FormControl>
                                              <div className='relative'>
                                                <Autocomplete
                                                  options={selectOptions.funcionarios}
                                                  value={field.value}
                                                  onValueChange={field.onChange}
                                                  placeholder={placeholder(
                                                    selectLoading.funcionarios,
                                                    'o condutor'
                                                  )}
                                                  disabled={selectLoading.funcionarios}
                                                  className={SELECT_WITH_ACTIONS_CLASS}
                                                />
                                                <div className='absolute right-12 top-1/2 -translate-y-1/2 flex gap-1'>
                                                  <Button
                                                    type='button'
                                                    variant='outline'
                                                    size='sm'
                                                    onClick={() => handleViewCondutor(field.value)}
                                                    title='Ver Condutor'
                                                    disabled={!field.value}
                                                    className='h-8 w-8 p-0'
                                                  >
                                                    <Eye className='h-4 w-4' />
                                                  </Button>
                                                  <Button
                                                    type='button'
                                                    variant='outline'
                                                    size='sm'
                                                    onClick={handleCreateCondutor}
                                                    title='Criar novo condutor'
                                                    className='h-8 w-8 p-0'
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
                                        name={`multas.${index}.dataHora`}
                                        render={({ field }) => (
                                          <FormItem>
                                            <FormLabel>Data *</FormLabel>
                                            <FormControl>
                                              <DatePicker
                                                value={field.value || undefined}
                                                onChange={(date) => {
                                                  field.onChange(date)
                                                  if (date && multasValues?.[index]?.hora) {
                                                    const [hours, minutes] = multasValues[index].hora.split(':').map(Number)
                                                    date.setHours(hours || 0, minutes || 0, 0, 0)
                                                  }
                                                }}
                                                placeholder='Selecione a data'
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
                                        name={`multas.${index}.hora`}
                                        render={({ field }) => {
                                          const currentValue = field.value || (multaData?.dataHora
                                            ? `${multaData.dataHora.getHours().toString().padStart(2, '0')}:${multaData.dataHora.getMinutes().toString().padStart(2, '0')}`
                                            : '')
                                          
                                          const [hours, minutes] = currentValue ? currentValue.split(':').map(Number) : [0, 0]
                                          const displayHours = isNaN(hours) ? 0 : hours
                                          const displayMinutes = isNaN(minutes) ? 0 : minutes
                                          const formattedTime = `${String(displayHours).padStart(2, '0')}:${String(displayMinutes).padStart(2, '0')}`

                                          const updateTime = (newHours: number, newMinutes: number) => {
                                            const formatted = `${String(newHours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')}`
                                            field.onChange(formatted)
                                            if (multasValues?.[index]?.dataHora) {
                                              const dataComHora = new Date(multasValues[index].dataHora)
                                              dataComHora.setHours(newHours || 0, newMinutes || 0, 0, 0)
                                              form.setValue(`multas.${index}.dataHora`, dataComHora, { shouldDirty: true })
                                            }
                                          }

                                          const [isSelectingHours, setIsSelectingHours] = useState(true)
                                          const [isDragging, setIsDragging] = useState<'hour' | 'minute' | null>(null)
                                          const clockRef = useRef<HTMLDivElement>(null)
                                          const startHour24Ref = useRef<number | null>(null)
                                          const startAngleRef = useRef<number | null>(null)
                                          const lastAngleRef = useRef<number | null>(null)
                                          const unwrappedAngleRef = useRef<number>(0)
                                          
                                          const hour12 = displayHours % 12 || 12
                                          const hourPosition = hour12 === 12 ? 0 : hour12
                                          const hourAngle = (hourPosition * 30) + (displayMinutes * 0.5) - 90
                                          const minuteAngle = (displayMinutes * 6) - 90

                                          const calculateAngleFromMouse = (clientX: number, clientY: number) => {
                                            if (!clockRef.current) return 0
                                            const rect = clockRef.current.getBoundingClientRect()
                                            const centerX = rect.left + rect.width / 2
                                            const centerY = rect.top + rect.height / 2
                                            const clickX = clientX - centerX
                                            const clickY = clientY - centerY
                                            let angle = Math.atan2(clickY, clickX) * (180 / Math.PI) + 90
                                            if (angle < 0) angle += 360
                                            return angle
                                          }

                                          const handlePointerMouseDown = (e: React.MouseEvent<HTMLDivElement>, type: 'hour' | 'minute') => {
                                            e.preventDefault()
                                            e.stopPropagation()
                                            setIsDragging(type)
                                            setIsSelectingHours(type === 'hour')
                                            
                                            const angle = calculateAngleFromMouse(e.clientX, e.clientY)
                                            
                                            if (type === 'hour') {
                                              startHour24Ref.current = displayHours
                                              startAngleRef.current = angle
                                            } else {
                                              let newMinute = Math.round(angle / 6)
                                              if (newMinute >= 60) newMinute = 0
                                              if (newMinute < 0) newMinute = 0
                                              updateTime(displayHours, newMinute)
                                            }
                                          }

                                          useEffect(() => {
                                            if (!isDragging) {
                                              startHour24Ref.current = null
                                              startAngleRef.current = null
                                              lastAngleRef.current = null
                                              unwrappedAngleRef.current = 0
                                              return
                                            }

                                            const handleMouseMove = (e: MouseEvent) => {
                                              const angle = calculateAngleFromMouse(e.clientX, e.clientY)
                                              
                                              if (isDragging === 'hour') {
                                                const startHour24 = startHour24Ref.current
                                                const startAngle = startAngleRef.current
                                                
                                                if (startAngle !== null && startHour24 !== null) {
                                                  if (lastAngleRef.current === null) {
                                                    lastAngleRef.current = angle
                                                    unwrappedAngleRef.current = startAngle
                                                  } else {
                                                    let delta = angle - lastAngleRef.current
                                                    if (delta > 180) {
                                                      delta -= 360
                                                    } else if (delta < -180) {
                                                      delta += 360
                                                    }
                                                    unwrappedAngleRef.current += delta
                                                    lastAngleRef.current = angle
                                                  }
                                                  
                                                  const totalRotation = unwrappedAngleRef.current - startAngle
                                                  const hoursDelta = totalRotation / 15
                                                  let newHour24 = startHour24 + hoursDelta
                                                  newHour24 = ((newHour24 % 24) + 24) % 24
                                                  const finalHour = Math.round(newHour24)
                                                  
                                                  if (finalHour >= 0 && finalHour <= 23) {
                                                    updateTime(finalHour, displayMinutes)
                                                  }
                                                }
                                              } else {
                                                let newMinute = Math.round(angle / 6)
                                                if (newMinute >= 60) newMinute = 0
                                                if (newMinute < 0) newMinute = 0
                                                updateTime(displayHours, newMinute)
                                              }
                                            }

                                            const handleMouseUp = () => {
                                              setIsDragging(null)
                                              startHour24Ref.current = null
                                              startAngleRef.current = null
                                              lastAngleRef.current = null
                                              unwrappedAngleRef.current = 0
                                            }

                                            window.addEventListener('mousemove', handleMouseMove)
                                            window.addEventListener('mouseup', handleMouseUp)

                                            return () => {
                                              window.removeEventListener('mousemove', handleMouseMove)
                                              window.removeEventListener('mouseup', handleMouseUp)
                                            }
                                          }, [isDragging, displayHours, displayMinutes, updateTime])

                                          const handleClockClick = (e: React.MouseEvent<HTMLDivElement>) => {
                                            const rect = e.currentTarget.getBoundingClientRect()
                                            const centerX = rect.left + rect.width / 2
                                            const centerY = rect.top + rect.height / 2
                                            const clickX = e.clientX - centerX
                                            const clickY = e.clientY - centerY
                                            let angle = Math.atan2(clickY, clickX) * (180 / Math.PI) + 90
                                            if (angle < 0) angle += 360

                                            if (isSelectingHours) {
                                              let newHour12 = Math.round(angle / 30)
                                              if (newHour12 === 0 || newHour12 === 12) newHour12 = 12
                                              const isPM = displayHours >= 12
                                              const hour24 = newHour12 === 12 
                                                ? (isPM ? 12 : 0)
                                                : (isPM ? newHour12 + 12 : newHour12)
                                              updateTime(hour24, displayMinutes)
                                            } else {
                                              let newMinute = Math.round(angle / 6)
                                              if (newMinute >= 60) newMinute = 0
                                              if (newMinute < 0) newMinute = 0
                                              updateTime(displayHours, newMinute)
                                            }
                                          }
                                          
                                          return (
                                            <FormItem>
                                              <FormLabel>Hora</FormLabel>
                                              <FormControl>
                                                <Popover>
                                                  <PopoverTrigger asChild>
                                                    <Button
                                                      type='button'
                                                      variant='outline'
                                                      className={`${TEXT_INPUT_CLASS} w-full justify-start pl-10 font-normal`}
                                                    >
                                                      <Clock className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
                                                      {currentValue ? formattedTime : 'Selecione a hora'}
                                                    </Button>
                                                  </PopoverTrigger>
                                                  <PopoverContent className='w-auto p-6' align='start'>
                                                    <div className='space-y-4'>
                                                      <div className='relative w-48 h-48 mx-auto'>
                                                        <div
                                                          ref={clockRef}
                                                          className='relative w-full h-full rounded-full border-4 border-border bg-gradient-to-br from-background to-muted/20 shadow-lg cursor-pointer hover:border-primary/50 transition-colors'
                                                          onClick={handleClockClick}
                                                        >
                                                          {Array.from({ length: 12 }).map((_, i) => {
                                                            const hourNumber = i === 0 ? 12 : i
                                                            const angle = (i * 30) - 90
                                                            const rad = (angle * Math.PI) / 180
                                                            const radius = 75
                                                            const centerX = 92
                                                            const centerY = 92
                                                            const x = centerX + radius * Math.cos(rad)
                                                            const y = centerY + radius * Math.sin(rad)
                                                            
                                                            return (
                                                              <div
                                                                key={i}
                                                                className='absolute text-base font-bold text-foreground select-none'
                                                                style={{
                                                                  left: `${x}px`,
                                                                  top: `${y}px`,
                                                                  transform: 'translate(-50%, -50%)',
                                                                }}
                                                              >
                                                                {hourNumber}
                                                              </div>
                                                            )
                                                          })}

                                                          {Array.from({ length: 60 }).map((_, i) => {
                                                            if (i % 5 === 0) return null
                                                            const angle = (i * 6) - 90
                                                            const rad = (angle * Math.PI) / 180
                                                            const radius = 90
                                                            const centerX = 92
                                                            const centerY = 92
                                                            const x = centerX + radius * Math.cos(rad)
                                                            const y = centerY + radius * Math.sin(rad)
                                                            
                                                            return (
                                                              <div
                                                                key={i}
                                                                className='absolute w-1 h-1 rounded-full bg-muted-foreground/30'
                                                                style={{
                                                                  left: `${x}px`,
                                                                  top: `${y}px`,
                                                                  transform: 'translate(-50%, -50%)',
                                                                }}
                                                              />
                                                            )
                                                          })}

                                                          <div
                                                            className='absolute bg-foreground transition-transform duration-300 ease-out z-20 cursor-grab active:cursor-grabbing'
                                                            style={{
                                                              left: '50%',
                                                              top: '50%',
                                                              width: isSelectingHours ? '4px' : '2px',
                                                              height: '45px',
                                                              transform: `translate(-50%, -100%) rotate(${hourAngle + 90}deg)`,
                                                              transformOrigin: '50% 100%',
                                                              opacity: isSelectingHours ? 1 : 0.5,
                                                              borderRadius: '2px 2px 0 0',
                                                              pointerEvents: isDragging === 'hour' ? 'auto' : 'auto',
                                                            }}
                                                            onMouseDown={(e) => handlePointerMouseDown(e, 'hour')}
                                                          />

                                                          <div
                                                            className='absolute bg-foreground transition-transform duration-300 ease-out z-30 cursor-grab active:cursor-grabbing'
                                                            style={{
                                                              left: '50%',
                                                              top: '50%',
                                                              width: !isSelectingHours ? '3px' : '2px',
                                                              height: '64px',
                                                              transform: `translate(-50%, -100%) rotate(${minuteAngle + 90}deg)`,
                                                              transformOrigin: '50% 100%',
                                                              opacity: !isSelectingHours ? 1 : 0.5,
                                                              borderRadius: '2px 2px 0 0',
                                                              pointerEvents: isDragging === 'minute' ? 'auto' : 'auto',
                                                            }}
                                                            onMouseDown={(e) => handlePointerMouseDown(e, 'minute')}
                                                          />

                                                          <div className='absolute left-1/2 top-1/2 w-5 h-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground border-4 border-background shadow-md z-10' />
                                                        </div>
                                                      </div>

                                                      <div className='flex items-center justify-center gap-2 pt-2 border-t'>
                                                        <Input
                                                          type='number'
                                                          min={0}
                                                          max={23}
                                                          value={displayHours}
                                                          onChange={(e) => {
                                                            const val = parseInt(e.target.value) || 0
                                                            const clamped = Math.max(0, Math.min(23, val))
                                                            updateTime(clamped, displayMinutes)
                                                          }}
                                                          className='w-16 text-center'
                                                          placeholder='00'
                                                        />
                                                        <span className='text-lg font-medium'>:</span>
                                                        <Input
                                                          type='number'
                                                          min={0}
                                                          max={59}
                                                          value={displayMinutes}
                                                          onChange={(e) => {
                                                            const val = parseInt(e.target.value) || 0
                                                            const clamped = Math.max(0, Math.min(59, val))
                                                            updateTime(displayHours, clamped)
                                                          }}
                                                          className='w-16 text-center'
                                                          placeholder='00'
                                                        />
                                                      </div>
                                                    </div>
                                                  </PopoverContent>
                                                </Popover>
                                              </FormControl>
                                              <FormMessage />
                                            </FormItem>
                                          )
                                        }}
                                      />

                                      <FormField
                                        control={form.control}
                                        name={`multas.${index}.local`}
                                        render={({ field }) => (
                                          <FormItem>
                                            <FormLabel>Local *</FormLabel>
                                            <FormControl>
                                              <Input
                                                {...field}
                                                placeholder='Local onde foi aplicada a multa'
                                                className={TEXT_INPUT_CLASS}
                                              />
                                            </FormControl>
                                            <FormMessage />
                                          </FormItem>
                                        )}
                                      />

                                      <FormField
                                        control={form.control}
                                        name={`multas.${index}.motivo`}
                                        render={({ field }) => (
                                          <FormItem>
                                            <FormLabel>Motivo *</FormLabel>
                                            <FormControl>
                                              <Input
                                                {...field}
                                                placeholder='Motivo da multa'
                                                className={TEXT_INPUT_CLASS}
                                              />
                                            </FormControl>
                                            <FormMessage />
                                          </FormItem>
                                        )}
                                      />

                                      <FormField
                                        control={form.control}
                                        name={`multas.${index}.valor`}
                                        render={({ field }) => (
                                          <FormItem>
                                            <FormLabel>Valor (€) *</FormLabel>
                                            <FormControl>
                                              <NumberInput
                                                value={field.value}
                                                onValueChange={(value) => field.onChange(value ?? 0)}
                                                placeholder='0.00'
                                                min={0}
                                                step={0.01}
                                                className={TEXT_INPUT_CLASS}
                                              />
                                            </FormControl>
                                            <FormMessage />
                                          </FormItem>
                                        )}
                                      />
                                    </div>
                                  </CardContent>
                                </Card>
                              )}
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
        </PersistentTabs>

        <div className='flex flex-col gap-2 pt-4 md:flex-row md:justify-end'>
          {onCancel && (
            <Button
              type='button'
              variant='outline'
              onClick={onCancel}
              className='w-full md:w-auto'
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
          )}
          <Button type='submit' className='w-full md:w-auto' disabled={isSubmitting}>
            {isSubmitting ? 'A guardar...' : submitLabel}
          </Button>
        </div>
      </form>

      {/* Diálogo de upload de documentos do condutor */}
      <Dialog
        open={condutorUploadDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            handleCloseCondutorUploadDialog()
          }
        }}
      >
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
            <DialogTitle>Anexar Ficheiros ao Condutor</DialogTitle>
          </DialogHeader>
          <div className='space-y-4 py-4'>
            {condutorUploadDialogCondutorId && (
              <div className='space-y-2'>
                <p className='text-sm text-muted-foreground'>
                  Condutor: <span className='font-medium text-foreground'>{condutoresMap.get(condutorUploadDialogCondutorId) ?? 'Desconhecido'}</span>
                </p>
                <p className='text-sm text-muted-foreground'>
                  Selecione um ou mais ficheiros para anexar (ex: carta de condução, documentos de identificação, etc.)
                </p>
                <input
                  ref={condutorUploadFileInputRef}
                  type='file'
                  multiple
                  onChange={handleCondutorFileUpload}
                  className='hidden'
                  accept='*/*'
                />
                <Button
                  type='button'
                  variant='outline'
                  onClick={() => condutorUploadFileInputRef.current?.click()}
                  className='w-full'
                >
                  <FileText className='mr-2 h-4 w-4' />
                  Selecionar Ficheiros
                </Button>
                {condutorUploadDialogCondutorId && condutoresDocumentos[condutorUploadDialogCondutorId] && (
                  <div className='mt-4 space-y-2'>
                    <p className='text-sm font-medium text-foreground'>
                      Ficheiros anexados ({condutoresDocumentos[condutorUploadDialogCondutorId]?.length ?? 0}):
                    </p>
                    <div className='max-h-48 space-y-1 overflow-y-auto rounded-md border border-border/50 bg-muted/30 p-2'>
                      {condutoresDocumentos[condutorUploadDialogCondutorId]?.map((documento, index) => (
                        <div
                          key={index}
                          className='flex items-center justify-between gap-2 rounded-md bg-background px-2 py-1.5 text-xs'
                        >
                          <div className='flex items-center gap-2 min-w-0 flex-1'>
                            <File className='h-3.5 w-3.5 flex-shrink-0 text-muted-foreground' />
                            <span className='truncate text-foreground'>{documento.nome}</span>
                            <span className='text-xs text-muted-foreground'>
                              ({formatFileSize(documento.tamanho)})
                            </span>
                          </div>
                          <div className='flex items-center gap-1'>
                            <Button
                              type='button'
                              variant='ghost'
                              size='sm'
                              onClick={() => handleViewCondutorDocumento(documento)}
                              title='Visualizar'
                              className='h-6 w-6 p-0'
                            >
                              <Eye className='h-3 w-3' />
                            </Button>
                            <Button
                              type='button'
                              variant='ghost'
                              size='sm'
                              onClick={() => handleRemoveCondutorDocumento(condutorUploadDialogCondutorId, index)}
                              title='Remover'
                              className='h-6 w-6 p-0 text-destructive hover:text-destructive'
                            >
                              <X className='h-3 w-3' />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type='button' variant='outline' onClick={handleCloseCondutorUploadDialog}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo de visualização de documentos do condutor */}
      <Dialog open={condutorViewerOpen} onOpenChange={setCondutorViewerOpen}>
        <DialogContent className='max-w-4xl max-h-[90vh] p-0'>
          {condutorViewerDocumento && (
            <div className='flex flex-col'>
              <DialogHeader className='px-6 pt-6 pb-4'>
                <DialogTitle className='truncate'>{condutorViewerDocumento.nome}</DialogTitle>
              </DialogHeader>
              <div className='flex items-center justify-center p-6 overflow-auto'>
                {(() => {
                  const viewerUrl = getDocumentoViewerUrl(condutorViewerDocumento)
                  if (!viewerUrl) {
                    return (
                      <div className='flex flex-col items-center justify-center gap-4 p-8 text-center'>
                        <File className='h-16 w-16 text-muted-foreground' />
                        <p className='text-sm text-muted-foreground'>
                          Não é possível visualizar este tipo de ficheiro. Por favor, descarregue o ficheiro para o visualizar.
                        </p>
                      </div>
                    )
                  }
                  
                  if (isImageContentType(condutorViewerDocumento.contentType)) {
                    return (
                      <img
                        src={viewerUrl}
                        alt={condutorViewerDocumento.nome}
                        className='max-h-[70vh] w-auto object-contain rounded-lg'
                        style={{ imageOrientation: 'from-image' }}
                      />
                    )
                  }
                  
                  if (isPdfContentType(condutorViewerDocumento.contentType, condutorViewerDocumento.nome)) {
                    return (
                      <iframe
                        src={viewerUrl}
                        title={condutorViewerDocumento.nome}
                        className='w-full h-[70vh] rounded-lg border'
                      />
                    )
                  }
                  
                  return (
                    <div className='flex flex-col items-center justify-center gap-4 p-8 text-center'>
                      <File className='h-16 w-16 text-muted-foreground' />
                      <p className='text-sm text-muted-foreground'>
                        Visualização não disponível para este tipo de ficheiro.
                      </p>
                      <Button
                        type='button'
                        variant='outline'
                        onClick={() => handleDownloadCondutorDocumento(condutorViewerDocumento)}
                      >
                        <Download className='mr-2 h-4 w-4' />
                        Descarregar ficheiro
                      </Button>
                    </div>
                  )
                })()}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Diálogo de upload de documentos da inspeção */}
      <Dialog
        open={inspecaoUploadDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            handleCloseInspecaoUploadDialog()
          }
        }}
      >
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
            <DialogTitle>Anexar Ficheiros à Inspeção</DialogTitle>
          </DialogHeader>
          <div className='space-y-4 py-4'>
            {inspecaoUploadDialogIndex !== null && (
              <div className='space-y-2'>
                <p className='text-sm text-muted-foreground'>
                  Inspeção #{inspecaoUploadDialogIndex + 1}
                </p>
                <p className='text-sm text-muted-foreground'>
                  Selecione um ou mais ficheiros para anexar (ex: certificado de inspeção, relatório, etc.)
                </p>
                <input
                  ref={inspecaoUploadFileInputRef}
                  type='file'
                  multiple
                  onChange={handleInspecaoFileUpload}
                  className='hidden'
                  accept='*/*'
                />
                <Button
                  type='button'
                  variant='outline'
                  onClick={() => inspecaoUploadFileInputRef.current?.click()}
                  className='w-full'
                >
                  <FileText className='mr-2 h-4 w-4' />
                  Selecionar Ficheiros
                </Button>
                {inspecaoUploadDialogIndex !== null && (() => {
                  const inspecoes = form.getValues('inspecoes') ?? []
                  const inspecaoAtual = inspecoes[inspecaoUploadDialogIndex]
                  const documentos = inspecaoAtual?.documentos ?? []
                  return documentos.length > 0 ? (
                    <div className='mt-4 space-y-2'>
                      <p className='text-sm font-medium text-foreground'>
                        Ficheiros anexados ({documentos.length}):
                      </p>
                      <div className='max-h-48 space-y-1 overflow-y-auto rounded-md border border-border/50 bg-muted/30 p-2'>
                        {documentos.map((documento, index) => (
                          <div
                            key={index}
                            className='flex items-center justify-between gap-2 rounded-md bg-background px-2 py-1.5 text-xs'
                          >
                            <div className='flex items-center gap-2 min-w-0 flex-1'>
                              <File className='h-3.5 w-3.5 flex-shrink-0 text-muted-foreground' />
                              <span className='truncate text-foreground'>{documento.nome}</span>
                              <span className='text-xs text-muted-foreground'>
                                ({formatFileSize(documento.tamanho)})
                              </span>
                            </div>
                            <div className='flex items-center gap-1'>
                              <Button
                                type='button'
                                variant='ghost'
                                size='sm'
                                onClick={() => handleViewInspecaoDocumento(documento)}
                                title='Visualizar'
                                className='h-6 w-6 p-0'
                              >
                                <Eye className='h-3 w-3' />
                              </Button>
                              <Button
                                type='button'
                                variant='ghost'
                                size='sm'
                                onClick={() => handleRemoveInspecaoDocumento(inspecaoUploadDialogIndex, index)}
                                title='Remover'
                                className='h-6 w-6 p-0 text-destructive hover:text-destructive'
                              >
                                <X className='h-3 w-3' />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null
                })()}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Diálogo de listagem de documentos da inspeção */}
      <Dialog
        open={inspecaoDocumentosDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            handleCloseInspecaoDocumentosDialog()
          }
        }}
      >
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
            <DialogTitle>Documentos da Inspeção</DialogTitle>
          </DialogHeader>
          <div className='space-y-4 py-4'>
            {inspecaoDocumentosDialogIndex !== null && (() => {
              const inspecoes = form.getValues('inspecoes') ?? []
              const inspecaoAtual = inspecoes[inspecaoDocumentosDialogIndex]
              const documentos = inspecaoAtual?.documentos ?? []
              
              if (documentos.length === 0) {
                return (
                  <div className='text-center py-8'>
                    <FileText className='h-12 w-12 text-muted-foreground mx-auto mb-4' />
                    <p className='text-sm text-muted-foreground'>
                      Nenhum documento anexado a esta inspeção.
                    </p>
                  </div>
                )
              }
              
              return (
                <div className='space-y-2'>
                  <p className='text-sm font-medium text-foreground'>
                    Documentos anexados ({documentos.length}):
                  </p>
                  <div className='max-h-64 space-y-1 overflow-y-auto rounded-md border border-border/50 bg-muted/30 p-2'>
                    {documentos.map((documento, docIndex) => (
                      <div
                        key={docIndex}
                        className='flex items-center justify-between gap-2 rounded-md bg-background px-2 py-1.5 text-xs'
                      >
                        <div className='flex items-center gap-2 min-w-0 flex-1'>
                          <File className='h-3.5 w-3.5 flex-shrink-0 text-muted-foreground' />
                          <span className='truncate text-foreground'>{documento.nome}</span>
                          <span className='text-xs text-muted-foreground flex-shrink-0'>
                            ({formatFileSize(documento.tamanho)})
                          </span>
                        </div>
                        <div className='flex items-center gap-1'>
                          <Button
                            type='button'
                            variant='ghost'
                            size='sm'
                            onClick={() => handleViewInspecaoDocumento(documento)}
                            title='Visualizar'
                            className='h-6 w-6 p-0'
                          >
                            <Eye className='h-3 w-3' />
                          </Button>
                          <Button
                            type='button'
                            variant='ghost'
                            size='sm'
                            onClick={() => handleDownloadInspecaoDocumento(documento)}
                            title='Descarregar'
                            className='h-6 w-6 p-0'
                          >
                            <Download className='h-3 w-3' />
                          </Button>
                          <Button
                            type='button'
                            variant='ghost'
                            size='sm'
                            onClick={() => {
                              handleRemoveInspecaoDocumento(inspecaoDocumentosDialogIndex, docIndex)
                            }}
                            title='Remover'
                            className='h-6 w-6 p-0 text-destructive hover:text-destructive'
                          >
                            <X className='h-3 w-3' />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })()}
          </div>
        </DialogContent>
      </Dialog>

      {/* Diálogo de visualização de documentos da inspeção */}
      <Dialog
        open={inspecaoViewerOpen}
        onOpenChange={(open) => {
          if (!open) {
            setInspecaoViewerOpen(false)
            setInspecaoViewerDocumento(null)
          }
        }}
      >
        <DialogContent className='sm:max-w-2xl'>
          <DialogHeader>
            <DialogTitle>Visualizar Documento</DialogTitle>
          </DialogHeader>
          <div className='space-y-4 py-4'>
            {inspecaoViewerDocumento && (() => {
              const { nome, dados, contentType } = inspecaoViewerDocumento
              const isImage = contentType?.startsWith('image/')
              return (
                <div className='space-y-4'>
                  <div className='flex items-center justify-between'>
                    <p className='text-sm font-medium text-foreground'>{nome}</p>
                    <Button
                      type='button'
                      variant='outline'
                      size='sm'
                      onClick={() => handleDownloadInspecaoDocumento(inspecaoViewerDocumento)}
                    >
                      <Download className='mr-2 h-4 w-4' />
                      Descarregar ficheiro
                    </Button>
                  </div>
                  <div className='max-h-[60vh] overflow-auto rounded-md border border-border/50 bg-muted/30 p-4'>
                    {isImage ? (
                      <img
                        src={dados}
                        alt={nome}
                        className='max-w-full h-auto rounded-md'
                      />
                    ) : (
                      <div className='flex flex-col items-center justify-center py-8 text-center'>
                        <File className='h-12 w-12 text-muted-foreground mb-4' />
                        <p className='text-sm text-muted-foreground mb-2'>
                          Pré-visualização não disponível para este tipo de ficheiro.
                        </p>
                        <p className='text-xs text-muted-foreground'>
                          Tipo: {contentType || 'Desconhecido'}
                        </p>
                        <Button
                          type='button'
                          variant='outline'
                          size='sm'
                          className='mt-4'
                          onClick={() => handleDownloadInspecaoDocumento(inspecaoViewerDocumento)}
                        >
                          <Download className='mr-2 h-4 w-4' />
                          Descarregar ficheiro
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              )
            })()}
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal para visualizar documentos do condutor */}
      <Dialog open={condutorDocumentosDialogOpen} onOpenChange={handleCloseCondutorDocumentosDialog}>
        <DialogContent className='max-w-3xl max-h-[80vh]'>
          <DialogHeader>
            <DialogTitle>Documentos do Condutor</DialogTitle>
            <DialogDescription>
              {(() => {
                const condutorNome = condutorDocumentosDialogCondutorId
                  ? selectOptions.funcionarios.find(f => f.value === condutorDocumentosDialogCondutorId)?.label
                  : null
                return condutorNome ? `Documentos anexados a ${condutorNome}` : 'Visualize e gerencie os documentos anexados'
              })()}
            </DialogDescription>
          </DialogHeader>
          <div className='overflow-y-auto max-h-[calc(80vh-120px)]'>
            {(() => {
              if (!condutorDocumentosDialogCondutorId) return null
              const documentos = condutoresDocumentos[condutorDocumentosDialogCondutorId] ?? []
              
              if (documentos.length === 0) {
                return (
                  <div className='flex flex-col items-center justify-center py-8 text-center'>
                    <FileText className='h-12 w-12 text-muted-foreground mb-3' />
                    <p className='text-sm text-muted-foreground'>Nenhum documento anexado</p>
                  </div>
                )
              }

              return (
                <div className='space-y-3'>
                  {documentos.map((documento, index) => (
                    <div
                      key={index}
                      className='flex items-center justify-between gap-4 rounded-lg border border-border/70 bg-background p-4 shadow-sm transition hover:border-primary/50 hover:shadow-md'
                    >
                      <div className='flex items-center gap-3 min-w-0 flex-1'>
                        <div className='flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary flex-shrink-0'>
                          <File className='h-5 w-5' />
                        </div>
                        <div className='min-w-0 flex-1'>
                          <p className='truncate text-sm font-medium text-foreground'>
                            {documento.nome}
                          </p>
                          <p className='text-xs text-muted-foreground'>
                            {documento.contentType} • {(documento.tamanho / 1024).toFixed(1)} KB
                          </p>
                        </div>
                      </div>
                      <div className='flex items-center gap-2'>
                        <Button
                          type='button'
                          variant='outline'
                          size='sm'
                          onClick={() => handleViewCondutorDocumento(documento)}
                          title='Visualizar'
                        >
                          <Eye className='h-4 w-4' />
                        </Button>
                        <Button
                          type='button'
                          variant='outline'
                          size='sm'
                          onClick={() => handleDownloadCondutorDocumento(documento)}
                          title='Descarregar'
                        >
                          <Download className='h-4 w-4' />
                        </Button>
                        <Button
                          type='button'
                          variant='ghost'
                          size='sm'
                          onClick={() => {
                            handleRemoveCondutorDocumento(condutorDocumentosDialogCondutorId, index)
                            // Se não houver mais documentos, fecha o modal
                            const documentosAtualizados = form.getValues('condutoresDocumentos')?.[condutorDocumentosDialogCondutorId] ?? []
                            if (documentosAtualizados.length <= 1) {
                              handleCloseCondutorDocumentosDialog()
                            }
                          }}
                          title='Remover'
                          className='text-destructive hover:text-destructive'
                        >
                          <Trash2 className='h-4 w-4' />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )
            })()}
          </div>
        </DialogContent>
      </Dialog>
    </Form>
  )
}


