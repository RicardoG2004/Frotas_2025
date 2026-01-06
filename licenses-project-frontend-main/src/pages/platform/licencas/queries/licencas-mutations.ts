import { useMutation, useQueryClient } from '@tanstack/react-query'
import { CreateLicencaDTO, UpdateLicencaDTO } from '@/types/dtos'
import LicencasService from '@/lib/services/platform/licencas-service'

export const useDeleteLicenca = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => LicencasService('licencas').deleteLicenca(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['licencas-paginated'] })
      queryClient.invalidateQueries({ queryKey: ['licencas'] })
      queryClient.invalidateQueries({ queryKey: ['licencas-count'] })
      queryClient.invalidateQueries({ queryKey: ['licencas-select'] })
    },
  })
}

export const useCreateLicenca = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateLicencaDTO) =>
      LicencasService('licencas').createLicenca(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['licencas-paginated'] })
      queryClient.invalidateQueries({ queryKey: ['licencas'] })
      queryClient.invalidateQueries({ queryKey: ['licencas-count'] })
      queryClient.invalidateQueries({ queryKey: ['licencas-select'] })
    },
  })
}

export const useUpdateLicenca = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateLicencaDTO }) =>
      LicencasService('licencas').updateLicenca(id, { ...data, id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['licencas-paginated'] })
      queryClient.invalidateQueries({ queryKey: ['licencas'] })
      queryClient.invalidateQueries({ queryKey: ['licencas-count'] })
      queryClient.invalidateQueries({ queryKey: ['licencas-select'] })
    },
  })
}

export const useBlockLicenca = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      licencaId,
      motivoBloqueio,
    }: {
      licencaId: string
      motivoBloqueio: string
    }) =>
      LicencasService('licencas').blockLicenca(licencaId, { motivoBloqueio }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['licencas-paginated'] })
      queryClient.invalidateQueries({ queryKey: ['licencas'] })
      queryClient.invalidateQueries({ queryKey: ['licencas-count'] })
      queryClient.invalidateQueries({ queryKey: ['licencas-select'] })
    },
  })
}

export const useUnblockLicenca = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (licencaId: string) =>
      LicencasService('licencas').unblockLicenca(licencaId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['licencas-paginated'] })
      queryClient.invalidateQueries({ queryKey: ['licencas'] })
      queryClient.invalidateQueries({ queryKey: ['licencas-count'] })
      queryClient.invalidateQueries({ queryKey: ['licencas-select'] })
    },
  })
}

export const useCreateLicencaApiKey = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (licencaId: string) =>
      LicencasService('licencas').createLicencaApiKey(licencaId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['licencas-paginated'] })
      queryClient.invalidateQueries({ queryKey: ['licencas'] })
      queryClient.invalidateQueries({ queryKey: ['licencas-count'] })
      queryClient.invalidateQueries({ queryKey: ['licencas-select'] })
    },
  })
}

export const useDeleteMultipleLicencas = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (ids: string[]) =>
      LicencasService('licencas').deleteMultipleLicencas(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['licencas-paginated'] })
      queryClient.invalidateQueries({ queryKey: ['licencas'] })
      queryClient.invalidateQueries({ queryKey: ['licencas-count'] })
      queryClient.invalidateQueries({ queryKey: ['licencas-select'] })
    },
  })
}

export const useRegenerateLicencaApiKey = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (licencaId: string) =>
      LicencasService('licencas').regenerateLicencaApiKey(licencaId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['licencas-paginated'] })
      queryClient.invalidateQueries({ queryKey: ['licencas'] })
      queryClient.invalidateQueries({ queryKey: ['licencas-count'] })
      queryClient.invalidateQueries({ queryKey: ['licencas-select'] })
    },
  })
}

export const useDownloadUpdaterConfig = () => {
  return useMutation({
    mutationFn: (licenseIds: string[]) =>
      LicencasService('licencas').downloadUpdaterConfig(licenseIds),
  })
}

export const useDownloadFrontendConfig = () => {
  return useMutation({
    mutationFn: (licenseId: string) =>
      LicencasService('licencas').downloadFrontendConfig(licenseId),
  })
}

export const useDownloadApiConfig = () => {
  return useMutation({
    mutationFn: (licenseId: string) =>
      LicencasService('licencas').downloadApiConfig(licenseId),
  })
}
