/**
 * ビンゴカードの状態を管理するカスタムフック
 * @description ファイターの抽出、ファイターの選択、ファイターの削除、ダッシュファイターの除外、DLCファイターの除外、ビンゴカードの状態のシリアライズ、ビンゴカードの状態のデシリアライズに関するロジックを管理するカスタムフック
 */

import { useState } from 'react'

import { useFighters } from './useFighters'
import { BingoState } from './useSerializeBingoState'

import type { Fighter, FightersData } from '~/features/bingo/types/fighter'

import { SerializedBingoState } from '~/features/bingo/types/bingo'
import { getRandomElements, shuffleArray } from '~/features/bingo/utils'

/**
 * ビンゴカードの状態を管理するカスタムフック
 * 提供する機能
 * - ファイターの抽出
 * - ファイターの選択
 * - ファイターの削除
 * - ダッシュファイターの除外
 * - DLCファイターの除外
 * - ビンゴカードの状態のシリアライズ
 * - ビンゴカードの状態のデシリアライズ
 * @returns ビンゴカードの状態に関する状態と関数
 */
export const useBingoCard = () => {
  // 状態管理
  // - ビンゴカードに配置されたファイターとそのアクティブ状態
  // - 必ず含めるファイター・除外するファイター
  // - ビンゴカードの状態とその状態をシリアライズした文字列
  const {
    fighters,
    isLoading: isLoadingFighters,
    error: errorFighters,
  } = useFighters()
  const [selectedFighters, setSelectedFighters] = useState<Array<Fighter>>([])
  const [activeFighters, setActiveFighters] = useState<Set<string>>(new Set())
  const [mustIncludeFighters, setMustIncludeFighters] = useState<
    Array<Fighter>
  >([])
  const [excludeFighters, setExcludeFighters] = useState<Array<Fighter>>([])
  const [isExcludeDashFighters, setIsExcludeDashFighters] =
    useState<boolean>(false)
  const [isExcludeDlcFighters, setIsExcludeDlcFighters] =
    useState<boolean>(false)
  const [stateString, setStateString] = useState<string>('')
  const [currentState, setCurrentState] = useState<BingoState | null>(null)

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
    setActiveFighters(new Set()) // アクティブ状態をリセット
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
   * ビンゴカードの状態を文字列に変換する
   */
  const serializeState = (): string => {
    if (!currentState) {
      setStateString('')
      return ''
    }
    const state: SerializedBingoState = {
      s: currentState.selectedFighters.map((f) => f.fighterId),
      m: currentState.mustIncludeFighters.map((f) => f.fighterId),
      e: currentState.excludeFighters.map((f) => f.fighterId),
      d: currentState.isExcludeDashFighters,
      l: currentState.isExcludeDlcFighters,
      a: Array.from(currentState.activeFighters),
    }
    const serialized = btoa(JSON.stringify(state))
    setStateString(serialized)
    return serialized
  }

  /**
   * 文字列からビンゴカードの状態を復元する
   */
  const deserializeState = (
    stateString: string,
    fighters: FightersData,
  ): BingoState => {
    const state = JSON.parse(atob(stateString)) as SerializedBingoState
    const fightersArray = Object.values(fighters) as Array<Fighter>

    return {
      selectedFighters: state.s.map(
        (id) => fightersArray.find((f) => f.fighterId === id)!,
      ),
      mustIncludeFighters: state.m.map(
        (id) => fightersArray.find((f) => f.fighterId === id)!,
      ),
      excludeFighters: state.e.map(
        (id) => fightersArray.find((f) => f.fighterId === id)!,
      ),
      isExcludeDashFighters: state.d,
      isExcludeDlcFighters: state.l,
      activeFighters: new Set(state.a),
    }
  }

  return {
    fighters,
    isLoadingFighters,
    errorFighters,
    selectedFighters,
    mustIncludeFighters,
    excludeFighters,
    isExcludeDashFighters,
    isExcludeDlcFighters,
    stateString,
    activeFighters,
    extractFighters,
    addFighter,
    removeFighter,
    toggleDashFighterExclusion,
    toggleDlcFighterExclusion,
    handleFighterClick,
    serializeState,
    deserializeState,
  }
}
