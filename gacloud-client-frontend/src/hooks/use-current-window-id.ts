import { useLocation } from 'react-router-dom'

export const useCurrentWindowId = () => {
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  return searchParams.get('instanceId') || 'default'
}
