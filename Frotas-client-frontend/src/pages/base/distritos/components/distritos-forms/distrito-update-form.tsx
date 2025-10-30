import { useEffect, useRef } from 'react'
import { z } from 'zod'
import { useForm, type Resolver } from 'react-hook-form'
import { useUpdateDistrito } from '@/pages/base/distritos/queries/distritos-mutations'
import { useGetDistrito } from '@/pages/base/distritos/queries/distritos-queries'
import { useGetPaisesSelect } from '@/pages/base/paises/queries/paises-queries'
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
  openPaisCreationWindow,
  openPaisViewWindow,
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

const distritoFormSchema = z.object({
  nome: z.string().min(1, { message: 'O nome é obrigatório' }),
  paisId: z.string().min(1, { message: 'O país é obrigatório' }),
})

type DistritoFormValues = z.infer<typeof distritoFormSchema>

interface DistritoUpdateFormProps {
  modalClose: () => void
  distritoId: string
  initialData: {
    nome: string
    paisId: string
  }
}

const DistritoUpdateForm = ({
  modalClose,
  distritoId,
  initialData,
}: DistritoUpdateFormProps) => {
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

  const updateDistritoMutation = useUpdateDistrito()
  const { data: distritoData } = useGetDistrito(distritoId)
  const { data: paisesData, refetch } = useGetPaisesSelect()

  const distritoResolver: Resolver<DistritoFormValues> = async (values) => {
    const result = distritoFormSchema.safeParse(values)
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

  const form = useForm<DistritoFormValues>({
    resolver: distritoResolver,
    defaultValues: initialData,
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
    criteriaMode: 'all',
  })

  const { setActiveTab } = useTabManager({
    defaultTab: 'dados',
    tabKey: `distrito-${instanceId}`,
  })
  const { handleError } = useSubmitErrorTab<DistritoFormValues>({
    setActiveTab,
    fieldToTabMap: {
      default: 'dados',
      nome: 'dados',
      paisId: 'dados',
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
        const initialTitle = initialData.nome || 'Distrito'
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
      form.reset(formData as DistritoFormValues)
      // Update window title with saved form data
      if (formData?.nome && windowId) {
        updateUpdateWindowTitle(windowId, formData.nome, updateWindowState)
      }
    } else if (distritoData) {
      // If no saved data, use the data from the API
      form.reset({
        nome: distritoData.nome,
        paisId: distritoData.paisId,
      })
      // Update window title with API data
      if (distritoData.nome && windowId) {
        updateUpdateWindowTitle(windowId, distritoData.nome, updateWindowState)
      }
    }
  }, [
    formData,
    isInitialized,
    formId,
    hasFormData,
    distritoData,
    windowId,
    updateWindowState,
  ])

  // Save form data when it changes
  useEffect(() => {
    const subscription = form.watch((value) => {
      if (value.nome || value.paisId) {
        // Use proper change detection by comparing with original values
        const hasChanges = detectUpdateFormChanges(value, initialData)

        setFormState(formId, {
          formData: value as DistritoFormValues,
          isDirty: hasChanges,
          isValid: form.formState.isValid,
          isSubmitting: form.formState.isSubmitting,
          hasBeenModified: hasChanges,
        })

        // Update window hasFormData flag
        updateWindowFormData(windowId, hasChanges, setWindowHasFormData)
        // Update window title based on nome field
        const newTitle = value.nome || 'Distrito'
        updateUpdateWindowTitle(windowId, newTitle, updateWindowState)
      }
    })
    return () => subscription.unsubscribe()
  }, [form, windowId, initialData, formId])

  // Use the combined auto-selection and return data hook for paises
  useAutoSelectionWithReturnData({
    windowId,
    instanceId,
    data: paisesData || [],
    setValue: (value: string) => {
      form.setValue('paisId', value, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      })
    },
    refetch,
    itemName: 'País',
    successMessage: 'País selecionado automaticamente',
    manualSelectionMessage:
      'País criado com sucesso. Por favor, selecione-o manualmente.',
    queryKey: ['paises-select'],
    returnDataKey: `return-data-${windowId}-pais`,
  })

  const handleClose = () => {
    // Clean up all form instances for the current window
    cleanupWindowForms(windowId)

    handleWindowClose(windowId, navigate, removeWindow)
  }

  const handleCreatePais = () => {
    // Store parent window ID in sessionStorage for return data handling
    sessionStorage.setItem(`parent-window-${instanceId}`, windowId)

    // Open pais creation in a new window with parent reference
    openPaisCreationWindow(
      navigate,
      windowId,
      updateWindowState,
      findWindowByPathAndInstanceId
    )
  }

  const handleViewPais = () => {
    const paisId = form.getValues('paisId')
    if (!paisId) {
      toast.error('Por favor, selecione um país primeiro')
      return
    }

    // Open pais view in a new window
    openPaisViewWindow(
      navigate,
      windowId,
      paisId,
      updateWindowState,
      findWindowByPathAndInstanceId
    )
  }

  const onSubmit = async (values: DistritoFormValues) => {
    try {
      updateFormState(formId, (state) => ({
        ...state,
        isSubmitting: true,
      }))

      const response = await updateDistritoMutation.mutateAsync({
        id: distritoId,
        data: {
          nome: values.nome,
          paisId: values.paisId,
        },
      })

      const result = handleApiResponse(
        response,
        'Distrito atualizado com sucesso',
        'Erro ao atualizar distrito',
        'Distrito atualizado com avisos'
      )

      if (result.success) {
        // Close the window
        if (windowId) {
          removeWindow(windowId)
        }
        modalClose()
      }
    } catch (error) {
      toast.error(handleApiError(error, 'Erro ao atualizar distrito'))
    } finally {
      updateFormState(formId, (state) => ({
        ...state,
        isSubmitting: false,
      }))
    }
  }

  const sortedPaises =
    paisesData?.slice().sort((a, b) => a.nome.localeCompare(b.nome)) || []

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
            tabKey={`distrito-${instanceId}`}
          >
            <TabsList>
              <TabsTrigger value='dados'>Dados do Distrito</TabsTrigger>
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
                        Informações do Distrito
                        <Badge variant='secondary' className='text-xs'>
                          Obrigatório
                        </Badge>
                      </CardTitle>
                      <p className='text-sm text-muted-foreground mt-1'>
                        Defina as informações básicas do distrito
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
                      name='paisId'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className='flex items-center gap-2'>
                            <Globe className='h-4 w-4' />
                            País
                          </FormLabel>
                          <FormControl>
                            <div className='relative'>
                              <Autocomplete
                                options={sortedPaises.map((pais) => ({
                                  value: pais.id || '',
                                  label: pais.nome,
                                }))}
                                value={field.value}
                                onValueChange={field.onChange}
                                placeholder='Selecione um país'
                                emptyText='Nenhum país encontrado.'
                                className='px-4 py-6 pr-32 shadow-inner drop-shadow-xl'
                              />
                              <div className='absolute right-12 top-1/2 -translate-y-1/2 flex gap-1'>
                                <Button
                                  type='button'
                                  variant='outline'
                                  size='sm'
                                  onClick={handleViewPais}
                                  className='h-8 w-8 p-0'
                                  title='Ver País'
                                  disabled={!field.value}
                                >
                                  <Eye className='h-4 w-4' />
                                </Button>
                                <Button
                                  type='button'
                                  variant='outline'
                                  size='sm'
                                  onClick={handleCreatePais}
                                  className='h-8 w-8 p-0'
                                  title='Criar Novo País'
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
              disabled={updateDistritoMutation.isPending}
              className='w-full md:w-auto'
            >
              {updateDistritoMutation.isPending
                ? 'A atualizar...'
                : 'Atualizar'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

export { DistritoUpdateForm }
