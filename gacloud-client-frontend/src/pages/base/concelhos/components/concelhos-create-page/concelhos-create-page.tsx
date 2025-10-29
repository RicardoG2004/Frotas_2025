// import { useRef } from 'react'
import { ArrowLeft } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useFormsStore } from '@/stores/use-forms-store'
import { useWindowsStore } from '@/stores/use-windows-store'
import { handleWindowClose } from '@/utils/window-utils'
import { Button } from '@/components/ui/button'
import { Breadcrumbs } from '@/components/shared/breadcrumbs'
import { PageHead } from '@/components/shared/page-head'
import { ConcelhoCreateForm } from '../concelhos-forms/concelho-create-form'

export function ConcelhosCreatePage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { removeFormState } = useFormsStore()
  const { windows, removeWindow } = useWindowsStore()
  const searchParams = new URLSearchParams(location.search)
  const instanceId = searchParams.get('instanceId') || 'default'
  const formId = instanceId

  // Use a ref to track if this is the first render
  // const isFirstRender = useRef(true)

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

  return (
    <div className='flex h-full flex-col gap-8 px-4 md:px-8 md:pb-8 md:pt-28 pt-14 md:mx-0 md:my-4 md:mr-4 md:rounded-xl pb-24'>
      <PageHead title='Criar Concelho | Luma' />

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
              title: 'Países',
              link: '/utilitarios/tabelas/geograficas/paises',
            },
            {
              title: 'Distritos',
              link: '/utilitarios/tabelas/geograficas/distritos',
            },
            {
              title: 'Concelhos',
              link: '/utilitarios/tabelas/geograficas/concelhos',
            },
            {
              title: 'Criar',
              link: `/utilitarios/tabelas/geograficas/concelhos/create?instanceId=${instanceId}`,
            },
          ]}
        />
      </div>

      <div className='rounded-lg border bg-card'>
        <div className='border-b px-6 py-4'>
          <h2 className='text-base font-medium'>Criar Concelho</h2>
        </div>
        <div className='p-6'>
          <ConcelhoCreateForm modalClose={handleClose} />
        </div>
      </div>
    </div>
  )
}
