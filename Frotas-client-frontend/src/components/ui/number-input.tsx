import * as React from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export interface NumberInputProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    'type' | 'value' | 'defaultValue' | 'onChange' | 'step' | 'min' | 'max'
  > {
  value?: number | null
  onValueChange?: (value?: number) => void
  step?: number
  min?: number
  max?: number
}

export const NumberInput = React.forwardRef<HTMLInputElement, NumberInputProps>(
  (
    {
      value,
      onValueChange,
      step = 1,
      min,
      max,
      className,
      onWheel,
      onBlur,
      disabled,
      placeholder,
      ...props
    },
    ref
  ) => {
    const inputRef = React.useRef<HTMLInputElement | null>(null)
    const setRefs = React.useCallback(
      (node: HTMLInputElement | null) => {
        inputRef.current = node

        if (typeof ref === 'function') {
          ref(node)
        } else if (ref) {
          ;(ref as React.MutableRefObject<HTMLInputElement | null>).current = node
        }
      },
      [ref]
    )

    const [displayValue, setDisplayValue] = React.useState<string>('')
    const [isFocused, setIsFocused] = React.useState(false)

    const clampValue = React.useCallback(
      (nextValue: number) => {
        let result = nextValue

        if (typeof min === 'number') {
          result = Math.max(min, result)
        }

        if (typeof max === 'number') {
          result = Math.min(max, result)
        }

        return result
      },
      [min, max]
    )

    const numericValue =
      typeof value === 'number' && !Number.isNaN(value) ? value : undefined

    const isIntermediateValue = React.useCallback((raw: string) => {
      return (
        raw === '-' ||
        raw === '-.' ||
        raw === '.' ||
        raw.endsWith('.') ||
        raw.endsWith(',')
      )
    }, [])

    React.useEffect(() => {
      const desired = numericValue !== undefined ? String(numericValue) : ''

      if (displayValue === desired) {
        return
      }

      if (
        inputRef.current === document.activeElement &&
        isIntermediateValue(displayValue)
      ) {
        return
      }

      setDisplayValue(desired)
    }, [numericValue, displayValue, isIntermediateValue])

    const emitValue = React.useCallback(
      (next: number | undefined) => {
        if (!onValueChange) {
          return
        }

        if (typeof next === 'number' && !Number.isNaN(next)) {
          const clamped = clampValue(next)
          onValueChange(clamped)
          setDisplayValue(String(clamped))
          return
        }

        onValueChange(undefined)
        setDisplayValue('')
      },
      [clampValue, onValueChange]
    )

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const rawValue = event.target.value

      const numberPattern = /^-?\d*(?:[.,]\d*)?$/
      if (!numberPattern.test(rawValue)) {
        return
      }

      setDisplayValue(rawValue)

      const normalized = rawValue.replace(',', '.')

      if (rawValue === '' || rawValue === '-' || rawValue === '-.' || rawValue === '.') {
        onValueChange?.(undefined)
        return
      }

      const parsed = Number(normalized)

      if (Number.isNaN(parsed)) {
        return
      }

      onValueChange?.(parsed)
    }

    const handleInternalBlur = (event: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false)
      if (
        displayValue === '' ||
        displayValue === '-' ||
        displayValue === '-.' ||
        displayValue === '.'
      ) {
        emitValue(undefined)
      } else {
        const normalized = displayValue.replace(',', '.')
        const parsed = Number(normalized)

        if (!Number.isNaN(parsed)) {
          emitValue(parsed)
        }
      }

      onBlur?.(event)
    }

    const handleInternalFocus = (event: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true)
      props.onFocus?.(event)
    }

    const resolveCurrentValue = () => {
      if (typeof numericValue === 'number') {
        return numericValue
      }

      const parsed = Number(displayValue.replace(',', '.'))
      return Number.isNaN(parsed) ? 0 : parsed
    }

    const handleStep = (direction: 1 | -1) => {
      const current = resolveCurrentValue()
      const next = current + direction * step
      emitValue(next)
    }

    const handleWheel = (event: React.WheelEvent<HTMLInputElement>) => {
      if (disabled) {
        onWheel?.(event)
        return
      }

      if (inputRef.current !== document.activeElement) {
        onWheel?.(event)
        return
      }

      event.preventDefault()
      event.stopPropagation()
      event.nativeEvent.stopImmediatePropagation?.()

      const direction: 1 | -1 = event.deltaY < 0 ? 1 : -1
      handleStep(direction)
    }

    React.useEffect(() => {
      if (!isFocused) {
        return
      }

      const listener = (event: WheelEvent) => {
        if (!inputRef.current) {
          return
        }

        const path = event.composedPath ? event.composedPath() : []

        const isTargetWithinInput =
          path.length > 0
            ? path.includes(inputRef.current)
            : inputRef.current.contains(event.target as Node)

        if (!isTargetWithinInput) {
          return
        }

        event.preventDefault()
        event.stopPropagation()
        ;(event as any).stopImmediatePropagation?.()

        const direction: 1 | -1 = event.deltaY < 0 ? 1 : -1
        handleStep(direction)
      }

      window.addEventListener('wheel', listener, { passive: false, capture: true })

      return () => {
        window.removeEventListener('wheel', listener, { capture: true } as any)
      }
    }, [handleStep, isFocused])

    const resolvedPlaceholder =
      placeholder !== undefined ? placeholder : step < 1 ? '0,00' : '0'

    return (
      <div className='relative'>
        <Input
          ref={setRefs}
          type='text'
          value={displayValue}
          onChange={handleChange}
          onWheel={handleWheel}
          onBlur={handleInternalBlur}
          onFocus={handleInternalFocus}
          className={cn('pr-12', className)}
          placeholder={resolvedPlaceholder}
          disabled={disabled}
          inputMode='decimal'
          {...props}
        />
        <div className='absolute right-1 top-1/2 -translate-y-1/2 flex flex-col gap-0.5'>
          <Button
            type='button'
            variant='ghost'
            size='icon'
            className='h-6 w-6 rounded hover:bg-primary/10 hover:text-primary transition-colors'
            onClick={() => handleStep(1)}
            disabled={disabled}
          >
            <ChevronUp className='h-3 w-3' />
          </Button>
          <Button
            type='button'
            variant='ghost'
            size='icon'
            className='h-6 w-6 rounded hover:bg-primary/10 hover:text-primary transition-colors'
            onClick={() => handleStep(-1)}
            disabled={disabled}
          >
            <ChevronDown className='h-3 w-3' />
          </Button>
        </div>
      </div>
    )
  }
)

NumberInput.displayName = 'NumberInput'

