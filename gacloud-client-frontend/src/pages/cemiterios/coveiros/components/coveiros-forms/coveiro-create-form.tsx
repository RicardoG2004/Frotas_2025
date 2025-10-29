import { useEffect, useRef } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { type Resolver } from 'react-hook-form'
import { useGetCodigosPostaisSelect } from '@/pages/base/codigospostais/queries/codigospostais-queries'
import { useGetRuasSelect } from '@/pages/base/ruas/queries/ruas-queries'
import { CreateCoveiroDTO } from '@/types/dtos/cemiterios/coveiros.dtos'
import { Plus, MapPin, User, AlertCircle, Settings, Eye } from 'lucide-react'
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
  openRuaCreationWindow,
  openCodigoPostalCreationWindow,
  openRuaViewWindow,
  openCodigoPostalViewWindow,
  detectFormChanges,
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
import { Switch } from '@/components/ui/switch'
import { useCreateCoveiro } from '../../queries/coveiros-mutations'

const coveiroFormSchema = z.object({
  nome: z
    .string({ message: 'O Nome é obrigatório' })
    .min(1, { message: 'O Nome é obrigatório' }),
  ruaId: z
    .string({ message: 'A Rua é obrigatória' })
    .min(1, { message: 'A Rua é obrigatória' }),
  codigoPostalId: z
    .string({ message: 'O Código Postal é obrigatório' })
    .min(1, { message: 'O Código Postal é obrigatório' }),
  historico: z.boolean().default(false),
})

type CoveiroFormSchemaType = z.infer<typeof coveiroFormSchema>

interface CoveiroCreateFormProps {
  modalClose: () => void
  preSelectedRuaId?: string
  preSelectedCodigoPostalId?: string
  onSuccess?: (newCoveiro: { id: string; nome: string }) => void
  shouldCloseWindow?: boolean
}

const CoveiroCreateForm = ({
  modalClose,
  preSelectedRuaId,
  preSelectedCodigoPostalId,
  onSuccess,
  shouldCloseWindow = true,
}: CoveiroCreateFormProps) => {
  const location = useLocation()
  const navigate = useNavigate()
  const windowId = useCurrentWindowId()
  const searchParams = new URLSearchParams(location.search)
  const instanceId = searchParams.get('instanceId') || 'default'
  const formId = `coveiro-${instanceId}`

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

  const { setActiveTab } = useTabManager({
    defaultTab: 'identificacao',
    tabKey: `coveiro-${instanceId}`,
  })
  const { handleError } = useSubmitErrorTab<CoveiroFormSchemaType>({
    setActiveTab,
    fieldToTabMap: {
      default: 'identificacao',
      nome: 'identificacao',
      ruaId: 'endereco',
      codigoPostalId: 'endereco',
      historico: 'opcoes',
    },
  })

  const createCoveiroMutation = useCreateCoveiro()

  const {
    data: ruasData = [],
    isLoading: isLoadingRuas,
    refetch: refetchRuas,
  } = useGetRuasSelect()

  const {
    data: codigosPostaisData = [],
    isLoading: isLoadingCodigosPostais,
    refetch: refetchCodigosPostais,
  } = useGetCodigosPostaisSelect()

  // Define default values for proper change detection
  const defaultValues = {
    nome: '',
    ruaId: '',
    codigoPostalId: '',
    historico: false,
  }

  const coveiroResolver: Resolver<CoveiroFormSchemaType> = async (values) => {
    const result = coveiroFormSchema.safeParse(values)
    if (result.success) {
      return { values: result.data, errors: {} }
    }
    const fieldErrors: any = {}
    Object.entries(result.error.flatten().fieldErrors).forEach(
      ([key, value]) => {
        if (value && value.length > 0) {
          fieldErrors[key] = { type: 'validation', message: value[0] }
        }
      }
    )
    return {
      values: {},
      errors: fieldErrors,
    }
  }

  const form = useForm<CoveiroFormSchemaType>({
    resolver: coveiroResolver,
    defaultValues,
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
    criteriaMode: 'all',
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
      form.reset(formData as CoveiroFormSchemaType)
    } else if (preSelectedRuaId || preSelectedCodigoPostalId) {
      // If no saved data, use the pre-selected values
      form.reset({
        nome: '',
        ruaId: preSelectedRuaId || '',
        codigoPostalId: preSelectedCodigoPostalId || '',
        historico: false,
      })
    }
  }, [
    formData,
    isInitialized,
    formId,
    hasFormData,
    preSelectedRuaId,
    preSelectedCodigoPostalId,
  ])

  // Save form data when it changes
  useEffect(() => {
    const subscription = form.watch((value) => {
      // Use proper change detection by comparing with default values
      const hasChanges = detectFormChanges(value, defaultValues)

      // Only update the form state if the values are different from the current state
      if (JSON.stringify(value) !== JSON.stringify(formData)) {
        setFormState(formId, {
          formData: value as CoveiroFormSchemaType,
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
            value,
            setWindowHasFormData,
            defaultValues
          )
          // Update window title based on coveiro name
          if (value.nome && value.nome !== formData?.nome) {
            updateCreateWindowTitle(
              effectiveWindowId,
              value.nome || 'Novo Coveiro',
              updateWindowState
            )
          }
        }
      }
    })
    return () => subscription.unsubscribe()
  }, [form, effectiveWindowId, formId, formData, defaultValues])

  // Use the combined auto-selection hook for ruas (create form doesn't need return data)
  useAutoSelectionWithReturnData({
    windowId: effectiveWindowId,
    instanceId,
    data: ruasData,
    setValue: (value: string) => form.setValue('ruaId', value),
    refetch: refetchRuas,
    itemName: 'Rua',
    successMessage: 'Rua selecionada automaticamente',
    manualSelectionMessage:
      'Rua criada com sucesso. Por favor, selecione-a manualmente.',
    queryKey: ['ruas-select'],
    returnDataKey: `return-data-${effectiveWindowId}-rua`, // Not used in create forms, but required by hook
  })

  // Use the combined auto-selection hook for codigos postais (create form doesn't need return data)
  useAutoSelectionWithReturnData({
    windowId: effectiveWindowId,
    instanceId,
    data: codigosPostaisData,
    setValue: (value: string) => form.setValue('codigoPostalId', value),
    refetch: refetchCodigosPostais,
    itemName: 'Código Postal',
    successMessage: 'Código Postal selecionado automaticamente',
    manualSelectionMessage:
      'Código Postal criado com sucesso. Por favor, selecione-o manualmente.',
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

  const handleCreateRua = () => {
    // Open rua creation in a new window with parent reference
    openRuaCreationWindow(
      navigate,
      effectiveWindowId,
      updateWindowState,
      findWindowByPathAndInstanceId
    )
  }

  const handleViewRua = () => {
    const ruaId = form.getValues('ruaId')
    if (!ruaId) {
      toast.error('Por favor, selecione uma rua primeiro')
      return
    }

    openRuaViewWindow(
      navigate,
      effectiveWindowId,
      ruaId,
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

    openCodigoPostalViewWindow(
      navigate,
      effectiveWindowId,
      codigoPostalId,
      updateWindowState,
      findWindowByPathAndInstanceId
    )
  }

  const onSubmit = async (values: CoveiroFormSchemaType) => {
    try {
      updateFormState(formId, (state) => ({
        ...state,
        isSubmitting: true,
      }))

      // Transform the form data to match the API structure
      const requestData: CreateCoveiroDTO = {
        nome: values.nome,
        ruaId: values.ruaId,
        codigoPostalId: values.codigoPostalId,
        historico: values.historico,
      }

      const response = await createCoveiroMutation.mutateAsync(requestData)
      const result = handleApiResponse(
        response,
        'Coveiro criado com sucesso',
        'Erro ao criar coveiro',
        'Coveiro criado com avisos'
      )

      if (result.success) {
        console.log('Coveiro created successfully:', result.data)

        // Set return data for parent window if this window was opened from another window
        if (effectiveWindowId) {
          setEntityReturnDataWithToastSuppression(
            effectiveWindowId,
            { id: result.data as string, nome: values.nome },
            'coveiro',
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
      toast.error(handleApiError(error, 'Erro ao criar coveiro'))
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
          id='coveiroCreateForm'
          onSubmit={form.handleSubmit(onSubmit, handleError)}
          className='space-y-4'
          autoComplete='off'
        >
          <PersistentTabs
            defaultValue='identificacao'
            className='w-full'
            tabKey={`coveiro-${instanceId}`}
          >
            <PersistentTabsList>
              <PersistentTabsTrigger value='identificacao'>
                Identificação
              </PersistentTabsTrigger>
              <PersistentTabsTrigger value='endereco'>
                Endereço
              </PersistentTabsTrigger>
              <PersistentTabsTrigger value='opcoes'>
                Opções
              </PersistentTabsTrigger>
            </PersistentTabsList>
            <PersistentTabsContent value='identificacao'>
              <div className='space-y-6'>
                <Card className='overflow-hidden border-l-4 border-l-primary/20 hover:border-l-primary/40 transition-all duration-200 hover:shadow-md'>
                  <CardHeader className='pb-4'>
                    <div className='flex items-center gap-3'>
                      <div className='flex items-center justify-center w-8 h-8 rounded-md bg-primary/10 text-primary'>
                        <User className='h-4 w-4' />
                      </div>
                      <div>
                        <CardTitle className='text-base flex items-center gap-2'>
                          Identificação do Coveiro
                          <Badge variant='secondary' className='text-xs'>
                            Obrigatório
                          </Badge>
                        </CardTitle>
                        <p className='text-sm text-muted-foreground mt-1'>
                          Informações básicas do coveiro
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className='space-y-6'>
                    <div className='grid grid-cols-1 gap-4'>
                      <FormField
                        control={form.control}
                        name='nome'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='flex items-center gap-2'>
                              <User className='h-4 w-4' />
                              Nome
                              <Badge variant='secondary' className='text-xs'>
                                Obrigatório
                              </Badge>
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder='Digite o nome do coveiro'
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
              </div>
            </PersistentTabsContent>
            <PersistentTabsContent value='endereco'>
              <div className='space-y-6'>
                <Card className='overflow-hidden border-l-4 border-l-primary/20 hover:border-l-primary/40 transition-all duration-200 hover:shadow-md'>
                  <CardHeader className='pb-4'>
                    <div className='flex items-center gap-3'>
                      <div className='flex items-center justify-center w-8 h-8 rounded-md bg-primary/10 text-primary'>
                        <MapPin className='h-4 w-4' />
                      </div>
                      <div>
                        <CardTitle className='text-base flex items-center gap-2'>
                          Endereço
                          <Badge variant='secondary' className='text-xs'>
                            Obrigatório
                          </Badge>
                        </CardTitle>
                        <p className='text-sm text-muted-foreground mt-1'>
                          Informações de endereço do coveiro
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className='space-y-6'>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                      <FormField
                        control={form.control}
                        name='ruaId'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='flex items-center gap-2'>
                              <MapPin className='h-4 w-4' />
                              Rua
                              <Badge variant='secondary' className='text-xs'>
                                Obrigatório
                              </Badge>
                            </FormLabel>
                            <FormControl>
                              <div className='relative'>
                                <Autocomplete
                                  options={ruasData.map((rua) => ({
                                    value: rua.id || '',
                                    label: rua.nome,
                                  }))}
                                  value={field.value}
                                  onValueChange={field.onChange}
                                  placeholder={
                                    isLoadingRuas
                                      ? 'A carregar...'
                                      : 'Selecione uma rua'
                                  }
                                  emptyText='Nenhuma rua encontrada.'
                                  disabled={isLoadingRuas}
                                  className='px-4 py-6 pr-32 shadow-inner drop-shadow-xl'
                                />
                                <div className='absolute right-12 top-1/2 -translate-y-1/2 flex gap-1'>
                                  <Button
                                    type='button'
                                    variant='outline'
                                    size='sm'
                                    onClick={handleViewRua}
                                    className='h-8 w-8 p-0'
                                    title='Ver Rua'
                                    disabled={!field.value}
                                  >
                                    <Eye className='h-4 w-4' />
                                  </Button>
                                  <Button
                                    type='button'
                                    variant='outline'
                                    size='sm'
                                    onClick={handleCreateRua}
                                    className='h-8 w-8 p-0'
                                    title='Criar Nova Rua'
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
                              <MapPin className='h-4 w-4' />
                              Código Postal
                              <Badge variant='secondary' className='text-xs'>
                                Obrigatório
                              </Badge>
                            </FormLabel>
                            <FormControl>
                              <div className='relative'>
                                <Autocomplete
                                  options={codigosPostaisData.map((codigo) => ({
                                    value: codigo.id || '',
                                    label: codigo.codigo,
                                  }))}
                                  value={field.value}
                                  onValueChange={field.onChange}
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
              </div>
            </PersistentTabsContent>
            <PersistentTabsContent value='opcoes'>
              <div className='space-y-6'>
                <Card className='overflow-hidden border-l-4 border-l-primary/20 hover:border-l-primary/40 transition-all duration-200 hover:shadow-md'>
                  <CardHeader className='pb-4'>
                    <div className='flex items-center gap-3'>
                      <div className='flex items-center justify-center w-8 h-8 rounded-md bg-primary/10 text-primary'>
                        <Settings className='h-4 w-4' />
                      </div>
                      <div>
                        <CardTitle className='text-base flex items-center gap-2'>
                          Configurações Adicionais
                          <Badge variant='outline' className='text-xs'>
                            Opcional
                          </Badge>
                        </CardTitle>
                        <p className='text-sm text-muted-foreground mt-1'>
                          Configurações e opções adicionais para o coveiro
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className='space-y-6'>
                    <FormField
                      control={form.control}
                      name='historico'
                      render={({ field }) => (
                        <FormItem className='flex flex-row items-center justify-between rounded-lg border p-3 bg-muted/20'>
                          <FormLabel className='text-sm flex items-center gap-2'>
                            <AlertCircle className='h-4 w-4' />
                            Histórico
                          </FormLabel>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </div>
            </PersistentTabsContent>
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
              disabled={createCoveiroMutation.isPending}
              className='w-full md:w-auto'
            >
              {createCoveiroMutation.isPending ? 'A criar...' : 'Criar'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

export { CoveiroCreateForm }
