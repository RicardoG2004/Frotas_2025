import { DataTableFilterField } from '@/components/shared/data-table-types';
import { AreaDTO } from '@/types/dtos';

export const filterFields: DataTableFilterField<AreaDTO>[] = [
  {
    label: 'Nome',
    value: 'nome',
    order: 1
  }
];
