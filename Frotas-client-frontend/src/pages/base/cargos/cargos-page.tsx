import { Breadcrumbs } from '@/components/shared/breadcrumbs'
import { DataTableSkeleton } from '@/components/shared/data-table-skeleton'
import { PageHead } from '@/components/shared/page-head'
import { usePageData } from '@/utils/page-data-utils'
import { CargosTable } from '@/pages/base/cargos/components/cargos-table/cargos-table'
import {
  useGetCargosPaginated,
  usePrefetchAdjacentCargos,
} from '@/pages/base/cargos/queries/cargos-queries'

export function CargosPage() {
  const {
    data,
    isLoading,
    page,
    pageSize,
    handleFiltersChange,
    handlePaginationChange,
    handleSortingChange,
  } = usePageData({
    useGetDataPaginated: useGetCargosPaginated,
    usePrefetchAdjacentData: usePrefetchAdjacentCargos,
  })

  const cargos = data?.info?.data || []
  const totalCargos = data?.info?.totalCount || 0
  const pageCount = data?.info?.totalPages || 0

  if (isLoading) {
    return (
      <div className='px-4 md:px-8 md:pb-8 md:pt-28 pt-4 md:mx-0 md:my-4 md:mr-4 md:rounded-xl pb-24'>
        <DataTableSkeleton columnCount={3} filterableColumnCount={1} searchableColumnCount={1} />
      </div>
    )
  }

  return (
    <div className='px-4 md:px-8 md:pb-8 md:pt-28 pt-4 md:mx-0 md:my-4 md:mr-4 md:rounded-xl pb-24'>
      <PageHead title='Cargos | Base' />
      <Breadcrumbs
        items={[
          {
            title: 'Configurações',
            link: '/utilitarios/tabelas/configuracoes',
          },
          {
            title: 'Cargos',
            link: '/utilitarios/tabelas/configuracoes/cargos',
          },
        ]}
      />
      <div className='mt-10'>
        <CargosTable
          cargos={cargos}
          page={page}
          pageSize={pageSize}
          total={totalCargos}
          pageCount={pageCount}
          onFiltersChange={handleFiltersChange}
          onPaginationChange={handlePaginationChange}
          onSortingChange={handleSortingChange}
        />
      </div>
    </div>
  )
}


