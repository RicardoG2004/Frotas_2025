import { FreguesiaDTO } from '@/types/dtos/base/freguesias.dtos'
import { DataTableFilterField } from '@/components/shared/data-table-types'

export const filterFields: DataTableFilterField<FreguesiaDTO>[] = [
  {
    label: 'Nome',
    value: 'nome',
    order: 1,
  },
  {
    label: 'Concelho',
    value: 'concelho.nome',
    order: 2,
  },
]
