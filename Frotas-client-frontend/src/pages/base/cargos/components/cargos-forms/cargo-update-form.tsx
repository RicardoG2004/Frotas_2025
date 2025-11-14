import { useEffect, useRef } from 'react'
import { z } from 'zod'
import { useForm, type Resolver } from 'react-hook-form'
import { Tag } from 'lucide-react'
import { useUpdateCargo } from '@/pages/base/cargos/queries/cargos-mutations'
import { useGetCargo } from '@/pages/base/cargos/queries/cargos-queries'
import { useLocation, useNavigate } from 'react-router-dom'
import { useFormState, useFormsStore } from '@/stores/use-forms-store'
import { useWindowsStore } from '@/stores/use-windows-store'
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
import { handleApiResponse } from '@/utils/response-handlers'
import { handleApiError } from '@/utils/error-handlers'
import { toast } from '@/utils/toast-utils'
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
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@/components/ui/persistent-tabs'

const cargoFormSchema = z.object({
  designacao: z.string().min(1, { message: 'A designação é obrigatória' }),
})

type CargoFormValues = z.infer<typeof cargoFormSchema>

interface CargoUpdateFormProps {
  modalClose: () => void
  cargoId: string
  initialData: {
    designacao: string
  }
}

export const CargoUpdateForm = ({
  modalClose,
  cargoId,
  initialData,
}: CargoUpdateFormProps) => {
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
  const removeWindow = useWindowsStore((state) => state.removeWindow)
  const setWindowHasFormData = useWindowsStore(
    (state) => state.setWindowHasFormData
  )
  const updateWindowState = useWindowsStore((state) => state.updateWindowState)

  const updateCargoMutation = useUpdateCargo()
  const { data: cargoData } = useGetCargo(cargoId)

  const cargoResolver: Resolver<CargoFormValues> = async (values) => {
    const normalizedValues: CargoFormValues = {
      designacao: values.designacao ?? '',
    }

    const result = cargoFormSchema.safeParse(normalizedValues)
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
    defaultValues: initialData,
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
          formData: initialData,
          isDirty: false,
          isValid: true,
          isSubmitting: false,
          hasBeenModified: false,
          windowId,
        })

        if (windowId) {
          updateUpdateWindowTitle(windowId, initialData.designacao, updateWindowState)
        }
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
    setFormState,
  ])

  useEffect(() => {
    if (isInitialized && hasFormData(formId)) {
      form.reset(formData as CargoFormValues)
      if (formData?.designacao && windowId) {
        updateUpdateWindowTitle(windowId, formData.designacao, updateWindowState)
      }
    } else if (cargoData) {
      form.reset({
        designacao: cargoData.designacao ?? '',
      })
      if (cargoData.designacao && windowId) {
        updateUpdateWindowTitle(windowId, cargoData.designacao, updateWindowState)
      }
    }
  }, [
    formData,
    isInitialized,
    formId,
    hasFormData,
    cargoData,
    form,
    windowId,
    updateWindowState,
  ])

  useEffect(() => {
    const subscription = form.watch((value) => {
      const hasChanges = detectUpdateFormChanges(value, initialData)

      setFormState(formId, {
        formData: value as CargoFormValues,
        isDirty: hasChanges,
        isValid: form.formState.isValid,
        isSubmitting: form.formState.isSubmitting,
        hasBeenModified: hasChanges,
      })

      if (windowId) {
        updateWindowFormData(windowId, hasChanges, setWindowHasFormData)
        updateUpdateWindowTitle(windowId, value.designacao, updateWindowState)
      }
    })
    return () => subscription.unsubscribe()
  }, [
    form,
    windowId,
    initialData,
    formId,
    setFormState,
    setWindowHasFormData,
    updateWindowState,
  ])

  const handleClose = () => {
    cleanupWindowForms(windowId)
    handleWindowClose(windowId, navigate, removeWindow)
  }

  const onSubmit = async (values: CargoFormValues) => {
    try {
      updateFormState(formId, (state) => ({
        ...state,
        isSubmitting: true,
      }))

      const response = await updateCargoMutation.mutateAsync({
        id: cargoId,
        data: {
          Designacao: values.designacao,
        },
      })

      const result = handleApiResponse(
        response,
        'Cargo atualizado com sucesso',
        'Erro ao atualizar cargo',
        'Cargo atualizado com avisos'
      )

      if (result.success) {
        if (windowId) {
          removeWindow(windowId)
        }
        modalClose()
      }
    } catch (error) {
      toast.error(handleApiError(error, 'Erro ao atualizar cargo'))
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
          id='cargoUpdateForm'
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
                        Atualize a designação do cargo
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
          form='cargoUpdateForm'
          disabled={updateCargoMutation.isPending}
        >
          Guardar
        </Button>
      </div>
    </div>
  )
}


