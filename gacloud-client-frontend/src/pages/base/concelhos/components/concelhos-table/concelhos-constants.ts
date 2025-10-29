import { ConcelhoDTO } from '@/types/dtos/base/concelhos.dtos'
import { DataTableFilterField } from '@/components/shared/data-table-types'

export const filterFields: DataTableFilterField<ConcelhoDTO>[] = [
  {
    label: 'Nome',
    value: 'nome',
    order: 1,
  },
  {
    label: 'Distrito',
    value: 'distrito.nome',
    order: 2,
  },
]
