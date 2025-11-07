import { usePageData } from '@/utils/page-data-utils'
import { Breadcrumbs } from '@/components/shared/breadcrumbs'
import { DataTableSkeleton } from '@/components/shared/data-table-skeleton'
import { PageHead } from '@/components/shared/page-head'
import { GarantiasTable } from './components/garantias-table/garantias-table'
import {
  useGetGarantiasPaginated,
  usePrefetchAdjacentGarantias,
} from './queries/garantias-queries'

export function GarantiasPage() {
  const {
    data,
    isLoading,
    page,
    pageSize,
    handleFiltersChange,
    handlePaginationChange,
    handleSortingChange,
  } = usePageData({
    useGetDataPaginated: useGetGarantiasPaginated,
    usePrefetchAdjacentData: usePrefetchAdjacentGarantias,
  })

  const garantias = data?.info?.data || []
  const totalGarantias = data?.info?.totalCount || 0
  const pageCount = data?.info?.totalPages || 0

  if (isLoading) {
    return (
      <div className='px-4 md:px-8 md:pb-8 md:pt-28 pt-4 md:mx-0 md:my-4 md:mr-4 md:rounded-xl pb-24'>
        <DataTableSkeleton
          columnCount={5}
          filterableColumnCount={3}
          searchableColumnCount={1}
        />
      </div>
    )
  }

  return (
    <div className='px-4 md:px-8 md:pb-8 md:pt-28 pt-4 md:mx-0 md:my-4 md:mr-4 md:rounded-xl pb-24'>
      <PageHead title='Garantias | Frotas' />
      <Breadcrumbs
        items={[
          {
            title: 'Utilitários',
            link: '/utilitarios/tabelas',
          },
          {
            title: 'Garantias',
            link: '/utilitarios/tabelas/configuracoes/garantias',
          },
        ]}
      />
      <div className='mt-10'>
        <GarantiasTable
          garantias={garantias}
          page={page}
          pageSize={pageSize}
          total={totalGarantias}
          pageCount={pageCount}
          onFiltersChange={handleFiltersChange}
          onPaginationChange={handlePaginationChange}
          onSortingChange={handleSortingChange}
        />
      </div>
    </div>
  )
}


