import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useWindowPageState } from '@/stores/use-pages-store'
import { useCurrentWindowId } from '@/utils/window-utils'

type UsePageDataOptions = {
  // Required
  useGetDataPaginated: (
    page: number,
    pageSize: number,
    filters: Array<{ id: string; value: string }>,
    sorting: Array<{ id: string; desc: boolean }>
  ) => any
  usePrefetchAdjacentData: (
    page: number,
    pageSize: number,
    filters: Array<{ id: string; value: string }>
  ) => any

  // Optional
  onFiltersChange?: (filters: Array<{ id: string; value: string }>) => void
  onPaginationChange?: (page: number, pageSize: number) => void
  onSortingChange?: (sorting: Array<{ id: string; desc: boolean }>) => void
}

export function usePageData(options: UsePageDataOptions) {
  const location = useLocation()
  const currentWindowId = useCurrentWindowId()

  const locationState = location.state as {
    pagination?: { page: number; pageSize: number }
    sorting?: Array<{ id: string; desc: boolean }>
    initialFilters?: Array<{ id: string; value: string }>
  }

  const {
    filters,
    sorting,
    pagination: { page, pageSize },
    setFilters,
    setSorting,
    setPagination,
  } = useWindowPageState(currentWindowId)

  // Initialize filters, pagination and sorting from location state if they exist
  useEffect(() => {
    if (locationState?.initialFilters) {
      setFilters(locationState.initialFilters)
    }
    if (locationState?.pagination) {
      setPagination(
        locationState.pagination.page,
        locationState.pagination.pageSize
      )
    }
    if (locationState?.sorting) {
      setSorting(locationState.sorting)
    }
  }, [])

  const { data, isLoading } = options.useGetDataPaginated(
    page,
    pageSize,
    filters,
    sorting
  )

  const { prefetchPreviousPage, prefetchNextPage } =
    options.usePrefetchAdjacentData(page, pageSize, filters)

  const handleFiltersChange = (
    newFilters: Array<{ id: string; value: string }>
  ) => {
    setFilters(newFilters)
    setPagination(1, pageSize) // Reset to first page when filters change
    if (options.onFiltersChange) {
      options.onFiltersChange(newFilters)
    }
  }

  const handlePaginationChange = (newPage: number, newPageSize: number) => {
    setPagination(newPage, newPageSize)
    if (options.onPaginationChange) {
      options.onPaginationChange(newPage, newPageSize)
    }
  }

  const handleSortingChange = (
    newSorting: Array<{ id: string; desc: boolean }>
  ) => {
    setSorting(newSorting)
    if (options.onSortingChange) {
      options.onSortingChange(newSorting)
    }
  }

  useEffect(() => {
    prefetchPreviousPage()
    prefetchNextPage()
  }, [page, pageSize, filters, sorting])

  return {
    data,
    isLoading,
    page,
    pageSize,
    filters,
    sorting,
    handleFiltersChange,
    handlePaginationChange,
    handleSortingChange,
  }
}
