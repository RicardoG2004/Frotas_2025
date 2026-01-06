import { CellAction } from '@/pages/platform/utilizadores/components/utilizadores-table/utilizadores-cell-action'
import { UtilizadorDTO } from '@/types/dtos'
import { Check, X, Shield } from 'lucide-react'
import { roleConfig } from '@/constants/roles'
import { Checkbox } from '@/components/ui/checkbox'
import { ColoredBadge } from '@/components/shared/colored-badge'
import { DataTableColumnDef } from '@/components/shared/data-table-types'

export const columns: DataTableColumnDef<UtilizadorDTO>[] = [
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
    cell: ({ row }) => (
      <div>
        {[row.original.firstName, row.original.lastName]
          .filter(Boolean)
          .join(' ') || '-'}
      </div>
    ),
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
  },
  {
    accessorKey: 'roleId',
    header: 'Role',
    sortKey: 'roleId',
    enableSorting: true,
    enableHiding: true,
    meta: {
      align: 'left',
    },
    cell: ({ row }) => {
      const role = (row.original.roleId?.toLowerCase() ||
        'client') as keyof typeof roleConfig

      return (
        <ColoredBadge
          label={roleConfig[role].label}
          color={roleConfig[role].color}
          icon={<Shield className='h-3.5 w-3.5' />}
          size='md'
        />
      )
    },
  },
  {
    accessorKey: 'clienteId',
    header: 'Cliente',
    sortKey: 'cliente.nome',
    enableSorting: true,
    enableHiding: true,
    meta: {
      align: 'left',
    },
    cell: ({ row }) => (
      <div
        className='truncate max-w-[200px]'
        title={row.original.cliente?.nome}
      >
        {row.original.cliente?.nome || '-'}
      </div>
    ),
  },
  {
    accessorKey: 'ativo',
    header: () => <div className='text-center'>Estado</div>,
    sortKey: 'ativo',
    enableSorting: true,
    enableHiding: true,
    meta: {
      align: 'center',
    },
    cell: ({ row }) => (
      <div className='flex items-center justify-center'>
        {row.original.isActive ? (
          <Check className='h-4 w-4 text-green-500' />
        ) : (
          <X className='h-4 w-4 text-destructive' />
        )}
      </div>
    ),
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
