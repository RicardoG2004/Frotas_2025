import { Plus, Trash2 } from 'lucide-react'
import { DataTable } from '@/components/shared/data-table'
import { AlertModal } from '@/components/shared/alert-modal'
import { useDeleteHandler, useTableState } from '@/utils/table-utils'
import { CargoDTO } from '@/types/dtos/base/cargos.dtos'
import { useDeleteMultipleCargos } from '@/pages/base/cargos/queries/cargos-mutations'
import { CargosFilterControls } from './cargos-filter-controls'
import { columns } from './cargos-columns'

type CargosTableProps = {
  cargos: CargoDTO[]
  page: number
  pageSize: number
  total: number
  pageCount: number
  onFiltersChange?: (filters: Array<{ id: string; value: string }>) => void
  onPaginationChange?: (page: number, pageSize: number) => void
  onSortingChange?: (sorting: Array<{ id: string; desc: boolean }>) => void
}

export function CargosTable({
  cargos,
  pageCount,
  total,
  onFiltersChange,
  onPaginationChange,
  onSortingChange,
}: CargosTableProps) {
  const deleteMultipleCargosMutation = useDeleteMultipleCargos()

  const { state, handlers, activeFiltersCount } = useTableState(
    onFiltersChange,
    onPaginationChange,
    onSortingChange
  )

  const { isDeleteModalOpen, setIsDeleteModalOpen, handleDeleteSelected } =
    useDeleteHandler(
      deleteMultipleCargosMutation,
      'Cargos removidos com sucesso',
      'Erro ao remover cargos',
      state.selectedRows,
      undefined,
      'Alguns cargos foram removidos com avisos',
      (deletedIds: string[]) => {
        const failedItems = state.selectedRows.filter(
          (id) => !deletedIds.includes(id)
        )
        handlers.handleRowSelectionChange(failedItems)
      }
    )

  return (
    <>
      {cargos && (
        <>
          <DataTable
            data={cargos}
            columns={columns}
            pageCount={pageCount}
            totalRows={total}
            onFiltersChange={handlers.handleFiltersChange}
            onPaginationChange={handlers.handlePaginationChange}
            onSortingChange={handlers.handleSortingChange}
            onRowSelectionChange={handlers.handleRowSelectionChange}
            selectedRows={state.selectedRows}
            initialColumnVisibility={state.columnVisibility}
            onColumnVisibilityChange={handlers.handleColumnVisibilityChange}
            initialPage={state.pagination.page}
            initialPageSize={state.pagination.pageSize}
            initialSorting={state.sorting}
            initialFilters={state.filters}
            initialActiveFiltersCount={activeFiltersCount}
            FilterControls={CargosFilterControls}
            toolbarActions={[
              {
                label: 'Remover',
                icon: <Trash2 className='h-4 w-4' />,
                onClick: () => setIsDeleteModalOpen(true),
                variant: 'destructive',
                disabled: !state.selectedRows || state.selectedRows.length === 0,
              },
              {
                label: 'Adicionar',
                icon: <Plus className='h-4 w-4' />,
                onClick: () =>
                  handlers.handleCreateClick(
                    '/utilitarios/tabelas/configuracoes/cargos'
                  ),
                variant: 'emerald',
              },
            ]}
          />

          <AlertModal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            onConfirm={handleDeleteSelected}
            loading={deleteMultipleCargosMutation.isPending}
            title='Remover Cargos'
            description='Tem certeza que deseja remover os cargos selecionados?'
          />
        </>
      )}
    </>
  )
}


