import { ViaturaDTO } from '@/types/dtos/frotas/viaturas.dtos'
import { Plus, Trash2 } from 'lucide-react'
import { useTableState, useDeleteHandler } from '@/utils/table-utils'
import { AlertModal } from '@/components/shared/alert-modal'
import { DataTable } from '@/components/shared/data-table'
import { useDeleteMultipleViaturas } from '@/pages/frotas/viaturas/queries/viaturas-mutations'
import { columns } from './viaturas-columns'
import { ViaturasFilterControls } from './viaturas-filter-controls'

type TViaturasTableProps = {
  viaturas: ViaturaDTO[]
  page: number
  pageSize: number
  total: number
  pageCount: number
  onFiltersChange?: (filters: Array<{ id: string; value: string }>) => void
  onPaginationChange?: (page: number, pageSize: number) => void
  onSortingChange?: (sorting: Array<{ id: string; desc: boolean }>) => void
}

export function ViaturasTable({
  viaturas,
  pageCount,
  total,
  onFiltersChange,
  onPaginationChange,
  onSortingChange,
}: TViaturasTableProps) {
  const deleteMultipleViaturasMutation = useDeleteMultipleViaturas()

  const { state, handlers, activeFiltersCount } = useTableState(
    onFiltersChange,
    onPaginationChange,
    onSortingChange
  )

  const { isDeleteModalOpen, setIsDeleteModalOpen, handleDeleteSelected } =
    useDeleteHandler(
      deleteMultipleViaturasMutation,
      'Viaturas removidas com sucesso',
      'Erro ao remover viaturas',
      state.selectedRows,
      undefined,
      'Algumas viaturas foram removidas com avisos',
      (deletedIds: string[]) => {
        const failedItems = state.selectedRows.filter(
          (id) => !deletedIds.includes(id)
        )
        handlers.handleRowSelectionChange(failedItems)
      }
    )

  return (
    <>
      {viaturas && (
        <>
          <DataTable
            data={viaturas}
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
            FilterControls={ViaturasFilterControls}
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
                onClick: () => handlers.handleCreateClick('/frotas/viaturas'),
                variant: 'emerald',
              },
            ]}
          />

          <AlertModal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            onConfirm={handleDeleteSelected}
            loading={deleteMultipleViaturasMutation.isPending}
            title='Remover Viaturas'
            description='Tem certeza que deseja remover as viaturas selecionadas?'
          />
        </>
      )}
    </>
  )
}

