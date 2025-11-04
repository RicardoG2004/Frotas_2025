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
import { useGetPeca } from '../../queries/pecas-queries'
import { PecaUpdateForm } from '../pecas-forms/peca-update-form'

export function PecasUpdatePage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { removeFormState } = useFormsStore()
  const { windows, removeWindow } = useWindowsStore()
  const searchParams = new URLSearchParams(location.search)
  const pecaId = searchParams.get('pecaId')
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

  // If no pecaId is provided, redirect to pecas page
  if (!pecaId) {
    navigate('/frotas/configuracoes/pecas')
    return null
  }

  const { data: pecaData, isLoading } = useGetPeca(pecaId)

  // Update window state with pecaId if it's not already set
  useEffect(() => {
    const currentWindow = windows.find(
      (w) => w.path === location.pathname && w.instanceId === instanceId
    )

    if (pecaId && currentWindow && !currentWindow.searchParams?.pecaId) {
      useWindowsStore.getState().updateWindowState(currentWindow.id, {
        searchParams: { pecaId },
      })
    }
  }, [pecaId, instanceId, windows])

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className='flex h-full flex-col gap-8 px-4 md:px-8 md:pb-8 md:pt-28 pt-14 md:mx-0 md:my-4 md:mr-4 md:rounded-xl pb-24'>
      <PageHead title='Atualizar Peça | Frotas' />

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
              title: 'Peças',
              link: '/frotas/configuracoes/pecas',
            },
            {
              title: 'Atualizar',
              link: `/frotas/configuracoes/pecas/update?pecaId=${pecaId}&instanceId=${instanceId}`,
            },
          ]}
        />
      </div>

      <div className='rounded-lg border bg-card'>
        <div className='border-b px-6 py-4'>
          <h2 className='text-base font-medium'>Atualizar Peça</h2>
        </div>
        <div className='p-6'>
          <PecaUpdateForm
            modalClose={handleClose}
            pecaId={pecaId}
            initialData={{
              designacao: pecaData?.info?.data?.designacao || '',
              anos: pecaData?.info?.data?.anos || 0,
              kms: pecaData?.info?.data?.kms || 0,
              tipo: pecaData?.info?.data?.tipo || '',
              taxaIvaId: pecaData?.info?.data?.taxaIvaId || '',
              custo: pecaData?.info?.data?.custo || 0,
            }}
          />
        </div>
      </div>
    </div>
  )
}

