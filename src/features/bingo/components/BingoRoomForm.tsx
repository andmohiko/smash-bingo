/**
 * ビンゴルームのフォームコンポーネント
 * @description ビンゴルームのパスコードの入力と保存
 */

import { BasicButton } from '~/components/Buttons/BasicButton'
import { TextInput } from '~/components/Inputs/TextInput'
import { BaseModal } from '~/components/Modals/BaseModal'

type Props = {
  isOpen: boolean
  onClose: () => void
  title: string
  passcode: string | null
  setPasscode: (passcode: string) => void
}

export const BingoRoomForm = ({
  isOpen,
  onClose,
  title,
  passcode,
  setPasscode,
}: Props): React.ReactNode => {
  return (
    <BaseModal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col gap-4 mb-8 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-8 text-center">{title}</h1>
        <TextInput
          placeholder="パスコードを入力"
          value={passcode ?? ''}
          onChange={(e) => setPasscode(e.target.value)}
        />

        <BasicButton onClick={onClose}>{title}</BasicButton>
      </div>
    </BaseModal>
  )
}
