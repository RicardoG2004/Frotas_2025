import { usePageData } from '@/utils/page-data-utils'
import { Breadcrumbs } from '@/components/shared/breadcrumbs'
import { DataTableSkeleton } from '@/components/shared/data-table-skeleton'
import { PageHead } from '@/components/shared/page-head'
import { SeguradorasTable } from './components/seguradoras-table/seguradoras-table'
import {
  useGetSeguradorasPaginated,
  usePrefetchAdjacentSeguradoras,
} from './queries/seguradoras-queries'

export function SeguradorasPage() {
  const {
    data,
    isLoading,
    page,
    pageSize,
    handleFiltersChange,
    handlePaginationChange,
    handleSortingChange,
  } = usePageData({
    useGetDataPaginated: useGetSeguradorasPaginated,
    usePrefetchAdjacentData: usePrefetchAdjacentSeguradoras,
  })

  const seguradoras = data?.info?.data || []
  const totalSeguradoras = data?.info?.totalCount || 0
  const pageCount = data?.info?.totalPages || 0

  if (isLoading) {
    return (
      <div className='px-4 md:px-8 md:pb-8 md:pt-28 pt-4 md:mx-0 md:my-4 md:mr-4 md:rounded-xl pb-24'>
        <DataTableSkeleton
          columnCount={5}
          filterableColumnCount={2}
          searchableColumnCount={1}
        />
      </div>
    )
  }

  return (
    <div className='px-4 md:px-8 md:pb-8 md:pt-28 pt-4 md:mx-0 md:my-4 md:mr-4 md:rounded-xl pb-24'>
      <PageHead title='Seguradoras | Frotas' />
      <Breadcrumbs
        items={[
          {
            title: 'Configurações',
            link: '/frotas/configuracoes',
          },
          {
            title: 'Seguradoras',
            link: '/frotas/configuracoes/seguradoras',
          },
        ]}
      />
      <div className='mt-10'>
        <SeguradorasTable
          seguradoras={seguradoras}
          page={page}
          pageSize={pageSize}
          total={totalSeguradoras}
          pageCount={pageCount}
          onFiltersChange={handleFiltersChange}
          onPaginationChange={handlePaginationChange}
          onSortingChange={handleSortingChange}
        />
      </div>
    </div>
  )
}


