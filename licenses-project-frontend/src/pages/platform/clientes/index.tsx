import { useState, useEffect } from 'react'
import ClientesTable from '@/pages/platform/clientes/components/clientes-table'
import {
  useGetClientesPaginated,
  usePrefetchAdjacentClientes,
} from '@/pages/platform/clientes/queries/clientes-queries'
import { Breadcrumbs } from '@/components/shared/breadcrumbs'
import { DataTableSkeleton } from '@/components/shared/data-table-skeleton'
import PageHead from '@/components/shared/page-head'

export default function ClientesPage() {
  const searchParams = new URLSearchParams(window.location.search)
  const clienteIdParam = searchParams.get('clienteId')

  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [filters, setFilters] = useState<Array<{ id: string; value: string }>>(
    clienteIdParam ? [{ id: 'clienteId', value: clienteIdParam }] : []
  )
  const [sorting, setSorting] = useState<Array<{ id: string; desc: boolean }>>(
    []
  )

  const { data, isLoading } = useGetClientesPaginated(
    page,
    pageSize,
    filters,
    sorting
  )
  const { prefetchPreviousPage, prefetchNextPage } =
    usePrefetchAdjacentClientes(page, pageSize, filters)

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

  const clientes = data?.info?.data || []
  const totalClientes = data?.info?.totalCount || 0
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
      <PageHead title='Aplicações | GSLP' />
      <Breadcrumbs
        items={[
          { title: 'Administração', link: '/administracao' },
          { title: 'Clientes', link: '/administracao/clientes' },
        ]}
      />
      <div className='mt-10'>
        <ClientesTable
          clientes={clientes}
          page={page}
          total={totalClientes}
          pageCount={pageCount}
          onFiltersChange={handleFiltersChange}
          onPaginationChange={handlePaginationChange}
          onSortingChange={handleSortingChange}
        />
      </div>
    </div>
  )
}
