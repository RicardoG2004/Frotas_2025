import { AgenciaFunerariaDTO } from '@/types/dtos/cemiterios/agencias-funerarias.dtos'
import { Plus, Trash2 } from 'lucide-react'
import { useTableState, useDeleteHandler } from '@/utils/table-utils'
import { AlertModal } from '@/components/shared/alert-modal'
import { DataTable } from '@/components/shared/data-table'
import { useDeleteMultipleAgenciasFunerarias } from '../../queries/agencias-funerarias-mutations'
import { columns } from './agencias-funerarias-columns'
import { AgenciasFunerariasFilterControls } from './agencias-funerarias-filter-controls'

type TAgenciasFunerariasTableProps = {
  agenciasFunerarias: AgenciaFunerariaDTO[]
  page: number
  pageSize: number
  total: number
  pageCount: number
  onFiltersChange?: (filters: Array<{ id: string; value: string }>) => void
  onPaginationChange?: (page: number, pageSize: number) => void
  onSortingChange?: (sorting: Array<{ id: string; desc: boolean }>) => void
}

export function AgenciasFunerariasTable({
  agenciasFunerarias,
  pageCount,
  total,
  onFiltersChange,
  onPaginationChange,
  onSortingChange,
}: TAgenciasFunerariasTableProps) {
  const deleteMultipleAgenciasFunerariasMutation =
    useDeleteMultipleAgenciasFunerarias()

  const { state, handlers, activeFiltersCount } = useTableState(
    onFiltersChange,
    onPaginationChange,
    onSortingChange
  )

  const { isDeleteModalOpen, setIsDeleteModalOpen, handleDeleteSelected } =
    useDeleteHandler(
      deleteMultipleAgenciasFunerariasMutation,
      'Agências funerárias excluídas com sucesso',
      'Erro ao excluir agências funerárias',
      state.selectedRows,
      undefined, // onSuccess callback
      'Algumas agências funerárias foram excluídas com avisos', // partial success message
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
      {agenciasFunerarias && (
        <>
          <DataTable
            data={agenciasFunerarias}
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
            FilterControls={AgenciasFunerariasFilterControls}
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
                    '/cemiterios/configuracoes/agencias-funerarias'
                  ),
                variant: 'emerald',
              },
            ]}
          />

          <AlertModal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            onConfirm={handleDeleteSelected}
            loading={deleteMultipleAgenciasFunerariasMutation.isPending}
            title='Remover Agências Funerárias'
            description='Tem certeza que deseja remover as agências funerárias selecionadas?'
          />
        </>
      )}
    </>
  )
}
