import { useState } from 'react'
import PerfilAdminCreateForm from '@/pages/platform/perfis-admin/components/perfis-admin-forms/perfil-admin-create-form'
import { columns } from '@/pages/platform/perfis-admin/components/perfis-admin-table/perfis-admin-columns'
import { filterFields } from '@/pages/platform/perfis-admin/components/perfis-admin-table/perfis-admin-constants'
import { PerfisFilterControls } from '@/pages/platform/perfis-admin/components/perfis-admin-table/perfis-admin-filter-controls'
import { PerfilDTO } from '@/types/dtos'
import { Plus, Trash2 } from 'lucide-react'
import { useAuthStore } from '@/stores/auth-store'
import { getErrorMessage } from '@/utils/error-handlers'
import { toast } from '@/utils/toast-utils'
import { EnhancedModal } from '@/components/ui/enhanced-modal'
import { AlertModal } from '@/components/shared/alert-modal'
import DataTable from '@/components/shared/data-table'
import { useDeleteMultiplePerfis } from '../../queries/perfis-admin-mutations'

type TPerfisAdminTableProps = {
  perfis: PerfilDTO[]
  page: number
  total: number
  pageCount: number
  onFiltersChange?: (filters: Array<{ id: string; value: string }>) => void
  onPaginationChange?: (page: number, pageSize: number) => void
  onSortingChange?: (sorting: Array<{ id: string; desc: boolean }>) => void
}

export function PerfisAdminTable({
  perfis,
  pageCount,
  total,
  onFiltersChange,
  onPaginationChange,
  onSortingChange,
}: TPerfisAdminTableProps) {
  const searchParams = new URLSearchParams(window.location.search)
  const perfilIdParam = searchParams.get('perfilId')
  const initialActiveFiltersCount = perfilIdParam ? 1 : 0
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const { licencaId } = useAuthStore()
  const deleteMultiplePerfisMutation = useDeleteMultiplePerfis()

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
      const response = await deleteMultiplePerfisMutation.mutateAsync({
        licencaId,
        ids: selectedRows,
      })

      if (response.info.succeeded) {
        toast.success('Perfis removidos com sucesso')
      } else {
        toast.error(getErrorMessage(response, 'Erro ao remover perfis'))
      }
    } catch (error) {
      toast.error('Erro ao remover perfis')
    } finally {
      setSelectedRows([])
      setIsDeleteModalOpen(false)
    }
  }

  return (
    <>
      {perfis && (
        <>
          <DataTable
            columns={columns}
            data={perfis}
            pageCount={pageCount}
            filterFields={filterFields}
            FilterControls={PerfisFilterControls}
            onFiltersChange={handleFiltersChange}
            onPaginationChange={handlePaginationChange}
            onSortingChange={handleSortingChange}
            initialActiveFiltersCount={initialActiveFiltersCount}
            baseRoute='/administracao/perfis/admin'
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
            title='Criar Novo Perfil'
            description='Crie um novo perfil'
            isOpen={isCreateModalOpen}
            onClose={() => setIsCreateModalOpen(false)}
            size='md'
          >
            <PerfilAdminCreateForm
              modalClose={() => setIsCreateModalOpen(false)}
            />
          </EnhancedModal>

          <AlertModal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            onConfirm={handleDeleteMultiple}
            loading={deleteMultiplePerfisMutation.isPending}
            title='Remover Perfis'
            description='Tem certeza que deseja remover os perfis selecionados?'
          />
        </>
      )}
    </>
  )
}
