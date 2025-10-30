import { useEffect, useRef, useState } from 'react'
import { z } from 'zod'
import { useForm, type Resolver } from 'react-hook-form'
import { useGetConcelhosSelect } from '@/pages/base/concelhos/queries/concelhos-queries'
import { useGetDistritosSelect } from '@/pages/base/distritos/queries/distritos-queries'
import { useUpdateEntidade } from '@/pages/base/entidades/queries/entidades-mutations'
import { useGetFreguesiasSelect } from '@/pages/base/freguesias/queries/freguesias-queries'
import { useGetPaisesSelect } from '@/pages/base/paises/queries/paises-queries'
import { useGetRuasSelect } from '@/pages/base/ruas/queries/ruas-queries'
import { EntidadeContactoPayload } from '@/types/dtos/base/entidades.dtos'
import { CartaoIdentificacaoTipoLabel } from '@/types/enums/cartao-identificacao-tipo.enum'
import { ContactoTipoLabel } from '@/types/enums/contacto-tipo.enum'
import { EstadoCivilLabel } from '@/types/enums/estado-civil.enum'
import {
  User,
  Hash,
  Globe,
  MapPin,
  Building2,
  Mail,
  Phone,
  Calendar,
  Settings,
  AlertCircle,
  CreditCard,
  UserCheck,
  MessageSquare,
} from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import Flag from 'react-world-flags'
import { useFormState, useFormsStore } from '@/stores/use-forms-store'
import { useWindowsStore } from '@/stores/use-windows-store'
import { toDatabaseDate } from '@/utils/date-utils'
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
import { useSubmitErrorTab } from '@/hooks/use-submit-error-tab'
import { useTabManager } from '@/hooks/use-tab-manager'
import { Autocomplete } from '@/components/ui/autocomplete'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { DatePicker } from '@/components/ui/date-picker'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'

const validatePortugueseNif = (nif: string) => {
  if (!/^\d{9}$/.test(nif)) return false

  const checkDigit = parseInt(nif.charAt(8), 10)
  const sum = nif
    .slice(0, 8)
    .split('')
    .reduce(
      (acc: number, digit: string, i: number) =>
        acc + parseInt(digit, 10) * (9 - i),
      0
    )
  const calculatedCheckDigit = 11 - (sum % 11)

  return checkDigit === (calculatedCheckDigit > 9 ? 0 : calculatedCheckDigit)
}

const entidadeFormSchema = z
  .object({
    nome: z.string().min(1, { message: 'O nome é obrigatório' }),
    nifEstrangeiro: z.boolean().default(false),
    nif: z.string().min(1, { message: 'O NIF é obrigatório' }),
    paisId: z.string().min(1, { message: 'O país é obrigatório' }),
    distritoId: z.string().min(1, { message: 'O distrito é obrigatório' }),
    concelhoId: z.string().min(1, { message: 'O concelho é obrigatório' }),
    freguesiaId: z.string().min(1, { message: 'A freguesia é obrigatória' }),
    ruaId: z.string().min(1, { message: 'A rua é obrigatória' }),
    ruaNumeroPorta: z
      .string()
      .min(1, { message: 'O número de porta é obrigatório' }),
    ruaAndar: z.string().optional(),
    cartaoIdentificacaoTipoId: z
      .number()
      .min(1, { message: 'O tipo de cartão é obrigatório' }),
    cartaoIdentificacaoNumero: z
      .string()
      .min(1, { message: 'O número do cartão é obrigatório' }),
    cartaoIdentificacaoDataEmissao: z.date(),
    cartaoIdentificacaoDataValidade: z.date(),
    estadoCivilId: z
      .number()
      .min(1, { message: 'O estado civil é obrigatório' }),
    sexo: z.enum(['M', 'F'], { message: 'O sexo é obrigatório' }),
    ativo: z.boolean().default(true),
    historico: z.boolean().default(false),
    contactos: z
      .array(
        z.object({
          tipo: z.number(),
          valor: z.string().optional(),
        })
      )
      .default([]),
    predefinedContactoTipo: z.number().optional(),
  })
  .refine(
    (data) => {
      if (data.nifEstrangeiro) return true
      return validatePortugueseNif(data.nif)
    },
    {
      message: 'NIF inválido',
      path: ['nif'],
    }
  )
  .refine(
    (data) => {
      if (data.predefinedContactoTipo) {
        const selectedContact = data.contactos.find(
          (c) => c.tipo === data.predefinedContactoTipo
        )
        return selectedContact?.valor && selectedContact.valor.trim() !== ''
      }
      return true
    },
    {
      message: 'O contacto predefinido deve ter um valor',
      path: ['predefinedContactoTipo'],
    }
  )
  .refine(
    (data) => {
      return (
        data.cartaoIdentificacaoDataEmissao <
        data.cartaoIdentificacaoDataValidade
      )
    },
    {
      message: 'Data de emissão deve ser anterior à data de validade',
      path: ['cartaoIdentificacaoDataEmissao'],
    }
  )
  .refine(
    (data) => {
      return (
        data.cartaoIdentificacaoDataValidade >
        data.cartaoIdentificacaoDataEmissao
      )
    },
    {
      message: 'Data de validade deve ser posterior à data de emissão',
      path: ['cartaoIdentificacaoDataValidade'],
    }
  )

type EntidadeFormSchemaType = z.infer<typeof entidadeFormSchema>

interface EntidadeUpdateFormProps {
  modalClose: () => void
  entidadeId: string
  initialData: {
    nome: string
    nif: string
    nifEstrangeiro: boolean
    paisId: string
    distritoId: string
    concelhoId: string
    freguesiaId: string
    ruaId: string
    ruaNumeroPorta: string
    ruaAndar?: string
    cartaoIdentificacaoTipoId: number
    cartaoIdentificacaoNumero: string
    cartaoIdentificacaoDataEmissao: Date
    cartaoIdentificacaoDataValidade: Date
    estadoCivilId: number
    sexo: 'M' | 'F'
    ativo: boolean
    historico: boolean
    contactos: Array<{ tipo: number; valor?: string }>
    predefinedContactoTipo?: number
  }
  onSuccess?: (updatedEntidade: { id: string; nome: string }) => void
  shouldCloseWindow?: boolean
}

const EntidadeUpdateForm = ({
  modalClose,
  entidadeId,
  initialData,
  onSuccess,
  shouldCloseWindow = true,
}: EntidadeUpdateFormProps) => {
  const location = useLocation()
  const navigate = useNavigate()
  const windowId = useCurrentWindowId()
  const searchParams = new URLSearchParams(location.search)
  const instanceId = searchParams.get('instanceId') || 'default'
  const formId = `entidade-${instanceId}`

  const isFirstRender = useRef(true)

  // Location selection states
  const [selectedPaisId, setSelectedPaisId] = useState<string>(
    initialData.paisId || ''
  )
  const [selectedDistritoId, setSelectedDistritoId] = useState<string>(
    initialData.distritoId || ''
  )
  const [selectedConcelhoId, setSelectedConcelhoId] = useState<string>(
    initialData.concelhoId || ''
  )
  const [selectedFreguesiaId, setSelectedFreguesiaId] = useState<string>(
    initialData.freguesiaId || ''
  )
  const [selectedRuaId, setSelectedRuaId] = useState<string>(
    initialData.ruaId || ''
  )
  const [selectedRua, setSelectedRua] = useState<any | null>(null)

  const { formData, isInitialized, hasBeenVisited } = useFormState(formId)
  const { setFormState, updateFormState, resetFormState, hasFormData } =
    useFormsStore()
  const { removeWindow } = useWindowsStore()
  const setWindowHasFormData = useWindowsStore(
    (state) => state.setWindowHasFormData
  )
  const updateWindowState = useWindowsStore((state) => state.updateWindowState)

  const { data: ruasSelectData = [], isLoading: isLoadingRuas } =
    useGetRuasSelect()
  const { data: distritosSelectData = [], isLoading: isLoadingDistritos } =
    useGetDistritosSelect()
  const { data: concelhosSelectData = [], isLoading: isLoadingConcelhos } =
    useGetConcelhosSelect()
  const { data: freguesiasSelectData = [], isLoading: isLoadingFreguesias } =
    useGetFreguesiasSelect()
  const { data: paisesSelectData = [], isLoading: isLoadingPaises } =
    useGetPaisesSelect()
  const updateEntidadeMutation = useUpdateEntidade()

  const contactTypes = Object.entries(ContactoTipoLabel).map(
    ([key, label]) => ({
      tipo: Number(key),
      label,
      valor: '',
    })
  )

  const entidadeResolver: Resolver<EntidadeFormSchemaType> = async (values) => {
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

  const form = useForm<EntidadeFormSchemaType>({
    resolver: entidadeResolver,
    defaultValues: initialData,
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
    criteriaMode: 'all',
  })

  const { setActiveTab } = useTabManager({
    defaultTab: 'dados',
    tabKey: `entidade-${instanceId}`,
  })
  const { handleError } = useSubmitErrorTab<EntidadeFormSchemaType>({
    setActiveTab,
    fieldToTabMap: {
      default: 'dados',
      // dados
      nome: 'dados',
      nif: 'dados',
      nifEstrangeiro: 'dados',
      sexo: 'dados',
      // morada
      paisId: 'morada',
      distritoId: 'morada',
      concelhoId: 'morada',
      freguesiaId: 'morada',
      ruaId: 'morada',
      ruaNumeroPorta: 'morada',
      ruaAndar: 'morada',
      // identificacao
      cartaoIdentificacaoTipoId: 'identificacao',
      cartaoIdentificacaoNumero: 'identificacao',
      cartaoIdentificacaoDataEmissao: 'identificacao',
      cartaoIdentificacaoDataValidade: 'identificacao',
      // estado
      estadoCivilId: 'estado',
      ativo: 'estado',
      historico: 'estado',
      // contactos
      predefinedContactoTipo: 'contactos',
      contactos: 'contactos',
    },
  })

  // Initialize form state on first render
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
          windowId: windowId,
        })

        // Set initial window title
        const initialTitle = initialData.nome || 'Entidade'
        updateUpdateWindowTitle(windowId, initialTitle, updateWindowState)
      }
      isFirstRender.current = false
    }
  }, [
    formId,
    hasBeenVisited,
    resetFormState,
    hasFormData,
    initialData,
    windowId,
    updateWindowState,
  ])

  // Load saved form data if available and the form has been initialized
  useEffect(() => {
    if (isInitialized && hasFormData(formId)) {
      form.reset(formData as EntidadeFormSchemaType)
    }
  }, [formData, isInitialized, formId, hasFormData])

  // Save form data when it changes
  useEffect(() => {
    const subscription = form.watch((value) => {
      if (value) {
        const hasChanges = detectUpdateFormChanges(value, initialData)

        setFormState(formId, {
          formData: value as EntidadeFormSchemaType,
          isDirty: hasChanges,
          // Avoid accessing form.formState.isValid to prevent early resolver validation
          isValid: false,
          isSubmitting: form.formState.isSubmitting,
          hasBeenModified: hasChanges,
        })

        // Update window hasFormData flag
        updateWindowFormData(windowId, hasChanges, setWindowHasFormData)
        // Update window title based on nome field
        const newTitle = value.nome || 'Entidade'
        updateUpdateWindowTitle(windowId, newTitle, updateWindowState)
      }
    })
    return () => subscription.unsubscribe()
  }, [form, windowId, initialData, formId])

  const handleClose = () => {
    cleanupWindowForms(windowId)
    if (shouldCloseWindow) {
      handleWindowClose(windowId, navigate, removeWindow)
    } else {
      modalClose()
    }
  }

  const onSubmit = async (values: EntidadeFormSchemaType) => {
    try {
      updateFormState(formId, (state) => ({
        ...state,
        isSubmitting: true,
      }))

      // Filter out contacts with empty values and ensure they match the EntidadeContacto type
      const filteredContacts: EntidadeContactoPayload[] = values.contactos
        .filter((contact) => contact.valor && contact.valor.trim() !== '')
        .map((contact) => ({
          EntidadeContactoTipoId: contact.tipo,
          Valor: contact.valor!,
          Principal: contact.tipo === values.predefinedContactoTipo,
        }))

      const response = await updateEntidadeMutation.mutateAsync({
        id: entidadeId,
        data: {
          Nome: values.nome,
          NIF: values.nif,
          NIFEstrangeiro: values.nifEstrangeiro,
          RuaId: selectedRuaId || values.ruaId,
          RuaNumeroPorta: values.ruaNumeroPorta,
          RuaAndar: values.ruaAndar,
          CartaoIdentificacaoTipoId: values.cartaoIdentificacaoTipoId,
          CartaoIdentificacaoNumero: values.cartaoIdentificacaoNumero,
          CartaoIdentificacaoDataEmissao:
            toDatabaseDate(values.cartaoIdentificacaoDataEmissao) || new Date(),
          CartaoIdentificacaoDataValidade:
            toDatabaseDate(values.cartaoIdentificacaoDataValidade) ||
            new Date(),
          EstadoCivilId: values.estadoCivilId,
          Sexo: values.sexo,
          Ativo: values.ativo,
          Historico: values.historico,
          Contactos: filteredContacts.length > 0 ? filteredContacts : undefined,
        },
      })

      const result = handleApiResponse(
        response,
        'Entidade atualizada com sucesso',
        'Erro ao atualizar entidade',
        'Entidade atualizada com avisos'
      )

      if (result.success) {
        if (onSuccess) {
          onSuccess({ id: entidadeId, nome: values.nome })
        }
        handleClose()
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

  const isLoading =
    isLoadingRuas ||
    isLoadingDistritos ||
    isLoadingConcelhos ||
    isLoadingFreguesias ||
    isLoadingPaises ||
    updateEntidadeMutation.isPending

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
              <TabsTrigger value='dados'>Dados Pessoais</TabsTrigger>
              <TabsTrigger value='morada'>Morada</TabsTrigger>
              <TabsTrigger value='identificacao'>Identificação</TabsTrigger>
              <TabsTrigger value='estado'>Estado</TabsTrigger>
              <TabsTrigger value='contactos'>Contactos</TabsTrigger>
            </TabsList>
            <TabsContent value='dados'>
              <div className='space-y-6'>
                <Card className='overflow-hidden border-l-4 border-l-primary/20 hover:border-l-primary/40 transition-all duration-200 hover:shadow-md'>
                  <CardHeader className='pb-4'>
                    <div className='flex items-center gap-3'>
                      <div className='flex items-center justify-center w-8 h-8 rounded-md bg-primary/10 text-primary'>
                        <User className='h-4 w-4' />
                      </div>
                      <div>
                        <CardTitle className='text-base flex items-center gap-2'>
                          Dados Pessoais
                          <Badge variant='secondary' className='text-xs'>
                            Obrigatório
                          </Badge>
                        </CardTitle>
                        <p className='text-sm text-muted-foreground mt-1'>
                          Informações básicas da entidade
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className='space-y-6'>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                      <FormField
                        control={form.control}
                        name='nome'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='flex items-center gap-2'>
                              <User className='h-4 w-4' />
                              Nome
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder='Introduza o nome'
                                {...field}
                                disabled={isLoading}
                                className='px-4 py-6 shadow-inner drop-shadow-xl'
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name='sexo'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='flex items-center gap-2'>
                              <UserCheck className='h-4 w-4' />
                              Sexo
                            </FormLabel>
                            <FormControl>
                              <Select
                                value={field.value}
                                onValueChange={field.onChange}
                                disabled={isLoading}
                              >
                                <SelectTrigger className='px-4 py-6 shadow-inner drop-shadow-xl'>
                                  <SelectValue
                                    placeholder={
                                      isLoading
                                        ? 'A carregar...'
                                        : 'Selecione o sexo'
                                    }
                                  />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value='M'>Masculino</SelectItem>
                                  <SelectItem value='F'>Feminino</SelectItem>
                                  <SelectItem value='O'>Outro</SelectItem>
                                  <SelectItem value='N'>
                                    Não informado
                                  </SelectItem>
                                  <SelectItem value='I'>Indefinido</SelectItem>
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                      <FormField
                        control={form.control}
                        name='nif'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='flex items-center gap-2'>
                              <Hash className='h-4 w-4' />
                              NIF
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder='Introduza o NIF'
                                {...field}
                                disabled={isLoading}
                                className='px-4 py-6 shadow-inner drop-shadow-xl'
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name='nifEstrangeiro'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='flex items-center gap-2'>
                              <Globe className='h-4 w-4' />
                              NIF Estrangeiro
                            </FormLabel>
                            <FormControl>
                              <div className='flex flex-row items-center justify-between rounded-lg border px-4 py-3.5 bg-background'>
                                <span className='text-sm font-normal'>
                                  Marcar como estrangeiro
                                </span>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                  disabled={isLoading}
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
            </TabsContent>
            <TabsContent value='morada'>
              <div className='space-y-6'>
                <Card className='overflow-hidden border-l-4 border-l-primary/20 hover:border-l-primary/40 transition-all duration-200 hover:shadow-md'>
                  <CardHeader className='pb-4'>
                    <div className='flex items-center gap-3'>
                      <div className='flex items-center justify-center w-8 h-8 rounded-md bg-primary/10 text-primary'>
                        <MapPin className='h-4 w-4' />
                      </div>
                      <div>
                        <CardTitle className='text-base flex items-center gap-2'>
                          Morada
                          <Badge variant='secondary' className='text-xs'>
                            Obrigatório
                          </Badge>
                        </CardTitle>
                        <p className='text-sm text-muted-foreground mt-1'>
                          Informações de localização da entidade
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className='space-y-6'>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
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
                              <Select
                                value={selectedPaisId || field.value}
                                onValueChange={(value) => {
                                  setSelectedPaisId(value)
                                  field.onChange(value)
                                  // Reset dependent fields
                                  setSelectedDistritoId('')
                                  setSelectedConcelhoId('')
                                  setSelectedFreguesiaId('')
                                  setSelectedRuaId('')
                                  form.setValue('distritoId', '')
                                  form.setValue('concelhoId', '')
                                  form.setValue('freguesiaId', '')
                                  form.setValue('ruaId', '')
                                }}
                                disabled={isLoadingPaises}
                              >
                                <SelectTrigger className='px-4 py-6 shadow-inner drop-shadow-xl'>
                                  <SelectValue
                                    placeholder={
                                      isLoadingPaises
                                        ? 'A carregar...'
                                        : 'Selecione um país'
                                    }
                                  >
                                    {field.value &&
                                      paisesSelectData?.find(
                                        (p) => p.id === field.value
                                      ) && (
                                        <div className='flex items-center gap-2'>
                                          <Flag
                                            code={
                                              paisesSelectData?.find(
                                                (p) => p.id === field.value
                                              )?.codigo
                                            }
                                            height={16}
                                            width={24}
                                            fallback={<span>🏳️</span>}
                                          />
                                          {
                                            paisesSelectData?.find(
                                              (p) => p.id === field.value
                                            )?.nome
                                          }
                                        </div>
                                      )}
                                  </SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                  {paisesSelectData.map((pais) => (
                                    <SelectItem key={pais.id} value={pais.id}>
                                      <div className='flex items-center gap-2'>
                                        <Flag
                                          code={pais.codigo}
                                          height={16}
                                          width={24}
                                          fallback={<span>🏳️</span>}
                                        />
                                        {pais.nome}
                                      </div>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name='distritoId'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Distrito</FormLabel>
                            <FormControl>
                              <Autocomplete
                                options={distritosSelectData
                                  .filter(
                                    (distrito) =>
                                      distrito.paisId === selectedPaisId
                                  )
                                  .map((distrito) => ({
                                    value: distrito.id,
                                    label: distrito.nome,
                                  }))}
                                value={selectedDistritoId || field.value}
                                onValueChange={(value) => {
                                  setSelectedDistritoId(value)
                                  field.onChange(value)
                                  // Reset dependent fields
                                  setSelectedConcelhoId('')
                                  setSelectedFreguesiaId('')
                                  setSelectedRuaId('')
                                  form.setValue('concelhoId', '')
                                  form.setValue('freguesiaId', '')
                                  form.setValue('ruaId', '')
                                }}
                                placeholder={
                                  isLoadingDistritos
                                    ? 'A carregar...'
                                    : 'Selecione um distrito'
                                }
                                emptyText='Nenhum distrito encontrado.'
                                disabled={isLoadingDistritos || !selectedPaisId}
                                className='px-4 py-6 shadow-inner drop-shadow-xl'
                              />
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
                            <FormLabel>Concelho</FormLabel>
                            <FormControl>
                              <Autocomplete
                                options={concelhosSelectData
                                  .filter(
                                    (concelho) =>
                                      concelho.distritoId === selectedDistritoId
                                  )
                                  .map((concelho) => ({
                                    value: concelho.id,
                                    label: concelho.nome,
                                  }))}
                                value={selectedConcelhoId || field.value}
                                onValueChange={(value) => {
                                  setSelectedConcelhoId(value)
                                  field.onChange(value)
                                  // Reset dependent fields
                                  setSelectedFreguesiaId('')
                                  setSelectedRuaId('')
                                  form.setValue('freguesiaId', '')
                                  form.setValue('ruaId', '')
                                }}
                                placeholder={
                                  isLoadingConcelhos
                                    ? 'A carregar...'
                                    : 'Selecione um concelho'
                                }
                                emptyText='Nenhum concelho encontrado.'
                                disabled={
                                  isLoadingConcelhos || !selectedDistritoId
                                }
                                className='px-4 py-6 shadow-inner drop-shadow-xl'
                              />
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
                            <FormLabel>Freguesia</FormLabel>
                            <FormControl>
                              <Autocomplete
                                options={freguesiasSelectData
                                  .filter(
                                    (freguesia) =>
                                      freguesia.concelhoId ===
                                      selectedConcelhoId
                                  )
                                  .map((freguesia) => ({
                                    value: freguesia.id,
                                    label: freguesia.nome,
                                  }))}
                                value={selectedFreguesiaId || field.value}
                                onValueChange={(value) => {
                                  setSelectedFreguesiaId(value)
                                  field.onChange(value)
                                  // Reset dependent fields
                                  setSelectedRuaId('')
                                  form.setValue('ruaId', '')
                                }}
                                placeholder={
                                  isLoadingFreguesias
                                    ? 'A carregar...'
                                    : 'Selecione uma freguesia'
                                }
                                emptyText='Nenhuma freguesia encontrada.'
                                disabled={
                                  isLoadingFreguesias || !selectedConcelhoId
                                }
                                className='px-4 py-6 shadow-inner drop-shadow-xl'
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                      <FormField
                        control={form.control}
                        name='ruaId'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='flex items-center gap-2'>
                              <MapPin className='h-4 w-4' />
                              Rua
                            </FormLabel>
                            <FormControl>
                              <Autocomplete
                                options={ruasSelectData
                                  .filter(
                                    (rua) =>
                                      rua.freguesiaId === selectedFreguesiaId
                                  )
                                  .map((rua) => ({
                                    value: rua.id,
                                    label: rua.nome,
                                  }))}
                                value={selectedRuaId || field.value}
                                onValueChange={(value) => {
                                  setSelectedRuaId(value)
                                  field.onChange(value)
                                  const selectedRua = ruasSelectData.find(
                                    (rua) => rua.id === value
                                  )
                                  setSelectedRua(selectedRua || null)
                                }}
                                placeholder={
                                  isLoadingRuas
                                    ? 'A carregar...'
                                    : 'Selecione uma rua'
                                }
                                emptyText='Nenhuma rua encontrada.'
                                disabled={isLoadingRuas || !selectedFreguesiaId}
                                className='px-4 py-6 shadow-inner drop-shadow-xl'
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name='ruaNumeroPorta'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='flex items-center gap-2'>
                              <MapPin className='h-4 w-4' />
                              Número de Porta
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder='Introduza o número de porta'
                                {...field}
                                disabled={isLoading}
                                className='px-4 py-6 shadow-inner drop-shadow-xl'
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                      <FormField
                        control={form.control}
                        name='ruaAndar'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='flex items-center gap-2'>
                              <Building2 className='h-4 w-4' />
                              Andar
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder='Introduza o andar (opcional)'
                                {...field}
                                disabled={isLoading}
                                className='px-4 py-6 shadow-inner drop-shadow-xl'
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    {selectedRua && (
                      <div className='bg-muted/30 rounded-lg p-4'>
                        <h4 className='text-sm font-medium mb-3 flex items-center gap-2'>
                          <MapPin className='h-4 w-4' />
                          Informações do Código Postal
                        </h4>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                          <FormItem>
                            <FormLabel className='flex items-center gap-2'>
                              <MapPin className='h-4 w-4' />
                              Localidade
                            </FormLabel>
                            <FormControl>
                              <Input
                                value={
                                  selectedRua.codigoPostal?.localidade || ''
                                }
                                readOnly
                                disabled
                                className='px-4 py-6 shadow-inner drop-shadow-xl bg-muted/50'
                              />
                            </FormControl>
                          </FormItem>
                          <FormItem>
                            <FormLabel className='flex items-center gap-2'>
                              <MapPin className='h-4 w-4' />
                              Código Postal
                            </FormLabel>
                            <FormControl>
                              <Input
                                value={selectedRua.codigoPostal?.codigo || ''}
                                readOnly
                                disabled
                                className='px-4 py-6 shadow-inner drop-shadow-xl bg-muted/50'
                              />
                            </FormControl>
                          </FormItem>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value='identificacao'>
              <div className='space-y-6'>
                <Card className='overflow-hidden border-l-4 border-l-primary/20 hover:border-l-primary/40 transition-all duration-200 hover:shadow-md'>
                  <CardHeader className='pb-4'>
                    <div className='flex items-center gap-3'>
                      <div className='flex items-center justify-center w-8 h-8 rounded-md bg-primary/10 text-primary'>
                        <CreditCard className='h-4 w-4' />
                      </div>
                      <div>
                        <CardTitle className='text-base flex items-center gap-2'>
                          Documento de Identificação
                          <Badge variant='secondary' className='text-xs'>
                            Obrigatório
                          </Badge>
                        </CardTitle>
                        <p className='text-sm text-muted-foreground mt-1'>
                          Informações do documento de identificação
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className='space-y-6'>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                      <FormField
                        control={form.control}
                        name='cartaoIdentificacaoTipoId'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='flex items-center gap-2'>
                              <CreditCard className='h-4 w-4' />
                              Tipo de Cartão
                            </FormLabel>
                            <FormControl>
                              <Select
                                value={String(field.value)}
                                onValueChange={(value) =>
                                  field.onChange(Number(value))
                                }
                                disabled={isLoading}
                              >
                                <SelectTrigger className='px-4 py-6 shadow-inner drop-shadow-xl'>
                                  <SelectValue placeholder='Selecione o tipo de cartão' />
                                </SelectTrigger>
                                <SelectContent>
                                  {Object.entries(
                                    CartaoIdentificacaoTipoLabel
                                  ).map(([key, label]) => (
                                    <SelectItem key={key} value={key}>
                                      {label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name='cartaoIdentificacaoNumero'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='flex items-center gap-2'>
                              <CreditCard className='h-4 w-4' />
                              Número do Cartão
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder='Introduza o número do cartão'
                                {...field}
                                disabled={isLoading}
                                className='px-4 py-6 shadow-inner drop-shadow-xl'
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                      <FormField
                        control={form.control}
                        name='cartaoIdentificacaoDataEmissao'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='flex items-center gap-2'>
                              <Calendar className='h-4 w-4' />
                              Data de Emissão
                            </FormLabel>
                            <FormControl>
                              <DatePicker
                                value={field.value}
                                onChange={field.onChange}
                                placeholder='Selecione uma data'
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name='cartaoIdentificacaoDataValidade'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='flex items-center gap-2'>
                              <Calendar className='h-4 w-4' />
                              Data de Validade
                            </FormLabel>
                            <FormControl>
                              <DatePicker
                                value={field.value}
                                onChange={field.onChange}
                                placeholder='Selecione uma data'
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
            </TabsContent>
            <TabsContent value='estado'>
              <div className='space-y-6'>
                <Card className='overflow-hidden border-l-4 border-l-primary/20 hover:border-l-primary/40 transition-all duration-200 hover:shadow-md'>
                  <CardHeader className='pb-4'>
                    <div className='flex items-center gap-3'>
                      <div className='flex items-center justify-center w-8 h-8 rounded-md bg-primary/10 text-primary'>
                        <UserCheck className='h-4 w-4' />
                      </div>
                      <div>
                        <CardTitle className='text-base flex items-center gap-2'>
                          Estado Civil e Configurações
                          <Badge variant='secondary' className='text-xs'>
                            Obrigatório
                          </Badge>
                        </CardTitle>
                        <p className='text-sm text-muted-foreground mt-1'>
                          Estado civil e configurações da entidade
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className='space-y-6'>
                    <div className='grid grid-cols-1 gap-4'>
                      <FormField
                        control={form.control}
                        name='estadoCivilId'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='flex items-center gap-2'>
                              <UserCheck className='h-4 w-4' />
                              Estado Civil
                            </FormLabel>
                            <FormControl>
                              <Select
                                value={String(field.value)}
                                onValueChange={(value) =>
                                  field.onChange(Number(value))
                                }
                                disabled={isLoading}
                              >
                                <SelectTrigger className='px-4 py-6 shadow-inner drop-shadow-xl'>
                                  <SelectValue placeholder='Selecione o estado civil' />
                                </SelectTrigger>
                                <SelectContent>
                                  {Object.entries(EstadoCivilLabel).map(
                                    ([key, label]) => (
                                      <SelectItem key={key} value={key}>
                                        {label}
                                      </SelectItem>
                                    )
                                  )}
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className='bg-muted/30 rounded-lg p-4'>
                      <h4 className='text-sm font-medium mb-3 flex items-center gap-2'>
                        <Settings className='h-4 w-4' />
                        Configurações da Entidade
                      </h4>
                      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        <FormField
                          control={form.control}
                          name='ativo'
                          render={({ field }) => (
                            <FormItem className='flex flex-row items-center justify-between rounded-lg border p-3 bg-background'>
                              <FormLabel className='text-sm flex items-center gap-2'>
                                <div
                                  className={`w-2 h-2 rounded-full ${field.value ? 'bg-green-500' : 'bg-red-500'}`}
                                />
                                Ativo
                              </FormLabel>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                  disabled={isLoading}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name='historico'
                          render={({ field }) => (
                            <FormItem className='flex flex-row items-center justify-between rounded-lg border p-3 bg-background'>
                              <FormLabel className='text-sm flex items-center gap-2'>
                                <AlertCircle className='h-4 w-4' />
                                Histórico
                              </FormLabel>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                  disabled={isLoading}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value='contactos'>
              <div className='space-y-6'>
                <Card className='overflow-hidden border-l-4 border-l-primary/20 hover:border-l-primary/40 transition-all duration-200 hover:shadow-md'>
                  <CardHeader className='pb-4'>
                    <div className='flex items-center gap-3'>
                      <div className='flex items-center justify-center w-8 h-8 rounded-md bg-primary/10 text-primary'>
                        <MessageSquare className='h-4 w-4' />
                      </div>
                      <div>
                        <CardTitle className='text-base flex items-center gap-2'>
                          Contactos
                          <Badge variant='outline' className='text-xs'>
                            Opcional
                          </Badge>
                        </CardTitle>
                        <p className='text-sm text-muted-foreground mt-1'>
                          Informações de contacto da entidade
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className='space-y-6'>
                    <div className='space-y-4'>
                      <Table>
                        <TableBody>
                          {contactTypes.map((type, index) => (
                            <TableRow key={type.tipo}>
                              <TableCell className='align-middle'>
                                <div className='flex items-center gap-2'>
                                  {type.tipo === 1 && (
                                    <Phone className='h-4 w-4' />
                                  )}
                                  {type.tipo === 2 && (
                                    <Mail className='h-4 w-4' />
                                  )}
                                  {type.tipo === 3 && (
                                    <MessageSquare className='h-4 w-4' />
                                  )}
                                  {type.label}
                                </div>
                              </TableCell>
                              <TableCell>
                                <FormField
                                  control={form.control}
                                  name={`contactos.${index}.valor`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormControl>
                                        <Input
                                          placeholder={`Introduza o ${type.label.toLowerCase()}`}
                                          {...field}
                                          disabled={isLoading}
                                          className='px-4 py-6 shadow-inner drop-shadow-xl'
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </TableCell>
                              <TableCell className='text-center'>
                                <FormField
                                  control={form.control}
                                  name='predefinedContactoTipo'
                                  render={({ field }) => (
                                    <FormItem className='flex justify-center space-x-2'>
                                      <FormControl>
                                        <Checkbox
                                          checked={field.value === type.tipo}
                                          onCheckedChange={(checked) => {
                                            field.onChange(
                                              checked ? type.tipo : undefined
                                            )
                                          }}
                                          disabled={isLoading}
                                        />
                                      </FormControl>
                                    </FormItem>
                                  )}
                                />
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </PersistentTabs>
          <div className='flex flex-col justify-end space-y-2 pt-4 md:flex-row md:space-x-4 md:space-y-0'>
            <Button
              type='button'
              variant='outline'
              onClick={handleClose}
              className='w-full md:w-auto'
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              type='submit'
              disabled={isLoading}
              className='w-full md:w-auto'
            >
              {isLoading ? 'A atualizar...' : 'Atualizar'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

export { EntidadeUpdateForm }
