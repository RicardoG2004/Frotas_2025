import { RuaDTO } from '@/types/dtos/base/ruas.dtos'
import { DataTableFilterField } from '@/components/shared/data-table-types'

export const filterFields: DataTableFilterField<RuaDTO>[] = [
  {
    label: 'Nome',
    value: 'nome',
    order: 1,
  },
  {
    label: 'Freguesia',
    value: 'freguesia.nome',
    order: 2,
  },
  {
    label: 'Código Postal',
    value: 'codigoPostal.codigo',
    order: 3,
  },
]
