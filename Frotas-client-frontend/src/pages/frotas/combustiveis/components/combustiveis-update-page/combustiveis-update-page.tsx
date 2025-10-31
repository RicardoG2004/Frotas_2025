import { useEffect } from 'react'
import { ArrowLeft } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useFormsStore } from '@/stores/use-forms-store'
import { useWindowsStore } from '@/stores/use-windows-store'
import { handleWindowClose } from '@/utils/window-utils'
import { Button } from '@/components/ui/button'
import { Breadcrumbs } from '@/components/shared/breadcrumbs'
import { PageHead } from '@/components/shared/page-head'
import { useGetCombustivel } from '../../queries/combustiveis-queries'
import { CombustivelUpdateForm } from '../combustiveis-forms'

export function CombustiveisUpdatePage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { removeFormState } = useFormsStore()
  const { windows, removeWindow } = useWindowsStore()
  const searchParams = new URLSearchParams(location.search)
  const instanceId = searchParams.get('instanceId') || 'default'
  const combustivelId = searchParams.get('combustivelId')
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

  // If no combustivelId is provided, redirect to combustiveis page
  if (!combustivelId) {
    navigate('/frotas/configuracoes/combustiveis')
    return null
  }

  const { data: combustivelData, isLoading } = useGetCombustivel(combustivelId)

  // Update window state with combustivelId if it's not already set
  useEffect(() => {
    const currentWindow = windows.find(
      (w) => w.path === location.pathname && w.instanceId === instanceId
    )

    if (combustivelId && currentWindow && !currentWindow.searchParams?.combustivelId) {
      useWindowsStore.getState().updateWindowState(currentWindow.id, {
        searchParams: { combustivelId },
      })
    }
  }, [combustivelId, instanceId, windows])

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className='flex h-full flex-col gap-8 px-4 md:px-8 md:pb-8 md:pt-28 pt-14 md:mx-0 md:my-4 md:mr-4 md:rounded-xl pb-24'>
      <PageHead title='Atualizar Combustível | Frotas' />

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
              title: 'Combustíveis',
              link: '/frotas/configuracoes/combustiveis',
            },
            {
              title: 'Atualizar',
              link: `/frotas/configuracoes/combustiveis/update?combustivelId=${combustivelId}&instanceId=${instanceId}`,
            },
          ]}
        />
      </div>

      <div className='rounded-lg border bg-card'>
        <div className='border-b px-6 py-4'>
          <h2 className='text-base font-medium'>Atualizar Combustível</h2>
        </div>
        <div className='p-6'>
          <CombustivelUpdateForm
            modalClose={handleClose}
            combustivelId={combustivelId}
            combustivelData={{
              nome: combustivelData?.info?.data?.nome || '',
              precoLitro: combustivelData?.info?.data?.precoLitro || 0,
            }}
          />
        </div>
      </div>
    </div>
  )
}
