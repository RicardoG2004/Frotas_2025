import { ArrowLeft } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Breadcrumbs } from '@/components/shared/breadcrumbs'
import { PageHead } from '@/components/shared/page-head'
import { ViaturaUpdateForm } from '../viaturas-forms/viatura-update-form'

export function ViaturasUpdatePage() {
  const navigate = useNavigate()
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const viaturaId = searchParams.get('viaturaId') || ''
  const instanceId = searchParams.get('instanceId') || 'default'

  const handleClose = () => {
    navigate('/frotas/viaturas')
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
        <div className='border-b px-6 py-4'>
          <h2 className='text-base font-medium'>Atualizar Viatura</h2>
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

