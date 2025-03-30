/**
 * ビンゴカードコンポーネント
 * @description ファイターのビンゴカードを表示するコンポーネント
 */

import { useEffect, useState } from 'react'

import Image from 'next/image'

interface Fighter {
  fighterId: string
  icon: string
  isDashFighter: boolean
  name: string
  nickname: string
  name_en: string
  number: number
  parent: string | null
  child: string | null
}

interface FightersData {
  [key: string]: Fighter
}

/**
 * 配列からランダムに指定数の要素を抽出する
 * @param array - 対象の配列
 * @param count - 抽出する要素の数
 * @param mustInclude - 必ず含める要素の配列
 * @param exclude - 除外する要素の配列
 * @returns ランダムに抽出された要素の配列
 */
const getRandomElements = <T extends object>(
  array: Array<T>,
  count: number,
  mustInclude: Array<T> = [],
  exclude: Array<T> = [],
): Array<T> => {
  // 必ず含める要素と除外する要素を除外した配列を作成
  const remainingArray = array.filter(
    (item) =>
      !mustInclude.some((include) => include === item) &&
      !exclude.some((exclude) => exclude === item),
  )

  // 残りの要素をランダムに並び替え
  const shuffled = [...remainingArray].sort(() => 0.5 - Math.random())

  // 必ず含める要素をランダムな位置に挿入
  const result = [...shuffled.slice(0, count - mustInclude.length)]
  mustInclude.forEach((item) => {
    const insertIndex = Math.floor(Math.random() * (result.length + 1))
    result.splice(insertIndex, 0, item)
  })

  return result
}

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
  const [selectedFighters, setSelectedFighters] = useState<Array<Fighter>>([])
  const [activeFighters, setActiveFighters] = useState<Set<string>>(new Set())
  const [mustIncludeFighters, setMustIncludeFighters] = useState<
    Array<Fighter>
  >([])
  const [excludeFighters, setExcludeFighters] = useState<Array<Fighter>>([])

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

    const fightersArray = Object.values(fighters) as Array<Fighter>
    const randomFighters = getRandomElements(
      fightersArray,
      25,
      mustIncludeFighters,
      excludeFighters,
    )
    setSelectedFighters(randomFighters)
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

  /**
   * ファイターを選択リストに追加する
   * @param fighter - 追加するファイター
   * @param type - 追加するタイプ（'include' | 'exclude'）
   */
  const handleAddFighter = (fighter: Fighter, type: 'include' | 'exclude') => {
    const targetState =
      type === 'include' ? mustIncludeFighters : excludeFighters
    const setState =
      type === 'include' ? setMustIncludeFighters : setExcludeFighters

    if (!targetState.some((f) => f.fighterId === fighter.fighterId)) {
      setState((prev) => [...prev, fighter])
    }
  }

  /**
   * ファイターを選択リストから削除する
   * @param fighterId - 削除するファイターのID
   * @param type - 削除するタイプ（'include' | 'exclude'）
   */
  const handleRemoveFighter = (
    fighterId: string,
    type: 'include' | 'exclude',
  ) => {
    const setState =
      type === 'include' ? setMustIncludeFighters : setExcludeFighters
    setState((prev) => prev.filter((f) => f.fighterId !== fighterId))
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
                  onRemove={() =>
                    handleRemoveFighter(fighter.fighterId, 'include')
                  }
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
                    handleAddFighter(selected, 'include')
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
                  onRemove={() =>
                    handleRemoveFighter(fighter.fighterId, 'exclude')
                  }
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
                    handleAddFighter(selected, 'exclude')
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
