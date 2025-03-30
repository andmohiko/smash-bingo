/**
 * ビンゴカードコンポーネント
 * @description ファイターのビンゴカードを表示するコンポーネント
 */

import { useState } from 'react'

import { BingoCardDisplay } from './BingoCardDisplay'
import { BingoCardForm } from './BingoCardForm'

import { useFighterExtraction } from '~/features/bingo/hooks/useFighterExtraction'
import { useFighters } from '~/features/bingo/hooks/useFighters'

export const BingoCard = (): React.ReactNode => {
  const { fighters, error, isLoading } = useFighters()
  const [activeFighters, setActiveFighters] = useState<Set<string>>(new Set())
  const {
    selectedFighters,
    mustIncludeFighters,
    excludeFighters,
    isExcludeDashFighters,
    isExcludeDlcFighters,
    extractFighters,
    addFighter,
    removeFighter,
    toggleDashFighterExclusion,
    toggleDlcFighterExclusion,
  } = useFighterExtraction()

  /**
   * ランダムに25個のファイターを抽出する
   */
  const handleExtractFighters = () => {
    if (!fighters) return
    extractFighters(fighters)
    setActiveFighters(new Set()) // アクティブ状態をリセット
  }

  /**
   * ファイターカードのクリックハンドラー
   * @param fighterId - クリックされたファイターのID
   */
  const handleFighterClick = (fighterId: string) => {
    setActiveFighters((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(fighterId)) {
        newSet.delete(fighterId)
      } else {
        newSet.add(fighterId)
      }
      return newSet
    })
  }

  if (isLoading) {
    return <div>読み込み中...</div>
  }

  if (error) {
    return <div>エラーが発生しました: {error.message}</div>
  }

  if (!fighters) {
    return <div>ファイターデータが見つかりません</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">ビンゴカード</h1>
      <div className="flex flex-col items-center">
        <BingoCardForm
          fighters={fighters}
          mustIncludeFighters={mustIncludeFighters}
          excludeFighters={excludeFighters}
          isExcludeDashFighters={isExcludeDashFighters}
          isExcludeDlcFighters={isExcludeDlcFighters}
          onExtract={handleExtractFighters}
          addFighter={addFighter}
          removeFighter={removeFighter}
          toggleDashFighterExclusion={toggleDashFighterExclusion}
          toggleDlcFighterExclusion={toggleDlcFighterExclusion}
        />

        <BingoCardDisplay
          selectedFighters={selectedFighters}
          activeFighters={activeFighters}
          onFighterClick={handleFighterClick}
        />
      </div>
    </div>
  )
}
