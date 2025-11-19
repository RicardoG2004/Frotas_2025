import { useEffect, useRef } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { type Resolver } from 'react-hook-form'
import { CreateTipoViaturaDTO } from '@/types/dtos/frotas/tipo-viaturas.dtos'
import { Car } from 'lucide-react'
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
  detectFormChanges,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  PersistentTabs,
  TabsList as PersistentTabsList,
  TabsTrigger as PersistentTabsTrigger,
  TabsContent as PersistentTabsContent,
} from '@/components/ui/persistent-tabs'
import { useCreateTipoViatura } from '@/pages/frotas/tipo-viaturas/queries/tipo-viaturas-mutations'
import { TIPO_VIATURA_DESIGNACOES, type TipoViaturaDesignacao } from '@/utils/tipo-viatura-helper'

const tipoViaturaFormSchema = z.object({
  designacao: z.enum(TIPO_VIATURA_DESIGNACOES, {
    message: 'A Designação é obrigatória',
  }),
})

type TipoViaturaFormSchemaType = z.infer<typeof tipoViaturaFormSchema>

interface TipoViaturaCreateFormProps {
  modalClose: () => void
  onSuccess?: (newTipoViatura: { id: string; designacao: string }) => void
  shouldCloseWindow?: boolean
}

const TipoViaturaCreateForm = ({
  modalClose,
  onSuccess,
  shouldCloseWindow = true,
}: TipoViaturaCreateFormProps) => {
  const location = useLocation()
  const navigate = useNavigate()
  const windowId = useCurrentWindowId()
  const searchParams = new URLSearchParams(location.search)
  const instanceId = searchParams.get('instanceId') || 'default'
  const formId = `tipo-viatura-${instanceId}`

  const parentWindowIdFromStorage = sessionStorage.getItem(
    `parent-window-${instanceId}`
  )
  const effectiveWindowId = windowId || instanceId

  const isFirstRender = useRef(true)

  const { formData, isInitialized, hasBeenVisited } = useFormState(formId)
  const { setFormState, updateFormState, resetFormState, hasFormData } =
    useFormsStore()
  const { removeWindow, updateWindowState, setWindowReturnData } =
    useWindowsStore()
  const setWindowHasFormData = useWindowsStore(
    (state) => state.setWindowHasFormData
  )

  const { setActiveTab } = useTabManager({
    defaultTab: 'identificacao',
    tabKey: `tipo-viatura-${instanceId}`,
  })
  const { handleError } = useSubmitErrorTab<TipoViaturaFormSchemaType>({
    setActiveTab,
    fieldToTabMap: {
      default: 'identificacao',
      designacao: 'identificacao',
    },
  })

  const createTipoViaturaMutation = useCreateTipoViatura()

  const defaultValues = {
    designacao: '' as TipoViaturaDesignacao,
  }

  const tipoViaturaResolver: Resolver<TipoViaturaFormSchemaType> = async (
    values
  ) => {
    const result = tipoViaturaFormSchema.safeParse(values)
    if (result.success) {
      return { values: result.data, errors: {} }
    }
    const fieldErrors: any = {}
    Object.entries(result.error.flatten().fieldErrors).forEach(
      ([key, value]) => {
        if (value && Array.isArray(value) && value.length > 0) {
          fieldErrors[key] = { type: 'validation', message: value[0] }
        }
      }
    )
    return {
      values: {},
      errors: fieldErrors,
    }
  }

  const form = useForm<TipoViaturaFormSchemaType>({
    resolver: tipoViaturaResolver,
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
  }, [formId, hasBeenVisited, resetFormState, hasFormData, setFormState, effectiveWindowId])

  useEffect(() => {
    if (isInitialized && hasFormData(formId)) {
      form.reset(formData as TipoViaturaFormSchemaType)
    }
  }, [formData, isInitialized, formId, hasFormData, form])

  useEffect(() => {
    const subscription = form.watch((value) => {
      const hasChanges = detectFormChanges(value, defaultValues)

      const typedValue = value as Partial<TipoViaturaFormSchemaType>
      if (JSON.stringify(typedValue) !== JSON.stringify(formData)) {
        setFormState(formId, {
          formData: typedValue as TipoViaturaFormSchemaType,
          isDirty: hasChanges,
          isValid: form.formState.isValid,
          isSubmitting: form.formState.isSubmitting,
          hasBeenModified: hasChanges,
          windowId: effectiveWindowId,
        })

        if (effectiveWindowId) {
          updateCreateFormData(
            effectiveWindowId,
            typedValue,
            setWindowHasFormData,
            defaultValues
          )
          if (
            typedValue.designacao &&
            typedValue.designacao !== formData?.designacao
          ) {
            updateCreateWindowTitle(
              effectiveWindowId,
              typedValue.designacao || 'Novo Tipo de Viatura',
              updateWindowState
            )
          }
        }
      }
    })
    return () => subscription.unsubscribe()
  }, [
    form,
    effectiveWindowId,
    formId,
    formData,
    defaultValues,
    setFormState,
    setWindowHasFormData,
    updateWindowState,
  ])

  const handleClose = () => {
    cleanupWindowForms(effectiveWindowId)

    if (shouldCloseWindow) {
      handleWindowClose(effectiveWindowId, navigate, removeWindow)
    } else {
      modalClose()
    }
  }

  const onSubmit = async (values: TipoViaturaFormSchemaType) => {
    try {
      updateFormState(formId, (state) => ({
        ...state,
        isSubmitting: true,
      }))

      const requestData: CreateTipoViaturaDTO = {
        designacao: values.designacao,
        categoriaInspecao: 'ligeiro', // Valor padrão, será calculado no backend baseado na designação
      }

      const response =
        await createTipoViaturaMutation.mutateAsync(requestData)
      const result = handleApiResponse(
        response,
        'Tipo de viatura criado com sucesso',
        'Erro ao criar tipo de viatura',
        'Tipo de viatura criado com avisos'
      )

      if (result.success) {
        if (effectiveWindowId) {
          setEntityReturnDataWithToastSuppression(
            effectiveWindowId,
            { id: result.data as string, designacao: values.designacao },
            'tipo-viatura',
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
            designacao: values.designacao,
          })
        }

        if (effectiveWindowId && shouldCloseWindow) {
          removeWindow(effectiveWindowId)
        }
        modalClose()
      }
    } catch (error) {
      toast.error(handleApiError(error, 'Erro ao criar tipo de viatura'))
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
          id='tipoViaturaCreateForm'
          onSubmit={form.handleSubmit(onSubmit, handleError)}
          className='space-y-4'
          autoComplete='off'
        >
          <PersistentTabs
            defaultValue='identificacao'
            className='w-full'
            tabKey={`tipo-viatura-${instanceId}`}
          >
            <PersistentTabsList>
              <PersistentTabsTrigger value='identificacao'>
                <Car className='mr-2 h-4 w-4' />
                Identificação
              </PersistentTabsTrigger>
            </PersistentTabsList>
            <PersistentTabsContent value='identificacao'>
              <div className='space-y-6'>
                <Card className='overflow-hidden border-l-4 border-l-primary/20 hover:border-l-primary/40 transition-all duration-200 hover:shadow-md'>
                  <CardHeader className='pb-4'>
                    <div className='flex items-center gap-3'>
                      <div className='flex items-center justify-center w-8 h-8 rounded-md bg-primary/10 text-primary'>
                        <Car className='h-4 w-4' />
                      </div>
                      <div>
                        <CardTitle className='text-base flex items-center gap-2'>
                          Identificação do Tipo de Viatura
                          <Badge variant='secondary' className='text-xs'>
                            Obrigatório
                          </Badge>
                        </CardTitle>
                        <p className='text-sm text-muted-foreground mt-1'>
                          Informações básicas do tipo de viatura
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
                              <Car className='h-4 w-4' />
                              Designação
                              <Badge variant='secondary' className='text-xs'>
                                Obrigatório
                              </Badge>
                            </FormLabel>
                            <FormControl>
                              <Select
                                value={field.value}
                                onValueChange={(value) => {
                                  field.onChange(value as TipoViaturaDesignacao)
                                }}
                              >
                                <SelectTrigger className='px-4 py-6 shadow-inner drop-shadow-xl'>
                                  <SelectValue placeholder='Selecione a designação do tipo de viatura' />
                                </SelectTrigger>
                                <SelectContent>
                                  {TIPO_VIATURA_DESIGNACOES.map((designacao) => (
                                    <SelectItem key={designacao} value={designacao}>
                                      <span className='font-medium capitalize'>{designacao}</span>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
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
              disabled={createTipoViaturaMutation.isPending}
              className='w-full md:w-auto'
            >
              {createTipoViaturaMutation.isPending ? 'A criar...' : 'Criar'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

export { TipoViaturaCreateForm }

