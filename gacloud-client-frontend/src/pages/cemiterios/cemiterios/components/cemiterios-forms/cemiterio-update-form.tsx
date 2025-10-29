import { useEffect, useRef, useState } from 'react'
import { z } from 'zod'
import { useForm, type Resolver } from 'react-hook-form'
import { CodigoPostalCreateForm } from '@/pages/base/codigospostais/components/codigospostais-forms/codigopostal-create-form'
import { useGetCodigosPostaisSelect } from '@/pages/base/codigospostais/queries/codigospostais-queries'
import { useUpdateCemiterio } from '@/pages/cemiterios/cemiterios/queries/cemiterios-mutations'
import { useGetCemiterio } from '@/pages/cemiterios/cemiterios/queries/cemiterios-queries'
import { Building2, MapPin, Tag } from 'lucide-react'
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
} from '@/utils/window-utils'
import { useAutoSelectionWithReturnData } from '@/hooks/use-auto-selection-with-return-data'
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

interface CemiterioUpdateFormProps {
  modalClose: () => void
  cemiterioId: string
  initialData: {
    nome: string
    morada: string
    codigoPostalId: string
    predefinido: boolean
  }
}

const CemiterioUpdateForm = ({
  modalClose,
  cemiterioId,
  initialData,
}: CemiterioUpdateFormProps) => {
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
  const { removeWindow } = useWindowsStore()
  const setWindowHasFormData = useWindowsStore(
    (state) => state.setWindowHasFormData
  )
  const updateWindowState = useWindowsStore((state) => state.updateWindowState)

  const updateCemiterioMutation = useUpdateCemiterio()
  const { data: cemiterioData } = useGetCemiterio(cemiterioId)
  const {
    data: codigosPostaisData,
    isLoading: isLoadingCodigosPostais,
    refetch: refetchCodigosPostais,
  } = useGetCodigosPostaisSelect()

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
    defaultValues: initialData,
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

  // Use the combined auto-selection and return data hook for codigos postais
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
    returnDataKey: `return-data-${windowId}-codigopostal`,
  })

  const [createCodigoPostalData, setCreateCodigoPostalData] = useState<{
    codigo: string
    isOpen: boolean
  }>({
    codigo: '',
    isOpen: false,
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
  }, [formId, hasBeenVisited, resetFormState, hasFormData, initialData])

  // Load saved form data if available and the form has been initialized
  useEffect(() => {
    if (isInitialized && hasFormData(formId)) {
      form.reset(formData as CemiterioFormSchemaType)
    } else if (cemiterioData?.info?.data) {
      // If no saved data, use the data from the API
      form.reset({
        nome: cemiterioData.info.data.nome,
        morada: cemiterioData.info.data.morada,
        codigoPostalId: cemiterioData.info.data.codigoPostalId,
        predefinido: cemiterioData.info.data.predefinido,
      })
    }
  }, [formData, isInitialized, formId, hasFormData, cemiterioData])

  // Save form data when it changes
  useEffect(() => {
    const subscription = form.watch((value) => {
      if (value.nome || value.morada || value.codigoPostalId) {
        // Use proper change detection by comparing with original values
        const hasChanges = detectUpdateFormChanges(
          value,
          cemiterioData?.info?.data || {}
        )

        setFormState(formId, {
          formData: value as CemiterioFormSchemaType,
          isDirty: hasChanges,
          isValid: form.formState.isValid,
          isSubmitting: form.formState.isSubmitting,
          hasBeenModified: hasChanges,
        })

        // Update window hasFormData flag
        updateWindowFormData(windowId, hasChanges, setWindowHasFormData)
        // Update window title based on nome field
        const newTitle = value.nome || 'Cemitério'
        updateUpdateWindowTitle(windowId, newTitle, updateWindowState)
      }
    })
    return () => subscription.unsubscribe()
  }, [form, windowId, cemiterioData, formId])

  const handleClose = () => {
    // Clean up all form instances for the current window
    cleanupWindowForms(windowId)

    handleWindowClose(windowId, navigate, removeWindow)
  }

  const onSubmit = async (values: CemiterioFormSchemaType) => {
    try {
      updateFormState(formId, (state) => ({
        ...state,
        isSubmitting: true,
      }))

      const response = await updateCemiterioMutation.mutateAsync({
        id: cemiterioId,
        data: {
          nome: values.nome,
          morada: values.morada,
          codigoPostalId: values.codigoPostalId,
          predefinido: values.predefinido,
        },
      })

      const result = handleApiResponse(
        response,
        'Cemitério atualizado com sucesso',
        'Erro ao atualizar cemitério',
        'Cemitério atualizado com avisos'
      )

      if (result.success) {
        // Close the window
        if (windowId) {
          removeWindow(windowId)
        }
        modalClose()
      }
    } catch (error) {
      toast.error(handleApiError(error, 'Erro ao atualizar cemitério'))
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
          id='cemiterioUpdateForm'
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
                            value={field.value}
                            onValueChange={field.onChange}
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
              disabled={updateCemiterioMutation.isPending}
              className='w-full md:w-auto'
            >
              {updateCemiterioMutation.isPending
                ? 'A atualizar...'
                : 'Atualizar'}
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
            form.setValue('codigoPostalId', newCodigoPostal.id)
            setCreateCodigoPostalData((prev) => ({ ...prev, isOpen: false }))
          }}
          initialCodigo={createCodigoPostalData.codigo}
          shouldCloseWindow={false}
        />
      </EnhancedModal>
    </div>
  )
}

export { CemiterioUpdateForm }
