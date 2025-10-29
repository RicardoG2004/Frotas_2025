import { usePageData } from '@/utils/page-data-utils'
import { Breadcrumbs } from '@/components/shared/breadcrumbs'
import { DataTableSkeleton } from '@/components/shared/data-table-skeleton'
import { PageHead } from '@/components/shared/page-head'
import { RubricasTable } from './components/rubricas-table/rubricas-table'
import {
  useGetRubricasPaginated,
  usePrefetchAdjacentRubricas,
} from './queries/rubricas-queries'

export function RubricasPage() {
  const {
    data,
    isLoading,
    page,
    pageSize,
    handleFiltersChange,
    handlePaginationChange,
    handleSortingChange,
  } = usePageData({
    useGetDataPaginated: useGetRubricasPaginated,
    usePrefetchAdjacentData: usePrefetchAdjacentRubricas,
  })

  const rubricas = data?.info?.data || []
  const totalRubricas = data?.info?.totalCount || 0
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
      <PageHead title='Ruas | Luma' />
      <Breadcrumbs
        items={[
          {
            title: 'Configurações',
            link: '/utilitarios/tabelas/configuracoes',
          },
          {
            title: 'Rubricas',
            link: '/utilitarios/tabelas/configuracoes/rubricas',
          },
        ]}
      />
      <div className='mt-10'>
        <RubricasTable
          rubricas={rubricas}
          page={page}
          pageSize={pageSize}
          total={totalRubricas}
          pageCount={pageCount}
          onFiltersChange={handleFiltersChange}
          onPaginationChange={handlePaginationChange}
          onSortingChange={handleSortingChange}
        />
      </div>
    </div>
  )
}
