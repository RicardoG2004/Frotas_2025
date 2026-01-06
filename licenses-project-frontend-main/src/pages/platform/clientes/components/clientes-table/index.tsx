import { useState } from 'react'
import ClienteCreateForm from '@/pages/platform/clientes/components/cliente-forms/cliente-create-form'
import { columns } from '@/pages/platform/clientes/components/clientes-table/clientes-columns'
import { filterFields } from '@/pages/platform/clientes/components/clientes-table/clientes-constants'
import { ClientesFilterControls } from '@/pages/platform/clientes/components/clientes-table/clientes-filter-controls'
import { ClienteDTO } from '@/types/dtos'
import { Plus, Trash2 } from 'lucide-react'
import { getErrorMessage } from '@/utils/error-handlers'
import { toast } from '@/utils/toast-utils'
import { EnhancedModal } from '@/components/ui/enhanced-modal'
import { AlertModal } from '@/components/shared/alert-modal'
import DataTable from '@/components/shared/data-table'
import { useDeleteMultipleClientes } from '../../queries/clientes-mutations'

type TClientesTableProps = {
  clientes: ClienteDTO[]
  page: number
  total: number
  pageCount: number
  onFiltersChange?: (filters: Array<{ id: string; value: string }>) => void
  onPaginationChange?: (page: number, pageSize: number) => void
  onSortingChange?: (sorting: Array<{ id: string; desc: boolean }>) => void
}

export default function ClientesTable({
  clientes,
  pageCount,
  total,
  onFiltersChange,
  onPaginationChange,
  onSortingChange,
}: TClientesTableProps) {
  const searchParams = new URLSearchParams(window.location.search)
  const clienteIdParam = searchParams.get('clienteId')
  const initialActiveFiltersCount = clienteIdParam ? 1 : 0
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const deleteMultipleClientesMutation = useDeleteMultipleClientes()

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
        await deleteMultipleClientesMutation.mutateAsync(selectedRows)

      if (response.info.succeeded) {
        toast.success('Clientes removidos com sucesso')
      } else {
        toast.error(getErrorMessage(response, 'Erro ao remover clientes'))
      }
    } catch (error) {
      toast.error('Erro ao remover clientes')
    } finally {
      setSelectedRows([])
      setIsDeleteModalOpen(false)
    }
  }

  return (
    <>
      {/* <ClientesTableActions /> */}
      {clientes && (
        <>
          <DataTable
            columns={columns}
            data={clientes}
            pageCount={pageCount}
            filterFields={filterFields}
            FilterControls={ClientesFilterControls}
            onFiltersChange={handleFiltersChange}
            onPaginationChange={handlePaginationChange}
            onSortingChange={handleSortingChange}
            initialActiveFiltersCount={initialActiveFiltersCount}
            baseRoute='/administracao/clientes'
            enableSorting={true}
            selectedRows={selectedRows}
            onRowSelectionChange={handleRowSelectionChange}
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
            title='Criar Novo Cliente'
            description='Crie um novo cliente'
            isOpen={isCreateModalOpen}
            onClose={() => setIsCreateModalOpen(false)}
            size='xl'
          >
            <ClienteCreateForm modalClose={() => setIsCreateModalOpen(false)} />
          </EnhancedModal>

          <AlertModal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            onConfirm={handleDeleteMultiple}
            loading={deleteMultipleClientesMutation.isPending}
            title='Remover Clientes'
            description='Tem certeza que deseja remover os clientes selecionados?'
          />
        </>
      )}
    </>
  )
}
