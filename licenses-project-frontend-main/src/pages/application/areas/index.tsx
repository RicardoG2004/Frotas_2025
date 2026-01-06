import { useState } from 'react'
import { useEffect } from 'react'
import AreasTable from '@/pages/application/areas/components/areas-table'
import {
  useGetAreasPaginated,
  usePrefetchAdjacentAreas,
} from '@/pages/application/areas/queries/areas-queries'
import { Breadcrumbs } from '@/components/shared/breadcrumbs'
import { DataTableSkeleton } from '@/components/shared/data-table-skeleton'
import PageHead from '@/components/shared/page-head'

export default function AreasPage() {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [filters, setFilters] = useState<Array<{ id: string; value: string }>>(
    []
  )
  const [sorting, setSorting] = useState<Array<{ id: string; desc: boolean }>>(
    []
  )

  const { data, isLoading } = useGetAreasPaginated(
    page,
    pageSize,
    filters,
    sorting
  )
  const { prefetchPreviousPage, prefetchNextPage } = usePrefetchAdjacentAreas(
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
  }, [page, pageSize, filters, sorting])

  // Get the areas from the transformed response
  const areas = data?.info?.data || []
  const totalAreas = data?.info?.totalCount || 0
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
      <PageHead title='Áreas | GSLP' />
      <Breadcrumbs
        items={[
          { title: 'Administração', link: '/administracao' },
          { title: 'Áreas', link: '/administracao/areas' },
        ]}
      />
      <div className='mt-10'>
        <AreasTable
          areas={areas}
          page={page}
          total={totalAreas}
          pageCount={pageCount}
          onFiltersChange={handleFiltersChange}
          onPaginationChange={handlePaginationChange}
          onSortingChange={handleSortingChange}
        />
      </div>
    </div>
  )
}
