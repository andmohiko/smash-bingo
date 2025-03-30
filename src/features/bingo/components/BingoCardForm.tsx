/**
 * ビンゴカードのフォームコンポーネント
 * @description ファイターの選択と抽出のためのフォーム
 */

import type { Fighter, FightersData } from '~/features/bingo/types/fighter'

type Props = {
  fighters: FightersData
  mustIncludeFighters: Array<Fighter>
  excludeFighters: Array<Fighter>
  isExcludeDashFighters: boolean
  isExcludeDlcFighters: boolean
  onExtract: () => void
  addFighter: (fighter: Fighter, type: 'include' | 'exclude') => void
  removeFighter: (fighterId: string, type: 'include' | 'exclude') => void
  toggleDashFighterExclusion: () => void
  toggleDlcFighterExclusion: () => void
}

export const BingoCardForm = ({
  fighters,
  mustIncludeFighters,
  excludeFighters,
  isExcludeDashFighters,
  isExcludeDlcFighters,
  onExtract,
  addFighter,
  removeFighter,
  toggleDashFighterExclusion,
  toggleDlcFighterExclusion,
}: Props): React.ReactNode => {
  const fightersArray = Object.values(fighters)

  return (
    <div className="flex flex-col gap-4 mb-8 w-full max-w-md">
      <FighterSelector
        placeholder="必ず含めるファイターを選択"
        fighters={fightersArray
          .filter(
            (fighter) =>
              !mustIncludeFighters.some(
                (f) => f.fighterId === fighter.fighterId,
              ) &&
              !excludeFighters.some((f) => f.fighterId === fighter.fighterId),
          )
          .sort((a, b) => a.number - b.number)}
        selectedFighters={mustIncludeFighters}
        onAdd={(fighter) => addFighter(fighter, 'include')}
        onRemove={(fighterId) => removeFighter(fighterId, 'include')}
      />
      <FighterSelector
        placeholder="除外するファイターを選択"
        fighters={fightersArray
          .filter(
            (fighter) =>
              !mustIncludeFighters.some(
                (f) => f.fighterId === fighter.fighterId,
              ) &&
              !excludeFighters.some((f) => f.fighterId === fighter.fighterId),
          )
          .sort((a, b) => a.number - b.number)}
        selectedFighters={excludeFighters}
        onAdd={(fighter) => addFighter(fighter, 'exclude')}
        onRemove={(fighterId) => removeFighter(fighterId, 'exclude')}
      />

      {/* チェックボックス */}
      <div className="flex flex-col gap-2">
        <Checkbox
          id="excludeDashFighters"
          isChecked={isExcludeDashFighters}
          onChange={toggleDashFighterExclusion}
          label="ダッシュファイターを除外する"
        />
      </div>
      <div className="flex flex-col gap-2">
        <Checkbox
          id="isExcludeDlcFighters"
          isChecked={isExcludeDlcFighters}
          onChange={toggleDlcFighterExclusion}
          label="DLCファイターを除外する"
        />
      </div>

      <button
        onClick={onExtract}
        className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
      >
        25個のファイターを抽出
      </button>
    </div>
  )
}

/**
 * 選択されたファイターのタグコンポーネント
 * @param fighter - 表示するファイターの情報
 * @param onRemove - タグを削除する時のコールバック関数
 * @param variant - タグのバリアント（'include' | 'exclude'）
 */
export const SelectedFighterTag = ({
  fighter,
  onRemove,
  variant = 'include',
}: {
  fighter: Fighter
  onRemove: () => void
  variant?: 'include' | 'exclude'
}) => {
  const bgColor = variant === 'include' ? 'bg-blue-100' : 'bg-red-100'
  const textColor = variant === 'include' ? 'text-blue-600' : 'text-red-600'

  return (
    <div
      className={`flex items-center gap-2 ${bgColor} px-3 py-1 rounded-full`}
    >
      <span>{fighter.name}</span>
      <button onClick={onRemove} className={`${textColor} hover:opacity-80`}>
        ×
      </button>
    </div>
  )
}

/**
 * ファイターの選択コンポーネント
 * @param placeholder - ラベル
 * @param fighters - ファイターのリスト
 * @param selectedFighters - 選択されたファイターのリスト
 * @param onAdd - ファイターを追加する時のコールバック関数
 * @param onRemove - ファイターを削除する時のコールバック関数
 */
export const FighterSelector = ({
  placeholder,
  fighters,
  selectedFighters,
  onAdd,
  onRemove,
}: {
  placeholder: string
  fighters: Array<Fighter>
  selectedFighters: Array<Fighter>
  onAdd: (fighter: Fighter) => void
  onRemove: (fighterId: string, type: 'include' | 'exclude') => void
}) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-2">
        {selectedFighters.map((fighter) => (
          <SelectedFighterTag
            key={fighter.fighterId}
            fighter={fighter}
            onRemove={() => onRemove(fighter.fighterId, 'include')}
            variant="include"
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
