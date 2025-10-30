import { useEffect } from 'react'
import { ArrowLeft } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useFormsStore } from '@/stores/use-forms-store'
import { useWindowsStore } from '@/stores/use-windows-store'
import { handleWindowClose } from '@/utils/window-utils'
import { Button } from '@/components/ui/button'
import { Breadcrumbs } from '@/components/shared/breadcrumbs'
import { PageHead } from '@/components/shared/page-head'
import { useGetModelo } from '../../queries/modelos-queries'
import { ModeloUpdateForm } from '../modelos-forms/modelo-update-form'

export function ModelosUpdatePage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { removeFormState } = useFormsStore()
  const { windows, removeWindow } = useWindowsStore()
  const searchParams = new URLSearchParams(location.search)
  const instanceId = searchParams.get('instanceId') || 'default'
  const modeloId = searchParams.get('modeloId')
  const formId = instanceId

  const handleClose = () => {
    // Remove form data from the form store
    removeFormState(formId)

    // Find the current window and remove it
    const currentWindow = windows.find(
      (w) => w.path === location.pathname && w.instanceId === instanceId
    )

    if (currentWindow) {
      handleWindowClose(currentWindow.id, navigate, removeWindow)
    }
  }

  // If no modeloId is provided, redirect to modelos page
  if (!modeloId) {
    navigate('/frotas/configuracoes/modelos')
    return null
  }

  const { data: modeloData, isLoading } = useGetModelo(modeloId)

  // Update window state with modeloId if it's not already set
  useEffect(() => {
    const currentWindow = windows.find(
      (w) => w.path === location.pathname && w.instanceId === instanceId
    )

    if (modeloId && currentWindow && !currentWindow.searchParams?.modeloId) {
      useWindowsStore.getState().updateWindowState(currentWindow.id, {
        searchParams: { modeloId },
      })
    }
  }, [modeloId, instanceId, windows])

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className='flex h-full flex-col gap-8 px-4 md:px-8 md:pb-8 md:pt-28 pt-14 md:mx-0 md:my-4 md:mr-4 md:rounded-xl pb-24'>
      <PageHead title='Atualizar Modelo | Frotas' />

      <div className='flex items-center gap-4'>
        <Button
          variant='ghost'
          size='icon'
          onClick={handleClose}
          className='h-8 w-8'
        >
          <ArrowLeft className='h-4 w-4' />
        </Button>
        <Breadcrumbs
          items={[
            {
              title: 'Configurações',
              link: '/frotas/configuracoes',
            },
            {
              title: 'Modelos',
              link: '/frotas/configuracoes/modelos',
            },
            {
              title: 'Atualizar',
              link: `/frotas/configuracoes/modelos/update?modeloId=${modeloId}&instanceId=${instanceId}`,
            },
          ]}
        />
      </div>

      <div className='rounded-lg border bg-card'>
        <div className='border-b px-6 py-4'>
          <h2 className='text-base font-medium'>Atualizar Modelo</h2>
        </div>
        <div className='p-6'>
          <ModeloUpdateForm
            modalClose={handleClose}
            modeloId={modeloId}
            modeloData={{
              nome: modeloData?.info?.data?.nome || '',
              marcaId: modeloData?.info?.data?.marcaId || '',
            }}
          />
        </div>
      </div>
    </div>
  )
}
