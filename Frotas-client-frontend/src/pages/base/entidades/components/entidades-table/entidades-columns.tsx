import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnDef } from '@/components/shared/data-table-types'
import { EntidadeDTO } from '@/types/dtos/base/entidades.dtos'
import { CellAction } from './entidades-cell-actions'

export const columns: DataTableColumnDef<EntidadeDTO>[] = [
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
    accessorKey: 'telefone',
    header: 'Telefone',
    sortKey: 'telefone',
    enableSorting: true,
    enableHiding: true,
    meta: {
      align: 'left',
    },
    cell: ({ row }) => row.original.telefone || '-',
  },
  {
    accessorKey: 'localidade',
    header: 'Localidade',
    sortKey: 'localidade',
    enableSorting: true,
    enableHiding: true,
    meta: {
      align: 'left',
    },
    cell: ({ row }) => row.original.localidade || '-',
  },
  {
    accessorKey: 'codigoPostal.codigo',
    header: 'Código Postal',
    sortKey: 'codigoPostal',
    enableSorting: false,
    enableHiding: true,
    meta: {
      align: 'left',
    },
    cell: ({ row }) => row.original.codigoPostal?.codigo || '-',
  },
  {
    accessorKey: 'pais.nome',
    header: 'País',
    sortKey: 'pais',
    enableSorting: false,
    enableHiding: true,
    meta: {
      align: 'left',
    },
    cell: ({ row }) => row.original.pais?.nome || '-',
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
    cell: ({ row }) => {
      const value = row.original.createdOn
      if (!value) {
        return '-'
      }
      try {
        return format(new Date(value), 'dd/MM/yyyy', { locale: ptBR })
      } catch {
        return '-'
      }
    },
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


