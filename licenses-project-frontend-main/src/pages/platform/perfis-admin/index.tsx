import { useState, useEffect } from 'react'
import { PerfisAdminTable } from '@/pages/platform/perfis-admin/components/perfis-admin-table'
import {
  useGetPerfisPaginated,
  usePrefetchAdjacentPerfis,
} from '@/pages/platform/perfis-admin/queries/perfis-admin-queries'
import { useAuthStore } from '@/stores/auth-store'
import { Breadcrumbs } from '@/components/shared/breadcrumbs'
import { DataTableSkeleton } from '@/components/shared/data-table-skeleton'
import PageHead from '@/components/shared/page-head'

export default function PerfisAdminPage() {
  const { licencaId } = useAuthStore()
  const searchParams = new URLSearchParams(window.location.search)
  const perfilIdParam = searchParams.get('perfilId')

  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [filters, setFilters] = useState<Array<{ id: string; value: string }>>(
    perfilIdParam ? [{ id: 'perfilId', value: perfilIdParam }] : []
  )
  const [sorting, setSorting] = useState<Array<{ id: string; desc: boolean }>>(
    []
  )

  const { data, isLoading } = useGetPerfisPaginated(
    licencaId,
    page,
    pageSize,
    filters,
    sorting
  )

  const { prefetchPreviousPage, prefetchNextPage } = usePrefetchAdjacentPerfis(
    licencaId,
    page,
    pageSize,
    filters
  )

  const handleFiltersChange = (
    newFilters: Array<{ id: string; value: string }>
  ) => {
    setFilters(newFilters)
    setPage(1) // Reset to first page when filters change
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

  const perfis = data?.info?.data || []
  const totalPerfis = data?.info?.totalCount || 0
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
      <PageHead title='Licenças | GSLP' />
      <Breadcrumbs
        items={[
          { title: 'Administração', link: '/administracao' },
          { title: 'Perfis', link: '/administracao/perfis/admin' },
        ]}
      />
      <div className='mt-10'>
        <PerfisAdminTable
          perfis={perfis}
          page={page}
          total={totalPerfis}
          pageCount={pageCount}
          onFiltersChange={handleFiltersChange}
          onPaginationChange={handlePaginationChange}
          onSortingChange={handleSortingChange}
        />
      </div>
    </div>
  )
}
