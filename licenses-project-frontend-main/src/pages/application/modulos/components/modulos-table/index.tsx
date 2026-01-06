import { useState } from 'react'
import ModuloCreateForm from '@/pages/application/modulos/components/modulo-forms/modulo-create-form'
import { columns } from '@/pages/application/modulos/components/modulos-table/modulos-columns'
import { filterFields } from '@/pages/application/modulos/components/modulos-table/modulos-constants'
import { ModulosFilterControls } from '@/pages/application/modulos/components/modulos-table/modulos-filter-controls'
import { ModuloDTO } from '@/types/dtos'
import { Plus, Trash2 } from 'lucide-react'
import { getErrorMessage } from '@/utils/error-handlers'
import { toast } from '@/utils/toast-utils'
import { EnhancedModal } from '@/components/ui/enhanced-modal'
import { AlertModal } from '@/components/shared/alert-modal'
import DataTable from '@/components/shared/data-table'
import { useDeleteMultipleModulos } from '../../queries/modulos-mutations'

type TModulosTableProps = {
  modulos: ModuloDTO[]
  page: number
  total: number
  pageCount: number
  onFiltersChange?: (filters: Array<{ id: string; value: string }>) => void
  onPaginationChange?: (page: number, pageSize: number) => void
  onSortingChange?: (sorting: Array<{ id: string; desc: boolean }>) => void
}

export default function ModulosTable({
  modulos,
  pageCount,
  total,
  onFiltersChange,
  onPaginationChange,
  onSortingChange,
}: TModulosTableProps) {
  const searchParams = new URLSearchParams(window.location.search)
  const aplicacaoIdParam = searchParams.get('aplicacaoId')
  const initialActiveFiltersCount = aplicacaoIdParam ? 1 : 0
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const deleteMultipleModulosMutation = useDeleteMultipleModulos()

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
        await deleteMultipleModulosMutation.mutateAsync(selectedRows)

      if (response.info.succeeded) {
        toast.success('Módulos removidos com sucesso')
      } else {
        toast.error(getErrorMessage(response, 'Erro ao remover módulos'))
      }
    } catch (error) {
      toast.error('Erro ao remover módulos')
    } finally {
      setSelectedRows([])
      setIsDeleteModalOpen(false)
    }
  }

  return (
    <>
      {/* <ModulosTableActions currentFilters={currentFilters} /> */}
      {modulos && (
        <>
          <DataTable
            columns={columns}
            data={modulos}
            pageCount={pageCount}
            filterFields={filterFields}
            FilterControls={ModulosFilterControls}
            onFiltersChange={handleFiltersChange}
            onPaginationChange={handlePaginationChange}
            onSortingChange={handleSortingChange}
            initialActiveFiltersCount={initialActiveFiltersCount}
            baseRoute='/administracao/modulos'
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
            title='Criar Novo Módulo'
            description='Crie um novo módulo'
            isOpen={isCreateModalOpen}
            onClose={() => setIsCreateModalOpen(false)}
            size='lg'
          >
            <ModuloCreateForm
              modalClose={() => setIsCreateModalOpen(false)}
              preSelectedAplicacaoId={aplicacaoIdParam || undefined}
            />
          </EnhancedModal>

          <AlertModal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            onConfirm={handleDeleteMultiple}
            loading={deleteMultipleModulosMutation.isPending}
            title='Remover Módulos'
            description='Tem certeza que deseja remover os módulos selecionados?'
          />
        </>
      )}
    </>
  )
}
