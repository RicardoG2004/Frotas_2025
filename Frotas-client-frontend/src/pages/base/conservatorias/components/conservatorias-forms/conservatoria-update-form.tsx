import { useEffect, useRef } from 'react'
import { z } from 'zod'
import { useForm, type Resolver } from 'react-hook-form'
import { useUpdateConservatoria } from '@/pages/base/conservatorias/queries/conservatorias-mutations'
import { useGetConservatoria } from '@/pages/base/conservatorias/queries/conservatorias-queries'
import { useGetCodigosPostaisSelect } from '@/pages/base/codigospostais/queries/codigospostais-queries'
import { useGetFreguesiasSelect } from '@/pages/base/freguesias/queries/freguesias-queries'
import { useGetConcelhosSelect } from '@/pages/base/concelhos/queries/concelhos-queries'
import { Building2, MapPin, Phone, FileText, Map, Eye, Plus } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useFormState, useFormsStore } from '@/stores/use-forms-store'
import { useWindowsStore } from '@/stores/use-windows-store'
import { handleApiError } from '@/utils/error-handlers'
import { handleApiResponse } from '@/utils/response-handlers'
import { toast } from '@/utils/toast-utils'
import type { ResponseApi } from '@/types/responses'
import type { GSResponse } from '@/types/api/responses'
import {
  useCurrentWindowId,
  handleWindowClose,
  updateWindowFormData,
  cleanupWindowForms,
  updateUpdateWindowTitle,
  detectUpdateFormChanges,
  openCodigoPostalCreationWindow,
  openCodigoPostalViewWindow,
  openFreguesiaCreationWindow,
  openFreguesiaViewWindow,
  openConcelhoCreationWindow,
  openConcelhoViewWindow,
} from '@/utils/window-utils'
import { useSubmitErrorTab } from '@/hooks/use-submit-error-tab'
import { useTabManager } from '@/hooks/use-tab-manager'
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
import { Autocomplete } from '@/components/ui/autocomplete'
import {
  PersistentTabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@/components/ui/persistent-tabs'

const conservatoriaFormSchema = z.object({
  designacao: z.string().min(1, { message: 'A designação é obrigatória' }),
  telefone: z.string().min(1, { message: 'O telefone é obrigatório' }),
  morada: z.string().min(1, { message: 'A morada é obrigatória' }),
  codigoPostalId: z.string().min(1, { message: 'O código postal é obrigatório' }),
  freguesiaId: z.string().min(1, { message: 'A freguesia é obrigatória' }),
  concelhoId: z.string().min(1, { message: 'O concelho é obrigatório' }),
})

type ConservatoriaFormValues = z.infer<typeof conservatoriaFormSchema>

interface ConservatoriaUpdateFormProps {
  modalClose: () => void
  conservatoriaId: string
  initialData: {
    designacao: string
    telefone: string
    morada: string
    codigoPostalId: string
    freguesiaId: string
    concelhoId: string
  }
}

export const ConservatoriaUpdateForm = ({
  modalClose,
  conservatoriaId,
  initialData,
}: ConservatoriaUpdateFormProps) => {
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
  const { removeWindow, updateWindowState, findWindowByPathAndInstanceId } = useWindowsStore()
  const setWindowHasFormData = useWindowsStore(
    (state) => state.setWindowHasFormData
  )

  const updateConservatoriaMutation = useUpdateConservatoria()
  const { data: conservatoriaData } = useGetConservatoria(conservatoriaId)

  // Fetch select data
  const { data: codigosPostaisSelect = [], isLoading: isLoadingCodigosPostais } =
    useGetCodigosPostaisSelect()
  const { data: freguesiasSelect = [], isLoading: isLoadingFreguesias } =
    useGetFreguesiasSelect()
  const { data: concelhosSelect = [], isLoading: isLoadingConcelhos } =
    useGetConcelhosSelect()

  const conservatoriaResolver: Resolver<ConservatoriaFormValues> = async (
    values
  ) => {
    const result = conservatoriaFormSchema.safeParse(values)
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

  const form = useForm<ConservatoriaFormValues>({
    resolver: conservatoriaResolver,
    defaultValues: {
      designacao: '',
      telefone: '',
      morada: '',
      codigoPostalId: '',
      freguesiaId: '',
      concelhoId: '',
    },
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
    criteriaMode: 'all',
  })

  const { setActiveTab } = useTabManager({
    defaultTab: 'identificacao',
    tabKey: `conservatoria-${instanceId}`,
  })
  const { handleError } = useSubmitErrorTab<ConservatoriaFormValues>({
    setActiveTab,
    fieldToTabMap: {
      default: 'identificacao',
      designacao: 'identificacao',
      telefone: 'identificacao',
      morada: 'detalhes',
      codigoPostalId: 'detalhes',
      freguesiaId: 'detalhes',
      concelhoId: 'detalhes',
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
          formData: initialData,
          isDirty: false,
          isValid: true,
          isSubmitting: false,
          hasBeenModified: false,
          windowId: windowId,
        })
      }
      isFirstRender.current = false
    }
  }, [formId, hasBeenVisited, resetFormState, hasFormData, windowId])

  // Load saved form data if available and the form has been initialized
  useEffect(() => {
    if (isInitialized && hasFormData(formId)) {
      form.reset(formData as ConservatoriaFormValues)
      // Update window title with initial form data
      if (formData?.designacao && windowId) {
        updateUpdateWindowTitle(windowId, formData.designacao, updateWindowState)
      }
    } else if (conservatoriaData) {
      // If no saved data, use the data from the API
      const conservatoria = conservatoriaData
      const designacaoFromApi = conservatoria.designacao ?? conservatoria.nome ?? ''
      form.reset({
        designacao: designacaoFromApi,
        telefone: conservatoria.telefone,
        morada: conservatoria.morada,
        codigoPostalId: conservatoria.codigoPostalId,
        freguesiaId: conservatoria.freguesiaId,
        concelhoId: conservatoria.concelhoId,
      })
      // Update window title with API data
      if (designacaoFromApi && windowId) {
        updateUpdateWindowTitle(windowId, designacaoFromApi, updateWindowState)
      }
    }
  }, [formData, isInitialized, formId, hasFormData, conservatoriaData, windowId])

  // Save form data when it changes
  useEffect(() => {
    const subscription = form.watch((value) => {
      const hasChanges = detectUpdateFormChanges(value, initialData)

      if (JSON.stringify(value) !== JSON.stringify(formData)) {
        setFormState(formId, {
          formData: value as ConservatoriaFormValues,
          isDirty: hasChanges,
          isValid: form.formState.isValid,
          isSubmitting: form.formState.isSubmitting,
          hasBeenModified: hasChanges,
          windowId: windowId,
        })

        // Update window hasFormData flag
        updateWindowFormData(windowId, hasChanges, setWindowHasFormData)
        if (value.designacao && value.designacao !== formData?.designacao) {
          updateUpdateWindowTitle(windowId, value.designacao, updateWindowState)
        }
      }
    })
    return () => subscription.unsubscribe()
  }, [
    form,
    windowId,
    formId,
    initialData,
    formData,
    setFormState,
    setWindowHasFormData,
    updateWindowState,
  ])

  const handleClose = () => {
    // Clean up all form instances for the current window
    cleanupWindowForms(windowId)
    handleWindowClose(windowId, navigate, removeWindow)
  }

  // Código Postal handlers
  const handleCreateCodigoPostal = () => {
    openCodigoPostalCreationWindow(
      navigate,
      windowId,
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
      windowId,
      codigoPostalId,
      updateWindowState,
      findWindowByPathAndInstanceId
    )
  }

  // Freguesia handlers
  const handleCreateFreguesia = () => {
    openFreguesiaCreationWindow(
      navigate,
      windowId,
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

    openFreguesiaViewWindow(
      navigate,
      windowId,
      freguesiaId,
      updateWindowState,
      findWindowByPathAndInstanceId
    )
  }

  // Concelho handlers
  const handleCreateConcelho = () => {
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

  const onSubmit = async (values: ConservatoriaFormValues) => {
    try {
      updateFormState(formId, (state) => ({
        ...state,
        isSubmitting: true,
      }))

      const response = (await updateConservatoriaMutation.mutateAsync({
        id: conservatoriaId,
        data: {
          Nome: values.designacao,
          Telefone: values.telefone,
          Morada: values.morada,
          CodigoPostalId: values.codigoPostalId,
          FreguesiaId: values.freguesiaId,
          ConcelhoId: values.concelhoId,
        },
      })) as ResponseApi<GSResponse<string>>

      const result = handleApiResponse(
        response,
        'Conservatória atualizada com sucesso',
        'Erro ao atualizar conservatória',
        'Conservatória atualizada com avisos'
      )

      if (result.success) {
        // Close the window
        if (windowId) {
          removeWindow(windowId)
        }
        modalClose()
      }
    } catch (error) {
      toast.error(handleApiError(error, 'Erro ao atualizar conservatória'))
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
            defaultValue='identificacao'
            className='w-full'
            tabKey={`conservatoria-${instanceId}`}
          >
            <TabsList>
              <TabsTrigger value='identificacao'>Identificação</TabsTrigger>
              <TabsTrigger value='detalhes'>Detalhes</TabsTrigger>
            </TabsList>

            {/* Identificação Tab */}
            <TabsContent value='identificacao'>
              <Card className='overflow-hidden border-l-4 border-l-primary/20 hover:border-l-primary/40 transition-all duration-200 hover:shadow-md'>
                <CardHeader className='pb-4'>
                  <div className='flex items-center gap-3'>
                    <div className='flex items-center justify-center w-8 h-8 rounded-md bg-primary/10 text-primary'>
                      <Building2 className='h-4 w-4' />
                    </div>
                    <div>
                      <CardTitle className='text-base flex items-center gap-2'>
                        Identificação da Conservatória
                        <Badge variant='secondary' className='text-xs'>
                          Obrigatório
                        </Badge>
                      </CardTitle>
                      <p className='text-sm text-muted-foreground mt-1'>
                        Defina as informações básicas da conservatória
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className='space-y-6'>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <FormField
                      control={form.control}
                      name='designacao'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className='flex items-center gap-2'>
                            <FileText className='h-4 w-4' />
                            Designação
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder='Introduza a designação'
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
                      name='telefone'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className='flex items-center gap-2'>
                            <Phone className='h-4 w-4' />
                            Telefone
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder='Introduza o telefone'
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
            </TabsContent>

            {/* Detalhes Tab */}
            <TabsContent value='detalhes'>
              <Card className='overflow-hidden border-l-4 border-l-primary/20 hover:border-l-primary/40 transition-all duration-200 hover:shadow-md'>
                <CardHeader className='pb-4'>
                  <div className='flex items-center gap-3'>
                    <div className='flex items-center justify-center w-8 h-8 rounded-md bg-primary/10 text-primary'>
                      <MapPin className='h-4 w-4' />
                    </div>
                    <div>
                      <CardTitle className='text-base flex items-center gap-2'>
                        Detalhes de Localização
                        <Badge variant='secondary' className='text-xs'>
                          Obrigatório
                        </Badge>
                      </CardTitle>
                      <p className='text-sm text-muted-foreground mt-1'>
                        Complete as informações de localização
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className='space-y-6'>
                  <div className='grid grid-cols-1 gap-4'>
                    <FormField
                      control={form.control}
                      name='morada'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className='flex items-center gap-2'>
                            <Map className='h-4 w-4' />
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
                  </div>

                  <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
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
                            <div className='relative'>
                              <Autocomplete
                                options={codigosPostaisSelect.map((codigo) => ({
                                  value: codigo.id || '',
                                  label: `${codigo.codigo} - ${codigo.localidade}`,
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
                                className='px-4 py-5 pr-20 shadow-inner drop-shadow-xl'
                              />
                              <div className='absolute right-2 top-1/2 -translate-y-1/2 flex gap-1'>
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

                    <FormField
                      control={form.control}
                      name='freguesiaId'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className='flex items-center gap-2'>
                            <MapPin className='h-4 w-4' />
                            Freguesia
                          </FormLabel>
                          <FormControl>
                            <div className='relative'>
                              <Autocomplete
                                options={freguesiasSelect.map((freguesia) => ({
                                  value: freguesia.id || '',
                                  label: freguesia.nome,
                                }))}
                                value={field.value}
                                onValueChange={field.onChange}
                                placeholder={
                                  isLoadingFreguesias
                                    ? 'A carregar...'
                                    : 'Selecione uma freguesia'
                                }
                                emptyText='Nenhuma freguesia encontrada.'
                                disabled={isLoadingFreguesias}
                                className='px-4 py-5 pr-20 shadow-inner drop-shadow-xl'
                              />
                              <div className='absolute right-2 top-1/2 -translate-y-1/2 flex gap-1'>
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
                      name='concelhoId'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className='flex items-center gap-2'>
                            <MapPin className='h-4 w-4' />
                            Concelho
                          </FormLabel>
                          <FormControl>
                            <div className='relative'>
                              <Autocomplete
                                options={concelhosSelect.map((concelho) => ({
                                  value: concelho.id || '',
                                  label: concelho.nome,
                                }))}
                                value={field.value}
                                onValueChange={field.onChange}
                                placeholder={
                                  isLoadingConcelhos
                                    ? 'A carregar...'
                                    : 'Selecione um concelho'
                                }
                                emptyText='Nenhum concelho encontrado.'
                                disabled={isLoadingConcelhos}
                                className='px-4 py-5 pr-20 shadow-inner drop-shadow-xl'
                              />
                              <div className='absolute right-2 top-1/2 -translate-y-1/2 flex gap-1'>
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
              disabled={updateConservatoriaMutation.isPending}
              className='w-full md:w-auto'
            >
              {updateConservatoriaMutation.isPending
                ? 'A atualizar...'
                : 'Atualizar'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

