import { useEffect, useRef } from 'react'
import { z } from 'zod'
import { useForm, type Resolver } from 'react-hook-form'
import { useUpdateConcelho } from '@/pages/base/concelhos/queries/concelhos-mutations'
import { useGetConcelho } from '@/pages/base/concelhos/queries/concelhos-queries'
import { useGetDistritosSelect } from '@/pages/base/distritos/queries/distritos-queries'
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
  updateWindowFormData,
  cleanupWindowForms,
  updateUpdateWindowTitle,
  detectUpdateFormChanges,
  openDistritoViewWindow,
  openDistritoCreationWindow,
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

const concelhoFormSchema = z.object({
  nome: z.string().min(1, { message: 'O nome é obrigatório' }),
  distritoId: z.string().min(1, { message: 'O distrito é obrigatório' }),
})

type ConcelhoFormValues = z.infer<typeof concelhoFormSchema>

interface ConcelhoUpdateFormProps {
  modalClose: () => void
  concelhoId: string
  initialData: {
    nome: string
    distritoId: string
  }
}

const ConcelhoUpdateForm = ({
  modalClose,
  concelhoId,
  initialData,
}: ConcelhoUpdateFormProps) => {
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
  const { removeWindow, updateWindowState, findWindowByPathAndInstanceId } =
    useWindowsStore()
  const setWindowHasFormData = useWindowsStore(
    (state) => state.setWindowHasFormData
  )

  const updateConcelhoMutation = useUpdateConcelho()
  const { data: concelhoData } = useGetConcelho(concelhoId)
  const { data: distritosData, refetch: refetchDistritos } =
    useGetDistritosSelect()

  const concelhoResolver: Resolver<ConcelhoFormValues> = async (values) => {
    const result = concelhoFormSchema.safeParse(values)
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

  const form = useForm<ConcelhoFormValues>({
    resolver: concelhoResolver,
    defaultValues: initialData,
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
    criteriaMode: 'all',
  })

  const { setActiveTab } = useTabManager({
    defaultTab: 'dados',
    tabKey: `concelho-${instanceId}`,
  })
  const { handleError } = useSubmitErrorTab<ConcelhoFormValues>({
    setActiveTab,
    fieldToTabMap: {
      default: 'dados',
      nome: 'dados',
      distritoId: 'dados',
    },
  })

  // Use the combined auto-selection and return data hook for distritos
  useAutoSelectionWithReturnData({
    windowId,
    instanceId,
    data: distritosData || [],
    setValue: (value: string) => form.setValue('distritoId', value),
    refetch: refetchDistritos,
    itemName: 'Distrito',
    successMessage: 'Distrito selecionado automaticamente',
    manualSelectionMessage:
      'Distrito criado com sucesso. Por favor, selecione-o manualmente.',
    queryKey: ['distritos-select'],
    returnDataKey: `return-data-${windowId}-distrito`,
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

        // Set initial window title
        const initialTitle = initialData.nome || 'Concelho'
        updateUpdateWindowTitle(windowId, initialTitle, updateWindowState)
      }
      isFirstRender.current = false
    }
  }, [
    formId,
    hasBeenVisited,
    resetFormState,
    hasFormData,
    initialData,
    windowId,
    updateWindowState,
  ])

  // Load saved form data if available and the form has been initialized
  useEffect(() => {
    if (isInitialized && hasFormData(formId)) {
      form.reset(formData as ConcelhoFormValues)
      // Update window title with saved form data
      if (formData?.nome && windowId) {
        updateUpdateWindowTitle(windowId, formData.nome, updateWindowState)
      }
    } else if (concelhoData) {
      // If no saved data, use the data from the API
      form.reset({
        nome: concelhoData.nome,
        distritoId: concelhoData.distritoId,
      })
      // Update window title with API data
      if (concelhoData.nome && windowId) {
        updateUpdateWindowTitle(windowId, concelhoData.nome, updateWindowState)
      }
    }
  }, [
    formData,
    isInitialized,
    formId,
    hasFormData,
    concelhoData,
    windowId,
    updateWindowState,
  ])

  // Save form data when it changes
  useEffect(() => {
    const subscription = form.watch((value) => {
      if (value.nome || value.distritoId) {
        // Use proper change detection by comparing with original values
        const hasChanges = detectUpdateFormChanges(value, initialData)

        setFormState(formId, {
          formData: value as ConcelhoFormValues,
          isDirty: hasChanges,
          isValid: form.formState.isValid,
          isSubmitting: form.formState.isSubmitting,
          hasBeenModified: hasChanges,
        })

        // Update window hasFormData flag
        updateWindowFormData(windowId, hasChanges, setWindowHasFormData)
        // Update window title based on nome field
        const newTitle = value.nome || 'Concelho'
        updateUpdateWindowTitle(windowId, newTitle, updateWindowState)
      }
    })
    return () => subscription.unsubscribe()
  }, [form, windowId, initialData, formId])

  const handleClose = () => {
    // Clean up all form instances for the current window
    cleanupWindowForms(windowId)

    handleWindowClose(windowId, navigate, removeWindow)
  }

  const handleCreateDistrito = () => {
    // Store parent window ID in sessionStorage for return data handling
    sessionStorage.setItem(`parent-window-${instanceId}`, windowId)

    // Open distrito creation in a new window with parent reference
    openDistritoCreationWindow(
      navigate,
      windowId,
      updateWindowState,
      findWindowByPathAndInstanceId
    )
  }

  const handleViewDistrito = () => {
    const distritoId = form.getValues('distritoId')
    if (!distritoId) {
      toast.error('Por favor, selecione um distrito primeiro')
      return
    }

    openDistritoViewWindow(
      navigate,
      windowId,
      distritoId,
      updateWindowState,
      findWindowByPathAndInstanceId
    )
  }

  const onSubmit = async (values: ConcelhoFormValues) => {
    try {
      updateFormState(formId, (state) => ({
        ...state,
        isSubmitting: true,
      }))

      const response = await updateConcelhoMutation.mutateAsync({
        id: concelhoId,
        data: {
          nome: values.nome,
          distritoId: values.distritoId,
        },
      })

      const result = handleApiResponse(
        response,
        'Concelho atualizado com sucesso',
        'Erro ao atualizar concelho',
        'Concelho atualizado com avisos'
      )

      if (result.success) {
        // Close the window
        if (windowId) {
          removeWindow(windowId)
        }
        modalClose()
      }
    } catch (error) {
      toast.error(handleApiError(error, 'Erro ao atualizar concelho'))
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
            tabKey={`concelho-${instanceId}`}
          >
            <TabsList>
              <TabsTrigger value='dados'>Dados do Concelho</TabsTrigger>
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
                        Informações do Concelho
                        <Badge variant='secondary' className='text-xs'>
                          Obrigatório
                        </Badge>
                      </CardTitle>
                      <p className='text-sm text-muted-foreground mt-1'>
                        Atualize as informações básicas do concelho
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
                      name='distritoId'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className='flex items-center gap-2'>
                            <Globe className='h-4 w-4' />
                            Distrito
                          </FormLabel>
                          <FormControl>
                            <div className='relative'>
                              <Autocomplete
                                options={
                                  distritosData?.map((distrito) => ({
                                    value: distrito.id,
                                    label: distrito.nome,
                                  })) || []
                                }
                                value={field.value}
                                onValueChange={field.onChange}
                                placeholder='Selecione o distrito'
                                emptyText='Nenhum distrito encontrado.'
                                className='px-4 py-6 pr-32 shadow-inner drop-shadow-xl'
                              />
                              <div className='absolute right-12 top-1/2 -translate-y-1/2 flex gap-1'>
                                <Button
                                  type='button'
                                  variant='outline'
                                  size='sm'
                                  onClick={handleViewDistrito}
                                  className='h-8 w-8 p-0'
                                  title='Ver Distrito'
                                  disabled={!field.value}
                                >
                                  <Eye className='h-4 w-4' />
                                </Button>
                                <Button
                                  type='button'
                                  variant='outline'
                                  size='sm'
                                  onClick={handleCreateDistrito}
                                  className='h-8 w-8 p-0'
                                  title='Criar Novo Distrito'
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
              disabled={updateConcelhoMutation.isPending}
              className='w-full md:w-auto'
            >
              {updateConcelhoMutation.isPending
                ? 'A atualizar...'
                : 'Atualizar'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

export { ConcelhoUpdateForm }
