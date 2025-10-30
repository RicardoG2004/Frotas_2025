import { useState, useEffect } from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { filterFields } from '@/pages/base/distritos/components/distritos-table/distritos-constants'
import { useGetPaisesSelect } from '@/pages/base/paises/queries/paises-queries'
import { DistritoDTO } from '@/types/dtos/base/distritos.dtos'
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

export function DistritosFilterControls({
  table,
  columns,
}: BaseFilterControlsProps<DistritoDTO>) {
  const windowId = useCurrentWindowId()
  const { filters } = useWindowPageState(windowId)
  const [filterValues, setFilterValues] = useState<Record<string, string>>({})
  const { data: paisesData } = useGetPaisesSelect()

  // Sync filters from store to table and local state
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

    // Update local state
    setFilterValues((prev) => ({
      ...prev,
      [columnId]: newValue,
    }))

    // Update the table's pendingColumnFilters
    table.getColumn(columnId)?.setFilterValue(newValue)
  }

  const renderFilterInput = (column: ColumnDef<DistritoDTO, unknown>) => {
    if (!('accessorKey' in column) || !column.accessorKey) return null

    const columnId = column.accessorKey.toString()
    const commonInputStyles =
      'w-full justify-start px-4 py-6 text-left font-normal shadow-inner'

    if (columnId === 'paisId') {
      const currentValue = filterValues[columnId] ?? ''
      return (
        <Select
          value={currentValue === '' ? 'all' : currentValue}
          onValueChange={(value) => handleFilterChange(columnId, value)}
        >
          <SelectTrigger className={commonInputStyles}>
            <SelectValue placeholder='Selecione um país' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>Todas</SelectItem>
            {paisesData?.map((pais) => (
              <SelectItem key={pais.id} value={pais.id || ''}>
                {pais.nome}
              </SelectItem>
            ))}
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
              {renderFilterInput(column)}
            </div>
          )
        })}
    </>
  )
}
