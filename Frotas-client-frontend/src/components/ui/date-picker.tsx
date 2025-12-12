import * as React from 'react'
import { format, addYears, subYears, getYear } from 'date-fns'
import { pt } from 'date-fns/locale'
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface DatePickerProps {
  value?: Date
  onChange?: (date?: Date) => void
  placeholder?: string
  className?: string
  minYear?: number
  maxYear?: number
  allowClear?: boolean
  clearLabel?: string
  disabled?: boolean
}

const DatePickerButton = React.forwardRef<
  HTMLButtonElement,
  Omit<React.ComponentPropsWithoutRef<typeof Button>, 'value'> & {
    value?: Date | null
    placeholder?: string
  }
>(({ className, value, placeholder, disabled, ...props }, ref) => {
  // Check if value is a valid date (not null, is a Date, and has a valid timestamp)
  const isValidDate = value instanceof Date && !isNaN(value.getTime()) && value.getFullYear() > 1
  
  return (
    <Button
      ref={ref}
      type='button'
      variant='outline'
      disabled={disabled}
      className={cn(
        'h-12 w-full justify-start px-4 text-left font-normal shadow-inner',
        !isValidDate && 'text-muted-foreground',
        className
      )}
      {...props}
    >
      <CalendarIcon className='mr-2 h-4 w-4' />
      {isValidDate
        ? format(value, 'PPP', { locale: pt })
        : placeholder || 'Selecione uma data'}
    </Button>
  )
})
DatePickerButton.displayName = 'DatePickerButton'

export const DatePicker = React.forwardRef<HTMLDivElement, DatePickerProps>(
  (
    {
      value,
      onChange,
      placeholder,
      className,
      minYear = 1900,
      maxYear = 2100,
      allowClear = false,
      clearLabel = 'Limpar',
      disabled = false,
    },
    ref
  ) => {
    const [open, setOpen] = React.useState(false)
    // Initialize currentMonth with value only if it's a valid date
    const isValidValue = value instanceof Date && !isNaN(value.getTime()) && value.getFullYear() > 1
    const [currentMonth, setCurrentMonth] = React.useState<Date>(
      isValidValue ? value : new Date()
    )

    const handleClose = React.useCallback(() => {
      setOpen(false)
    }, [])

    const handleYearChange = (year: string) => {
      const newYear = parseInt(year)
      const newMonth = new Date(currentMonth)
      newMonth.setFullYear(newYear)
      setCurrentMonth(newMonth)
    }

    const handleYearNavigation = (direction: 'prev' | 'next') => {
      const newMonth =
        direction === 'prev'
          ? subYears(currentMonth, 1)
          : addYears(currentMonth, 1)
      setCurrentMonth(newMonth)
    }

    const handleClear = React.useCallback(
      (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault()
        event.stopPropagation()
        onChange?.(undefined)
        setCurrentMonth(new Date())
        handleClose()
      },
      [handleClose, onChange]
    )

    // Generate year options for the dropdown
    const yearOptions = React.useMemo(() => {
      const years = []
      for (let year = maxYear; year >= minYear; year--) {
        years.push(year)
      }
      return years
    }, [minYear, maxYear])

    return (
      <div ref={ref}>
        <Popover open={open && !disabled} onOpenChange={(open) => !disabled && setOpen(open)}>
          <PopoverTrigger asChild>
            <DatePickerButton
              value={value as Date | null}
              placeholder={placeholder}
              className={className}
              disabled={disabled}
              aria-expanded={open}
            />
          </PopoverTrigger>
          <PopoverContent
            className='w-auto p-0'
            align='start'
            side='bottom'
            sideOffset={4}
            onEscapeKeyDown={handleClose}
          >
            {/* Year Navigation Header */}
            <div className='flex items-center justify-between gap-2 border-b p-3'>
              <div className='flex items-center gap-2'>
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={() => handleYearNavigation('prev')}
                  className='h-8 w-8 p-0'
                >
                  <ChevronLeft className='h-4 w-4' />
                </Button>

                <Select
                  value={getYear(currentMonth).toString()}
                  onValueChange={handleYearChange}
                >
                  <SelectTrigger className='h-8 w-24'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className='max-h-60'>
                    {yearOptions.map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button
                  variant='ghost'
                  size='sm'
                  onClick={() => handleYearNavigation('next')}
                  className='h-8 w-8 p-0'
                >
                  <ChevronRight className='h-4 w-4' />
                </Button>
              </div>

              {allowClear && value ? (
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={handleClear}
                  className='h-8 px-2 text-xs font-medium'
                >
                  {clearLabel}
                </Button>
              ) : null}
            </div>

            <Calendar
              mode='single'
              selected={isValidValue ? value : undefined}
              onSelect={(date) => {
                onChange?.(date)
                handleClose()
              }}
              month={currentMonth}
              onMonthChange={setCurrentMonth}
              initialFocus
              locale={pt}
            />
          </PopoverContent>
        </Popover>
      </div>
    )
  }
)
DatePicker.displayName = 'DatePicker'
