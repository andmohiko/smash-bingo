/**
 * ビンゴカードのフォームコンポーネント
 * @description ファイターの選択と抽出のためのフォーム
 */

import { FighterSelector } from './FighterSelector'

import type { Fighter, FightersData } from '~/features/bingo/types/fighter'

import { Checkbox } from '~/components/Inputs/Checkbox'

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
        type="include"
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
        type="exclude"
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
