/**
 * ファイター抽出カスタムフック
 * @description ファイターの抽出に関するロジックを管理するカスタムフック
 */

import { useState } from 'react'

import type { Fighter, FightersData } from '~/features/bingo/types/fighter'

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
 * ファイター抽出カスタムフック
 * @returns ファイター抽出に関する状態と関数
 */
export const useFighterExtraction = () => {
  const [selectedFighters, setSelectedFighters] = useState<Array<Fighter>>([])
  const [mustIncludeFighters, setMustIncludeFighters] = useState<
    Array<Fighter>
  >([])
  const [excludeFighters, setExcludeFighters] = useState<Array<Fighter>>([])
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

    // 抽出するファイターの数を計算する
    const extractFightersCount = bingoCardSize - selectedFightersArray.length

    // 抽出するファイターをランダムに選択する
    const extractedFighters = getRandomElements(
      fighterPool,
      extractFightersCount,
    )
    // 選択済みのファイターと抽出したファイターを結合し、シャッフルする
    const combinedFighters = [...selectedFightersArray, ...extractedFighters]
    const shuffledFighters = combinedFighters.sort(() => 0.5 - Math.random())

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

  return {
    selectedFighters,
    mustIncludeFighters,
    excludeFighters,
    extractFighters,
    addFighter,
    removeFighter,
  }
}
