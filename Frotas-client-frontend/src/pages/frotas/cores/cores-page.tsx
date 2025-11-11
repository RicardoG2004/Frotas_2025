import { usePageData } from '@/utils/page-data-utils'
import { Breadcrumbs } from '@/components/shared/breadcrumbs'
import { DataTableSkeleton } from '@/components/shared/data-table-skeleton'
import { PageHead } from '@/components/shared/page-head'
import { CoresTable } from './components/cores-table/cores-table'
import {
  useGetCoresPaginated,
  usePrefetchAdjacentCores,
} from './queries/cores-queries'

export function CoresPage() {
  const {
    data,
    isLoading,
    page,
    pageSize,
    handleFiltersChange,
    handlePaginationChange,
    handleSortingChange,
  } = usePageData({
    useGetDataPaginated: useGetCoresPaginated,
    usePrefetchAdjacentData: usePrefetchAdjacentCores,
  })

  const cores = data?.info?.data || []
  const totalCores = data?.info?.totalCount || 0
  const pageCount = data?.info?.totalPages || 0

  if (isLoading) {
    return (
      <div className='px-4 md:px-8 md:pb-8 md:pt-28 pt-4 md:mx-0 md:my-4 md:mr-4 md:rounded-xl pb-24'>
        <DataTableSkeleton
          columnCount={3}
          filterableColumnCount={1}
          searchableColumnCount={1}
        />
      </div>
    )
  }

  return (
    <div className='px-4 md:px-8 md:pb-8 md:pt-28 pt-4 md:mx-0 md:my-4 md:mr-4 md:rounded-xl pb-24'>
      <PageHead title='Cores | Frotas' />
      <Breadcrumbs
        items={[
          {
            title: 'Frotas',
            link: '/frotas/configuracoes',
          },
          {
            title: 'Cores',
            link: '/frotas/configuracoes/cores',
          },
        ]}
      />
      <div className='mt-10'>
        <CoresTable
          cores={cores}
          page={page}
          pageSize={pageSize}
          total={totalCores}
          pageCount={pageCount}
          onFiltersChange={handleFiltersChange}
          onPaginationChange={handlePaginationChange}
          onSortingChange={handleSortingChange}
        />
      </div>
    </div>
  )
}

