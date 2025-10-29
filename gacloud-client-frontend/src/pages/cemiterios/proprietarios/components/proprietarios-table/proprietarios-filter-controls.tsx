import { useState, useEffect } from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { ProprietarioDTO } from '@/types/dtos/cemiterios/proprietarios.dtos'
import { useWindowPageState } from '@/stores/use-pages-store'
import { getColumnHeader } from '@/utils/table-utils'
import { useCurrentWindowId } from '@/utils/window-utils'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { BaseFilterControlsProps } from '@/components/shared/data-table-filter-controls-base'
import { filterFields } from './proprietarios-constants'

export function ProprietariosFilterControls({
  table,
  columns,
}: BaseFilterControlsProps<ProprietarioDTO>) {
  const windowId = useCurrentWindowId()
  const { filters } = useWindowPageState(windowId)
  const [filterValues, setFilterValues] = useState<Record<string, string>>({})

  // Initialize filters from URL params and store
  useEffect(() => {
    const newFilterValues: Record<string, string> = {}

    // Then apply any other filters from the store
    filters.forEach((filter) => {
      newFilterValues[filter.id] = filter.value
      table.getColumn(filter.id)?.setFilterValue(filter.value)
    })

    setFilterValues(newFilterValues)
  }, [filters, table])

  const handleFilterChange = (columnId: string, value: string) => {
    const newValue = value === 'all' ? '' : value

    // Update local state
    setFilterValues((prev) => ({
      ...prev,
      [columnId]: newValue,
    }))

    // Update the table's pendingColumnFilters
    table.getColumn(columnId)?.setFilterValue(newValue)
  }

  const renderFilterInput = (column: ColumnDef<ProprietarioDTO, unknown>) => {
    if (!('accessorKey' in column) || !column.accessorKey) return null

    const columnId = column.accessorKey.toString()
    const commonInputStyles =
      'w-full justify-start px-4 py-6 text-left font-normal shadow-inner'

    return (
      <Input
        placeholder={`Filtrar por ${getColumnHeader(column, filterFields).toLowerCase()}...`}
        value={filterValues[columnId] ?? ''}
        onChange={(event) => handleFilterChange(columnId, event.target.value)}
        className={commonInputStyles}
      />
    )
  }

  return (
    <>
      {/* Render all filters, each on their own row */}
      {columns
        .filter(
          (column) =>
            'accessorKey' in column &&
            column.accessorKey &&
            filterFields.some((field) => field.value === column.accessorKey)
        )
        .sort((a, b) => {
          const aField = filterFields.find(
            (field) =>
              'accessorKey' in a && field.value === (a as any).accessorKey
          )
          const bField = filterFields.find(
            (field) =>
              'accessorKey' in b && field.value === (b as any).accessorKey
          )
          return (aField?.order ?? Infinity) - (bField?.order ?? Infinity)
        })
        .map((column) => {
          if (!('accessorKey' in column) || !(column as any).accessorKey)
            return null
          return (
            <div
              key={`${column.id}-${(column as any).accessorKey}`}
              className='space-y-2'
            >
              <Label>{getColumnHeader(column, filterFields)}</Label>
              {renderFilterInput(column)}
            </div>
          )
        })}
    </>
  )
}
