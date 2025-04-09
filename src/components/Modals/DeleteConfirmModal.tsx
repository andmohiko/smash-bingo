import { DeleteButton } from '~/components/Buttons/DeleteButton'
import { BaseModal } from '~/components/Modals/BaseModal'

/**
 * 確認モーダルコンポーネント
 * @description 操作の確認を行うモーダルUI
 */
type Props = {
  isOpen: boolean
  message: React.ReactNode
  confirmText: string
  cancelText: string
  onConfirm: () => void
  onCancel: () => void
}

export const DeleteConfirmModal = ({
  isOpen,
  message,
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
}: Props): React.ReactNode => {
  if (!isOpen) return null

  return (
    <BaseModal isOpen={isOpen} onClose={onCancel}>
      <p className="text-gray-600 mb-6" style={{ lineHeight: '1.5' }}>
        {message}
      </p>
      <div className="flex justify-end gap-4 pt-4">
        <DeleteButton onClick={onCancel} importance="tertiary">
          {cancelText}
        </DeleteButton>
        <DeleteButton onClick={onConfirm}>{confirmText}</DeleteButton>
      </div>
    </BaseModal>
  )
}
