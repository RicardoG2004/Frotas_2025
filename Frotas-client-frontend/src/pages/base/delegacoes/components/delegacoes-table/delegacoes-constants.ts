import { DelegacaoDTO } from '@/types/dtos/base/delegacoes.dtos'
import { DataTableFilterField } from '@/components/shared/data-table-types'

export const filterFields: DataTableFilterField<DelegacaoDTO>[] = [
  {
    label: 'Designação',
    value: 'designacao',
    order: 1,
  },
  {
    label: 'Email',
    value: 'email',
    order: 2,
  },
  {
    label: 'Localidade',
    value: 'localidade',
    order: 3,
  },
]

