import { useState, useEffect } from 'react'
import LicencasTable from '@/pages/platform/licencas/components/licencas-table'
import {
  useGetLicencasPaginated,
  usePrefetchAdjacentLicencas,
} from '@/pages/platform/licencas/queries/licencas-queries'
import { Breadcrumbs } from '@/components/shared/breadcrumbs'
import { DataTableSkeleton } from '@/components/shared/data-table-skeleton'
import PageHead from '@/components/shared/page-head'

export default function LicencasPage() {
  const searchParams = new URLSearchParams(window.location.search)
  const licencaIdParam = searchParams.get('licencaId')

  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [filters, setFilters] = useState<Array<{ id: string; value: string }>>(
    licencaIdParam ? [{ id: 'licencaId', value: licencaIdParam }] : []
  )
  const [sorting, setSorting] = useState<Array<{ id: string; desc: boolean }>>(
    []
  )

  const { data, isLoading } = useGetLicencasPaginated(
    page,
    pageSize,
    filters,
    sorting
  )

  console.log(data)

  const { prefetchPreviousPage, prefetchNextPage } =
    usePrefetchAdjacentLicencas(page, pageSize, filters)

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

  const licencas = data?.info?.data || []
  const totalLicencas = data?.info?.totalCount || 0
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
          { title: 'Licenças', link: '/administracao/licencas' },
        ]}
      />
      <div className='mt-10'>
        <LicencasTable
          licencas={licencas}
          page={page}
          total={totalLicencas}
          pageCount={pageCount}
          onFiltersChange={handleFiltersChange}
          onPaginationChange={handlePaginationChange}
          onSortingChange={handleSortingChange}
        />
      </div>
    </div>
  )
}
