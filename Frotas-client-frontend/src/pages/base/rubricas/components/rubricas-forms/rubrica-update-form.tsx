import { useEffect, useRef } from 'react'
import { z } from 'zod'
import { useForm, type Resolver } from 'react-hook-form'
import { useGetEpocasSelect } from '@/pages/base/epocas/queries/epocas-queries'
import { useUpdateRubrica } from '@/pages/base/rubricas/queries/rubricas-mutations'
import { useGetRubrica } from '@/pages/base/rubricas/queries/rubricas-queries'
import {
  RubricaClassificacao,
  RubricaClassificacaoLabel,
} from '@/types/enums/rubrica-classificacao.enum'
import { RubricaTipoLabel } from '@/types/enums/rubrica-tipo.enum'
import { Hash, Tag, Settings, FileText } from 'lucide-react'
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

const rubricaFormSchema = z.object({
  codigo: z
    .string({ message: 'O Código é obrigatório' })
    .min(1, { message: 'O Código deve ter pelo menos 1 caráter' }),
  epocaId: z.string({ message: 'A Época é obrigatória' }),
  descricao: z
    .string({ message: 'A Descrição é obrigatória' })
    .min(1, { message: 'A Descrição deve ter pelo menos 1 caráter' }),
  classificacaoTipo: z.string({
    message: 'O Tipo de Classificação é obrigatório',
  }),
  rubricaTipo: z.number({ message: 'O Tipo de Rubrica é obrigatório' }),
})

type RubricaFormSchemaType = z.infer<typeof rubricaFormSchema>

interface RubricaUpdateFormProps {
  modalClose: () => void
  rubricaId: string
  initialData: {
    codigo: string
    epocaId: string
    descricao: string
    classificacaoTipo: string
    rubricaTipo: number
  }
}

const RubricaUpdateForm = ({
  modalClose,
  rubricaId,
  initialData,
}: RubricaUpdateFormProps) => {
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

  const updateRubricaMutation = useUpdateRubrica()
  const { data: rubricaData } = useGetRubrica(rubricaId)
  const { data: epocasData, refetch: refetchEpocas } = useGetEpocasSelect()

  const rubricaResolver: Resolver<RubricaFormSchemaType> = async (values) => {
    const result = rubricaFormSchema.safeParse(values)
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

  const form = useForm<RubricaFormSchemaType>({
    resolver: rubricaResolver,
    defaultValues: initialData,
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
    criteriaMode: 'all',
  })

  const { setActiveTab } = useTabManager({
    defaultTab: 'dados',
    tabKey: `rubrica-${instanceId}`,
  })
  const { handleError } = useSubmitErrorTab<RubricaFormSchemaType>({
    setActiveTab,
    fieldToTabMap: {
      default: 'dados',
      codigo: 'dados',
      epocaId: 'dados',
      descricao: 'dados',
      classificacaoTipo: 'classificacao',
      rubricaTipo: 'classificacao',
    },
  })

  // Use the combined auto-selection and return data hook for epocas
  useAutoSelectionWithReturnData({
    windowId,
    instanceId,
    data: epocasData || [],
    setValue: (value: string) => form.setValue('epocaId', value),
    refetch: refetchEpocas,
    itemName: 'Época',
    successMessage: 'Época selecionada automaticamente',
    manualSelectionMessage:
      'Época criada com sucesso. Por favor, selecione-a manualmente.',
    queryKey: ['epocas-select'],
    returnDataKey: `return-data-${windowId}-epoca`,
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
      form.reset(formData as RubricaFormSchemaType)
    } else if (rubricaData) {
      // If no saved data, use the data from the API
      form.reset({
        codigo: rubricaData.info.data.codigo,
        epocaId: rubricaData.info.data.epocaId,
        descricao: rubricaData.info.data.descricao,
        classificacaoTipo: rubricaData.info.data.classificacaoTipo,
        rubricaTipo: rubricaData.info.data.rubricaTipo,
      })
    }
  }, [formData, isInitialized, formId, hasFormData, rubricaData])

  // Save form data when it changes
  useEffect(() => {
    const subscription = form.watch((value) => {
      if (
        value.codigo ||
        value.epocaId ||
        value.descricao ||
        value.classificacaoTipo ||
        value.rubricaTipo
      ) {
        // Use proper change detection by comparing with original values
        const hasChanges = detectUpdateFormChanges(
          value,
          rubricaData?.info?.data || {}
        )

        setFormState(formId, {
          formData: value as RubricaFormSchemaType,
          isDirty: hasChanges,
          isValid: form.formState.isValid,
          isSubmitting: form.formState.isSubmitting,
          hasBeenModified: hasChanges,
        })

        // Update window hasFormData flag
        updateWindowFormData(windowId, hasChanges, setWindowHasFormData)
        // Update window title based on codigo field
        const newTitle = value.codigo || 'Rubrica'
        updateUpdateWindowTitle(windowId, newTitle, updateWindowState)
      }
    })
    return () => subscription.unsubscribe()
  }, [form, windowId, rubricaData, formId])

  const handleClose = () => {
    // Clean up all form instances for the current window
    cleanupWindowForms(windowId)

    handleWindowClose(windowId, navigate, removeWindow)
  }

  const onSubmit = async (values: RubricaFormSchemaType) => {
    try {
      updateFormState(formId, (state) => ({
        ...state,
        isSubmitting: true,
      }))

      const response = await updateRubricaMutation.mutateAsync({
        id: rubricaId,
        data: {
          codigo: values.codigo,
          epocaId: values.epocaId,
          descricao: values.descricao,
          classificacaoTipo: values.classificacaoTipo,
          rubricaTipo: values.rubricaTipo,
        },
      })

      const result = handleApiResponse(
        response,
        'Rubrica atualizada com sucesso',
        'Erro ao atualizar rubrica',
        'Rubrica atualizada com avisos'
      )

      if (result.success) {
        // Close the window
        if (windowId) {
          removeWindow(windowId)
        }
        modalClose()
      }
    } catch (error) {
      toast.error(handleApiError(error, 'Erro ao atualizar rubrica'))
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
          onSubmit={form.handleSubmit(onSubmit, handleError)}
          className='space-y-4'
          autoComplete='off'
        >
          <PersistentTabs
            defaultValue='dados'
            className='w-full'
            tabKey={`rubrica-${instanceId}`}
          >
            <TabsList>
              <TabsTrigger value='dados'>Dados da Rubrica</TabsTrigger>
              <TabsTrigger value='classificacao'>Classificação</TabsTrigger>
            </TabsList>
            <TabsContent value='dados'>
              <Card className='overflow-hidden border-l-4 border-l-primary/20 hover:border-l-primary/40 transition-all duration-200 hover:shadow-md'>
                <CardHeader className='pb-4'>
                  <div className='flex items-center gap-3'>
                    <div className='flex items-center justify-center w-8 h-8 rounded-md bg-primary/10 text-primary'>
                      <FileText className='h-4 w-4' />
                    </div>
                    <div>
                      <CardTitle className='text-base flex items-center gap-2'>
                        Informações da Rubrica
                        <Badge variant='secondary' className='text-xs'>
                          Obrigatório
                        </Badge>
                      </CardTitle>
                      <p className='text-sm text-muted-foreground mt-1'>
                        Configure os dados básicos da rubrica
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className='space-y-6'>
                  <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
                    <FormField
                      control={form.control}
                      name='codigo'
                      render={({ field }) => (
                        <FormItem className='md:col-span-1'>
                          <FormLabel className='flex items-center gap-2'>
                            <Hash className='h-4 w-4' />
                            Código
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder='Introduza o código'
                              {...field}
                              onChange={(e) => {
                                const value = e.target.value.replace(/\./g, '') // Remove all dots first
                                let formattedValue = ''

                                // Add dots after every 2 characters
                                for (let i = 0; i < value.length; i++) {
                                  if (
                                    i > 0 &&
                                    i % 2 === 0 &&
                                    i !== value.length - 1
                                  ) {
                                    formattedValue += '.'
                                  }
                                  formattedValue += value[i]
                                }

                                field.onChange(formattedValue)
                              }}
                              className='px-4 py-6 shadow-inner drop-shadow-xl'
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name='descricao'
                      render={({ field }) => (
                        <FormItem className='md:col-span-3'>
                          <FormLabel className='flex items-center gap-2'>
                            <Tag className='h-4 w-4' />
                            Descrição
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder='Introduza a descrição'
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
            </TabsContent>
            <TabsContent value='classificacao'>
              <Card className='overflow-hidden border-l-4 border-l-primary/20 hover:border-l-primary/40 transition-all duration-200 hover:shadow-md'>
                <CardHeader className='pb-4'>
                  <div className='flex items-center gap-3'>
                    <div className='flex items-center justify-center w-8 h-8 rounded-md bg-primary/10 text-primary'>
                      <Settings className='h-4 w-4' />
                    </div>
                    <div>
                      <CardTitle className='text-base flex items-center gap-2'>
                        Configurações da Rubrica
                        <Badge variant='secondary' className='text-xs'>
                          Obrigatório
                        </Badge>
                      </CardTitle>
                      <p className='text-sm text-muted-foreground mt-1'>
                        Configure os tipos e classificações da rubrica
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className='space-y-6'>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <FormField
                      control={form.control}
                      name='classificacaoTipo'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className='flex items-center gap-2'>
                            <Settings className='h-4 w-4' />
                            Tipo de Classificação
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className='px-4 py-6 shadow-inner drop-shadow-xl'>
                                <SelectValue placeholder='Selecione o tipo de classificação' />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {Object.entries(RubricaClassificacaoLabel).map(
                                ([value, label]) => (
                                  <SelectItem
                                    key={value}
                                    value={value as RubricaClassificacao}
                                  >
                                    {label}
                                  </SelectItem>
                                )
                              )}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name='rubricaTipo'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className='flex items-center gap-2'>
                            <FileText className='h-4 w-4' />
                            Tipo de Rubrica
                          </FormLabel>
                          <Select
                            onValueChange={(value) =>
                              field.onChange(Number(value))
                            }
                            defaultValue={field.value?.toString()}
                          >
                            <FormControl>
                              <SelectTrigger className='px-4 py-6 shadow-inner drop-shadow-xl'>
                                <SelectValue placeholder='Selecione o tipo de rubrica' />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {Object.entries(RubricaTipoLabel).map(
                                ([value, label]) => (
                                  <SelectItem key={value} value={value}>
                                    {label}
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
              disabled={updateRubricaMutation.isPending}
              className='w-full md:w-auto'
            >
              {updateRubricaMutation.isPending ? 'A atualizar...' : 'Atualizar'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

export { RubricaUpdateForm }
