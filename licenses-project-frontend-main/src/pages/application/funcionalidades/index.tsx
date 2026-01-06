import { useState, useEffect } from 'react'
import FuncionalidadesTable from '@/pages/application/funcionalidades/components/funcionalidades-table'
import {
  useGetFuncionalidadesPaginated,
  usePrefetchAdjacentFuncionalidades,
} from '@/pages/application/funcionalidades/queries/funcionalidades-queries'
import { Breadcrumbs } from '@/components/shared/breadcrumbs'
import { DataTableSkeleton } from '@/components/shared/data-table-skeleton'
import PageHead from '@/components/shared/page-head'

export default function FuncionalidadesPage() {
  const searchParams = new URLSearchParams(window.location.search)
  const moduloIdParam = searchParams.get('moduloId')

  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [filters, setFilters] = useState<Array<{ id: string; value: string }>>(
    moduloIdParam ? [{ id: 'moduloId', value: moduloIdParam }] : []
  )
  const [sorting, setSorting] = useState<Array<{ id: string; desc: boolean }>>(
    []
  )

  const { data, isLoading } = useGetFuncionalidadesPaginated(
    page,
    pageSize,
    filters,
    sorting
  )
  const { prefetchPreviousPage, prefetchNextPage } =
    usePrefetchAdjacentFuncionalidades(page, pageSize, filters)

  const handleFiltersChange = (
    newFilters: Array<{ id: string; value: string }>
  ) => {
    setFilters(newFilters)
    setPage(1)
  }

  const handlePaginationChange = (newPage: number, newPageSize: number) => {
    setPage(newPage)
    setPageSize(newPageSize)
  }

  const handleSortingChange = (
    newSorting: Array<{ id: string; desc: boolean }>
  ) => {
    setSorting(newSorting)
  }

  useEffect(() => {
    prefetchPreviousPage()
    prefetchNextPage()
  }, [page, pageSize, filters, sorting])

  const funcionalidades = data?.info?.data || []
  const totalFuncionalidades = data?.info?.totalCount || 0
  const pageCount = data?.info?.totalPages || 0

  if (isLoading) {
    return (
      <div className='p-5'>
        <DataTableSkeleton
          columnCount={6}
          filterableColumnCount={2}
          searchableColumnCount={1}
        />
      </div>
    )
  }

  return (
    <div className='px-4 pb-4 md:px-8 md:pb-8'>
      <PageHead title='Funcionalidades | GSLP' />
      <Breadcrumbs
        items={[
          { title: 'Administração', link: '/administracao' },
          { title: 'Funcionalidades', link: '/administracao/funcionalidades' },
        ]}
      />
      <div className='mt-10'>
        <FuncionalidadesTable
          funcionalidades={funcionalidades}
          page={page}
          total={totalFuncionalidades}
          pageCount={pageCount}
          onFiltersChange={handleFiltersChange}
          onPaginationChange={handlePaginationChange}
          onSortingChange={handleSortingChange}
        />
      </div>
    </div>
  )
}
