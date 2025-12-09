import { useEffect, useRef, useMemo } from 'react'
import { z } from 'zod'
import { useForm, type Resolver } from 'react-hook-form'
import { useGetCodigosPostaisSelect } from '@/pages/base/codigospostais/queries/codigospostais-queries'
import { useGetPaisesSelect } from '@/pages/base/paises/queries/paises-queries'
import { CreateFseDTO } from '@/types/dtos/base/fses.dtos'
import { Plus, MapPin, User, Eye, Building, Phone, Mail, Globe } from 'lucide-react'
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
  openCodigoPostalCreationWindow,
  openCodigoPostalViewWindow,
  openPaisViewWindow,
  openPaisCreationWindow,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useCreateFse } from '../../queries/fses-mutations'

const fseFormSchema = z.object({
  nome: z
    .string({ message: 'O Nome é obrigatório' })
    .min(1, { message: 'O Nome é obrigatório' }),
  numContribuinte: z
    .string({ message: 'O Número de Contribuinte é obrigatório' })
    .min(1, { message: 'O Número de Contribuinte é obrigatório' }),
  telefone: z
    .string({ message: 'O Telefone é obrigatório' })
    .min(1, { message: 'O Telefone é obrigatório' }),
  morada: z.string().optional().default(''),
  codigoPostalId: z.string().optional().default(''),
  paisId: z.string().optional().default(''),
  contacto: z.string().optional().default(''),
  fax: z.string().optional().default(''),
  email: z.string().optional().default(''),
  enderecoHttp: z.string().optional().default(''),
  origem: z.string().optional().default(''),
})

type FseFormSchemaType = z.infer<typeof fseFormSchema>

interface FseCreateFormProps {
  modalClose: () => void
  onSuccess?: (newFse: { id: string; nome: string }) => void
  shouldCloseWindow?: boolean
}

const FseCreateForm = ({
  modalClose,
  onSuccess,
  shouldCloseWindow = true,
}: FseCreateFormProps) => {
  const location = useLocation()
  const navigate = useNavigate()
  const windowId = useCurrentWindowId()
  const searchParams = new URLSearchParams(location.search)
  const instanceId = searchParams.get('instanceId') || 'default'
  const formId = `fse-${instanceId}`

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
    tabKey: `fse-${instanceId}`,
  })
  const { handleError } = useSubmitErrorTab<FseFormSchemaType>({
    setActiveTab,
    fieldToTabMap: {
      default: 'identificacao',
      nome: 'identificacao',
      numContribuinte: 'identificacao',
      telefone: 'identificacao',
      morada: 'localizacao',
      codigoPostalId: 'localizacao',
      paisId: 'localizacao',
      contacto: 'contactos',
      fax: 'contactos',
      email: 'contactos',
      enderecoHttp: 'contactos',
      origem: 'identificacao',
    },
  })

  const createFseMutation = useCreateFse()

  const {
    data: codigosPostaisData = [],
    isLoading: isLoadingCodigosPostais,
    refetch: refetchCodigosPostais,
  } = useGetCodigosPostaisSelect()

  const {
    data: paisesData = [],
    isLoading: isLoadingPaises,
    refetch: refetchPaises,
  } = useGetPaisesSelect()

  const defaultValues = useMemo(
    () => ({
      nome: '',
      numContribuinte: '',
      telefone: '',
      morada: '',
      codigoPostalId: '',
      paisId: '',
      contacto: '',
      fax: '',
      email: '',
      enderecoHttp: '',
      origem: '',
    }),
    []
  )

  const fseResolver: Resolver<FseFormSchemaType> = async (values) => {
    const result = fseFormSchema.safeParse(values)
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

  const form = useForm<FseFormSchemaType>({
    resolver: fseResolver,
    defaultValues,
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
    criteriaMode: 'all',
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
  }, [formId, hasBeenVisited, resetFormState, hasFormData])

  useEffect(() => {
    if (isInitialized && hasFormData(formId)) {
      form.reset(formData as FseFormSchemaType)
    }
  }, [formData, isInitialized, formId, hasFormData])

  useEffect(() => {
    const subscription = form.watch((value) => {
      const hasChanges = detectFormChanges(value, defaultValues)

      if (JSON.stringify(value) !== JSON.stringify(formData)) {
        setFormState(formId, {
          formData: value as FseFormSchemaType,
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
          if (value.nome && value.nome !== formData?.nome) {
            updateCreateWindowTitle(
              effectiveWindowId,
              value.nome || 'Novo Fornecedor Serviços Externos',
              updateWindowState
            )
          }
        }
      }
    })
    return () => subscription.unsubscribe()
  }, [form, effectiveWindowId, formId, formData, defaultValues])

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
    returnDataKey: `return-data-${effectiveWindowId}-codigopostal`,
  })

  useAutoSelectionWithReturnData({
    windowId: effectiveWindowId,
    instanceId,
    data: paisesData,
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

  const onSubmit = async (values: FseFormSchemaType) => {
    try {
      updateFormState(formId, (state) => ({
        ...state,
        isSubmitting: true,
      }))

      const requestData: CreateFseDTO = {
        nome: values.nome,
        numContribuinte: values.numContribuinte,
        telefone: values.telefone,
        morada: values.morada || null,
        codigoPostalId: values.codigoPostalId || null,
        paisId: values.paisId || null,
        contacto: values.contacto || null,
        fax: values.fax || null,
        email: values.email || null,
        enderecoHttp: values.enderecoHttp || null,
        origem: values.origem || null,
      }

      const response = await createFseMutation.mutateAsync(requestData)
      const result = handleApiResponse(
        response,
        'Fornecedor Serviços Externos criado com sucesso',
        'Erro ao criar fornecedor serviços externos',
        'Fornecedor Serviços Externos criado com avisos'
      )

      if (result.success) {
        if (effectiveWindowId) {
          setEntityReturnDataWithToastSuppression(
            effectiveWindowId,
            { id: result.data as string, nome: values.nome },
            'fse',
            setWindowReturnData,
            parentWindowIdFromStorage || undefined,
            instanceId
          )

          setTimeout(() => {
            if (parentWindowIdFromStorage) {
              sessionStorage.removeItem(`parent-window-${instanceId}`)
            }
          }, 2000)
        }

        if (onSuccess) {
          onSuccess({
            id: result.data as string,
            nome: values.nome,
          })
        }
        if (effectiveWindowId && shouldCloseWindow) {
          removeWindow(effectiveWindowId)
        }
        modalClose()
      }
    } catch (error) {
      toast.error(handleApiError(error, 'Erro ao criar fornecedor serviços externos'))
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
          id='fseCreateForm'
          onSubmit={form.handleSubmit(onSubmit, handleError)}
          className='space-y-4'
          autoComplete='off'
        >
          <PersistentTabs
            defaultValue='identificacao'
            className='w-full'
            tabKey={`fse-${instanceId}`}
          >
            <PersistentTabsList>
              <PersistentTabsTrigger value='identificacao'>
                <Building className='h-4 w-4 mr-2' />
                Identificação
              </PersistentTabsTrigger>
              <PersistentTabsTrigger value='localizacao'>
                <MapPin className='h-4 w-4 mr-2' />
                Localização
              </PersistentTabsTrigger>
              <PersistentTabsTrigger value='contactos'>
                <Phone className='h-4 w-4 mr-2' />
                Contactos
              </PersistentTabsTrigger>
            </PersistentTabsList>

            {/* TAB 1: IDENTIFICAÇÃO */}
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
                          Identificação do Fornecedor Serviços Externos
                        </CardTitle>
                        <p className='text-sm text-muted-foreground mt-1'>
                          Informações básicas do fornecedor serviços externos
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className='space-y-6'>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-3 items-start'>
                      <FormField
                        control={form.control}
                        name='nome'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='flex items-center gap-2'>
                              <Building className='h-4 w-4' />
                              Nome
                              <Badge variant='secondary' className='text-xs'>
                                Obrigatório
                              </Badge>
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder='Digite o nome do fornecedor serviços externos'
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
                        name='numContribuinte'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='flex items-center gap-2'>
                              NIF
                              <Badge variant='secondary' className='text-xs'>
                                Obrigatório
                              </Badge>
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder='Digite o NIF'
                                {...field}
                                className='px-4 py-6 shadow-inner drop-shadow-xl'
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                      <FormField
                        control={form.control}
                        name='telefone'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='flex items-center gap-2'>
                              <Phone className='h-4 w-4' />
                              Telefone
                              <Badge variant='secondary' className='text-xs'>
                                Obrigatório
                              </Badge>
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder='Digite o telefone'
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
                        name='origem'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='flex items-center gap-2'>
                              <MapPin className='h-4 w-4' />
                              Origem
                            </FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className='px-4 py-6 shadow-inner drop-shadow-xl'>
                                  <SelectValue placeholder='Selecione a origem' />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value='Nacional'>Nacional</SelectItem>
                                <SelectItem value='Internacional'>Internacional</SelectItem>
                                <SelectItem value='Intercomunitário'>Intercomunitário</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </PersistentTabsContent>

            {/* TAB 2: LOCALIZAÇÃO */}
            <PersistentTabsContent value='localizacao'>
              <div className='space-y-6'>
                <Card className='overflow-hidden border-l-4 border-l-primary/20 hover:border-l-primary/40 transition-all duration-200 hover:shadow-md'>
                  <CardHeader className='pb-4'>
                    <div className='flex items-center gap-3'>
                      <div className='flex items-center justify-center w-8 h-8 rounded-md bg-primary/10 text-primary'>
                        <MapPin className='h-4 w-4' />
                      </div>
                      <div>
                        <CardTitle className='text-base flex items-center gap-2'>
                          Localização
                        </CardTitle>
                        <p className='text-sm text-muted-foreground mt-1'>
                          Informações de localização (opcional)
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className='space-y-6'>
                    <FormField
                      control={form.control}
                      name='morada'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Morada</FormLabel>
                          <FormControl>
                            <Input
                              placeholder='Digite a morada'
                              {...field}
                              className='px-4 py-6 shadow-inner drop-shadow-xl'
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                      <FormField
                        control={form.control}
                        name='codigoPostalId'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Código Postal</FormLabel>
                            <FormControl>
                              <div className='relative'>
                                <Autocomplete
                                  options={codigosPostaisData.map((item) => ({
                                    label: `${item.codigo} - ${item.localidade}`,
                                    value: item.id,
                                  }))}
                                  value={field.value}
                                  onValueChange={field.onChange}
                                  placeholder='Selecione o código postal'
                                  emptyText='Nenhum código postal encontrado.'
                                  disabled={isLoadingCodigosPostais}
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
                                  options={paisesData.map((item) => ({
                                    label: item.nome,
                                    value: item.id,
                                  }))}
                                  value={field.value}
                                  onValueChange={field.onChange}
                                  placeholder='Selecione o país'
                                  emptyText='Nenhum país encontrado.'
                                  disabled={isLoadingPaises}
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
              </div>
            </PersistentTabsContent>

            {/* TAB 3: CONTACTOS */}
            <PersistentTabsContent value='contactos'>
              <div className='space-y-6'>
                <Card className='overflow-hidden border-l-4 border-l-primary/20 hover:border-l-primary/40 transition-all duration-200 hover:shadow-md'>
                  <CardHeader className='pb-4'>
                    <div className='flex items-center gap-3'>
                      <div className='flex items-center justify-center w-8 h-8 rounded-md bg-primary/10 text-primary'>
                        <Phone className='h-4 w-4' />
                      </div>
                      <div>
                        <CardTitle className='text-base flex items-center gap-2'>
                          Dados de Contacto
                        </CardTitle>
                        <p className='text-sm text-muted-foreground mt-1'>
                          Informações de contacto adicionais (opcional)
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className='space-y-6'>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                      <FormField
                        control={form.control}
                        name='contacto'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Contacto</FormLabel>
                            <FormControl>
                              <Input
                                placeholder='Digite o contacto'
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
                            <FormLabel>Fax</FormLabel>
                            <FormControl>
                              <Input
                                placeholder='Digite o fax'
                                {...field}
                                className='px-4 py-6 shadow-inner drop-shadow-xl'
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
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
                                placeholder='email@exemplo.com'
                                type='email'
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
                              Endereço Web
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder='https://www.exemplo.com'
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
          </PersistentTabs>

          <div className='flex items-center justify-end gap-3 pt-4 border-t'>
            <Button type='button' variant='outline' onClick={handleClose}>
              Cancelar
            </Button>
            <Button
              type='submit'
              form='fseCreateForm'
              disabled={createFseMutation.isPending}
            >
              {createFseMutation.isPending ? 'A criar...' : 'Criar'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

export default FseCreateForm

