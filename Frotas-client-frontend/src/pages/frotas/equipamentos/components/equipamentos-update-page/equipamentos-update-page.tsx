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
import { useGetEquipamento } from '../../queries/equipamentos-queries'
import EquipamentoUpdateForm from '../equipamentos-forms/equipamento-update-form'

export default function EquipamentosUpdatePage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { removeFormState } = useFormsStore()
  const { windows, removeWindow } = useWindowsStore()
  const searchParams = new URLSearchParams(location.search)
  const equipamentoId = searchParams.get('equipamentoId')
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

  // If no equipamentoId is provided, redirect to equipamentos page
  if (!equipamentoId) {
    navigate('/frotas/configuracoes/equipamentos')
    return null
  }

  const { data: equipamentoData, isLoading } = useGetEquipamento(equipamentoId)

  // Update window state with equipamentoId if it's not already set
  useEffect(() => {
    const currentWindow = windows.find(
      (w) => w.path === location.pathname && w.instanceId === instanceId
    )

    if (equipamentoId && currentWindow && !currentWindow.searchParams?.equipamentoId) {
      useWindowsStore.getState().updateWindowState(currentWindow.id, {
        searchParams: { equipamentoId },
      })
    }
  }, [equipamentoId, instanceId, windows])

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className='flex h-full flex-col gap-8 px-4 md:px-8 md:pb-8 md:pt-28 pt-14 md:mx-0 md:my-4 md:mr-4 md:rounded-xl pb-24'>
      <PageHead title='Atualizar Equipamento | Frotas' />

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
              title: 'Equipamentos',
              link: '/frotas/configuracoes/equipamentos',
            },
            {
              title: 'Atualizar',
              link: `/frotas/configuracoes/equipamentos/update?equipamentoId=${equipamentoId}&instanceId=${instanceId}`,
            },
          ]}
        />
      </div>

      <div className='rounded-lg border bg-card'>
        <div className='border-b px-6 py-4'>
          <h2 className='text-base font-medium'>Atualizar Equipamento</h2>
        </div>
        <div className='p-6'>
          <EquipamentoUpdateForm
            modalClose={handleClose}
            equipamentoId={equipamentoId}
            initialData={{
              designacao: equipamentoData?.info?.data?.designacao || '',
              garantia: equipamentoData?.info?.data?.garantia || '',
              obs: equipamentoData?.info?.data?.obs || '',
            }}
          />
        </div>
      </div>
    </div>
  )
}
