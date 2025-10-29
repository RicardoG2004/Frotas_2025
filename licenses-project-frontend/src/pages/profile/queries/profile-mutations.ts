import { useMutation, useQueryClient } from '@tanstack/react-query'
import UtilizadoresService from '@/lib/services/platform/utilizadores-service'

export const useUpdateProfile = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: {
      firstName: string
      lastName: string
      phoneNumber?: string
      email: string
    }) => UtilizadoresService('profile').updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] })
    },
  })
}

export const useChangePassword = () => {
  return useMutation({
    mutationFn: (data: {
      password: string
      newPassword: string
      confirmNewPassword: string
    }) => UtilizadoresService('change-password').changePassword(data),
  })
}
