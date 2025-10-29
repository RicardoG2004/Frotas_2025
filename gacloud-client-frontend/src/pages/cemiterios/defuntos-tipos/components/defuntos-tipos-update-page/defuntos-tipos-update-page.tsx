import { useEffect } from 'react'
import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import { useFormsStore } from '@/stores/use-forms-store'
import { useWindowsStore } from '@/stores/use-windows-store'
import { handleWindowClose } from '@/utils/window-utils'
import { Button } from '@/components/ui/button'
import { Breadcrumbs } from '@/components/shared/breadcrumbs'
import { PageHead } from '@/components/shared/page-head'
import { useGetDefuntoTipo } from '../../queries/defuntos-tipos-queries'
import { DefuntoTipoUpdateForm } from '../defuntos-tipos-forms/defunto-tipo-update-form'

export function DefuntosTiposUpdatePage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { removeFormState } = useFormsStore()
  const { windows, removeWindow } = useWindowsStore()
  const searchParams = new URLSearchParams(location.search)
  const defuntoTipoId = searchParams.get('defuntoTipoId')
  const instanceId = searchParams.get('instanceId') || 'default'
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

  // If no defuntoTipoId is provided, redirect to defuntos-tipos page
  if (!defuntoTipoId) {
    navigate('/cemiterios/configuracoes/defuntos/tipos')
    return null
  }

  const { data: defuntoTipoData, isLoading } = useGetDefuntoTipo(defuntoTipoId)

  // Update window state with defuntoTipoId if it's not already set
  useEffect(() => {
    const currentWindow = windows.find(
      (w) => w.path === location.pathname && w.instanceId === instanceId
    )

    if (
      defuntoTipoId &&
      currentWindow &&
      !currentWindow.searchParams?.defuntoTipoId
    ) {
      useWindowsStore.getState().updateWindowState(currentWindow.id, {
        searchParams: { defuntoTipoId },
      })
    }
  }, [defuntoTipoId, instanceId, windows])

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className='flex h-full flex-col gap-8 px-4 md:px-8 md:pb-8 md:pt-28 pt-14 md:mx-0 md:my-4 md:mr-4 md:rounded-xl pb-24'>
      <PageHead title='Atualizar Tipo de Defunto | Luma' />

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
              link: '/cemiterios/configuracoes',
            },
            {
              title: 'Tipos de Defunto',
              link: '/cemiterios/configuracoes/defuntos/tipos',
            },
            {
              title: 'Atualizar',
              link: `/cemiterios/configuracoes/defuntos/tipos/update?defuntoTipoId=${defuntoTipoId}&instanceId=${instanceId}`,
            },
          ]}
        />
      </div>

      <div className='rounded-lg border bg-card'>
        <div className='border-b px-6 py-4'>
          <h2 className='text-base font-medium'>Atualizar Tipo de Defunto</h2>
        </div>
        <div className='p-6'>
          <DefuntoTipoUpdateForm
            modalClose={handleClose}
            defuntoTipoId={defuntoTipoId}
            initialData={{
              descricao: defuntoTipoData?.info?.data?.descricao || '',
            }}
          />
        </div>
      </div>
    </div>
  )
}
