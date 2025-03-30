/**
 * チェックボックスのコンポーネント
 * @param id - チェックボックスのID
 * @param isChecked - チェックボックスの状態
 * @param onChange - チェックボックスの状態を変更する時のコールバック関数
 * @param label - チェックボックスのラベル
 */
export const Checkbox = ({
  id,
  isChecked,
  onChange,
  label,
}: {
  id: string
  isChecked: boolean
  onChange: (isChecked: boolean) => void
  label: string
}) => {
  return (
    <div className="flex items-center gap-2">
      <input
        id={id}
        type="checkbox"
        checked={isChecked}
        onChange={(e) => onChange(e.target.checked)}
        className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
      />
      <label htmlFor={id} className="text-sm text-gray-700 cursor-pointer">
        {label}
      </label>
    </div>
  )
}
