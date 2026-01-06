import { useEffect, useState } from 'react'
import { ColumnDef, ColumnFilter } from '@tanstack/react-table'
import { filterFields } from '@/pages/platform/perfis-admin/components/perfis-admin-table/perfis-admin-constants'
import { PerfilDTO } from '@/types/dtos'
import { useSearchParams } from 'react-router-dom'
import { getColumnHeader } from '@/utils/table-utils'
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

export function PerfisFilterControls({
  table,
  columns,
}: BaseFilterControlsProps<PerfilDTO>) {
  const [searchParams] = useSearchParams()
  const perfilIdParam = searchParams.get('perfilId')

  const [filterValues, setFilterValues] = useState<Record<string, string>>({})

  useEffect(() => {
    const currentFilters = table.getState().columnFilters
    const newFilterValues: Record<string, string> = {}

    currentFilters.forEach((filter: ColumnFilter) => {
      if (filter.value) {
        newFilterValues[filter.id] = filter.value as string
      }
    })

    if (perfilIdParam) {
      newFilterValues['perfilId'] = perfilIdParam
      table.getColumn('perfilId')?.setFilterValue(perfilIdParam)
    }

    setFilterValues(newFilterValues)
  }, [table.getState().columnFilters, perfilIdParam])

  const handleFilterChange = (columnId: string, value: string) => {
    const newValue = value === 'all' ? '' : value

    setFilterValues((prev) => ({
      ...prev,
      [columnId]: newValue,
    }))

    table.getColumn(columnId)?.setFilterValue(newValue)
  }

  const renderFilterInput = (column: ColumnDef<PerfilDTO, unknown>) => {
    if (!('accessorKey' in column) || !column.accessorKey) return null

    const commonInputStyles =
      'w-full justify-start px-4 py-6 text-left font-normal shadow-inner'

    if (column.accessorKey === 'ativo') {
      return (
        <Select
          value={filterValues[column.accessorKey] || 'all'}
          onValueChange={(value) =>
            handleFilterChange(column.accessorKey!.toString(), value)
          }
        >
          <SelectTrigger className={commonInputStyles}>
            <SelectValue placeholder='Selecione o estado' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>Todos</SelectItem>
            <SelectItem value='true'>Ativo</SelectItem>
            <SelectItem value='false'>Inativo</SelectItem>
          </SelectContent>
        </Select>
      )
    }

    return (
      <Input
        placeholder={`Filtrar por ${getColumnHeader(column, filterFields).toLowerCase()}...`}
        value={filterValues[column.accessorKey.toString()] ?? ''}
        onChange={(event) =>
          handleFilterChange(column.accessorKey.toString(), event.target.value)
        }
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
