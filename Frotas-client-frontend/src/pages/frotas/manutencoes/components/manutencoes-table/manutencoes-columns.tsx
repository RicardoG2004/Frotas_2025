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
    header: 'Matrícula',
    sortKey: 'matricula',
    enableSorting: true,
    enableHiding: true,
    meta: {
      align: 'left',
    },
    cell: ({ row }) => row.original.viatura?.matricula || '-',
  },
  {
    accessorKey: 'fse.nome',
    header: 'FSE',
    sortKey: 'fse',
    enableSorting: true,
    enableHiding: true,
    meta: {
      align: 'left',
    },
    cell: ({ row }) => row.original.fse?.nome || '-',
  },
  {
    accessorKey: 'funcionario.nome',
    header: 'Funcionário',
    sortKey: 'funcionario',
    enableSorting: true,
    enableHiding: true,
    meta: {
      align: 'left',
    },
    cell: ({ row }) => row.original.funcionario?.nome || '-',
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
    accessorKey: 'dataEntrada',
    header: 'Data Entrada',
    sortKey: 'dataEntrada',
    enableSorting: true,
    enableHiding: true,
    meta: {
      align: 'left',
    },
    cell: ({ row }) => {
      if (!row.original.dataEntrada) return '-'
      try {
        return format(new Date(row.original.dataEntrada), 'dd/MM/yyyy', {
          locale: ptBR,
        })
      } catch {
        return row.original.dataEntrada
      }
    },
  },
  {
    accessorKey: 'horaEntrada',
    header: 'Hora Entrada',
    sortKey: 'horaEntrada',
    enableSorting: true,
    enableHiding: true,
    meta: {
      align: 'left',
    },
    cell: ({ row }) => row.original.horaEntrada || '-',
  },
  {
    accessorKey: 'dataSaida',
    header: 'Data Saída',
    sortKey: 'dataSaida',
    enableSorting: true,
    enableHiding: true,
    meta: {
      align: 'left',
    },
    cell: ({ row }) => {
      if (!row.original.dataSaida) return '-'
      try {
        return format(new Date(row.original.dataSaida), 'dd/MM/yyyy', {
          locale: ptBR,
        })
      } catch {
        return row.original.dataSaida
      }
    },
  },
  {
    accessorKey: 'horaSaida',
    header: 'Hora Saída',
    sortKey: 'horaSaida',
    enableSorting: true,
    enableHiding: true,
    meta: {
      align: 'left',
    },
    cell: ({ row }) => row.original.horaSaida || '-',
  },
  {
    accessorKey: 'kmsRegistados',
    header: 'KMs Registados',
    sortKey: 'kmsRegistados',
    enableSorting: true,
    enableHiding: true,
    meta: {
      align: 'left',
    },
    cell: ({ row }) => row.original.kmsRegistados?.toLocaleString('pt-PT') || '-',
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

