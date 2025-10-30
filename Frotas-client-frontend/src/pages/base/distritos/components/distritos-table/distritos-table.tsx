import { columns } from '@/pages/base/distritos/components/distritos-table/distritos-columns'
import { DistritosFilterControls } from '@/pages/base/distritos/components/distritos-table/distritos-filter-controls'
import { DistritoDTO } from '@/types/dtos/base/distritos.dtos'
import { Plus, Trash2 } from 'lucide-react'
import { useTableState, useDeleteHandler } from '@/utils/table-utils'
import { AlertModal } from '@/components/shared/alert-modal'
import { DataTable } from '@/components/shared/data-table'
import { useDeleteMultipleDistritos } from '../../queries/distritos-mutations'

type TDistritosTableProps = {
  distritos: DistritoDTO[]
  page: number
  pageSize: number
  total: number
  pageCount: number
  onFiltersChange?: (filters: Array<{ id: string; value: string }>) => void
  onPaginationChange?: (page: number, pageSize: number) => void
  onSortingChange?: (sorting: Array<{ id: string; desc: boolean }>) => void
}

export function DistritosTable({
  distritos,
  pageCount,
  total,
  onFiltersChange,
  onPaginationChange,
  onSortingChange,
}: TDistritosTableProps) {
  const deleteMultipleDistritosMutation = useDeleteMultipleDistritos()

  const { state, handlers, activeFiltersCount } = useTableState(
    onFiltersChange,
    onPaginationChange,
    onSortingChange
  )

  const { isDeleteModalOpen, setIsDeleteModalOpen, handleDeleteSelected } =
    useDeleteHandler(
      deleteMultipleDistritosMutation,
      'Distritos excluídos com sucesso',
      'Erro ao excluir distritos',
      state.selectedRows,
      undefined, // onSuccess callback
      'Algumas distritos foram excluídos com avisos', // partial success message
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
      {distritos && (
        <>
          <DataTable
            data={distritos}
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
            FilterControls={DistritosFilterControls}
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
                    '/utilitarios/tabelas/geograficas/distritos'
                  ),
                variant: 'emerald',
              },
            ]}
          />

          <AlertModal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            onConfirm={handleDeleteSelected}
            loading={deleteMultipleDistritosMutation.isPending}
            title='Remover Distritos'
            description='Tem certeza que deseja remover os distritos selecionados?'
          />
        </>
      )}
    </>
  )
}
