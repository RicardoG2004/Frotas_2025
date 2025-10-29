import { useEffect, useRef, useMemo, useState } from 'react'
import { z } from 'zod'
import { useForm, type Resolver } from 'react-hook-form'
import { useGetConcelhosSelect } from '@/pages/base/concelhos/queries/concelhos-queries'
import { useCreateFreguesia } from '@/pages/base/freguesias/queries/freguesias-mutations'
import { Tag, Globe, Plus, Eye } from 'lucide-react'
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
  openConcelhoCreationWindow,
  openConcelhoViewWindow,
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

const freguesiaFormSchema = z.object({
  nome: z.string().min(1, { message: 'O nome é obrigatório' }),
  concelhoId: z.string().min(1, { message: 'O concelho é obrigatório' }),
})

type FreguesiaFormValues = z.infer<typeof freguesiaFormSchema>

interface FreguesiaCreateFormProps {
  modalClose: () => void
  preSelectedConcelhoId?: string
  initialNome?: string
  onSuccess?: (newFreguesia: { id: string; nome: string }) => void
  shouldCloseWindow?: boolean
}

const FreguesiaCreateForm = ({
  modalClose,
  preSelectedConcelhoId,
  initialNome,
  onSuccess,
  shouldCloseWindow = true,
}: FreguesiaCreateFormProps) => {
  const location = useLocation()
  const navigate = useNavigate()
  const windowId = useCurrentWindowId()
  const searchParams = new URLSearchParams(location.search)
  const instanceId = searchParams.get('instanceId') || 'default'
  const formId = `freguesia-${instanceId}`

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

  const { data: concelhosData, isLoading, refetch } = useGetConcelhosSelect()
  const createFreguesiaMutation = useCreateFreguesia()

  // Define default values for proper change detection
  const defaultValues = useMemo(
    () => ({
      nome: '',
      concelhoId: '',
    }),
    []
  )

  const freguesiaResolver: Resolver<FreguesiaFormValues> = async (values) => {
    const result = freguesiaFormSchema.safeParse(values)
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

  const form = useForm<FreguesiaFormValues>({
    resolver: freguesiaResolver,
    defaultValues,
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
    criteriaMode: 'all',
  })

  const [selectedConcelhoId, setSelectedConcelhoId] = useState<string>('')

  const { setActiveTab } = useTabManager({
    defaultTab: 'dados',
    tabKey: `freguesia-${instanceId}`,
  })
  const { handleError } = useSubmitErrorTab<FreguesiaFormValues>({
    setActiveTab,
    fieldToTabMap: {
      default: 'dados',
      nome: 'dados',
      concelhoId: 'dados',
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
          windowId: effectiveWindowId,
        })
      }
      isFirstRender.current = false
    }
  }, [formId, hasBeenVisited, resetFormState, hasFormData])

  // Load saved form data if available and the form has been initialized
  useEffect(() => {
    if (isInitialized && hasFormData(formId)) {
      form.reset(formData as FreguesiaFormValues)
    } else if (preSelectedConcelhoId || initialNome) {
      // If no saved data, use the pre-selected values
      form.reset({
        nome: initialNome || '',
        concelhoId: preSelectedConcelhoId || '',
      })
    }
  }, [
    formData,
    isInitialized,
    formId,
    hasFormData,
    preSelectedConcelhoId,
    initialNome,
  ])

  // Save form data when it changes
  useEffect(() => {
    const subscription = form.watch((value) => {
      // Use proper change detection by comparing with default values
      const hasChanges = detectFormChanges(value, defaultValues)

      setFormState(formId, {
        formData: value as FreguesiaFormValues,
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

  // Use the combined auto-selection hook for concelhos (create form doesn't need return data)
  useAutoSelectionWithReturnData({
    windowId: effectiveWindowId,
    instanceId,
    data: concelhosData || [],
    setValue: (value: string) => {
      setSelectedConcelhoId(value)
      form.setValue('concelhoId', value, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      })
    },
    refetch,
    itemName: 'Concelho',
    successMessage: 'Concelho selecionado automaticamente',
    manualSelectionMessage:
      'Concelho criado com sucesso. Por favor, selecione-o manualmente.',
    queryKey: ['concelhos-select'],
    returnDataKey: `return-data-${effectiveWindowId}-concelho`, // Not used in create forms, but required by hook
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

  const handleCreateConcelho = () => {
    // Open concelho creation in a new window with parent reference
    openConcelhoCreationWindow(
      navigate,
      effectiveWindowId,
      updateWindowState,
      findWindowByPathAndInstanceId
    )
  }

  const handleViewConcelho = () => {
    const concelhoId = form.getValues('concelhoId')
    if (!concelhoId) {
      toast.error('Por favor, selecione um concelho primeiro')
      return
    }

    openConcelhoViewWindow(
      navigate,
      effectiveWindowId,
      concelhoId,
      updateWindowState,
      findWindowByPathAndInstanceId
    )
  }

  const onSubmit = async (values: FreguesiaFormValues) => {
    console.log('Freguesia Form Submit Values:', values)
    try {
      // Ensure we use the selectedConcelhoId if it's set
      const finalValues = {
        ...values,
        concelhoId: selectedConcelhoId || values.concelhoId,
      }
      console.log('Final Submit Values:', finalValues)

      updateFormState(formId, (state) => ({
        ...state,
        isSubmitting: true,
      }))

      const response = await createFreguesiaMutation.mutateAsync(finalValues)

      console.log('Freguesia Create Response:', response)

      const result = handleApiResponse(
        response,
        'Freguesia criada com sucesso',
        'Erro ao criar freguesia',
        'Freguesia criada com avisos'
      )

      if (result.success) {
        // Set return data for parent window if this window was opened from another window
        if (effectiveWindowId) {
          setEntityReturnDataWithToastSuppression(
            effectiveWindowId,
            { id: response.info.data, nome: values.nome },
            'freguesia',
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
      toast.error(handleApiError(error, 'Erro ao criar freguesia'))
    } finally {
      updateFormState(formId, (state) => ({
        ...state,
        isSubmitting: false,
      }))
    }
  }

  const sortedConcelhos =
    concelhosData?.slice().sort((a, b) => a.nome.localeCompare(b.nome)) || []

  return (
    <div className='space-y-4'>
      <Form {...form}>
        <form
          id='freguesiaCreateForm'
          onSubmit={form.handleSubmit(onSubmit, handleError)}
          className='space-y-4'
          autoComplete='off'
        >
          <PersistentTabs
            defaultValue='dados'
            className='w-full'
            tabKey={`freguesia-${instanceId}`}
          >
            <TabsList>
              <TabsTrigger value='dados'>Dados da Freguesia</TabsTrigger>
            </TabsList>
            <TabsContent value='dados'>
              <Card className='overflow-hidden border-l-4 border-l-primary/20 hover:border-l-primary/40 transition-all duration-200 hover:shadow-md'>
                <CardHeader className='pb-4'>
                  <div className='flex items-center gap-3'>
                    <div className='flex items-center justify-center w-8 h-8 rounded-md bg-primary/10 text-primary'>
                      <Globe className='h-4 w-4' />
                    </div>
                    <div>
                      <CardTitle className='text-base flex items-center gap-2'>
                        Informações da Freguesia
                        <Badge variant='secondary' className='text-xs'>
                          Obrigatório
                        </Badge>
                      </CardTitle>
                      <p className='text-sm text-muted-foreground mt-1'>
                        Defina as informações básicas da freguesia
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
                      name='concelhoId'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className='flex items-center gap-2'>
                            <Globe className='h-4 w-4' />
                            Concelho
                          </FormLabel>
                          <FormControl>
                            <div className='relative'>
                              <Autocomplete
                                options={sortedConcelhos.map((concelho) => ({
                                  value: concelho.id || '',
                                  label: concelho.nome,
                                }))}
                                value={selectedConcelhoId || field.value}
                                onValueChange={(value) => {
                                  setSelectedConcelhoId(value)
                                  field.onChange(value)
                                }}
                                placeholder={
                                  isLoading
                                    ? 'A carregar...'
                                    : 'Selecione um concelho'
                                }
                                emptyText='Nenhum concelho encontrado.'
                                className='px-4 py-6 pr-32 shadow-inner drop-shadow-xl'
                              />
                              <div className='absolute right-12 top-1/2 -translate-y-1/2 flex gap-1'>
                                <Button
                                  type='button'
                                  variant='outline'
                                  size='sm'
                                  onClick={handleViewConcelho}
                                  className='h-8 w-8 p-0'
                                  title='Ver Concelho'
                                  disabled={!field.value}
                                >
                                  <Eye className='h-4 w-4' />
                                </Button>
                                <Button
                                  type='button'
                                  variant='outline'
                                  size='sm'
                                  onClick={handleCreateConcelho}
                                  className='h-8 w-8 p-0'
                                  title='Criar Novo Concelho'
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
              disabled={createFreguesiaMutation.isPending}
              className='w-full md:w-auto'
            >
              {createFreguesiaMutation.isPending ? 'A criar...' : 'Criar'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

export { FreguesiaCreateForm }
