import { columns } from './localizacoes-columns'
import { LocalizacoesFilterControls } from './localizacoes-filter-controls'
import { LocalizacaoDTO } from '@/types/dtos/base/localizacoes.dtos'
import { Plus, Trash2 } from 'lucide-react'
import { useTableState, useDeleteHandler } from '@/utils/table-utils'
import { AlertModal } from '@/components/shared/alert-modal'
import { DataTable } from '@/components/shared/data-table'
import { useDeleteMultipleLocalizacoes } from '../../queries/localizacoes-mutations'

type LocalizacoesTableProps = {
  localizacoes: LocalizacaoDTO[]
  page: number
  pageSize: number
  total: number
  pageCount: number
  onFiltersChange?: (filters: Array<{ id: string; value: string }>) => void
  onPaginationChange?: (page: number, pageSize: number) => void
  onSortingChange?: (sorting: Array<{ id: string; desc: boolean }>) => void
}

export function LocalizacoesTable({
  localizacoes,
  pageCount,
  total,
  onFiltersChange,
  onPaginationChange,
  onSortingChange,
}: LocalizacoesTableProps) {
  const deleteMultipleLocalizacoesMutation = useDeleteMultipleLocalizacoes()

  const { state, handlers, activeFiltersCount } = useTableState(
    onFiltersChange,
    onPaginationChange,
    onSortingChange
  )

  const { isDeleteModalOpen, setIsDeleteModalOpen, handleDeleteSelected } =
    useDeleteHandler(
      deleteMultipleLocalizacoesMutation,
      'Localizações excluídas com sucesso',
      'Erro ao excluir localizações',
      state.selectedRows,
      undefined,
      'Algumas localizações foram excluídas com avisos',
      (deletedIds: string[]) => {
        const failedItems = state.selectedRows.filter(
          (id) => !deletedIds.includes(id)
        )
        handlers.handleRowSelectionChange(failedItems)
      }
    )

  return (
    <>
      {localizacoes && (
        <>
          <DataTable
            data={localizacoes}
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
            FilterControls={LocalizacoesFilterControls}
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
                    '/utilitarios/tabelas/geograficas/localizacoes'
                  ),
                variant: 'emerald',
              },
            ]}
          />

          <AlertModal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            onConfirm={handleDeleteSelected}
            loading={deleteMultipleLocalizacoesMutation.isPending}
            title='Remover Localizações'
            description='Tem certeza que deseja remover as localizações selecionadas?'
          />
        </>
      )}
    </>
  )
}

