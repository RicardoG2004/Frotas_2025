import { useState, useEffect } from 'react'
import { ColumnDef, ColumnFilter } from '@tanstack/react-table'
import { useGetAplicacoesSelect } from '@/pages/application/aplicacoes/queries/aplicacoes-queries'
import { filterFields } from '@/pages/application/funcionalidades/components/funcionalidades-table/funcionalidades-constants'
import { useGetModulosSelect } from '@/pages/application/modulos/queries/modulos-queries'
import { FuncionalidadeDTO } from '@/types/dtos'
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

export function FuncionalidadesFilterControls({
  table,
  columns,
}: BaseFilterControlsProps<FuncionalidadeDTO>) {
  const [filterValues, setFilterValues] = useState<Record<string, string>>({})
  const [initialParamApplied, setInitialParamApplied] = useState(false)
  const searchParams = new URLSearchParams(window.location.search)
  const moduloIdParam = searchParams.get('moduloId')

  const { data: aplicacoesData } = useGetAplicacoesSelect()
  const { data: modulosData } = useGetModulosSelect()
  useEffect(() => {
    const currentFilters = table.getState().columnFilters
    const newFilterValues: Record<string, string> = {}

    currentFilters.forEach((filter: ColumnFilter) => {
      if (filter.value) {
        newFilterValues[filter.id] = filter.value as string
      }
    })

    if (moduloIdParam && !initialParamApplied) {
      newFilterValues['moduloId'] = moduloIdParam
      table.getColumn('moduloId')?.setFilterValue(moduloIdParam)
      setInitialParamApplied(true)
    }

    setFilterValues(newFilterValues)
  }, [table.getState().columnFilters, moduloIdParam, initialParamApplied])

  const handleFilterChange = (columnId: string, value: string) => {
    const newValue = value === 'all' ? '' : value

    setFilterValues((prev) => ({
      ...prev,
      [columnId]: newValue,
      ...(columnId === 'aplicacaoId' && { moduloId: '' }),
    }))

    table.getColumn(columnId)?.setFilterValue(newValue)
    if (columnId === 'aplicacaoId') {
      table.getColumn('moduloId')?.setFilterValue('')
    }

    if (initialParamApplied) {
      const newUrl = new URL(window.location.href)
      newUrl.searchParams.delete('moduloId')
      window.history.pushState({}, '', newUrl)
    }
  }

  const renderFilterInput = (column: ColumnDef<FuncionalidadeDTO, unknown>) => {
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

    if (column.accessorKey === 'moduloId') {
      const currentValue = filterValues[column.accessorKey] ?? ''
      const selectedAplicacaoId = filterValues['aplicacaoId'] ?? ''

      const filteredModulos = selectedAplicacaoId
        ? modulosData?.filter(
            (modulo) =>
              modulo.aplicacao && modulo.aplicacao.id === selectedAplicacaoId
          )
        : modulosData

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
            <SelectValue placeholder='Selecione um módulo'>
              {currentValue !== '' && currentValue !== 'all' && modulosData ? (
                <div className='flex items-center gap-2'>
                  {modulosData.find((m) => m.id === currentValue)?.aplicacao
                    ?.area && (
                    <div
                      className='h-4 w-4 rounded-full'
                      style={{
                        backgroundColor: modulosData.find(
                          (m) => m.id === currentValue
                        )?.aplicacao?.area?.color,
                      }}
                    />
                  )}
                  {modulosData.find((m) => m.id === currentValue)?.nome}
                </div>
              ) : (
                'Todos'
              )}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>Todos</SelectItem>
            {filteredModulos?.map((modulo) => (
              <SelectItem key={modulo.id} value={modulo.id || ''}>
                <div className='flex items-center gap-2'>
                  {modulo.aplicacao?.area && (
                    <div
                      className='h-4 w-4 rounded-full'
                      style={{
                        backgroundColor: modulo.aplicacao.area.color,
                      }}
                    />
                  )}
                  {modulo.nome}
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
