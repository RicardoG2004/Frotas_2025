import { useEffect, useMemo, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { useForm, type Resolver } from 'react-hook-form'
import { Tag } from 'lucide-react'
import { useCreateCargo } from '@/pages/base/cargos/queries/cargos-mutations'
import { useFormState, useFormsStore } from '@/stores/use-forms-store'
import { useWindowsStore } from '@/stores/use-windows-store'
import {
  useCurrentWindowId,
  handleWindowClose,
  updateCreateFormData,
  cleanupWindowForms,
  updateCreateWindowTitle,
  detectFormChanges,
  setEntityReturnDataWithToastSuppression,
} from '@/utils/window-utils'
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
import {
  PersistentTabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/persistent-tabs'

const cargoFormSchema = z.object({
  designacao: z.string().min(1, { message: 'A designação é obrigatória' }),
})

type CargoFormValues = z.infer<typeof cargoFormSchema>

interface CargoCreateFormProps {
  modalClose: () => void
  onSuccess?: (newCargo: { id: string; designacao: string }) => void
  shouldCloseWindow?: boolean
}

export const CargoCreateForm = ({
  modalClose,
  onSuccess,
  shouldCloseWindow = true,
}: CargoCreateFormProps) => {
  const location = useLocation()
  const navigate = useNavigate()
  const windowId = useCurrentWindowId()
  const searchParams = new URLSearchParams(location.search)
  const instanceId = searchParams.get('instanceId') || 'default'
  const formId = `cargo-${instanceId}`

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

  const createCargoMutation = useCreateCargo()

  const defaultValues = useMemo(
    () => ({
      designacao: '',
    }),
    []
  )

  const cargoResolver: Resolver<CargoFormValues> = async (values) => {
    const result = cargoFormSchema.safeParse(values)
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

  const form = useForm<CargoFormValues>({
    resolver: cargoResolver,
    defaultValues,
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
    criteriaMode: 'all',
  })

  const { setActiveTab } = useTabManager({
    defaultTab: 'dados',
    tabKey: `cargo-${instanceId}`,
  })
  const { handleError } = useSubmitErrorTab<CargoFormValues>({
    setActiveTab,
    fieldToTabMap: {
      default: 'dados',
      designacao: 'dados',
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
      form.reset(formData as CargoFormValues)
    }
  }, [formData, isInitialized, formId, hasFormData, form])

  useEffect(() => {
    const subscription = form.watch((value) => {
      const hasChanges = detectFormChanges(value, defaultValues)

      setFormState(formId, {
        formData: value as CargoFormValues,
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
          value.designacao || 'Novo Cargo',
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

  const handleClose = () => {
    cleanupWindowForms(effectiveWindowId)

    if (shouldCloseWindow) {
      handleWindowClose(effectiveWindowId, navigate, removeWindow)
    } else {
      modalClose()
    }
  }

  const onSubmit = async (values: CargoFormValues) => {
    try {
      updateFormState(formId, (state) => ({
        ...state,
        isSubmitting: true,
      }))

      const response = (await createCargoMutation.mutateAsync({
        Designacao: values.designacao,
      })) as ResponseApi<GSResponse<string>>

      const result = handleApiResponse(
        response,
        'Cargo criado com sucesso',
        'Erro ao criar cargo',
        'Cargo criado com avisos'
      )

      if (result.success) {
        if (effectiveWindowId) {
          setEntityReturnDataWithToastSuppression(
            effectiveWindowId,
            { id: response.info.data, designacao: values.designacao },
            'cargo',
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
      toast.error(handleApiError(error, 'Erro ao criar cargo'))
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
          id='cargoCreateForm'
          onSubmit={form.handleSubmit(onSubmit, handleError)}
          className='space-y-4'
          autoComplete='off'
        >
          <PersistentTabs
            defaultValue='dados'
            className='w-full'
            tabKey={`cargo-${instanceId}`}
          >
            <TabsList>
              <TabsTrigger value='dados' className='flex items-center gap-2'>
                <Tag className='h-4 w-4' />
                Identificação
              </TabsTrigger>
            </TabsList>
            <TabsContent value='dados'>
              <Card className='overflow-hidden border-l-4 border-l-primary/20 hover:border-l-primary/40 transition-all duration-200 hover:shadow-md'>
                <CardHeader className='pb-4'>
                  <div className='flex items-center gap-3'>
                    <div className='flex items-center justify-center w-8 h-8 rounded-md bg-primary/10 text-primary'>
                      <Tag className='h-4 w-4' />
                    </div>
                    <div>
                      <CardTitle className='text-base flex items-center gap-2'>
                        Identificação
                        <Badge variant='secondary' className='text-xs'>
                          Obrigatório
                        </Badge>
                      </CardTitle>
                      <p className='text-sm text-muted-foreground mt-1'>
                        Defina a designação do cargo
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className='space-y-6'>
                  <FormField
                    control={form.control}
                    name='designacao'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='flex items-center gap-2'>
                          <Tag className='h-4 w-4' />
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
                </CardContent>
              </Card>
            </TabsContent>
          </PersistentTabs>
        </form>
      </Form>

      <div className='flex justify-end gap-2'>
        <Button variant='outline' onClick={handleClose}>
          Cancelar
        </Button>
        <Button
          type='submit'
          form='cargoCreateForm'
          disabled={createCargoMutation.isPending}
        >
          Guardar
        </Button>
      </div>
    </div>
  )
}


