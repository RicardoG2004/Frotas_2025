import { usePageData } from '@/utils/page-data-utils'
import { Breadcrumbs } from '@/components/shared/breadcrumbs'
import { DataTableSkeleton } from '@/components/shared/data-table-skeleton'
import { PageHead } from '@/components/shared/page-head'
import { ManutencoesTable } from './components/manutencoes-table/manutencoes-table'
import {
  useGetManutencoesPaginated,
  usePrefetchAdjacentManutencoes,
} from './queries/manutencoes-queries'

export function ManutencoesPage() {
  const {
    data,
    isLoading,
    page,
    pageSize,
    handleFiltersChange,
    handlePaginationChange,
    handleSortingChange,
  } = usePageData({
    useGetDataPaginated: useGetManutencoesPaginated,
    usePrefetchAdjacentData: usePrefetchAdjacentManutencoes,
  })

  const manutencoes = data?.info?.data || []
  const totalManutencoes = data?.info?.totalCount || 0
  const pageCount = data?.info?.totalPages || 0

  if (isLoading) {
    return (
      <div className='px-4 md:px-8 md:pb-8 md:pt-28 pt-4 md:mx-0 md:my-4 md:mr-4 md:rounded-xl pb-24'>
        <DataTableSkeleton
          columnCount={10}
          filterableColumnCount={4}
          searchableColumnCount={1}
        />
      </div>
    )
  }

  return (
    <div className='px-4 md:px-8 md:pb-8 md:pt-28 pt-4 md:mx-0 md:my-4 md:mr-4 md:rounded-xl pb-24'>
      <PageHead title='Manutenções | Frotas' />
      <Breadcrumbs
        items={[
          {
            title: 'Frotas',
            link: '/frotas',
          },
          {
            title: 'Manutenções',
            link: '/frotas/manutencoes',
          },
        ]}
      />
      <div className='mt-10'>
        <ManutencoesTable
          manutencoes={manutencoes}
          page={page}
          pageSize={pageSize}
          total={totalManutencoes}
          pageCount={pageCount}
          onFiltersChange={handleFiltersChange}
          onPaginationChange={handlePaginationChange}
          onSortingChange={handleSortingChange}
        />
      </div>
    </div>
  )
}

