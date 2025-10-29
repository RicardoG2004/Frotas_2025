import { FieldErrors } from 'react-hook-form'

type TabName = string

interface UseSubmitErrorTabOptions<TFieldValues extends Record<string, any>> {
  fieldToTabMap: Record<keyof TFieldValues | string, TabName>
  setActiveTab: (tab: TabName) => void
}

export function useSubmitErrorTab<TFieldValues extends Record<string, any>>({
  fieldToTabMap,
  setActiveTab,
}: UseSubmitErrorTabOptions<TFieldValues>) {
  function handleError(errors: FieldErrors<TFieldValues>) {
    const firstErrorField = Object.keys(errors || {})[0] as string | undefined
    if (!firstErrorField) return
    const targetTab = fieldToTabMap[firstErrorField] || fieldToTabMap['default']
    if (targetTab) setActiveTab(targetTab)
  }

  return { handleError }
}
