import { ManutencaoDTO } from '@/types/dtos/frotas/manutencoes.dtos'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnDef } from '@/components/shared/data-table-types'
import { CellAction } from './manutencoes-cell-actions.tsx'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export const columns: DataTableColumnDef<ManutencaoDTO>[] = [
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
    accessorKey: 'viatura.matricula',
    header: 'Designação Viatura',
    sortKey: 'matricula',
    enableSorting: true,
    enableHiding: true,
    meta: {
      align: 'left',
    },
    cell: ({ row }) => {
      const viatura = row.original.viatura
      if (!viatura) return '-'
      const matricula = viatura.matricula || ''
      const marca = viatura.marca?.nome || ''
      const modelo = viatura.modelo?.nome || ''
      if (marca && modelo) {
        return `${matricula} / ${marca} ${modelo}`
      }
      return matricula || '-'
    },
  },
  {
    accessorKey: 'dataRequisicao',
    header: 'Data Requisição',
    sortKey: 'dataRequisicao',
    enableSorting: true,
    enableHiding: true,
    meta: {
      align: 'left',
    },
    cell: ({ row }) => {
      if (!row.original.dataRequisicao) return '-'
      try {
        return format(new Date(row.original.dataRequisicao), 'dd/MM/yyyy', {
          locale: ptBR,
        })
      } catch {
        return row.original.dataRequisicao
      }
    },
  },
  {
    accessorKey: 'fse.nome',
    header: 'Entidade',
    sortKey: 'fse',
    enableSorting: true,
    enableHiding: true,
    meta: {
      align: 'left',
    },
    cell: ({ row }) => row.original.fse?.nome || '-',
  },
  {
    accessorKey: 'total',
    header: 'Custo Total',
    sortKey: 'total',
    enableSorting: true,
    enableHiding: true,
    meta: {
      align: 'right',
    },
    cell: ({ row }) => {
      const total = row.original.total
      if (total === undefined || total === null) return '-'
      return `${total.toFixed(2)} €`
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

