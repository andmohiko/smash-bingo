import { BasicButton } from '~/components/Buttons/BasicButton'
import { BaseModal } from '~/components/Modals/BaseModal'

/**
 * 確認モーダルコンポーネント
 * @description 操作の確認を行うモーダルUI
 */
type Props = {
  isOpen: boolean
  onConfirm: () => void
  onCancel: () => void
}

export const ConfirmModal = ({
  isOpen,
  onConfirm,
  onCancel,
}: Props): React.ReactNode => {
  if (!isOpen) return null

  return (
    <BaseModal isOpen={isOpen} onClose={onCancel}>
      <p className="text-gray-600 mb-6" style={{ lineHeight: '1.5' }}>
        ビンゴカードを再生成しますか？
        <br />
        現在の選択状態は失われます。
      </p>
      <div className="flex justify-end gap-4 pt-4">
        <BasicButton onClick={onCancel} importance="tertiary">
          キャンセル
        </BasicButton>
        <BasicButton onClick={onConfirm}>再生成する</BasicButton>
      </div>
    </BaseModal>
  )
}
