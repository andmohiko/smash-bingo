import { Fighter } from '~/features/bingo/types/fighter'

/**
 * ファイターの選択コンポーネント
 * @param placeholder - ラベル
 * @param fighters - ファイターのリスト
 * @param selectedFighters - 選択されたファイターのリスト
 * @param onAdd - ファイターを追加する時のコールバック関数
 * @param onRemove - ファイターを削除する時のコールバック関数
 * @param type - ファイターのタイプ（'include' | 'exclude'）
 */
export const FighterSelector = ({
  placeholder,
  fighters,
  selectedFighters,
  onAdd,
  onRemove,
  type,
}: {
  placeholder: string
  fighters: Array<Fighter>
  selectedFighters: Array<Fighter>
  onAdd: (fighter: Fighter) => void
  onRemove: (fighterId: string, type: 'include' | 'exclude') => void
  type: 'include' | 'exclude'
}) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-2">
        {selectedFighters.map((fighter) => (
          <SelectedFighterTag
            key={fighter.fighterId}
            fighter={fighter}
            onRemove={() => onRemove(fighter.fighterId, type)}
            variant={type}
          />
        ))}
      </div>
      <div className="flex gap-4">
        <select
          onChange={(e) => {
            const selected = fighters.find(
              (f) => f.fighterId === e.target.value,
            )
            if (selected) {
              onAdd(selected)
              e.target.value = ''
            }
          }}
          className="px-4 py-2 border rounded-lg flex-1"
        >
          <option value="">{placeholder}</option>
          {fighters.map((fighter) => (
            <option key={fighter.fighterId} value={fighter.fighterId}>
              {fighter.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}

/**
 * 選択されたファイターのタグコンポーネント
 * @description 選択されたファイターを表示するタグUI
 * @param fighter - 表示するファイターの情報
 * @param onRemove - タグを削除する時のコールバック関数
 * @param variant - タグのバリアント（'include' | 'exclude'）
 */
const SelectedFighterTag = ({
  fighter,
  onRemove,
  variant = 'include',
}: {
  fighter: Fighter
  onRemove: () => void
  variant?: 'include' | 'exclude'
}) => {
  const colors = {
    include: {
      bg: 'bg-gradient-to-r from-blue-50 to-blue-100',
      border: 'border-blue-200',
      text: 'text-blue-600',
      hover: 'hover:from-blue-100 hover:to-blue-200',
      button: 'bg-blue-100 text-blue-500 hover:bg-blue-200',
    },
    exclude: {
      bg: 'bg-gradient-to-r from-red-50 to-red-100',
      border: 'border-red-200',
      text: 'text-red-600',
      hover: 'hover:from-red-100 hover:to-red-200',
      button: 'bg-red-100 text-red-500 hover:bg-red-200',
    },
  }

  const style = colors[variant]

  return (
    <div
      className={`
        inline-flex items-center
        rounded-full border
        ${style.bg} ${style.border} ${style.hover}
        shadow-sm
        transition-all duration-200 ease-in-out
        animate-fadeIn
      `}
      style={{
        padding: '2px 8px',
      }}
    >
      <span className={`${style.text} text-sm font-medium`}>
        {fighter.name}
      </span>
      <button
        onClick={onRemove}
        className={`
          ${style.button}
          w-5 h-5
          flex items-center justify-center
          rounded-full
          text-xs font-bold
          transition-colors duration-200
        `}
      >
        ×
      </button>
    </div>
  )
}
