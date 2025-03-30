/**
 * ファイター抽出カスタムフック
 * @description ファイターの抽出に関するロジックを管理するカスタムフック
 */

import { useState } from 'react'

import type { Fighter, FightersData } from '~/features/bingo/types/fighter'

/**
 * 配列をシャッフルする
 * @param array - 対象の配列
 * @returns シャッフルされた配列
 */
const shuffleArray = <T extends object>(array: Array<T>): Array<T> => {
  return [...array].sort(() => 0.5 - Math.random())
}

/**
 * 配列からランダムに指定数の要素を抽出する
 * @param array - 対象の配列
 * @param count - 抽出する要素の数
 * @returns ランダムに抽出された要素の配列
 */
const getRandomElements = <T extends object>(
  array: Array<T>,
  count: number,
): Array<T> => {
  // 要素をランダムに並び替え
  const shuffled = shuffleArray(array)
  // 先頭からcount個の要素を抽出
  return shuffled.slice(0, count)
}

/**
 * ファイター抽出カスタムフック
 * @returns ファイター抽出に関する状態と関数
 */
export const useFighterExtraction = () => {
  const [selectedFighters, setSelectedFighters] = useState<Array<Fighter>>([])
  const [mustIncludeFighters, setMustIncludeFighters] = useState<
    Array<Fighter>
  >([])
  const [excludeFighters, setExcludeFighters] = useState<Array<Fighter>>([])
  const [isExcludeDashFighters, setIsExcludeDashFighters] =
    useState<boolean>(false)
  const [isExcludeDlcFighters, setIsExcludeDlcFighters] =
    useState<boolean>(false)

  /**
   * ランダムに25個のファイターを抽出する
   * @param fighters - ファイターデータ
   */
  const extractFighters = (fighters: FightersData) => {
    const bingoCardSize = 5 * 5
    let fighterPool = Object.values(fighters) as Array<Fighter>
    const selectedFightersArray: Array<Fighter> = []

    // 必ず含めるファイターを追加
    mustIncludeFighters.forEach((fighter) => {
      selectedFightersArray.push(fighter)
    })
    // すべてのファイターから選択済みのファイターを除外したプールを作成する
    fighterPool = fighterPool.filter(
      (fighter) => !selectedFightersArray.includes(fighter),
    )
    // 除外するファイターを除外したプールを作成する
    fighterPool = fighterPool.filter(
      (fighter) => !excludeFighters.includes(fighter),
    )

    // DLCファイターを除外する場合
    if (isExcludeDlcFighters) {
      fighterPool = fighterPool.filter((fighter) => !fighter.isDlc)
    }

    // ダッシュファイターを除外する場合
    if (isExcludeDashFighters) {
      // fighterPoolの中からselectedFightersArrayと同じnumberのファイターを除外する
      selectedFightersArray.forEach((selectedFighter) => {
        if (selectedFighter.hasDashFighter) {
          fighterPool = fighterPool.filter(
            (fighter) => fighter.number !== selectedFighter.number,
          )
        }
      })
      // fighterPoolをシャッフルし、fighterPoolの中に同じnumberのファイターがいれば前者を除外する
      const processedNumbers: Set<number> = new Set()
      fighterPool = shuffleArray(fighterPool)
      fighterPool = fighterPool.filter((fighter) => {
        if (processedNumbers.has(fighter.number)) {
          return false
        }
        processedNumbers.add(fighter.number)
        return true
      })
    }

    // 抽出するファイターの数を計算する
    const extractFightersCount = bingoCardSize - selectedFightersArray.length

    // 抽出するファイターをランダムに選択する
    const extractedFighters = getRandomElements(
      fighterPool,
      extractFightersCount,
    )
    // 選択済みのファイターと抽出したファイターを結合し、シャッフルする
    const combinedFighters = [...selectedFightersArray, ...extractedFighters]
    const shuffledFighters = shuffleArray(combinedFighters)

    // シャッフルしたファイターを選択済みのファイターとして設定する
    setSelectedFighters(shuffledFighters)
  }

  /**
   * ファイターを選択リストに追加する
   * @param fighter - 追加するファイター
   * @param type - 追加するタイプ（'include' | 'exclude'）
   */
  const addFighter = (fighter: Fighter, type: 'include' | 'exclude') => {
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
  const removeFighter = (fighterId: string, type: 'include' | 'exclude') => {
    const setState =
      type === 'include' ? setMustIncludeFighters : setExcludeFighters
    setState((prev) => prev.filter((f) => f.fighterId !== fighterId))
  }

  /**
   * ダッシュファイターを除外するかどうかを切り替える
   */
  const toggleDashFighterExclusion = () => {
    setIsExcludeDashFighters((prev) => !prev)
  }

  /**
   * DLCファイターを除外するかどうかを切り替える
   */
  const toggleDlcFighterExclusion = () => {
    setIsExcludeDlcFighters((prev) => !prev)
  }

  return {
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
  }
}
