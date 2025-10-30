import { usePageData } from '@/utils/page-data-utils'
import { Breadcrumbs } from '@/components/shared/breadcrumbs'
import { DataTableSkeleton } from '@/components/shared/data-table-skeleton'
import { PageHead } from '@/components/shared/page-head'
import { ModelosTable } from './components/modelos-table/modelos-table'
import {
  useGetModelosPaginated,
  usePrefetchAdjacentModelos,
} from './queries/modelos-queries'

export function ModelosPage() {
  const {
    data,
    isLoading,
    page,
    pageSize,
    handleFiltersChange,
    handlePaginationChange,
    handleSortingChange,
  } = usePageData({
    useGetDataPaginated: useGetModelosPaginated,
    usePrefetchAdjacentData: usePrefetchAdjacentModelos,
  })

  const modelos = data?.info?.data || []
  const totalModelos = data?.info?.totalCount || 0
  const pageCount = data?.info?.totalPages || 0

  if (isLoading) {
    return (
      <div className='px-4 md:px-8 md:pb-8 md:pt-28 pt-4 md:mx-0 md:my-4 md:mr-4 md:rounded-xl pb-24'>
        <DataTableSkeleton
          columnCount={6}
          filterableColumnCount={5}
          searchableColumnCount={1}
        />
      </div>
    )
  }

  return (
    <div className='px-4 md:px-8 md:pb-8 md:pt-28 pt-4 md:mx-0 md:my-4 md:mr-4 md:rounded-xl pb-24'>
      <PageHead title='Modelos | Luma' />
      <Breadcrumbs
        items={[
          {
            title: 'Configurações',
            link: '/frotas/configuracoes',
          },
          {
            title: 'Modelos',
            link: '/frotas/configuracoes/modelos',
          },
        ]}
      />
      <div className='mt-10'>
        <ModelosTable
          modelos={modelos}
          page={page}
          pageSize={pageSize}
          total={totalModelos}
          pageCount={pageCount}
          onFiltersChange={handleFiltersChange}
          onPaginationChange={handlePaginationChange}
          onSortingChange={handleSortingChange}
        />
      </div>
    </div>
  )
}
