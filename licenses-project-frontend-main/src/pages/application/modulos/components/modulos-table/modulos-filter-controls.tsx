import { useState, useEffect } from 'react'
import { ColumnDef, ColumnFilter } from '@tanstack/react-table'
import { useGetAplicacoesSelect } from '@/pages/application/aplicacoes/queries/aplicacoes-queries'
import { useGetAreasSelect } from '@/pages/application/areas/queries/areas-queries'
import { filterFields } from '@/pages/application/modulos/components/modulos-table/modulos-constants'
import { ModuloDTO } from '@/types/dtos'
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

export function ModulosFilterControls({
  table,
  columns,
}: BaseFilterControlsProps<ModuloDTO>) {
  const [filterValues, setFilterValues] = useState<Record<string, string>>({})
  const [initialParamApplied, setInitialParamApplied] = useState(false)
  const searchParams = new URLSearchParams(window.location.search)
  const aplicacaoIdParam = searchParams.get('aplicacaoId')

  const { data: aplicacoesData } = useGetAplicacoesSelect()
  const { data: areasData } = useGetAreasSelect()

  useEffect(() => {
    const currentFilters = table.getState().columnFilters
    const newFilterValues: Record<string, string> = {}

    currentFilters.forEach((filter: ColumnFilter) => {
      if (filter.value) {
        newFilterValues[filter.id] = filter.value as string
      }
    })

    if (aplicacaoIdParam && !initialParamApplied) {
      newFilterValues['aplicacaoId'] = aplicacaoIdParam
      table.getColumn('aplicacaoId')?.setFilterValue(aplicacaoIdParam)
      setInitialParamApplied(true)
    }

    setFilterValues(newFilterValues)
  }, [table.getState().columnFilters, aplicacaoIdParam, initialParamApplied])

  const handleFilterChange = (columnId: string, value: string) => {
    const newValue = value === 'all' ? '' : value

    setFilterValues((prev) => ({
      ...prev,
      [columnId]: newValue,
    }))

    table.getColumn(columnId)?.setFilterValue(newValue)

    if (initialParamApplied) {
      const newUrl = new URL(window.location.href)
      newUrl.searchParams.delete('aplicacaoId')
      window.history.pushState({}, '', newUrl)
    }
  }

  const renderFilterInput = (column: ColumnDef<ModuloDTO, unknown>) => {
    if (!('accessorKey' in column) || !column.accessorKey) return null

    const commonInputStyles =
      'w-full justify-start px-4 py-6 text-left font-normal shadow-inner'

    if (column.accessorKey === 'ativo') {
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

    if (column.accessorKey === 'aplicacaoId') {
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
            <SelectValue placeholder='Selecione uma aplicação'>
              {currentValue !== '' &&
              currentValue !== 'all' &&
              aplicacoesData ? (
                <div className='flex items-center gap-2'>
                  {aplicacoesData.find((a) => a.id === currentValue)?.area && (
                    <div
                      className='h-4 w-4 rounded-full'
                      style={{
                        backgroundColor: aplicacoesData.find(
                          (a) => a.id === currentValue
                        )?.area?.color,
                      }}
                    />
                  )}
                  {aplicacoesData.find((a) => a.id === currentValue)?.nome}
                </div>
              ) : (
                'Todas'
              )}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>Todas</SelectItem>
            {aplicacoesData?.map((aplicacao) => (
              <SelectItem key={aplicacao.id} value={aplicacao.id || ''}>
                <div className='flex items-center gap-2'>
                  {aplicacao.area && (
                    <div
                      className='h-4 w-4 rounded-full'
                      style={{
                        backgroundColor: aplicacao.area.color,
                      }}
                    />
                  )}
                  {aplicacao.nome}
                </div>
              </SelectItem>
            ))}
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
          const columnKey =
            'accessorKey' in column ? column.accessorKey : column.id
          return (
            columnKey && filterFields.some((field) => field.value === columnKey)
          )
        })
        .sort((a, b) => {
          const aKey = 'accessorKey' in a ? a.accessorKey : a.id
          const bKey = 'accessorKey' in b ? b.accessorKey : b.id
          const aField = filterFields.find((field) => field.value === aKey)
          const bField = filterFields.find((field) => field.value === bKey)
          return (aField?.order ?? Infinity) - (bField?.order ?? Infinity)
        })
        .map((column) => {
          const columnKey =
            'accessorKey' in column ? column.accessorKey : column.id
          if (!columnKey) return null
          return (
            <div key={columnKey} className='space-y-2'>
              <Label>{getColumnHeader(column, filterFields)}</Label>
              {renderFilterInput(column)}
            </div>
          )
        })}
    </>
  )
}
