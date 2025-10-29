import { PageHead } from '@/components/shared/page-head'
import CemiteriosMapa from './cemiterios-mapa'

export function CemiteriosMapaPage() {
  return (
    <div className='min-h-screen pt-16'>
      <PageHead title='Mapa de Cemitérios | Luma' />
      <div className='h-[calc(100vh-4rem)]'>
        <CemiteriosMapa />
      </div>
    </div>
  )
}
