import { HexColorPicker } from 'react-colorful'
import { Popover, PopoverContent } from '@/components/ui/popover'

interface ColorPickerPopoverProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  anchorEl: HTMLElement | null
  color: string
  onChange: (color: string) => void
}

export function ColorPickerPopover({
  open,
  onOpenChange,
  anchorEl,
  color,
  onChange,
}: ColorPickerPopoverProps) {
  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverContent
        className='w-auto p-2'
        style={{
          position: 'absolute',
          top: anchorEl ? anchorEl.getBoundingClientRect().bottom + 8 : 0,
          left: anchorEl ? anchorEl.getBoundingClientRect().left : 0,
        }}
      >
        <HexColorPicker color={color} onChange={onChange} />
      </PopoverContent>
    </Popover>
  )
}
