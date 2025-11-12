import { useEffect, useMemo, type ReactNode } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
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
import {
  Building2,
  CalendarDays,
  Car,
  ClipboardList,
  FileText,
  MapPin,
  Settings,
  ShieldCheck,
  Wrench,
  Eye,
  Plus,
  type LucideIcon,
} from 'lucide-react'
import { toast } from '@/utils/toast-utils'
import { useTabManager } from '@/hooks/use-tab-manager'
import { useSubmitErrorTab } from '@/hooks/use-submit-error-tab'
import { useAutoSelectionWithReturnData } from '@/hooks/use-auto-selection-with-return-data'
import {
  defaultViaturaFormValues,
  viaturaFormSchema,
  type ViaturaFormSchemaType,
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
} from '@/utils/window-utils'

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

const FIELD_HEIGHT_CLASS = 'h-12'
const SELECT_WITH_ACTIONS_CLASS = `${FIELD_HEIGHT_CLASS} px-4 pr-32 shadow-inner drop-shadow-xl`
const TEXT_INPUT_CLASS = `${FIELD_HEIGHT_CLASS} px-4 shadow-inner drop-shadow-xl`

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
  const form = useForm<ViaturaFormSchemaType>({
    resolver: zodResolver(viaturaFormSchema),
    defaultValues: {
      ...defaultViaturaFormValues,
      ...initialValues,
    },
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

  useEffect(() => {
    if (initialValues) {
      form.reset({
        ...defaultViaturaFormValues,
        ...initialValues,
      })
    }
  }, [initialValues, form])

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
      localizacoes,
      marcas,
      modelos,
      seguros,
      setores,
      terceiros,
      tipoViaturas,
    ]
  )

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
    equipamentos: isLoadingEquipamentos,
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
      combustivelId: 'caracterizacao',
      custo: 'caracterizacao',
      despesasIncluidas: 'caracterizacao',
      consumoMedio: 'caracterizacao',
      nQuadro: 'caracterizacao',
      nMotor: 'caracterizacao',
      cilindrada: 'caracterizacao',
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
      terceiroId: 'locacao',
      fornecedorId: 'caracterizacao',
      contrato: 'locacao',
      dataInicial: 'identificacao',
      dataFinal: 'locacao',
      valorTotalContrato: 'locacao',
      opcaoCompra: 'locacao',
      nRendas: 'locacao',
      valorRenda: 'locacao',
      valorResidual: 'locacao',
      seguroId: 'seguros',
      anoImpostoSelo: 'seguros',
      anoImpostoCirculacao: 'seguros',
      dataValidadeSelo: 'seguros',
      notasAdicionais: 'notas',
      urlImagem1: 'notas',
      urlImagem2: 'notas',
      equipamentoId: 'equipamento',
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
  const handleViewSeguro = () =>
    openView(openSeguroViewWindow, form.getValues('seguroId'), 'Por favor, selecione um seguro primeiro')

  const handleCreateEquipamento = () => openCreation(openEquipamentoCreationWindow)
  const handleViewEquipamento = () =>
    openView(
      openEquipamentoViewWindow,
      form.getValues('equipamentoId'),
      'Por favor, selecione um equipamento primeiro'
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
    setValue: (value: string) =>
      form.setValue('terceiroId', value, { shouldDirty: true, shouldValidate: true }),
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
    setValue: (value: string) =>
      form.setValue('fornecedorId', value, { shouldDirty: true, shouldValidate: true }),
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
    setValue: (value: string) =>
      form.setValue('seguroId', value, { shouldDirty: true, shouldValidate: true }),
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
    setValue: (value: string) =>
      form.setValue('equipamentoId', value, { shouldDirty: true, shouldValidate: true }),
    refetch: refetchEquipamentos,
    itemName: 'Equipamento',
    successMessage: 'Equipamento selecionado automaticamente',
    manualSelectionMessage:
      'Equipamento criado com sucesso. Por favor, selecione-o manualmente.',
    queryKey: ['equipamentos-select'],
    returnDataKey: `return-data-${parentWindowId}-equipamento`,
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
            <PersistentTabsTrigger value='seguros'>
              <ShieldCheck className='mr-2 h-4 w-4' />
              Seguros
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
                    <div className='grid gap-4 md:grid-cols-2 xl:grid-cols-3'>
                      <FormField
                        control={form.control}
                        name='matricula'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Matrícula</FormLabel>
                            <FormControl>
                              <Input
                                placeholder='Introduza a matrícula'
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
                        name='numero'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Número Interno</FormLabel>
                            <FormControl>
                              <Input
                                type='number'
                                placeholder='Número interno da viatura'
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
                        name='anoFabrico'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Ano de Fabrico</FormLabel>
                            <FormControl>
                              <Input
                                type='number'
                                placeholder='Ano'
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
                        name='mesFabrico'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Mês de Fabrico</FormLabel>
                            <FormControl>
                              <Input
                                type='number'
                                placeholder='Mês (1-12)'
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
                        name='dataInicial'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Data de Registo</FormLabel>
                            <FormControl>
                              <DatePicker
                                value={field.value}
                                onChange={field.onChange}
                                placeholder='Selecione a data de registo'
                                className={FIELD_HEIGHT_CLASS}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
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
                                  value={field.value}
                                  onChange={field.onChange}
                                  placeholder='Selecione a data de aquisição'
                                  className={FIELD_HEIGHT_CLASS}
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
                                  value={field.value}
                                  onChange={field.onChange}
                                  placeholder='Selecione a data do livrete'
                                  className={FIELD_HEIGHT_CLASS}
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
                <CardContent className='space-y-6'>
                  <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                    <FormField
                      control={form.control}
                      name='custo'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Custo (€)</FormLabel>
                          <FormControl>
                            <Input
                              type='number'
                              step='0.01'
                              placeholder='Custo da viatura'
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
                      name='despesasIncluidas'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Despesas Incluídas (€)</FormLabel>
                          <FormControl>
                            <Input
                              type='number'
                              step='0.01'
                              {...field}
                                className={TEXT_INPUT_CLASS}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
                    <FormField
                      control={form.control}
                      name='fornecedorId'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Entidade fornecedora</FormLabel>
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
                      name='combustivelId'
                      render={({ field }) => (
                        <FormItem>
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
                              disabled={selectLoading.combustiveis}
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
                                  disabled={!field.value}
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
                      name='consumoMedio'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Consumo Médio (L/100km)</FormLabel>
                          <FormControl>
                            <Input
                              type='number'
                              step='0.1'
                              placeholder='Consumo médio'
                              {...field}
                                className={TEXT_INPUT_CLASS}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
                    <FormField
                      control={form.control}
                      name='nQuadro'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nº de Quadro</FormLabel>
                          <FormControl>
                            <Input
                              type='number'
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
                      name='nMotor'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nº de Motor</FormLabel>
                          <FormControl>
                            <Input
                              type='number'
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
                      name='cilindrada'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cilindrada (cm³)</FormLabel>
                          <FormControl>
                            <Input
                              type='number'
                              step='0.1'
                              {...field}
                                className={TEXT_INPUT_CLASS}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
                    <FormField
                      control={form.control}
                      name='potencia'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Potência (cv)</FormLabel>
                          <FormControl>
                            <Input
                              type='number'
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
                      name='tara'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tara (kg)</FormLabel>
                          <FormControl>
                            <Input
                              type='number'
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
                      name='lotacao'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Lotação</FormLabel>
                          <FormControl>
                            <Input
                              type='number'
                              {...field}
                                className={TEXT_INPUT_CLASS}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
                    <FormField
                      control={form.control}
                      name='cargaUtil'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Carga Útil (kg)</FormLabel>
                          <FormControl>
                            <Input type='number' {...field} className={TEXT_INPUT_CLASS} />
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
                          <FormLabel>Comprimento (mm)</FormLabel>
                          <FormControl>
                            <Input type='number' {...field} className={TEXT_INPUT_CLASS} />
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
                            <Input type='number' {...field} className={TEXT_INPUT_CLASS} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
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
                  <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
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
                        Locação e Responsáveis
                      </CardTitle>
                      <p className='mt-1 text-sm text-muted-foreground'>
                        Indique a afetação e contratos da viatura
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className='space-y-6'>
                  <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
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
                  <FormField
                    control={form.control}
                    name='terceiroId'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Terceiro</FormLabel>
                        <FormControl>
                          <div className='relative'>
                          <Autocomplete
                            options={selectOptions.terceiros}
                            value={field.value}
                            onValueChange={field.onChange}
                            placeholder={placeholder(selectLoading.terceiros, 'o terceiro')}
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
                                title='Ver Terceiro'
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
                                title='Criar Terceiro'
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
                  <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
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
                            <Input
                              type='number'
                              step='0.01'
                              {...field}
                                className={TEXT_INPUT_CLASS}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className='grid grid-cols-1 gap-4'>
                    <FormField
                      control={form.control}
                      name='dataFinal'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Fim do Contrato</FormLabel>
                          <FormControl>
                            <DatePicker
                              value={field.value}
                              onChange={field.onChange}
                              placeholder='Selecione a data final'
                              className={FIELD_HEIGHT_CLASS}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
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
                            <Input
                              type='number'
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
                      name='valorRenda'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Valor por Renda (€)</FormLabel>
                          <FormControl>
                            <Input
                              type='number'
                              step='0.01'
                              {...field}
                                className={TEXT_INPUT_CLASS}
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
                        <FormLabel>Valor Residual (€)</FormLabel>
                        <FormControl>
                          <Input
                            type='number'
                            step='0.01'
                            {...field}
                            className={TEXT_INPUT_CLASS}
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
                    name='seguroId'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Seguro</FormLabel>
                        <FormControl>
                          <div className='relative'>
                          <Autocomplete
                            options={selectOptions.seguros}
                            value={field.value}
                            onValueChange={field.onChange}
                            placeholder={placeholder(selectLoading.seguros, 'o seguro')}
                            disabled={selectLoading.seguros}
                              className={SELECT_WITH_ACTIONS_CLASS}
                            />
                            <div className='absolute right-12 top-1/2 -translate-y-1/2 flex gap-1'>
                              <Button
                                type='button'
                                variant='outline'
                                size='sm'
                                onClick={handleViewSeguro}
                                className='h-8 w-8 p-0'
                                title='Ver Seguro'
                                disabled={!field.value}
                              >
                                <Eye className='h-4 w-4' />
                              </Button>
                              <Button
                                type='button'
                                variant='outline'
                                size='sm'
                                onClick={handleCreateSeguro}
                                className='h-8 w-8 p-0'
                                title='Criar Seguro'
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
                  <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
                    <FormField
                      control={form.control}
                      name='anoImpostoSelo'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ano Imposto de Selo</FormLabel>
                          <FormControl>
                            <Input
                              type='number'
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
                      name='anoImpostoCirculacao'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ano Imposto Circulação</FormLabel>
                          <FormControl>
                            <Input
                              type='number'
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
                          <FormLabel>Validade do Selo</FormLabel>
                          <FormControl>
                            <DatePicker
                              value={field.value}
                              onChange={field.onChange}
                              placeholder='Selecione a validade do selo'
                              className={FIELD_HEIGHT_CLASS}
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
                        Notas e Documentação
                      </CardTitle>
                      <p className='mt-1 text-sm text-muted-foreground'>
                        Adicione observações e evidências visuais
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className='space-y-6'>
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
                  <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                    <FormField
                      control={form.control}
                      name='urlImagem1'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>URL Imagem 1</FormLabel>
                          <FormControl>
                            <Input
                              placeholder='https://exemplo.com/imagem1.jpg'
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
                      name='urlImagem2'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>URL Imagem 2</FormLabel>
                          <FormControl>
                            <Input
                              placeholder='https://exemplo.com/imagem2.jpg'
                              {...field}
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
                    name='equipamentoId'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Equipamento</FormLabel>
                        <FormControl>
                        <div className='relative'>
                          <Autocomplete
                            options={selectOptions.equipamentos}
                            value={field.value}
                            onValueChange={field.onChange}
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
                              onClick={handleViewEquipamento}
                              className='h-8 w-8 p-0'
                              title='Ver Equipamento'
                              disabled={!field.value}
                            >
                              <Eye className='h-4 w-4' />
                            </Button>
                            <Button
                              type='button'
                              variant='outline'
                              size='sm'
                              onClick={handleCreateEquipamento}
                              className='h-8 w-8 p-0'
                              title='Criar Equipamento'
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

