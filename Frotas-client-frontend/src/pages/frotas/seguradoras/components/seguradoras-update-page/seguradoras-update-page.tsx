import { useEffect } from 'react'
import { ArrowLeft } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useFormsStore } from '@/stores/use-forms-store'
import { useWindowsStore } from '@/stores/use-windows-store'
import { handleWindowClose } from '@/utils/window-utils'
import { Button } from '@/components/ui/button'
import { Breadcrumbs } from '@/components/shared/breadcrumbs'
import { PageHead } from '@/components/shared/page-head'
import { useGetSeguradora } from '@/pages/frotas/seguradoras/queries/seguradoras-queries'
import { SeguradoraUpdateForm } from '../seguradoras-forms/seguradora-update-form'

export function SeguradorasUpdatePage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { removeFormState } = useFormsStore()
  const { windows, removeWindow } = useWindowsStore()
  const searchParams = new URLSearchParams(location.search)
  const instanceId = searchParams.get('instanceId') || 'default'
  const seguradoraId = searchParams.get('seguradoraId')
  const formId = instanceId

  const handleClose = () => {
    removeFormState(formId)

    const currentWindow = windows.find(
      (w) => w.path === location.pathname && w.instanceId === instanceId
    )

    if (currentWindow) {
      handleWindowClose(currentWindow.id, navigate, removeWindow)
    }
  }

  if (!seguradoraId) {
    navigate('/frotas/configuracoes/seguradoras')
    return null
  }

  const { data: seguradoraData, isLoading } = useGetSeguradora(seguradoraId)

  useEffect(() => {
    const currentWindow = windows.find(
      (w) => w.path === location.pathname && w.instanceId === instanceId
    )

    if (
      seguradoraId &&
      currentWindow &&
      !currentWindow.searchParams?.seguradoraId
    ) {
      useWindowsStore.getState().updateWindowState(currentWindow.id, {
        searchParams: { seguradoraId },
      })
    }
  }, [seguradoraId, instanceId, windows, location.pathname])

  if (isLoading) {
    return <div>A carregar...</div>
  }

  return (
    <div className='flex h-full flex-col gap-8 px-4 md:px-8 md:pb-8 md:pt-28 pt-14 md:mx-0 md:my-4 md:mr-4 md:rounded-xl pb-24'>
      <PageHead title='Atualizar Seguradora | Frotas' />

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
              title: 'Seguradoras',
              link: '/frotas/configuracoes/seguradoras',
            },
            {
              title: 'Atualizar',
              link: `/frotas/configuracoes/seguradoras/update?seguradoraId=${seguradoraId}&instanceId=${instanceId}`,
            },
          ]}
        />
      </div>

      <div className='rounded-lg border bg-card'>
        <div className='border-b px-6 py-4'>
          <h2 className='text-base font-medium'>Atualizar Seguradora</h2>
        </div>
        <div className='p-6'>
          <SeguradoraUpdateForm
            modalClose={handleClose}
            seguradoraId={seguradoraId}
            initialData={{
              descricao: seguradoraData?.info?.data?.descricao || '',
            }}
          />
        </div>
      </div>
    </div>
  )
}


