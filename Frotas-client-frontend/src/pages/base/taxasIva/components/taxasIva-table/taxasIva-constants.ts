import { TaxaIvaDTO } from '@/types/dtos/base/taxasIva.dtos'
import { DataTableFilterField } from '@/components/shared/data-table-types'

export const filterFields: DataTableFilterField<TaxaIvaDTO>[] = [
  {
    label: 'Descrição',
    value: 'descricao',
    order: 1,
  },
  {
    label: 'Valor',
    value: 'valor',
    order: 2,
  },
  {
    label: 'Ativo',
    value: 'ativo',
    order: 3,
  },
]
