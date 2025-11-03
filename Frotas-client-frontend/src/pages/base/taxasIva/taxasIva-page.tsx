import { usePageData } from '@/utils/page-data-utils'
import { Breadcrumbs } from '@/components/shared/breadcrumbs'
import { DataTableSkeleton } from '@/components/shared/data-table-skeleton'
import { PageHead } from '@/components/shared/page-head'
import { TaxasIvaTable } from './components/taxasIva-table/taxasIva-table'
import {
  useGetTaxasIvaPaginated,
  usePrefetchAdjacentTaxasIvas,
} from './queries/taxasIva-queries'

export function TaxasIvaPage() {
  const {
    data,
    isLoading,
    page,
    pageSize,
    handleFiltersChange,
    handlePaginationChange,
    handleSortingChange,
  } = usePageData({
    useGetDataPaginated: useGetTaxasIvaPaginated,
    usePrefetchAdjacentData: usePrefetchAdjacentTaxasIvas,
  })

  const taxasIva = data?.info?.data || []
  const totalTaxasIva = data?.info?.totalCount || 0
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
      <PageHead title='Taxas de IVA | Frotas' />
      <Breadcrumbs
        items={[
          {
            title: 'Configurações',
            link: '/utilitarios/tabelas/configuracoes',
          },
          {
            title: 'Taxas de IVA',
            link: '/utilitarios/tabelas/configuracoes/taxas-iva',
          },
          {
            title: 'Atualizar',
            link: '/utilitarios/tabelas/configuracoes/taxas-iva/update?taxaIvaId=${taxaIvaId}&instanceId=${instanceId}',
          },
        ]}
      />
      <div className='mt-10'>
        <TaxasIvaTable
          taxasIva={taxasIva}
          page={page}
          pageSize={pageSize}
          total={totalTaxasIva}
          pageCount={pageCount}
          onFiltersChange={handleFiltersChange}
          onPaginationChange={handlePaginationChange}
          onSortingChange={handleSortingChange}
        />
      </div>
    </div>
  )
}
