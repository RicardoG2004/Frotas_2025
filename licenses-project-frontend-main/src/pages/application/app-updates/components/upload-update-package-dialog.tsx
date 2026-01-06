import { useState, useCallback, useEffect } from 'react'
import {
  useUploadUpdatePackage,
  useDeleteUpdatePackage,
} from '@/pages/application/app-updates/queries/app-updates-mutations'
import { useGetUpdateById } from '@/pages/application/app-updates/queries/app-updates-queries'
import { AppUpdateDTO, UpdateType } from '@/types/dtos'
import { Upload, File, X, Server, Monitor, Trash2 } from 'lucide-react'
import { useDropzone } from 'react-dropzone'
import { getErrorMessage, handleApiError } from '@/utils/error-handlers'
import { toast } from '@/utils/toast-utils'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { AlertModal } from '@/components/shared/alert-modal'

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

interface UploadUpdatePackageDialogProps {
  updateId: string
  updateVersion: string
  tipoUpdate: UpdateType
  aplicacaoId?: string
  update?: AppUpdateDTO
  modalClose: () => void
}

interface FileUploadState {
  file: File | null
  progress: number
  isUploading: boolean
  isComplete: boolean
}

const UploadUpdatePackageDialog = ({
  updateId,
  updateVersion,
  tipoUpdate,
  aplicacaoId,
  update,
  modalClose,
}: UploadUpdatePackageDialogProps) => {
  const isBothType = tipoUpdate === UpdateType.Both
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [deletePackageType, setDeletePackageType] = useState<
    UpdateType | undefined
  >()

  // For single file upload (API or Frontend only)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)

  // For Both type - separate states for API and Frontend files
  const [apiFile, setApiFile] = useState<FileUploadState>({
    file: null,
    progress: 0,
    isUploading: false,
    isComplete: false,
  })
  const [frontendFile, setFrontendFile] = useState<FileUploadState>({
    file: null,
    progress: 0,
    isUploading: false,
    isComplete: false,
  })

  const uploadMutation = useUploadUpdatePackage()
  const deleteMutation = useDeleteUpdatePackage()

  // Fetch fresh update data to reflect changes after deletion
  const { data: updateData, refetch: refetchUpdate } =
    useGetUpdateById(updateId)

  // Use fresh data if available, otherwise fall back to prop
  const currentUpdate = updateData?.info.data || update

  // Check if files exist
  const hasExistingFile = !isBothType && currentUpdate?.ficheiroUpdate
  const hasExistingApiFile = isBothType && currentUpdate?.ficheiroUpdateApi
  const hasExistingFrontendFile =
    isBothType && currentUpdate?.ficheiroUpdateFrontend

  // Refetch update data after successful deletion or upload
  useEffect(() => {
    if (deleteMutation.isSuccess || uploadMutation.isSuccess) {
      refetchUpdate()
    }
  }, [deleteMutation.isSuccess, uploadMutation.isSuccess, refetchUpdate])

  const handleDeleteFile = async () => {
    if (!deletePackageType && !isBothType) {
      // Single file delete
      try {
        const response = await deleteMutation.mutateAsync({
          id: updateId,
          aplicacaoId: aplicacaoId,
        })

        if (response.info.succeeded) {
          toast.success('Ficheiro removido com sucesso')
          setDeleteConfirmOpen(false)
        } else {
          toast.error(getErrorMessage(response, 'Erro ao remover ficheiro'))
        }
      } catch (error) {
        toast.error(handleApiError(error, 'Erro ao remover ficheiro'))
      }
    } else {
      // Both type - delete specific package
      try {
        const response = await deleteMutation.mutateAsync({
          id: updateId,
          aplicacaoId: aplicacaoId,
          packageType: deletePackageType,
        })

        if (response.info.succeeded) {
          toast.success('Ficheiro removido com sucesso')
          setDeleteConfirmOpen(false)
        } else {
          toast.error(getErrorMessage(response, 'Erro ao remover ficheiro'))
        }
      } catch (error) {
        toast.error(handleApiError(error, 'Erro ao remover ficheiro'))
      }
    }
  }

  const handleDeleteClick = (packageType?: UpdateType) => {
    setDeletePackageType(packageType)
    setDeleteConfirmOpen(true)
  }

  // Single file dropzone (for API or Frontend only)
  const onDropSingle = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file) {
      if (!file.name.endsWith('.zip')) {
        toast.error('Apenas ficheiros ZIP são permitidos')
        return
      }
      setSelectedFile(file)
    }
  }, [])

  const {
    getRootProps: getSingleRootProps,
    getInputProps: getSingleInputProps,
    isDragActive: isSingleDragActive,
  } = useDropzone({
    onDrop: onDropSingle,
    accept: {
      'application/zip': ['.zip'],
      'application/x-zip-compressed': ['.zip'],
    },
    maxFiles: 1,
  })

  // API file dropzone
  const onDropApi = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file) {
      if (!file.name.endsWith('.zip')) {
        toast.error('Apenas ficheiros ZIP são permitidos')
        return
      }
      setApiFile((prev) => ({ ...prev, file }))
    }
  }, [])

  const {
    getRootProps: getApiRootProps,
    getInputProps: getApiInputProps,
    isDragActive: isApiDragActive,
  } = useDropzone({
    onDrop: onDropApi,
    accept: {
      'application/zip': ['.zip'],
      'application/x-zip-compressed': ['.zip'],
    },
    maxFiles: 1,
  })

  // Frontend file dropzone
  const onDropFrontend = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file) {
      if (!file.name.endsWith('.zip')) {
        toast.error('Apenas ficheiros ZIP são permitidos')
        return
      }
      setFrontendFile((prev) => ({ ...prev, file }))
    }
  }, [])

  const {
    getRootProps: getFrontendRootProps,
    getInputProps: getFrontendInputProps,
    isDragActive: isFrontendDragActive,
  } = useDropzone({
    onDrop: onDropFrontend,
    accept: {
      'application/zip': ['.zip'],
      'application/x-zip-compressed': ['.zip'],
    },
    maxFiles: 1,
  })

  // Single file upload handler
  const handleUploadSingle = async () => {
    if (!selectedFile) {
      toast.error('Por favor, selecione um ficheiro')
      return
    }

    try {
      const response = await uploadMutation.mutateAsync({
        id: updateId,
        file: selectedFile,
        aplicacaoId: aplicacaoId,
        onProgress: (progress) => {
          setUploadProgress(progress)
        },
      })

      if (response.info.succeeded) {
        toast.success('Ficheiro carregado com sucesso')
        setSelectedFile(null)
        setUploadProgress(0)
        modalClose()
      } else {
        toast.error(getErrorMessage(response, 'Erro ao carregar ficheiro'))
      }
    } catch (error) {
      toast.error(handleApiError(error, 'Erro ao carregar ficheiro'))
    }
  }

  // Both files upload handler
  const handleUploadBoth = async () => {
    if (!apiFile.file || !frontendFile.file) {
      toast.error('Por favor, selecione ambos os ficheiros (API e Frontend)')
      return
    }

    try {
      // Upload API file
      setApiFile((prev) => ({ ...prev, isUploading: true }))
      const apiResponse = await uploadMutation.mutateAsync({
        id: updateId,
        file: apiFile.file,
        aplicacaoId: aplicacaoId,
        packageType: UpdateType.API,
        onProgress: (progress) => {
          setApiFile((prev) => ({ ...prev, progress }))
        },
      })

      if (!apiResponse.info.succeeded) {
        toast.error(
          getErrorMessage(apiResponse, 'Erro ao carregar ficheiro API')
        )
        setApiFile((prev) => ({ ...prev, isUploading: false }))
        return
      }

      setApiFile((prev) => ({ ...prev, isUploading: false, isComplete: true }))

      // Upload Frontend file
      setFrontendFile((prev) => ({ ...prev, isUploading: true }))
      const frontendResponse = await uploadMutation.mutateAsync({
        id: updateId,
        file: frontendFile.file,
        aplicacaoId: aplicacaoId,
        packageType: UpdateType.Frontend,
        onProgress: (progress) => {
          setFrontendFile((prev) => ({ ...prev, progress }))
        },
      })

      if (!frontendResponse.info.succeeded) {
        toast.error(
          getErrorMessage(
            frontendResponse,
            'Erro ao carregar ficheiro Frontend'
          )
        )
        setFrontendFile((prev) => ({ ...prev, isUploading: false }))
        return
      }

      setFrontendFile((prev) => ({
        ...prev,
        isUploading: false,
        isComplete: true,
      }))

      toast.success('Ambos os ficheiros carregados com sucesso')
      modalClose()
    } catch (error) {
      toast.error(handleApiError(error, 'Erro ao carregar ficheiros'))
      setApiFile((prev) => ({ ...prev, isUploading: false }))
      setFrontendFile((prev) => ({ ...prev, isUploading: false }))
    }
  }

  const handleRemoveFile = () => {
    setSelectedFile(null)
    setUploadProgress(0)
  }

  const handleRemoveApiFile = () => {
    setApiFile({
      file: null,
      progress: 0,
      isUploading: false,
      isComplete: false,
    })
  }

  const handleRemoveFrontendFile = () => {
    setFrontendFile({
      file: null,
      progress: 0,
      isUploading: false,
      isComplete: false,
    })
  }

  const isUploading =
    uploadMutation.isPending || apiFile.isUploading || frontendFile.isUploading

  // Render single file upload UI
  const renderSingleUpload = () => (
    <>
      {/* Show existing file if any */}
      {hasExistingFile && !selectedFile && (
        <div className='mb-4 space-y-2'>
          <div className='flex items-center justify-between rounded-lg border p-4 bg-muted/50'>
            <div className='flex items-center gap-3'>
              <File className='h-8 w-8 text-primary' />
              <div>
                <p className='text-sm font-medium'>
                  {currentUpdate?.ficheiroUpdate}
                </p>
                {currentUpdate?.tamanhoFicheiro && (
                  <p className='text-xs text-muted-foreground'>
                    {formatFileSize(currentUpdate.tamanhoFicheiro)}
                  </p>
                )}
              </div>
            </div>
            <Button
              variant='destructive'
              size='sm'
              onClick={() => handleDeleteClick()}
              disabled={deleteMutation.isPending}
            >
              <Trash2 className='mr-2 h-4 w-4' />
              Remover
            </Button>
          </div>
          <p className='text-xs text-muted-foreground'>
            Carregue um novo ficheiro para substituir o existente
          </p>
        </div>
      )}

      {!selectedFile ? (
        <div
          {...getSingleRootProps()}
          className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors ${
            isSingleDragActive
              ? 'border-primary bg-primary/5'
              : 'border-muted-foreground/25 hover:border-primary/50'
          }`}
        >
          <input {...getSingleInputProps()} />
          <Upload className='mb-4 h-12 w-12 text-muted-foreground' />
          <p className='mb-2 text-sm font-medium'>
            {isSingleDragActive
              ? 'Solte o ficheiro aqui'
              : hasExistingFile
                ? 'Arraste um novo ficheiro ZIP ou clique para substituir'
                : 'Arraste um ficheiro ZIP ou clique para selecionar'}
          </p>
          <p className='text-xs text-muted-foreground'>
            Apenas ficheiros ZIP são permitidos
          </p>
        </div>
      ) : (
        <div className='space-y-4'>
          <div className='flex items-center justify-between rounded-lg border p-4'>
            <div className='flex items-center gap-3'>
              <File className='h-8 w-8 text-primary' />
              <div>
                <p className='text-sm font-medium'>{selectedFile.name}</p>
                <p className='text-xs text-muted-foreground'>
                  {formatFileSize(selectedFile.size)}
                </p>
              </div>
            </div>
            <Button
              variant='ghost'
              size='icon'
              onClick={handleRemoveFile}
              disabled={isUploading}
            >
              <X className='h-4 w-4' />
            </Button>
          </div>

          {uploadMutation.isPending && (
            <div className='space-y-2'>
              <div className='flex items-center justify-between text-sm'>
                <span>A carregar...</span>
                <span>{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} />
            </div>
          )}

          <div className='flex justify-end gap-2'>
            <Button
              variant='outline'
              onClick={handleRemoveFile}
              disabled={isUploading}
            >
              Cancelar
            </Button>
            <Button onClick={handleUploadSingle} disabled={isUploading}>
              {isUploading ? 'A carregar...' : 'Carregar Ficheiro'}
            </Button>
          </div>
        </div>
      )}
    </>
  )

  // Render file dropzone for Both type
  const renderFileDropzone = (
    type: 'api' | 'frontend',
    fileState: FileUploadState,
    getRootProps: ReturnType<typeof useDropzone>['getRootProps'],
    getInputProps: ReturnType<typeof useDropzone>['getInputProps'],
    isDragActive: boolean,
    onRemove: () => void
  ) => {
    const Icon = type === 'api' ? Server : Monitor
    const label = type === 'api' ? 'API' : 'Frontend'
    const hasExisting =
      type === 'api' ? hasExistingApiFile : hasExistingFrontendFile
    const existingFileName =
      type === 'api'
        ? currentUpdate?.ficheiroUpdateApi
        : currentUpdate?.ficheiroUpdateFrontend
    const existingFileSize =
      type === 'api'
        ? currentUpdate?.tamanhoFicheiroApi
        : currentUpdate?.tamanhoFicheiroFrontend
    const packageType = type === 'api' ? UpdateType.API : UpdateType.Frontend

    return (
      <div className='space-y-2'>
        <div className='flex items-center gap-2 text-sm font-medium'>
          <Icon className='h-4 w-4' />
          <span>Pacote {label}</span>
          {fileState.isComplete && (
            <span className='text-xs text-green-600'>✓ Carregado</span>
          )}
        </div>

        {/* Show existing file if any */}
        {hasExisting && !fileState.file && (
          <div className='mb-2 space-y-2'>
            <div className='flex items-center justify-between rounded-lg border p-3 bg-muted/50'>
              <div className='flex items-center gap-2'>
                <File className='h-6 w-6 text-primary' />
                <div>
                  <p className='text-sm font-medium'>{existingFileName}</p>
                  {existingFileSize && (
                    <p className='text-xs text-muted-foreground'>
                      {formatFileSize(existingFileSize)}
                    </p>
                  )}
                </div>
              </div>
              <Button
                variant='destructive'
                size='sm'
                onClick={() => handleDeleteClick(packageType)}
                disabled={deleteMutation.isPending}
              >
                <Trash2 className='mr-2 h-4 w-4' />
                Remover
              </Button>
            </div>
            <p className='text-xs text-muted-foreground'>
              Carregue um novo ficheiro para substituir o existente
            </p>
          </div>
        )}

        {!fileState.file ? (
          <div
            {...getRootProps()}
            className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-4 transition-colors ${
              isDragActive
                ? 'border-primary bg-primary/5'
                : 'border-muted-foreground/25 hover:border-primary/50'
            }`}
          >
            <input {...getInputProps()} />
            <Upload className='mb-2 h-8 w-8 text-muted-foreground' />
            <p className='text-xs text-muted-foreground'>
              {isDragActive
                ? 'Solte aqui'
                : hasExisting
                  ? `Arraste um novo ficheiro ${label} (.zip) ou clique para substituir`
                  : `Arraste o ficheiro ${label} (.zip)`}
            </p>
          </div>
        ) : (
          <div className='space-y-2'>
            <div className='flex items-center justify-between rounded-lg border p-3'>
              <div className='flex items-center gap-2'>
                <File className='h-6 w-6 text-primary' />
                <div>
                  <p className='text-sm font-medium'>{fileState.file.name}</p>
                  <p className='text-xs text-muted-foreground'>
                    {formatFileSize(fileState.file.size)}
                  </p>
                </div>
              </div>
              <Button
                variant='ghost'
                size='icon'
                onClick={onRemove}
                disabled={isUploading || fileState.isComplete}
              >
                <X className='h-4 w-4' />
              </Button>
            </div>

            {fileState.isUploading && (
              <div className='space-y-1'>
                <div className='flex items-center justify-between text-xs'>
                  <span>A carregar {label}...</span>
                  <span>{fileState.progress}%</span>
                </div>
                <Progress value={fileState.progress} className='h-1' />
              </div>
            )}
          </div>
        )}
      </div>
    )
  }

  // Render Both type upload UI (two dropzones)
  const renderBothUpload = () => (
    <div className='space-y-4'>
      {renderFileDropzone(
        'api',
        apiFile,
        getApiRootProps,
        getApiInputProps,
        isApiDragActive,
        handleRemoveApiFile
      )}

      {renderFileDropzone(
        'frontend',
        frontendFile,
        getFrontendRootProps,
        getFrontendInputProps,
        isFrontendDragActive,
        handleRemoveFrontendFile
      )}

      <div className='flex justify-end gap-2'>
        <Button variant='outline' onClick={modalClose} disabled={isUploading}>
          Cancelar
        </Button>
        <Button
          onClick={handleUploadBoth}
          disabled={isUploading || !apiFile.file || !frontendFile.file}
        >
          {isUploading ? 'A carregar...' : 'Carregar Ficheiros'}
        </Button>
      </div>
    </div>
  )

  return (
    <>
      <AlertModal
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDeleteFile}
        loading={deleteMutation.isPending}
        title='Remover Ficheiro'
        description='Tem certeza que deseja remover este ficheiro? Esta ação não pode ser desfeita.'
      />

      <div className='space-y-4'>
        <div className='text-sm text-muted-foreground'>
          Versão: <span className='font-medium'>{updateVersion}</span>
          {isBothType && (
            <span className='ml-2 text-xs'>
              (Requer ficheiros API e Frontend)
            </span>
          )}
        </div>

        {isBothType ? renderBothUpload() : renderSingleUpload()}
      </div>
    </>
  )
}

export default UploadUpdatePackageDialog
