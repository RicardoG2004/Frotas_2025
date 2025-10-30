import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useGetEpocasSelect } from '@/pages/base/epocas/queries/epocas-queries'
import { useAuthStore } from '@/stores/auth-store'
import { useEpocaSelection } from '@/hooks/use-epoca-selection'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export function EpocaSelector() {
  const queryClient = useQueryClient()
  const { data: epocas, isLoading } = useGetEpocasSelect()
  const selectedEpoca = useAuthStore((state) => state.selectedEpoca)
  const setSelectedEpocaStore = useAuthStore((state) => state.setSelectedEpoca)
  const { setSelectedEpoca } = useEpocaSelection()

  const handleEpocaChange = (epocaId: string) => {
    const selected = epocas?.find((epoca) => epoca.id === epocaId)
    if (selected) {
      const epocaData = {
        id: selected.id,
        ano: selected.ano,
        descricao: selected.descricao,
      }

      // Use the new sessionVars utility and hook
      setSelectedEpoca(epocaData)
      setSelectedEpocaStore(epocaData)

      // Invalidate all relevant queries
      queryClient.invalidateQueries()
    }
  }

  useEffect(() => {
    if (epocas && !selectedEpoca && epocas.length > 0) {
      handleEpocaChange(epocas[0].id)
    }
  }, [epocas, selectedEpoca])

  return (
    <div className='space-y-2'>
      <Label>Época Selecionada</Label>
      <Select
        value={selectedEpoca?.id}
        onValueChange={handleEpocaChange}
        disabled={isLoading}
      >
        <SelectTrigger className='w-full justify-start px-4 py-6 text-left font-normal shadow-inner'>
          <SelectValue>
            {selectedEpoca?.descricao || 'Selecione uma época'}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {epocas?.map((epoca) => (
            <SelectItem key={epoca.id} value={epoca.id}>
              {epoca.descricao}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
