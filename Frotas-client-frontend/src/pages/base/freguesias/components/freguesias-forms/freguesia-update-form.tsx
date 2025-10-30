import { useEffect, useRef } from 'react'
import { z } from 'zod'
import { useForm, type Resolver } from 'react-hook-form'
import { useGetConcelhosSelect } from '@/pages/base/concelhos/queries/concelhos-queries'
import { useUpdateFreguesia } from '@/pages/base/freguesias/queries/freguesias-mutations'
import { useGetFreguesia } from '@/pages/base/freguesias/queries/freguesias-queries'
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
  openConcelhoCreationWindow,
  openConcelhoViewWindow,
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

interface FreguesiaUpdateFormProps {
  modalClose: () => void
  freguesiaId: string
  initialData: {
    nome: string
    concelhoId: string
  }
}

const FreguesiaUpdateForm = ({
  modalClose,
  freguesiaId,
  initialData,
}: FreguesiaUpdateFormProps) => {
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
  const removeWindow = useWindowsStore((state) => state.removeWindow)
  const setWindowHasFormData = useWindowsStore(
    (state) => state.setWindowHasFormData
  )
  const updateWindowState = useWindowsStore((state) => state.updateWindowState)
  const findWindowByPathAndInstanceId = useWindowsStore(
    (state) => state.findWindowByPathAndInstanceId
  )

  const updateFreguesiaMutation = useUpdateFreguesia()
  const { data: freguesiaData } = useGetFreguesia(freguesiaId)
  const { data: concelhosData, refetch } = useGetConcelhosSelect()

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
    defaultValues: initialData,
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
    criteriaMode: 'all',
  })

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
        // Set initial form data
        setFormState(formId, {
          formData: initialData,
          isDirty: false,
          isValid: true,
          isSubmitting: false,
          hasBeenModified: false,
          windowId: windowId,
        })

        // Set initial window title
        const initialTitle = initialData.nome || 'Freguesia'
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
      form.reset(formData as FreguesiaFormValues)
      // Update window title with saved form data
      if (formData?.nome && windowId) {
        updateUpdateWindowTitle(windowId, formData.nome, updateWindowState)
      }
    } else if (freguesiaData) {
      // If no saved data, use the data from the API
      form.reset({
        nome: freguesiaData.nome,
        concelhoId: freguesiaData.concelhoId,
      })
      // Update window title with API data
      if (freguesiaData.nome && windowId) {
        updateUpdateWindowTitle(windowId, freguesiaData.nome, updateWindowState)
      }
    }
  }, [
    formData,
    isInitialized,
    formId,
    hasFormData,
    freguesiaData,
    windowId,
    updateWindowState,
  ])

  // Save form data when it changes
  useEffect(() => {
    const subscription = form.watch((value) => {
      if (value.nome || value.concelhoId) {
        // Use proper change detection by comparing with original values
        const hasChanges = detectUpdateFormChanges(value, initialData)

        setFormState(formId, {
          formData: value as FreguesiaFormValues,
          isDirty: hasChanges,
          isValid: form.formState.isValid,
          isSubmitting: form.formState.isSubmitting,
          hasBeenModified: hasChanges,
        })

        // Update window hasFormData flag
        updateWindowFormData(windowId, hasChanges, setWindowHasFormData)
        // Update window title based on nome field
        const newTitle = value.nome || 'Freguesia'
        updateUpdateWindowTitle(windowId, newTitle, updateWindowState)
      }
    })
    return () => subscription.unsubscribe()
  }, [form, windowId, initialData, formId])

  // Use the combined auto-selection and return data hook for concelhos
  useAutoSelectionWithReturnData({
    windowId,
    instanceId,
    data: concelhosData || [],
    setValue: (value: string) => {
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
    returnDataKey: `return-data-${windowId}-concelho`,
  })

  const handleClose = () => {
    // Clean up all form instances for the current window
    cleanupWindowForms(windowId)

    handleWindowClose(windowId, navigate, removeWindow)
  }

  const handleCreateConcelho = () => {
    // Store parent window ID in sessionStorage for return data handling
    sessionStorage.setItem(`parent-window-${instanceId}`, windowId)

    // Open concelho creation in a new window with parent reference
    openConcelhoCreationWindow(
      navigate,
      windowId,
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
      windowId,
      concelhoId,
      updateWindowState,
      findWindowByPathAndInstanceId
    )
  }

  const onSubmit = async (values: FreguesiaFormValues) => {
    try {
      updateFormState(formId, (state) => ({
        ...state,
        isSubmitting: true,
      }))

      const response = await updateFreguesiaMutation.mutateAsync({
        id: freguesiaId,
        data: {
          nome: values.nome,
          concelhoId: values.concelhoId,
        },
      })

      const result = handleApiResponse(
        response,
        'Freguesia atualizada com sucesso',
        'Erro ao atualizar freguesia',
        'Freguesia atualizada com avisos'
      )

      if (result.success) {
        // Close the window
        if (windowId) {
          removeWindow(windowId)
        }
        modalClose()
      }
    } catch (error) {
      toast.error(handleApiError(error, 'Erro ao atualizar freguesia'))
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
                        Atualize as informações básicas da freguesia
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
                                options={
                                  concelhosData?.map((concelho) => ({
                                    value: concelho.id,
                                    label: concelho.nome,
                                  })) || []
                                }
                                value={field.value}
                                onValueChange={field.onChange}
                                placeholder='Selecione um concelho'
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
              disabled={updateFreguesiaMutation.isPending}
              className='w-full md:w-auto'
            >
              {updateFreguesiaMutation.isPending
                ? 'A atualizar...'
                : 'Atualizar'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

export { FreguesiaUpdateForm }
