import { ProprietarioDTO } from '@/types/dtos/cemiterios/proprietarios.dtos'
import { DataTableFilterField } from '@/components/shared/data-table-types'

export const filterFields: DataTableFilterField<ProprietarioDTO>[] = [
  {
    label: 'Entidade',
    value: 'entidade.nome',
    order: 1,
  },
  {
    label: 'Cemitério',
    value: 'cemiterio.nome',
    order: 2,
  },
  {
    label: 'Criado em',
    value: 'createdOn',
    order: 3,
  },
]
