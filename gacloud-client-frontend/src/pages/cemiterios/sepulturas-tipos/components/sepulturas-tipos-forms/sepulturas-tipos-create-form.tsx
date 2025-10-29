import { useEffect, useRef } from 'react'
import { z } from 'zod'
import { useForm, type Resolver } from 'react-hook-form'
import { useGetRubricasSelect } from '@/pages/base/rubricas/queries/rubricas-queries'
import { useGetSepulturasTiposDescricoesSelect } from '@/pages/cemiterios/sepulturas-tipos-descricoes/queries/sepulturas-tipos-descricoes-queries'
import { useCreateSepulturaTipo } from '@/pages/cemiterios/sepulturas-tipos/queries/sepulturas-tipos-mutations'
import { Tag, FileText, Calculator } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useFormState, useFormsStore } from '@/stores/use-forms-store'
import { useWindowsStore } from '@/stores/use-windows-store'
import { handleApiError } from '@/utils/error-handlers'
import { handleApiResponse } from '@/utils/response-handlers'
import { toast } from '@/utils/toast-utils'
import { detectFormChanges } from '@/utils/window-utils'
import {
  useCurrentWindowId,
  handleWindowClose,
  updateCreateFormData,
  cleanupWindowForms,
  updateCreateWindowTitle,
  setEntityReturnDataWithToastSuppression,
} from '@/utils/window-utils'
import { useEpocaSelection } from '@/hooks/use-epoca-selection'
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

const sepulturaTipoFormSchema = z.object({
  id: z.string().optional(),
  nome: z
    .string({ message: 'O Nome é obrigatório' })
    .min(1, { message: 'O Nome deve ter pelo menos 1 caráter' }),
  epocaId: z.string().optional(),
  sepulturaTipoDescricaoId: z
    .string({
      message: 'A Descrição é obrigatória',
    })
    .min(1, { message: 'A Descrição é obrigatória' }),
  vendaRubrica: z.string().optional(),
  vendaValor: z.number().optional(),
  vendaDescricao: z.string().optional(),
  aluguerRubrica: z.string().optional(),
  aluguerValor: z.number().optional(),
  aluguerDescricao: z.string().optional(),
  alvaraRubrica: z.string().optional(),
  alvaraValor: z.number().optional(),
  alvaraDescricao: z.string().optional(),
  transladacaoRubrica: z.string().optional(),
  transladacaoValor: z.number().optional(),
  transladacaoDescricao: z.string().optional(),
  transferenciaRubrica: z.string().optional(),
  transferenciaValor: z.number().optional(),
  transferenciaDescricao: z.string().optional(),
  exumacaoRubrica: z.string().optional(),
  exumacaoValor: z.number().optional(),
  exumacaoDescricao: z.string().optional(),
  inumacaoRubrica: z.string().optional(),
  inumacaoValor: z.number().optional(),
  inumacaoDescricao: z.string().optional(),
  concessionadaRubrica: z.string().optional(),
  concessionadaValor: z.number().optional(),
  concessionadaDescricao: z.string().optional(),
  createdOn: z.date().optional(),
})

type SepulturaTipoFormSchemaType = z.infer<typeof sepulturaTipoFormSchema>

interface SepulturaTipoCreateFormProps {
  modalClose: () => void
  preSelectedEpocaId?: string
  preSelectedSepulturaTipoDescricaoId?: string
  initialNome?: string
  onSuccess?: (newSepulturaTipo: { id: string; nome: string }) => void
  shouldCloseWindow?: boolean
}

const SepulturaTipoCreateForm = ({
  modalClose,
  preSelectedEpocaId,
  preSelectedSepulturaTipoDescricaoId,
  initialNome,
  onSuccess,
  shouldCloseWindow = true,
}: SepulturaTipoCreateFormProps) => {
  const location = useLocation()
  const navigate = useNavigate()
  const windowId = useCurrentWindowId()
  const searchParams = new URLSearchParams(location.search)
  const instanceId = searchParams.get('instanceId') || 'default'
  const formId = `sepultura-tipo-${instanceId}`
  const { selectedEpoca } = useEpocaSelection()

  // Use a ref to track if this is the first render
  const isFirstRender = useRef(true)

  const { formData, hasBeenVisited } = useFormState(formId)
  const { setFormState, updateFormState, resetFormState, hasFormData } =
    useFormsStore()
  const { removeWindow, setWindowReturnData } = useWindowsStore()
  const setWindowHasFormData = useWindowsStore(
    (state) => state.setWindowHasFormData
  )
  const updateWindowState = useWindowsStore((state) => state.updateWindowState)

  const {
    data: sepulturaTipoDescricoesData,
    isLoading: isLoadingSepulturaTipoDescricoes,
  } = useGetSepulturasTiposDescricoesSelect()
  const { data: rubricasData, isLoading: isLoadingRubricas } =
    useGetRubricasSelect()
  const createSepulturaTipoMutation = useCreateSepulturaTipo()

  // Get parent window ID from sessionStorage as fallback
  const parentWindowIdFromStorage = sessionStorage.getItem(
    `parent-window-${instanceId}`
  )
  const effectiveWindowId = windowId || instanceId

  // Define default values for proper change detection
  const defaultValues = {
    nome: '',
    epocaId: preSelectedEpocaId || selectedEpoca?.id || '',
    sepulturaTipoDescricaoId: '',
  }

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
    return { values, errors }
  }

  const form = useForm<SepulturaTipoFormSchemaType>({
    resolver: sepulturaTipoResolver,
    defaultValues,
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

  // Track last restored descricaoId to avoid infinite loops
  const lastRestoredDescricaoId = useRef<string | undefined>(undefined)
  // Track if we have already restored from storage
  const hasRestoredFromStorage = useRef(false)

  // Initialize form state on first render
  useEffect(() => {
    if (isFirstRender.current) {
      // If this form has never been visited before or doesn't have data, reset it
      if (!hasBeenVisited || !hasFormData(formId)) {
        resetFormState(formId)
        // Set initial form data with windowId and default values
        setFormState(formId, {
          formData: defaultValues,
          isDirty: false,
          isValid: false,
          isSubmitting: false,
          hasBeenModified: false,
          windowId: effectiveWindowId,
        })
      }
      isFirstRender.current = false
    }
  }, [formId, hasBeenVisited, resetFormState, hasFormData, defaultValues])

  // Only restore form state after options are loaded
  useEffect(() => {
    if (
      !hasRestoredFromStorage.current &&
      !isLoadingSepulturaTipoDescricoes &&
      sepulturaTipoDescricoesData &&
      sepulturaTipoDescricoesData.length > 0
    ) {
      // If there is saved form data, restore it
      if (hasFormData(formId)) {
        const allowedFields: (keyof SepulturaTipoFormSchemaType)[] = [
          'id',
          'nome',
          'epocaId',
          'sepulturaTipoDescricaoId',
          'vendaRubrica',
          'vendaValor',
          'vendaDescricao',
          'aluguerRubrica',
          'aluguerValor',
          'aluguerDescricao',
          'alvaraRubrica',
          'alvaraValor',
          'alvaraDescricao',
          'transladacaoRubrica',
          'transladacaoValor',
          'transladacaoDescricao',
          'transferenciaRubrica',
          'transferenciaValor',
          'transferenciaDescricao',
          'exumacaoRubrica',
          'exumacaoValor',
          'exumacaoDescricao',
          'inumacaoRubrica',
          'inumacaoValor',
          'inumacaoDescricao',
          'concessionadaRubrica',
          'concessionadaValor',
          'concessionadaDescricao',
          'createdOn',
        ]
        let filteredFormData = Object.keys(formData || {}).reduce(
          (acc, key) => {
            if (
              allowedFields.includes(key as keyof SepulturaTipoFormSchemaType)
            ) {
              acc[key as keyof SepulturaTipoFormSchemaType] = formData[key]
            }
            return acc
          },
          {} as Partial<SepulturaTipoFormSchemaType>
        )
        // Ensure sepulturaTipoDescricaoId is a string and matches an available option
        const descricoesIds = sepulturaTipoDescricoesData.map((d) =>
          String(d.id)
        )
        let descId = filteredFormData.sepulturaTipoDescricaoId
        if (descId !== undefined && descId !== null && descId !== '') {
          descId = String(descId)
          if (!descricoesIds.includes(descId)) {
            descId = ''
          }
        } else {
          descId = ''
        }
        filteredFormData.sepulturaTipoDescricaoId = descId
        setFormState(formId, { formData: filteredFormData })
        form.reset(filteredFormData)
        lastRestoredDescricaoId.current = descId
      } else {
        // If no saved data, use the pre-selected values
        let descId = preSelectedSepulturaTipoDescricaoId || ''
        const descricoesIds = sepulturaTipoDescricoesData.map((d) =>
          String(d.id)
        )
        if (descId !== '' && !descricoesIds.includes(String(descId))) {
          descId = ''
        }
        form.reset({
          nome: initialNome || '',
          epocaId: preSelectedEpocaId || '',
          sepulturaTipoDescricaoId: String(descId),
        })
        lastRestoredDescricaoId.current = descId
      }
      hasRestoredFromStorage.current = true
    }
  }, [
    isLoadingSepulturaTipoDescricoes,
    sepulturaTipoDescricoesData,
    hasFormData,
    formId,
    formData,
    setFormState,
    preSelectedEpocaId,
    preSelectedSepulturaTipoDescricaoId,
    initialNome,
    form,
  ])

  // Save form data when it changes
  useEffect(() => {
    const subscription = form.watch((value) => {
      // Only consider user-editable fields for dirty state
      const userFields = { ...value }
      delete userFields.epocaId

      // Use proper change detection by comparing with default values
      const hasChanges = detectFormChanges(userFields, defaultValues)

      // Only update the form state if the values are different from the current state
      if (JSON.stringify(value) !== JSON.stringify(formData)) {
        setFormState(formId, {
          formData: value as SepulturaTipoFormSchemaType,
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
            userFields,
            setWindowHasFormData,
            defaultValues
          )
          // Only update window title if the nome field has changed
          if (value.nome !== formData?.nome) {
            updateCreateWindowTitle(
              effectiveWindowId,
              value.nome,
              updateWindowState
            )
          }
        }
      }
    })
    return () => subscription.unsubscribe()
  }, [form, effectiveWindowId, formId, formData, defaultValues])

  // Add effect to update name when description changes
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'sepulturaTipoDescricaoId') {
        const selectedDescricao = sepulturaTipoDescricoesData?.find(
          (d) => d.id === value.sepulturaTipoDescricaoId
        )
        const epocaYear = selectedEpoca?.ano || ''

        if (selectedDescricao) {
          form.setValue('nome', `${selectedDescricao.descricao} ${epocaYear}`)
        }
      }
    })
    return () => subscription.unsubscribe()
  }, [form, sepulturaTipoDescricoesData, selectedEpoca])

  const handleClose = () => {
    // Clean up all form instances for the current window
    cleanupWindowForms(effectiveWindowId)

    if (shouldCloseWindow) {
      handleWindowClose(effectiveWindowId, navigate, removeWindow)
    } else {
      modalClose()
    }
  }

  const onSubmit = async (values: SepulturaTipoFormSchemaType) => {
    try {
      // Ensure we use the selected IDs if they're set
      const finalEpocaId =
        preSelectedEpocaId || selectedEpoca?.id || values.epocaId

      // Validate that epocaId is available
      if (!finalEpocaId) {
        toast.error('Época é obrigatória. Por favor, selecione uma época.')
        return
      }

      const finalValues = {
        ...values,
        epocaId: finalEpocaId,
        sepulturaTipoDescricaoId:
          preSelectedSepulturaTipoDescricaoId ||
          values.sepulturaTipoDescricaoId,
      }

      updateFormState(formId, (state) => ({
        ...state,
        isSubmitting: true,
      }))

      const response =
        await createSepulturaTipoMutation.mutateAsync(finalValues)

      const result = handleApiResponse(
        response,
        'Tipo de Sepultura criado com sucesso',
        'Erro ao criar Tipo de Sepultura',
        'Tipo de Sepultura criado com avisos'
      )

      if (result.success) {
        const newTipoId = response.info.data

        // Set return data for parent window if this window was opened from another window
        if (effectiveWindowId) {
          setEntityReturnDataWithToastSuppression(
            effectiveWindowId,
            { id: newTipoId, nome: values.nome },
            'tipo',
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
          onSuccess({
            id: newTipoId,
            nome: values.nome,
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
      toast.error(handleApiError(error, 'Erro ao criar Tipo de Sepultura'))
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
          id='tipoSepulturaCreateForm'
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
              disabled={createSepulturaTipoMutation.isPending}
              className='w-full md:w-auto'
            >
              {createSepulturaTipoMutation.isPending ? 'A criar...' : 'Criar'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

export { SepulturaTipoCreateForm }
