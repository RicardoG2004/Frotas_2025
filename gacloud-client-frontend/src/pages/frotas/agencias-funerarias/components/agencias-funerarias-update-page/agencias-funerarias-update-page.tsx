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
import { useGetAgenciaFuneraria } from '../../queries/agencias-funerarias-queries'
import { AgenciaFunerariaUpdateForm } from '../agencias-funerarias-forms/agencia-funeraria-update-form'

export function AgenciasFunerariasUpdatePage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { removeFormState } = useFormsStore()
  const { windows, removeWindow } = useWindowsStore()
  const searchParams = new URLSearchParams(location.search)
  const agenciaFunerariaId = searchParams.get('agenciaFunerariaId')
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

  // If no agenciaFunerariaId is provided, redirect to agencias-funerarias page
  if (!agenciaFunerariaId) {
    navigate('/cemiterios/configuracoes/agencias-funerarias')
    return null
  }

  const { data: agenciaFunerariaData, isLoading } =
    useGetAgenciaFuneraria(agenciaFunerariaId)

  // Update window state with agenciaFunerariaId if it's not already set
  useEffect(() => {
    const currentWindow = windows.find(
      (w) => w.path === location.pathname && w.instanceId === instanceId
    )

    if (
      agenciaFunerariaId &&
      currentWindow &&
      !currentWindow.searchParams?.agenciaFunerariaId
    ) {
      useWindowsStore.getState().updateWindowState(currentWindow.id, {
        searchParams: { agenciaFunerariaId },
      })
    }
  }, [agenciaFunerariaId, instanceId, windows])

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className='flex h-full flex-col gap-8 px-4 md:px-8 md:pb-8 md:pt-28 pt-14 md:mx-0 md:my-4 md:mr-4 md:rounded-xl pb-24'>
      <PageHead title='Atualizar Agência Funerária | Luma' />

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
              title: 'Agências Funerárias',
              link: '/cemiterios/configuracoes/agencias-funerarias',
            },
            {
              title: 'Atualizar',
              link: `/cemiterios/configuracoes/agencias-funerarias/update?agenciaFunerariaId=${agenciaFunerariaId}&instanceId=${instanceId}`,
            },
          ]}
        />
      </div>

      <div className='rounded-lg border bg-card'>
        <div className='border-b px-6 py-4'>
          <h2 className='text-base font-medium'>Atualizar Agência Funerária</h2>
        </div>
        <div className='p-6'>
          <AgenciaFunerariaUpdateForm
            modalClose={handleClose}
            agenciaFunerariaId={agenciaFunerariaId}
            initialData={{
              entidadeId: agenciaFunerariaData?.info?.data?.entidadeId || '',
              historico: agenciaFunerariaData?.info?.data?.historico || false,
            }}
          />
        </div>
      </div>
    </div>
  )
}
