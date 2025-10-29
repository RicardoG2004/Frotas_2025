import { useState, useEffect } from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { VisibilityState } from '@tanstack/react-table'
import { useNavigate } from 'react-router-dom'
import { useWindowPageState } from '@/stores/use-pages-store'
import { handleApiResponse } from '@/utils/response-handlers'
import { toast } from '@/utils/toast-utils'
import { useCurrentWindowId, generateInstanceId } from '@/utils/window-utils'
import { DataTableFilterField } from '@/components/shared/data-table-types'

export const getColumnHeader = <T>(
  column: ColumnDef<T, unknown>,
  filterFields: DataTableFilterField<T>[]
): string => {
  // First check if there's a matching filter field
  if ('accessorKey' in column) {
    const filterField = filterFields.find(
      (field) => field.value === column.accessorKey
    )
    if (filterField) return filterField.label
  }

  // Fallback to existing logic
  if (typeof column.header === 'string') return column.header
  if ('accessorKey' in column) return column.accessorKey.toString()
  return ''
}

export type TableState = {
  filters: Array<{ id: string; value: string }>
  sorting: Array<{ id: string; desc: boolean }>
  pagination: { page: number; pageSize: number }
  columnVisibility: VisibilityState
  selectedRows: string[]
}

export type TableHandlers = {
  handleFiltersChange: (filters: Array<{ id: string; value: string }>) => void
  handlePaginationChange: (page: number, pageSize: number) => void
  handleSortingChange: (sorting: Array<{ id: string; desc: boolean }>) => void
  handleRowSelectionChange: (newSelectedRows: string[]) => void
  handleColumnVisibilityChange: (
    updater: VisibilityState | ((prev: VisibilityState) => VisibilityState)
  ) => void
  handleCreateClick: (basePath: string) => void
}

export function useTableState(
  onFiltersChange?: (filters: Array<{ id: string; value: string }>) => void,
  onPaginationChange?: (page: number, pageSize: number) => void,
  onSortingChange?: (sorting: Array<{ id: string; desc: boolean }>) => void
): { state: TableState; handlers: TableHandlers; activeFiltersCount: number } {
  const currentWindowId = useCurrentWindowId()
  const navigate = useNavigate()
  const [activeFiltersCount, setActiveFiltersCount] = useState(0)

  const {
    filters,
    sorting,
    pagination: { page, pageSize },
    columnVisibility,
    setColumnVisibility,
    selectedRows = [],
    setSelectedRows,
  } = useWindowPageState(currentWindowId)

  // Update active filters count when filters or window changes
  useEffect(() => {
    const count = filters.filter((filter) => filter.value).length
    setActiveFiltersCount(count)
  }, [filters, currentWindowId])

  const handleFiltersChange = (
    filters: Array<{ id: string; value: string }>
  ) => {
    if (onFiltersChange) {
      onFiltersChange(filters)
    }
  }

  const handlePaginationChange = (page: number, pageSize: number) => {
    if (onPaginationChange) {
      onPaginationChange(page, pageSize)
    }
  }

  const handleSortingChange = (
    sorting: Array<{ id: string; desc: boolean }>
  ) => {
    if (onSortingChange) {
      onSortingChange(sorting)
    }
  }

  const handleRowSelectionChange = (newSelectedRows: string[]) => {
    setSelectedRows(newSelectedRows)
  }

  const handleColumnVisibilityChange = (
    updater: VisibilityState | ((prev: VisibilityState) => VisibilityState)
  ) => {
    const newVisibility =
      typeof updater === 'function' ? updater(columnVisibility) : updater
    setColumnVisibility(newVisibility)
  }

  const handleCreateClick = (basePath: string) => {
    const instanceId = generateInstanceId()
    navigate(`${basePath}/create?instanceId=${instanceId}`)
  }

  return {
    state: {
      filters,
      sorting,
      pagination: { page, pageSize },
      columnVisibility,
      selectedRows,
    },
    handlers: {
      handleFiltersChange,
      handlePaginationChange,
      handleSortingChange,
      handleRowSelectionChange,
      handleColumnVisibilityChange,
      handleCreateClick,
    },
    activeFiltersCount,
  }
}

export function useDeleteHandler(
  mutation: any,
  successMessage: string,
  errorMessage: string,
  selectedRows: string[] = [],
  onSuccess?: () => void,
  partialSuccessMessage?: string,
  onSelectedRowsUpdate?: (deletedIds: string[]) => void
) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  const handleDeleteSelected = async () => {
    if (!selectedRows.length) return

    try {
      const response = await mutation.mutateAsync(selectedRows)

      // Use the new response handling system
      const result = handleApiResponse(
        response,
        successMessage,
        errorMessage,
        partialSuccessMessage || 'Operação concluída com avisos'
      )

      if (result.success) {
        // For partial success, we need to determine which items were actually deleted
        if (result.isPartialSuccess && response.info?.messages) {
          // Extract successfully deleted IDs from the response
          // The API should return information about which items were deleted
          const deletedIds = extractDeletedIds(response, selectedRows)
          onSelectedRowsUpdate?.(deletedIds)
        } else {
          // Full success - all selected items were deleted
          onSelectedRowsUpdate?.(selectedRows)
        }

        onSuccess?.()
      }
    } catch (error) {
      // Fallback for errors that don't go through the response handler
      toast.error(errorMessage)
    } finally {
      setIsDeleteModalOpen(false)
    }
  }

  return {
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    handleDeleteSelected,
  }
}

// Helper function to extract deleted IDs from the response
function extractDeletedIds(response: any, selectedRows: string[]): string[] {
  // The API returns an array of successfully deleted IDs in the data field
  if (response.info?.data && Array.isArray(response.info.data)) {
    // Return the IDs that were successfully deleted
    return response.info.data
  }

  // If no data array, assume all were deleted (full success)
  return selectedRows
}
