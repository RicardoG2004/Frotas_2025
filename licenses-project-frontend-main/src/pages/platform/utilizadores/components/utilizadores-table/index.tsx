import { useState } from 'react'
import { UtilizadorCreateForm } from '@/pages/platform/utilizadores/components/utilizador-forms/utilizador-create-form'
import { columns } from '@/pages/platform/utilizadores/components/utilizadores-table/utilizadores-columns'
import { filterFields } from '@/pages/platform/utilizadores/components/utilizadores-table/utilizadores-constants'
import { UtilizadoresFilterControls } from '@/pages/platform/utilizadores/components/utilizadores-table/utilizadores-filter-controls'
import { UtilizadorDTO } from '@/types/dtos'
import { Plus, Trash2 } from 'lucide-react'
import { toast } from '@/utils/toast-utils'
import { EnhancedModal } from '@/components/ui/enhanced-modal'
import { AlertModal } from '@/components/shared/alert-modal'
import DataTable from '@/components/shared/data-table'
import { useDeleteMultipleUtilizadores } from '../../queries/utilizadores-mutations'

type TUtilizadoresTableProps = {
  utilizadores: UtilizadorDTO[]
  page: number
  total: number
  pageCount: number
  onFiltersChange?: (filters: Array<{ id: string; value: string }>) => void
  onPaginationChange?: (page: number, pageSize: number) => void
  onSortingChange?: (sorting: Array<{ id: string; desc: boolean }>) => void
}

export default function UtilizadoresTable({
  utilizadores,
  pageCount,
  total,
  onFiltersChange,
  onPaginationChange,
  onSortingChange,
}: TUtilizadoresTableProps) {
  const searchParams = new URLSearchParams(window.location.search)
  const utilizadorIdParam = searchParams.get('utilizadorId')
  const initialActiveFiltersCount = utilizadorIdParam ? 1 : 0
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [open, setOpen] = useState(false)

  const deleteMultipleUtilizadores = useDeleteMultipleUtilizadores()

  const handleFiltersChange = (
    filters: Array<{ id: string; value: string }>
  ) => {
    if (onFiltersChange) {
      onFiltersChange(filters)
    }
  }

  const handlePaginationChange = (page: number, pageSize: number) => {
    if (onPaginationChange) {
      onPaginationChange(page, pageSize)
    }
  }

  const handleSortingChange = (
    sorting: Array<{ id: string; desc: boolean }>
  ) => {
    if (onSortingChange) {
      onSortingChange(sorting)
    }
  }

  const handleRowSelectionChange = (newSelectedRows: string[]) => {
    setSelectedRows(newSelectedRows)
  }

  const handleDeleteConfirm = async () => {
    try {
      const response =
        await deleteMultipleUtilizadores.mutateAsync(selectedRows)

      if (response.info.succeeded) {
        toast.success('Utilizadores removidos com sucesso')
      } else {
        toast.error('Erro ao remover utilizadores')
      }
    } catch (error) {
      toast.error('Erro ao remover utilizadores')
    } finally {
      setSelectedRows([])
      setOpen(false)
    }
  }

  return (
    <>
      {utilizadores && (
        <>
          <DataTable
            columns={columns}
            data={utilizadores}
            pageCount={pageCount}
            filterFields={filterFields}
            FilterControls={UtilizadoresFilterControls}
            onFiltersChange={handleFiltersChange}
            onPaginationChange={handlePaginationChange}
            onSortingChange={handleSortingChange}
            initialActiveFiltersCount={initialActiveFiltersCount}
            baseRoute='/administracao/utilizadores'
            enableSorting={true}
            selectedRows={selectedRows}
            onRowSelectionChange={handleRowSelectionChange}
            totalRows={total}
            toolbarActions={[
              {
                label: 'Remover',
                icon: <Trash2 className='h-4 w-4' />,
                onClick: () => setOpen(true),
                variant: 'destructive',
                disabled: selectedRows.length === 0,
              },
              {
                label: 'Adicionar',
                icon: <Plus className='h-4 w-4' />,
                onClick: () => setIsCreateModalOpen(true),
                variant: 'emerald',
              },
            ]}
          />

          <EnhancedModal
            title='Criar Novo Utilizador'
            description='Crie um novo utilizador'
            isOpen={isCreateModalOpen}
            onClose={() => setIsCreateModalOpen(false)}
            size='xl'
          >
            <UtilizadorCreateForm
              modalClose={() => setIsCreateModalOpen(false)}
            />
          </EnhancedModal>

          <AlertModal
            isOpen={open}
            onClose={() => setOpen(false)}
            onConfirm={handleDeleteConfirm}
            loading={deleteMultipleUtilizadores.isPending}
          />
        </>
      )}
    </>
  )
}
