import { useState } from 'react'

import { BingoCard } from './BingoCard'
import { BingoRoomController } from './BingoRoomController'
import { ConfirmModal } from './ConfirmModal'

import { BasicButton } from '~/components/Buttons/BasicButton'
import { useBingoRoom } from '~/features/bingo/hooks/useBingoRoom'
import { useDisclosure } from '~/hooks/useDisclosure'

/**
 * ビンゴカードコンテナコンポーネント
 * @description 複数のビンゴカードを管理するコンポーネント
 */
export const BingoCardContainer = () => {
  const [cardCount, setCardCount] = useState<1 | 2>(1)
  const [isConfirmModalOpen, confirmModalHandlers] = useDisclosure()
  const { passcode, createRoom, joinRoom } = useBingoRoom()

  const handleAddCard = () => {
    setCardCount(2)
  }

  const handleRemoveCardClick = () => {
    confirmModalHandlers.onOpen()
  }

  const handleRemoveCardConfirm = () => {
    setCardCount(1)
    confirmModalHandlers.onClose()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold mb-8 text-center">
          スマンゴ - スマブラビンゴツール
        </h1>
        <BingoRoomController
          passcode={passcode}
          createRoom={createRoom}
          joinRoom={joinRoom}
        />
      </div>

      <div className="flex flex-wrap gap-8 justify-center">
        {/* 1枚目のカード */}
        <div className="flex-1 min-w-[320px] max-w-[640px]">
          <BingoCard />
        </div>

        {cardCount === 1 && (
          <BasicButton
            onClick={handleAddCard}
            importance="secondary"
            leftIcon={
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            }
          >
            <span>カードを追加</span>
          </BasicButton>
        )}

        {/* 2枚目のカード */}
        {cardCount === 2 && (
          <div className="flex-1 min-w-[320px] max-w-[640px]">
            <BingoCard />
          </div>
        )}

        {cardCount === 2 && (
          <BasicButton
            onClick={handleRemoveCardClick}
            importance="secondary"
            leftIcon={
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            }
          >
            <span>2枚目のカードを削除</span>
          </BasicButton>
        )}
      </div>

      {/* 削除確認モーダル */}
      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onConfirm={handleRemoveCardConfirm}
        onCancel={confirmModalHandlers.onClose}
        message="2枚目のビンゴカードを削除してもよろしいですか？この操作は取り消せません。"
        confirmText="削除する"
        cancelText="キャンセル"
      />
    </div>
  )
}
