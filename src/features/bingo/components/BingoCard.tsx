/**
 * ビンゴカードコンポーネント
 * @description ファイターのビンゴカードを表示するコンポーネント
 */

import { useEffect, useState } from 'react'

import Image from 'next/image'

import type { Fighter, FightersData } from '~/features/bingo/types/fighter'

import { useFighterExtraction } from '~/features/bingo/hooks/useFighterExtraction'

/**
 * ファイターカードコンポーネント
 * @param fighter - 表示するファイターの情報
 * @param isActive - カードがアクティブかどうか
 * @param onClick - クリック時のコールバック関数
 */
const FighterCard = ({
  fighter,
  isActive,
  onClick,
}: {
  fighter: Fighter
  isActive: boolean
  onClick: () => void
}) => {
  return (
    <div
      className={`relative aspect-square rounded-lg shadow-md p-2 transition-all cursor-pointer ${
        isActive ? 'bg-blue-900' : 'bg-white hover:bg-blue-200'
      }`}
      onClick={onClick}
    >
      <div className="relative w-full h-full">
        <Image
          src={`/fighters/${fighter.icon}`}
          alt={fighter.name}
          fill
          className="object-contain"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
    </div>
  )
}

/**
 * 選択されたファイターのタグコンポーネント
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

export const BingoCard = (): React.ReactNode => {
  const [fighters, setFighters] = useState<FightersData | null>(null)
  const [activeFighters, setActiveFighters] = useState<Set<string>>(new Set())
  const {
    selectedFighters,
    mustIncludeFighters,
    excludeFighters,
    extractFighters,
    addFighter,
    removeFighter,
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

  const fightersArray = Object.values(fighters)

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">ビンゴカード</h1>
      <div className="flex flex-col items-center">
        <div className="flex flex-col gap-4 mb-8 w-full max-w-md">
          <div className="flex flex-col gap-2">
            <div className="flex flex-wrap gap-2">
              {mustIncludeFighters.map((fighter) => (
                <SelectedFighterTag
                  key={fighter.fighterId}
                  fighter={fighter}
                  onRemove={() => removeFighter(fighter.fighterId, 'include')}
                  variant="include"
                />
              ))}
            </div>
            <div className="flex gap-4">
              <select
                onChange={(e) => {
                  const selected = fightersArray.find(
                    (f) => f.fighterId === e.target.value,
                  )
                  if (selected) {
                    addFighter(selected, 'include')
                    e.target.value = '' // セレクトボックスをリセット
                  }
                }}
                className="px-4 py-2 border rounded-lg flex-1"
              >
                <option value="">必ず含めるファイターを選択</option>
                {fightersArray
                  .filter(
                    (fighter) =>
                      !mustIncludeFighters.some(
                        (f) => f.fighterId === fighter.fighterId,
                      ) &&
                      !excludeFighters.some(
                        (f) => f.fighterId === fighter.fighterId,
                      ),
                  )
                  .sort((a, b) => a.number - b.number)
                  .map((fighter) => (
                    <option key={fighter.fighterId} value={fighter.fighterId}>
                      {fighter.name}
                    </option>
                  ))}
              </select>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex flex-wrap gap-2">
              {excludeFighters.map((fighter) => (
                <SelectedFighterTag
                  key={fighter.fighterId}
                  fighter={fighter}
                  onRemove={() => removeFighter(fighter.fighterId, 'exclude')}
                  variant="exclude"
                />
              ))}
            </div>
            <div className="flex gap-4">
              <select
                onChange={(e) => {
                  const selected = fightersArray.find(
                    (f) => f.fighterId === e.target.value,
                  )
                  if (selected) {
                    addFighter(selected, 'exclude')
                    e.target.value = '' // セレクトボックスをリセット
                  }
                }}
                className="px-4 py-2 border rounded-lg flex-1"
              >
                <option value="">除外するファイターを選択</option>
                {fightersArray
                  .filter(
                    (fighter) =>
                      !mustIncludeFighters.some(
                        (f) => f.fighterId === fighter.fighterId,
                      ) &&
                      !excludeFighters.some(
                        (f) => f.fighterId === fighter.fighterId,
                      ),
                  )
                  .sort((a, b) => a.number - b.number)
                  .map((fighter) => (
                    <option key={fighter.fighterId} value={fighter.fighterId}>
                      {fighter.name}
                    </option>
                  ))}
              </select>
            </div>
          </div>
          <button
            onClick={handleExtractFighters}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            25個のファイターを抽出
          </button>
        </div>
        {selectedFighters.length > 0 && (
          <div className="grid grid-cols-5 gap-2 max-w-md w-full">
            {selectedFighters.map((fighter) => (
              <FighterCard
                key={fighter.fighterId}
                fighter={fighter}
                isActive={activeFighters.has(fighter.fighterId)}
                onClick={() => handleFighterClick(fighter.fighterId)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
