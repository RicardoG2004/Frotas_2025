import { TalhaoDTO } from '@/types/dtos/cemiterios/talhoes.dtos'
import { DataTableFilterField } from '@/components/shared/data-table-types'

export const filterFields: DataTableFilterField<TalhaoDTO>[] = [
  {
    label: 'Nome',
    value: 'nome',
    order: 1,
  },
  {
    label: 'Zona',
    value: 'zona.nome',
    order: 2,
  },
]
