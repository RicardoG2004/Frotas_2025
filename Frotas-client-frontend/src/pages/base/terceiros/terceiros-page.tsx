import { usePageData } from '@/utils/page-data-utils'
import { Breadcrumbs } from '@/components/shared/breadcrumbs'
import { DataTableSkeleton } from '@/components/shared/data-table-skeleton'
import { PageHead } from '@/components/shared/page-head'
import { TerceirosTable } from './components/terceiros-table/terceiros-table'
import {
  useGetTerceirosPaginated,
  usePrefetchAdjacentTerceiros,
} from './queries/terceiros-queries'

export function TerceirosPage() {
  const {
    data,
    isLoading,
    page,
    pageSize,
    handleFiltersChange,
    handlePaginationChange,
    handleSortingChange,
  } = usePageData({
    useGetDataPaginated: useGetTerceirosPaginated,
    usePrefetchAdjacentData: usePrefetchAdjacentTerceiros,
  })

  const terceiros = data?.info?.data || []
  const totalTerceiros = data?.info?.totalCount || 0
  const pageCount = data?.info?.totalPages || 0

  if (isLoading) {
    return (
      <div className='px-4 md:px-8 md:pb-8 md:pt-28 pt-4 md:mx-0 md:my-4 md:mr-4 md:rounded-xl pb-24'>
        <DataTableSkeleton
          columnCount={7}
          filterableColumnCount={4}
          searchableColumnCount={1}
        />
      </div>
    )
  }

  return (
    <div className='px-4 md:px-8 md:pb-8 md:pt-28 pt-4 md:mx-0 md:my-4 md:mr-4 md:rounded-xl pb-24'>
      <PageHead title='Outros Devedores/Credores | Frotas' />
      <Breadcrumbs
        items={[
          {
            title: 'Configurações',
            link: '/utilitarios/tabelas/configuracoes',
          },
          {
            title: 'Outros Devedores/Credores',
            link: '/utilitarios/tabelas/configuracoes/terceiros',
          },
        ]}
      />
      <div className='mt-10'>
        <TerceirosTable
          terceiros={terceiros}
          page={page}
          pageSize={pageSize}
          total={totalTerceiros}
          pageCount={pageCount}
          onFiltersChange={handleFiltersChange}
          onPaginationChange={handlePaginationChange}
          onSortingChange={handleSortingChange}
        />
      </div>
    </div>
  )
}


