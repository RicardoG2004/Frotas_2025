import { useState, useEffect } from 'react'
import { ColumnDef, ColumnFilter } from '@tanstack/react-table'
import { filterFields } from '@/pages/application/aplicacoes/components/aplicacoes-table/aplicacoes-constants'
import { useGetAreasSelect } from '@/pages/application/areas/queries/areas-queries'
import { AplicacaoDTO } from '@/types/dtos'
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

export function AplicacoesFilterControls({
  table,
  columns,
}: BaseFilterControlsProps<AplicacaoDTO>) {
  const [filterValues, setFilterValues] = useState<Record<string, string>>({})
  const [initialParamApplied, setInitialParamApplied] = useState(false)
  const searchParams = new URLSearchParams(window.location.search)
  const areaIdParam = searchParams.get('areaId')

  const { data: areasData } = useGetAreasSelect()

  useEffect(() => {
    // Get current filters from the table's state
    const currentFilters = table.getState().columnFilters
    const newFilterValues: Record<string, string> = {}

    // First, apply any existing table filters
    currentFilters.forEach((filter: ColumnFilter) => {
      if (filter.value) {
        newFilterValues[filter.id] = filter.value as string
      }
    })

    // Only apply the areaIdParam if it hasn't been applied before
    if (areaIdParam && !initialParamApplied) {
      newFilterValues['areaId'] = areaIdParam
      table.getColumn('areaId')?.setFilterValue(areaIdParam)
      setInitialParamApplied(true)
    }

    setFilterValues(newFilterValues)
  }, [table.getState().columnFilters, areaIdParam, initialParamApplied])

  const handleFilterChange = (columnId: string, value: string) => {
    const newValue = value === 'all' ? '' : value

    // Update local state
    setFilterValues((prev) => ({
      ...prev,
      [columnId]: newValue,
    }))

    // Update table filter
    table.getColumn(columnId)?.setFilterValue(newValue)

    // Always update URL when changing filters after initial load
    if (initialParamApplied) {
      const newUrl = new URL(window.location.href)
      newUrl.searchParams.delete('areaId')
      window.history.pushState({}, '', newUrl)
    }
  }

  const renderFilterInput = (column: ColumnDef<AplicacaoDTO, unknown>) => {
    if (!('accessorKey' in column) || !column.accessorKey) return null

    const commonInputStyles =
      'w-full justify-start px-4 py-6 text-left font-normal shadow-inner'

    if (column.accessorKey === 'ativo') {
      const currentValue = filterValues[column.accessorKey] ?? ''
      return (
        <Select
          value={currentValue === '' ? 'all' : currentValue}
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

    if (column.accessorKey === 'areaId') {
      const currentValue = filterValues[column.accessorKey] ?? ''
      return (
        <Select
          value={currentValue === '' ? 'all' : currentValue}
          onValueChange={(value) =>
            handleFilterChange(
              column.accessorKey!.toString(),
              value === 'all' ? '' : value
            )
          }
        >
          <SelectTrigger className={commonInputStyles}>
            <SelectValue placeholder='Selecione uma área' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>Todas</SelectItem>
            {areasData?.map((area) => (
              <SelectItem key={area.id} value={area.id || ''}>
                <div className='flex items-center gap-2'>
                  <div
                    className='h-4 w-4 rounded-full'
                    style={{ backgroundColor: area.color }}
                  />
                  {area.nome}
                </div>
              </SelectItem>
            ))}
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
