import { CellAction } from '@/pages/base/conservatorias/components/conservatorias-table/conservatorias-cell-actions'
import { ConservatoriaDTO } from '@/types/dtos/base/conservatorias.dtos'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnDef } from '@/components/shared/data-table-types'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export const columns: DataTableColumnDef<ConservatoriaDTO>[] = [
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
    accessorKey: 'codigoPostal.nome',
    header: 'Código Postal',
    sortKey: 'codigoPostal.nome',
    enableSorting: true,
    enableHiding: true,
    meta: {
      align: 'left',
    },
  },
  {
    accessorKey: 'freguesia.nome',
    header: 'Freguesia',
    sortKey: 'freguesia.nome',
    enableSorting: true,
    enableHiding: true,
    meta: {
      align: 'left',
    },
  },
  {
    accessorKey: 'concelho.nome',
    header: 'Concelho',
    sortKey: 'concelho.nome',
    enableSorting: true,
    enableHiding: true,
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

