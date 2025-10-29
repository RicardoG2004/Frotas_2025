import { useState } from 'react'
import { UtilizadoresAdminFilterControls } from '@/pages/platform/utilizadores-admin/components/utilizadores-admin-table/utilizadores-admin-filter-controls'
import { UtilizadorDTO } from '@/types/dtos'
import { Plus, Trash2 } from 'lucide-react'
import { getErrorMessage } from '@/utils/error-handlers'
import { toast } from '@/utils/toast-utils'
import { EnhancedModal } from '@/components/ui/enhanced-modal'
import { AlertModal } from '@/components/shared/alert-modal'
import DataTable from '@/components/shared/data-table'
import { useDeleteMultipleUsers } from '../../queries/utilizadores-admin-mutations'
import { UtilizadorAdminCreateForm } from '../utilizador-admin-forms/utilizador-admin-create-form'
import { columns } from './utilizadores-admin-columns'
import { filterFields } from './utilizadores-admin-constants'

type TUtilizadoresTableProps = {
  utilizadores: UtilizadorDTO[]
  pageCount: number
  total: number
  onFiltersChange?: (filters: Array<{ id: string; value: string }>) => void
  onPaginationChange?: (page: number, pageSize: number) => void
  onSortingChange?: (sorting: Array<{ id: string; desc: boolean }>) => void
}

export default function UtilizadoresAdminTable({
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
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const deleteMultipleUsersMutation = useDeleteMultipleUsers()

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

  const handleDeleteMultiple = async () => {
    try {
      const response =
        await deleteMultipleUsersMutation.mutateAsync(selectedRows)

      if (response.info.succeeded) {
        toast.success('Utilizadores removidos com sucesso')
      } else {
        toast.error(getErrorMessage(response, 'Erro ao remover utilizadores'))
      }
    } catch (error) {
      toast.error('Erro ao remover utilizadores')
    } finally {
      setSelectedRows([])
      setIsDeleteModalOpen(false)
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
            FilterControls={UtilizadoresAdminFilterControls}
            onFiltersChange={handleFiltersChange}
            onPaginationChange={handlePaginationChange}
            onSortingChange={handleSortingChange}
            initialActiveFiltersCount={initialActiveFiltersCount}
            baseRoute='/administracao/utilizadores/admin'
            selectedRows={selectedRows}
            onRowSelectionChange={handleRowSelectionChange}
            enableSorting={true}
            totalRows={total}
            toolbarActions={[
              {
                label: 'Remover',
                icon: <Trash2 className='h-4 w-4' />,
                onClick: () => setIsDeleteModalOpen(true),
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
            <UtilizadorAdminCreateForm
              modalClose={() => setIsCreateModalOpen(false)}
            />
          </EnhancedModal>

          <AlertModal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            onConfirm={handleDeleteMultiple}
            loading={deleteMultipleUsersMutation.isPending}
            title='Remover Utilizadores'
            description='Tem certeza que deseja remover os utilizadores selecionados?'
          />
        </>
      )}
    </>
  )
}
