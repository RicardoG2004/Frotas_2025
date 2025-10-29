import { usePageData } from '@/utils/page-data-utils'
import { Breadcrumbs } from '@/components/shared/breadcrumbs'
import { DataTableSkeleton } from '@/components/shared/data-table-skeleton'
import { PageHead } from '@/components/shared/page-head'
import { DefuntosTiposTable } from './components/defuntos-tipos-table/defuntos-tipos-table'
import {
  useGetDefuntosTiposPaginated,
  usePrefetchAdjacentDefuntosTipos,
} from './queries/defuntos-tipos-queries'

export function DefuntosTiposPage() {
  const {
    data,
    isLoading,
    page,
    pageSize,
    handleFiltersChange,
    handlePaginationChange,
    handleSortingChange,
  } = usePageData({
    useGetDataPaginated: useGetDefuntosTiposPaginated,
    usePrefetchAdjacentData: usePrefetchAdjacentDefuntosTipos,
  })

  const defuntosTipos = data?.info?.data || []
  const totalDefuntosTipos = data?.info?.totalCount || 0
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
      <PageHead title='Tipos de Defunto | Luma' />
      <Breadcrumbs
        items={[
          {
            title: 'Configurações',
            link: '/cemiterios/configuracoes',
          },
          {
            title: 'Tipos de Defunto',
            link: '/cemiterios/configuracoes/defuntos/tipos',
          },
        ]}
      />
      <div className='mt-10'>
        <DefuntosTiposTable
          defuntosTipos={defuntosTipos}
          page={page}
          pageSize={pageSize}
          total={totalDefuntosTipos}
          pageCount={pageCount}
          onFiltersChange={handleFiltersChange}
          onPaginationChange={handlePaginationChange}
          onSortingChange={handleSortingChange}
        />
      </div>
    </div>
  )
}
