/**
 * ビンゴルームのフォームコンポーネント
 * @description ビンゴルームのパスコードの入力と保存
 */

import { useState } from 'react'

import { BasicButton } from '~/components/Buttons/BasicButton'
import { TextInput } from '~/components/Inputs/TextInput'
import { BaseModal } from '~/components/Modals/BaseModal'

type Props = {
  isOpen: boolean
  onClose: () => void
  title: string
  currentPasscode: string | null
  onSubmit: (passcode: string) => void
}

export const BingoRoomForm = ({
  isOpen,
  onClose,
  title,
  currentPasscode,
  onSubmit,
}: Props): React.ReactNode => {
  const [passcode, setPasscode] = useState<string>(currentPasscode ?? '')
  const handleSubmit = () => {
    if (passcode) {
      onSubmit(passcode)
      onClose()
    }
  }

  return (
    <BaseModal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col gap-4 mb-8 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-8 text-center">{title}</h1>
        <TextInput
          placeholder="パスコードを入力"
          value={passcode}
          onChange={(e) => setPasscode(e.target.value)}
        />

        <BasicButton onClick={handleSubmit}>{title}</BasicButton>
      </div>
    </BaseModal>
  )
}
