import { useState, useEffect } from 'react'
import UtilizadoresAdminTable from '@/pages/platform/utilizadores-admin/components/utilizadores-admin-table'
import {
  useGetUtilizadoresPaginated,
  usePrefetchAdjacentUtilizadores,
} from '@/pages/platform/utilizadores-admin/queries/utilizadores-admin-queries'
import { useAuthStore } from '@/stores/auth-store'
import { Breadcrumbs } from '@/components/shared/breadcrumbs'
import { DataTableSkeleton } from '@/components/shared/data-table-skeleton'
import PageHead from '@/components/shared/page-head'

export default function UtilizadoresAdminPage() {
  const { clienteId } = useAuthStore()
  const searchParams = new URLSearchParams(window.location.search)
  const utilizadorIdParam = searchParams.get('utilizadorId')

  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [filters, setFilters] = useState<Array<{ id: string; value: string }>>(
    utilizadorIdParam ? [{ id: 'utilizadorId', value: utilizadorIdParam }] : []
  )
  const [sorting, setSorting] = useState<Array<{ id: string; desc: boolean }>>(
    []
  )

  const { data, isLoading } = useGetUtilizadoresPaginated(
    clienteId,
    page,
    pageSize,
    filters,
    sorting
  )
  const { prefetchPreviousPage, prefetchNextPage } =
    usePrefetchAdjacentUtilizadores(clienteId, page, pageSize, filters)

  const handleFiltersChange = (
    newFilters: Array<{ id: string; value: string }>
  ) => {
    setFilters(newFilters)
    setPage(1) // Reset to first page when filters change
    console.log('newFilters', newFilters)
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
  }, [page, pageSize, filters])

  const utilizadores = data?.info?.data || []
  const totalUtilizadores = data?.info?.totalCount || 0
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
          { title: 'Utilizadores', link: '/administracao/utilizadores' },
        ]}
      />
      <div className='mt-10'>
        <UtilizadoresAdminTable
          utilizadores={utilizadores}
          total={totalUtilizadores}
          pageCount={pageCount}
          onFiltersChange={handleFiltersChange}
          onPaginationChange={handlePaginationChange}
          onSortingChange={handleSortingChange}
        />
      </div>
    </div>
  )
}
