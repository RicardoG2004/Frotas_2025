import { FseDTO } from '@/types/dtos/base/fses.dtos'
import { DataTableFilterField } from '@/components/shared/data-table-types'

export const filterFields: DataTableFilterField<FseDTO>[] = [
  {
    label: 'Nome',
    value: 'nome',
    order: 1,
  },
  {
    label: 'NIF',
    value: 'numContribuinte',
    order: 2,
  },
  {
    label: 'Telefone',
    value: 'telefone',
    order: 3,
  },
]

