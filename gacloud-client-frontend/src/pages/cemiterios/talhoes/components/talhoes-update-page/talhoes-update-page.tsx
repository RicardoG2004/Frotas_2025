import { useEffect } from 'react'
import { useGetTalhao } from '@/pages/cemiterios/talhoes/queries/talhoes-queries'
import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import { useFormsStore } from '@/stores/use-forms-store'
import { useWindowsStore } from '@/stores/use-windows-store'
import { handleWindowClose } from '@/utils/window-utils'
import { Button } from '@/components/ui/button'
import { Breadcrumbs } from '@/components/shared/breadcrumbs'
import { PageHead } from '@/components/shared/page-head'
import { TalhaoUpdateForm } from '../talhoes-forms/talhoes-update-form'

export function TalhoesUpdatePage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { removeFormState } = useFormsStore()
  const { windows, removeWindow } = useWindowsStore()
  const searchParams = new URLSearchParams(location.search)
  const talhaoId = searchParams.get('talhaoId')
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

  // If no cemiterioTalhaoId is provided, redirect to talhoes page
  if (!talhaoId) {
    navigate('/cemiterios/configuracoes/talhoes')
    return null
  }

  const { data: talhaoData, isLoading } = useGetTalhao(talhaoId)

  // Update window state with cemiterioTalhaoId if it's not already set
  useEffect(() => {
    const currentWindow = windows.find(
      (w) => w.path === location.pathname && w.instanceId === instanceId
    )

    if (talhaoId && currentWindow && !currentWindow.searchParams?.talhaoId) {
      useWindowsStore.getState().updateWindowState(currentWindow.id, {
        searchParams: { talhaoId },
      })
    }
  }, [talhaoId, instanceId, windows])

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className='flex h-full flex-col gap-8 px-4 md:px-8 md:pb-8 md:pt-28 pt-14 md:mx-0 md:my-4 md:mr-4 md:rounded-xl pb-24'>
      <PageHead title='Atualizar Talhão | Luma' />

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
              title: 'Cemitérios',
              link: '/cemiterios/configuracoes/cemiterios',
            },
            {
              title: 'Zonas',
              link: '/cemiterios/configuracoes/zonas',
            },
            {
              title: 'Talhoes',
              link: '/cemiterios/configuracoes/talhoes',
            },
            {
              title: 'Atualizar',
              link: `/cemiterios/configuracoes/talhoes/update?talhaoId=${talhaoId}&instanceId=${instanceId}`,
            },
          ]}
        />
      </div>

      <div className='rounded-lg border bg-card'>
        <div className='border-b px-6 py-4'>
          <h2 className='text-base font-medium'>Atualizar Talhão</h2>
        </div>
        <div className='p-6'>
          <TalhaoUpdateForm
            modalClose={handleClose}
            talhaoId={talhaoId}
            initialData={{
              nome: talhaoData?.info?.data?.nome || '',
              zonaId: talhaoData?.info?.data?.zonaId || '',
            }}
          />
        </div>
      </div>
    </div>
  )
}
