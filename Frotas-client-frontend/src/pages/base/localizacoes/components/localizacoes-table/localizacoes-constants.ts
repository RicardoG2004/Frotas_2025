import { LocalizacaoDTO } from '@/types/dtos/base/localizacoes.dtos'
import { DataTableFilterField } from '@/components/shared/data-table-types'

export const filterFields: DataTableFilterField<LocalizacaoDTO>[] = [
  {
    label: 'Designação',
    value: 'designacao',
    order: 1,
  },
  {
    label: 'Morada',
    value: 'morada',
    order: 2,
  },
  {
    label: 'Freguesia',
    value: 'freguesia.nome',
    order: 3,
  },
  {
    label: 'Código Postal',
    value: 'codigoPostal.codigo',
    order: 4,
  },
  {
    label: 'Telefone',
    value: 'telefone',
    order: 5,
  },
  {
    label: 'Email',
    value: 'email',
    order: 6,
  },
]

