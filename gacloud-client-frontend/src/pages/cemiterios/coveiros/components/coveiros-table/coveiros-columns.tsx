import { CoveiroDTO } from '@/types/dtos/cemiterios/coveiros.dtos'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnDef } from '@/components/shared/data-table-types'
import { CellAction } from './coveiros-cell-actions'

export const columns: DataTableColumnDef<CoveiroDTO>[] = [
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
    accessorKey: 'nome',
    header: 'Nome',
    sortKey: 'nome',
    enableSorting: true,
    enableHiding: true,
    meta: {
      align: 'left',
    },
    cell: ({ row }) => row.original.nome || '-',
  },
  {
    accessorKey: 'rua.nome',
    header: 'Rua',
    sortKey: 'rua.nome',
    enableSorting: true,
    enableHiding: true,
    meta: {
      align: 'left',
    },
    cell: ({ row }) => row.original.rua?.nome || '-',
  },
  {
    accessorKey: 'codigoPostal.codigo',
    header: 'Código Postal',
    sortKey: 'codigoPostal.codigo',
    enableSorting: true,
    enableHiding: true,
    meta: {
      align: 'left',
    },
    cell: ({ row }) => row.original.codigoPostal?.codigo || '-',
  },
  {
    accessorKey: 'historico',
    header: 'Histórico',
    sortKey: 'historico',
    enableSorting: true,
    enableHiding: true,
    meta: {
      align: 'center',
    },
    cell: ({ row }) => (row.original.historico ? 'Sim' : 'Não'),
  },
  {
    accessorKey: 'createdOn',
    header: 'Criado em',
    sortKey: 'createdOn',
    enableSorting: true,
    enableHiding: true,
    meta: {
      align: 'left',
    },
    cell: ({ row }) =>
      row.original.createdOn
        ? new Date(row.original.createdOn).toLocaleDateString()
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
