import { useEffect, useRef } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { type Resolver } from 'react-hook-form'
import { UpdateSeguradoraDTO } from '@/types/dtos/frotas/seguradoras.dtos'
import { ShieldCheck } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useFormState, useFormsStore } from '@/stores/use-forms-store'
import { useWindowsStore } from '@/stores/use-windows-store'
import { handleApiError } from '@/utils/error-handlers'
import { handleApiResponse } from '@/utils/response-handlers'
import { toast } from '@/utils/toast-utils'
import {
  useCurrentWindowId,
  handleWindowClose,
  updateWindowFormData,
  cleanupWindowForms,
  updateUpdateWindowTitle,
  setEntityReturnDataWithToastSuppression,
  detectUpdateFormChanges,
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
import {
  PersistentTabs,
  TabsList as PersistentTabsList,
  TabsTrigger as PersistentTabsTrigger,
  TabsContent as PersistentTabsContent,
} from '@/components/ui/persistent-tabs'
import { useUpdateSeguradora } from '@/pages/frotas/seguradoras/queries/seguradoras-mutations'

const seguradoraFormSchema = z.object({
  descricao: z
    .string({ message: 'A Descrição é obrigatória' })
    .min(1, { message: 'A Descrição é obrigatória' }),
})

type SeguradoraFormSchemaType = z.infer<typeof seguradoraFormSchema>

interface SeguradoraUpdateFormProps {
  modalClose: () => void
  seguradoraId: string
  initialData: SeguradoraFormSchemaType
  onSuccess?: (updatedSeguradora: { id: string; descricao: string }) => void
  shouldCloseWindow?: boolean
}

const SeguradoraUpdateForm = ({
  modalClose,
  seguradoraId,
  initialData,
  onSuccess,
  shouldCloseWindow = true,
}: SeguradoraUpdateFormProps) => {
  const location = useLocation()
  const navigate = useNavigate()
  const windowId = useCurrentWindowId()
  const searchParams = new URLSearchParams(location.search)
  const instanceId = searchParams.get('instanceId') || 'default'
  const formId = `seguradora-update-${instanceId}`

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
    setWindowReturnData,
  } = useWindowsStore()
  const setWindowHasFormData = useWindowsStore(
    (state) => state.setWindowHasFormData
  )

  const { setActiveTab } = useTabManager({
    defaultTab: 'identificacao',
    tabKey: `seguradora-${instanceId}`,
  })
  const { handleError } = useSubmitErrorTab<SeguradoraFormSchemaType>({
    setActiveTab,
    fieldToTabMap: {
      default: 'identificacao',
      descricao: 'identificacao',
    },
  })

  const updateSeguradoraMutation = useUpdateSeguradora()

  const seguradoraResolver: Resolver<SeguradoraFormSchemaType> = async (
    values
  ) => {
    const result = seguradoraFormSchema.safeParse(values)
    if (result.success) {
      return { values: result.data, errors: {} }
    }
    const fieldErrors: Record<string, { type: string; message: string }> = {}
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

  const form = useForm<SeguradoraFormSchemaType>({
    resolver: seguradoraResolver,
    defaultValues: initialData,
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
  }, [formId, hasBeenVisited, resetFormState, hasFormData, effectiveWindowId, setFormState])

  useEffect(() => {
    if (isInitialized && hasFormData(formId)) {
      form.reset(formData as SeguradoraFormSchemaType)
    }
  }, [formData, isInitialized, formId, hasFormData, form])

  useEffect(() => {
    const subscription = form.watch((value) => {
      const hasChanges = detectUpdateFormChanges(value, initialData)

      setFormState(formId, {
        formData: value as SeguradoraFormSchemaType,
        isDirty: hasChanges,
        isValid: form.formState.isValid,
        isSubmitting: form.formState.isSubmitting,
        hasBeenModified: hasChanges,
        windowId: effectiveWindowId,
      })

      if (effectiveWindowId) {
        updateWindowFormData(effectiveWindowId, hasChanges, setWindowHasFormData)
        const newTitle = value.descricao || 'Seguradora'
        updateUpdateWindowTitle(effectiveWindowId, newTitle, updateWindowState)
      }
    })
    return () => subscription.unsubscribe()
  }, [
    form,
    effectiveWindowId,
    formId,
    initialData,
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

  const onSubmit = async (values: SeguradoraFormSchemaType) => {
    try {
      updateFormState(formId, (state) => ({
        ...state,
        isSubmitting: true,
      }))

      const requestData: UpdateSeguradoraDTO = {
        descricao: values.descricao,
      }

      const response = await updateSeguradoraMutation.mutateAsync({
        id: seguradoraId,
        data: requestData,
      })
      const result = handleApiResponse(
        response,
        'Seguradora atualizada com sucesso',
        'Erro ao atualizar seguradora',
        'Seguradora atualizada com avisos'
      )

      if (result.success) {
        if (effectiveWindowId) {
          setEntityReturnDataWithToastSuppression(
            effectiveWindowId,
            { id: seguradoraId, descricao: values.descricao },
            'seguradora',
            setWindowReturnData,
            parentWindowIdFromStorage || undefined
          )

          setTimeout(() => {
            if (parentWindowIdFromStorage) {
              sessionStorage.removeItem(`parent-window-${instanceId}`)
            }
          }, 2000)
        }

        if (onSuccess) {
          onSuccess({
            id: seguradoraId,
            descricao: values.descricao,
          })
        }
        if (effectiveWindowId && shouldCloseWindow) {
          removeWindow(effectiveWindowId)
        }
        modalClose()
      }
    } catch (error) {
      toast.error(handleApiError(error, 'Erro ao atualizar seguradora'))
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
          id='seguradoraUpdateForm'
          onSubmit={form.handleSubmit(onSubmit, handleError)}
          className='space-y-4'
          autoComplete='off'
        >
          <PersistentTabs
            defaultValue='identificacao'
            className='w-full'
            tabKey={`seguradora-${instanceId}`}
          >
            <PersistentTabsList>
              <PersistentTabsTrigger value='identificacao'>
                <ShieldCheck className='mr-2 h-4 w-4' />
                Identificação
              </PersistentTabsTrigger>
            </PersistentTabsList>
            <PersistentTabsContent value='identificacao'>
              <div className='space-y-6'>
                <Card className='overflow-hidden border-l-4 border-l-primary/20 hover:border-l-primary/40 transition-all duration-200 hover:shadow-md'>
                  <CardHeader className='pb-4'>
                    <div className='flex items-center gap-3'>
                      <div className='flex items-center justify-center w-8 h-8 rounded-md bg-primary/10 text-primary'>
                        <ShieldCheck className='h-4 w-4' />
                      </div>
                      <div>
                        <CardTitle className='text-base flex items-center gap-2'>
                          Identificação da Seguradora
                          <Badge variant='secondary' className='text-xs'>
                            Obrigatório
                          </Badge>
                        </CardTitle>
                        <p className='text-sm text-muted-foreground mt-1'>
                          Atualize a descrição da seguradora
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className='space-y-6'>
                    <div className='grid grid-cols-1 gap-4'>
                      <FormField
                        control={form.control}
                        name='descricao'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='flex items-center gap-2'>
                              <ShieldCheck className='h-4 w-4' />
                              Descrição
                              <Badge variant='secondary' className='text-xs'>
                                Obrigatório
                              </Badge>
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder='Digite a descrição da seguradora'
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
          <div className='flex flex-col justify-end space-y-2 pt-4 md:flex-row md:space-x-4 md:space-y-0'>
            <Button
              type='button'
              variant='outline'
              onClick={handleClose}
              className='w-full md:w-auto'
              disabled={updateSeguradoraMutation.isPending}
            >
              Cancelar
            </Button>
            <Button
              type='submit'
              disabled={updateSeguradoraMutation.isPending}
              className='w-full md:w-auto'
            >
              {updateSeguradoraMutation.isPending ? 'A atualizar...' : 'Atualizar'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

export { SeguradoraUpdateForm }


