import { useEffect, useMemo } from 'react'
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
  Car,
  ClipboardList,
  FileText,
  MapPin,
  Settings,
  ShieldCheck,
  Wrench,
} from 'lucide-react'
import { useTabManager } from '@/hooks/use-tab-manager'
import { useSubmitErrorTab } from '@/hooks/use-submit-error-tab'
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

  useEffect(() => {
    if (initialValues) {
      form.reset({
        ...defaultViaturaFormValues,
        ...initialValues,
      })
    }
  }, [initialValues, form])

  const { data: marcas = [], isLoading: isLoadingMarcas } = useGetMarcasSelect()
  const { data: modelos = [], isLoading: isLoadingModelos } = useGetModelosSelect()
  const { data: tipoViaturas = [], isLoading: isLoadingTipoViaturas } = useGetTipoViaturasSelect()
  const { data: cores = [], isLoading: isLoadingCores } = useGetCoresSelect()
  const { data: combustiveis = [], isLoading: isLoadingCombustiveis } = useGetCombustiveisSelect()
  const { data: conservatorias = [], isLoading: isLoadingConservatorias } = useGetConservatoriasSelect()
  const { data: categorias = [], isLoading: isLoadingCategorias } = useGetCategoriasSelect()
  const { data: localizacoes = [], isLoading: isLoadingLocalizacoes } = useGetLocalizacoesSelect()
  const { data: setores = [], isLoading: isLoadingSetores } = useGetSetoresSelect()
  const { data: delegacoes = [], isLoading: isLoadingDelegacoes } = useGetDelegacoesSelect()
  const { data: terceiros = [], isLoading: isLoadingTerceiros } = useGetTerceirosSelect()
  const { data: fornecedores = [], isLoading: isLoadingFornecedores } = useGetFornecedoresSelect()
  const { data: seguros = [], isLoading: isLoadingSeguros } = useGetSegurosSelect()
  const { data: equipamentos = [], isLoading: isLoadingEquipamentos } = useGetEquipamentosSelect()

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
                <CardContent className='space-y-6'>
                  <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
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
                              className='px-4 py-6 shadow-inner drop-shadow-xl'
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
                              className='px-4 py-6 shadow-inner drop-shadow-xl'
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
                      name='anoFabrico'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ano de Fabrico</FormLabel>
                          <FormControl>
                            <Input
                              type='number'
                              placeholder='Ano'
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
                      name='mesFabrico'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mês de Fabrico</FormLabel>
                          <FormControl>
                            <Input
                              type='number'
                              placeholder='Mês (1-12)'
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
                      name='dataInicial'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Data de Registo</FormLabel>
                          <FormControl>
                            <DatePicker
                              value={field.value}
                              onChange={field.onChange}
                              placeholder='Selecione a data de registo'
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
                      name='dataAquisicao'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Data de Aquisição</FormLabel>
                          <FormControl>
                            <DatePicker
                              value={field.value}
                              onChange={field.onChange}
                              placeholder='Selecione a data de aquisição'
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
                      name='marcaId'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Marca</FormLabel>
                          <FormControl>
                            <Autocomplete
                              options={selectOptions.marcas}
                              value={field.value}
                              onValueChange={field.onChange}
                              placeholder={placeholder(selectLoading.marcas, 'a marca')}
                              disabled={selectLoading.marcas}
                              className='px-4 py-5 pr-32 shadow-inner drop-shadow-xl'
                            />
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
                            <Autocomplete
                              options={selectOptions.modelos}
                              value={field.value}
                              onValueChange={field.onChange}
                              placeholder={placeholder(selectLoading.modelos, 'o modelo')}
                              disabled={selectLoading.modelos}
                              className='px-4 py-5 pr-32 shadow-inner drop-shadow-xl'
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
                      name='tipoViaturaId'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tipo de Viatura</FormLabel>
                          <FormControl>
                            <Autocomplete
                              options={selectOptions.tipoViaturas}
                              value={field.value}
                              onValueChange={field.onChange}
                              placeholder={placeholder(selectLoading.tipoViaturas, 'o tipo de viatura')}
                              disabled={selectLoading.tipoViaturas}
                              className='px-4 py-5 pr-32 shadow-inner drop-shadow-xl'
                            />
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
                            <Autocomplete
                              options={selectOptions.cores}
                              value={field.value}
                              onValueChange={field.onChange}
                              placeholder={placeholder(selectLoading.cores, 'a cor')}
                              disabled={selectLoading.cores}
                              className='px-4 py-5 pr-32 shadow-inner drop-shadow-xl'
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
                      name='conservatoriaId'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Conservatória</FormLabel>
                          <FormControl>
                            <Autocomplete
                              options={selectOptions.conservatorias}
                              value={field.value}
                              onValueChange={field.onChange}
                              placeholder={placeholder(selectLoading.conservatorias, 'a conservatória')}
                              disabled={selectLoading.conservatorias}
                              className='px-4 py-5 pr-32 shadow-inner drop-shadow-xl'
                            />
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
                            <Autocomplete
                              options={selectOptions.categorias}
                              value={field.value}
                              onValueChange={field.onChange}
                              placeholder={placeholder(selectLoading.categorias, 'a categoria')}
                              disabled={selectLoading.categorias}
                              className='px-4 py-5 pr-32 shadow-inner drop-shadow-xl'
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
                      name='localizacaoId'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Localização</FormLabel>
                          <FormControl>
                            <Autocomplete
                              options={selectOptions.localizacoes}
                              value={field.value}
                              onValueChange={field.onChange}
                              placeholder={placeholder(selectLoading.localizacoes, 'a localização')}
                              disabled={selectLoading.localizacoes}
                              className='px-4 py-5 pr-32 shadow-inner drop-shadow-xl'
                            />
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
                            <Autocomplete
                              options={selectOptions.setores}
                              value={field.value}
                              onValueChange={field.onChange}
                              placeholder={placeholder(selectLoading.setores, 'o setor')}
                              disabled={selectLoading.setores}
                              className='px-4 py-5 pr-32 shadow-inner drop-shadow-xl'
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
                      name='delegacaoId'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Delegação</FormLabel>
                          <FormControl>
                            <Autocomplete
                              options={selectOptions.delegacoes}
                              value={field.value}
                              onValueChange={field.onChange}
                              placeholder={placeholder(selectLoading.delegacoes, 'a delegação')}
                              disabled={selectLoading.delegacoes}
                              className='px-4 py-5 pr-32 shadow-inner drop-shadow-xl'
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
                              className='px-4 py-6 shadow-inner drop-shadow-xl'
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
                              className='px-4 py-6 shadow-inner drop-shadow-xl'
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
                            <Autocomplete
                              options={selectOptions.fornecedores}
                              value={field.value}
                              onValueChange={field.onChange}
                              placeholder={placeholder(selectLoading.fornecedores, 'o fornecedor')}
                              disabled={selectLoading.fornecedores}
                              className='px-4 py-5 pr-32 shadow-inner drop-shadow-xl'
                            />
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
                            <Autocomplete
                              options={selectOptions.combustiveis}
                              value={field.value}
                              onValueChange={field.onChange}
                              placeholder={placeholder(selectLoading.combustiveis, 'o combustível')}
                              disabled={selectLoading.combustiveis}
                              className='px-4 py-5 pr-32 shadow-inner drop-shadow-xl'
                            />
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
                              className='px-4 py-6 shadow-inner drop-shadow-xl'
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
                              className='px-4 py-6 shadow-inner drop-shadow-xl'
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
                              className='px-4 py-6 shadow-inner drop-shadow-xl'
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
                              className='px-4 py-6 shadow-inner drop-shadow-xl'
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
                              className='px-4 py-6 shadow-inner drop-shadow-xl'
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
                              className='px-4 py-6 shadow-inner drop-shadow-xl'
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
                              className='px-4 py-6 shadow-inner drop-shadow-xl'
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
                            <Input type='number' {...field} className='px-4 py-6 shadow-inner drop-shadow-xl' />
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
                            <Input type='number' {...field} className='px-4 py-6 shadow-inner drop-shadow-xl' />
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
                            <Input type='number' {...field} className='px-4 py-6 shadow-inner drop-shadow-xl' />
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
                              className='px-4 py-6 shadow-inner drop-shadow-xl'
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
                              className='px-4 py-6 shadow-inner drop-shadow-xl'
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
                            <Autocomplete
                              options={selectOptions.conservatorias}
                              value={field.value}
                              onValueChange={field.onChange}
                              placeholder={placeholder(selectLoading.conservatorias, 'a conservatória')}
                              disabled={selectLoading.conservatorias}
                              className='px-4 py-5 pr-32 shadow-inner drop-shadow-xl'
                            />
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
                            <Autocomplete
                              options={selectOptions.categorias}
                              value={field.value}
                              onValueChange={field.onChange}
                              placeholder={placeholder(selectLoading.categorias, 'a categoria')}
                              disabled={selectLoading.categorias}
                              className='px-4 py-5 pr-32 shadow-inner drop-shadow-xl'
                            />
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
                          <Autocomplete
                            options={selectOptions.terceiros}
                            value={field.value}
                            onValueChange={field.onChange}
                            placeholder={placeholder(selectLoading.terceiros, 'o terceiro')}
                            disabled={selectLoading.terceiros}
                            className='px-4 py-5 pr-32 shadow-inner drop-shadow-xl'
                          />
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
                              className='px-4 py-6 shadow-inner drop-shadow-xl'
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
                              className='px-4 py-6 shadow-inner drop-shadow-xl'
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
                              className='px-4 py-6 shadow-inner drop-shadow-xl'
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
                              className='px-4 py-6 shadow-inner drop-shadow-xl'
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
                            className='px-4 py-6 shadow-inner drop-shadow-xl'
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
                          <Autocomplete
                            options={selectOptions.seguros}
                            value={field.value}
                            onValueChange={field.onChange}
                            placeholder={placeholder(selectLoading.seguros, 'o seguro')}
                            disabled={selectLoading.seguros}
                            className='px-4 py-5 pr-32 shadow-inner drop-shadow-xl'
                          />
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
                              className='px-4 py-6 shadow-inner drop-shadow-xl'
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
                              className='px-4 py-6 shadow-inner drop-shadow-xl'
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
                              className='px-4 py-6 shadow-inner drop-shadow-xl'
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
                          <Autocomplete
                            options={selectOptions.equipamentos}
                            value={field.value}
                            onValueChange={field.onChange}
                            placeholder={placeholder(selectLoading.equipamentos, 'o equipamento')}
                            disabled={selectLoading.equipamentos}
                            className='px-4 py-5 pr-32 shadow-inner drop-shadow-xl'
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

