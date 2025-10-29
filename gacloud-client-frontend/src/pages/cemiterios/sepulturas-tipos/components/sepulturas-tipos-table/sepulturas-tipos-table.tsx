import { SepulturaTipoDTO } from '@/types/dtos/cemiterios/sepulturas-tipos.dtos'
import { Plus, Trash2 } from 'lucide-react'
import { useTableState, useDeleteHandler } from '@/utils/table-utils'
import { AlertModal } from '@/components/shared/alert-modal'
import { DataTable } from '@/components/shared/data-table'
import { useDeleteMultipleSepulturasTipos } from '../../queries/sepulturas-tipos-mutations'
import { columns } from './sepulturas-tipos-columns'
import { SepulturasTiposFilterControls } from './sepulturas-tipos-filter-controls'

type TSepulturasTiposTableProps = {
  sepulturasTipos: SepulturaTipoDTO[]
  page: number
  pageSize: number
  total: number
  pageCount: number
  onFiltersChange?: (filters: Array<{ id: string; value: string }>) => void
  onPaginationChange?: (page: number, pageSize: number) => void
  onSortingChange?: (sorting: Array<{ id: string; desc: boolean }>) => void
}

export function SepulturasTiposTable({
  sepulturasTipos,
  pageCount,
  total,
  onFiltersChange,
  onPaginationChange,
  onSortingChange,
}: TSepulturasTiposTableProps) {
  const deleteMultipleSepulturasTiposMutation =
    useDeleteMultipleSepulturasTipos()

  const { state, handlers, activeFiltersCount } = useTableState(
    onFiltersChange,
    onPaginationChange,
    onSortingChange
  )

  const { isDeleteModalOpen, setIsDeleteModalOpen, handleDeleteSelected } =
    useDeleteHandler(
      deleteMultipleSepulturasTiposMutation,
      'Tipos de sepulturas excluídos com sucesso',
      'Erro ao excluir tipos de sepulturas',
      state.selectedRows,
      undefined, // onSuccess callback
      'Alguns tipos de sepulturas foram excluídos com avisos', // partial success message
      (deletedIds: string[]) => {
        // Keep only the items that couldn't be deleted (failed items)
        const failedItems = state.selectedRows.filter(
          (id) => !deletedIds.includes(id)
        )
        handlers.handleRowSelectionChange(failedItems)
      }
    )

  return (
    <>
      {sepulturasTipos && (
        <>
          <DataTable
            data={sepulturasTipos}
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
            FilterControls={SepulturasTiposFilterControls}
            toolbarActions={[
              {
                label: 'Remover',
                icon: <Trash2 className='h-4 w-4' />,
                onClick: () => setIsDeleteModalOpen(true),
                variant: 'destructive',
                disabled:
                  !state.selectedRows || state.selectedRows.length === 0,
              },
              {
                label: 'Adicionar',
                icon: <Plus className='h-4 w-4' />,
                onClick: () =>
                  handlers.handleCreateClick(
                    '/cemiterios/configuracoes/sepulturas/tipos'
                  ),
                variant: 'emerald',
              },
            ]}
          />

          <AlertModal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            onConfirm={handleDeleteSelected}
            loading={deleteMultipleSepulturasTiposMutation.isPending}
            title='Remover Tipos de Sepulturas'
            description='Tem certeza que deseja remover os tipos de sepulturas selecionados?'
          />
        </>
      )}
    </>
  )
}
