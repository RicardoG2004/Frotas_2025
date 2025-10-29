import { usePageData } from '@/utils/page-data-utils'
import { Breadcrumbs } from '@/components/shared/breadcrumbs'
import { DataTableSkeleton } from '@/components/shared/data-table-skeleton'
import { PageHead } from '@/components/shared/page-head'
import { SepulturasTiposDescricoesTable } from './components/sepulturas-tipos-descricoes-table/sepulturas-tipos-descricoes-table'
import {
  useGetSepulturasTiposDescricoesPaginated,
  usePrefetchAdjacentSepulturaTiposDescricoes,
} from './queries/sepulturas-tipos-descricoes-queries'

export function SepulturasTiposDescricoesPage() {
  const {
    data,
    isLoading,
    page,
    pageSize,
    handleFiltersChange,
    handlePaginationChange,
    handleSortingChange,
  } = usePageData({
    useGetDataPaginated: useGetSepulturasTiposDescricoesPaginated,
    usePrefetchAdjacentData: usePrefetchAdjacentSepulturaTiposDescricoes,
  })

  const sepulturasTiposDescricoes = data?.info?.data || []
  const totalSepulturasTiposDescricoes = data?.info?.totalCount || 0
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
      <PageHead title='Tipos de Sepultura [G] | Luma' />
      <Breadcrumbs
        items={[
          {
            title: 'Outros',
            link: '/cemiterios/outros',
          },
          {
            title: 'Tipos de Sepultura [G]',
            link: '/cemiterios/outros/tipos-descricoes',
          },
        ]}
      />
      <div className='mt-10'>
        <SepulturasTiposDescricoesTable
          sepulturasTiposDescricoes={sepulturasTiposDescricoes}
          page={page}
          pageSize={pageSize}
          total={totalSepulturasTiposDescricoes}
          pageCount={pageCount}
          onFiltersChange={handleFiltersChange}
          onPaginationChange={handlePaginationChange}
          onSortingChange={handleSortingChange}
        />
      </div>
    </div>
  )
}
