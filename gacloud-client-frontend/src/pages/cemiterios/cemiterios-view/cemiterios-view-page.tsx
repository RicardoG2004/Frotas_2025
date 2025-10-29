import { PageHead } from '@/components/shared/page-head'
import CemiteriosView from './cemiterios-view'

export function CemiteriosViewPage() {
  return (
    <div className='min-h-screen pt-0 md:pt-16'>
      <PageHead title='Cemitérios | Luma' />
      <div className='h-[calc(100vh-4rem)]'>
        <CemiteriosView />
      </div>
    </div>
  )
}
