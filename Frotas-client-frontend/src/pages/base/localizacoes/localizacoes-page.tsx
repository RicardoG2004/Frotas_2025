import { usePageData } from '@/utils/page-data-utils'
import { Breadcrumbs } from '@/components/shared/breadcrumbs'
import { DataTableSkeleton } from '@/components/shared/data-table-skeleton'
import { PageHead } from '@/components/shared/page-head'
import { LocalizacoesTable } from './components/localizacoes-table/localizacoes-table'
import {
  useGetLocalizacoesPaginated,
  usePrefetchAdjacentLocalizacoes,
} from './queries/localizacoes-queries'

export function LocalizacoesPage() {
  const {
    data,
    isLoading,
    page,
    pageSize,
    handleFiltersChange,
    handlePaginationChange,
    handleSortingChange,
  } = usePageData({
    useGetDataPaginated: useGetLocalizacoesPaginated,
    usePrefetchAdjacentData: usePrefetchAdjacentLocalizacoes,
  })

  const localizacoes = data?.info?.data || []
  const totalLocalizacoes = data?.info?.totalCount || 0
  const pageCount = data?.info?.totalPages || 0

  if (isLoading) {
    return (
      <div className='px-4 md:px-8 md:pb-8 md:pt-28 pt-4 md:mx-0 md:my-4 md:mr-4 md:rounded-xl pb-24'>
        <DataTableSkeleton
          columnCount={7}
          filterableColumnCount={4}
          searchableColumnCount={2}
        />
      </div>
    )
  }

  return (
    <div className='px-4 md:px-8 md:pb-8 md:pt-28 pt-4 md:mx-0 md:my-4 md:mr-4 md:rounded-xl pb-24'>
      <PageHead title='Localizações | Frotas' />
      <Breadcrumbs
        items={[
          {
            title: 'Geográficas',
            link: '/utilitarios/tabelas/geograficas',
          },
          {
            title: 'Localizações',
            link: '/utilitarios/tabelas/geograficas/localizacoes',
          },
        ]}
      />
      <div className='mt-10'>
        <LocalizacoesTable
          localizacoes={localizacoes}
          page={page}
          pageSize={pageSize}
          total={totalLocalizacoes}
          pageCount={pageCount}
          onFiltersChange={handleFiltersChange}
          onPaginationChange={handlePaginationChange}
          onSortingChange={handleSortingChange}
        />
      </div>
    </div>
  )
}

