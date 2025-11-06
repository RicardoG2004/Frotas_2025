import { usePageData } from '@/utils/page-data-utils'
import { Breadcrumbs } from '@/components/shared/breadcrumbs'
import { DataTableSkeleton } from '@/components/shared/data-table-skeleton'
import { PageHead } from '@/components/shared/page-head'
import { DelegacoesTable } from './components/delegacoes-table/delegacoes-table'
import {
  useGetDelegacoesPaginated,
  usePrefetchAdjacentDelegacoes,
} from './queries/delegacoes-queries'

export function DelegacoesPage() {
  const {
    data,
    isLoading,
    page,
    pageSize,
    handleFiltersChange,
    handlePaginationChange,
    handleSortingChange,
  } = usePageData({
    useGetDataPaginated: useGetDelegacoesPaginated,
    usePrefetchAdjacentData: usePrefetchAdjacentDelegacoes,
  })

  const delegacoes = data?.info?.data || []
  const totalDelegacoes = data?.info?.totalCount || 0
  const pageCount = data?.info?.totalPages || 0

  if (isLoading) {
    return (
      <div className='px-4 md:px-8 md:pb-8 md:pt-28 pt-4 md:mx-0 md:my-4 md:mr-4 md:rounded-xl pb-24'>
        <DataTableSkeleton
          columnCount={7}
          filterableColumnCount={3}
          searchableColumnCount={1}
        />
      </div>
    )
  }

  return (
    <div className='px-4 md:px-8 md:pb-8 md:pt-28 pt-4 md:mx-0 md:my-4 md:mr-4 md:rounded-xl pb-24'>
      <PageHead title='Delegações | Frotas' />
      <Breadcrumbs
        items={[
          {
            title: 'Configurações',
            link: '/utilitarios/tabelas/configuracoes',
          },
          {
            title: 'Delegações',
            link: '/utilitarios/tabelas/configuracoes/delegacoes',
          },
        ]}
      />
      <div className='mt-10'>
        <DelegacoesTable
          delegacoes={delegacoes}
          page={page}
          pageSize={pageSize}
          total={totalDelegacoes}
          pageCount={pageCount}
          onFiltersChange={handleFiltersChange}
          onPaginationChange={handlePaginationChange}
          onSortingChange={handleSortingChange}
        />
      </div>
    </div>
  )
}

