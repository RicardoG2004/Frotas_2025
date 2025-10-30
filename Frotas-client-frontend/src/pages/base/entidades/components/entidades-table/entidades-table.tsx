import { EntidadeDTO } from '@/types/dtos/base/entidades.dtos'
import { Plus, Trash2 } from 'lucide-react'
import { useTableState, useDeleteHandler } from '@/utils/table-utils'
import { AlertModal } from '@/components/shared/alert-modal'
import { DataTable } from '@/components/shared/data-table'
import { useDeleteMultipleEntidades } from '../../queries/entidades-mutations'
import { columns } from './entidades-columns'
import { EntidadesFilterControls } from './entidades-filter-controls'

type TEntidadesTableProps = {
  entidades: EntidadeDTO[]
  page: number
  pageSize: number
  total: number
  pageCount: number
  onFiltersChange?: (filters: Array<{ id: string; value: string }>) => void
  onPaginationChange?: (page: number, pageSize: number) => void
  onSortingChange?: (sorting: Array<{ id: string; desc: boolean }>) => void
}

export function EntidadesTable({
  entidades,
  pageCount,
  total,
  onFiltersChange,
  onPaginationChange,
  onSortingChange,
}: TEntidadesTableProps) {
  const deleteMultipleEntidadesMutation = useDeleteMultipleEntidades()

  const { state, handlers, activeFiltersCount } = useTableState(
    onFiltersChange,
    onPaginationChange,
    onSortingChange
  )

  const { isDeleteModalOpen, setIsDeleteModalOpen, handleDeleteSelected } =
    useDeleteHandler(
      deleteMultipleEntidadesMutation,
      'Entidades excluídas com sucesso',
      'Erro ao excluir entidades',
      state.selectedRows,
      undefined, // onSuccess callback
      'Algumas entidades foram excluídas com avisos', // partial success message
      (deletedIds: string[]) => {
        // Keep only the items that couldn't be deleted (failed items)
        // This way the user knows which ones still need attention
        const failedItems = state.selectedRows.filter(
          (id) => !deletedIds.includes(id)
        )
        handlers.handleRowSelectionChange(failedItems)
      }
    )

  return (
    <>
      {entidades && (
        <>
          <DataTable
            data={entidades}
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
            FilterControls={EntidadesFilterControls}
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
                    '/utilitarios/tabelas/configuracoes/entidades'
                  ),
                variant: 'emerald',
              },
            ]}
          />

          <AlertModal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            onConfirm={handleDeleteSelected}
            loading={deleteMultipleEntidadesMutation.isPending}
            title='Remover Entidades'
            description='Tem certeza que deseja remover as entidades selecionadas?'
          />
        </>
      )}
    </>
  )
}
