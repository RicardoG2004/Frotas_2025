import { SepulturaTipoGeralDTO } from '@/types/dtos/cemiterios/sepulturas-tipos-geral.dtos'
import { Plus, Trash2 } from 'lucide-react'
import { useTableState, useDeleteHandler } from '@/utils/table-utils'
import { AlertModal } from '@/components/shared/alert-modal'
import { DataTable } from '@/components/shared/data-table'
import { useDeleteMultipleSepulturaTiposDescricoes } from '../../queries/sepulturas-tipos-descricoes-mutations'
import { columns } from './sepulturas-tipos-descricoes-columns'
import { SepulturasTiposDescricoesFilterControls } from './sepulturas-tipos-descricoes-filter-controls'

type TSepulturasTiposDescricoesTableProps = {
  sepulturasTiposDescricoes: SepulturaTipoGeralDTO[]
  page: number
  pageSize: number
  total: number
  pageCount: number
  onFiltersChange?: (filters: Array<{ id: string; value: string }>) => void
  onPaginationChange?: (page: number, pageSize: number) => void
  onSortingChange?: (sorting: Array<{ id: string; desc: boolean }>) => void
}

export function SepulturasTiposDescricoesTable({
  sepulturasTiposDescricoes,
  pageCount,
  total,
  onFiltersChange,
  onPaginationChange,
  onSortingChange,
}: TSepulturasTiposDescricoesTableProps) {
  const deleteMultipleSepulturaTiposDescricoesMutation =
    useDeleteMultipleSepulturaTiposDescricoes()

  const { state, handlers, activeFiltersCount } = useTableState(
    onFiltersChange,
    onPaginationChange,
    onSortingChange
  )

  const { isDeleteModalOpen, setIsDeleteModalOpen, handleDeleteSelected } =
    useDeleteHandler(
      deleteMultipleSepulturaTiposDescricoesMutation,
      'Descrições de tipos de sepulturas excluídas com sucesso',
      'Erro ao excluir descrições de tipos de sepulturas',
      state.selectedRows,
      undefined, // onSuccess callback
      'Algumas descrições de tipos de sepulturas foram excluídas com avisos', // partial success message
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
      {sepulturasTiposDescricoes && (
        <>
          <DataTable
            data={sepulturasTiposDescricoes}
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
            FilterControls={SepulturasTiposDescricoesFilterControls}
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
                    '/cemiterios/outros/tipos-descricoes'
                  ),
                variant: 'emerald',
              },
            ]}
          />

          <AlertModal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            onConfirm={handleDeleteSelected}
            loading={deleteMultipleSepulturaTiposDescricoesMutation.isPending}
            title='Remover Descrições de Tipos de Sepulturas'
            description='Tem certeza que deseja remover as descrições de tipos de sepulturas selecionadas?'
          />
        </>
      )}
    </>
  )
}
