import { useState, useEffect } from 'react'
import { ColumnFilter } from '@tanstack/react-table'
import { filterFields } from '@/pages/application/areas/components/areas-table/areas-constants'
import { AreaDTO } from '@/types/dtos'
import { getColumnHeader } from '@/utils/table-utils'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { BaseFilterControlsProps } from '@/components/shared/data-table-filter-controls-base'

export function AreasFilterControls({
  table,
  columns,
}: BaseFilterControlsProps<AreaDTO>) {
  const [filterValues, setFilterValues] = useState<Record<string, string>>({})

  useEffect(() => {
    const currentFilters = table.getState().columnFilters
    const newFilterValues: Record<string, string> = {}

    currentFilters.forEach((filter: ColumnFilter) => {
      if (filter.value) {
        newFilterValues[filter.id] = filter.value as string
      }
    })

    setFilterValues(newFilterValues)
  }, [table.getState().columnFilters])

  const handleFilterChange = (columnId: string, value: string) => {
    setFilterValues((prev) => ({
      ...prev,
      [columnId]: value,
    }))

    table.getColumn(columnId)?.setFilterValue(value)
  }

  return (
    <>
      {columns
        .filter((column) => {
          return (
            'accessorKey' in column &&
            column.accessorKey &&
            filterFields.some((field) => field.value === column.accessorKey)
          )
        })
        .sort((a, b) => {
          const aField = filterFields.find(
            (field) => 'accessorKey' in a && field.value === a.accessorKey
          )
          const bField = filterFields.find(
            (field) => 'accessorKey' in b && field.value === b.accessorKey
          )
          return (aField?.order ?? Infinity) - (bField?.order ?? Infinity)
        })
        .map((column) => {
          if (!('accessorKey' in column) || !column.accessorKey) return null
          return (
            <div
              key={`${column.id}-${column.accessorKey}`}
              className='space-y-2'
            >
              <Label>{getColumnHeader(column, filterFields)}</Label>
              <Input
                placeholder={`Filtrar por ${getColumnHeader(column, filterFields).toLowerCase()}...`}
                value={filterValues[column.accessorKey.toString()] ?? ''}
                onChange={(event) =>
                  handleFilterChange(
                    column.accessorKey.toString(),
                    event.target.value
                  )
                }
                className='w-full justify-start px-4 py-6 text-left font-normal shadow-inner'
              />
            </div>
          )
        })}
    </>
  )
}
