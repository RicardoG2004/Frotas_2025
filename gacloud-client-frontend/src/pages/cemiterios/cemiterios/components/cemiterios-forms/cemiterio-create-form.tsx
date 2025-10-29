import { useEffect, useRef, useState } from 'react'
import { z } from 'zod'
import { useForm, type Resolver } from 'react-hook-form'
import { CodigoPostalCreateForm } from '@/pages/base/codigospostais/components/codigospostais-forms/codigopostal-create-form'
import { useGetCodigosPostaisSelect } from '@/pages/base/codigospostais/queries/codigospostais-queries'
import { useCreateCemiterio } from '@/pages/cemiterios/cemiterios/queries/cemiterios-mutations'
import { Building2, MapPin, Tag } from 'lucide-react'
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
import { useAutoSelectionWithReturnData } from '@/hooks/use-auto-selection-with-return-data'
import { useCemiterioSelection } from '@/hooks/use-cemiterio-selection'
import { useSubmitErrorTab } from '@/hooks/use-submit-error-tab'
import { useTabManager } from '@/hooks/use-tab-manager'
import { Autocomplete } from '@/components/ui/autocomplete'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { EnhancedModal } from '@/components/ui/enhanced-modal'
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
import { Switch } from '@/components/ui/switch'

const cemiterioFormSchema = z.object({
  nome: z
    .string({ message: 'O Nome é obrigatório' })
    .min(1, { message: 'O Nome deve ter pelo menos 1 caráter' }),
  morada: z
    .string({ message: 'A Morada é obrigatória' })
    .min(1, { message: 'A Morada deve ter pelo menos 1 caráter' }),
  codigoPostalId: z
    .string({ message: 'O Código Postal é obrigatório' })
    .min(1, { message: 'O Código Postal é obrigatório' }),
  predefinido: z.boolean().default(false),
})

type CemiterioFormSchemaType = z.infer<typeof cemiterioFormSchema>

interface CemiterioCreateFormProps {
  modalClose: () => void
  preSelectedCodigoPostalId?: string
  initialNome?: string
  onSuccess?: (newCemiterio: { id: string; nome: string }) => void
  shouldCloseWindow?: boolean
}

const CemiterioCreateForm = ({
  modalClose,
  preSelectedCodigoPostalId,
  initialNome,
  onSuccess,
  shouldCloseWindow = true,
}: CemiterioCreateFormProps) => {
  const location = useLocation()
  const navigate = useNavigate()
  const windowId = useCurrentWindowId()
  const searchParams = new URLSearchParams(location.search)
  const instanceId = searchParams.get('instanceId') || 'default'
  const formId = `cemiterio-${instanceId}`

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
  const selectedCemiterio = useAuthStore((state) => state.selectedCemiterio)
  const setSelectedCemiterioStore = useAuthStore(
    (state) => state.setSelectedCemiterio
  )
  const { setSelectedCemiterio } = useCemiterioSelection()

  const {
    data: codigosPostaisData,
    isLoading: isLoadingCodigosPostais,
    refetch: refetchCodigosPostais,
  } = useGetCodigosPostaisSelect()
  const createCemiterioMutation = useCreateCemiterio()

  // Define default values for proper change detection
  const defaultValues = {
    nome: '',
    morada: '',
    codigoPostalId: '',
    predefinido: false,
  }

  const cemiterioResolver: Resolver<CemiterioFormSchemaType> = async (
    values
  ) => {
    const result = cemiterioFormSchema.safeParse(values)
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

  const form = useForm<CemiterioFormSchemaType>({
    resolver: cemiterioResolver,
    defaultValues,
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
    criteriaMode: 'all',
  })

  const { setActiveTab } = useTabManager({
    defaultTab: 'dados',
    tabKey: `cemiterio-${instanceId}`,
  })
  const { handleError } = useSubmitErrorTab<CemiterioFormSchemaType>({
    setActiveTab,
    fieldToTabMap: {
      default: 'dados',
      nome: 'dados',
      morada: 'dados',
      codigoPostalId: 'dados',
      predefinido: 'configuracoes',
    },
  })

  // Use the combined auto-selection hook for codigos postais (create form doesn't need return data)
  useAutoSelectionWithReturnData({
    windowId,
    instanceId,
    data: codigosPostaisData || [],
    setValue: (value: string) => form.setValue('codigoPostalId', value),
    refetch: refetchCodigosPostais,
    itemName: 'Código Postal',
    successMessage: 'Código postal selecionado automaticamente',
    manualSelectionMessage:
      'Código postal criado com sucesso. Por favor, selecione-o manualmente.',
    queryKey: ['codigospostais-select'],
    returnDataKey: `return-data-${windowId}-codigopostal`, // Not used in create forms, but required by hook
  })

  const [createCodigoPostalData, setCreateCodigoPostalData] = useState<{
    codigo: string
    isOpen: boolean
  }>({
    codigo: '',
    isOpen: false,
  })

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
          windowId: windowId,
        })
      }
      isFirstRender.current = false
    }
  }, [formId, hasBeenVisited, resetFormState, hasFormData])

  // Load saved form data if available and the form has been initialized
  useEffect(() => {
    if (isInitialized && hasFormData(formId)) {
      form.reset(formData as CemiterioFormSchemaType)
    } else if (preSelectedCodigoPostalId || initialNome) {
      // If no saved data, use the pre-selected values
      form.reset({
        nome: initialNome || '',
        morada: '',
        codigoPostalId: preSelectedCodigoPostalId,
      })
    }
  }, [
    formData,
    isInitialized,
    formId,
    hasFormData,
    preSelectedCodigoPostalId,
    initialNome,
  ])

  // Save form data when it changes
  useEffect(() => {
    const subscription = form.watch((value) => {
      // Use proper change detection by comparing with default values
      const hasChanges = detectFormChanges(value, defaultValues)

      // Only update the form state if the values are different from the current state
      if (JSON.stringify(value) !== JSON.stringify(formData)) {
        setFormState(formId, {
          formData: value as CemiterioFormSchemaType,
          isDirty: hasChanges,
          isValid: form.formState.isValid,
          isSubmitting: form.formState.isSubmitting,
          hasBeenModified: hasChanges,
          windowId: windowId,
        })

        // Update window hasFormData flag using the utility function
        if (windowId) {
          updateCreateFormData(
            windowId,
            value,
            setWindowHasFormData,
            defaultValues
          )
          // Only update window title if the nome field has changed
          if (value.nome !== formData?.nome) {
            updateCreateWindowTitle(windowId, value.nome, updateWindowState)
          }
        }
      }
    })
    return () => subscription.unsubscribe()
  }, [form, windowId, formId, formData, defaultValues])

  const handleClose = () => {
    // Clean up all form instances for the current window
    cleanupWindowForms(windowId)

    if (shouldCloseWindow) {
      handleWindowClose(windowId, navigate, removeWindow)
    } else {
      modalClose()
    }
  }

  const onSubmit = async (values: CemiterioFormSchemaType) => {
    try {
      // Ensure we use the selectedConcelhoId if it's set
      const finalValues = {
        ...values,
        codigoPostalId: selectedCodigoPostalId || values.codigoPostalId,
      }

      updateFormState(formId, (state) => ({
        ...state,
        isSubmitting: true,
      }))

      const response = await createCemiterioMutation.mutateAsync(finalValues)

      const result = handleApiResponse(
        response,
        'Cemitério criado com sucesso',
        'Erro ao criar cemitério',
        'Cemitério criado com avisos'
      )

      if (result.success) {
        // If no cemiterio is currently selected, set the newly created cemiterio as selected
        if (!selectedCemiterio) {
          const newCemiterioData = {
            id: response.info.data,
            nome: values.nome,
          }
          setSelectedCemiterio(newCemiterioData)
          setSelectedCemiterioStore(newCemiterioData)
        }

        // Set return data for parent window if this window was opened from another window
        if (windowId) {
          setEntityReturnDataWithToastSuppression(
            windowId,
            { id: response.info.data, nome: values.nome },
            'cemiterio',
            setWindowReturnData,
            undefined,
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
        if (windowId && shouldCloseWindow) {
          removeWindow(windowId)
        }
        // Always call modalClose to close the modal
        modalClose()
      }
    } catch (error) {
      toast.error(handleApiError(error, 'Erro ao criar cemitério'))
    } finally {
      updateFormState(formId, (state) => ({
        ...state,
        isSubmitting: false,
      }))
    }
  }

  const sortedCodigosPostais =
    codigosPostaisData
      ?.slice()
      .sort((a, b) => a.codigo.localeCompare(b.codigo)) || []

  return (
    <div className='space-y-4'>
      <Form {...form}>
        <form
          id='cemiterioCreateForm'
          onSubmit={form.handleSubmit(onSubmit, handleError)}
          className='space-y-4'
          autoComplete='off'
        >
          <PersistentTabs
            defaultValue='dados'
            className='w-full'
            tabKey={`cemiterio-${instanceId}`}
          >
            <TabsList>
              <TabsTrigger value='dados'>Dados do Cemitério</TabsTrigger>
            </TabsList>
            <TabsContent value='dados'>
              <Card className='overflow-hidden border-l-4 border-l-primary/20 hover:border-l-primary/40 transition-all duration-200 hover:shadow-md'>
                <CardHeader className='pb-4'>
                  <div className='flex items-center gap-3'>
                    <div className='flex items-center justify-center w-8 h-8 rounded-md bg-primary/10 text-primary'>
                      <Building2 className='h-4 w-4' />
                    </div>
                    <div>
                      <CardTitle className='text-base flex items-center gap-2'>
                        Informações do Cemitério
                        <Badge variant='secondary' className='text-xs'>
                          Obrigatório
                        </Badge>
                      </CardTitle>
                      <p className='text-sm text-muted-foreground mt-1'>
                        Configure as informações básicas do cemitério
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className='space-y-6'>
                  <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
                    <FormField
                      control={form.control}
                      name='nome'
                      render={({ field }) => (
                        <FormItem className='md:col-span-3'>
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
                      name='predefinido'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className='flex items-center gap-2'>
                            <Building2 className='h-4 w-4' />
                            Predefinido
                          </FormLabel>
                          <FormControl>
                            <div className='flex h-[52px] items-center justify-end rounded-md border border-input bg-transparent px-4 shadow-inner'>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name='morada'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='flex items-center gap-2'>
                          <MapPin className='h-4 w-4' />
                          Morada
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder='Introduza a morada'
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
                    name='codigoPostalId'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='flex items-center gap-2'>
                          <MapPin className='h-4 w-4' />
                          Código Postal
                        </FormLabel>
                        <FormControl>
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
                            className='px-4 py-6 shadow-inner drop-shadow-xl'
                            createOption={(inputValue) => ({
                              value: 'new',
                              label: `Criar novo código postal: "${inputValue}"`,
                              inputValue,
                            })}
                            onCreateOption={(inputValue) => {
                              setCreateCodigoPostalData({
                                codigo: inputValue,
                                isOpen: true,
                              })
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
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
              disabled={createCemiterioMutation.isPending}
              className='w-full md:w-auto'
            >
              {createCemiterioMutation.isPending ? 'A criar...' : 'Criar'}
            </Button>
          </div>
        </form>
      </Form>

      <EnhancedModal
        title='Criar Novo Código Postal'
        description='Crie um novo código postal'
        isOpen={createCodigoPostalData.isOpen}
        onClose={() =>
          setCreateCodigoPostalData((prev) => ({ ...prev, isOpen: false }))
        }
        size='md'
      >
        <CodigoPostalCreateForm
          modalClose={() =>
            setCreateCodigoPostalData((prev) => ({ ...prev, isOpen: false }))
          }
          onSuccess={(newCodigoPostal) => {
            setSelectedCodigoPostalId(newCodigoPostal.id)
            form.setValue('codigoPostalId', newCodigoPostal.id, {
              shouldValidate: true,
              shouldDirty: true,
              shouldTouch: true,
            })
            setCreateCodigoPostalData((prev) => ({ ...prev, isOpen: false }))
          }}
          initialCodigo={createCodigoPostalData.codigo}
          shouldCloseWindow={false}
        />
      </EnhancedModal>
    </div>
  )
}

export { CemiterioCreateForm }
