import { TipoViaturaDTO } from '@/types/dtos/frotas/tipo-viaturas.dtos'
import { Plus, Trash2 } from 'lucide-react'
import { useTableState, useDeleteHandler } from '@/utils/table-utils'
import { AlertModal } from '@/components/shared/alert-modal'
import { DataTable } from '@/components/shared/data-table'
import { useDeleteMultipleTipoViaturas } from '@/pages/frotas/tipo-viaturas/queries/tipo-viaturas-mutations'
import { columns } from './tipo-viaturas-columns'
import { TipoViaturasFilterControls } from './tipo-viaturas-filter-controls'

type TTipoViaturasTableProps = {
  tipoViaturas: TipoViaturaDTO[]
  page: number
  pageSize: number
  total: number
  pageCount: number
  onFiltersChange?: (filters: Array<{ id: string; value: string }>) => void
  onPaginationChange?: (page: number, pageSize: number) => void
  onSortingChange?: (sorting: Array<{ id: string; desc: boolean }>) => void
}

export function TipoViaturasTable({
  tipoViaturas,
  pageCount,
  total,
  onFiltersChange,
  onPaginationChange,
  onSortingChange,
}: TTipoViaturasTableProps) {
  const deleteMultipleTipoViaturasMutation = useDeleteMultipleTipoViaturas()

  const { state, handlers, activeFiltersCount } = useTableState(
    onFiltersChange,
    onPaginationChange,
    onSortingChange
  )

  const { isDeleteModalOpen, setIsDeleteModalOpen, handleDeleteSelected } =
    useDeleteHandler(
      deleteMultipleTipoViaturasMutation,
      'Tipos de viatura excluídos com sucesso',
      'Erro ao excluir tipos de viatura',
      state.selectedRows,
      undefined,
      'Alguns tipos de viatura foram excluídos com avisos',
      (deletedIds: string[]) => {
        const failedItems = state.selectedRows.filter(
          (id) => !deletedIds.includes(id)
        )
        handlers.handleRowSelectionChange(failedItems)
      }
    )

  return (
    <>
      {tipoViaturas && (
        <>
          <DataTable
            data={tipoViaturas}
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
            FilterControls={TipoViaturasFilterControls}
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
                    '/frotas/configuracoes/tipo-viaturas'
                  ),
                variant: 'emerald',
              },
            ]}
          />

          <AlertModal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            onConfirm={handleDeleteSelected}
            loading={deleteMultipleTipoViaturasMutation.isPending}
            title='Remover Tipos de Viatura'
            description='Tem certeza que deseja remover os tipos de viatura selecionados?'
          />
        </>
      )}
    </>
  )
}

