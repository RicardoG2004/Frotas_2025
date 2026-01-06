import { PerfilDTO } from '@/types/dtos'
import { DataTableFilterField } from '@/components/shared/data-table-types'

export const filterFields: DataTableFilterField<PerfilDTO>[] = [
  {
    label: 'Nome',
    value: 'nome',
    order: 1,
  },
  {
    label: 'Estado',
    value: 'ativo',
    order: 2,
  },
]
