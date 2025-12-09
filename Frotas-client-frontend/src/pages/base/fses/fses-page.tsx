import { usePageData } from '@/utils/page-data-utils'
import { Breadcrumbs } from '@/components/shared/breadcrumbs'
import { DataTableSkeleton } from '@/components/shared/data-table-skeleton'
import { PageHead } from '@/components/shared/page-head'
import { FsesTable } from './components/fses-table/fses-table'
import {
  useGetFsesPaginated,
  usePrefetchAdjacentFses,
} from './queries/fses-queries'

export function FsesPage() {
  const {
    data,
    isLoading,
    page,
    pageSize,
    handleFiltersChange,
    handlePaginationChange,
    handleSortingChange,
  } = usePageData({
    useGetDataPaginated: useGetFsesPaginated,
    usePrefetchAdjacentData: usePrefetchAdjacentFses,
  })

  const fses = data?.info?.data || []
  const totalFses = data?.info?.totalCount || 0
  const pageCount = data?.info?.totalPages || 0

  if (isLoading) {
    return (
      <div className='px-4 md:px-8 md:pb-8 md:pt-28 pt-4 md:mx-0 md:my-4 md:mr-4 md:rounded-xl pb-24'>
        <DataTableSkeleton
          columnCount={7}
          filterableColumnCount={6}
          searchableColumnCount={1}
        />
      </div>
    )
  }

  return (
    <div className='px-4 md:px-8 md:pb-8 md:pt-28 pt-4 md:mx-0 md:my-4 md:mr-4 md:rounded-xl pb-24'>
      <PageHead title='Fornecedores Serviços Externos | Base' />
      <Breadcrumbs
        items={[
          {
            title: 'Utilitários',
            link: '/utilitarios/tabelas',
          },
          {
            title: 'Fornecedores Serviços Externos',
            link: '/utilitarios/tabelas/configuracoes/fses',
          },
        ]}
      />
      <div className='mt-10'>
        <FsesTable
          fses={fses}
          page={page}
          pageSize={pageSize}
          total={totalFses}
          pageCount={pageCount}
          onFiltersChange={handleFiltersChange}
          onPaginationChange={handlePaginationChange}
          onSortingChange={handleSortingChange}
        />
      </div>
    </div>
  )
}

