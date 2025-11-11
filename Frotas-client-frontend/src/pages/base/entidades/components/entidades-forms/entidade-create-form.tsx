import { useEffect, useMemo, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { useForm, type Resolver } from 'react-hook-form'
import { Building2, MapPin, Phone, Mail, Eye, Plus } from 'lucide-react'
import { useCreateEntidade } from '@/pages/base/entidades/queries/entidades-mutations'
import { useGetCodigosPostaisSelect } from '@/pages/base/codigospostais/queries/codigospostais-queries'
import { useGetPaisesSelect } from '@/pages/base/paises/queries/paises-queries'
import { useFormState, useFormsStore } from '@/stores/use-forms-store'
import { useWindowsStore } from '@/stores/use-windows-store'
import {
  useCurrentWindowId,
  handleWindowClose,
  updateCreateFormData,
  cleanupWindowForms,
  updateCreateWindowTitle,
  detectFormChanges,
  openCodigoPostalCreationWindow,
  openCodigoPostalViewWindow,
  openPaisCreationWindow,
  openPaisViewWindow,
  setEntityReturnDataWithToastSuppression,
} from '@/utils/window-utils'
import { useAutoSelectionWithReturnData } from '@/hooks/use-auto-selection-with-return-data'
import { useSubmitErrorTab } from '@/hooks/use-submit-error-tab'
import { useTabManager } from '@/hooks/use-tab-manager'
import { handleApiResponse } from '@/utils/response-handlers'
import { handleApiError } from '@/utils/error-handlers'
import { toast } from '@/utils/toast-utils'
import { Button } from '@/components/ui/button'
import type { ResponseApi } from '@/types/responses'
import type { GSResponse } from '@/types/api/responses'
import { Badge } from '@/components/ui/badge'
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
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/persistent-tabs'

const entidadeFormSchema = z.object({
  designacao: z.string().min(1, { message: 'A designação é obrigatória' }),
  morada: z.string().min(1, { message: 'A morada é obrigatória' }),
  localidade: z.string().min(1, { message: 'A localidade é obrigatória' }),
  codigoPostalId: z.string().min(1, { message: 'O código postal é obrigatório' }),
  paisId: z.string().min(1, { message: 'O país é obrigatório' }),
  telefone: z.string().min(1, { message: 'O telefone é obrigatório' }),
  fax: z.string().min(1, { message: 'O fax é obrigatório' }),
  enderecoHttp: z.string().min(1, { message: 'O endereço web é obrigatório' }),
  email: z
    .string({ message: 'O email é obrigatório' })
    .email({ message: 'Email inválido' })
    .min(1, { message: 'O email é obrigatório' }),
})

type EntidadeFormValues = z.infer<typeof entidadeFormSchema>

interface EntidadeCreateFormProps {
  modalClose: () => void
  onSuccess?: (newEntidade: { id: string; designacao: string }) => void
  shouldCloseWindow?: boolean
}

export const EntidadeCreateForm = ({
  modalClose,
  onSuccess,
  shouldCloseWindow = true,
}: EntidadeCreateFormProps) => {
  const location = useLocation()
  const navigate = useNavigate()
  const windowId = useCurrentWindowId()
  const searchParams = new URLSearchParams(location.search)
  const instanceId = searchParams.get('instanceId') || 'default'
  const formId = `entidade-${instanceId}`

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

  const createEntidadeMutation = useCreateEntidade()

  const { data: codigosPostaisSelect = [], refetch: refetchCodigosPostais } =
    useGetCodigosPostaisSelect()
  const { data: paisesSelect = [], refetch: refetchPaises } =
    useGetPaisesSelect()

  const defaultValues = useMemo(
    () => ({
      designacao: '',
      morada: '',
      localidade: '',
      codigoPostalId: '',
      paisId: '',
      telefone: '',
      fax: '',
      enderecoHttp: '',
      email: '',
    }),
    []
  )

  const entidadeResolver: Resolver<EntidadeFormValues> = async (values) => {
    const result = entidadeFormSchema.safeParse(values)
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

  const form = useForm<EntidadeFormValues>({
    resolver: entidadeResolver,
    defaultValues,
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
    criteriaMode: 'all',
  })

  const { setActiveTab } = useTabManager({
    defaultTab: 'dados',
    tabKey: `entidade-${instanceId}`,
  })
  const { handleError } = useSubmitErrorTab<EntidadeFormValues>({
    setActiveTab,
    fieldToTabMap: {
      default: 'dados',
      designacao: 'dados',
      morada: 'dados',
      localidade: 'dados',
      codigoPostalId: 'dados',
      paisId: 'dados',
      telefone: 'contactos',
      fax: 'contactos',
      enderecoHttp: 'contactos',
      email: 'contactos',
    },
  })

  useEffect(() => {
    if (isFirstRender.current) {
      if (!hasBeenVisited || !hasFormData(formId)) {
        resetFormState(formId)
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
  }, [formId, hasBeenVisited, resetFormState, hasFormData, setFormState, effectiveWindowId])

  useEffect(() => {
    if (isInitialized && hasFormData(formId)) {
      form.reset(formData as EntidadeFormValues)
    }
  }, [formData, isInitialized, formId, hasFormData, form])

  useEffect(() => {
    const subscription = form.watch((value) => {
      const hasChanges = detectFormChanges(value, defaultValues)

      setFormState(formId, {
        formData: value as EntidadeFormValues,
        isDirty: hasChanges,
        isValid: form.formState.isValid,
        isSubmitting: form.formState.isSubmitting,
        hasBeenModified: hasChanges,
        windowId: effectiveWindowId,
      })

      if (effectiveWindowId) {
        updateCreateFormData(
          effectiveWindowId,
          value,
          setWindowHasFormData,
          defaultValues
        )
        updateCreateWindowTitle(
          effectiveWindowId,
          value.designacao || 'Nova Entidade',
          updateWindowState
        )
      }
    })
    return () => subscription.unsubscribe()
  }, [
    form,
    formId,
    defaultValues,
    setFormState,
    effectiveWindowId,
    setWindowHasFormData,
    updateWindowState,
  ])

  const handleCreateCodigoPostal = () => {
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

  const handleCreatePais = () => {
    openPaisCreationWindow(
      navigate,
      effectiveWindowId,
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
      effectiveWindowId,
      paisId,
      updateWindowState,
      findWindowByPathAndInstanceId
    )
  }

  useAutoSelectionWithReturnData({
    windowId: effectiveWindowId,
    instanceId,
    data: codigosPostaisSelect,
    setValue: (value: string) => form.setValue('codigoPostalId', value),
    refetch: refetchCodigosPostais,
    itemName: 'Código Postal',
    successMessage: 'Código Postal selecionado automaticamente',
    manualSelectionMessage:
      'Código Postal criado com sucesso. Por favor, selecione-o manualmente.',
    queryKey: ['codigospostais-select'],
    returnDataKey: `return-data-${effectiveWindowId}-codigopostal`,
  })

  useAutoSelectionWithReturnData({
    windowId: effectiveWindowId,
    instanceId,
    data: paisesSelect,
    setValue: (value: string) => form.setValue('paisId', value),
    refetch: refetchPaises,
    itemName: 'País',
    successMessage: 'País selecionado automaticamente',
    manualSelectionMessage:
      'País criado com sucesso. Por favor, selecione-o manualmente.',
    queryKey: ['paises-select'],
    returnDataKey: `return-data-${effectiveWindowId}-pais`,
  })

  const handleClose = () => {
    cleanupWindowForms(effectiveWindowId)

    if (shouldCloseWindow) {
      handleWindowClose(effectiveWindowId, navigate, removeWindow)
    } else {
      modalClose()
    }
  }

  const onSubmit = async (values: EntidadeFormValues) => {
    try {
      updateFormState(formId, (state) => ({
        ...state,
        isSubmitting: true,
      }))

      const response = (await createEntidadeMutation.mutateAsync({
        Designacao: values.designacao,
        Morada: values.morada,
        Localidade: values.localidade,
        CodigoPostalId: values.codigoPostalId,
        PaisId: values.paisId,
        Telefone: values.telefone,
        Fax: values.fax,
        EnderecoHttp: values.enderecoHttp,
        Email: values.email,
      })) as ResponseApi<GSResponse<string>>

      const result = handleApiResponse(
        response,
        'Entidade criada com sucesso',
        'Erro ao criar entidade',
        'Entidade criada com avisos'
      )

      if (result.success) {
        if (effectiveWindowId) {
          setEntityReturnDataWithToastSuppression(
            effectiveWindowId,
            { id: response.info.data, designacao: values.designacao },
            'entidade',
            setWindowReturnData,
            parentWindowIdFromStorage || undefined,
            instanceId
          )
        }

        if (onSuccess) {
          onSuccess({
            id: response.info.data,
            designacao: values.designacao,
          })
        }

        if (effectiveWindowId && shouldCloseWindow) {
          removeWindow(effectiveWindowId)
        }
        modalClose()
      }
    } catch (error) {
      toast.error(handleApiError(error, 'Erro ao criar entidade'))
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
          id='entidadeCreateForm'
          onSubmit={form.handleSubmit(onSubmit, handleError)}
          className='space-y-4'
          autoComplete='off'
        >
          <PersistentTabs
            defaultValue='dados'
            className='w-full'
            tabKey={`entidade-${instanceId}`}
          >
            <TabsList>
              <TabsTrigger value='dados'>Detalhes</TabsTrigger>
              <TabsTrigger value='contactos'>Contactos</TabsTrigger>
            </TabsList>

            <TabsContent value='dados'>
              <Card className='overflow-hidden border-l-4 border-l-primary/20 transition-all duration-200 hover:border-l-primary/40 hover:shadow-md'>
                <CardHeader className='pb-4'>
                  <div className='flex items-center gap-3'>
                    <div className='flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary'>
                      <Building2 className='h-4 w-4' />
                    </div>
                    <div>
                      <CardTitle className='flex items-center gap-2 text-base'>
                        Identificação da Entidade
                        <Badge variant='secondary' className='text-xs'>
                          Obrigatório
                        </Badge>
                      </CardTitle>
                      <p className='mt-1 text-sm text-muted-foreground'>
                        Defina a designação principal da entidade
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <FormField
                    control={form.control}
                    name='designacao'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Designação</FormLabel>
                        <FormControl>
                          <Input placeholder='Designação da entidade' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
              <Card className='overflow-hidden border-l-4 border-l-primary/20 transition-all duração-200 hover:border-l-primary/40 hover:shadow-md'>
                <CardHeader className='pb-4'>
                  <div className='flex items-center gap-3'>
                    <div className='flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary'>
                      <MapPin className='h-4 w-4' />
                    </div>
                    <div>
                      <CardTitle className='flex items-center gap-2 text-base'>
                        Localização
                        <Badge variant='secondary' className='text-xs'>
                          Obrigatório
                        </Badge>
                      </CardTitle>
                      <p className='mt-1 text-sm text-muted-foreground'>
                        Defina a morada, localização e país
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className='grid gap-4 md:grid-cols-2'>
                    <FormField
                      control={form.control}
                      name='morada'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Morada</FormLabel>
                          <FormControl>
                            <Input placeholder='Morada completa' {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name='localidade'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Localidade</FormLabel>
                          <FormControl>
                            <Input placeholder='Localidade' {...field} />
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
                          <FormLabel>Código Postal</FormLabel>
                          <FormControl>
                            <div className='relative'>
                              <Autocomplete
                                options={codigosPostaisSelect.map((item) => ({
                                  label: `${item.codigo} - ${item.localidade}`,
                                  value: item.id,
                                }))}
                                value={field.value}
                                onValueChange={field.onChange}
                                placeholder='Selecione o código postal'
                                emptyText='Nenhum código postal encontrado.'
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
                                  title='Criar Código Postal'
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
                          <FormLabel>País</FormLabel>
                          <FormControl>
                            <div className='relative'>
                              <Autocomplete
                                options={paisesSelect.map((item) => ({
                                  label: item.nome,
                                  value: item.id,
                                }))}
                                value={field.value}
                                onValueChange={field.onChange}
                                placeholder='Selecione o país'
                                emptyText='Nenhum país encontrado.'
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
                                  title='Criar País'
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

            <TabsContent value='contactos'>
              <div className='grid gap-4 md:grid-cols-2'>
                <Card className='overflow-hidden border-l-4 border-l-primary/20 transition-all duration-200 hover:border-l-primary/40 hover:shadow-md'>
                  <CardHeader className='pb-4'>
                    <div className='flex items-center gap-3'>
                      <div className='flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary'>
                        <Phone className='h-4 w-4' />
                      </div>
                      <div>
                        <CardTitle className='flex items-center gap-2 text-base'>
                          Contactos
                          <Badge variant='secondary' className='text-xs'>
                            Obrigatório
                          </Badge>
                        </CardTitle>
                        <p className='mt-1 text-sm text-muted-foreground'>
                          Defina os contactos principais
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className='space-y-4'>
                    <FormField
                      control={form.control}
                      name='telefone'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Telefone</FormLabel>
                          <FormControl>
                            <Input placeholder='Número de telefone' {...field} />
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
                          <FormLabel>Fax</FormLabel>
                          <FormControl>
                            <Input placeholder='Número de fax' {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                <Card className='overflow-hidden border-l-4 border-l-primary/20 transition-all duration-200 hover:border-l-primary/40 hover:shadow-md'>
                  <CardHeader className='pb-4'>
                    <div className='flex items-center gap-3'>
                      <div className='flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary'>
                        <Mail className='h-4 w-4' />
                      </div>
                      <div>
                        <CardTitle className='flex items-center gap-2 text-base'>
                          Comunicação
                          <Badge variant='secondary' className='text-xs'>
                            Obrigatório
                          </Badge>
                        </CardTitle>
                        <p className='mt-1 text-sm text-muted-foreground'>
                          Configure os canais de comunicação
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className='space-y-4'>
                    <FormField
                      control={form.control}
                      name='email'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder='email@exemplo.com' {...field} />
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
                          <FormLabel>Endereço Web</FormLabel>
                          <FormControl>
                            <Input placeholder='https://www.exemplo.com' {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </PersistentTabs>

          <div className='flex items-center justify-end gap-3'>
            <Button type='button' variant='outline' onClick={handleClose}>
              Cancelar
            </Button>
            <Button
              type='submit'
              form='entidadeCreateForm'
              disabled={createEntidadeMutation.isPending}
            >
              Criar
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}


