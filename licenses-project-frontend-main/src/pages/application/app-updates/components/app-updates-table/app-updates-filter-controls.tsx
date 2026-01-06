import { AppUpdateDTO } from '@/types/dtos'
import { BaseFilterControlsProps } from '@/components/shared/data-table-filter-controls-base'

export function AppUpdatesFilterControls(
  _props: BaseFilterControlsProps<AppUpdateDTO>
) {
  // For now, return null as we're using keyword search instead
  // Can be extended later with specific filters if needed
  return null
}
