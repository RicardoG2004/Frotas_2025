import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnDef } from '@/components/shared/data-table-types'
import { TerceiroDTO } from '@/types/dtos/base/terceiros.dtos'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { CellAction } from './terceiros-cell-actions'

export const columns: DataTableColumnDef<TerceiroDTO>[] = [
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
  },
  {
    accessorKey: 'nif',
    header: 'NIF',
    sortKey: 'nif',
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
    id: 'codigoPostalId',
    accessorKey: 'codigoPostalId',
    header: 'Código Postal',
    sortKey: 'codigoPostal.codigo',
    enableSorting: true,
    enableHiding: true,
    cell: ({ row }) => {
      const codigoPostal = row.original.codigoPostal
      if (!codigoPostal) return '-'

      const codigo = codigoPostal.codigo ?? ''
      const localidade = codigoPostal.localidade ?? ''
      const combined = [codigo, localidade].filter(Boolean).join(' - ')

      return combined || '-'
    },
    meta: {
      align: 'left',
    },
  },
  {
    accessorKey: 'createdOn',
    header: 'Criado em',
    sortKey: 'createdOn',
    enableSorting: true,
    enableHiding: true,
    cell: ({ row }) => {
      const date = row.original.createdOn
      if (!date) return '-'
      try {
        return format(new Date(date), 'dd/MM/yyyy', { locale: ptBR })
      } catch {
        return '-'
      }
    },
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


