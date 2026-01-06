import { useState } from 'react'
import AreaCreateForm from '@/pages/application/areas/components/area-forms/area-create-form'
import { columns } from '@/pages/application/areas/components/areas-table/areas-columns'
import { filterFields } from '@/pages/application/areas/components/areas-table/areas-constants'
import { AreasFilterControls } from '@/pages/application/areas/components/areas-table/areas-filter-controls'
import { AreaDTO } from '@/types/dtos'
import { Plus, Trash2 } from 'lucide-react'
import { getErrorMessage } from '@/utils/error-handlers'
import { toast } from '@/utils/toast-utils'
import { EnhancedModal } from '@/components/ui/enhanced-modal'
import { AlertModal } from '@/components/shared/alert-modal'
import DataTable from '@/components/shared/data-table'
import { useDeleteMultipleAreas } from '../../queries/areas-mutations'

type TAreasTableProps = {
  areas: AreaDTO[]
  page: number
  total: number
  pageCount: number
  onFiltersChange?: (filters: Array<{ id: string; value: string }>) => void
  onPaginationChange?: (page: number, pageSize: number) => void
  onSortingChange?: (sorting: Array<{ id: string; desc: boolean }>) => void
}

export default function AreasTable({
  areas,
  pageCount,
  total,
  onFiltersChange,
  onPaginationChange,
  onSortingChange,
}: TAreasTableProps) {
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const deleteMultipleAreasMutation = useDeleteMultipleAreas()

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
        await deleteMultipleAreasMutation.mutateAsync(selectedRows)

      if (response.info.succeeded) {
        toast.success('Áreas removidas com sucesso')
      } else {
        toast.error(getErrorMessage(response, 'Erro ao remover áreas'))
      }
    } catch (error) {
      toast.error('Erro ao remover áreas')
    } finally {
      setSelectedRows([])
      setIsDeleteModalOpen(false)
    }
  }

  return (
    <>
      {areas && (
        <>
          <DataTable
            columns={columns}
            data={areas}
            pageCount={pageCount}
            totalRows={total}
            filterFields={filterFields}
            FilterControls={AreasFilterControls}
            onFiltersChange={handleFiltersChange}
            onPaginationChange={handlePaginationChange}
            onSortingChange={handleSortingChange}
            selectedRows={selectedRows}
            onRowSelectionChange={handleRowSelectionChange}
            enableSorting={true}
            toolbarActions={[
              {
                label: 'Remover',
                icon: <Trash2 className='h-4 w-4' />,
                onClick: () => setIsDeleteModalOpen(true),
                variant: 'destructive',
                disabled:
                  selectedRows.length === 0 ||
                  deleteMultipleAreasMutation.isPending,
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
            title='Criar Nova Área'
            description='Crie uma nova área para atribuir nas aplicações'
            isOpen={isCreateModalOpen}
            onClose={() => setIsCreateModalOpen(false)}
            size='md'
          >
            <AreaCreateForm modalClose={() => setIsCreateModalOpen(false)} />
          </EnhancedModal>

          <AlertModal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            onConfirm={handleDeleteMultiple}
            loading={deleteMultipleAreasMutation.isPending}
            title='Remover Áreas'
            description='Tem certeza que deseja remover as áreas selecionadas?'
          />
        </>
      )}
    </>
  )
}
