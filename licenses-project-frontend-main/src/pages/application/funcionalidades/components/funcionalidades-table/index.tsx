import { useState } from 'react'
import { FuncionalidadeDTO } from '@/types/dtos'
import { Plus, Trash2 } from 'lucide-react'
import { getErrorMessage } from '@/utils/error-handlers'
import { toast } from '@/utils/toast-utils'
import { EnhancedModal } from '@/components/ui/enhanced-modal'
import { AlertModal } from '@/components/shared/alert-modal'
import DataTable from '@/components/shared/data-table'
import { useDeleteMultipleFuncionalidades } from '../../queries/funcionalidades-mutations'
import FuncionalidadeCreateForm from '../funcionalidade-forms/funcionalidade-create-form'
import { columns } from './funcionalidades-columns'
import { filterFields } from './funcionalidades-constants'
import { FuncionalidadesFilterControls } from './funcionalidades-filter-controls'

type TFuncionalidadesTableProps = {
  funcionalidades: FuncionalidadeDTO[]
  page: number
  total: number
  pageCount: number
  onFiltersChange?: (filters: Array<{ id: string; value: string }>) => void
  onPaginationChange?: (page: number, pageSize: number) => void
  onSortingChange?: (sorting: Array<{ id: string; desc: boolean }>) => void
}

export default function FuncionalidadesTable({
  funcionalidades,
  pageCount,
  total,
  onFiltersChange,
  onPaginationChange,
  onSortingChange,
}: TFuncionalidadesTableProps) {
  const searchParams = new URLSearchParams(window.location.search)
  const moduloIdParam = searchParams.get('moduloId')
  const initialActiveFiltersCount = moduloIdParam ? 1 : 0
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const deleteMultipleFuncionalidadesMutation =
    useDeleteMultipleFuncionalidades()

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
        await deleteMultipleFuncionalidadesMutation.mutateAsync(selectedRows)

      if (response.info.succeeded) {
        toast.success('Funcionalidades removidas com sucesso')
      } else {
        toast.error(
          getErrorMessage(response, 'Erro ao remover funcionalidades')
        )
      }
    } catch (error) {
      toast.error('Erro ao remover funcionalidades')
    } finally {
      setSelectedRows([])
      setIsDeleteModalOpen(false)
    }
  }

  return (
    <>
      {funcionalidades && (
        <>
          <DataTable
            columns={columns}
            data={funcionalidades}
            pageCount={pageCount}
            filterFields={filterFields}
            FilterControls={FuncionalidadesFilterControls}
            onFiltersChange={handleFiltersChange}
            onPaginationChange={handlePaginationChange}
            onSortingChange={handleSortingChange}
            initialActiveFiltersCount={initialActiveFiltersCount}
            baseRoute='/administracao/funcionalidades'
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
            title='Criar Nova Funcionalidade'
            description='Crie uma nova funcionalidade'
            isOpen={isCreateModalOpen}
            onClose={() => setIsCreateModalOpen(false)}
            size='lg'
          >
            <FuncionalidadeCreateForm
              modalClose={() => setIsCreateModalOpen(false)}
              preSelectedModuloId={moduloIdParam || undefined}
            />
          </EnhancedModal>

          <AlertModal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            onConfirm={handleDeleteMultiple}
            loading={deleteMultipleFuncionalidadesMutation.isPending}
            title='Remover Funcionalidades'
            description='Tem certeza que deseja remover as funcionalidades selecionadas?'
          />
        </>
      )}
    </>
  )
}
