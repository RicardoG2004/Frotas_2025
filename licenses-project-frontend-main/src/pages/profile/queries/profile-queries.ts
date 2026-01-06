import { useQuery } from '@tanstack/react-query'
import UtilizadoresService from '@/lib/services/platform/utilizadores-service'

export const useGetProfile = () => {
  return useQuery({
    queryKey: ['profile'],
    queryFn: () => UtilizadoresService('profile').getProfile(),
  })
}

// export const useGetProfileActivity = () => {
//   return useQuery({
//     queryKey: ['profile-activity'],
//     queryFn: () => UtilizadoresService('profile').getActivity(),
//   })
// }

// export const useGetProfileLocation = () => {
//   return useQuery({
//     queryKey: ['profile-location'],
//     queryFn: () => UtilizadoresService('profile').getLocation(),
//   })
// }
