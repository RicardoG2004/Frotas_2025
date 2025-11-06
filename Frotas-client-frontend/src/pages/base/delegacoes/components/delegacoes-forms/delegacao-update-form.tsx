import { useEffect, useRef } from 'react'
import { z } from 'zod'
import { useForm, type Resolver } from 'react-hook-form'
import { useUpdateDelegacao } from '@/pages/base/delegacoes/queries/delegacoes-mutations'
import { useGetDelegacao } from '@/pages/base/delegacoes/queries/delegacoes-queries'
import { useGetCodigosPostaisSelect } from '@/pages/base/codigospostais/queries/codigospostais-queries'
import { useGetPaisesSelect } from '@/pages/base/paises/queries/paises-queries'
import { Building2, MapPin, Phone, Mail, FileText, Globe, Printer, Eye, Plus } from 'lucide-react'
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
  openPaisCreationWindow,
  openPaisViewWindow,
  openCodigoPostalCreationWindow,
  openCodigoPostalViewWindow,
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

const delegacaoFormSchema = z.object({
  designacao: z.string().min(1, { message: 'A designação é obrigatória' }),
  morada: z.string().min(1, { message: 'A morada é obrigatória' }),
  localidade: z.string().min(1, { message: 'A localidade é obrigatória' }),
  codigoPostalId: z.string().min(1, { message: 'O código postal é obrigatório' }),
  paisId: z.string().min(1, { message: 'O país é obrigatório' }),
  telefone: z.string().min(1, { message: 'O telefone é obrigatório' }),
  email: z.string().email({ message: 'Email inválido' }).min(1, { message: 'O email é obrigatório' }),
  fax: z.string().optional(),
  enderecoHttp: z.string().optional(),
})

type DelegacaoFormValues = z.infer<typeof delegacaoFormSchema>

interface DelegacaoUpdateFormProps {
  modalClose: () => void
  delegacaoId: string
  initialData: {
    designacao: string
    morada: string
    localidade: string
    codigoPostalId: string
    paisId: string
    telefone: string
    email: string
    fax: string
    enderecoHttp: string
  }
}

export const DelegacaoUpdateForm = ({
  modalClose,
  delegacaoId,
  initialData,
}: DelegacaoUpdateFormProps) => {
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

  const updateDelegacaoMutation = useUpdateDelegacao()
  const { data: delegacaoData } = useGetDelegacao(delegacaoId)

  // Fetch select data
  const { data: codigosPostaisSelect = [], isLoading: isLoadingCodigosPostais } =
    useGetCodigosPostaisSelect()
  const { data: paisesSelect = [], isLoading: isLoadingPaises } =
    useGetPaisesSelect()

  const delegacaoResolver: Resolver<DelegacaoFormValues> = async (values) => {
    const result = delegacaoFormSchema.safeParse(values)
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

  const form = useForm<DelegacaoFormValues>({
    resolver: delegacaoResolver,
    defaultValues: {
      designacao: '',
      morada: '',
      localidade: '',
      codigoPostalId: '',
      paisId: '',
      telefone: '',
      email: '',
      fax: '',
      enderecoHttp: '',
    },
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
    criteriaMode: 'all',
  })

  const { setActiveTab } = useTabManager({
    defaultTab: 'identificacao',
    tabKey: `delegacao-${instanceId}`,
  })
  const { handleError } = useSubmitErrorTab<DelegacaoFormValues>({
    setActiveTab,
    fieldToTabMap: {
      default: 'identificacao',
      designacao: 'identificacao',
      morada: 'localizacao',
      localidade: 'localizacao',
      codigoPostalId: 'localizacao',
      paisId: 'localizacao',
      telefone: 'detalhes',
      email: 'detalhes',
      fax: 'detalhes',
      enderecoHttp: 'detalhes',
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
      form.reset(formData as DelegacaoFormValues)
      // Update window title with initial form data
      if (formData?.designacao && windowId) {
        updateUpdateWindowTitle(windowId, formData.designacao, updateWindowState)
      }
    } else if (delegacaoData) {
      // If no saved data, use the data from the API
      const delegacao = delegacaoData
      form.reset({
        designacao: delegacao.designacao,
        morada: delegacao.morada,
        localidade: delegacao.localidade,
        codigoPostalId: delegacao.codigoPostalId,
        paisId: delegacao.paisId,
        telefone: delegacao.telefone,
        email: delegacao.email,
        fax: delegacao.fax || '',
        enderecoHttp: delegacao.enderecoHttp || '',
      })
      // Update window title with API data
      if (delegacao.designacao && windowId) {
        updateUpdateWindowTitle(windowId, delegacao.designacao, updateWindowState)
      }
    }
  }, [formData, isInitialized, formId, hasFormData, delegacaoData, windowId])

  // Save form data when it changes
  useEffect(() => {
    const subscription = form.watch((value) => {
      const hasChanges = detectUpdateFormChanges(value, initialData)

      if (JSON.stringify(value) !== JSON.stringify(formData)) {
        setFormState(formId, {
          formData: value as DelegacaoFormValues,
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

  // País handlers
  const handleCreatePais = () => {
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

    openPaisViewWindow(
      navigate,
      windowId,
      paisId,
      updateWindowState,
      findWindowByPathAndInstanceId
    )
  }

  const handleClose = () => {
    // Clean up all form instances for the current window
    cleanupWindowForms(windowId)
    handleWindowClose(windowId, navigate, removeWindow)
  }

  const onSubmit = async (values: DelegacaoFormValues) => {
    try {
      updateFormState(formId, (state) => ({
        ...state,
        isSubmitting: true,
      }))

      const response = await updateDelegacaoMutation.mutateAsync({
        id: delegacaoId,
        data: {
          Designacao: values.designacao,
          Morada: values.morada,
          Localidade: values.localidade,
          CodigoPostalId: values.codigoPostalId,
          PaisId: values.paisId,
          Telefone: values.telefone,
          Email: values.email,
          Fax: values.fax || '',
          EnderecoHttp: values.enderecoHttp || '',
        },
      }) as ResponseApi<GSResponse<string>>

      const result = handleApiResponse(
        response,
        'Delegação atualizada com sucesso',
        'Erro ao atualizar delegação',
        'Delegação atualizada com avisos'
      )

      if (result.success) {
        // Close the window
        if (windowId) {
          removeWindow(windowId)
        }
        modalClose()
      }
    } catch (error) {
      toast.error(handleApiError(error, 'Erro ao atualizar delegação'))
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
            tabKey={`delegacao-${instanceId}`}
          >
            <TabsList>
              <TabsTrigger value='identificacao'>Identificação</TabsTrigger>
              <TabsTrigger value='localizacao'>Localização</TabsTrigger>
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
                        Identificação da Delegação
                        <Badge variant='secondary' className='text-xs'>
                          Obrigatório
                        </Badge>
                      </CardTitle>
                      <p className='text-sm text-muted-foreground mt-1'>
                        Defina a designação da delegação
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className='space-y-6'>
                  <div className='grid grid-cols-1 gap-4'>
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
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Localização Tab */}
            <TabsContent value='localizacao'>
              <Card className='overflow-hidden border-l-4 border-l-primary/20 hover:border-l-primary/40 transition-all duration-200 hover:shadow-md'>
                <CardHeader className='pb-4'>
                  <div className='flex items-center gap-3'>
                    <div className='flex items-center justify-center w-8 h-8 rounded-md bg-primary/10 text-primary'>
                      <MapPin className='h-4 w-4' />
                    </div>
                    <div>
                      <CardTitle className='text-base flex items-center gap-2'>
                        Localização
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
                  </div>

                  <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                    <FormField
                      control={form.control}
                      name='localidade'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className='flex items-center gap-2'>
                            <MapPin className='h-4 w-4' />
                            Localidade
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder='Introduza a localidade'
                              {...field}
                              className='px-4 py-5 shadow-inner drop-shadow-xl'
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
                                options={paisesSelect.map((pais) => ({
                                  value: pais.id || '',
                                  label: pais.nome,
                                }))}
                                value={field.value}
                                onValueChange={field.onChange}
                                placeholder={
                                  isLoadingPaises
                                    ? 'A carregar...'
                                    : 'Selecione um país'
                                }
                                emptyText='Nenhum país encontrado.'
                                disabled={isLoadingPaises}
                                className='px-4 py-5 pr-20 shadow-inner drop-shadow-xl'
                              />
                              <div className='absolute right-2 top-1/2 -translate-y-1/2 flex gap-1'>
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

            {/* Detalhes Tab */}
            <TabsContent value='detalhes'>
              <Card className='overflow-hidden border-l-4 border-l-primary/20 hover:border-l-primary/40 transition-all duration-200 hover:shadow-md'>
                <CardHeader className='pb-4'>
                  <div className='flex items-center gap-3'>
                    <div className='flex items-center justify-center w-8 h-8 rounded-md bg-primary/10 text-primary'>
                      <Phone className='h-4 w-4' />
                    </div>
                    <div>
                      <CardTitle className='text-base flex items-center gap-2'>
                        Detalhes de Contato
                        <Badge variant='secondary' className='text-xs'>
                          Obrigatório
                        </Badge>
                      </CardTitle>
                      <p className='text-sm text-muted-foreground mt-1'>
                        Informações de contato da delegação
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className='space-y-6'>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
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

                    <FormField
                      control={form.control}
                      name='fax'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className='flex items-center gap-2'>
                            <Printer className='h-4 w-4' />
                            Fax
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder='Introduza o fax (opcional)'
                              {...field}
                              className='px-4 py-6 shadow-inner drop-shadow-xl'
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className='grid grid-cols-1 gap-4'>
                    <FormField
                      control={form.control}
                      name='email'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className='flex items-center gap-2'>
                            <Mail className='h-4 w-4' />
                            Email
                          </FormLabel>
                          <FormControl>
                            <Input
                              type='email'
                              placeholder='Introduza o email'
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
                      name='enderecoHttp'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className='flex items-center gap-2'>
                            <Globe className='h-4 w-4' />
                            Endereço HTTP
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder='Introduza o endereço HTTP (opcional)'
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
              disabled={updateDelegacaoMutation.isPending}
              className='w-full md:w-auto'
            >
              {updateDelegacaoMutation.isPending ? 'A atualizar...' : 'Atualizar'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

