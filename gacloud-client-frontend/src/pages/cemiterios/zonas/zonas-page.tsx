import { usePageData } from '@/utils/page-data-utils'
import { Breadcrumbs } from '@/components/shared/breadcrumbs'
import { DataTableSkeleton } from '@/components/shared/data-table-skeleton'
import { PageHead } from '@/components/shared/page-head'
import { ZonasTable } from './components/zonas-table/zonas-table'
import {
  useGetZonasPaginated,
  usePrefetchAdjacentZonas,
} from './queries/zonas-queries'

export function ZonasPage() {
  const {
    data,
    isLoading,
    page,
    pageSize,
    handleFiltersChange,
    handlePaginationChange,
    handleSortingChange,
  } = usePageData({
    useGetDataPaginated: useGetZonasPaginated,
    usePrefetchAdjacentData: usePrefetchAdjacentZonas,
  })

  const zonas = data?.info?.data || []
  const totalZonas = data?.info?.totalCount || 0
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
        ]}
      />
      <div className='mt-10'>
        <ZonasTable
          zonas={zonas}
          page={page}
          pageSize={pageSize}
          total={totalZonas}
          pageCount={pageCount}
          onFiltersChange={handleFiltersChange}
          onPaginationChange={handlePaginationChange}
          onSortingChange={handleSortingChange}
        />
      </div>
    </div>
  )
}
