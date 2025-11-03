import { usePageData } from '@/utils/page-data-utils'
import { Breadcrumbs } from '@/components/shared/breadcrumbs'
import { DataTableSkeleton } from '@/components/shared/data-table-skeleton'
import { PageHead } from '@/components/shared/page-head'
import { FornecedoresTable } from './components/fornecedores-table/fornecedores-table'
import {
  useGetFornecedoresPaginated,
  usePrefetchAdjacentFornecedores,
} from './queries/fornecedores-queries'

export function FornecedoresPage() {
  const {
    data,
    isLoading,
    page,
    pageSize,
    handleFiltersChange,
    handlePaginationChange,
    handleSortingChange,
  } = usePageData({
    useGetDataPaginated: useGetFornecedoresPaginated,
    usePrefetchAdjacentData: usePrefetchAdjacentFornecedores,
  })

  const fornecedores = data?.info?.data || []
  const totalFornecedores = data?.info?.totalCount || 0
  const pageCount = data?.info?.totalPages || 0

  if (isLoading) {
    return (
      <div className='px-4 md:px-8 md:pb-8 md:pt-28 pt-4 md:mx-0 md:my-4 md:mr-4 md:rounded-xl pb-24'>
        <DataTableSkeleton
          columnCount={8}
          filterableColumnCount={5}
          searchableColumnCount={1}
        />
      </div>
    )
  }

  return (
    <div className='px-4 md:px-8 md:pb-8 md:pt-28 pt-4 md:mx-0 md:my-4 md:mr-4 md:rounded-xl pb-24'>
      <PageHead title='Fornecedores | Frotas' />
      <Breadcrumbs
        items={[
          {
            title: 'Fornecedores',
            link: '/frotas/configuracoes/fornecedores',
          },
        ]}
      />
      <div className='mt-10'>
        <FornecedoresTable
          fornecedores={fornecedores}
          page={page}
          pageSize={pageSize}
          total={totalFornecedores}
          pageCount={pageCount}
          onFiltersChange={handleFiltersChange}
          onPaginationChange={handlePaginationChange}
          onSortingChange={handleSortingChange}
        />
      </div>
    </div>
  )
}

