/**
 * テキスト入力コンポーネント
 * @description テキスト入力を行うコンポーネント
 */

type Props = {
  placeholder: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export const TextInput = ({ placeholder, value, onChange }: Props) => {
  return (
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="flex-1 px-4 py-2 border border-gray-300 rounded-md"
    />
  )
}
