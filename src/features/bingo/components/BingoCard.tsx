/**
 * ビンゴカードコンポーネント
 * @description ファイターのビンゴカードを表示するコンポーネント
 */

import { useState } from 'react'

import { BingoCardDisplay } from './BingoCardDisplay'
import { BingoSettingsModal } from './BingoCardForm'
import { BingoStateManager } from './BingoStateManager'
import { ConfirmModal } from './ConfirmModal'

import { BasicButton } from '~/components/Buttons/BasicButton'
import { useBingoCard } from '~/features/bingo/hooks/useBingoCard'
import { BingoState } from '~/features/bingo/hooks/useSerializeBingoState'

export const BingoCard = (): React.ReactNode => {
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false)
  const {
    fighters,
    isLoadingFighters,
    errorFighters,
    selectedFighters,
    mustIncludeFighters,
    excludeFighters,
    isExcludeDashFighters,
    isExcludeDlcFighters,
    activeFighters,
    extractFighters,
    addFighter,
    removeFighter,
    toggleDashFighterExclusion,
    toggleDlcFighterExclusion,
    handleFighterClick,
  } = useBingoCard()

  /**
   * 抽出ボタンのクリックハンドラー
   */
  const handleExtractClick = () => {
    if (selectedFighters.length > 0) {
      setIsConfirmModalOpen(true)
    } else {
      handleExtractFighters()
    }
  }

  /**
   * ランダムに25個のファイターを抽出する
   */
  const handleExtractFighters = () => {
    if (!fighters) return
    extractFighters(fighters)
    setIsConfirmModalOpen(false)
  }

  // /**
  //  * 状態を復元するハンドラー
  //  */
  // const handleStateRestore = (state: BingoState) => {
  //   if (!fighters) return

  //   // 除外設定を初期状態に戻す
  //   if (isExcludeDashFighters !== false) {
  //     toggleDashFighterExclusion()
  //   }
  //   if (isExcludeDlcFighters !== false) {
  //     toggleDlcFighterExclusion()
  //   }

  //   // 必須ファイターと除外ファイターをクリア
  //   mustIncludeFighters.forEach((fighter) =>
  //     removeFighter(fighter.fighterId, 'include'),
  //   )
  //   excludeFighters.forEach((fighter) =>
  //     removeFighter(fighter.fighterId, 'exclude'),
  //   )

  //   // 新しい状態を設定
  //   state.mustIncludeFighters.forEach((fighter) =>
  //     addFighter(fighter, 'include'),
  //   )
  //   state.excludeFighters.forEach((fighter) => addFighter(fighter, 'exclude'))

  //   // 除外設定を復元
  //   if (state.isExcludeDashFighters) {
  //     toggleDashFighterExclusion()
  //   }
  //   if (state.isExcludeDlcFighters) {
  //     toggleDlcFighterExclusion()
  //   }

  //   // 選択されたファイターを設定
  //   extractFighters(fighters, state.selectedFighters)

  //   // アクティブな状態を更新
  //   setActiveFighters(state.activeFighters)
  // }

  if (isLoadingFighters) {
    return <div>読み込み中...</div>
  }

  if (errorFighters) {
    return <div>エラーが発生しました: {errorFighters.message}</div>
  }

  if (!fighters) {
    return <div>ファイターデータが見つかりません</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">ビンゴカード</h1>
      <div className="flex flex-col items-center gap-4">
        <div className="flex gap-4">
          <BasicButton
            onClick={() => setIsSettingsModalOpen(true)}
            importance="secondary"
          >
            条件を設定する
          </BasicButton>
          <BasicButton onClick={handleExtractClick}>
            ビンゴカードを生成する
          </BasicButton>
        </div>

        <BingoCardDisplay
          selectedFighters={selectedFighters}
          activeFighters={activeFighters}
          onFighterClick={handleFighterClick}
        />

        {/* <BingoStateManager
          currentState={{
            selectedFighters,
            mustIncludeFighters,
            excludeFighters,
            isExcludeDashFighters,
            isExcludeDlcFighters,
            activeFighters,
          }}
          onStateRestore={handleStateRestore}
          fighters={fighters}
        /> */}

        <BingoSettingsModal
          isOpen={isSettingsModalOpen}
          onClose={() => setIsSettingsModalOpen(false)}
          fighters={fighters}
          mustIncludeFighters={mustIncludeFighters}
          excludeFighters={excludeFighters}
          isExcludeDashFighters={isExcludeDashFighters}
          isExcludeDlcFighters={isExcludeDlcFighters}
          addFighter={addFighter}
          removeFighter={removeFighter}
          toggleDashFighterExclusion={toggleDashFighterExclusion}
          toggleDlcFighterExclusion={toggleDlcFighterExclusion}
        />

        <ConfirmModal
          isOpen={isConfirmModalOpen}
          onConfirm={handleExtractFighters}
          onCancel={() => setIsConfirmModalOpen(false)}
        />
      </div>
    </div>
  )
}
