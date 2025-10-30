import { useEffect, useRef } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { type Resolver } from 'react-hook-form'
import { CreateModeloDTO } from '@/types/dtos/frotas/modelos.dtos'
import { Layers, Shield, Plus, Eye } from 'lucide-react'
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
  setEntityReturnDataWithToastSuppression,
  detectFormChanges,
  openMarcaCreationWindow,
  openMarcaViewWindow,
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
  TabsList as PersistentTabsList,
  TabsTrigger as PersistentTabsTrigger,
  TabsContent as PersistentTabsContent,
} from '@/components/ui/persistent-tabs'
import { useCreateModelo } from '@/pages/frotas/modelos/queries/modelos-mutations'
import { useGetMarcasSelect } from '@/pages/frotas/Marcas/queries/marcas-queries'

const modeloFormSchema = z.object({
  nome: z
    .string({ message: 'O Nome é obrigatório' })
    .min(1, { message: 'O Nome é obrigatório' }),
  marcaId: z
    .string({ message: 'A Marca é obrigatória' })
    .min(1, { message: 'A Marca é obrigatória' }),
})

type ModeloFormSchemaType = z.infer<typeof modeloFormSchema>

interface ModeloCreateFormProps {
  modalClose: () => void
  onSuccess?: (newModelo: { id: string; nome: string }) => void
  shouldCloseWindow?: boolean
}

export const ModeloCreateForm = ({
  modalClose,
  onSuccess,
  shouldCloseWindow = true,
}: ModeloCreateFormProps) => {
  const location = useLocation()
  const navigate = useNavigate()
  const windowId = useCurrentWindowId()
  const searchParams = new URLSearchParams(location.search)
  const instanceId = searchParams.get('instanceId') || 'default'
  const formId = `modelo-${instanceId}`

  const parentWindowIdFromStorage = sessionStorage.getItem(
    `parent-window-${instanceId}`
  )
  const effectiveWindowId = windowId || instanceId

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

  const { setActiveTab } = useTabManager({
    defaultTab: 'identificacao',
    tabKey: `modelo-${instanceId}`,
  })
  const { handleError } = useSubmitErrorTab<ModeloFormSchemaType>({
    setActiveTab,
    fieldToTabMap: {
      default: 'identificacao',
      nome: 'identificacao',
      marcaId: 'marca',
    },
  })

  // Define default values for proper change detection
  const defaultValues = {
    nome: '',
    marcaId: '',
  }

  const modeloResolver: Resolver<ModeloFormSchemaType> = async (values) => {
    const result = modeloFormSchema.safeParse(values)
    if (result.success) {
      return { values: result.data, errors: {} }
    }
    const fieldErrors: any = {}
    Object.entries(result.error.flatten().fieldErrors).forEach(
      ([key, value]) => {
        if (value && Array.isArray(value) && value.length > 0) {
          fieldErrors[key] = { type: 'validation', message: value[0] }
        }
      }
    )
    return {
      values: {},
      errors: fieldErrors,
    }
  }

  const form = useForm<ModeloFormSchemaType>({
    resolver: modeloResolver,
    defaultValues,
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
    criteriaMode: 'all',
  })

  const {
    data: marcasData = [],
    isLoading: isLoadingMarcas,
    refetch: refetchMarcas,
  } = useGetMarcasSelect()

  const createModeloMutation = useCreateModelo()

  // Auto-selection for Marca
  useAutoSelectionWithReturnData({
    windowId: effectiveWindowId,
    instanceId,
    data: marcasData,
    setValue: (value: string) => form.setValue('marcaId', value),
    refetch: refetchMarcas,
    itemName: 'Marca',
    successMessage: 'Marca selecionada automaticamente',
    manualSelectionMessage:
      'Marca criada com sucesso. Por favor, selecione-a manualmente.',
    queryKey: ['marcas-select'],
    returnDataKey: `return-data-${effectiveWindowId}-marca`,
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
      form.reset(formData as ModeloFormSchemaType)
    }
  }, [formData, isInitialized, formId, hasFormData])

  // Save form data when it changes
  useEffect(() => {
    const subscription = form.watch((value) => {
      // Use proper change detection by comparing with default values
      const hasChanges = detectFormChanges(value, defaultValues)

      const typedValue = value as Partial<ModeloFormSchemaType>
      // Only update the form state if the values are different from the current state
      if (JSON.stringify(typedValue) !== JSON.stringify(formData)) {
        setFormState(formId, {
          formData: typedValue as ModeloFormSchemaType,
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
            typedValue,
            setWindowHasFormData,
            defaultValues
          )
          // Update window title based on modelo name
          if (typedValue.nome && typedValue.nome !== formData?.nome) {
            updateCreateWindowTitle(
              effectiveWindowId,
              typedValue.nome || 'Novo Modelo',
              updateWindowState
            )
          }
        }
      }
    })
    return () => subscription.unsubscribe()
  }, [form, effectiveWindowId, formId, formData, defaultValues])

  const handleClose = () => {
    const currentWindow = findWindowByPathAndInstanceId(
      location.pathname,
      instanceId
    )
    if (currentWindow) {
      handleWindowClose(currentWindow.id, navigate, removeWindow)
    }
  }

  const handleCreateMarca = () => {
    // Open marca creation in a new window with parent reference
    openMarcaCreationWindow(
      navigate,
      effectiveWindowId,
      updateWindowState,
      findWindowByPathAndInstanceId
    )
  }

  const handleViewMarca = () => {
    const marcaId = form.getValues('marcaId')
    if (!marcaId) {
      toast.error('Por favor, selecione uma marca primeiro')
      return
    }

    openMarcaViewWindow(
      navigate,
      effectiveWindowId,
      marcaId,
      updateWindowState,
      findWindowByPathAndInstanceId
    )
  }

  const onSubmit = async (values: ModeloFormSchemaType) => {
    try {
      updateFormState(formId, (state) => ({
        ...state,
        isSubmitting: true,
      }))

      // Transform the form data to match the API structure
      const requestData: CreateModeloDTO = {
        nome: values.nome,
        marcaId: values.marcaId,
      }

      const response = await createModeloMutation.mutateAsync(requestData)
      const result = handleApiResponse(
        response,
        'Modelo criado com sucesso',
        'Erro ao criar modelo',
        'Modelo criado com avisos'
      )

      if (result.success) {
        console.log('Modelo created successfully:', result.data)

        // Set return data for parent window if this window was opened from another window
        if (effectiveWindowId) {
          setEntityReturnDataWithToastSuppression(
            effectiveWindowId,
            { id: result.data as string, nome: values.nome },
            'modelo',
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
          console.log('Calling onSuccess callback with:', {
            id: result.data as string,
            nome: values.nome,
          })
          onSuccess({
            id: result.data as string,
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
      toast.error(handleApiError(error, 'Erro ao criar modelo'))
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
          id='modeloCreateForm'
          onSubmit={form.handleSubmit(onSubmit, handleError)}
          className='space-y-4'
          autoComplete='off'
        >
        <PersistentTabs
          defaultValue='identificacao'
          className='w-full'
          contextKey={`modelo-${instanceId}`}
        >
          <PersistentTabsList className='grid w-full grid-cols-2'>
            <PersistentTabsTrigger value='identificacao'>
              <Layers className='mr-2 h-4 w-4' />
              Identificação
            </PersistentTabsTrigger>
            <PersistentTabsTrigger value='marca'>
              <Shield className='mr-2 h-4 w-4' />
              Marca
            </PersistentTabsTrigger>
          </PersistentTabsList>

          <PersistentTabsContent value='identificacao' className='space-y-4'>
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <Layers className='h-5 w-5' />
                  Informações do Modelo
                  <Badge variant='default' className='ml-auto'>
                    Obrigatório
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <FormField
                  control={form.control}
                  name='nome'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome</FormLabel>
                      <FormControl>
                        <Input placeholder='Nome do modelo' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </PersistentTabsContent>

          <PersistentTabsContent value='marca' className='space-y-4'>
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <Shield className='h-5 w-5' />
                  Marca
                  <Badge variant='default' className='ml-auto'>
                    Obrigatório
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <FormField
                  control={form.control}
                  name='marcaId'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='flex items-center gap-2'>
                        <Shield className='h-4 w-4' />
                        Marca
                        <Badge variant='secondary' className='text-xs'>
                          Obrigatório
                        </Badge>
                      </FormLabel>
                      <FormControl>
                        <div className='relative'>
                          <Autocomplete
                            options={marcasData.map((marca) => ({
                              value: marca.id || '',
                              label: marca.nome,
                            }))}
                            value={field.value}
                            onValueChange={field.onChange}
                            placeholder={
                              isLoadingMarcas
                                ? 'A carregar...'
                                : 'Selecione uma marca'
                            }
                            emptyText='Nenhuma marca encontrada.'
                            disabled={isLoadingMarcas}
                            className='px-4 py-6 pr-32 shadow-inner drop-shadow-xl'
                          />
                          <div className='absolute right-12 top-1/2 -translate-y-1/2 flex gap-1'>
                            <Button
                              type='button'
                              variant='outline'
                              size='sm'
                              onClick={handleViewMarca}
                              className='h-8 w-8 p-0'
                              title='Ver Marca'
                              disabled={!field.value}
                            >
                              <Eye className='h-4 w-4' />
                            </Button>
                            <Button
                              type='button'
                              variant='outline'
                              size='sm'
                              onClick={handleCreateMarca}
                              className='h-8 w-8 p-0'
                              title='Criar Nova Marca'
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
              </CardContent>
            </Card>
          </PersistentTabsContent>
        </PersistentTabs>

        <div className='flex justify-end gap-2'>
          <Button type='button' variant='outline' onClick={handleClose}>
            Cancelar
          </Button>
          <Button type='submit' disabled={createModeloMutation.isPending}>
            {createModeloMutation.isPending ? 'Criando...' : 'Criar Modelo'}
          </Button>
        </div>
        </form>
      </Form>
    </div>
  )
}

