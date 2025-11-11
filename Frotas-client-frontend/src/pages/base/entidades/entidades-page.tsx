import { Breadcrumbs } from '@/components/shared/breadcrumbs'
import { DataTableSkeleton } from '@/components/shared/data-table-skeleton'
import { PageHead } from '@/components/shared/page-head'
import { usePageData } from '@/utils/page-data-utils'
import { EntidadesTable } from '@/pages/base/entidades/components/entidades-table/entidades-table'
import {
  useGetEntidadesPaginated,
  usePrefetchAdjacentEntidades,
} from '@/pages/base/entidades/queries/entidades-queries'

export function EntidadesPage() {
  const {
    data,
    isLoading,
    page,
    pageSize,
    handleFiltersChange,
    handlePaginationChange,
    handleSortingChange,
  } = usePageData({
    useGetDataPaginated: useGetEntidadesPaginated,
    usePrefetchAdjacentData: usePrefetchAdjacentEntidades,
  })

  const entidades = data?.info?.data || []
  const totalEntidades = data?.info?.totalCount || 0
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
      <PageHead title='Entidades | Base' />
      <Breadcrumbs
        items={[
          {
            title: 'Utilitários',
            link: '/utilitarios/tabelas',
          },
          {
            title: 'Entidades',
            link: '/utilitarios/tabelas/configuracoes/entidades',
          },
        ]}
      />
      <div className='mt-10'>
        <EntidadesTable
          entidades={entidades}
          page={page}
          pageSize={pageSize}
          total={totalEntidades}
          pageCount={pageCount}
          onFiltersChange={handleFiltersChange}
          onPaginationChange={handlePaginationChange}
          onSortingChange={handleSortingChange}
        />
      </div>
    </div>
  )
}


