import { useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { useForm, type Resolver } from 'react-hook-form'
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  Globe,
  FileText,
  Printer,
  Eye,
  Plus,
} from 'lucide-react'
import { useUpdateEntidade } from '@/pages/base/entidades/queries/entidades-mutations'
import { useGetEntidade } from '@/pages/base/entidades/queries/entidades-queries'
import { useGetCodigosPostaisSelect } from '@/pages/base/codigospostais/queries/codigospostais-queries'
import { useGetPaisesSelect } from '@/pages/base/paises/queries/paises-queries'
import { useFormState, useFormsStore } from '@/stores/use-forms-store'
import { useWindowsStore } from '@/stores/use-windows-store'
import {
  useCurrentWindowId,
  handleWindowClose,
  updateWindowFormData,
  cleanupWindowForms,
  updateUpdateWindowTitle,
  detectUpdateFormChanges,
  openCodigoPostalCreationWindow,
  openCodigoPostalViewWindow,
  openPaisCreationWindow,
  openPaisViewWindow,
} from '@/utils/window-utils'
import { useSubmitErrorTab } from '@/hooks/use-submit-error-tab'
import { useTabManager } from '@/hooks/use-tab-manager'
import { handleApiResponse } from '@/utils/response-handlers'
import { handleApiError } from '@/utils/error-handlers'
import { toast } from '@/utils/toast-utils'
import type { ResponseApi } from '@/types/responses'
import type { GSResponse } from '@/types/api/responses'
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
  enderecoHttp: z
    .string()
    .min(1, { message: 'O endereço web é obrigatório' }),
  email: z
    .string({ message: 'O email é obrigatório' })
    .email({ message: 'Email inválido' })
    .min(1, { message: 'O email é obrigatório' }),
})

type EntidadeFormValues = z.infer<typeof entidadeFormSchema>

interface EntidadeUpdateFormProps {
  modalClose: () => void
  entidadeId: string
  initialData: {
    designacao: string
    morada: string
    localidade: string
    codigoPostalId: string
    paisId: string
    telefone: string
    fax: string
    enderecoHttp: string
    email: string
  }
}

export const EntidadeUpdateForm = ({
  modalClose,
  entidadeId,
  initialData,
}: EntidadeUpdateFormProps) => {
  const location = useLocation()
  const navigate = useNavigate()
  const windowId = useCurrentWindowId()
  const searchParams = new URLSearchParams(location.search)
  const instanceId = searchParams.get('instanceId') || 'default'
  const formId = instanceId

  const isFirstRender = useRef(true)

  const { formData, isInitialized, hasBeenVisited } = useFormState(formId)
  const { setFormState, updateFormState, resetFormState, hasFormData } =
    useFormsStore()
  const { removeWindow, updateWindowState, findWindowByPathAndInstanceId } =
    useWindowsStore()
  const setWindowHasFormData = useWindowsStore(
    (state) => state.setWindowHasFormData
  )

  const updateEntidadeMutation = useUpdateEntidade()
  const { data: entidadeData } = useGetEntidade(entidadeId)

  const { data: codigosPostaisSelect = [] } = useGetCodigosPostaisSelect()
  const { data: paisesSelect = [] } = useGetPaisesSelect()

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
    defaultValues: {
      designacao: '',
      morada: '',
      localidade: '',
      codigoPostalId: '',
      paisId: '',
      telefone: '',
      fax: '',
      enderecoHttp: '',
      email: '',
    },
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
          formData: initialData,
          isDirty: false,
          isValid: true,
          isSubmitting: false,
          hasBeenModified: false,
          windowId,
        })
      }
      isFirstRender.current = false
    }
  }, [formId, hasBeenVisited, resetFormState, hasFormData, setFormState, initialData, windowId])

  useEffect(() => {
    if (isInitialized && hasFormData(formId)) {
      form.reset(formData as EntidadeFormValues)
      if (formData?.designacao && windowId) {
        updateUpdateWindowTitle(windowId, formData.designacao, updateWindowState)
      }
    } else if (entidadeData) {
      form.reset({
        designacao: entidadeData.designacao,
        morada: entidadeData.morada,
        localidade: entidadeData.localidade,
        codigoPostalId: entidadeData.codigoPostalId,
        paisId: entidadeData.paisId,
        telefone: entidadeData.telefone,
        fax: entidadeData.fax ?? '',
        enderecoHttp: entidadeData.enderecoHttp ?? '',
        email: entidadeData.email,
      })
      if (entidadeData.designacao && windowId) {
        updateUpdateWindowTitle(
          windowId,
          entidadeData.designacao,
          updateWindowState
        )
      }
    }
  }, [
    formData,
    isInitialized,
    hasFormData,
    formId,
    entidadeData,
    form,
    windowId,
    updateWindowState,
  ])

  useEffect(() => {
    const subscription = form.watch((value) => {
      const hasChanges = detectUpdateFormChanges(value, initialData)

      if (JSON.stringify(value) !== JSON.stringify(formData)) {
        setFormState(formId, {
          formData: value as EntidadeFormValues,
          isDirty: hasChanges,
          isValid: form.formState.isValid,
          isSubmitting: form.formState.isSubmitting,
          hasBeenModified: hasChanges,
          windowId,
        })

        updateWindowFormData(windowId, hasChanges, setWindowHasFormData)
        if (value.designacao && value.designacao !== formData?.designacao) {
          updateUpdateWindowTitle(windowId, value.designacao, updateWindowState)
        }
      }
    })
    return () => subscription.unsubscribe()
  }, [
    form,
    formId,
    formData,
    setFormState,
    initialData,
    windowId,
    setWindowHasFormData,
    updateWindowState,
  ])

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
    cleanupWindowForms(windowId)
    handleWindowClose(windowId, navigate, removeWindow)
  }

  const onSubmit = async (values: EntidadeFormValues) => {
    try {
      updateFormState(formId, (state) => ({
        ...state,
        isSubmitting: true,
      }))

      const response = (await updateEntidadeMutation.mutateAsync({
        id: entidadeId,
        data: {
          Designacao: values.designacao,
          Morada: values.morada,
          Localidade: values.localidade,
          CodigoPostalId: values.codigoPostalId,
          PaisId: values.paisId,
          Telefone: values.telefone,
          Fax: values.fax,
          EnderecoHttp: values.enderecoHttp,
          Email: values.email,
        },
      })) as ResponseApi<GSResponse<string>>

      const result = handleApiResponse(
        response,
        'Entidade atualizada com sucesso',
        'Erro ao atualizar entidade',
        'Entidade atualizada com avisos'
      )

      if (result.success) {
        if (windowId) {
          removeWindow(windowId)
        }
        modalClose()
      }
    } catch (error) {
      toast.error(handleApiError(error, 'Erro ao atualizar entidade'))
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
            tabKey={`entidade-${instanceId}`}
          >
            <TabsList>
              <TabsTrigger value='dados'>Dados da Entidade</TabsTrigger>
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
                        Atualize a designação da entidade
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
              <Card className='overflow-hidden border-l-4 border-l-primary/20 transition-all duration-200 hover:border-l-primary/40 hover:shadow-md'>
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
                        Atualize a morada, localização e país
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
                          Atualize os contactos da entidade
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
            <Button
              type='button'
              variant='outline'
              onClick={handleClose}
              className='gap-2'
            >
              <FileText className='h-4 w-4' />
              Cancelar
            </Button>
            <Button
              type='submit'
              disabled={updateEntidadeMutation.isPending}
              className='gap-2'
            >
              <Printer className='h-4 w-4' />
              Guardar
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

