import { BasicButton } from '~/components/Buttons/BasicButton'

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
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* オーバーレイ */}
      <div className="absolute inset-0 bg-black/50" onClick={onCancel} />
      {/* モーダルコンテンツ */}
      <div
        className="flex flex-col gap-4 relative bg-white rounded-lg p-6 shadow-xl max-w-sm w-full"
        style={{
          padding: '40px 20px',
        }}
      >
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
      </div>
    </div>
  )
}
