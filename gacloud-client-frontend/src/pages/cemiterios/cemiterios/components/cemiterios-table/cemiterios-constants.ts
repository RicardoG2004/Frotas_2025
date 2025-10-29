import { CemiterioDTO } from '@/types/dtos/cemiterios/cemiterios.dtos'
import { DataTableFilterField } from '@/components/shared/data-table-types'

export const filterFields: DataTableFilterField<CemiterioDTO>[] = [
  {
    label: 'Nome',
    value: 'nome',
    order: 1,
  },
  {
    label: 'Morada',
    value: 'morada',
    order: 2,
  },
  {
    label: 'Código Postal',
    value: 'codigoPostal.codigo',
    order: 3,
  },
]
