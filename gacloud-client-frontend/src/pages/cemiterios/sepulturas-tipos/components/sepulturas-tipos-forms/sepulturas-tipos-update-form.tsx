import { useEffect, useRef } from 'react'
import { z } from 'zod'
import { useForm, type Resolver } from 'react-hook-form'
import { useGetRubricasSelect } from '@/pages/base/rubricas/queries/rubricas-queries'
import { useGetSepulturasTiposDescricoesSelect } from '@/pages/cemiterios/sepulturas-tipos-descricoes/queries/sepulturas-tipos-descricoes-queries'
import { useUpdateSepulturaTipo } from '@/pages/cemiterios/sepulturas-tipos/queries/sepulturas-tipos-mutations'
import { useGetSepulturaTipo } from '@/pages/cemiterios/sepulturas-tipos/queries/sepulturas-tipos-queries'
import { Tag, FileText, Calculator } from 'lucide-react'
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
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@/components/ui/persistent-tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

// Utility preprocessors
const emptyToUndefined = (val: unknown) =>
  val === '' || val === null || val === undefined ? undefined : val
const numberOrUndefined = (val: unknown) =>
  val === '' || val === null || val === undefined ? undefined : Number(val)

const sepulturaTipoFormSchema = z.object({
  id: z.string().optional(),
  nome: z
    .string({ message: 'O Nome é obrigatório' })
    .min(1, { message: 'O Nome deve ter pelo menos 1 caráter' }),
  epocaId: z
    .string({ message: 'A Época é obrigatória' })
    .min(1, { message: 'A Época é obrigatória' }),
  sepulturaTipoDescricaoId: z
    .string({
      message: 'A Descrição é obrigatória',
    })
    .min(1, { message: 'A Descrição é obrigatória' }),
  vendaRubrica: z.preprocess(emptyToUndefined, z.string().optional()),
  vendaValor: z.preprocess(numberOrUndefined, z.number().optional()),
  vendaDescricao: z.preprocess(emptyToUndefined, z.string().optional()),
  aluguerRubrica: z.preprocess(emptyToUndefined, z.string().optional()),
  aluguerValor: z.preprocess(numberOrUndefined, z.number().optional()),
  aluguerDescricao: z.preprocess(emptyToUndefined, z.string().optional()),
  alvaraRubrica: z.preprocess(emptyToUndefined, z.string().optional()),
  alvaraValor: z.preprocess(numberOrUndefined, z.number().optional()),
  alvaraDescricao: z.preprocess(emptyToUndefined, z.string().optional()),
  transladacaoRubrica: z.preprocess(emptyToUndefined, z.string().optional()),
  transladacaoValor: z.preprocess(numberOrUndefined, z.number().optional()),
  transladacaoDescricao: z.preprocess(emptyToUndefined, z.string().optional()),
  transferenciaRubrica: z.preprocess(emptyToUndefined, z.string().optional()),
  transferenciaValor: z.preprocess(numberOrUndefined, z.number().optional()),
  transferenciaDescricao: z.preprocess(emptyToUndefined, z.string().optional()),
  exumacaoRubrica: z.preprocess(emptyToUndefined, z.string().optional()),
  exumacaoValor: z.preprocess(numberOrUndefined, z.number().optional()),
  exumacaoDescricao: z.preprocess(emptyToUndefined, z.string().optional()),
  inumacaoRubrica: z.preprocess(emptyToUndefined, z.string().optional()),
  inumacaoValor: z.preprocess(numberOrUndefined, z.number().optional()),
  inumacaoDescricao: z.preprocess(emptyToUndefined, z.string().optional()),
  concessionadaRubrica: z.preprocess(emptyToUndefined, z.string().optional()),
  concessionadaValor: z.preprocess(numberOrUndefined, z.number().optional()),
  concessionadaDescricao: z.preprocess(emptyToUndefined, z.string().optional()),
  createdOn: z.date().optional(),
})

type SepulturaTipoFormSchemaType = z.infer<typeof sepulturaTipoFormSchema>

interface SepulturaTipoUpdateFormProps {
  modalClose: () => void
  sepulturaTipoId: string
  initialData: {
    nome: string
    epocaId: string
    sepulturaTipoDescricaoId: string
    vendaRubrica?: string
    vendaValor?: number
    vendaDescricao?: string
    aluguerRubrica?: string
    aluguerValor?: number
    aluguerDescricao?: string
    alvaraRubrica?: string
    alvaraValor?: number
    alvaraDescricao?: string
    transladacaoRubrica?: string
    transladacaoValor?: number
    transladacaoDescricao?: string
    transferenciaRubrica?: string
    transferenciaValor?: number
    transferenciaDescricao?: string
    exumacaoRubrica?: string
    exumacaoValor?: number
    exumacaoDescricao?: string
    inumacaoRubrica?: string
    inumacaoValor?: number
    inumacaoDescricao?: string
    concessionadaRubrica?: string
    concessionadaValor?: number
    concessionadaDescricao?: string
  }
}

const SepulturaTipoUpdateForm = ({
  modalClose,
  sepulturaTipoId,
  initialData,
}: SepulturaTipoUpdateFormProps) => {
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

  const updateSepulturaTipoMutation = useUpdateSepulturaTipo()
  const { data: sepulturaTipoData } = useGetSepulturaTipo(sepulturaTipoId)
  const {
    data: sepulturaTipoDescricoesData,
    isLoading: isLoadingSepulturaTipoDescricoes,
    refetch: refetchSepulturaTipoDescricoes,
  } = useGetSepulturasTiposDescricoesSelect()
  const {
    data: rubricasData,
    isLoading: isLoadingRubricas,
    refetch: refetchRubricas,
  } = useGetRubricasSelect()

  const sepulturaTipoResolver: Resolver<SepulturaTipoFormSchemaType> = async (
    values
  ) => {
    const result = sepulturaTipoFormSchema.safeParse(values)
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

  const form = useForm<SepulturaTipoFormSchemaType>({
    resolver: sepulturaTipoResolver,
    defaultValues: initialData,
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
    criteriaMode: 'all',
  })

  const { setActiveTab } = useTabManager({
    defaultTab: 'dados',
    tabKey: `sepultura-tipo-${instanceId}`,
  })
  const { handleError } = useSubmitErrorTab<SepulturaTipoFormSchemaType>({
    setActiveTab,
    fieldToTabMap: {
      default: 'dados',
      nome: 'dados',
      epocaId: 'dados',
      sepulturaTipoDescricaoId: 'dados',
      vendaRubrica: 'configuracoes',
      vendaValor: 'configuracoes',
      vendaDescricao: 'configuracoes',
      aluguerRubrica: 'configuracoes',
      aluguerValor: 'configuracoes',
      aluguerDescricao: 'configuracoes',
    },
  })

  // Use the combined auto-selection and return data hook for cemiterio sepultura tipo descricoes
  useAutoSelectionWithReturnData({
    windowId,
    instanceId,
    data: sepulturaTipoDescricoesData || [],
    setValue: (value: string) =>
      form.setValue('sepulturaTipoDescricaoId', value),
    refetch: refetchSepulturaTipoDescricoes,
    itemName: 'Descrição do Tipo de Sepultura',
    successMessage: 'Descrição selecionada automaticamente',
    manualSelectionMessage:
      'Descrição criada com sucesso. Por favor, selecione-a manualmente.',
    queryKey: ['cemiterios-sepulturas-tipos-descricoes-select'],
    returnDataKey: `return-data-${windowId}-sepultura-tipo-descricao`,
  })

  // Use the combined auto-selection and return data hook for rubricas (vendaRubrica)
  useAutoSelectionWithReturnData({
    windowId,
    instanceId,
    data: rubricasData || [],
    setValue: (value: string) => form.setValue('vendaRubrica', value),
    refetch: refetchRubricas,
    itemName: 'Rubrica de Venda',
    successMessage: 'Rubrica de venda selecionada automaticamente',
    manualSelectionMessage:
      'Rubrica criada com sucesso. Por favor, selecione-a manualmente.',
    queryKey: ['rubricas-select'],
    returnDataKey: `return-data-${windowId}-rubrica`,
  })

  // Use the combined auto-selection and return data hook for rubricas (aluguerRubrica)
  useAutoSelectionWithReturnData({
    windowId,
    instanceId,
    data: rubricasData || [],
    setValue: (value: string) => form.setValue('aluguerRubrica', value),
    refetch: refetchRubricas,
    itemName: 'Rubrica de Aluguer',
    successMessage: 'Rubrica de aluguer selecionada automaticamente',
    manualSelectionMessage:
      'Rubrica criada com sucesso. Por favor, selecione-a manualmente.',
    queryKey: ['rubricas-select'],
    returnDataKey: `return-data-${windowId}-rubrica`,
  })

  // Initialize form state on first render
  useEffect(() => {
    if (isFirstRender.current) {
      // If this form has never been visited before or doesn't have data, reset it
      if (!hasBeenVisited || !hasFormData(formId)) {
        resetFormState(formId)
        // Set initial form data with windowId
        setFormState(formId, {
          formData: initialData,
          isDirty: false,
          isValid: true,
          isSubmitting: false,
          hasBeenModified: false,
          windowId: windowId,
        })
      }
      isFirstRender.current = false
    }
  }, [formId, hasBeenVisited, resetFormState, hasFormData, initialData])

  // Load saved form data if available and the form has been initialized
  useEffect(() => {
    if (isInitialized && hasFormData(formId)) {
      form.reset(formData as SepulturaTipoFormSchemaType)
    } else if (sepulturaTipoData && !form.formState.isDirty) {
      form.reset({
        nome: sepulturaTipoData.info.data.nome,
        epocaId: sepulturaTipoData.info.data.epocaId,
        sepulturaTipoDescricaoId:
          sepulturaTipoData.info.data.sepulturaTipoDescricaoId,
        vendaRubrica: sepulturaTipoData.info.data.vendaRubrica,
        vendaValor: sepulturaTipoData.info.data.vendaValor,
        vendaDescricao: sepulturaTipoData.info.data.vendaDescricao,
        aluguerRubrica: sepulturaTipoData.info.data.aluguerRubrica,
        aluguerValor: sepulturaTipoData.info.data.aluguerValor,
        aluguerDescricao: sepulturaTipoData.info.data.aluguerDescricao,
        alvaraRubrica: sepulturaTipoData.info.data.alvaraRubrica,
        alvaraValor: sepulturaTipoData.info.data.alvaraValor,
        alvaraDescricao: sepulturaTipoData.info.data.alvaraDescricao,
        transladacaoRubrica: sepulturaTipoData.info.data.transladacaoRubrica,
        transladacaoValor: sepulturaTipoData.info.data.transladacaoValor,
        transladacaoDescricao:
          sepulturaTipoData.info.data.transladacaoDescricao,
        transferenciaRubrica: sepulturaTipoData.info.data.transferenciaRubrica,
        transferenciaValor: sepulturaTipoData.info.data.transferenciaValor,
        transferenciaDescricao:
          sepulturaTipoData.info.data.transferenciaDescricao,
        exumacaoRubrica: sepulturaTipoData.info.data.exumacaoRubrica,
        exumacaoValor: sepulturaTipoData.info.data.exumacaoValor,
        exumacaoDescricao: sepulturaTipoData.info.data.exumacaoDescricao,
        inumacaoRubrica: sepulturaTipoData.info.data.inumacaoRubrica,
        inumacaoValor: sepulturaTipoData.info.data.inumacaoValor,
        inumacaoDescricao: sepulturaTipoData.info.data.inumacaoDescricao,
        concessionadaRubrica: sepulturaTipoData.info.data.concessionadaRubrica,
        concessionadaValor: sepulturaTipoData.info.data.concessionadaValor,
        concessionadaDescricao:
          sepulturaTipoData.info.data.concessionadaDescricao,
      })
    }
  }, [
    formData,
    isInitialized,
    formId,
    hasFormData,
    sepulturaTipoData,
    form.formState.isDirty,
  ])

  // Save form data when it changes
  useEffect(() => {
    const subscription = form.watch((value) => {
      if (!initialData) return

      // Use proper change detection by comparing with original values
      const hasChanges = detectUpdateFormChanges(value, initialData)

      setFormState(formId, {
        formData: value as SepulturaTipoFormSchemaType,
        isDirty: hasChanges,
        isValid: form.formState.isValid,
        isSubmitting: form.formState.isSubmitting,
        hasBeenModified: hasChanges,
        windowId: windowId,
      })
      updateWindowFormData(windowId, hasChanges, setWindowHasFormData)
      const newTitle = value.nome || 'Tipo de Sepultura'
      updateUpdateWindowTitle(windowId, newTitle, updateWindowState)
    })
    return () => subscription.unsubscribe()
  }, [form, windowId, formId, initialData])

  const handleClose = () => {
    // Clean up all form instances for the current window
    cleanupWindowForms(windowId)

    handleWindowClose(windowId, navigate, removeWindow)
  }

  const onSubmit = async (values: SepulturaTipoFormSchemaType) => {
    try {
      updateFormState(formId, (state) => ({
        ...state,
        isSubmitting: true,
      }))

      const response = await updateSepulturaTipoMutation.mutateAsync({
        id: sepulturaTipoId,
        data: {
          nome: values.nome,
          epocaId: values.epocaId,
          sepulturaTipoDescricaoId: values.sepulturaTipoDescricaoId,
          vendaRubrica: values.vendaRubrica,
          vendaValor: values.vendaValor,
          vendaDescricao: values.vendaDescricao,
          aluguerRubrica: values.aluguerRubrica,
          aluguerValor: values.aluguerValor,
          aluguerDescricao: values.aluguerDescricao,
          alvaraRubrica: values.alvaraRubrica,
          alvaraValor: values.alvaraValor,
          alvaraDescricao: values.alvaraDescricao,
          transladacaoRubrica: values.transladacaoRubrica,
          transladacaoValor: values.transladacaoValor,
          transladacaoDescricao: values.transladacaoDescricao,
          transferenciaRubrica: values.transferenciaRubrica,
          transferenciaValor: values.transferenciaValor,
          transferenciaDescricao: values.transferenciaDescricao,
          exumacaoRubrica: values.exumacaoRubrica,
          exumacaoValor: values.exumacaoValor,
          exumacaoDescricao: values.exumacaoDescricao,
          inumacaoRubrica: values.inumacaoRubrica,
          inumacaoValor: values.inumacaoValor,
          inumacaoDescricao: values.inumacaoDescricao,
          concessionadaRubrica: values.concessionadaRubrica,
          concessionadaValor: values.concessionadaValor,
          concessionadaDescricao: values.concessionadaDescricao,
        },
      })

      const result = handleApiResponse(
        response,
        'Tipo de sepultura atualizado com sucesso',
        'Erro ao atualizar tipo de sepultura',
        'Tipo de sepultura atualizado com avisos'
      )

      if (result.success) {
        // Close the window
        if (windowId) {
          removeWindow(windowId)
        }
        modalClose()
      }
    } catch (error) {
      toast.error(handleApiError(error, 'Erro ao atualizar tipo de sepultura'))
    } finally {
      updateFormState(formId, (state) => ({
        ...state,
        isSubmitting: false,
      }))
    }
  }

  const sortedSepulturaTipoDescricoes =
    sepulturaTipoDescricoesData
      ?.slice()
      .sort((a, b) => a.descricao.localeCompare(b.descricao)) || []
  const sortedRubricas =
    rubricasData
      ?.slice()
      .sort((a, b) => a.codigo.localeCompare(b.codigo))
      .map((rubrica) => ({
        value: rubrica.id,
        label: `${rubrica.codigo} - ${rubrica.descricao}`,
      })) || []

  const operations = [
    {
      name: 'Aluguer',
      rubricaField: 'aluguerRubrica',
      valorField: 'aluguerValor',
      descricaoField: 'aluguerDescricao',
    },
    {
      name: 'Alvará',
      rubricaField: 'alvaraRubrica',
      valorField: 'alvaraValor',
      descricaoField: 'alvaraDescricao',
    },
    {
      name: 'Concessionada',
      rubricaField: 'concessionadaRubrica',
      valorField: 'concessionadaValor',
      descricaoField: 'concessionadaDescricao',
    },
    {
      name: 'Exumação',
      rubricaField: 'exumacaoRubrica',
      valorField: 'exumacaoValor',
      descricaoField: 'exumacaoDescricao',
    },
    {
      name: 'Inumação',
      rubricaField: 'inumacaoRubrica',
      valorField: 'inumacaoValor',
      descricaoField: 'inumacaoDescricao',
    },
    {
      name: 'Transferência',
      rubricaField: 'transferenciaRubrica',
      valorField: 'transferenciaValor',
      descricaoField: 'transferenciaDescricao',
    },
    {
      name: 'Transladação',
      rubricaField: 'transladacaoRubrica',
      valorField: 'transladacaoValor',
      descricaoField: 'transladacaoDescricao',
    },
    {
      name: 'Venda',
      rubricaField: 'vendaRubrica',
      valorField: 'vendaValor',
      descricaoField: 'vendaDescricao',
    },
  ]

  return (
    <div className='space-y-4'>
      <Form {...form}>
        <form
          id='tipoSepulturaUpdateForm'
          onSubmit={form.handleSubmit(onSubmit, handleError)}
          className='space-y-4'
          autoComplete='off'
        >
          <PersistentTabs
            defaultValue='dados'
            className='w-full'
            tabKey={`sepultura-tipo-${instanceId}`}
          >
            <TabsList>
              <TabsTrigger value='dados'>Dados</TabsTrigger>
              <TabsTrigger value='configuracoes'>Configurações</TabsTrigger>
            </TabsList>
            <TabsContent value='dados'>
              <Card className='overflow-hidden border-l-4 border-l-primary/20 hover:border-l-primary/40 transition-all duration-200 hover:shadow-md'>
                <CardHeader className='pb-4'>
                  <div className='flex items-center gap-3'>
                    <div className='flex items-center justify-center w-8 h-8 rounded-md bg-primary/10 text-primary'>
                      <Tag className='h-4 w-4' />
                    </div>
                    <div>
                      <CardTitle className='text-base flex items-center gap-2'>
                        Identificação do Tipo de Sepultura
                        <Badge variant='secondary' className='text-xs'>
                          Obrigatório
                        </Badge>
                      </CardTitle>
                      <p className='text-sm text-muted-foreground mt-1'>
                        Informações básicas para identificação do tipo de
                        sepultura
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
                      name='sepulturaTipoDescricaoId'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className='flex items-center gap-2'>
                            <FileText className='h-4 w-4' />
                            Descrição
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                            disabled={isLoadingSepulturaTipoDescricoes}
                          >
                            <FormControl>
                              <SelectTrigger className='px-4 py-6 shadow-inner drop-shadow-xl'>
                                <SelectValue
                                  placeholder={
                                    isLoadingSepulturaTipoDescricoes
                                      ? 'A carregar...'
                                      : 'Selecione uma descrição'
                                  }
                                />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {sortedSepulturaTipoDescricoes.map(
                                (descricao) => (
                                  <SelectItem
                                    key={descricao.id}
                                    value={descricao.id || ''}
                                  >
                                    {descricao.descricao}
                                  </SelectItem>
                                )
                              )}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value='configuracoes'>
              <Card className='overflow-hidden border-l-4 border-l-primary/20 hover:border-l-primary/40 transition-all duration-200 hover:shadow-md'>
                <CardHeader className='pb-4'>
                  <div className='flex items-center gap-3'>
                    <div className='flex items-center justify-center w-8 h-8 rounded-md bg-primary/10 text-primary'>
                      <Calculator className='h-4 w-4' />
                    </div>
                    <div>
                      <CardTitle className='text-base flex items-center gap-2'>
                        Configurações de Operações
                        <Badge variant='outline' className='text-xs'>
                          Opcional
                        </Badge>
                      </CardTitle>
                      <p className='text-sm text-muted-foreground mt-1'>
                        Configure as rubricas e valores para cada operação
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className='space-y-6'>
                  <div className='rounded-md border'>
                    <div className='relative'>
                      {/* Desktop Table Header */}
                      <table className='w-full hidden md:table'>
                        <thead className='sticky top-0 bg-muted/50 z-10'>
                          <tr className='border-b'>
                            <th className='h-10 px-4 text-left align-middle font-medium text-muted-foreground text-sm w-[200px]'>
                              Operação
                            </th>
                            <th className='h-10 px-4 text-left align-middle font-medium text-muted-foreground text-sm'>
                              Rubrica
                            </th>
                            <th className='h-10 px-4 text-left align-middle font-medium text-muted-foreground text-sm'>
                              Valor
                            </th>
                            <th className='h-10 px-4 text-left align-middle font-medium text-muted-foreground text-sm'>
                              Descrição
                            </th>
                          </tr>
                        </thead>
                      </table>

                      {/* Mobile: Render all rows as a stack */}
                      <div className='md:hidden'>
                        {operations.map((operation) => (
                          <div key={operation.name} className='border-b'>
                            <div className='p-4 border-b bg-muted/50'>
                              <h3 className='font-medium text-sm'>
                                {operation.name}
                              </h3>
                            </div>
                            <div className='p-4 space-y-4'>
                              <FormField
                                control={form.control}
                                name={
                                  operation.rubricaField as keyof SepulturaTipoFormSchemaType
                                }
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className='text-sm text-muted-foreground'>
                                      Rubrica
                                    </FormLabel>
                                    <FormControl>
                                      <Autocomplete
                                        options={sortedRubricas}
                                        value={
                                          typeof field.value === 'string'
                                            ? field.value
                                            : ''
                                        }
                                        onValueChange={field.onChange}
                                        placeholder='Selecione uma rubrica'
                                        disabled={isLoadingRubricas}
                                        className='px-4 py-6 shadow-inner drop-shadow-xl'
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name={
                                  operation.valorField as keyof SepulturaTipoFormSchemaType
                                }
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className='text-sm text-muted-foreground'>
                                      Valor
                                    </FormLabel>
                                    <FormControl>
                                      <Input
                                        type='number'
                                        step='0.01'
                                        {...field}
                                        value={
                                          typeof field.value === 'number'
                                            ? field.value
                                            : ''
                                        }
                                        onChange={(e) => {
                                          const value =
                                            e.target.value === ''
                                              ? undefined
                                              : parseFloat(e.target.value)
                                          field.onChange(value)
                                        }}
                                        placeholder='0.00'
                                        className='px-4 py-6 shadow-inner drop-shadow-xl'
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name={
                                  operation.descricaoField as keyof SepulturaTipoFormSchemaType
                                }
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className='text-sm text-muted-foreground'>
                                      Descrição
                                    </FormLabel>
                                    <FormControl>
                                      <Input
                                        {...field}
                                        value={
                                          typeof field.value === 'object' &&
                                          field.value instanceof Date
                                            ? ''
                                            : (field.value ?? '')
                                        }
                                        placeholder='Descrição'
                                        className='px-4 py-6 shadow-inner drop-shadow-xl'
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Desktop: Table body */}
                      <div
                        className='hidden md:block overflow-auto'
                        style={{ height: '400px' }}
                      >
                        <table className='w-full'>
                          <tbody>
                            {operations.map((operation) => (
                              <tr
                                key={operation.name}
                                className='border-b hover:bg-muted/50'
                              >
                                <td className='p-3 align-middle font-medium text-sm w-[200px]'>
                                  {operation.name}
                                </td>
                                <td className='p-3 align-middle'>
                                  <FormField
                                    control={form.control}
                                    name={
                                      operation.rubricaField as keyof SepulturaTipoFormSchemaType
                                    }
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormControl>
                                          <Autocomplete
                                            options={sortedRubricas}
                                            value={
                                              typeof field.value === 'string'
                                                ? field.value
                                                : ''
                                            }
                                            onValueChange={field.onChange}
                                            placeholder='Selecione uma rubrica'
                                            disabled={isLoadingRubricas}
                                            className='h-9'
                                          />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                </td>
                                <td className='p-3 align-middle'>
                                  <FormField
                                    control={form.control}
                                    name={
                                      operation.valorField as keyof SepulturaTipoFormSchemaType
                                    }
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormControl>
                                          <Input
                                            type='number'
                                            step='0.01'
                                            {...field}
                                            value={
                                              typeof field.value === 'number'
                                                ? field.value
                                                : ''
                                            }
                                            onChange={(e) => {
                                              const value =
                                                e.target.value === ''
                                                  ? undefined
                                                  : parseFloat(e.target.value)
                                              field.onChange(value)
                                            }}
                                            placeholder='0.00'
                                            className='h-9'
                                          />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                </td>
                                <td className='p-3 align-middle'>
                                  <FormField
                                    control={form.control}
                                    name={
                                      operation.descricaoField as keyof SepulturaTipoFormSchemaType
                                    }
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormControl>
                                          <Input
                                            {...field}
                                            value={
                                              typeof field.value === 'object' &&
                                              field.value instanceof Date
                                                ? ''
                                                : (field.value ?? '')
                                            }
                                            placeholder='Descrição'
                                            className='h-9'
                                          />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
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
              disabled={updateSepulturaTipoMutation.isPending}
              className='w-full md:w-auto'
            >
              {updateSepulturaTipoMutation.isPending
                ? 'A atualizar...'
                : 'Atualizar'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

export { SepulturaTipoUpdateForm }
