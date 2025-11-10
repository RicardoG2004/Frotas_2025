import { useState, useEffect } from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { SeguroDTO } from '@/types/dtos/frotas/seguros.dtos'
import { useWindowPageState } from '@/stores/use-pages-store'
import { getColumnHeader } from '@/utils/table-utils'
import { useCurrentWindowId } from '@/utils/window-utils'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { BaseFilterControlsProps } from '@/components/shared/data-table-filter-controls-base'
import { filterFields } from './seguros-constants'

export function SegurosFilterControls({
  table,
  columns,
}: BaseFilterControlsProps<SeguroDTO>) {
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

  const renderFilterInput = (column: ColumnDef<SeguroDTO, unknown>) => {
    if (!('accessorKey' in column) || !column.accessorKey) return null

    const columnId = column.accessorKey.toString()
    const field = filterFields.find((f) => f.value === column.accessorKey)
    const commonInputStyles =
      'w-full justify-start px-4 py-6 text-left font-normal shadow-inner'

    if (field?.type === 'boolean') {
      const currentValue = filterValues[columnId] ?? ''
      return (
        <Select
          value={currentValue === '' ? 'all' : currentValue}
          onValueChange={(value) => handleFilterChange(columnId, value)}
        >
          <SelectTrigger className={commonInputStyles}>
            <SelectValue
              placeholder={`Filtrar por ${field.label.toLowerCase()}...`}
            />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>Todos</SelectItem>
            <SelectItem value='true'>Sim</SelectItem>
            <SelectItem value='false'>Não</SelectItem>
          </SelectContent>
        </Select>
      )
    }

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


