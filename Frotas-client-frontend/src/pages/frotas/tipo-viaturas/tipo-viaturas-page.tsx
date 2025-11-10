import { usePageData } from '@/utils/page-data-utils'
import { Breadcrumbs } from '@/components/shared/breadcrumbs'
import { DataTableSkeleton } from '@/components/shared/data-table-skeleton'
import { PageHead } from '@/components/shared/page-head'
import { TipoViaturasTable } from './components/tipo-viaturas-table/tipo-viaturas-table'
import {
  useGetTipoViaturasPaginated,
  usePrefetchAdjacentTipoViaturas,
} from './queries/tipo-viaturas-queries'

export function TipoViaturasPage() {
  const {
    data,
    isLoading,
    page,
    pageSize,
    handleFiltersChange,
    handlePaginationChange,
    handleSortingChange,
  } = usePageData({
    useGetDataPaginated: useGetTipoViaturasPaginated,
    usePrefetchAdjacentData: usePrefetchAdjacentTipoViaturas,
  })

  const tipoViaturas = data?.info?.data || []
  const totalTipoViaturas = data?.info?.totalCount || 0
  const pageCount = data?.info?.totalPages || 0

  if (isLoading) {
    return (
      <div className='px-4 md:px-8 md:pb-8 md:pt-28 pt-4 md:mx-0 md:my-4 md:mr-4 md:rounded-xl pb-24'>
        <DataTableSkeleton
          columnCount={6}
          filterableColumnCount={1}
          searchableColumnCount={1}
        />
      </div>
    )
  }

  return (
    <div className='px-4 md:px-8 md:pb-8 md:pt-28 pt-4 md:mx-0 md:my-4 md:mr-4 md:rounded-xl pb-24'>
      <PageHead title='Tipos de Viatura | Frotas' />
      <Breadcrumbs
        items={[
          {
            title: 'Configurações',
            link: '/frotas/configuracoes',
          },
          {
            title: 'Tipos de Viatura',
            link: '/frotas/configuracoes/tipo-viaturas',
          },
        ]}
      />
      <div className='mt-10'>
        <TipoViaturasTable
          tipoViaturas={tipoViaturas}
          page={page}
          pageSize={pageSize}
          total={totalTipoViaturas}
          pageCount={pageCount}
          onFiltersChange={handleFiltersChange}
          onPaginationChange={handlePaginationChange}
          onSortingChange={handleSortingChange}
        />
      </div>
    </div>
  )
}

