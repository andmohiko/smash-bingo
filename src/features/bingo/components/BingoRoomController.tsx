/**
 * ビンゴルームの入室・作成を行うコンポーネント
 */

import { BingoRoomForm } from './BingoRoomForm'

import { BasicButton } from '~/components/Buttons/BasicButton'
import { useDisclosure } from '~/hooks/useDisclosure'

type Props = {
  passcode: string | null
  createRoom: (passcode: string) => void
  joinRoom: (passcode: string) => void
}

export const BingoRoomController = ({
  passcode,
  createRoom,
  joinRoom,
}: Props) => {
  const [isJoinRoomModalOpen, joinRoomModalHandlers] = useDisclosure()
  const [isCreateRoomModalOpen, createRoomModalHandlers] = useDisclosure()

  return (
    <div className="flex gap-2">
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
        passcode={passcode}
        setPasscode={createRoom}
      />

      {/* ビンゴルーム作成モーダル */}
      <BingoRoomForm
        isOpen={isCreateRoomModalOpen}
        onClose={createRoomModalHandlers.onClose}
        title="部屋を作成する"
        passcode={passcode}
        setPasscode={joinRoom}
      />
    </div>
  )
}
