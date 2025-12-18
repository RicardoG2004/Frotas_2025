import { ArrowLeft, MoreVertical } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Breadcrumbs } from '@/components/shared/breadcrumbs'
import { PageHead } from '@/components/shared/page-head'
import { useFormsStore } from '@/stores/use-forms-store'
import { useWindowsStore } from '@/stores/use-windows-store'
import { handleWindowClose, generateInstanceId } from '@/utils/window-utils'
import { ViaturaUpdateForm } from '../viaturas-forms/viatura-update-form'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Wrench, Car } from 'lucide-react'

export function ViaturasUpdatePage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { removeFormState } = useFormsStore()
  const { windows, removeWindow } = useWindowsStore()
  const searchParams = new URLSearchParams(location.search)
  const viaturaId = searchParams.get('viaturaId') || ''
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

  return (
    <div className='flex h-full flex-col gap-8 px-4 pb-24 pt-14 md:mx-0 md:my-4 md:mr-4 md:rounded-xl md:px-8 md:pb-8 md:pt-28'>
      <PageHead title='Atualizar Viatura | Frotas' />

      <div className='flex items-center gap-4'>
        <Button variant='ghost' size='icon' onClick={handleClose} className='h-8 w-8'>
          <ArrowLeft className='h-4 w-4' />
        </Button>
        <Breadcrumbs
          items={[
            {
              title: 'Frotas',
              link: '/frotas',
            },
            {
              title: 'Viaturas',
              link: '/frotas/viaturas',
            },
            {
              title: 'Atualizar',
              link: `/frotas/viaturas/update?viaturaId=${viaturaId}&instanceId=${instanceId}`,
            },
          ]}
        />
      </div>

      <div className='rounded-lg border bg-card'>
        <div className='border-b px-6 py-4 flex items-center justify-between'>
          <h2 className='text-base font-medium'>Atualizar Viatura</h2>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='ghost' size='icon' className='h-8 w-8'>
                <MoreVertical className='h-4 w-4' />
                <span className='sr-only'>Mais opções</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuItem
                onClick={() => {
                  const instanceId = generateInstanceId()
                  navigate(`/frotas/manutencoes?viaturaId=${viaturaId}&instanceId=${instanceId}`)
                }}
              >
                <Wrench className='mr-2 h-4 w-4' />
                Ver Manutenções
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  const instanceId = generateInstanceId()
                  navigate(`/frotas/utilizacoes?viaturaId=${viaturaId}&instanceId=${instanceId}`)
                }}
              >
                <Car className='mr-2 h-4 w-4' />
                Ver Utilizações
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className='p-6'>
          {viaturaId ? (
            <ViaturaUpdateForm viaturaId={viaturaId} />
          ) : (
            <div className='rounded-lg border border-destructive/30 bg-destructive/5 p-6 text-sm text-destructive'>
              Identificador da viatura não fornecido.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

