/**
 * ビンゴルームの作成モーダル
 * @description ビンゴルームの作成
 */

import { BasicButton } from '~/components/Buttons/BasicButton'
import { BaseModal } from '~/components/Modals/BaseModal'

type Props = {
  isOpen: boolean
  onClose: () => void
  title: string
  onCreateRoom: () => void
}

export const BingoRoomCreateModal = ({
  isOpen,
  onClose,
  title,
  onCreateRoom,
}: Props): React.ReactNode => {
  const handleSubmit = () => {
    onCreateRoom()
    onClose()
  }

  return (
    <BaseModal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col gap-4 mb-8 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-8 text-center">{title}</h1>
        <BasicButton onClick={handleSubmit}>{title}</BasicButton>
      </div>
    </BaseModal>
  )
}
