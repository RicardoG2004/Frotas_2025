import { usePageData } from '@/utils/page-data-utils'
import { Breadcrumbs } from '@/components/shared/breadcrumbs'
import { DataTableSkeleton } from '@/components/shared/data-table-skeleton'
import { PageHead } from '@/components/shared/page-head'
import { CombustiveisTable } from './components/combustiveis-table/combustiveis-table'
import {
  useGetCombustiveisPaginated,
  usePrefetchAdjacentCombustiveis,
} from './queries/combustiveis-queries'

export function CombustiveisPage() {
  const {
    data,
    isLoading,
    page,
    pageSize,
    handleFiltersChange,
    handlePaginationChange,
    handleSortingChange,
  } = usePageData({
    useGetDataPaginated: useGetCombustiveisPaginated,
    usePrefetchAdjacentData: usePrefetchAdjacentCombustiveis,
  })

  const combustiveis = data?.info?.data || []
  const totalCombustiveis = data?.info?.totalCount || 0
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
      <PageHead title='Combustíveis | Frotas' />
      <Breadcrumbs
        items={[
          {
            title: 'Configurações',
            link: '/frotas/configuracoes',
          },
          {
            title: 'Combustíveis',
            link: '/frotas/configuracoes/combustiveis',
          },
        ]}
      />
      <div className='mt-10'>
        <CombustiveisTable
          combustiveis={combustiveis}
          page={page}
          pageSize={pageSize}
          total={totalCombustiveis}
          pageCount={pageCount}
          onFiltersChange={handleFiltersChange}
          onPaginationChange={handlePaginationChange}
          onSortingChange={handleSortingChange}
        />
      </div>
    </div>
  )
}
