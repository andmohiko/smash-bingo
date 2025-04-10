import { BasicButton } from '~/components/Buttons/BasicButton'
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

export const ConfirmModal = ({
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
        <BasicButton onClick={onCancel} importance="tertiary">
          {cancelText}
        </BasicButton>
        <BasicButton onClick={onConfirm}>{confirmText}</BasicButton>
      </div>
    </BaseModal>
  )
}
