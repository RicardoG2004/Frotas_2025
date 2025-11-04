import { ServicoDTO } from '@/types/dtos/frotas/servicos.dtos'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnDef } from '@/components/shared/data-table-types'
import { CellAction } from './servicos-cell-actions.tsx'

export const columns: DataTableColumnDef<ServicoDTO>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Selecionar todos'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Selecionar linha'
      />
    ),
    enableSorting: false,
    enableHiding: false,
    meta: {
      width: 'w-[4%]',
    },
  },
  {
    accessorKey: 'designacao',
    header: 'Designação',
    sortKey: 'designacao',
    enableSorting: true,
    enableHiding: true,
    meta: {
      align: 'left',
    },
    cell: ({ row }) => row.original.designacao || '-',
  },
  {
    accessorKey: 'tipo',
    header: 'Tipo',
    sortKey: 'tipo',
    enableSorting: true,
    enableHiding: true,
    meta: {
      align: 'left',
    },
    cell: ({ row }) => row.original.tipo || '-',
  },
  {
    accessorKey: 'custoTotal',
    header: 'Custo Total',
    sortKey: 'custoTotal',
    enableSorting: true,
    enableHiding: true,
    meta: {
      align: 'left',
    },
    cell: ({ row }) => 
      row.original.custoTotal 
        ? new Intl.NumberFormat('pt-PT', { 
            style: 'currency', 
            currency: 'EUR' 
          }).format(row.original.custoTotal)
        : '-',
  },
  {
    id: 'actions',
    header: '',
    cell: ({ row }) => (
      <div className='flex items-center justify-end'>
        <CellAction data={row.original} />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
]


