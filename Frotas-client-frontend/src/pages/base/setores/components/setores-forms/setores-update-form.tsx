import { useEffect, useRef } from 'react'
import { z } from 'zod'
import { useForm, type Resolver } from 'react-hook-form'
import { useUpdateSetor } from '@/pages/base/setores/queries/setores-mutations'
import { useGetSetor } from '@/pages/base/setores/queries/setores-queries'
import { Building2, Tag } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useFormState, useFormsStore } from '@/stores/use-forms-store'
import { useWindowsStore } from '@/stores/use-windows-store'
import { handleApiError } from '@/utils/error-handlers'
import { handleApiResponse } from '@/utils/response-handlers'
import { toast } from '@/utils/toast-utils'
import type { ResponseApi } from '@/types/responses'
import type { GSResponse } from '@/types/api/responses'
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

const setorFormSchema = z.object({
  descricao: z
    .string()
    .min(1, { message: 'A descrição é obrigatória' }),
})

type SetorFormValues = z.infer<typeof setorFormSchema>

interface SetorUpdateFormProps {
  modalClose: () => void
  setorId: string
  initialData: {
    descricao: string
  }
}

const SetorUpdateForm = ({
  modalClose,
  setorId,
  initialData,
}: SetorUpdateFormProps) => {
  const location = useLocation()
  const navigate = useNavigate()
  const windowId = useCurrentWindowId()
  const searchParams = new URLSearchParams(location.search)
  const instanceId = searchParams.get('instanceId') || 'default'
  const formId = instanceId

  // Use a ref to track if this is the first render
  const isFirstRender = useRef(true)

  const { formData, isInitialized, hasBeenVisited } = useFormState(formId)
  const { setFormState, updateFormState, resetFormState, hasFormData } =
    useFormsStore()
  const { removeWindow, updateWindowState } = useWindowsStore()
  const setWindowHasFormData = useWindowsStore(
    (state) => state.setWindowHasFormData
  )

  const updateSetorMutation = useUpdateSetor()
  const { data: setorData } = useGetSetor(setorId)

  const setorResolver: Resolver<SetorFormValues> = async (values) => {
    const result = setorFormSchema.safeParse(values)
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

  const form = useForm<SetorFormValues>({
    resolver: setorResolver,
    defaultValues: {
      descricao: '',
    },
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
    criteriaMode: 'all',
  })

  const { setActiveTab } = useTabManager({
    defaultTab: 'identificacao',
    tabKey: `setor-${instanceId}`,
  })
  const { handleError } = useSubmitErrorTab<SetorFormValues>({
    setActiveTab,
    fieldToTabMap: {
      default: 'identificacao',
      descricao: 'identificacao',
    },
  })

  // Initialize form state on first render
  useEffect(() => {
    if (isFirstRender.current) {
      // If this form has never been visited before or doesn't have data, reset it
      if (!hasBeenVisited || !hasFormData(formId)) {
        resetFormState(formId)
        // Set initial form data with windowId
        setFormState(formId, {
          formData: initialData,
          isDirty: false,
          isValid: true,
          isSubmitting: false,
          hasBeenModified: false,
          windowId: windowId,
        })
      }
      isFirstRender.current = false
    }
  }, [formId, hasBeenVisited, resetFormState, hasFormData, windowId])

  // Load saved form data if available and the form has been initialized
  useEffect(() => {
    if (isInitialized && hasFormData(formId)) {
      form.reset(formData as SetorFormValues)
      // Update window title with initial form data
      if (formData?.descricao && windowId) {
        updateUpdateWindowTitle(windowId, formData.descricao, updateWindowState)
      }
    } else if (setorData) {
      // If no saved data, use the data from the API
      const setor = setorData
      form.reset({
        descricao: setor.descricao,
      })
      // Update window title with API data
      if (setor.descricao && windowId) {
        updateUpdateWindowTitle(windowId, setor.descricao, updateWindowState)
      }
    }
  }, [formData, isInitialized, formId, hasFormData, setorData, windowId])

  // Save form data when it changes
  useEffect(() => {
    const subscription = form.watch((value) => {
      const hasChanges = detectUpdateFormChanges(value, initialData)

      if (JSON.stringify(value) !== JSON.stringify(formData)) {
        setFormState(formId, {
          formData: value as SetorFormValues,
          isDirty: hasChanges,
          isValid: form.formState.isValid,
          isSubmitting: form.formState.isSubmitting,
          hasBeenModified: hasChanges,
          windowId: windowId,
        })

        // Update window hasFormData flag
        updateWindowFormData(windowId, hasChanges, setWindowHasFormData)
        if (value.descricao && value.descricao !== formData?.descricao) {
          updateUpdateWindowTitle(windowId, value.descricao, updateWindowState)
        }
      }
    })
    return () => subscription.unsubscribe()
  }, [
    form,
    windowId,
    formId,
    initialData,
    formData,
    setFormState,
    setWindowHasFormData,
    updateWindowState,
  ])

  const handleClose = () => {
    // Clean up all form instances for the current window
    cleanupWindowForms(windowId)
    handleWindowClose(windowId, navigate, removeWindow)
  }

  const onSubmit = async (values: SetorFormValues) => {
    try {
      updateFormState(formId, (state) => ({
        ...state,
        isSubmitting: true,
      }))

      const response = await updateSetorMutation.mutateAsync({
        id: setorId,
        data: {
          Descricao: values.descricao,
        },
      }) as ResponseApi<GSResponse<string>>

      const result = handleApiResponse(
        response,
        'Setor atualizado com sucesso',
        'Erro ao atualizar setor',
        'Setor atualizado com avisos'
      )

      if (result.success) {
        // Close the window
        if (windowId) {
          removeWindow(windowId)
        }
        modalClose()
      }
    } catch (error) {
      toast.error(handleApiError(error, 'Erro ao atualizar setor'))
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
            defaultValue='identificacao'
            className='w-full'
            tabKey={`setor-${instanceId}`}
          >
            <TabsList>
              <TabsTrigger value='identificacao'>Identificação</TabsTrigger>
            </TabsList>
            <TabsContent value='identificacao'>
              <Card className='overflow-hidden border-l-4 border-l-primary/20 hover:border-l-primary/40 transition-all duration-200 hover:shadow-md'>
                <CardHeader className='pb-4'>
                  <div className='flex items-center gap-3'>
                    <div className='flex items-center justify-center w-8 h-8 rounded-md bg-primary/10 text-primary'>
                      <Building2 className='h-4 w-4' />
                    </div>
                    <div>
                      <CardTitle className='text-base flex items-center gap-2'>
                        Identificação do Setor
                        <Badge variant='secondary' className='text-xs'>
                          Obrigatório
                        </Badge>
                      </CardTitle>
                      <p className='text-sm text-muted-foreground mt-1'>
                        Defina as informações básicas do setor
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
                            <Tag className='h-4 w-4' />
                            Descrição
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder='Introduza a descrição'
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
            </TabsContent>
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
              disabled={updateSetorMutation.isPending}
              className='w-full md:w-auto'
            >
              {updateSetorMutation.isPending ? 'A atualizar...' : 'Atualizar'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

export { SetorUpdateForm }

