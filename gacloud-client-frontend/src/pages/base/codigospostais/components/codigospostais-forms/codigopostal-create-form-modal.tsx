import { CodigoPostalFormBase } from './codigopostal-form-base'

interface CodigoPostalCreateFormModalProps {
  modalClose: () => void
  onSuccess?: (newCodigoPostal: { id: string; codigo: string }) => void
  initialCodigo?: string
  shouldCloseWindow?: boolean
}

const CodigoPostalCreateFormModal = ({
  modalClose,
  onSuccess,
  initialCodigo,
  shouldCloseWindow = true,
}: CodigoPostalCreateFormModalProps) => {
  return (
    <CodigoPostalFormBase
      modalClose={modalClose}
      onSuccess={onSuccess}
      initialCodigo={initialCodigo}
      shouldCloseWindow={shouldCloseWindow}
      formId='codigo-postal-modal'
      useTabs={false}
      usePersistence={false}
      useErrorHandling={false}
      singleColumn={true}
    />
  )
}

export { CodigoPostalCreateFormModal }
