import { FornecedorDTO } from '@/types/dtos/frotas/fornecedores.dtos'
import { Plus, Trash2 } from 'lucide-react'
import { useTableState, useDeleteHandler } from '@/utils/table-utils'
import { AlertModal } from '@/components/shared/alert-modal'
import { DataTable } from '@/components/shared/data-table'
import { useDeleteMultipleFornecedores } from '@/pages/frotas/fornecedores/queries/fornecedores-mutations'
import { columns } from './fornecedores-columns'
import { FornecedoresFilterControls } from './fornecedores-filter-controls'

type TFornecedoresTableProps = {
  fornecedores: FornecedorDTO[]
  page: number
  pageSize: number
  total: number
  pageCount: number
  onFiltersChange?: (filters: Array<{ id: string; value: string }>) => void
  onPaginationChange?: (page: number, pageSize: number) => void
  onSortingChange?: (sorting: Array<{ id: string; desc: boolean }>) => void
}

export function FornecedoresTable({
  fornecedores,
  pageCount,
  total,
  onFiltersChange,
  onPaginationChange,
  onSortingChange,
}: TFornecedoresTableProps) {
  const deleteMultipleFornecedoresMutation = useDeleteMultipleFornecedores()

  const { state, handlers, activeFiltersCount } = useTableState(
    onFiltersChange,
    onPaginationChange,
    onSortingChange
  )

  const { isDeleteModalOpen, setIsDeleteModalOpen, handleDeleteSelected } =
    useDeleteHandler(
      deleteMultipleFornecedoresMutation,
      'Fornecedores excluídos com sucesso',
      'Erro ao excluir fornecedores',
      state.selectedRows,
      undefined, // onSuccess callback
      'Alguns fornecedores foram excluídos com avisos', // partial success message
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
      {fornecedores && (
        <>
          <DataTable
            data={fornecedores}
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
            FilterControls={FornecedoresFilterControls}
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
                  '/frotas/configuracoes/fornecedores'
                ),
                variant: 'emerald',
              },
            ]}
          />

          <AlertModal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            onConfirm={handleDeleteSelected}
            loading={deleteMultipleFornecedoresMutation.isPending}
            title='Remover Fornecedores'
            description={`Tem a certeza que deseja remover ${state.selectedRows.length} ${state.selectedRows.length === 1 ? 'fornecedor' : 'fornecedores'}?`}
          />
        </>
      )}
    </>
  )
}

