import { CodigoPostalDTO } from '@/types/dtos/base/codigospostais.dtos'
import { Plus, Trash2 } from 'lucide-react'
// import { useLocation } from 'react-router-dom'
import { useTableState, useDeleteHandler } from '@/utils/table-utils'
import { AlertModal } from '@/components/shared/alert-modal'
import { DataTable } from '@/components/shared/data-table'
import { useDeleteMultipleCodigosPostais } from '../../queries/codigospostais-mutations'
import { columns } from './codigospostais-columns'
import { filterFields } from './codigospostais-constants'
import { CodigosPostaisFilterControls } from './codigospostais-filter-controls'

type TCodigosPostaisTableProps = {
  codigosPostais: CodigoPostalDTO[]
  page: number
  pageSize: number
  total: number
  pageCount: number
  onFiltersChange?: (filters: Array<{ id: string; value: string }>) => void
  onPaginationChange?: (page: number, pageSize: number) => void
  onSortingChange?: (sorting: Array<{ id: string; desc: boolean }>) => void
}

export function CodigosPostaisTable({
  codigosPostais,
  pageCount,
  total,
  page,
  pageSize,
  onFiltersChange,
  onPaginationChange,
  onSortingChange,
}: TCodigosPostaisTableProps) {
  // const location = useLocation()
  const deleteMultipleCodigosPostaisMutation = useDeleteMultipleCodigosPostais()

  const { state, handlers, activeFiltersCount } = useTableState(
    onFiltersChange,
    onPaginationChange,
    onSortingChange
  )

  const { isDeleteModalOpen, setIsDeleteModalOpen, handleDeleteSelected } =
    useDeleteHandler(
      deleteMultipleCodigosPostaisMutation,
      'Códigos Postais removidos com sucesso',
      'Erro ao remover códigos postais',
      state.selectedRows,
      undefined, // onSuccess callback
      'Algumas códigos postais foram removidos com avisos', // partial success message
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
      {codigosPostais && (
        <>
          <DataTable
            columns={columns}
            data={codigosPostais}
            pageCount={pageCount}
            initialPage={page}
            initialPageSize={pageSize}
            initialSorting={state.sorting}
            initialColumnVisibility={state.columnVisibility}
            onColumnVisibilityChange={handlers.handleColumnVisibilityChange}
            filterFields={filterFields}
            FilterControls={CodigosPostaisFilterControls}
            onFiltersChange={handlers.handleFiltersChange}
            onPaginationChange={handlers.handlePaginationChange}
            onSortingChange={handlers.handleSortingChange}
            initialActiveFiltersCount={activeFiltersCount}
            baseRoute='/utilitarios/tabelas/geograficas/codigospostais'
            selectedRows={state.selectedRows}
            onRowSelectionChange={handlers.handleRowSelectionChange}
            enableSorting={true}
            totalRows={total}
            toolbarActions={[
              {
                label: 'Remover',
                icon: <Trash2 className='h-4 w-4' />,
                onClick: () => setIsDeleteModalOpen(true),
                variant: 'destructive',
                disabled: state.selectedRows.length === 0,
              },
              {
                label: 'Adicionar',
                icon: <Plus className='h-4 w-4' />,
                onClick: () =>
                  handlers.handleCreateClick(
                    '/utilitarios/tabelas/geograficas/codigospostais'
                  ),
                variant: 'emerald',
              },
            ]}
          />

          <AlertModal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            onConfirm={handleDeleteSelected}
            loading={deleteMultipleCodigosPostaisMutation.isPending}
            title='Remover Códigos Postais'
            description='Tem certeza que deseja remover os códigos postais selecionados?'
          />
        </>
      )}
    </>
  )
}
