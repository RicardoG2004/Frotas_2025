import { ProprietarioDTO } from '@/types/dtos/cemiterios/proprietarios.dtos'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnDef } from '@/components/shared/data-table-types'
import { CellAction } from './proprietarios-cell-actions'

export const columns: DataTableColumnDef<ProprietarioDTO>[] = [
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
    accessorKey: 'entidade.nome',
    header: 'Entidade',
    sortKey: 'entidade.nome',
    enableSorting: true,
    enableHiding: true,
    meta: {
      align: 'left',
    },
    cell: ({ row }) => row.original.entidade?.nome || '-',
  },
  {
    accessorKey: 'cemiterio.nome',
    header: 'Cemitério',
    sortKey: 'cemiterio.nome',
    enableSorting: true,
    enableHiding: true,
    meta: {
      align: 'left',
    },
    cell: ({ row }) => row.original.cemiterio?.nome || '-',
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
