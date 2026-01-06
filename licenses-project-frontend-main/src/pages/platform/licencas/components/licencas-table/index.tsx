import { useState } from 'react'
import { LicencaDTO } from '@/types/dtos'
import { Plus, Trash2 } from 'lucide-react'
import { getErrorMessage } from '@/utils/error-handlers'
import { toast } from '@/utils/toast-utils'
import { EnhancedModal } from '@/components/ui/enhanced-modal'
import { AlertModal } from '@/components/shared/alert-modal'
import DataTable from '@/components/shared/data-table'
import { useDeleteMultipleLicencas } from '../../queries/licencas-mutations'
import LicencaCreateForm from '../licenca-forms/licenca-create-form'
import { columns } from './licencas-columns'
import { filterFields } from './licencas-constants'
import { LicencasFilterControls } from './licencas-filter-controls'

type TLicencasTableProps = {
  licencas: LicencaDTO[]
  page: number
  total: number
  pageCount: number
  onFiltersChange?: (filters: Array<{ id: string; value: string }>) => void
  onPaginationChange?: (page: number, pageSize: number) => void
  onSortingChange?: (sorting: Array<{ id: string; desc: boolean }>) => void
}

export default function LicencasTable({
  licencas,
  pageCount,
  total,
  onFiltersChange,
  onPaginationChange,
  onSortingChange,
}: TLicencasTableProps) {
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const deleteMultipleLicencasMutation = useDeleteMultipleLicencas()

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
        await deleteMultipleLicencasMutation.mutateAsync(selectedRows)

      if (response.info.succeeded) {
        toast.success('Licenças removidas com sucesso')
      } else {
        toast.error(getErrorMessage(response, 'Erro ao remover licenças'))
      }
    } catch (error) {
      toast.error('Erro ao remover licenças')
    } finally {
      setSelectedRows([])
      setIsDeleteModalOpen(false)
    }
  }

  return (
    <>
      {/* <LicencasTableActions /> */}
      {licencas && (
        <>
          <DataTable
            columns={columns}
            data={licencas}
            pageCount={pageCount}
            filterFields={filterFields}
            FilterControls={LicencasFilterControls}
            onFiltersChange={handleFiltersChange}
            onPaginationChange={handlePaginationChange}
            onSortingChange={handleSortingChange}
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
            title='Criar Nova Licença'
            description='Crie uma nova licença'
            isOpen={isCreateModalOpen}
            onClose={() => setIsCreateModalOpen(false)}
            size='xl'
          >
            <LicencaCreateForm modalClose={() => setIsCreateModalOpen(false)} />
          </EnhancedModal>

          <AlertModal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            onConfirm={handleDeleteMultiple}
            loading={deleteMultipleLicencasMutation.isPending}
            title='Remover Licenças'
            description='Tem a certeza que deseja remover as licenças seleccionadas?'
          />
        </>
      )}
    </>
  )
}
