import { forwardRef, useMemo } from 'react'
import plateBackground from '@/assets/images/license-plate/Matricula.png'
import { cn } from '@/lib/utils'

type LicensePlateInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  backgroundImageSrc?: string
}

const normalizeValue = (value: unknown) =>
  typeof value === 'string' ? value.toUpperCase().trim() : ''

const toRawValue = (value: string) => value.replace(/[^A-Z0-9]/g, '').slice(0, 6)

const formatRawValue = (value: string) => value.replace(/(.{2})/g, '$1 ').trim()

export const LicensePlateInput = forwardRef<HTMLInputElement, LicensePlateInputProps>(
  ({ className, value, onChange, onBlur, backgroundImageSrc, ...props }, ref) => {
    const formattedValue = useMemo(() => {
      const rawValue = toRawValue(normalizeValue(value))
      return formatRawValue(rawValue)
    }, [value])

    const backgroundSrc = backgroundImageSrc ?? plateBackground

    return (
      <div className={cn('group relative flex w-full items-center justify-start', className)}>
        <div className='relative aspect-[960/220] translate-y-[25px] max-w-[450px] -ml-[2.25rem]'>
          <img
            src={backgroundSrc}
            alt='Matrícula portuguesa'
            draggable={false}
            className='pointer-events-none absolute inset-0 h-full w-full select-none object-contain'
          />

          <input
            ref={ref}
            value={formattedValue}
            onBlur={onBlur}
            onChange={(event) => {
              const input = event.target as HTMLInputElement
              const rawValue = toRawValue(input.value.toUpperCase())
              const formatted = formatRawValue(rawValue)
              if (input.value !== rawValue) {
                input.value = rawValue
              }

              onChange?.(event)

              if (input.value !== formatted) {
                window.requestAnimationFrame(() => {
                  input.value = formatted
                })
              }
            }}
            className='relative z-10 h-full w-full bg-transparent pl-[5rem] pr-10 text-center text-[1.95rem] font-semibold uppercase tracking-[0.28em] text-black outline-none placeholder:text-muted-foreground placeholder:opacity-70'
            placeholder='AA 00 AA'
            inputMode='text'
            autoCapitalize='characters'
            spellCheck={false}
            {...props}
          />

          <div className='pointer-events-none absolute inset-0 rounded-md' />
        </div>
      </div>
    )
  }
)

LicensePlateInput.displayName = 'LicensePlateInput'

