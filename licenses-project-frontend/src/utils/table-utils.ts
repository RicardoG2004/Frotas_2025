import { ColumnDef } from '@tanstack/react-table';
import { DataTableFilterField } from '@/components/shared/data-table-types';

export const getColumnHeader = <T>(
  column: ColumnDef<T, unknown>,
  filterFields: DataTableFilterField<T>[]
): string => {
  // First check if there's a matching filter field
  if ('accessorKey' in column) {
    const filterField = filterFields.find(
      (field) => field.value === column.accessorKey
    );
    if (filterField) return filterField.label;
  }

  // Fallback to existing logic
  if (typeof column.header === 'string') return column.header;
  if ('accessorKey' in column) return column.accessorKey.toString();
  return '';
};
