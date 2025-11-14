import { Breadcrumbs } from '@/components/shared/breadcrumbs'
import { DataTableSkeleton } from '@/components/shared/data-table-skeleton'
import { PageHead } from '@/components/shared/page-head'
import { usePageData } from '@/utils/page-data-utils'
import { FuncionariosTable } from './components/funcionarios-table/funcionarios-table'
import {
  useGetFuncionariosPaginated,
  usePrefetchAdjacentFuncionarios,
} from './queries/funcionarios-queries'

export function FuncionariosPage() {
  const {
    data,
    isLoading,
    page,
    pageSize,
    handleFiltersChange,
    handlePaginationChange,
    handleSortingChange,
  } = usePageData({
    useGetDataPaginated: useGetFuncionariosPaginated,
    usePrefetchAdjacentData: usePrefetchAdjacentFuncionarios,
  })

  const funcionarios = data?.info?.data || []
  const totalFuncionarios = data?.info?.totalCount || 0
  const pageCount = data?.info?.totalPages || 0

  if (isLoading) {
    return (
      <div className='px-4 md:px-8 md:pb-8 md:pt-28 pt-4 md:mx-0 md:my-4 md:mr-4 md:rounded-xl pb-24'>
        <DataTableSkeleton columnCount={5} filterableColumnCount={4} searchableColumnCount={2} />
      </div>
    )
  }

  return (
    <div className='px-4 md:px-8 md:pb-8 md:pt-28 pt-4 md:mx-0 md:my-4 md:mr-4 md:rounded-xl pb-24'>
      <PageHead title='Funcionários | Base' />
      <Breadcrumbs
        items={[
          {
            title: 'Configurações',
            link: '/utilitarios/tabelas/configuracoes',
          },
          {
            title: 'Funcionários',
            link: '/utilitarios/tabelas/configuracoes/funcionarios',
          },
        ]}
      />
      <div className='mt-10'>
        <FuncionariosTable
          funcionarios={funcionarios}
          page={page}
          pageSize={pageSize}
          total={totalFuncionarios}
          pageCount={pageCount}
          onFiltersChange={handleFiltersChange}
          onPaginationChange={handlePaginationChange}
          onSortingChange={handleSortingChange}
        />
      </div>
    </div>
  )
}

