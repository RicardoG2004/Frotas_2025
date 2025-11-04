import { useEffect } from 'react'
import { ArrowLeft } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useFormsStore } from '@/stores/use-forms-store'
import { useWindowsStore } from '@/stores/use-windows-store'
import { handleWindowClose } from '@/utils/window-utils'
import { Button } from '@/components/ui/button'
import { Breadcrumbs } from '@/components/shared/breadcrumbs'
import { PageHead } from '@/components/shared/page-head'
import { useGetSetor } from '../../queries/setores-queries'
import { SetorUpdateForm } from '../setores-forms/setores-update-form'

export function SetoresUpdatePage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { removeFormState } = useFormsStore()
  const { windows, removeWindow } = useWindowsStore()
  const searchParams = new URLSearchParams(location.search)
  const setorId = searchParams.get('setorId')
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

  // If no setorId is provided, redirect to setores page
  if (!setorId) {
    navigate('/utilitarios/tabelas/configuracoes/setores')
    return null
  }

  const { data: setorData, isLoading } = useGetSetor(setorId)

  // Update window state with setorId if it's not already set
  useEffect(() => {
    const currentWindow = windows.find(
      (w) => w.path === location.pathname && w.instanceId === instanceId
    )

    if (
      setorId &&
      currentWindow &&
      !currentWindow.searchParams?.setorId
    ) {
      useWindowsStore.getState().updateWindowState(currentWindow.id, {
        searchParams: {
          ...currentWindow.searchParams,
          setorId,
        },
      })
    }
  }, [setorId, instanceId, windows])

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className='flex h-full flex-col gap-8 px-4 md:px-8 md:pb-8 md:pt-28 pt-14 md:mx-0 md:my-4 md:mr-4 md:rounded-xl pb-24'>
      <PageHead title='Atualizar Setor | Frotas' />

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
              link: '/utilitarios/tabelas/configuracoes',
            },
            {
              title: 'Setores',
              link: '/utilitarios/tabelas/configuracoes/setores',
            },
            {
              title: 'Atualizar',
              link: `/utilitarios/tabelas/configuracoes/setores/update?setorId=${setorId}&instanceId=${instanceId}`,
            },
          ]}
        />
      </div>

      <div className='rounded-lg border bg-card'>
        <div className='border-b px-6 py-4'>
          <h2 className='text-base font-medium'>Atualizar Setor</h2>
        </div>
        <div className='p-6'>
          <SetorUpdateForm
            modalClose={handleClose}
            setorId={setorId}
            initialData={{
              descricao: setorData?.descricao || '',
            }}
          />
        </div>
      </div>
    </div>
  )
}

