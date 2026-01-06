import { useState, useEffect } from 'react'
import { ColumnDef, ColumnFilter } from '@tanstack/react-table'
import { useGetClientesSelect } from '@/pages/platform/clientes/queries/clientes-queries'
import { filterFields } from '@/pages/platform/utilizadores/components/utilizadores-table/utilizadores-constants'
import { UtilizadorDTO } from '@/types/dtos'
import { getColumnHeader } from '@/utils/table-utils'
import { roleConfig } from '@/constants/roles'
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

export function UtilizadoresFilterControls({
  table,
  columns,
}: BaseFilterControlsProps<UtilizadorDTO>) {
  const [filterValues, setFilterValues] = useState<Record<string, string>>({})
  const { data: clientes } = useGetClientesSelect()

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
    const newValue = value === 'all' ? '' : value

    setFilterValues((prev) => ({
      ...prev,
      [columnId]: newValue,
    }))

    table.getColumn(columnId)?.setFilterValue(newValue)
  }

  const renderFilterInput = (column: ColumnDef<UtilizadorDTO, unknown>) => {
    if (!('accessorKey' in column) || !column.accessorKey) return null

    const commonInputStyles =
      'w-full justify-start px-4 py-6 text-left font-normal shadow-inner'

    if (column.accessorKey === 'roleId') {
      return (
        <Select
          value={filterValues['roleId'] || 'all'}
          onValueChange={(value) => handleFilterChange('roleId', value)}
        >
          <SelectTrigger className={commonInputStyles}>
            <SelectValue placeholder='Selecione uma role' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>Todos</SelectItem>
            {Object.entries(roleConfig).map(([role, config]) => (
              <SelectItem key={role} value={role}>
                <div className='flex items-center gap-2'>
                  <div
                    className='h-4 w-4 rounded-full'
                    style={{
                      backgroundColor: config.color,
                    }}
                  />
                  <span>{config.label}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )
    }

    if (column.accessorKey === 'clienteId') {
      return (
        <Select
          value={filterValues['clienteId'] || 'all'}
          onValueChange={(value) => handleFilterChange('clienteId', value)}
        >
          <SelectTrigger className={commonInputStyles}>
            <SelectValue placeholder='Selecione um cliente' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>Todos</SelectItem>
            {clientes?.map((cliente) => (
              <SelectItem key={cliente.id} value={cliente.id}>
                {cliente.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )
    }

    if (column.accessorKey === 'ativo') {
      return (
        <Select
          value={filterValues['ativo'] || 'all'}
          onValueChange={(value) => handleFilterChange('ativo', value)}
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
