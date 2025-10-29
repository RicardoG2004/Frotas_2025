import { EntidadeDTO } from '@/types/dtos/base/entidades.dtos'
import { DataTableFilterField } from '@/components/shared/data-table-types'

export const filterFields: DataTableFilterField<EntidadeDTO>[] = [
  {
    label: 'Nome',
    value: 'nome',
    order: 1,
  },
  {
    label: 'NIF',
    value: 'nif',
    order: 2,
  },
  {
    label: 'Rua',
    value: 'rua.nome',
    order: 3,
  },
  {
    label: 'Freguesia',
    value: 'rua.freguesia.nome',
    order: 4,
  },
]
