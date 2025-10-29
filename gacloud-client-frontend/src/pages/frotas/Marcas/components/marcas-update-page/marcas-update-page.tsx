import { useEffect } from 'react'
import { ArrowLeft } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useFormsStore } from '@/stores/use-forms-store'
import { useWindowsStore } from '@/stores/use-windows-store'
import { handleWindowClose } from '@/utils/window-utils'
import { Button } from '@/components/ui/button'
import { Breadcrumbs } from '@/components/shared/breadcrumbs'
import { PageHead } from '@/components/shared/page-head'
import { useGetMarca } from '@/pages/frotas/Marcas/queries/marcas-queries'
import { MarcaUpdateForm } from '../marcas-forms/marca-update-form'

export function MarcasUpdatePage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { removeFormState } = useFormsStore()
  const { windows, removeWindow } = useWindowsStore()
  const searchParams = new URLSearchParams(location.search)
  const instanceId = searchParams.get('instanceId') || 'default'
  const marcaId = searchParams.get('marcaId')
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

  // If no marcaId is provided, redirect to marcas page
  if (!marcaId) {
    navigate('/frotas/configuracoes/marcas')
    return null
  }

  const { data: marcaData, isLoading } = useGetMarca(marcaId)

  // Update window state with coveiroId if it's not already set
  useEffect(() => {
    const currentWindow = windows.find(
      (w) => w.path === location.pathname && w.instanceId === instanceId
    )

    if (marcaId && currentWindow && !currentWindow.searchParams?.marcaId) {
      useWindowsStore.getState().updateWindowState(currentWindow.id, {
        searchParams: { marcaId },
      })
    }
  }, [marcaId, instanceId, windows])

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className='flex h-full flex-col gap-8 px-4 md:px-8 md:pb-8 md:pt-28 pt-14 md:mx-0 md:my-4 md:mr-4 md:rounded-xl pb-24'>
      <PageHead title='Atualizar Marca | Luma' />

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
              title: 'Marcas',
              link: '/frotas/configuracoes/marcas',
            },
            {
              title: 'Atualizar',
              link: `/frotas/configuracoes/marcas/update?marcaId=${marcaId}&instanceId=${instanceId}`,
            },
          ]}
        />
      </div>

      <div className='rounded-lg border bg-card'>
        <div className='border-b px-6 py-4'>
          <h2 className='text-base font-medium'>Atualizar Marca</h2>
        </div>
        <div className='p-6'>
          <MarcaUpdateForm
            modalClose={handleClose}
            marcaId={marcaId}
            initialData={{
              nome: marcaData?.info?.data?.nome || '',
            }}
          />
        </div>
      </div>
    </div>
  )
}
