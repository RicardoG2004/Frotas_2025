import { usePageData } from '@/utils/page-data-utils'
import { Breadcrumbs } from '@/components/shared/breadcrumbs'
import { DataTableSkeleton } from '@/components/shared/data-table-skeleton'
import { PageHead } from '@/components/shared/page-head'
import { CategoriasTable } from './components/categorias-table/categorias-table'
import {
  useGetCategoriasPaginated,
  usePrefetchAdjacentCategorias,
} from './queries/categorias-queries'

export function CategoriasPage() {
  const {
    data,
    isLoading,
    page,
    pageSize,
    handleFiltersChange,
    handlePaginationChange,
    handleSortingChange,
  } = usePageData({
    useGetDataPaginated: useGetCategoriasPaginated,
    usePrefetchAdjacentData: usePrefetchAdjacentCategorias,
  })

  const categorias = data?.info?.data || []
  const totalCategorias = data?.info?.totalCount || 0
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
      <PageHead title='Cemitérios | Frotas' />
      <Breadcrumbs
        items={[
          {
            title: 'Categorias',
            link: '/frotas/configuracoes/categorias',
          },
        ]}
      />
      <div className='mt-10'>
        <CategoriasTable
          categorias={categorias}
          page={page}
          pageSize={pageSize}
          total={totalCategorias}
          pageCount={pageCount}
          onFiltersChange={handleFiltersChange}
          onPaginationChange={handlePaginationChange}
          onSortingChange={handleSortingChange}
        />
      </div>
    </div>
  )
}
