import { useEffect } from 'react'
import { ArrowLeft } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useFormsStore } from '@/stores/use-forms-store'
import { useWindowsStore } from '@/stores/use-windows-store'
import { handleWindowClose } from '@/utils/window-utils'
import { Button } from '@/components/ui/button'
import { Breadcrumbs } from '@/components/shared/breadcrumbs'
import { PageHead } from '@/components/shared/page-head'
import { useGetCoveiro } from '../../queries/coveiros-queries'
import { CoveiroUpdateForm } from '../coveiros-forms/coveiro-update-form'

export function CoveirosUpdatePage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { removeFormState } = useFormsStore()
  const { windows, removeWindow } = useWindowsStore()
  const searchParams = new URLSearchParams(location.search)
  const instanceId = searchParams.get('instanceId') || 'default'
  const coveiroId = searchParams.get('coveiroId')
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

  // If no coveiroId is provided, redirect to coveiros page
  if (!coveiroId) {
    navigate('/cemiterios/configuracoes/coveiros')
    return null
  }

  const { data: coveiroData, isLoading } = useGetCoveiro(coveiroId)

  // Update window state with coveiroId if it's not already set
  useEffect(() => {
    const currentWindow = windows.find(
      (w) => w.path === location.pathname && w.instanceId === instanceId
    )

    if (coveiroId && currentWindow && !currentWindow.searchParams?.coveiroId) {
      useWindowsStore.getState().updateWindowState(currentWindow.id, {
        searchParams: { coveiroId },
      })
    }
  }, [coveiroId, instanceId, windows])

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className='flex h-full flex-col gap-8 px-4 md:px-8 md:pb-8 md:pt-28 pt-14 md:mx-0 md:my-4 md:mr-4 md:rounded-xl pb-24'>
      <PageHead title='Atualizar Coveiro | Luma' />

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
              title: 'Coveiros',
              link: '/cemiterios/configuracoes/coveiros',
            },
            {
              title: 'Atualizar',
              link: `/cemiterios/configuracoes/coveiros/update?coveiroId=${coveiroId}&instanceId=${instanceId}`,
            },
          ]}
        />
      </div>

      <div className='rounded-lg border bg-card'>
        <div className='border-b px-6 py-4'>
          <h2 className='text-base font-medium'>Atualizar Coveiro</h2>
        </div>
        <div className='p-6'>
          <CoveiroUpdateForm
            modalClose={handleClose}
            coveiroId={coveiroId}
            initialData={{
              nome: coveiroData?.info?.data?.nome || '',
              ruaId: coveiroData?.info?.data?.ruaId || '',
              codigoPostalId: coveiroData?.info?.data?.codigoPostalId || '',
              historico: coveiroData?.info?.data?.historico || false,
            }}
          />
        </div>
      </div>
    </div>
  )
}
