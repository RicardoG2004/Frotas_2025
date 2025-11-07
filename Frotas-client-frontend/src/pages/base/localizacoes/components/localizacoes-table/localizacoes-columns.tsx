import { LocalizacaoDTO } from '@/types/dtos/base/localizacoes.dtos'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnDef } from '@/components/shared/data-table-types'
import { CellAction } from './localizacoes-cell-actions'

export const columns: DataTableColumnDef<LocalizacaoDTO>[] = [
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
    accessorKey: 'morada',
    header: 'Morada',
    sortKey: 'morada',
    enableSorting: true,
    enableHiding: true,
    meta: {
      align: 'left',
    },
  },
  {
    accessorKey: 'freguesia.nome',
    id: 'freguesia.nome',
    header: 'Freguesia',
    sortKey: 'freguesia.nome',
    enableSorting: true,
    enableHiding: true,
    cell: ({ row }) => {
      const freguesia = row.original.freguesia
      return <span>{freguesia?.nome || 'N/A'}</span>
    },
    meta: {
      align: 'left',
    },
  },
  {
    accessorKey: 'codigoPostal.codigo',
    id: 'codigoPostal.codigo',
    header: 'Código Postal',
    sortKey: 'codigoPostal.codigo',
    enableSorting: true,
    enableHiding: true,
    cell: ({ row }) => {
      const codigoPostal = row.original.codigoPostal
      return <span>{codigoPostal?.codigo || 'N/A'}</span>
    },
    meta: {
      align: 'left',
    },
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
  },
  {
    accessorKey: 'email',
    header: 'Email',
    sortKey: 'email',
    enableSorting: true,
    enableHiding: true,
    cell: ({ row }) => {
      const email = row.original.email
      return email ? (
        <a
          href={`mailto:${email}`}
          className='text-primary underline-offset-2 hover:underline'
        >
          {email}
        </a>
      ) : (
        <span>N/A</span>
      )
    },
    meta: {
      align: 'left',
    },
  },
  {
    accessorKey: 'fax',
    header: 'Fax',
    sortKey: 'fax',
    enableSorting: false,
    enableHiding: true,
    meta: {
      align: 'left',
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

