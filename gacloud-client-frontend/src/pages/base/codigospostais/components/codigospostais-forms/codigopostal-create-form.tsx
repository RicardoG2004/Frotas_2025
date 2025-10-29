import { CodigoPostalFormBase } from './codigopostal-form-base'

interface CodigoPostalCreateFormProps {
  modalClose: () => void
  onSuccess?: (newCodigoPostal: { id: string; codigo: string }) => void
  initialCodigo?: string
  shouldCloseWindow?: boolean
}

const CodigoPostalCreateForm = ({
  modalClose,
  onSuccess,
  initialCodigo,
  shouldCloseWindow = true,
}: CodigoPostalCreateFormProps) => {
  return (
    <CodigoPostalFormBase
      modalClose={modalClose}
      onSuccess={onSuccess}
      initialCodigo={initialCodigo}
      shouldCloseWindow={shouldCloseWindow}
      formId='codigo-postal'
      useTabs={true}
      usePersistence={true}
      useErrorHandling={true}
    />
  )
}

export { CodigoPostalCreateForm }
