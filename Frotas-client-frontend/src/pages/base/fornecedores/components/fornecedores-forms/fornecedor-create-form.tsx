import { useEffect, useRef } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { type Resolver } from 'react-hook-form'
import { useGetCodigosPostaisSelect } from '@/pages/base/codigospostais/queries/codigospostais-queries'
import { useGetPaisesSelect } from '@/pages/base/paises/queries/paises-queries'
import { CreateFornecedorDTO } from '@/types/dtos/base/fornecedores.dtos'
import { Plus, MapPin, User, AlertCircle, Settings, Eye, Building, Phone, Mail } from 'lucide-react'
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
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useCreateFornecedor } from '../../queries/fornecedores-mutations'

const fornecedorFormSchema = z.object({
  nome: z
    .string({ message: 'O Nome é obrigatório' })
    .min(1, { message: 'O Nome é obrigatório' }),
  numContribuinte: z
    .string({ message: 'O Número de Contribuinte é obrigatório' })
    .min(1, { message: 'O Número de Contribuinte é obrigatório' }),
  origem: z
    .string({ message: 'A Origem é obrigatória' })
    .min(1, { message: 'A Origem é obrigatória' }),
  ativo: z.boolean().default(true),
  contacto: z.string().default(''),
  telefone: z.string().default(''),
  telemovel: z.string().default(''),
  fax: z.string().default(''),
  email: z.string().default(''),
  url: z.string().default(''),
  moradaEscritorio: z
    .string({ message: 'A Morada do Escritório é obrigatória' })
    .min(1, { message: 'A Morada do Escritório é obrigatória' }),
  codigoPostalEscritorioId: z
    .string({ message: 'O Código Postal do Escritório é obrigatório' })
    .min(1, { message: 'O Código Postal do Escritório é obrigatório' }),
  paisEscritorioId: z
    .string({ message: 'O País do Escritório é obrigatório' })
    .min(1, { message: 'O País do Escritório é obrigatório' }),
  moradaCarga: z
    .string({ message: 'A Morada de Carga é obrigatória' })
    .min(1, { message: 'A Morada de Carga é obrigatória' }),
  codigoPostalCargaId: z
    .string({ message: 'O Código Postal de Carga é obrigatório' })
    .min(1, { message: 'O Código Postal de Carga é obrigatório' }),
  paisCargaId: z
    .string({ message: 'O País de Carga é obrigatório' })
    .min(1, { message: 'O País de Carga é obrigatório' }),
  mesmoEndereco: z.boolean().default(false),
})

type FornecedorFormSchemaType = z.infer<typeof fornecedorFormSchema>

interface FornecedorCreateFormProps {
  modalClose: () => void
  onSuccess?: (newFornecedor: { id: string; nome: string }) => void
  shouldCloseWindow?: boolean
}

const FornecedorCreateForm = ({
  modalClose,
  onSuccess,
  shouldCloseWindow = true,
}: FornecedorCreateFormProps) => {
  const location = useLocation()
  const navigate = useNavigate()
  const windowId = useCurrentWindowId()
  const searchParams = new URLSearchParams(location.search)
  const instanceId = searchParams.get('instanceId') || 'default'
  const formId = `fornecedor-${instanceId}`

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
    tabKey: `fornecedor-${instanceId}`,
  })
  const { handleError } = useSubmitErrorTab<FornecedorFormSchemaType>({
    setActiveTab,
    fieldToTabMap: {
      default: 'identificacao',
      nome: 'identificacao',
      numContribuinte: 'identificacao',
      origem: 'identificacao',
      ativo: 'identificacao',
      contacto: 'dados',
      telefone: 'dados',
      telemovel: 'dados',
      fax: 'dados',
      email: 'dados',
      url: 'dados',
      moradaEscritorio: 'moradas',
      codigoPostalEscritorioId: 'moradas',
      paisEscritorioId: 'moradas',
      moradaCarga: 'moradas',
      codigoPostalCargaId: 'moradas',
      paisCargaId: 'moradas',
      mesmoEndereco: 'moradas',
    },
  })

  const createFornecedorMutation = useCreateFornecedor()

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

  const defaultValues = {
    nome: '',
    numContribuinte: '',
    origem: 'Nacional',
    ativo: true,
    contacto: '',
    telefone: '',
    telemovel: '',
    fax: '',
    email: '',
    url: '',
    moradaEscritorio: '',
    codigoPostalEscritorioId: '',
    paisEscritorioId: '',
    moradaCarga: '',
    codigoPostalCargaId: '',
    paisCargaId: '',
    mesmoEndereco: false,
  }

  const fornecedorResolver: Resolver<FornecedorFormSchemaType> = async (values) => {
    const result = fornecedorFormSchema.safeParse(values)
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

  const form = useForm<FornecedorFormSchemaType>({
    resolver: fornecedorResolver,
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
      form.reset(formData as FornecedorFormSchemaType)
    }
  }, [formData, isInitialized, formId, hasFormData])

  useEffect(() => {
    const subscription = form.watch((value) => {
      const hasChanges = detectFormChanges(value, defaultValues)

      if (JSON.stringify(value) !== JSON.stringify(formData)) {
        setFormState(formId, {
          formData: value as FornecedorFormSchemaType,
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
              value.nome || 'Novo Fornecedor',
              updateWindowState
            )
          }
        }
      }
    })
    return () => subscription.unsubscribe()
  }, [form, effectiveWindowId, formId, formData, defaultValues])

  // Auto-populate carga address when mesmoEndereco is checked
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'mesmoEndereco' && value.mesmoEndereco) {
        form.setValue('moradaCarga', value.moradaEscritorio || '')
        form.setValue('codigoPostalCargaId', value.codigoPostalEscritorioId || '')
        form.setValue('paisCargaId', value.paisEscritorioId || '')
      }
    })
    return () => subscription.unsubscribe()
  }, [form])

  useAutoSelectionWithReturnData({
    windowId: effectiveWindowId,
    instanceId,
    data: codigosPostaisData,
    setValue: (value: string) => form.setValue('codigoPostalEscritorioId', value),
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
    setValue: (value: string) => form.setValue('paisEscritorioId', value),
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

  const handleCreateCodigoPostalEscritorio = () => {
    openCodigoPostalCreationWindow(
      navigate,
      effectiveWindowId,
      updateWindowState,
      findWindowByPathAndInstanceId
    )
  }

  const handleViewCodigoPostalEscritorio = () => {
    const codigoPostalId = form.getValues('codigoPostalEscritorioId')
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

  const handleCreateCodigoPostalCarga = () => {
    openCodigoPostalCreationWindow(
      navigate,
      effectiveWindowId,
      updateWindowState,
      findWindowByPathAndInstanceId
    )
  }

  const handleViewCodigoPostalCarga = () => {
    const codigoPostalId = form.getValues('codigoPostalCargaId')
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

  const handleCreatePaisEscritorio = () => {
    openPaisCreationWindow(
      navigate,
      effectiveWindowId,
      updateWindowState,
      findWindowByPathAndInstanceId
    )
  }

  const handleViewPaisEscritorio = () => {
    const paisId = form.getValues('paisEscritorioId')
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

  const handleCreatePaisCarga = () => {
    openPaisCreationWindow(
      navigate,
      effectiveWindowId,
      updateWindowState,
      findWindowByPathAndInstanceId
    )
  }

  const handleViewPaisCarga = () => {
    const paisId = form.getValues('paisCargaId')
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

  const onSubmit = async (values: FornecedorFormSchemaType) => {
    try {
      updateFormState(formId, (state) => ({
        ...state,
        isSubmitting: true,
      }))

      const requestData: CreateFornecedorDTO = {
        nome: values.nome,
        numContribuinte: values.numContribuinte,
        origem: values.origem,
        ativo: values.ativo,
        contacto: values.contacto,
        telefone: values.telefone,
        telemovel: values.telemovel,
        fax: values.fax,
        email: values.email,
        url: values.url,
        moradaEscritorio: values.moradaEscritorio,
        codigoPostalEscritorioId: values.codigoPostalEscritorioId,
        paisEscritorioId: values.paisEscritorioId,
        moradaCarga: values.moradaCarga,
        codigoPostalCargaId: values.codigoPostalCargaId,
        paisCargaId: values.paisCargaId,
        mesmoEndereco: values.mesmoEndereco,
      }

      const response = await createFornecedorMutation.mutateAsync(requestData)
      const result = handleApiResponse(
        response,
        'Fornecedor criado com sucesso',
        'Erro ao criar fornecedor',
        'Fornecedor criado com avisos'
      )

      if (result.success) {
        if (effectiveWindowId) {
          setEntityReturnDataWithToastSuppression(
            effectiveWindowId,
            { id: result.data as string, nome: values.nome },
            'fornecedor',
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
      toast.error(handleApiError(error, 'Erro ao criar fornecedor'))
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
          id='fornecedorCreateForm'
          onSubmit={form.handleSubmit(onSubmit, handleError)}
          className='space-y-4'
          autoComplete='off'
        >
          <PersistentTabs
            defaultValue='identificacao'
            className='w-full'
            tabKey={`fornecedor-${instanceId}`}
          >
            <PersistentTabsList>
              <PersistentTabsTrigger value='identificacao'>
                <Building className='h-4 w-4 mr-2' />
                Identificação
              </PersistentTabsTrigger>
              <PersistentTabsTrigger value='dados'>
                <Phone className='h-4 w-4 mr-2' />
                Dados Fornecedor
              </PersistentTabsTrigger>
              <PersistentTabsTrigger value='moradas'>
                <MapPin className='h-4 w-4 mr-2' />
                Moradas
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
                          Identificação do Fornecedor
                          <Badge variant='secondary' className='text-xs'>
                            Obrigatório
                          </Badge>
                        </CardTitle>
                        <p className='text-sm text-muted-foreground mt-1'>
                          Informações básicas do fornecedor
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
                                placeholder='Digite o nome do fornecedor'
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
                              <AlertCircle className='h-4 w-4' />
                              Número de Contribuinte
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
                        name='origem'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='flex items-center gap-2'>
                              <MapPin className='h-4 w-4' />
                              Origem
                              <Badge variant='secondary' className='text-xs'>
                                Obrigatório
                              </Badge>
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
                      <FormField
                        control={form.control}
                        name='ativo'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='flex items-center gap-2'>
                              Estado
                              <Badge variant='secondary' className='text-xs opacity-0 pointer-events-none'>
                                Obrigatório
                              </Badge>
                            </FormLabel>
                            <FormControl>
                              <div className='w-full rounded-lg border border-input bg-background px-4 py-3.5 shadow-inner drop-shadow-xl flex items-center justify-between'>
                                <div className='flex items-center gap-2'>
                                  <div
                                    className={`w-2 h-2 rounded-full ${field.value ? 'bg-green-500' : 'bg-red-500'}`}
                                  />
                                  <span className='text-sm text-muted-foreground'>Ativo</span>
                                </div>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                  disabled={createFornecedorMutation.isPending}
                                />
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

            {/* TAB 2: DADOS FORNECEDOR */}
            <PersistentTabsContent value='dados'>
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
                          Informações de contacto do fornecedor
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
                            <FormLabel className='flex items-center gap-2'>
                              <User className='h-4 w-4' />
                              Contacto
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder='Nome do contacto'
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
                                placeholder='Telefone'
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
                        name='telemovel'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='flex items-center gap-2'>
                              <Phone className='h-4 w-4' />
                              Telemóvel
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder='Telemóvel'
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
                              <Phone className='h-4 w-4' />
                              Fax
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder='Fax'
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
                                type='email'
                                placeholder='email@exemplo.com'
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
                        name='url'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='flex items-center gap-2'>
                              <Settings className='h-4 w-4' />
                              Website
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

            {/* TAB 3: MORADAS */}
            <PersistentTabsContent value='moradas'>
              <div className='space-y-3'>
                {/* Grid com as duas moradas lado a lado */}
                <div className='grid grid-cols-1 lg:grid-cols-2 gap-3 pt-4'>
                  {/* Morada Escritório */}
                  <Card className='overflow-hidden border-l-4 border-l-primary/20 hover:border-l-primary/40 transition-all duration-200 hover:shadow-md'>
                    <CardHeader className='pb-3 pt-3'>
                      <div className='flex items-center gap-2'>
                        <div className='flex items-center justify-center w-6 h-6 rounded-md bg-primary/10 text-primary'>
                          <Building className='h-3 w-3' />
                        </div>
                        <CardTitle className='text-sm flex items-center gap-2'>
                          Morada do Escritório
                          <Badge variant='secondary' className='text-xs'>
                            Obrigatório
                          </Badge>
                        </CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className='space-y-3 pb-4 pt-3'>
                      <FormField
                        control={form.control}
                        name='moradaEscritorio'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='flex items-center gap-2'>
                              <MapPin className='h-4 w-4' />
                              Morada
                            </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder='Digite a morada do escritório'
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
                        name='codigoPostalEscritorioId'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='flex items-center gap-2'>
                              <MapPin className='h-4 w-4' />
                              Código Postal
                            </FormLabel>
                            <FormControl>
                              <div className='relative'>
                                <Autocomplete
                                  options={codigosPostaisData.map((codigo) => ({
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
                                  className='px-4 py-5 pr-32 shadow-inner drop-shadow-xl'
                                />
                                <div className='absolute right-12 top-1/2 -translate-y-1/2 flex gap-1'>
                                  <Button
                                    type='button'
                                    variant='outline'
                                    size='sm'
                                    onClick={handleViewCodigoPostalEscritorio}
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
                                    onClick={handleCreateCodigoPostalEscritorio}
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
                        name='paisEscritorioId'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='flex items-center gap-2'>
                              <MapPin className='h-4 w-4' />
                              País
                            </FormLabel>
                            <FormControl>
                              <div className='relative'>
                                <Autocomplete
                                  options={paisesData.map((pais) => ({
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
                                  className='px-4 py-5 pr-32 shadow-inner drop-shadow-xl'
                                />
                                <div className='absolute right-12 top-1/2 -translate-y-1/2 flex gap-1'>
                                  <Button
                                    type='button'
                                    variant='outline'
                                    size='sm'
                                    onClick={handleViewPaisEscritorio}
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
                                    onClick={handleCreatePaisEscritorio}
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

                      {/* Checkbox Mesmo Endereço - Compacto */}
                      <div className='pt-2 border-t border-dashed'>
                        <FormField
                          control={form.control}
                          name='mesmoEndereco'
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <div className='flex flex-row items-center justify-between rounded-md border p-2.5'>
                                  <div className='flex items-center gap-2'>
                                    <Settings className='h-3.5 w-3.5 text-muted-foreground' />
                                    <div className='text-xs text-muted-foreground'>
                                      Usar esta morada também para carga
                                    </div>
                                  </div>
                                  <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </div>
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Morada Carga */}
                  <Card className='overflow-hidden border-l-4 border-l-primary/20 hover:border-l-primary/40 transition-all duration-200 hover:shadow-md'>
                    <CardHeader className='pb-3 pt-3'>
                      <div className='flex items-center gap-2'>
                        <div className='flex items-center justify-center w-6 h-6 rounded-md bg-primary/10 text-primary'>
                          <MapPin className='h-3 w-3' />
                        </div>
                        <CardTitle className='text-sm flex items-center gap-2'>
                          Morada de Carga
                          <Badge variant='secondary' className='text-xs'>
                            Obrigatório
                          </Badge>
                        </CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className='space-y-3 pb-4 pt-3'>
                      <FormField
                        control={form.control}
                        name='moradaCarga'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='flex items-center gap-2'>
                              <MapPin className='h-4 w-4' />
                              Morada
                            </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder='Digite a morada de carga'
                                  {...field}
                                  className='px-4 py-5 shadow-inner drop-shadow-xl'
                                  disabled={form.watch('mesmoEndereco')}
                                />
                              </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name='codigoPostalCargaId'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='flex items-center gap-2'>
                              <MapPin className='h-4 w-4' />
                              Código Postal
                            </FormLabel>
                            <FormControl>
                              <div className='relative'>
                                <Autocomplete
                                  options={codigosPostaisData.map((codigo) => ({
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
                                  disabled={isLoadingCodigosPostais || form.watch('mesmoEndereco')}
                                  className='px-4 py-5 pr-32 shadow-inner drop-shadow-xl'
                                />
                                <div className='absolute right-12 top-1/2 -translate-y-1/2 flex gap-1'>
                                  <Button
                                    type='button'
                                    variant='outline'
                                    size='sm'
                                    onClick={handleViewCodigoPostalCarga}
                                    className='h-8 w-8 p-0'
                                    title='Ver Código Postal'
                                    disabled={!field.value || form.watch('mesmoEndereco')}
                                  >
                                    <Eye className='h-4 w-4' />
                                  </Button>
                                  <Button
                                    type='button'
                                    variant='outline'
                                    size='sm'
                                    onClick={handleCreateCodigoPostalCarga}
                                    className='h-8 w-8 p-0'
                                    title='Criar Novo Código Postal'
                                    disabled={form.watch('mesmoEndereco')}
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
                        name='paisCargaId'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='flex items-center gap-2'>
                              <MapPin className='h-4 w-4' />
                              País
                            </FormLabel>
                            <FormControl>
                              <div className='relative'>
                                <Autocomplete
                                  options={paisesData.map((pais) => ({
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
                                  disabled={isLoadingPaises || form.watch('mesmoEndereco')}
                                  className='px-4 py-5 pr-32 shadow-inner drop-shadow-xl'
                                />
                                <div className='absolute right-12 top-1/2 -translate-y-1/2 flex gap-1'>
                                  <Button
                                    type='button'
                                    variant='outline'
                                    size='sm'
                                    onClick={handleViewPaisCarga}
                                    className='h-8 w-8 p-0'
                                    title='Ver País'
                                    disabled={!field.value || form.watch('mesmoEndereco')}
                                  >
                                    <Eye className='h-4 w-4' />
                                  </Button>
                                  <Button
                                    type='button'
                                    variant='outline'
                                    size='sm'
                                    onClick={handleCreatePaisCarga}
                                    className='h-8 w-8 p-0'
                                    title='Criar Novo País'
                                    disabled={form.watch('mesmoEndereco')}
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
                </div>
              </div>
            </PersistentTabsContent>
          </PersistentTabs>

          <div className='flex justify-end gap-3 pt-4 border-t'>
            <Button
              type='button'
              variant='outline'
              onClick={handleClose}
              disabled={form.formState.isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              type='submit'
              disabled={form.formState.isSubmitting}
              className='min-w-[120px]'
            >
              {form.formState.isSubmitting ? 'A guardar...' : 'Guardar'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

export default FornecedorCreateForm

