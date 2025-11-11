import { useEffect, useState } from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { EntidadeDTO } from '@/types/dtos/base/entidades.dtos'
import { BaseFilterControlsProps } from '@/components/shared/data-table-filter-controls-base'
import { useWindowPageState } from '@/stores/use-pages-store'
import { useCurrentWindowId } from '@/utils/window-utils'
import { getColumnHeader } from '@/utils/table-utils'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { filterFields } from './entidades-constants'

export function EntidadesFilterControls({
  table,
  columns,
}: BaseFilterControlsProps<EntidadeDTO>) {
  const windowId = useCurrentWindowId()
  const { filters } = useWindowPageState(windowId)
  const [filterValues, setFilterValues] = useState<Record<string, string>>({})

  useEffect(() => {
    const newFilterValues: Record<string, string> = {}

    filters.forEach((filter) => {
      newFilterValues[filter.id] = filter.value
      table.getColumn(filter.id)?.setFilterValue(filter.value)
    })

    setFilterValues(newFilterValues)
  }, [filters, table])

  const handleFilterChange = (columnId: string, value: string) => {
    const newValue = value === 'all' ? '' : value

    setFilterValues((prev) => ({
      ...prev,
      [columnId]: newValue,
    }))

    table.getColumn(columnId)?.setFilterValue(newValue)
  }

  const renderFilterInput = (column: ColumnDef<EntidadeDTO, unknown>) => {
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


