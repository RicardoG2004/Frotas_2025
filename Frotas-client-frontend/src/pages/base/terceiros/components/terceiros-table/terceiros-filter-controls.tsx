import { useEffect, useState } from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { TerceiroDTO } from '@/types/dtos/base/terceiros.dtos'
import { useWindowPageState } from '@/stores/use-pages-store'
import { useCurrentWindowId } from '@/utils/window-utils'
import { filterFields } from './terceiros-constants'
import { BaseFilterControlsProps } from '@/components/shared/data-table-filter-controls-base'
import { getColumnHeader } from '@/utils/table-utils'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Autocomplete } from '@/components/ui/autocomplete'
import { useGetCodigosPostaisSelect } from '@/pages/base/codigospostais/queries/codigospostais-queries'

export function TerceirosFilterControls({
  table,
  columns,
}: BaseFilterControlsProps<TerceiroDTO>) {
  const windowId = useCurrentWindowId()
  const { filters } = useWindowPageState(windowId)
  const [filterValues, setFilterValues] = useState<Record<string, string>>({})

  const {
    data: codigosPostais = [],
    isLoading: isLoadingCodigosPostais,
  } = useGetCodigosPostaisSelect()

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

  const renderFilterInput = (column: ColumnDef<TerceiroDTO, unknown>) => {
    if (!('accessorKey' in column) || !column.accessorKey) return null

    const columnId = column.accessorKey.toString()
    const commonInputStyles =
      'w-full justify-start px-4 py-6 text-left font-normal shadow-inner'

    if (columnId === 'codigoPostalId') {
      const options = codigosPostais.map((codigoPostal) => ({
        value: codigoPostal.id || '',
        label: `${codigoPostal.codigo} - ${codigoPostal.localidade}`,
      }))

      return (
        <Autocomplete
          options={options}
          value={filterValues[columnId] ?? ''}
          onValueChange={(value) => handleFilterChange(columnId, value)}
          placeholder={
            isLoadingCodigosPostais
              ? 'A carregar...'
              : 'Selecione um código postal'
          }
          emptyText='Nenhum código postal encontrado.'
          disabled={isLoadingCodigosPostais}
          className='shadow-inner drop-shadow-xl'
        />
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


