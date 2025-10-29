import { usePageData } from '@/utils/page-data-utils'
import { Breadcrumbs } from '@/components/shared/breadcrumbs'
import { DataTableSkeleton } from '@/components/shared/data-table-skeleton'
import { PageHead } from '@/components/shared/page-head'
import { TalhoesTable } from './components/talhoes-table/talhoes-table'
import {
  useGetTalhoesPaginated,
  usePrefetchAdjacentTalhoes,
} from './queries/talhoes-queries'

export function TalhoesPage() {
  const {
    data,
    isLoading,
    page,
    pageSize,
    handleFiltersChange,
    handlePaginationChange,
    handleSortingChange,
  } = usePageData({
    useGetDataPaginated: useGetTalhoesPaginated,
    usePrefetchAdjacentData: usePrefetchAdjacentTalhoes,
  })

  const talhoes = data?.info?.data || []
  const totalTalhoes = data?.info?.totalCount || 0
  const pageCount = data?.info?.totalPages || 0

  if (isLoading) {
    return (
      <div className='px-4 md:px-8 md:pb-8 md:pt-28 pt-4 md:mx-0 md:my-4 md:mr-4 md:rounded-xl pb-24'>
        <DataTableSkeleton
          columnCount={6}
          filterableColumnCount={2}
          searchableColumnCount={1}
        />
      </div>
    )
  }

  return (
    <div className='px-4 md:px-8 md:pb-8 md:pt-28 pt-4 md:mx-0 md:my-4 md:mr-4 md:rounded-xl pb-24'>
      <PageHead title='Cemitérios | Luma' />
      <Breadcrumbs
        items={[
          {
            title: 'Configurações',
            link: '/cemiterios/configuracoes',
          },
          {
            title: 'Cemitérios',
            link: '/cemiterios/configuracoes/cemiterios',
          },
          {
            title: 'Zonas',
            link: '/cemiterios/configuracoes/zonas',
          },
          {
            title: 'Talhões',
            link: '/cemiterios/configuracoes/talhoes',
          },
        ]}
      />
      <div className='mt-10'>
        <TalhoesTable
          talhoes={talhoes}
          page={page}
          pageSize={pageSize}
          total={totalTalhoes}
          pageCount={pageCount}
          onFiltersChange={handleFiltersChange}
          onPaginationChange={handlePaginationChange}
          onSortingChange={handleSortingChange}
        />
      </div>
    </div>
  )
}
