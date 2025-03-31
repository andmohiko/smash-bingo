import { useState } from 'react'

import { BasicButton } from '~/components/Buttons/BasicButton'

type Props = {
  /** 現在のビンゴカードの状態を文字列化したもの */
  stateString: string
  /** ビンゴカードの状態を文字列化する関数 */
  onChangeStateString: (stateString: string) => void
  /** ビンゴカードの状態を文字列化する関数 */
  onSerializeState: () => string
  /** ビンゴカードの状態を更新する関数 */
  onStateRestore: () => void
  /** ビンゴカードの状態に関するエラー */
  bingoStateError: string | null
}

/**
 * ビンゴカードの状態を管理するコンポーネント
 * - 現在の状態を文字列化してクリップボードにコピー
 * - 文字列から状態を復元
 */
export const BingoStateManager: React.FC<Props> = ({
  stateString,
  onChangeStateString,
  onSerializeState,
  onStateRestore,
  bingoStateError,
}) => {
  const [showCopyTooltip, setShowCopyTooltip] = useState(false)

  const handleCopy = async () => {
    const serialized = onSerializeState()
    await navigator.clipboard.writeText(serialized)

    // ツールチップを表示
    setShowCopyTooltip(true)

    // 2秒後に非表示
    setTimeout(() => {
      setShowCopyTooltip(false)
    }, 2000)
  }

  return (
    <div className="flex flex-col gap-2 space-y-4 p-4 border rounded-lg bg-white">
      <h3 className="text-lg font-bold">ビンゴカードの状態をコード化</h3>

      <div className="flex gap-2">
        <BasicButton onClick={onSerializeState}>
          現在のカードをコード化
        </BasicButton>
        <BasicButton onClick={onStateRestore} importance="secondary">
          コードからカードを復元
        </BasicButton>
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={stateString}
          onChange={(e) => onChangeStateString(e.target.value)}
          placeholder="状態の文字列を入力..."
          className="flex-1 px-4 py-2 border rounded"
        />
        <BasicButton onClick={handleCopy} isDisabled={!stateString}>
          コピー
        </BasicButton>
      </div>

      {/* エラーメッセージの表示 */}
      {bingoStateError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">
            <span className="font-bold">エラー:</span> {bingoStateError}
          </p>
        </div>
      )}
    </div>
  )
}
