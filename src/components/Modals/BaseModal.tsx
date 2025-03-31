/**
 * モーダルの汎用コンポーネント
 * @description モーダルの背景とコンテンツを表示する
 */
type Props = {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
}

export const BaseModal = ({ isOpen, onClose, children }: Props) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* オーバーレイ */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      {/* モーダルコンテンツ */}
      <div
        className="flex flex-col gap-4 relative bg-white rounded-lg p-6 shadow-xl max-w-sm w-full"
        style={{
          padding: '40px 20px',
        }}
      >
        {/* 閉じるボタン */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 transition-colors"
          aria-label="閉じる"
        >
          <span className="text-xl">×</span>
        </button>
        {children}
      </div>
    </div>
  )
}
