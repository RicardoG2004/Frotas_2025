import { FuncionarioDTO } from '@/types/dtos/base/funcionarios.dtos'
import { Plus, Trash2 } from 'lucide-react'
import { useTableState, useDeleteHandler } from '@/utils/table-utils'
import { AlertModal } from '@/components/shared/alert-modal'
import { DataTable } from '@/components/shared/data-table'
import { useDeleteMultipleFuncionarios } from '../../queries/funcionarios-mutations'
import { columns } from './funcionarios-columns'
import { FuncionariosFilterControls } from './funcionarios-filter-controls'

type FuncionariosTableProps = {
  funcionarios: FuncionarioDTO[]
  page: number
  pageSize: number
  total: number
  pageCount: number
  onFiltersChange?: (filters: Array<{ id: string; value: string }>) => void
  onPaginationChange?: (page: number, pageSize: number) => void
  onSortingChange?: (sorting: Array<{ id: string; desc: boolean }>) => void
}

export function FuncionariosTable({
  funcionarios,
  page,
  pageSize,
  total,
  pageCount,
  onFiltersChange,
  onPaginationChange,
  onSortingChange,
}: FuncionariosTableProps) {
  const deleteMultipleFuncionariosMutation = useDeleteMultipleFuncionarios()
  const { state, handlers, activeFiltersCount } = useTableState(
    onFiltersChange,
    onPaginationChange,
    onSortingChange
  )

  const { isDeleteModalOpen, setIsDeleteModalOpen, handleDeleteSelected } =
    useDeleteHandler(
      deleteMultipleFuncionariosMutation,
      'Funcionários excluídos com sucesso',
      'Erro ao excluir funcionários',
      state.selectedRows,
      undefined,
      'Alguns funcionários foram excluídos com avisos',
      (deletedIds: string[]) => {
        const remaining = state.selectedRows.filter(
          (id) => !deletedIds.includes(id)
        )
        handlers.handleRowSelectionChange(remaining)
      }
    )

  return (
    <>
      {funcionarios && (
        <>
          <DataTable
            data={funcionarios}
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
            initialPage={page}
            initialPageSize={pageSize}
            initialSorting={state.sorting}
            initialFilters={state.filters}
            initialActiveFiltersCount={activeFiltersCount}
            FilterControls={FuncionariosFilterControls}
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
                    '/utilitarios/tabelas/configuracoes/funcionarios'
                  ),
                variant: 'emerald',
              },
            ]}
          />

          <AlertModal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            onConfirm={handleDeleteSelected}
            loading={deleteMultipleFuncionariosMutation.isPending}
            title='Remover Funcionários'
            description={`Tem a certeza que deseja remover ${state.selectedRows.length} ${
              state.selectedRows.length === 1 ? 'funcionário' : 'funcionários'
            }?`}
          />
        </>
      )}
    </>
  )
}

