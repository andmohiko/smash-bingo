/**
 * ビンゴカードのフォームコンポーネント
 * @description ファイターの選択と抽出のためのフォーム
 */

import { FighterSelector } from './FighterSelector'

import type { Fighter, FightersData } from '~/features/bingo/types/fighter'

import { BasicButton } from '~/components/Buttons/BasicButton'
import { Checkbox } from '~/components/Inputs/Checkbox'
import { BaseModal } from '~/components/Modals/BaseModal'

type Props = {
  isOpen: boolean
  onClose: () => void
  fighters: FightersData
  mustIncludeFighters: Array<Fighter>
  excludeFighters: Array<Fighter>
  isExcludeDashFighters: boolean
  isExcludeDlcFighters: boolean
  addFighter: (fighter: Fighter, type: 'include' | 'exclude') => void
  removeFighter: (fighterId: string, type: 'include' | 'exclude') => void
  toggleDashFighterExclusion: () => void
  toggleDlcFighterExclusion: () => void
}

export const BingoSettingsModal = ({
  isOpen,
  onClose,
  fighters,
  mustIncludeFighters,
  excludeFighters,
  isExcludeDashFighters,
  isExcludeDlcFighters,
  addFighter,
  removeFighter,
  toggleDashFighterExclusion,
  toggleDlcFighterExclusion,
}: Props): React.ReactNode => {
  const fightersArray = Object.values(fighters)

  return (
    <BaseModal isOpen={isOpen} onClose={onClose}>
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

        <BasicButton onClick={onClose}>保存する</BasicButton>
      </div>
    </BaseModal>
  )
}
