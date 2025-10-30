import { ArrowLeft } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useWindowsStore } from '@/stores/use-windows-store'
import { cleanupWindowForms, handleWindowClose } from '@/utils/window-utils'
import { Button } from '@/components/ui/button'
import { Breadcrumbs } from '@/components/shared/breadcrumbs'
import { PageHead } from '@/components/shared/page-head'
import { EntidadeCreateForm } from '../entidades-forms/entidade-create-form'

export function EntidadesCreatePage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { findWindowByPathAndInstanceId, removeWindow } = useWindowsStore()
  const searchParams = new URLSearchParams(location.search)
  const instanceId = searchParams.get('instanceId') || 'default'
  // const formId = instanceId

  // Find the current window
  const currentWindow = findWindowByPathAndInstanceId(
    location.pathname,
    instanceId
  )

  const handleClose = () => {
    // Clean up all forms associated with this window
    cleanupWindowForms(location.pathname)

    if (currentWindow) {
      handleWindowClose(currentWindow.id, navigate, removeWindow)
    }
  }

  return (
    <div className='flex h-full flex-col gap-8 px-4 md:px-8 md:pb-8 md:pt-28 pt-14 md:mx-0 md:my-4 md:mr-4 md:rounded-xl pb-24'>
      <PageHead title='Criar Entidade | Frotas' />

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
              title: 'Entidades',
              link: '/utilitarios/tabelas/configuracoes/entidades',
            },
            {
              title: 'Criar',
              link: `/utilitarios/tabelas/configuracoes/entidades/create?instanceId=${instanceId}`,
            },
          ]}
        />
      </div>

      <div className='rounded-lg border bg-card'>
        <div className='border-b px-6 py-4'>
          <h2 className='text-base font-medium'>Criar Entidade</h2>
        </div>
        <div className='p-6'>
          <EntidadeCreateForm
            onSuccess={handleClose}
            modalClose={handleClose}
            shouldCloseWindow={true}
          />
        </div>
      </div>
    </div>
  )
}
