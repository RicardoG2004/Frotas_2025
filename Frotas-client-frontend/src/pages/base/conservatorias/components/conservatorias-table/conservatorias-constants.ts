import { ConservatoriaDTO } from '@/types/dtos/base/conservatorias.dtos'
import { DataTableFilterField } from '@/components/shared/data-table-types'

export const filterFields: DataTableFilterField<ConservatoriaDTO>[] = [
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
    value: 'codigoPostal.nome',
    order: 3,
  },
  {
    label: 'Freguesia',
    value: 'freguesia.nome',
    order: 4,
  },
  {
    label: 'Concelho',
    value: 'concelho.nome',
    order: 5,
  },
  {
    label: 'Telefone',
    value: 'telefone',
    order: 6,
  },
  {
    label: 'Criado em',
    value: 'createdOn',
    order: 7,
  },
]

