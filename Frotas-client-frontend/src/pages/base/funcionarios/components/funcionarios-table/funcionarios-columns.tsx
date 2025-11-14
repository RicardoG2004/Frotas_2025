import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { DataTableColumnDef } from '@/components/shared/data-table-types'
import { FuncionarioDTO } from '@/types/dtos/base/funcionarios.dtos'
import { CellAction } from './funcionarios-cell-actions'

export const columns: DataTableColumnDef<FuncionarioDTO>[] = [
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
    meta: { width: 'w-[4%]' },
  },
  {
    accessorKey: 'nome',
    header: 'Nome',
    sortKey: 'nome',
    enableSorting: true,
    enableHiding: false,
    meta: { align: 'left' },
  },
  {
    accessorKey: 'email',
    header: 'Email',
    sortKey: 'email',
    enableSorting: true,
    meta: { align: 'left' },
    cell: ({ row }) => row.original.email || '-',
  },
  {
    accessorKey: 'telefone',
    header: 'Telefone',
    sortKey: 'telefone',
    enableSorting: true,
    meta: { align: 'left' },
    cell: ({ row }) => row.original.telefone || '-',
  },
  {
    accessorKey: 'cargo.designacao',
    header: 'Cargo',
    sortKey: 'cargo',
    enableSorting: false,
    meta: { align: 'left' },
    cell: ({ row }) => row.original.cargo?.designacao || '-',
  },
  {
    accessorKey: 'delegacao.designacao',
    header: 'Delegação',
    sortKey: 'delegacao',
    enableSorting: false,
    meta: { align: 'left' },
    cell: ({ row }) => row.original.delegacao?.designacao || '-',
  },
  {
    accessorKey: 'freguesia.nome',
    header: 'Freguesia',
    sortKey: 'freguesia',
    enableSorting: false,
    meta: { align: 'left' },
    cell: ({ row }) => row.original.freguesia?.nome || '-',
  },
  {
    accessorKey: 'ativo',
    header: 'Estado',
    sortKey: 'ativo',
    enableSorting: true,
    meta: { align: 'center' },
    cell: ({ row }) => (
      <Badge
        variant={row.original.ativo ? 'default' : 'secondary'}
        className={row.original.ativo ? 'bg-emerald-500 text-white' : ''}
      >
        {row.original.ativo ? 'Ativo' : 'Inativo'}
      </Badge>
    ),
  },
  {
    accessorKey: 'createdOn',
    header: 'Criado em',
    sortKey: 'createdOn',
    enableSorting: true,
    meta: { align: 'left' },
    cell: ({ row }) => {
      const value = row.original.createdOn
      if (!value) return '-'
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
    enableSorting: false,
    enableHiding: false,
    cell: ({ row }) => (
      <div className='flex items-center justify-end'>
        <CellAction data={row.original} />
      </div>
    ),
  },
]

