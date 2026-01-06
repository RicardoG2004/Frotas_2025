import { useState, useEffect } from 'react'
import ModulosTable from '@/pages/application/modulos/components/modulos-table'
import {
  useGetModulosPaginated,
  usePrefetchAdjacentModulos,
} from '@/pages/application/modulos/queries/modulos-queries'
import { Breadcrumbs } from '@/components/shared/breadcrumbs'
import { DataTableSkeleton } from '@/components/shared/data-table-skeleton'
import PageHead from '@/components/shared/page-head'

export default function ModulosPage() {
  const searchParams = new URLSearchParams(window.location.search)
  const aplicacaoIdParam = searchParams.get('aplicacaoId')

  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [filters, setFilters] = useState<Array<{ id: string; value: string }>>(
    aplicacaoIdParam ? [{ id: 'aplicacaoId', value: aplicacaoIdParam }] : []
  )
  const [sorting, setSorting] = useState<Array<{ id: string; desc: boolean }>>(
    []
  )

  const { data, isLoading } = useGetModulosPaginated(
    page,
    pageSize,
    filters,
    sorting
  )
  const { prefetchPreviousPage, prefetchNextPage } = usePrefetchAdjacentModulos(
    page,
    pageSize,
    filters
  )

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

  const modulos = data?.info?.data || []
  const totalModulos = data?.info?.totalCount || 0
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
      <PageHead title='Modulos | GSLP' />
      <Breadcrumbs
        items={[
          { title: 'Administração', link: '/administracao' },
          { title: 'Modulos', link: '/administracao/modulos' },
        ]}
      />
      <div className='mt-10'>
        <ModulosTable
          modulos={modulos}
          page={page}
          total={totalModulos}
          pageCount={pageCount}
          onFiltersChange={handleFiltersChange}
          onPaginationChange={handlePaginationChange}
          onSortingChange={handleSortingChange}
        />
      </div>
    </div>
  )
}
