import { CombustivelDTO } from '@/types/dtos/frotas/combustiveis.dtos'
import { DataTableFilterField } from '@/components/shared/data-table-types'

export const filterFields: DataTableFilterField<CombustivelDTO>[] = [
  {
    label: 'Nome',
    value: 'nome',
    order: 1,
  },
  {
    label: 'Preço por Litro',
    value: 'precoLitro',
    order: 2,
  },
  {
    label: 'Criado em',
    value: 'createdOn',
    order: 3,
  },
]
