import { ManutencaoDTO } from '@/types/dtos/frotas/manutencoes.dtos'
import { DataTableFilterField } from '@/components/shared/data-table-types'

export const filterFields: DataTableFilterField<ManutencaoDTO>[] = [
  {
    label: 'Matrícula',
    value: 'matricula',
    order: 1,
  },
  {
    label: 'FSE',
    value: 'fse',
    order: 2,
  },
  {
    label: 'Funcionário',
    value: 'funcionario',
    order: 3,
  },
  {
    label: 'Data Requisição',
    value: 'dataRequisicao',
    order: 4,
  },
]

