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
import { useGetRua } from '../../queries/ruas-queries'
import { RuaUpdateForm } from '../ruas-forms/rua-update-form'

export function RuasUpdatePage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { removeFormState } = useFormsStore()
  const { windows, removeWindow } = useWindowsStore()
  const searchParams = new URLSearchParams(location.search)
  const ruaId = searchParams.get('ruaId')
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

  // If no ruaId is provided, redirect to ruas page
  if (!ruaId) {
    navigate('/utilitarios/tabelas/geograficas/ruas')
    return null
  }

  const { data: ruaData, isLoading } = useGetRua(ruaId)

  // Update window state with ruaId if it's not already set
  useEffect(() => {
    const currentWindow = windows.find(
      (w) => w.path === location.pathname && w.instanceId === instanceId
    )

    if (ruaId && currentWindow && !currentWindow.searchParams?.ruaId) {
      useWindowsStore.getState().updateWindowState(currentWindow.id, {
        searchParams: { ruaId },
      })
    }
  }, [ruaId, instanceId, windows])

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className='flex h-full flex-col gap-8 px-4 md:px-8 md:pb-8 md:pt-28 pt-14 md:mx-0 md:my-4 md:mr-4 md:rounded-xl pb-24'>
      <PageHead title='Atualizar Rua | Frotas' />

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
              title: 'Geográficas',
              link: '/utilitarios/tabelas/geograficas',
            },
            {
              title: 'Ruas',
              link: '/utilitarios/tabelas/geograficas/ruas',
            },
            {
              title: 'Atualizar',
              link: `/utilitarios/tabelas/geograficas/ruas/update?ruaId=${ruaId}&instanceId=${instanceId}`,
            },
          ]}
        />
      </div>

      <div className='rounded-lg border bg-card'>
        <div className='border-b px-6 py-4'>
          <h2 className='text-base font-medium'>Atualizar Rua</h2>
        </div>
        <div className='p-6'>
          <RuaUpdateForm
            modalClose={handleClose}
            ruaId={ruaId}
            initialData={{
              nome: ruaData?.info?.data?.nome || '',
              freguesiaId: ruaData?.info?.data?.freguesiaId || '',
              codigoPostalId: ruaData?.info?.data?.codigoPostalId || '',
            }}
          />
        </div>
      </div>
    </div>
  )
}
