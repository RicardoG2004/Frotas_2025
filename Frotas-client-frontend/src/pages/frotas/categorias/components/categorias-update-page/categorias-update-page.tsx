import { useEffect } from 'react'
import { ArrowLeft } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useFormsStore } from '@/stores/use-forms-store'
import { useWindowsStore } from '@/stores/use-windows-store'
import { handleWindowClose } from '@/utils/window-utils'
import { Button } from '@/components/ui/button'
import { Breadcrumbs } from '@/components/shared/breadcrumbs'
import { PageHead } from '@/components/shared/page-head'
import { useGetCategoria } from '@/pages/frotas/categorias/queries/categorias-queries'
import { CategoriaUpdateForm } from '../categorias-forms/categoria-update-form'

export function CategoriasUpdatePage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { removeFormState } = useFormsStore()
  const { windows, removeWindow } = useWindowsStore()
  const searchParams = new URLSearchParams(location.search)
  const instanceId = searchParams.get('instanceId') || 'default'
  const categoriaId = searchParams.get('categoriaId')
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
  if (!categoriaId) {
    navigate('/frotas/configuracoes/categorias')
    return null
  }

  const { data: categoriaData, isLoading } = useGetCategoria(categoriaId)

  // Update window state with categoriaId if it's not already set
  useEffect(() => {
    const currentWindow = windows.find(
      (w) => w.path === location.pathname && w.instanceId === instanceId
    )

    if (categoriaId && currentWindow && !currentWindow.searchParams?.categoriaId) {
      useWindowsStore.getState().updateWindowState(currentWindow.id, {
        searchParams: { categoriaId },
      })
    }
  }, [categoriaId, instanceId, windows])

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className='flex h-full flex-col gap-8 px-4 md:px-8 md:pb-8 md:pt-28 pt-14 md:mx-0 md:my-4 md:mr-4 md:rounded-xl pb-24'>
      <PageHead title='Atualizar Categoria | Frotas' />

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
              title: 'Categorias',
              link: '/frotas/configuracoes/categorias',
            },
            {
              title: 'Atualizar',
              link: `/frotas/configuracoes/categorias/update?categoriaId=${categoriaId}&instanceId=${instanceId}`,
            },
          ]}
        />
      </div>

      <div className='rounded-lg border bg-card'>
        <div className='border-b px-6 py-4'>
          <h2 className='text-base font-medium'>Atualizar Categoria</h2>
        </div>
        <div className='p-6'>
          <CategoriaUpdateForm
            modalClose={handleClose}
            categoriaId={categoriaId}
            initialData={{
              designacao: categoriaData?.info?.data?.designacao || '',
            }}
          />
        </div>
      </div>
    </div>
  )
}
