import { useEffect, useRef } from 'react'
import { z } from 'zod'
import { useForm, type Resolver } from 'react-hook-form'
import { useCreateRubrica } from '@/pages/base/rubricas/queries/rubricas-mutations'
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
  cleanupWindowForms,
  updateCreateWindowTitle,
  setEntityReturnDataWithToastSuppression,
} from '@/utils/window-utils'
import { useEpocaSelection } from '@/hooks/use-epoca-selection'
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

interface RubricaCreateFormProps {
  modalClose: () => void
  preSelectedEpocaId?: string
  initialCodigo?: string
  onSuccess?: (newRubrica: { id: string; codigo: string }) => void
  shouldCloseWindow?: boolean
}

const RubricaCreateForm = ({
  modalClose,
  preSelectedEpocaId,
  initialCodigo,
  onSuccess,
  shouldCloseWindow = true,
}: RubricaCreateFormProps) => {
  const location = useLocation()
  const navigate = useNavigate()
  const windowId = useCurrentWindowId()
  const searchParams = new URLSearchParams(location.search)
  const instanceId = searchParams.get('instanceId') || 'default'
  const formId = `rubrica-${instanceId}`
  const { selectedEpoca } = useEpocaSelection()

  // Use a ref to track if this is the first render
  const isFirstRender = useRef(true)

  const { formData, isInitialized, hasBeenVisited } = useFormState(formId)
  const { setFormState, updateFormState, resetFormState, hasFormData } =
    useFormsStore()
  const { removeWindow, setWindowReturnData } = useWindowsStore()
  const setWindowHasFormData = useWindowsStore(
    (state) => state.setWindowHasFormData
  )
  const updateWindowState = useWindowsStore((state) => state.updateWindowState)

  const createRubricaMutation = useCreateRubrica()

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
    defaultValues: {
      codigo: '',
      epocaId: preSelectedEpocaId || selectedEpoca?.id || '',
      descricao: '',
      classificacaoTipo: 'E',
      rubricaTipo: 1,
    },
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

  // Initialize form state on first render
  useEffect(() => {
    if (isFirstRender.current) {
      // If this form has never been visited before or doesn't have data, reset it
      if (!hasBeenVisited || !hasFormData(formId)) {
        resetFormState(formId)
        // Set initial form data with windowId
        setFormState(formId, {
          formData: {
            epocaId: preSelectedEpocaId || selectedEpoca?.id || '',
          },
          isDirty: false,
          isValid: false,
          isSubmitting: false,
          hasBeenModified: false,
          windowId: windowId,
        })
      }
      isFirstRender.current = false
    }
  }, [
    formId,
    hasBeenVisited,
    resetFormState,
    hasFormData,
    preSelectedEpocaId,
    selectedEpoca,
  ])

  // Load saved form data if available and the form has been initialized
  useEffect(() => {
    if (isInitialized && hasFormData(formId)) {
      form.reset(formData as RubricaFormSchemaType)
    } else if (preSelectedEpocaId || initialCodigo) {
      // If no saved data, use the pre-selected values
      form.reset({
        codigo: initialCodigo || '',
        epocaId: preSelectedEpocaId || '',
        descricao: '',
        classificacaoTipo: '',
        rubricaTipo: 0,
      })
    }
  }, [
    formData,
    isInitialized,
    formId,
    hasFormData,
    preSelectedEpocaId,
    initialCodigo,
  ])

  // Save form data when it changes
  useEffect(() => {
    const subscription = form.watch((value) => {
      // Get the default values
      const defaultValues = {
        codigo: '',
        epocaId: preSelectedEpocaId || selectedEpoca?.id || '',
        descricao: '',
        classificacaoTipo: 'E',
        rubricaTipo: 1,
      }

      // Check if any field has a value different from its default
      const hasModifiedValues = Object.entries(value).some(
        ([key, fieldValue]) => {
          const defaultValue = defaultValues[key as keyof typeof defaultValues]
          return fieldValue !== undefined && fieldValue !== defaultValue
        }
      )

      // Only update if values have actually changed
      const currentValues = formData || {}
      const valuesChanged =
        JSON.stringify(value) !== JSON.stringify(currentValues)

      if (valuesChanged) {
        setFormState(formId, {
          formData: value as RubricaFormSchemaType,
          isDirty: hasModifiedValues,
          isValid: form.formState.isValid,
          isSubmitting: form.formState.isSubmitting,
          hasBeenModified: hasModifiedValues,
          windowId: windowId,
        })

        // Update window state only if there are actual modifications
        if (windowId) {
          setWindowHasFormData(windowId, hasModifiedValues)
          if (value.codigo !== currentValues?.codigo) {
            updateCreateWindowTitle(windowId, value.codigo, updateWindowState)
          }
        }
      }
    })
    return () => subscription.unsubscribe()
  }, [
    form,
    windowId,
    formId,
    formData,
    setWindowHasFormData,
    updateWindowState,
  ])

  const handleClose = () => {
    // Clean up all form instances for the current window
    cleanupWindowForms(windowId)

    if (shouldCloseWindow) {
      handleWindowClose(windowId, navigate, removeWindow)
    } else {
      modalClose()
    }
  }

  const onSubmit = async (values: RubricaFormSchemaType) => {
    console.log('Rubrica Form Submit Values:', values)
    try {
      // Ensure we use the selected epoca from session if no preSelectedEpocaId is provided
      const finalValues = {
        ...values,
        epocaId: preSelectedEpocaId || selectedEpoca?.id || values.epocaId,
      }
      console.log('Final Submit Values:', finalValues)

      updateFormState(formId, (state) => ({
        ...state,
        isSubmitting: true,
      }))

      const response = await createRubricaMutation.mutateAsync(finalValues)
      console.log('Rubrica Create Response:', response)

      const result = handleApiResponse(
        response,
        'Rubrica criada com sucesso',
        'Erro ao criar rubrica',
        'Rubrica criada com avisos'
      )

      if (result.success) {
        // Set return data for parent window if this window was opened from another window
        if (windowId) {
          setEntityReturnDataWithToastSuppression(
            windowId,
            { id: response.info.data, nome: values.codigo },
            'rubrica',
            setWindowReturnData,
            undefined,
            instanceId
          )
        }

        if (onSuccess) {
          console.log('Calling onSuccess with:', {
            id: response.info.data,
            codigo: values.codigo,
          })
          onSuccess({
            id: response.info.data,
            codigo: values.codigo,
          })
        }
        // Only close the window if shouldCloseWindow is true
        if (windowId && shouldCloseWindow) {
          removeWindow(windowId)
        }
        // Always call modalClose to close the modal
        modalClose()
      }
    } catch (error) {
      toast.error(handleApiError(error, 'Erro ao criar rubrica'))
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
          id='rubricaCreateForm'
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
              disabled={createRubricaMutation.isPending}
              className='w-full md:w-auto'
            >
              {createRubricaMutation.isPending ? 'A criar...' : 'Criar'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

export { RubricaCreateForm }
