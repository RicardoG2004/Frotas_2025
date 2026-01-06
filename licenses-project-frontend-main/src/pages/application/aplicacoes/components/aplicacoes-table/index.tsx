import { useState } from 'react'
import AplicacaoCreateForm from '@/pages/application/aplicacoes/components/aplicacao-forms/aplicacao-create-form'
import { columns } from '@/pages/application/aplicacoes/components/aplicacoes-table/aplicacoes-columns'
import { filterFields } from '@/pages/application/aplicacoes/components/aplicacoes-table/aplicacoes-constants'
import { AplicacoesFilterControls } from '@/pages/application/aplicacoes/components/aplicacoes-table/aplicacoes-filter-controls'
import { AplicacaoDTO } from '@/types/dtos'
import { Plus, Trash2 } from 'lucide-react'
import { getErrorMessage } from '@/utils/error-handlers'
import { toast } from '@/utils/toast-utils'
import { EnhancedModal } from '@/components/ui/enhanced-modal'
import { AlertModal } from '@/components/shared/alert-modal'
import DataTable from '@/components/shared/data-table'
import { useDeleteMultipleAplicacoes } from '../../queries/aplicacoes-mutations'

type TAplicacoesTableProps = {
  aplicacoes: AplicacaoDTO[]
  page: number
  total: number
  pageCount: number
  onFiltersChange?: (filters: Array<{ id: string; value: string }>) => void
  onPaginationChange?: (page: number, pageSize: number) => void
  onSortingChange?: (sorting: Array<{ id: string; desc: boolean }>) => void
}

export default function AplicacoesTable({
  aplicacoes,
  pageCount,
  total,
  onFiltersChange,
  onPaginationChange,
  onSortingChange,
}: TAplicacoesTableProps) {
  const searchParams = new URLSearchParams(window.location.search)
  const areaIdParam = searchParams.get('areaId')
  const initialActiveFiltersCount = areaIdParam ? 1 : 0
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const deleteMultipleAplicacoesMutation = useDeleteMultipleAplicacoes()

  // Get current filters from table state and URL
  const [currentFilters, setCurrentFilters] = useState<
    Array<{ id: string; value: string }>
  >(areaIdParam ? [{ id: 'areaId', value: areaIdParam }] : [])

  const handleFiltersChange = (
    filters: Array<{ id: string; value: string }>
  ) => {
    setCurrentFilters(filters)
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

  const areaFilter = currentFilters?.find((filter) => filter.id === 'areaId')
  const preSelectedAreaId = areaFilter?.value || ''

  const handleDeleteMultiple = async () => {
    try {
      const response =
        await deleteMultipleAplicacoesMutation.mutateAsync(selectedRows)

      if (response.info.succeeded) {
        toast.success('Aplicações removidas com sucesso')
      } else {
        toast.error(getErrorMessage(response, 'Erro ao remover aplicações'))
      }
    } catch (error) {
      toast.error('Erro ao remover aplicações')
    } finally {
      setSelectedRows([])
      setIsDeleteModalOpen(false)
    }
  }

  return (
    <>
      {aplicacoes && (
        <>
          <DataTable
            columns={columns}
            data={aplicacoes}
            pageCount={pageCount}
            filterFields={filterFields}
            FilterControls={AplicacoesFilterControls}
            onFiltersChange={handleFiltersChange}
            onPaginationChange={handlePaginationChange}
            onSortingChange={handleSortingChange}
            initialActiveFiltersCount={initialActiveFiltersCount}
            baseRoute='/administracao/aplicacoes'
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
            title='Criar Nova Aplicação'
            description='Crie uma nova aplicação'
            isOpen={isCreateModalOpen}
            onClose={() => setIsCreateModalOpen(false)}
            size='lg'
          >
            <AplicacaoCreateForm
              modalClose={() => setIsCreateModalOpen(false)}
              preSelectedAreaId={preSelectedAreaId}
            />
          </EnhancedModal>

          <AlertModal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            onConfirm={handleDeleteMultiple}
            loading={deleteMultipleAplicacoesMutation.isPending}
            title='Remover Aplicações'
            description='Tem certeza que deseja remover as aplicações selecionadas?'
          />
        </>
      )}
    </>
  )
}
