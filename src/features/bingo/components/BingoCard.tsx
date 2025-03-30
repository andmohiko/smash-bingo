/**
 * ビンゴカードコンポーネント
 * @description ファイターのビンゴカードを表示するコンポーネント
 */

import { useEffect, useState } from 'react'

import { BingoCardDisplay } from './BingoCardDisplay'
import { BingoCardForm } from './BingoCardForm'

import type { FightersData } from '~/features/bingo/types/fighter'

import { useFighterExtraction } from '~/features/bingo/hooks/useFighterExtraction'

export const BingoCard = (): React.ReactNode => {
  const [fighters, setFighters] = useState<FightersData | null>(null)
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

  useEffect(() => {
    const fetchFighters = async () => {
      try {
        const response = await fetch('/fighters/fighters.json')
        if (!response.ok) {
          throw new Error('ファイターデータの取得に失敗しました')
        }
        const data = await response.json()
        setFighters(data)
      } catch (error) {
        console.error('エラーが発生しました:', error)
      }
    }

    fetchFighters()
  }, [])

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

  if (!fighters) {
    return <div>読み込み中...</div>
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
