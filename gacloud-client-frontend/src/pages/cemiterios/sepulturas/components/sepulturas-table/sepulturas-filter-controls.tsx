import { useState, useEffect } from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { SepulturaDTO } from '@/types/dtos/cemiterios/sepulturas.dtos'
import { SepulturaEstadoLabel } from '@/types/enums/sepultura-estado.enum'
import { SepulturaSituacaoLabel } from '@/types/enums/sepultura-situacao.enum'
import { useWindowPageState } from '@/stores/use-pages-store'
import { getColumnHeader } from '@/utils/table-utils'
import { useCurrentWindowId } from '@/utils/window-utils'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import { BaseFilterControlsProps } from '@/components/shared/data-table-filter-controls-base'
import { filterFields } from './sepulturas-constants'

export function SepulturasFilterControls({
  table,
  columns,
}: BaseFilterControlsProps<SepulturaDTO>) {
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

  const renderFilterInput = (column: ColumnDef<SepulturaDTO, unknown>) => {
    if (!('accessorKey' in column) || !column.accessorKey) return null

    const columnId = column.accessorKey.toString()
    const commonInputStyles =
      'w-full justify-start px-4 py-6 text-left font-normal shadow-inner'

    // Custom select for boolean fields
    if (columnId === 'bloqueada' || columnId === 'litigio') {
      return (
        <Select
          value={filterValues[columnId] ?? 'all'}
          onValueChange={(value) => handleFilterChange(columnId, value)}
        >
          <SelectTrigger className={commonInputStyles}>
            <SelectValue
              placeholder={`Filtrar por ${getColumnHeader(column, filterFields).toLowerCase()}...`}
            />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>Todas</SelectItem>
            <SelectItem value='true'>Sim</SelectItem>
            <SelectItem value='false'>Não</SelectItem>
          </SelectContent>
        </Select>
      )
    }

    // Custom select for estado enum
    if (columnId === 'sepulturaEstadoId') {
      return (
        <Select
          value={filterValues[columnId] ?? 'all'}
          onValueChange={(value) => handleFilterChange(columnId, value)}
        >
          <SelectTrigger className={commonInputStyles}>
            <SelectValue
              placeholder={`Filtrar por ${getColumnHeader(column, filterFields).toLowerCase()}...`}
            />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>Todos</SelectItem>
            {Object.entries(SepulturaEstadoLabel).map(([key, label]) => (
              <SelectItem key={key} value={key}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )
    }

    // Custom select for situacao enum
    if (columnId === 'sepulturaSituacaoId') {
      return (
        <Select
          value={filterValues[columnId] ?? 'all'}
          onValueChange={(value) => handleFilterChange(columnId, value)}
        >
          <SelectTrigger className={commonInputStyles}>
            <SelectValue
              placeholder={`Filtrar por ${getColumnHeader(column, filterFields).toLowerCase()}...`}
            />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>Todos</SelectItem>
            {Object.entries(SepulturaSituacaoLabel).map(([key, label]) => (
              <SelectItem key={key} value={key}>
                {label}
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
      {/* Render all other filters first, each on their own row except bloqueada/litigio/estado/situacao */}
      {columns
        .filter(
          (column) =>
            'accessorKey' in column &&
            column.accessorKey &&
            column.accessorKey !== 'bloqueada' &&
            column.accessorKey !== 'litigio' &&
            column.accessorKey !== 'sepulturaEstadoId' &&
            column.accessorKey !== 'sepulturaSituacaoId' &&
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
      {/* Bloqueada and Litigio in the same row */}
      <div className='flex gap-4'>
        {['bloqueada', 'litigio'].map((accessorKey) => {
          const column = columns.find(
            (col) =>
              'accessorKey' in col && (col as any).accessorKey === accessorKey
          )
          if (!column) return null
          return (
            <div
              key={`${column.id}-${(column as any).accessorKey}`}
              className='space-y-2 w-1/2'
            >
              <Label>{getColumnHeader(column, filterFields)}</Label>
              {renderFilterInput(column)}
            </div>
          )
        })}
      </div>
      {/* Only Estado and Situacao in the last row, each 50% width */}
      <div className='flex gap-4'>
        {['sepulturaEstadoId', 'sepulturaSituacaoId'].map((accessorKey) => {
          const column = columns.find(
            (col) =>
              'accessorKey' in col && (col as any).accessorKey === accessorKey
          )
          if (!column) return null
          return (
            <div
              key={`${column.id}-${(column as any).accessorKey}`}
              className='space-y-2 w-1/2'
            >
              <Label>{getColumnHeader(column, filterFields)}</Label>
              {renderFilterInput(column)}
            </div>
          )
        })}
      </div>
    </>
  )
}
