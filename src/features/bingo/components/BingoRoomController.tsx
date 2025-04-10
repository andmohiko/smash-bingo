/**
 * ビンゴルームの入室・作成を行うコンポーネント
 */

import { BingoRoomCreateModal } from './BingoRoomCreateModal'
import { BingoRoomForm } from './BingoRoomForm'

import { BasicButton } from '~/components/Buttons/BasicButton'
import { useDisclosure } from '~/hooks/useDisclosure'

type Props = {
  passcode: string | null
  createRoom: () => void
  joinRoom: (passcode: string) => void
}

/**
 * ビンゴルームの入室・作成を行うコンポーネント
 * @param passcode - ビンゴルームのパスコード
 * @param createRoom - ビンゴルームを作成する関数
 * @param joinRoom - ビンゴルームに参加する関数
 */
export const BingoRoomController = ({
  passcode,
  createRoom,
  joinRoom,
}: Props) => {
  const [isJoinRoomModalOpen, joinRoomModalHandlers] = useDisclosure()
  const [isCreateRoomModalOpen, createRoomModalHandlers] = useDisclosure()

  return (
    <div className="flex items-center gap-2">
      {/* パスコードを表示 */}
      <span className="text-sm text-gray-500">
        部屋コード: {passcode ? passcode : '未設定'}
      </span>

      <BasicButton
        onClick={joinRoomModalHandlers.onOpen}
        importance="secondary"
      >
        部屋に参加
      </BasicButton>
      <BasicButton onClick={createRoomModalHandlers.onOpen}>
        部屋を作成
      </BasicButton>

      {/* ビンゴルーム入室モーダル */}
      <BingoRoomForm
        isOpen={isJoinRoomModalOpen}
        onClose={joinRoomModalHandlers.onClose}
        title="部屋に参加する"
        currentPasscode={passcode}
        onSubmit={joinRoom}
      />

      {/* ビンゴルーム作成モーダル */}
      <BingoRoomCreateModal
        isOpen={isCreateRoomModalOpen}
        onClose={createRoomModalHandlers.onClose}
        title="部屋を作成する"
        onCreateRoom={createRoom}
      />
    </div>
  )
}
