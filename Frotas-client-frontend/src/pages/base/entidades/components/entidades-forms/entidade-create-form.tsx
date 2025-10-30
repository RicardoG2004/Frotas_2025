import { useEffect, useRef, useState, useMemo } from 'react'
import React from 'react'
import { z } from 'zod'
import { useForm, type Resolver } from 'react-hook-form'
import { CodigoPostalCreateFormModal } from '@/pages/base/codigospostais/components/codigospostais-forms/codigopostal-create-form-modal'
import { useCreateConcelho } from '@/pages/base/concelhos/queries/concelhos-mutations'
import { useGetConcelhosSelect } from '@/pages/base/concelhos/queries/concelhos-queries'
import { useCreateDistrito } from '@/pages/base/distritos/queries/distritos-mutations'
import { useGetDistritosSelect } from '@/pages/base/distritos/queries/distritos-queries'
import { useCreateEntidade } from '@/pages/base/entidades/queries/entidades-mutations'
import { useCreateFreguesia } from '@/pages/base/freguesias/queries/freguesias-mutations'
import { useGetFreguesiasSelect } from '@/pages/base/freguesias/queries/freguesias-queries'
import { useGetPaisesSelect } from '@/pages/base/paises/queries/paises-queries'
import { useCreateRua } from '@/pages/base/ruas/queries/ruas-mutations'
import { useGetRuasSelect } from '@/pages/base/ruas/queries/ruas-queries'
import { CreateEntidadeDTO } from '@/types/dtos/base/entidades.dtos'
import {
  CartaoIdentificacaoTipo,
  CartaoIdentificacaoTipoLabel,
} from '@/types/enums/cartao-identificacao-tipo.enum'
import { ContactoTipoLabel } from '@/types/enums/contacto-tipo.enum'
import { EstadoCivil, EstadoCivilLabel } from '@/types/enums/estado-civil.enum'
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
  updateCreateFormData,
  cleanupWindowForms,
  updateCreateWindowTitle,
  setEntityReturnDataWithToastSuppression,
  detectFormChanges,
} from '@/utils/window-utils'
import { useSubmitErrorTab } from '@/hooks/use-submit-error-tab'
import { useTabManager } from '@/hooks/use-tab-manager'
import { Autocomplete } from '@/components/ui/autocomplete'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { DatePicker } from '@/components/ui/date-picker'
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
      // If a predefined contact is selected, ensure it has a value
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

interface CreateLocationData {
  nome: string
  isOpen: boolean
}

interface EntidadeCreateFormProps {
  modalClose: () => void
  onSuccess?: (newEntidade: { id: string; nome: string }) => void
  shouldCloseWindow?: boolean
}

const EntidadeCreateForm = ({
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

  // Get parent window ID from sessionStorage as fallback
  const parentWindowIdFromStorage = sessionStorage.getItem(
    `parent-window-${instanceId}`
  )

  // Try alternative lookup methods if the primary one fails
  let alternativeParentWindowId = null
  if (!parentWindowIdFromStorage) {
    // Try to find any parent-window key that might be related
    const allParentWindowKeys = Object.keys(sessionStorage).filter((key) =>
      key.startsWith('parent-window-')
    )

    // If we have multiple keys, try to find the most recent one or one that matches our instanceId pattern
    for (const key of allParentWindowKeys) {
      const value = sessionStorage.getItem(key)
      if (value && value !== 'null' && value !== 'undefined') {
        alternativeParentWindowId = value
        break
      }
    }
  }

  const finalParentWindowId =
    parentWindowIdFromStorage || alternativeParentWindowId

  const effectiveWindowId = windowId || instanceId

  const isFirstRender = useRef(true)

  // Location selection states
  const [selectedDistritoId, setSelectedDistritoId] = useState<string>('')
  const [selectedConcelhoId, setSelectedConcelhoId] = useState<string>('')
  const [selectedFreguesiaId, setSelectedFreguesiaId] = useState<string>('')
  const [selectedRuaId, setSelectedRuaId] = useState<string>('')

  // Creation modal states
  const [createDistritoData, setCreateDistritoData] =
    useState<CreateLocationData>({
      nome: '',
      isOpen: false,
    })
  const [createConcelhoData, setCreateConcelhoData] =
    useState<CreateLocationData>({
      nome: '',
      isOpen: false,
    })
  const [createFreguesiaData, setCreateFreguesiaData] =
    useState<CreateLocationData>({
      nome: '',
      isOpen: false,
    })
  const [createRuaData, setCreateRuaData] = useState<CreateLocationData>({
    nome: '',
    isOpen: false,
  })

  const { formData, isInitialized, hasBeenVisited } = useFormState(formId)
  const { setFormState, updateFormState, resetFormState, hasFormData } =
    useFormsStore()
  const { removeWindow, setWindowReturnData } = useWindowsStore()
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
  const createEntidadeMutation = useCreateEntidade()

  const [selectedRua, setSelectedRua] = React.useState<any | null>(null)
  const [selectedPaisId, setSelectedPaisId] = useState<string>('')

  const contactTypes = useMemo(
    () =>
      Object.entries(ContactoTipoLabel).map(([key, label]) => ({
        tipo: Number(key),
        label,
        valor: '',
      })),
    []
  )

  // Define default values for proper change detection
  const defaultValues = useMemo(() => {
    // Initialize emission as today at 00:00:00.000, and validity as +10 years at 00:00:00.000
    const now = new Date()
    const emission = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      0,
      0,
      0,
      0
    )
    const validity = new Date(
      emission.getFullYear() + 10,
      emission.getMonth(),
      emission.getDate(),
      0,
      0,
      0,
      0
    )

    return {
      nome: '',
      nif: '',
      nifEstrangeiro: false,
      paisId: '',
      distritoId: '',
      concelhoId: '',
      freguesiaId: '',
      ruaId: '',
      ruaNumeroPorta: '',
      ruaAndar: '',
      cartaoIdentificacaoTipoId: CartaoIdentificacaoTipo.CC,
      cartaoIdentificacaoNumero: '',
      cartaoIdentificacaoDataEmissao: emission,
      cartaoIdentificacaoDataValidade: validity,
      estadoCivilId: EstadoCivil.SOLTEIRO,
      sexo: 'M' as const,
      ativo: true,
      historico: false,
      contactos: contactTypes.map((type) => ({ tipo: type.tipo, valor: '' })),
      predefinedContactoTipo: undefined,
    }
  }, [contactTypes])

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
    defaultValues,
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

  const createDistritoMutation = useCreateDistrito()
  const createConcelhoMutation = useCreateConcelho()
  const createFreguesiaMutation = useCreateFreguesia()
  const createRuaMutation = useCreateRua()

  const [createCodigoPostalData, setCreateCodigoPostalData] = useState<{
    codigo: string
    isOpen: boolean
  }>({
    codigo: '',
    isOpen: false,
  })

  const handleCreateDistrito = async (nome: string) => {
    if (!selectedPaisId) {
      toast.error('Selecione um país antes de criar um distrito')
      setCreateDistritoData({ nome: '', isOpen: false })
      return
    }

    try {
      const response = await createDistritoMutation.mutateAsync({
        nome,
        paisId: selectedPaisId,
      })
      const result = handleApiResponse(
        response,
        'Distrito criado com sucesso',
        'Erro ao criar distrito',
        'Distrito criado com avisos'
      )

      if (result.success) {
        const newDistritoId = response.info.data
        setSelectedDistritoId(newDistritoId)
        form.setValue('distritoId', newDistritoId)
      }
    } catch (error) {
      toast.error(handleApiError(error, 'Erro ao criar distrito'))
    } finally {
      setCreateDistritoData({ nome: '', isOpen: false })
    }
  }

  const handleCreateConcelho = async (nome: string) => {
    if (!selectedDistritoId) {
      toast.error('Selecione um distrito antes de criar um concelho')
      setCreateConcelhoData({ nome: '', isOpen: false })
      return
    }

    try {
      const response = await createConcelhoMutation.mutateAsync({
        nome,
        distritoId: selectedDistritoId,
      })
      const result = handleApiResponse(
        response,
        'Concelho criado com sucesso',
        'Erro ao criar concelho',
        'Concelho criado com avisos'
      )

      if (result.success) {
        const newConcelhoId = response.info.data
        setSelectedConcelhoId(newConcelhoId)
        form.setValue('concelhoId', newConcelhoId)
      }
    } catch (error) {
      toast.error(handleApiError(error, 'Erro ao criar concelho'))
    } finally {
      setCreateConcelhoData({ nome: '', isOpen: false })
    }
  }

  const handleCreateFreguesia = async (nome: string) => {
    if (!selectedConcelhoId) {
      toast.error('Selecione um concelho antes de criar uma freguesia')
      setCreateFreguesiaData({ nome: '', isOpen: false })
      return
    }

    try {
      const response = await createFreguesiaMutation.mutateAsync({
        nome,
        concelhoId: selectedConcelhoId,
      })
      const result = handleApiResponse(
        response,
        'Freguesia criada com sucesso',
        'Erro ao criar freguesia',
        'Freguesia criada com avisos'
      )

      if (result.success) {
        const newFreguesiaId = response.info.data
        setSelectedFreguesiaId(newFreguesiaId)
        form.setValue('freguesiaId', newFreguesiaId)
      }
    } catch (error) {
      toast.error(handleApiError(error, 'Erro ao criar freguesia'))
    } finally {
      setCreateFreguesiaData({ nome: '', isOpen: false })
    }
  }

  const handleCreateRua = async (nome: string) => {
    if (!selectedFreguesiaId) {
      toast.error('Selecione uma freguesia antes de criar uma rua')
      setCreateRuaData({ nome: '', isOpen: false })

      // Open the código postal creation modal
      setCreateCodigoPostalData({
        codigo: '',
        isOpen: true,
      })

      // The actual rua creation will happen after the código postal is created
      // See the onSuccess callback in the CodigoPostalCreateForm below
    } else {
      try {
        // Store the nome in the createRuaData state for later use
        setCreateRuaData({ nome, isOpen: false })

        // Open the código postal creation modal
        setCreateCodigoPostalData({
          codigo: '',
          isOpen: true,
        })

        // The actual rua creation will happen after the código postal is created
        // See the onSuccess callback in the CodigoPostalCreateForm below
      } catch (error) {
        toast.error(handleApiError(error, 'Erro ao criar rua'))
        setCreateRuaData({ nome: '', isOpen: false })
      }
    }
  }

  // Watch for creation modal states and handle creation
  useEffect(() => {
    if (createDistritoData.isOpen && createDistritoData.nome) {
      handleCreateDistrito(createDistritoData.nome)
    }
  }, [createDistritoData])

  useEffect(() => {
    if (createConcelhoData.isOpen && createConcelhoData.nome) {
      handleCreateConcelho(createConcelhoData.nome)
    }
  }, [createConcelhoData])

  useEffect(() => {
    if (createFreguesiaData.isOpen && createFreguesiaData.nome) {
      handleCreateFreguesia(createFreguesiaData.nome)
    }
  }, [createFreguesiaData])

  useEffect(() => {
    if (createRuaData.isOpen && createRuaData.nome) {
      handleCreateRua(createRuaData.nome)
    }
  }, [createRuaData])

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
      form.reset(formData as EntidadeFormSchemaType)

      // Synchronize local state variables with restored form data
      if (formData.paisId) {
        setSelectedPaisId(formData.paisId)
      }
      if (formData.distritoId) {
        setSelectedDistritoId(formData.distritoId)
      }
      if (formData.concelhoId) {
        setSelectedConcelhoId(formData.concelhoId)
      }
      if (formData.freguesiaId) {
        setSelectedFreguesiaId(formData.freguesiaId)
      }
      if (formData.ruaId) {
        setSelectedRuaId(formData.ruaId)
      }
    }
  }, [formData, isInitialized, formId, hasFormData])

  useEffect(() => {
    const subscription = form.watch((value) => {
      // Use proper change detection by comparing with default values
      const hasChanges = detectFormChanges(value, defaultValues)

      // Only update the form state if the values are different from the current state
      const currentValueStr = JSON.stringify(value)
      const formDataStr = JSON.stringify(formData)

      if (currentValueStr !== formDataStr) {
        setFormState(formId, {
          formData: value as EntidadeFormSchemaType,
          isDirty: hasChanges,
          // Avoid accessing form.formState.isValid to prevent early resolver validation
          isValid: false,
          isSubmitting: form.formState.isSubmitting,
          hasBeenModified: hasChanges,
          windowId: effectiveWindowId,
        })

        // Update window hasFormData flag using the utility function
        if (effectiveWindowId) {
          if (hasChanges) {
            updateCreateFormData(
              effectiveWindowId,
              value,
              setWindowHasFormData,
              defaultValues
            )
            // Only update window title if the nome field has changed
            if (value.nome !== formData?.nome) {
              updateCreateWindowTitle(
                effectiveWindowId,
                value.nome,
                updateWindowState
              )
            }
          } else {
            // If no changes, clear the form data
            updateCreateFormData(
              effectiveWindowId,
              {},
              setWindowHasFormData,
              defaultValues
            )
            updateCreateWindowTitle(effectiveWindowId, '', updateWindowState)
          }
        }
      }
    })
    return () => subscription.unsubscribe()
  }, [form, effectiveWindowId, formId, formData, defaultValues])

  useEffect(() => {
    const ruaId = form.watch('ruaId')
    const rua = ruasSelectData.find((r: any) => r.id === ruaId) || null
    setSelectedRua(rua)
  }, [form.watch('ruaId'), ruasSelectData])

  const handleClose = () => {
    cleanupWindowForms(effectiveWindowId)
    if (shouldCloseWindow) {
      handleWindowClose(effectiveWindowId, navigate, removeWindow)
    } else {
      modalClose()
    }
  }

  const onSubmit = async (values: EntidadeFormSchemaType) => {
    try {
      updateFormState(formId, (state) => ({ ...state, isSubmitting: true }))

      // Filter out contacts with empty values and ensure they match the EntidadeContacto type
      const filteredContacts = values.contactos
        .filter((contact) => contact.valor && contact.valor.trim() !== '')
        .map((contact) => ({
          EntidadeContactoTipoId: contact.tipo,
          Valor: contact.valor!,
          Principal: contact.tipo === values.predefinedContactoTipo,
        }))

      // Ensure we use the selected IDs if they're set
      const submitData: CreateEntidadeDTO = {
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
          toDatabaseDate(values.cartaoIdentificacaoDataValidade) || new Date(),
        EstadoCivilId: values.estadoCivilId,
        Sexo: values.sexo,
        Ativo: values.ativo,
        Historico: values.historico,
        Contactos: filteredContacts.length > 0 ? filteredContacts : undefined,
      }

      const response = await createEntidadeMutation.mutateAsync(submitData)

      const result = handleApiResponse(
        response,
        'Entidade criada com sucesso',
        'Erro ao criar entidade',
        'Entidade criada com avisos'
      )

      if (result.success) {
        const newEntidadeId = response.info.data

        // Set return data for parent window if this window was opened from another window
        if (effectiveWindowId) {
          setEntityReturnDataWithToastSuppression(
            effectiveWindowId,
            { id: newEntidadeId, nome: values.nome },
            'entidade',
            setWindowReturnData,
            finalParentWindowId || undefined,
            instanceId
          )
        }

        if (onSuccess) {
          console.log('Calling onSuccess with:', {
            id: newEntidadeId,
            nome: values.nome,
          })
          onSuccess({ id: newEntidadeId, nome: values.nome })
        }
        // Only close the window if shouldCloseWindow is true
        if (effectiveWindowId && shouldCloseWindow) {
          removeWindow(effectiveWindowId)
        }
        // Always call modalClose to close the modal
        modalClose()
      }
    } catch (error) {
      toast.error(handleApiError(error, 'Erro ao criar entidade'))
    } finally {
      updateFormState(formId, (state) => ({ ...state, isSubmitting: false }))
    }
  }

  const isLoading =
    isLoadingRuas ||
    isLoadingDistritos ||
    isLoadingConcelhos ||
    isLoadingFreguesias ||
    isLoadingPaises ||
    createEntidadeMutation.isPending ||
    createDistritoMutation.isPending ||
    createConcelhoMutation.isPending ||
    createFreguesiaMutation.isPending ||
    createRuaMutation.isPending ||
    createDistritoData.isOpen ||
    createConcelhoData.isOpen ||
    createFreguesiaData.isOpen ||
    createRuaData.isOpen ||
    createCodigoPostalData.isOpen

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
                            <FormLabel className='flex items-center gap-2'>
                              <Building2 className='h-4 w-4' />
                              Distrito
                            </FormLabel>
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
                                createOption={(inputValue) => ({
                                  value: 'new',
                                  label: `Criar novo distrito: "${inputValue}"`,
                                  inputValue,
                                })}
                                onCreateOption={(inputValue) => {
                                  setCreateDistritoData({
                                    nome: inputValue,
                                    isOpen: true,
                                  })
                                }}
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
                            <FormLabel className='flex items-center gap-2'>
                              <Building2 className='h-4 w-4' />
                              Concelho
                            </FormLabel>
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
                                createOption={(inputValue) => ({
                                  value: 'new',
                                  label: `Criar novo concelho: "${inputValue}"`,
                                  inputValue,
                                })}
                                onCreateOption={(inputValue) => {
                                  setCreateConcelhoData({
                                    nome: inputValue,
                                    isOpen: true,
                                  })
                                }}
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
                            <FormLabel className='flex items-center gap-2'>
                              <Building2 className='h-4 w-4' />
                              Freguesia
                            </FormLabel>
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
                                createOption={(inputValue) => ({
                                  value: 'new',
                                  label: `Criar nova freguesia: "${inputValue}"`,
                                  inputValue,
                                })}
                                onCreateOption={(inputValue) => {
                                  setCreateFreguesiaData({
                                    nome: inputValue,
                                    isOpen: true,
                                  })
                                }}
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
                                createOption={(inputValue) => ({
                                  value: 'new',
                                  label: `Criar nova rua: "${inputValue}"`,
                                  inputValue,
                                })}
                                onCreateOption={(inputValue) => {
                                  handleCreateRua(inputValue)
                                }}
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
              {isLoading ? 'A criar...' : 'Criar'}
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
        <CodigoPostalCreateFormModal
          modalClose={() =>
            setCreateCodigoPostalData((prev) => ({ ...prev, isOpen: false }))
          }
          onSuccess={async (newCodigoPostal) => {
            try {
              // Create the rua with the new código postal
              const response = await createRuaMutation.mutateAsync({
                nome: createRuaData.nome,
                freguesiaId: selectedFreguesiaId,
                codigoPostalId: newCodigoPostal.id,
              })

              const result = handleApiResponse(
                response,
                'Rua criada com sucesso',
                'Erro ao criar rua',
                'Rua criada com avisos'
              )

              if (result.success) {
                const newRuaId = response.info.data
                setSelectedRuaId(newRuaId)
                form.setValue('ruaId', newRuaId)
              }
            } catch (error) {
              toast.error(handleApiError(error, 'Erro ao criar rua'))
            } finally {
              setCreateRuaData({ nome: '', isOpen: false })
              setCreateCodigoPostalData({ codigo: '', isOpen: false })
            }
          }}
          initialCodigo={createCodigoPostalData.codigo}
          shouldCloseWindow={false}
        />
      </EnhancedModal>
    </div>
  )
}

export { EntidadeCreateForm }
