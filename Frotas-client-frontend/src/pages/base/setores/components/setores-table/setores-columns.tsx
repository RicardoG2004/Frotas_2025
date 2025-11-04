import { CellAction } from '@/pages/base/setores/components/setores-table/setores-cell-actions'
import { SetorDTO } from '@/types/dtos/base/setores.dtos'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnDef } from '@/components/shared/data-table-types'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export const columns: DataTableColumnDef<SetorDTO>[] = [
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
    accessorKey: 'descricao',
    header: 'Descrição',
    sortKey: 'descricao',
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

