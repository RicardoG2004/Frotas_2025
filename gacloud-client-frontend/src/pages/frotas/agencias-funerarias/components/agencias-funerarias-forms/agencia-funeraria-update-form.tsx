import { useEffect, useRef } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { type Resolver } from 'react-hook-form'
import { useGetEntidadesSelect } from '@/pages/base/entidades/queries/entidades-queries'
import { useUpdateAgenciaFuneraria } from '@/pages/frotas/agencias-funerarias/queries/agencias-funerarias-mutations'
import { useGetAgenciaFuneraria } from '@/pages/frotas/agencias-funerarias/queries/agencias-funerarias-queries'
import { UpdateAgenciaFunerariaDTO } from '@/types/dtos/frotas/agencias-funerarias.dtos'
import { User, Eye, Plus, AlertCircle } from 'lucide-react'
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
  openEntidadeCreationWindow,
  openEntidadeViewWindow,
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
import {
  PersistentTabs,
  TabsList as PersistentTabsList,
  TabsTrigger as PersistentTabsTrigger,
  TabsContent as PersistentTabsContent,
} from '@/components/ui/persistent-tabs'
import { Switch } from '@/components/ui/switch'

const agenciaFunerariaFormSchema = z.object({
  entidadeId: z
    .string({ message: 'A Entidade é obrigatória' })
    .min(1, { message: 'A Entidade é obrigatória' }),
  historico: z.boolean().default(false),
})

type AgenciaFunerariaFormSchemaType = z.infer<typeof agenciaFunerariaFormSchema>

interface AgenciaFunerariaUpdateFormProps {
  modalClose: () => void
  agenciaFunerariaId: string
  initialData: AgenciaFunerariaFormSchemaType
}

const AgenciaFunerariaUpdateForm = ({
  modalClose,
  agenciaFunerariaId,
  initialData,
}: AgenciaFunerariaUpdateFormProps) => {
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
  const { findWindowByPathAndInstanceId } = useWindowsStore()

  const { setActiveTab } = useTabManager({
    defaultTab: 'identificacao',
    tabKey: `agencia-funeraria-${instanceId}`,
  })
  const { handleError } = useSubmitErrorTab<AgenciaFunerariaFormSchemaType>({
    setActiveTab,
    fieldToTabMap: {
      default: 'identificacao',
      entidadeId: 'identificacao',
      historico: 'opcoes',
    },
  })

  const updateAgenciaFunerariaMutation = useUpdateAgenciaFuneraria()
  const { data: agenciaFunerariaData } =
    useGetAgenciaFuneraria(agenciaFunerariaId)
  const {
    data: entidadesData = [],
    isLoading: isLoadingEntidades,
    refetch: refetchEntidades,
  } = useGetEntidadesSelect()

  const effectiveWindowId = windowId || instanceId

  const agenciaFunerariaResolver: Resolver<
    AgenciaFunerariaFormSchemaType
  > = async (values) => {
    const result = agenciaFunerariaFormSchema.safeParse(values)
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

  const form = useForm<AgenciaFunerariaFormSchemaType>({
    resolver: agenciaFunerariaResolver,
    defaultValues: initialData,
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
    criteriaMode: 'all',
  })

  // Ref to store normalized API data for change detection
  const normalizedApiDataRef = useRef<any>(null)

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
  }, [formId, hasBeenVisited, resetFormState, hasFormData, initialData])

  // Load saved form data if available and the form has been initialized
  useEffect(() => {
    if (isInitialized && hasFormData(formId)) {
      form.reset(formData as AgenciaFunerariaFormSchemaType)
    } else if (agenciaFunerariaData?.info?.data) {
      // If no saved data, use the data from the API
      const apiData = agenciaFunerariaData.info.data

      // Create normalized data for change detection (matching form structure)
      const normalizedApiData = {
        entidadeId: apiData.entidadeId,
        historico: apiData.historico,
      }

      // Store the normalized data in a ref or state for change detection
      if (!normalizedApiDataRef.current) {
        normalizedApiDataRef.current = {}
      }
      normalizedApiDataRef.current[agenciaFunerariaId] = normalizedApiData

      form.reset(normalizedApiData)
    }
  }, [
    formData,
    isInitialized,
    formId,
    hasFormData,
    agenciaFunerariaData,
    agenciaFunerariaId,
  ])

  // Save form data when it changes
  useEffect(() => {
    const subscription = form.watch((value) => {
      if (value) {
        // Use proper change detection by comparing with normalized original values
        const normalizedOriginalData =
          normalizedApiDataRef.current?.[agenciaFunerariaId] ||
          agenciaFunerariaData?.info?.data ||
          {}
        const hasChanges = detectUpdateFormChanges(
          value,
          normalizedOriginalData
        )

        setFormState(formId, {
          formData: value as AgenciaFunerariaFormSchemaType,
          isDirty: hasChanges,
          isValid: form.formState.isValid,
          isSubmitting: form.formState.isSubmitting,
          hasBeenModified: hasChanges,
        })

        // Update window hasFormData flag
        updateWindowFormData(
          effectiveWindowId,
          hasChanges,
          setWindowHasFormData
        )
        // Update window title based on selected entidade
        const selectedEntidade = entidadesData.find(
          (entidade) => entidade.id === value.entidadeId
        )
        const newTitle = selectedEntidade?.nome || 'Agência Funerária'

        // Always update the window title to ensure it reflects the current state
        updateUpdateWindowTitle(effectiveWindowId, newTitle, updateWindowState)
      }
    })
    return () => subscription.unsubscribe()
  }, [
    form,
    effectiveWindowId,
    agenciaFunerariaData,
    formId,
    formData,
    entidadesData,
  ])

  const handleClose = () => {
    // Clean up all form instances for the current window
    cleanupWindowForms(effectiveWindowId)

    handleWindowClose(effectiveWindowId, navigate, removeWindow)
  }

  const handleCreateEntidade = () => {
    // Open entidade creation in a new window with parent reference
    openEntidadeCreationWindow(
      navigate,
      effectiveWindowId,
      updateWindowState,
      findWindowByPathAndInstanceId
    )
  }

  const handleViewEntidade = () => {
    const entidadeId = form.getValues('entidadeId')
    if (!entidadeId) {
      toast.error('Por favor, selecione uma entidade primeiro')
      return
    }

    // Open entidade view in a new window
    openEntidadeViewWindow(
      navigate,
      effectiveWindowId,
      entidadeId,
      updateWindowState,
      findWindowByPathAndInstanceId
    )
  }

  // Use the combined auto-selection and return data hook for entidades
  useAutoSelectionWithReturnData({
    windowId: effectiveWindowId,
    instanceId,
    data: entidadesData,
    setValue: (value: string) => {
      form.setValue('entidadeId', value, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      })
    },
    refetch: refetchEntidades,
    itemName: 'Entidade',
    successMessage: 'Entidade selecionada automaticamente',
    manualSelectionMessage:
      'Entidade criada com sucesso. Por favor, selecione-a manualmente.',
    queryKey: ['entidades-select'],
    returnDataKey: `return-data-${effectiveWindowId}-entidade`,
  })

  const onSubmit = async (values: AgenciaFunerariaFormSchemaType) => {
    try {
      updateFormState(formId, (state) => ({
        ...state,
        isSubmitting: true,
      }))

      // Transform the form data to match the API structure
      const requestData: UpdateAgenciaFunerariaDTO = {
        id: agenciaFunerariaId,
        entidadeId: values.entidadeId,
        historico: values.historico,
      }

      const response = await updateAgenciaFunerariaMutation.mutateAsync({
        id: agenciaFunerariaId,
        data: requestData,
      })
      const result = handleApiResponse(
        response,
        'Agência funerária atualizada com sucesso',
        'Erro ao atualizar agência funerária',
        'Agência funerária atualizada com avisos'
      )

      if (result.success) {
        // Close the window
        if (effectiveWindowId) {
          removeWindow(effectiveWindowId)
        }
        modalClose()
      }
    } catch (error) {
      toast.error(handleApiError(error, 'Erro ao atualizar agência funerária'))
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
          id='agenciaFunerariaUpdateForm'
          onSubmit={form.handleSubmit(onSubmit, handleError)}
          className='space-y-4'
          autoComplete='off'
        >
          <PersistentTabs
            defaultValue='identificacao'
            className='w-full'
            tabKey={`agencia-funeraria-${instanceId}`}
          >
            <PersistentTabsList>
              <PersistentTabsTrigger value='identificacao'>
                Identificação
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
                          Identificação da Agência Funerária
                          <Badge variant='secondary' className='text-xs'>
                            Obrigatório
                          </Badge>
                        </CardTitle>
                        <p className='text-sm text-muted-foreground mt-1'>
                          Selecione a entidade da agência funerária
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className='space-y-6'>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                      <FormField
                        control={form.control}
                        name='entidadeId'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='flex items-center gap-2'>
                              <User className='h-4 w-4' />
                              Entidade
                              <Badge variant='secondary' className='text-xs'>
                                Obrigatório
                              </Badge>
                            </FormLabel>
                            <FormControl>
                              <div className='relative'>
                                <Autocomplete
                                  options={entidadesData.map((entidade) => ({
                                    value: entidade.id || '',
                                    label: entidade.nome,
                                  }))}
                                  value={String(field.value ?? '')}
                                  onValueChange={field.onChange}
                                  placeholder={
                                    isLoadingEntidades
                                      ? 'A carregar...'
                                      : 'Selecione uma entidade'
                                  }
                                  emptyText='Nenhuma entidade encontrada.'
                                  disabled={isLoadingEntidades}
                                  className='px-4 py-6 pr-32 shadow-inner drop-shadow-xl'
                                />
                                <div className='absolute right-12 top-1/2 -translate-y-1/2 flex gap-1'>
                                  <Button
                                    type='button'
                                    variant='outline'
                                    size='sm'
                                    onClick={handleViewEntidade}
                                    className='h-8 w-8 p-0'
                                    title='Ver Entidade'
                                    disabled={!field.value}
                                  >
                                    <Eye className='h-4 w-4' />
                                  </Button>
                                  <Button
                                    type='button'
                                    variant='outline'
                                    size='sm'
                                    onClick={handleCreateEntidade}
                                    className='h-8 w-8 p-0'
                                    title='Criar Nova Entidade'
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
                        <AlertCircle className='h-4 w-4' />
                      </div>
                      <div>
                        <CardTitle className='text-base flex items-center gap-2'>
                          Configurações Adicionais
                          <Badge variant='outline' className='text-xs'>
                            Opcional
                          </Badge>
                        </CardTitle>
                        <p className='text-sm text-muted-foreground mt-1'>
                          Configurações e opções adicionais
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className='space-y-6'>
                    <FormField
                      control={form.control}
                      name='historico'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className='flex items-center gap-2'>
                            <AlertCircle className='h-4 w-4' />
                            Histórico
                          </FormLabel>
                          <FormControl>
                            <div className='flex flex-row items-center justify-between rounded-lg border px-4 py-3.5 bg-background'>
                              <span className='text-sm font-normal'>
                                Marcar como histórico
                              </span>
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
              disabled={updateAgenciaFunerariaMutation.isPending}
              className='w-full md:w-auto'
            >
              {updateAgenciaFunerariaMutation.isPending
                ? 'A atualizar...'
                : 'Atualizar'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

export { AgenciaFunerariaUpdateForm }
