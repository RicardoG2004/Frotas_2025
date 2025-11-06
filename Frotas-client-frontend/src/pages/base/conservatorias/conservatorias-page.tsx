import { usePageData } from '@/utils/page-data-utils'
import { Breadcrumbs } from '@/components/shared/breadcrumbs'
import { DataTableSkeleton } from '@/components/shared/data-table-skeleton'
import { PageHead } from '@/components/shared/page-head'
import { ConservatoriasTable } from './components/conservatorias-table/conservatorias-table'
import {
  useGetConservatoriasPaginated,
  usePrefetchAdjacentConservatorias,
} from './queries/conservatorias-queries'

export function ConservatoriasPage() {
  const {
    data,
    isLoading,
    page,
    pageSize,
    handleFiltersChange,
    handlePaginationChange,
    handleSortingChange,
  } = usePageData({
    useGetDataPaginated: useGetConservatoriasPaginated,
    usePrefetchAdjacentData: usePrefetchAdjacentConservatorias,
  })

  const conservatorias = data?.info?.data || []
  const totalConservatorias = data?.info?.totalCount || 0
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
      <PageHead title='Setores | Frotas' />
      <Breadcrumbs
        items={[
          {
            title: 'Configurações',
            link: '/utilitarios/tabelas/configuracoes',
          },
          {
            title: 'Conservatorias',
            link: '/utilitarios/tabelas/configuracoes/conservatorias',
          },
        ]}
      />
      <div className='mt-10'>
        <ConservatoriasTable
          conservatorias={conservatorias}
          page={page}
          pageSize={pageSize}
          total={totalConservatorias}
          pageCount={pageCount}
          onFiltersChange={handleFiltersChange}
          onPaginationChange={handlePaginationChange}
          onSortingChange={handleSortingChange}
        />
      </div>
    </div>
  )
}

