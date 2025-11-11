import { usePageData } from '@/utils/page-data-utils'
import { Breadcrumbs } from '@/components/shared/breadcrumbs'
import { DataTableSkeleton } from '@/components/shared/data-table-skeleton'
import { PageHead } from '@/components/shared/page-head'
import { ViaturasTable } from './components/viaturas-table/viaturas-table'
import {
  useGetViaturasPaginated,
  usePrefetchAdjacentViaturas,
} from './queries/viaturas-queries'

export function ViaturasPage() {
  const {
    data,
    isLoading,
    page,
    pageSize,
    handleFiltersChange,
    handlePaginationChange,
    handleSortingChange,
  } = usePageData({
    useGetDataPaginated: useGetViaturasPaginated,
    usePrefetchAdjacentData: usePrefetchAdjacentViaturas,
  })

  const viaturas = data?.info?.data || []
  const totalViaturas = data?.info?.totalCount || 0
  const pageCount = data?.info?.totalPages || 0

  if (isLoading) {
    return (
      <div className='px-4 pb-24 pt-4 md:mx-0 md:my-4 md:mr-4 md:rounded-xl md:px-8 md:pb-8 md:pt-28'>
        <DataTableSkeleton
          columnCount={7}
          filterableColumnCount={4}
          searchableColumnCount={1}
        />
      </div>
    )
  }

  return (
    <div className='px-4 pb-24 pt-4 md:mx-0 md:my-4 md:mr-4 md:rounded-xl md:px-8 md:pb-8 md:pt-28'>
      <PageHead title='Viaturas | Frotas' />
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
        ]}
      />
      <div className='mt-10'>
        <ViaturasTable
          viaturas={viaturas}
          page={page}
          pageSize={pageSize}
          total={totalViaturas}
          pageCount={pageCount}
          onFiltersChange={handleFiltersChange}
          onPaginationChange={handlePaginationChange}
          onSortingChange={handleSortingChange}
        />
      </div>
    </div>
  )
}

