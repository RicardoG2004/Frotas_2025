import { usePageData } from '@/utils/page-data-utils'
import { Breadcrumbs } from '@/components/shared/breadcrumbs'
import { DataTableSkeleton } from '@/components/shared/data-table-skeleton'
import { PageHead } from '@/components/shared/page-head'
import { AgenciasFunerariasTable } from './components/agencias-funerarias-table/agencias-funerarias-table'
import {
  useGetAgenciasFunerariasPaginated,
  usePrefetchAdjacentAgenciasFunerarias,
} from './queries/agencias-funerarias-queries'

export function AgenciasFunerariasPage() {
  const {
    data,
    isLoading,
    page,
    pageSize,
    handleFiltersChange,
    handlePaginationChange,
    handleSortingChange,
  } = usePageData({
    useGetDataPaginated: useGetAgenciasFunerariasPaginated,
    usePrefetchAdjacentData: usePrefetchAdjacentAgenciasFunerarias,
  })

  const agenciasFunerarias = data?.info?.data || []
  const totalAgenciasFunerarias = data?.info?.totalCount || 0
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
      <PageHead title='Agências Funerárias | Frotas' />
      <Breadcrumbs
        items={[
          {
            title: 'Configurações',
            link: '/frotas/configuracoes',
          },
          {
            title: 'Agências Funerárias',
            link: '/frotas/configuracoes/agencias-funerarias',
          },
        ]}
      />
      <div className='mt-10'>
        <AgenciasFunerariasTable
          agenciasFunerarias={agenciasFunerarias}
          page={page}
          pageSize={pageSize}
          total={totalAgenciasFunerarias}
          pageCount={pageCount}
          onFiltersChange={handleFiltersChange}
          onPaginationChange={handlePaginationChange}
          onSortingChange={handleSortingChange}
        />
      </div>
    </div>
  )
}
