import { useEffect, useRef, useMemo } from 'react'
import { z } from 'zod'
import { useForm, type Resolver } from 'react-hook-form'
import { useCreateEpoca } from '@/pages/base/epocas/queries/epocas-mutations'
import { useGetEpocasSelect } from '@/pages/base/epocas/queries/epocas-queries'
import { Calendar, Tag, Settings, Clock, Hash } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/auth-store'
import { useFormState, useFormsStore } from '@/stores/use-forms-store'
import { useWindowsStore } from '@/stores/use-windows-store'
import { handleApiError } from '@/utils/error-handlers'
import { handleApiResponse } from '@/utils/response-handlers'
import { toast } from '@/utils/toast-utils'
import {
  useCurrentWindowId,
  handleWindowClose,
  updateCreateFormData,
  cleanupWindowForms,
  updateCreateWindowTitle,
  detectFormChanges,
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
import { Switch } from '@/components/ui/switch'

const epocaFormSchema = z.object({
  ano: z
    .string({ message: 'O Ano é obrigatório' })
    .regex(/^\d{4}$/, { message: 'O Ano deve ter exatamente 4 dígitos' }),
  descricao: z
    .string({ message: 'A Descrição é obrigatória' })
    .min(1, { message: 'A Descrição deve ter pelo menos 1 caráter' }),
  predefinida: z.boolean().default(false),
  bloqueada: z.boolean().default(false),
  epocaAnteriorId: z.string().optional(),
})

type EpocaFormSchemaType = z.infer<typeof epocaFormSchema>

interface EpocaCreateFormProps {
  modalClose: () => void
  onSuccess?: (newEpoca: { id: string; descricao: string }) => void
  shouldCloseWindow?: boolean
}

const EpocaCreateForm = ({
  modalClose,
  onSuccess,
  shouldCloseWindow = true,
}: EpocaCreateFormProps) => {
  const location = useLocation()
  const navigate = useNavigate()
  const windowId = useCurrentWindowId()
  const searchParams = new URLSearchParams(location.search)
  const instanceId = searchParams.get('instanceId') || 'default'
  const formId = `epoca-${instanceId}`

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
  const selectedEpoca = useAuthStore((state) => state.selectedEpoca)
  const setSelectedEpocaStore = useAuthStore((state) => state.setSelectedEpoca)
  const { setSelectedEpoca } = useEpocaSelection()

  const { data: epocasSelectData, isLoading: isLoadingEpocas } =
    useGetEpocasSelect()
  const createEpocaMutation = useCreateEpoca()

  // Define default values for proper change detection
  const defaultValues = useMemo(
    () => ({
      ano: '',
      descricao: '',
      predefinida: false,
      bloqueada: false,
      epocaAnteriorId: '',
    }),
    []
  )

  const epocaResolver: Resolver<EpocaFormSchemaType> = async (values) => {
    const result = epocaFormSchema.safeParse(values)
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

  const form = useForm<EpocaFormSchemaType>({
    resolver: epocaResolver,
    defaultValues,
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
    criteriaMode: 'all',
  })

  const { setActiveTab } = useTabManager({
    defaultTab: 'dados',
    tabKey: `epoca-${instanceId}`,
  })
  const { handleError } = useSubmitErrorTab<EpocaFormSchemaType>({
    setActiveTab,
    fieldToTabMap: {
      default: 'dados',
      ano: 'dados',
      descricao: 'dados',
      epocaAnteriorId: 'dados',
      predefinida: 'configuracoes',
      bloqueada: 'configuracoes',
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
          formData: {},
          isDirty: false,
          isValid: false,
          isSubmitting: false,
          hasBeenModified: false,
          windowId: windowId,
        })
      }
      isFirstRender.current = false
    }
  }, [formId, hasBeenVisited, resetFormState, hasFormData])

  // Load saved form data if available and the form has been initialized
  useEffect(() => {
    if (isInitialized && hasFormData(formId)) {
      form.reset(formData as EpocaFormSchemaType)
    }
  }, [formData, isInitialized, formId, hasFormData])

  // Save form data when it changes
  useEffect(() => {
    const subscription = form.watch((value) => {
      // Use proper change detection by comparing with default values
      const hasChanges = detectFormChanges(value, defaultValues)

      setFormState(formId, {
        formData: value as EpocaFormSchemaType,
        isDirty: hasChanges,
        isValid: form.formState.isValid,
        isSubmitting: form.formState.isSubmitting,
        hasBeenModified: hasChanges,
      })

      // Update window hasFormData flag using the utility function
      if (windowId) {
        updateCreateFormData(
          windowId,
          value,
          setWindowHasFormData,
          defaultValues
        )
        // Update window title based on descricao field
        updateCreateWindowTitle(windowId, value.descricao, updateWindowState)
      }
    })
    return () => subscription.unsubscribe()
  }, [form, windowId, formId, defaultValues])

  const handleClose = () => {
    // Clean up all form instances for the current window
    cleanupWindowForms(windowId)

    if (shouldCloseWindow) {
      handleWindowClose(windowId, navigate, removeWindow)
    } else {
      modalClose()
    }
  }

  const onSubmit = async (values: EpocaFormSchemaType) => {
    try {
      updateFormState(formId, (state) => ({
        ...state,
        isSubmitting: true,
      }))

      const response = await createEpocaMutation.mutateAsync({
        ...values,
        epocaAnteriorId: values.epocaAnteriorId || '',
      })

      const result = handleApiResponse(
        response,
        'Época criada com sucesso',
        'Erro ao criar época',
        'Época criada com avisos'
      )

      if (result.success) {
        // If no epoca is currently selected, set the newly created epoca as selected
        if (!selectedEpoca) {
          const newEpocaData = {
            id: response.info.data,
            ano: values.ano,
            descricao: values.descricao,
          }
          setSelectedEpoca(newEpocaData)
          setSelectedEpocaStore(newEpocaData)
        }

        // Set return data for parent window if this window was opened from another window
        if (windowId) {
          setEntityReturnDataWithToastSuppression(
            windowId,
            { id: response.info.data, nome: values.descricao },
            'epoca',
            setWindowReturnData,
            undefined,
            instanceId
          )
        }

        if (onSuccess) {
          console.log('Calling onSuccess with:', {
            id: response.info.data,
            descricao: values.descricao,
          })
          onSuccess({
            id: response.info.data,
            descricao: values.descricao,
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
      toast.error(handleApiError(error, 'Erro ao criar época'))
    } finally {
      updateFormState(formId, (state) => ({
        ...state,
        isSubmitting: false,
      }))
    }
  }

  const sortedEpocas =
    epocasSelectData
      ?.slice()
      .sort((a, b) => a.descricao.localeCompare(b.descricao)) || []

  const isLoading = isLoadingEpocas || createEpocaMutation.isPending

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
            tabKey={`epoca-${instanceId}`}
          >
            <TabsList>
              <TabsTrigger value='dados'>Dados da Época</TabsTrigger>
              <TabsTrigger value='configuracoes'>Configurações</TabsTrigger>
            </TabsList>
            <TabsContent value='dados'>
              <Card className='overflow-hidden border-l-4 border-l-primary/20 hover:border-l-primary/40 transition-all duration-200 hover:shadow-md'>
                <CardHeader className='pb-4'>
                  <div className='flex items-center gap-3'>
                    <div className='flex items-center justify-center w-8 h-8 rounded-md bg-primary/10 text-primary'>
                      <Calendar className='h-4 w-4' />
                    </div>
                    <div>
                      <CardTitle className='text-base flex items-center gap-2'>
                        Informações da Época
                        <Badge variant='secondary' className='text-xs'>
                          Obrigatório
                        </Badge>
                      </CardTitle>
                      <p className='text-sm text-muted-foreground mt-1'>
                        Configure os dados básicos da época
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className='space-y-6'>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <FormField
                      control={form.control}
                      name='ano'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className='flex items-center gap-2'>
                            <Hash className='h-4 w-4' />
                            Ano
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder='Introduza o ano (ex: 2024)'
                              {...field}
                              maxLength={4}
                              pattern='\d{4}'
                              onKeyPress={(e) => {
                                const isNumber = /[0-9]/.test(e.key)
                                if (!isNumber) {
                                  e.preventDefault()
                                }
                              }}
                              className='px-4 py-6 shadow-inner drop-shadow-xl'
                              disabled={isLoading}
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
                        <FormItem>
                          <FormLabel className='flex items-center gap-2'>
                            <Tag className='h-4 w-4' />
                            Descrição
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder='Introduza a descrição'
                              {...field}
                              className='px-4 py-6 shadow-inner drop-shadow-xl'
                              disabled={isLoading}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name='epocaAnteriorId'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='flex items-center gap-2'>
                          <Clock className='h-4 w-4' />
                          Época Anterior
                        </FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                            disabled={isLoading}
                          >
                            <SelectTrigger className='px-4 py-6 shadow-inner drop-shadow-xl'>
                              <SelectValue
                                placeholder={
                                  isLoading
                                    ? 'A carregar...'
                                    : 'Selecione uma época anterior'
                                }
                              />
                            </SelectTrigger>
                            <SelectContent>
                              {sortedEpocas.map((epoca) => (
                                <SelectItem key={epoca.id} value={epoca.id}>
                                  {epoca.descricao}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value='configuracoes'>
              <Card className='overflow-hidden border-l-4 border-l-primary/20 hover:border-l-primary/40 transition-all duration-200 hover:shadow-md'>
                <CardHeader className='pb-4'>
                  <div className='flex items-center gap-3'>
                    <div className='flex items-center justify-center w-8 h-8 rounded-md bg-primary/10 text-primary'>
                      <Settings className='h-4 w-4' />
                    </div>
                    <div>
                      <CardTitle className='text-base flex items-center gap-2'>
                        Configurações da Época
                        <Badge variant='outline' className='text-xs'>
                          Opcional
                        </Badge>
                      </CardTitle>
                      <p className='text-sm text-muted-foreground mt-1'>
                        Configure as opções e status da época
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className='space-y-6'>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <FormField
                      control={form.control}
                      name='predefinida'
                      render={({ field }) => (
                        <FormItem className='flex flex-row items-center justify-between rounded-lg border p-3 bg-background'>
                          <FormLabel className='text-sm flex items-center gap-2'>
                            <div
                              className={`w-2 h-2 rounded-full ${field.value ? 'bg-green-500' : 'bg-gray-300'}`}
                            />
                            Predefinida
                          </FormLabel>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              disabled={isLoading}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name='bloqueada'
                      render={({ field }) => (
                        <FormItem className='flex flex-row items-center justify-between rounded-lg border p-3 bg-background'>
                          <FormLabel className='text-sm flex items-center gap-2'>
                            <div
                              className={`w-2 h-2 rounded-full ${field.value ? 'bg-red-500' : 'bg-gray-300'}`}
                            />
                            Bloqueada
                          </FormLabel>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              disabled={isLoading}
                            />
                          </FormControl>
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
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              type='submit'
              disabled={isLoading}
              className='w-full md:w-auto'
            >
              {isLoading ? 'A criar...' : 'Criar'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

export { EpocaCreateForm }
