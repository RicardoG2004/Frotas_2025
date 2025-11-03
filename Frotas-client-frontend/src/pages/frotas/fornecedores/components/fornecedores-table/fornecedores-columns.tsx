import { FornecedorDTO } from '@/types/dtos/frotas/fornecedores.dtos'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnDef } from '@/components/shared/data-table-types'
import { CellAction } from './fornecedores-cell-actions'
import { Badge } from '@/components/ui/badge'

export const columns: DataTableColumnDef<FornecedorDTO>[] = [
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
    accessorKey: 'numContribuinte',
    header: 'NIF',
    sortKey: 'numContribuinte',
    enableSorting: true,
    enableHiding: true,
    meta: {
      align: 'left',
    },
    cell: ({ row }) => row.original.numContribuinte || '-',
  },
  {
    accessorKey: 'origem',
    header: 'Origem',
    sortKey: 'origem',
    enableSorting: true,
    enableHiding: true,
    meta: {
      align: 'left',
    },
    cell: ({ row }) => row.original.origem || '-',
  },
  {
    accessorKey: 'email',
    header: 'Email',
    sortKey: 'email',
    enableSorting: true,
    enableHiding: true,
    meta: {
      align: 'left',
    },
    cell: ({ row }) => row.original.email || '-',
  },
  {
    accessorKey: 'ativo',
    header: 'Ativo',
    sortKey: 'ativo',
    enableSorting: true,
    enableHiding: true,
    meta: {
      align: 'center',
    },
    cell: ({ row }) => (
      <div className='flex justify-center'>
        <Badge variant={row.original.ativo ? 'success' : 'secondary'}>
          {row.original.ativo ? 'Sim' : 'Não'}
        </Badge>
      </div>
    ),
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

