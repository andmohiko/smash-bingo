import { useState } from 'react'

import {
  useSerializeBingoState,
  BingoState,
} from '~/features/bingo/hooks/useSerializeBingoState'
import { Fighter } from '~/features/bingo/types/fighter'

type BingoStateManagerProps = {
  /** 現在のビンゴカードの状態 */
  currentState: BingoState
  /** ビンゴカードの状態を更新する関数 */
  onStateRestore: (state: BingoState) => void
  /** 利用可能なファイターデータ */
  fighters: Record<string, Fighter>
}

/**
 * ビンゴカードの状態を管理するコンポーネント
 * - 現在の状態を文字列化してクリップボードにコピー
 * - 文字列から状態を復元
 */
export const BingoStateManager: React.FC<BingoStateManagerProps> = ({
  currentState,
  onStateRestore,
  fighters,
}) => {
  const { stateString, serializeState, deserializeState } =
    useSerializeBingoState(currentState)
  const [inputString, setInputString] = useState<string>('')
  const [error, setError] = useState<string | null>(null)

  /**
   * 現在の状態を文字列化してテキストボックスに設定
   */
  const handleSerialize = () => {
    try {
      const serialized = serializeState()
      setInputString(serialized)
      setError(null)
    } catch (e) {
      setError('状態の文字列化に失敗しました')
    }
  }

  /**
   * 文字列をクリップボードにコピー
   */
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(inputString)
      setError(null)
    } catch (e) {
      setError('クリップボードへのコピーに失敗しました')
    }
  }

  /**
   * 入力された文字列から状態を復元
   */
  const handleRestore = () => {
    try {
      const restored = deserializeState(inputString, fighters)
      onStateRestore(restored)
      setError(null)
    } catch (e) {
      setError('状態の復元に失敗しました')
    }
  }

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-white">
      <h3 className="text-lg font-bold">ビンゴカードの状態管理</h3>

      <div className="flex gap-2">
        <button
          onClick={handleSerialize}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          現在の状態を文字列化
        </button>
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={inputString}
          onChange={(e) => setInputString(e.target.value)}
          placeholder="状態の文字列を入力..."
          className="flex-1 px-4 py-2 border rounded"
        />
        <button
          onClick={handleCopy}
          disabled={!inputString}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors disabled:bg-gray-300"
        >
          コピー
        </button>
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleRestore}
          disabled={!inputString}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors disabled:bg-green-300"
        >
          状態を復元
        </button>
      </div>

      {error && <p className="text-red-500">{error}</p>}
    </div>
  )
}
