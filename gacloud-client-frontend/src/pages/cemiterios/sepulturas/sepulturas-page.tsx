import { usePageData } from '@/utils/page-data-utils'
import { Breadcrumbs } from '@/components/shared/breadcrumbs'
import { DataTableSkeleton } from '@/components/shared/data-table-skeleton'
import { PageHead } from '@/components/shared/page-head'
import { SepulturasTable } from './components/sepulturas-table/sepulturas-table'
import {
  useGetSepulturasPaginated,
  usePrefetchAdjacentSepulturas,
} from './queries/sepulturas-queries'

export function SepulturasPage() {
  const {
    data,
    isLoading,
    page,
    pageSize,
    handleFiltersChange,
    handlePaginationChange,
    handleSortingChange,
  } = usePageData({
    useGetDataPaginated: useGetSepulturasPaginated,
    usePrefetchAdjacentData: usePrefetchAdjacentSepulturas,
  })

  const sepulturas = data?.info?.data || []
  const totalSepulturas = data?.info?.totalCount || 0
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
            title: 'Sepulturas',
            link: '/cemiterios/configuracoes/sepulturas',
          },
        ]}
      />
      <div className='mt-10'>
        <SepulturasTable
          sepulturas={sepulturas}
          page={page}
          pageSize={pageSize}
          total={totalSepulturas}
          pageCount={pageCount}
          onFiltersChange={handleFiltersChange}
          onPaginationChange={handlePaginationChange}
          onSortingChange={handleSortingChange}
        />
      </div>
    </div>
  )
}
