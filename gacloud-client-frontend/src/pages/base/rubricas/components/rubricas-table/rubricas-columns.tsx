import { RubricaDTO } from '@/types/dtos/base/rubricas.dtos'
import { RubricaClassificacaoLabel } from '@/types/enums/rubrica-classificacao.enum'
import { RubricaClassificacao } from '@/types/enums/rubrica-classificacao.enum'
import { RubricaTipo, RubricaTipoLabel } from '@/types/enums/rubrica-tipo.enum'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnDef } from '@/components/shared/data-table-types'
import { CellAction } from './rubricas-cell-actions'

export const columns: DataTableColumnDef<RubricaDTO>[] = [
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
    accessorKey: 'codigo',
    header: 'Código',
    sortKey: 'codigo',
    enableSorting: true,
    enableHiding: true,
    meta: {
      align: 'left',
    },
  },
  {
    accessorKey: 'epoca.descricao',
    id: 'epoca.descricao',
    header: 'Epoca',
    sortKey: 'epoca.descricao',
    enableSorting: true,
    enableHiding: true,
    cell: ({ row }) => {
      const epoca = row.original.epoca
      return (
        <div className='flex items-center gap-2'>
          <span>{epoca?.descricao || 'N/A'}</span>
        </div>
      )
    },
    meta: {
      align: 'left',
    },
  },
  {
    accessorKey: 'descricao',
    id: 'descricao',
    header: 'Descrição',
    sortKey: 'descricao',
    enableSorting: true,
    enableHiding: true,
    meta: {
      align: 'left',
    },
  },

  {
    accessorKey: 'classificacaoTipo',
    id: 'classificacaoTipo',
    header: 'Tipo de Classificação',
    sortKey: 'classificacaoTipo',
    enableSorting: true,
    enableHiding: true,
    cell: ({ row }) => {
      const tipo = row.original.classificacaoTipo
      return RubricaClassificacaoLabel[tipo as RubricaClassificacao] || tipo
    },
    meta: {
      align: 'left',
    },
  },
  {
    accessorKey: 'rubricaTipo',
    id: 'rubricaTipo',
    header: 'Tipo de Rubrica',
    sortKey: 'rubricaTipo',
    enableSorting: true,
    enableHiding: true,
    cell: ({ row }) => {
      const tipo = row.original.rubricaTipo
      return RubricaTipoLabel[tipo as RubricaTipo] || tipo
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
