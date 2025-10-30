import { CoveiroDTO } from '@/types/dtos/frotas/coveiros.dtos'
import { DataTableFilterField } from '@/components/shared/data-table-types'

export const filterFields: DataTableFilterField<CoveiroDTO>[] = [
  {
    label: 'Nome',
    value: 'nome',
    order: 1,
  },
  {
    label: 'Rua',
    value: 'rua.nome',
    order: 2,
  },
  {
    label: 'Código Postal',
    value: 'codigoPostal.codigo',
    order: 3,
  },
  {
    label: 'Histórico',
    value: 'historico',
    order: 4,
  },
  {
    label: 'Criado em',
    value: 'createdOn',
    order: 5,
  },
]
