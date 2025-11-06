import { Plus, Trash2 } from 'lucide-react'
import { useTableState, useDeleteHandler } from '@/utils/table-utils'
import { AlertModal } from '@/components/shared/alert-modal'
import { DataTable } from '@/components/shared/data-table'
import { useDeleteMultipleConservatorias } from '../../../conservatorias/queries/conservatorias-mutations'
import { columns } from './conservatorias-columns'
import { ConservatoriasFilterControls } from './conservatorias-filter-controls'
import { ConservatoriaDTO } from '@/types/dtos/base/conservatorias.dtos'

type TConservatoriasTableProps = {
  conservatorias: ConservatoriaDTO[]
  page: number
  pageSize: number
  total: number
  pageCount: number
  onFiltersChange?: (filters: Array<{ id: string; value: string }>) => void
  onPaginationChange?: (page: number, pageSize: number) => void
  onSortingChange?: (sorting: Array<{ id: string; desc: boolean }>) => void
}

export function ConservatoriasTable({
  conservatorias,
  pageCount,
  total,
  onFiltersChange,
  onPaginationChange,
  onSortingChange,
}: TConservatoriasTableProps) {
  const deleteMultipleConservatoriasMutation = useDeleteMultipleConservatorias()

  const { state, handlers, activeFiltersCount } = useTableState(
    onFiltersChange,
    onPaginationChange,
    onSortingChange
  )

  const { isDeleteModalOpen, setIsDeleteModalOpen, handleDeleteSelected } =
    useDeleteHandler(
      deleteMultipleConservatoriasMutation,
      'Conservatorias excluídas com sucesso',
      'Erro ao excluir conservatorias',
      state.selectedRows,
      undefined, // onSuccess callback
      'Algumas conservatorias foram excluídas com avisos', // partial success message
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
      {conservatorias && (
        <>
          <DataTable
            data={conservatorias}
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
            FilterControls={ConservatoriasFilterControls}
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
                    '/utilitarios/tabelas/configuracoes/conservatorias'
                  ),
                variant: 'emerald',
              },
            ]}
          />

          <AlertModal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            onConfirm={handleDeleteSelected}
            loading={deleteMultipleConservatoriasMutation.isPending}
            title='Remover Conservatorias'
            description='Tem certeza que deseja remover as conservatorias selecionadas?'
          />
        </>
      )}
    </>
  )
}

