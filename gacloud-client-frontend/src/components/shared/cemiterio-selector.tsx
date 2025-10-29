import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useGetCemiteriosSelect } from '@/pages/cemiterios/cemiterios/queries/cemiterios-queries'
import { useAuthStore } from '@/stores/auth-store'
import { useCemiterioSelection } from '@/hooks/use-cemiterio-selection'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export function CemiterioSelector() {
  const queryClient = useQueryClient()
  const { data: cemiterios, isLoading } = useGetCemiteriosSelect()
  const selectedCemiterio = useAuthStore((state) => state.selectedCemiterio)
  const setSelectedCemiterioStore = useAuthStore(
    (state) => state.setSelectedCemiterio
  )
  const { setSelectedCemiterio } = useCemiterioSelection()

  const handleCemiterioChange = (cemiterioId: string) => {
    const selected = cemiterios?.find(
      (cemiterio) => cemiterio.id === cemiterioId
    )
    if (selected) {
      const cemiterioData = {
        id: selected.id,
        nome: selected.nome,
      }

      // Use the sessionVars utility and hook
      setSelectedCemiterio(cemiterioData)
      setSelectedCemiterioStore(cemiterioData)

      // Invalidate all relevant queries
      queryClient.invalidateQueries()
    }
  }

  useEffect(() => {
    if (cemiterios && !selectedCemiterio && cemiterios.length > 0) {
      handleCemiterioChange(cemiterios[0].id)
    }
  }, [cemiterios, selectedCemiterio])

  return (
    <div className='space-y-2'>
      <Label>Cemitério Selecionado</Label>
      <Select
        value={selectedCemiterio?.id}
        onValueChange={handleCemiterioChange}
        disabled={isLoading}
      >
        <SelectTrigger className='w-full justify-start px-4 py-6 text-left font-normal shadow-inner'>
          <SelectValue>
            {selectedCemiterio?.nome || 'Selecione um cemitério'}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {cemiterios?.map((cemiterio) => (
            <SelectItem key={cemiterio.id} value={cemiterio.id}>
              {cemiterio.nome}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
