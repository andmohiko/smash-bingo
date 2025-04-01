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
    stateString,
    extractFighters,
    addFighter,
    removeFighter,
    toggleDashFighterExclusion,
    toggleDlcFighterExclusion,
    handleFighterClick,
    setStateString,
    onSerializeState,
    onStateRestore,
    bingoStateError,
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
      <h1 className="text-3xl font-bold mb-8 text-center">
        スマンゴ - スマブラビンゴツール
      </h1>
      <div className="flex flex-col items-center gap-8">
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

        <BingoStateManager
          stateString={stateString}
          onChangeStateString={setStateString}
          onSerializeState={onSerializeState}
          onStateRestore={onStateRestore}
          bingoStateError={bingoStateError}
        />

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
