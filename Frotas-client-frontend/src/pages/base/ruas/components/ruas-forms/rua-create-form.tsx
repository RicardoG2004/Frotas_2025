import { useEffect, useRef, useMemo, useState } from 'react'
import { z } from 'zod'
import { useForm, type Resolver } from 'react-hook-form'
import { useGetCodigosPostaisSelect } from '@/pages/base/codigospostais/queries/codigospostais-queries'
import { useGetFreguesiasSelect } from '@/pages/base/freguesias/queries/freguesias-queries'
import { useCreateRua } from '@/pages/base/ruas/queries/ruas-mutations'
import { MapPin, Building2, Mail, Plus, Eye } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
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
  openFreguesiaCreationWindow,
  openCodigoPostalCreationWindow,
  openFreguesiaViewWindow,
  openCodigoPostalViewWindow,
  setEntityReturnDataWithToastSuppression,
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

const ruaFormSchema = z.object({
  nome: z.string().min(1, { message: 'O nome é obrigatório' }),
  freguesiaId: z.string().min(1, { message: 'A freguesia é obrigatória' }),
  codigoPostalId: z
    .string()
    .min(1, { message: 'O código postal é obrigatório' }),
})

type RuaFormValues = z.infer<typeof ruaFormSchema>

interface RuaCreateFormProps {
  modalClose: () => void
  preSelectedFreguesiaId?: string
  preSelectedCodigoPostalId?: string
  initialNome?: string
  onSuccess?: (newRua: { id: string; nome: string }) => void
  shouldCloseWindow?: boolean
}

const RuaCreateForm = ({
  modalClose,
  preSelectedFreguesiaId,
  preSelectedCodigoPostalId,
  initialNome,
  onSuccess,
  shouldCloseWindow = true,
}: RuaCreateFormProps) => {
  const location = useLocation()
  const navigate = useNavigate()
  const windowId = useCurrentWindowId()
  const searchParams = new URLSearchParams(location.search)
  const instanceId = searchParams.get('instanceId') || 'default'
  const formId = `rua-${instanceId}`

  // Get parent window ID from sessionStorage as fallback
  const parentWindowIdFromStorage = sessionStorage.getItem(
    `parent-window-${instanceId}`
  )
  const effectiveWindowId = windowId || instanceId

  // Use a ref to track if this is the first render
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

  const {
    data: freguesiasData,
    isLoading: isLoadingFreguesias,
    refetch: refetchFreguesias,
  } = useGetFreguesiasSelect()
  const {
    data: codigosPostaisData,
    isLoading: isLoadingCodigosPostais,
    refetch: refetchCodigosPostais,
  } = useGetCodigosPostaisSelect()
  const createRuaMutation = useCreateRua()

  // Define default values for proper change detection
  const defaultValues = useMemo(
    () => ({
      nome: '',
      freguesiaId: '',
      codigoPostalId: '',
    }),
    []
  )

  const ruaResolver: Resolver<RuaFormValues> = async (values) => {
    const result = ruaFormSchema.safeParse(values)
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

  const form = useForm<RuaFormValues>({
    resolver: ruaResolver,
    defaultValues,
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
    criteriaMode: 'all',
  })

  const { setActiveTab } = useTabManager({
    defaultTab: 'dados',
    tabKey: `rua-${instanceId}`,
  })
  const { handleError } = useSubmitErrorTab<RuaFormValues>({
    setActiveTab,
    fieldToTabMap: {
      default: 'dados',
      nome: 'dados',
      freguesiaId: 'dados',
      codigoPostalId: 'dados',
    },
  })

  const [selectedFreguesiaId, setSelectedFreguesiaId] = useState<string>('')
  const [selectedCodigoPostalId, setSelectedCodigoPostalId] =
    useState<string>('')

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
          windowId: effectiveWindowId,
        })
      }
      isFirstRender.current = false
    }
  }, [formId, hasBeenVisited, resetFormState, hasFormData])

  // Load saved form data if available and the form has been initialized
  useEffect(() => {
    if (isInitialized && hasFormData(formId)) {
      form.reset(formData as RuaFormValues)
    } else if (
      preSelectedFreguesiaId ||
      preSelectedCodigoPostalId ||
      initialNome
    ) {
      // If no saved data, use the pre-selected values
      form.reset({
        nome: initialNome || '',
        freguesiaId: preSelectedFreguesiaId || '',
        codigoPostalId: preSelectedCodigoPostalId || '',
      })
    }
  }, [
    formData,
    isInitialized,
    formId,
    hasFormData,
    preSelectedFreguesiaId,
    preSelectedCodigoPostalId,
    initialNome,
  ])

  // Save form data when it changes
  useEffect(() => {
    const subscription = form.watch((value) => {
      // Use proper change detection by comparing with default values
      const hasChanges = detectFormChanges(value, defaultValues)

      setFormState(formId, {
        formData: value as RuaFormValues,
        isDirty: hasChanges,
        isValid: form.formState.isValid,
        isSubmitting: form.formState.isSubmitting,
        hasBeenModified: hasChanges,
      })

      // Update window hasFormData flag using the utility function
      if (effectiveWindowId) {
        updateCreateFormData(
          effectiveWindowId,
          value,
          setWindowHasFormData,
          defaultValues
        )
        // Update window title based on nome field
        updateCreateWindowTitle(
          effectiveWindowId,
          value.nome,
          updateWindowState
        )
      }
    })
    return () => subscription.unsubscribe()
  }, [form, effectiveWindowId, formId, defaultValues])

  // Use the combined auto-selection hook for freguesias (create form doesn't need return data)
  useAutoSelectionWithReturnData({
    windowId: effectiveWindowId,
    instanceId,
    data: freguesiasData || [],
    setValue: (value: string) => {
      setSelectedFreguesiaId(value)
      form.setValue('freguesiaId', value, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      })
    },
    refetch: refetchFreguesias,
    itemName: 'Freguesia',
    successMessage: 'Freguesia selecionada automaticamente',
    manualSelectionMessage:
      'Freguesia criada com sucesso. Por favor, selecione-a manualmente.',
    queryKey: ['freguesias-select'],
    returnDataKey: `return-data-${effectiveWindowId}-freguesia`, // Not used in create forms, but required by hook
  })

  // Use the combined auto-selection hook for codigos postais (create form doesn't need return data)
  useAutoSelectionWithReturnData({
    windowId: effectiveWindowId,
    instanceId,
    data: codigosPostaisData || [],
    setValue: (value: string) => {
      setSelectedCodigoPostalId(value)
      form.setValue('codigoPostalId', value, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      })
    },
    refetch: refetchCodigosPostais,
    itemName: 'Código Postal',
    successMessage: 'Código postal selecionado automaticamente',
    manualSelectionMessage:
      'Código postal criado com sucesso. Por favor, selecione-o manualmente.',
    queryKey: ['codigospostais-select'],
    returnDataKey: `return-data-${effectiveWindowId}-codigopostal`, // Not used in create forms, but required by hook
  })

  const handleClose = () => {
    // Clean up all form instances for the current window
    cleanupWindowForms(effectiveWindowId)

    if (shouldCloseWindow) {
      handleWindowClose(effectiveWindowId, navigate, removeWindow)
    } else {
      modalClose()
    }
  }

  const handleCreateFreguesia = () => {
    // Open freguesia creation in a new window with parent reference
    openFreguesiaCreationWindow(
      navigate,
      effectiveWindowId,
      updateWindowState,
      findWindowByPathAndInstanceId
    )
  }

  const handleViewFreguesia = () => {
    const freguesiaId = form.getValues('freguesiaId')
    if (!freguesiaId) {
      toast.error('Por favor, selecione uma freguesia primeiro')
      return
    }

    // Open freguesia view in a new window
    openFreguesiaViewWindow(
      navigate,
      effectiveWindowId,
      freguesiaId,
      updateWindowState,
      findWindowByPathAndInstanceId
    )
  }

  const handleCreateCodigoPostal = () => {
    // Open codigo postal creation in a new window with parent reference
    openCodigoPostalCreationWindow(
      navigate,
      effectiveWindowId,
      updateWindowState,
      findWindowByPathAndInstanceId
    )
  }

  const handleViewCodigoPostal = () => {
    const codigoPostalId = form.getValues('codigoPostalId')
    if (!codigoPostalId) {
      toast.error('Por favor, selecione um código postal primeiro')
      return
    }

    // Open codigo postal view in a new window
    openCodigoPostalViewWindow(
      navigate,
      effectiveWindowId,
      codigoPostalId,
      updateWindowState,
      findWindowByPathAndInstanceId
    )
  }

  const onSubmit = async (values: RuaFormValues) => {
    console.log('Rua Form Submit Values:', values)
    try {
      // Ensure we use the selected IDs if they're set
      const finalValues = {
        ...values,
        freguesiaId: selectedFreguesiaId || values.freguesiaId,
        codigoPostalId: selectedCodigoPostalId || values.codigoPostalId,
      }
      console.log('Final Submit Values:', finalValues)

      updateFormState(formId, (state) => ({
        ...state,
        isSubmitting: true,
      }))

      const response = await createRuaMutation.mutateAsync(finalValues)
      console.log('Rua Create Response:', response)

      const result = handleApiResponse(
        response,
        'Rua criada com sucesso',
        'Erro ao criar rua',
        'Rua criada com avisos'
      )

      if (result.success) {
        // Set return data for parent window if this window was opened from another window
        if (effectiveWindowId) {
          setEntityReturnDataWithToastSuppression(
            effectiveWindowId,
            { id: response.info.data, nome: values.nome },
            'rua',
            setWindowReturnData,
            parentWindowIdFromStorage || undefined,
            instanceId
          )
        }

        if (onSuccess) {
          console.log('Calling onSuccess with:', {
            id: response.info.data,
            nome: values.nome,
          })
          onSuccess({
            id: response.info.data,
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
      toast.error(handleApiError(error, 'Erro ao criar rua'))
    } finally {
      updateFormState(formId, (state) => ({
        ...state,
        isSubmitting: false,
      }))
    }
  }

  const sortedFreguesias =
    freguesiasData?.slice().sort((a, b) => a.nome.localeCompare(b.nome)) || []
  const sortedCodigosPostais =
    codigosPostaisData
      ?.slice()
      .sort((a, b) => a.codigo.localeCompare(b.codigo)) || []

  return (
    <div className='space-y-4'>
      <Form {...form}>
        <form
          id='ruaCreateForm'
          onSubmit={form.handleSubmit(onSubmit, handleError)}
          className='space-y-4'
          autoComplete='off'
        >
          <PersistentTabs
            defaultValue='dados'
            className='w-full'
            tabKey={`rua-${instanceId}`}
          >
            <TabsList>
              <TabsTrigger value='dados'>Dados da Rua</TabsTrigger>
            </TabsList>
            <TabsContent value='dados'>
              <Card className='overflow-hidden border-l-4 border-l-primary/20 hover:border-l-primary/40 transition-all duration-200 hover:shadow-md'>
                <CardHeader className='pb-4'>
                  <div className='flex items-center gap-3'>
                    <div className='flex items-center justify-center w-8 h-8 rounded-md bg-primary/10 text-primary'>
                      <MapPin className='h-4 w-4' />
                    </div>
                    <div>
                      <CardTitle className='text-base flex items-center gap-2'>
                        Informações da Rua
                        <Badge variant='secondary' className='text-xs'>
                          Obrigatório
                        </Badge>
                      </CardTitle>
                      <p className='text-sm text-muted-foreground mt-1'>
                        Defina os dados básicos da rua e sua localização
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
                            <MapPin className='h-4 w-4' />
                            Nome da Rua
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder='Introduza o nome da rua'
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
                      name='freguesiaId'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className='flex items-center gap-2'>
                            <Building2 className='h-4 w-4' />
                            Freguesia
                          </FormLabel>
                          <FormControl>
                            <div className='relative'>
                              <Autocomplete
                                options={sortedFreguesias.map((freguesia) => ({
                                  value: freguesia.id || '',
                                  label: freguesia.nome,
                                }))}
                                value={selectedFreguesiaId || field.value}
                                onValueChange={(value) => {
                                  setSelectedFreguesiaId(value)
                                  field.onChange(value)
                                }}
                                placeholder={
                                  isLoadingFreguesias
                                    ? 'A carregar...'
                                    : 'Selecione uma freguesia'
                                }
                                emptyText='Nenhuma freguesia encontrada.'
                                disabled={isLoadingFreguesias}
                                className='px-4 py-6 pr-32 shadow-inner drop-shadow-xl'
                              />
                              <div className='absolute right-12 top-1/2 -translate-y-1/2 flex gap-1'>
                                <Button
                                  type='button'
                                  variant='outline'
                                  size='sm'
                                  onClick={handleViewFreguesia}
                                  className='h-8 w-8 p-0'
                                  title='Ver Freguesia'
                                  disabled={!field.value}
                                >
                                  <Eye className='h-4 w-4' />
                                </Button>
                                <Button
                                  type='button'
                                  variant='outline'
                                  size='sm'
                                  onClick={handleCreateFreguesia}
                                  className='h-8 w-8 p-0'
                                  title='Criar Nova Freguesia'
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
                      name='codigoPostalId'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className='flex items-center gap-2'>
                            <Mail className='h-4 w-4' />
                            Código Postal
                          </FormLabel>
                          <FormControl>
                            <div className='relative'>
                              <Autocomplete
                                options={sortedCodigosPostais.map(
                                  (codigoPostal) => ({
                                    value: codigoPostal.id || '',
                                    label: codigoPostal.codigo,
                                  })
                                )}
                                value={selectedCodigoPostalId || field.value}
                                onValueChange={(value) => {
                                  setSelectedCodigoPostalId(value)
                                  field.onChange(value)
                                }}
                                placeholder={
                                  isLoadingCodigosPostais
                                    ? 'A carregar...'
                                    : 'Selecione um código postal'
                                }
                                emptyText='Nenhum código postal encontrado.'
                                disabled={isLoadingCodigosPostais}
                                className='px-4 py-6 pr-32 shadow-inner drop-shadow-xl'
                              />
                              <div className='absolute right-12 top-1/2 -translate-y-1/2 flex gap-1'>
                                <Button
                                  type='button'
                                  variant='outline'
                                  size='sm'
                                  onClick={handleViewCodigoPostal}
                                  className='h-8 w-8 p-0'
                                  title='Ver Código Postal'
                                  disabled={!field.value}
                                >
                                  <Eye className='h-4 w-4' />
                                </Button>
                                <Button
                                  type='button'
                                  variant='outline'
                                  size='sm'
                                  onClick={handleCreateCodigoPostal}
                                  className='h-8 w-8 p-0'
                                  title='Criar Novo Código Postal'
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
              disabled={createRuaMutation.isPending}
              className='w-full md:w-auto'
            >
              {createRuaMutation.isPending ? 'A criar...' : 'Criar'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

export { RuaCreateForm }
