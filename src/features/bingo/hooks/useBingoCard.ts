/**
 * ビンゴカードの状態を管理するカスタムフック
 * @description ファイターの抽出、ファイターの選択、ファイターの削除、ダッシュファイターの除外、DLCファイターの除外、ビンゴカードの状態のシリアライズ、ビンゴカードの状態のデシリアライズに関するロジックを管理するカスタムフック
 */

import { useEffect, useMemo, useState } from 'react'

import { useFighters } from './useFighters'
import { useSerializeBingoState } from './useSerializeBingoState'

import type { BingoState } from '~/features/bingo/types/bingo'
import type { Fighter, FightersData } from '~/features/bingo/types/fighter'

import { getRandomElements, shuffleArray } from '~/features/bingo/utils'
import { useBingoRoomContext } from '~/providers/BingoRoomProvider'

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
 * @param initialStateString - ビンゴカードの状態をシリアライズした文字列
 * @param onChange - ビンゴカードの状態が変更されたときにDBに新たな状態を保存するためのコールバック関数
 * @returns ビンゴカードの状態に関する状態と関数
 */
export const useBingoCard = (
  cardNumber: 1 | 2,
  onChange: (serializedState: string) => void,
) => {
  // 状態管理
  // - ビンゴカードに配置されたファイターとそのアクティブ状態
  // - 必ず含めるファイター・除外するファイター
  // - ビンゴカードの状態とその状態をシリアライズした文字列
  const {
    fighters,
    isLoading: isLoadingFighters,
    error: errorFighters,
  } = useFighters()
  const { room } = useBingoRoomContext()
  const remoteStateString = useMemo(() => {
    if (!room) return null
    if (cardNumber === 1) {
      return room.card1State
    } else if (cardNumber === 2) {
      return room.card2State
    }
    return null
  }, [room, cardNumber])
  const {
    localStateString,
    setLocalStateString,
    serializeState,
    deserializeState,
  } = useSerializeBingoState()
  const [selectedFighters, setSelectedFighters] = useState<Array<Fighter>>([])
  const [activeFighters, setActiveFighters] = useState<Set<string>>(new Set())
  const [usedFighters, setUsedFighters] = useState<Set<string>>(new Set())
  const [mustIncludeFighters, setMustIncludeFighters] = useState<
    Array<Fighter>
  >([])
  const [excludeFighters, setExcludeFighters] = useState<Array<Fighter>>([])
  const [isExcludeDashFighters, setIsExcludeDashFighters] =
    useState<boolean>(false)
  const [isExcludeDlcFighters, setIsExcludeDlcFighters] =
    useState<boolean>(false)
  const [currentState, setCurrentState] = useState<BingoState | null>(null)
  const [bingoStateError, setBingoStateError] = useState<string | null>(null)
  const [isExternalUpdate, setIsExternalUpdate] = useState<boolean>(false)

  // DBからの更新時にビンゴカードに反映する
  useEffect(() => {
    if (!remoteStateString || !fighters) {
      return
    }

    try {
      setIsExternalUpdate(true)
      const restoredState = deserializeState(remoteStateString, fighters)
      setSelectedFighters(restoredState.selectedFighters)
      setMustIncludeFighters(restoredState.mustIncludeFighters)
      setExcludeFighters(restoredState.excludeFighters)
      setIsExcludeDashFighters(restoredState.isExcludeDashFighters)
      setIsExcludeDlcFighters(restoredState.isExcludeDlcFighters)
      setActiveFighters(restoredState.activeFighters)
      setUsedFighters(restoredState.usedFighters)
      setCurrentState(restoredState)
      setBingoStateError(null)
    } catch (error) {
      setBingoStateError('状態の復元に失敗しました')
    }
  }, [remoteStateString, fighters, deserializeState, serializeState])

  // こちから状態を変更した際にonChangeに変更を伝える
  useEffect(() => {
    // 初期状態の読み込み時は発火させない
    if (!currentState) return

    const serializedString = serializeState({
      selectedFighters,
      mustIncludeFighters,
      excludeFighters,
      isExcludeDashFighters,
      isExcludeDlcFighters,
      activeFighters,
      usedFighters,
    })

    // DBからの変更により、ローカルの状態とDBの状態が合わないならDBの状態を更新する
    if (isExternalUpdate) {
      setIsExternalUpdate(false)
      return
    }

    if (serializedString !== remoteStateString) {
      onChange(serializedString)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    currentState,
    serializeState,
    selectedFighters,
    mustIncludeFighters,
    excludeFighters,
    isExcludeDashFighters,
    isExcludeDlcFighters,
    activeFighters,
    usedFighters,
  ])

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
    setUsedFighters(new Set()) // 使用済み状態をリセット

    // 現在の状態を更新
    const newState: BingoState = {
      selectedFighters: shuffledFighters,
      mustIncludeFighters,
      excludeFighters,
      isExcludeDashFighters,
      isExcludeDlcFighters,
      activeFighters: new Set(),
      usedFighters: new Set(),
    }
    setCurrentState(newState)
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
   * ファイターの現在の状態を判定する
   * @param fighterId - 判定するファイターのID
   * @returns ファイターの現在の状態
   */
  const getFighterState = (fighterId: string): 'none' | 'active' | 'used' => {
    if (activeFighters.has(fighterId)) {
      return 'active'
    }
    if (usedFighters.has(fighterId)) {
      return 'used'
    }
    return 'none'
  }

  /**
   * ファイターの次の状態を取得する
   * @param currentState - 現在の状態
   * @returns 次の状態
   */
  const getNextFighterState = (
    currentState: 'none' | 'active' | 'used',
  ): 'none' | 'active' | 'used' => {
    switch (currentState) {
      case 'none':
        return 'active'
      case 'active':
        return 'used'
      case 'used':
        return 'none'
      default:
        return 'none'
    }
  }

  /**
   * ファイターカードのクリックハンドラー
   * 無選択→アクティブ→使用済み→無選択の循環で状態を変更する
   * @param fighterId - クリックされたファイターのID
   */
  const handleFighterClick = (fighterId: string) => {
    const currentState = getFighterState(fighterId)
    const nextState = getNextFighterState(currentState)

    // アクティブ状態を更新
    setActiveFighters((prev) => {
      const newSet = new Set(prev)
      if (nextState === 'active') {
        newSet.add(fighterId)
      } else {
        newSet.delete(fighterId)
      }
      return newSet
    })

    // 使用済み状態を更新
    setUsedFighters((prev) => {
      const newSet = new Set(prev)
      if (nextState === 'used') {
        newSet.add(fighterId)
      } else {
        newSet.delete(fighterId)
      }
      return newSet
    })

    // 現在の状態を更新
    setCurrentState((prev) => {
      if (!prev) return null
      const newActiveFighters = new Set(prev.activeFighters)
      const newUsedFighters = new Set(prev.usedFighters)

      if (nextState === 'active') {
        newActiveFighters.add(fighterId)
        newUsedFighters.delete(fighterId)
      } else if (nextState === 'used') {
        newActiveFighters.delete(fighterId)
        newUsedFighters.add(fighterId)
      } else {
        newActiveFighters.delete(fighterId)
        newUsedFighters.delete(fighterId)
      }

      return {
        ...prev,
        activeFighters: newActiveFighters,
        usedFighters: newUsedFighters,
      }
    })
  }

  /**
   * ビンゴカードの状態をシリアライズする
   */
  const onSerializeState = () => {
    // 現在の状態を作成
    const state: BingoState = {
      selectedFighters,
      mustIncludeFighters,
      excludeFighters,
      isExcludeDashFighters,
      isExcludeDlcFighters,
      activeFighters,
      usedFighters,
    }
    // 現在の状態をシリアライズ
    const serializedString = serializeState(state)
    setCurrentState(state)
    return serializedString
  }

  /**
   * ビンゴカードの状態を復元する
   */
  const onStateRestore = () => {
    if (!localStateString || !fighters) return

    try {
      // 状態を復元
      const restoredState = deserializeState(localStateString, fighters)

      // 各状態を更新
      setSelectedFighters(restoredState.selectedFighters)
      setMustIncludeFighters(restoredState.mustIncludeFighters)
      setExcludeFighters(restoredState.excludeFighters)

      // 除外設定を更新
      setIsExcludeDashFighters(restoredState.isExcludeDashFighters)
      setIsExcludeDlcFighters(restoredState.isExcludeDlcFighters)

      // アクティブな状態を更新
      setActiveFighters(restoredState.activeFighters)

      // 使用済み状態を更新
      setUsedFighters(restoredState.usedFighters)

      // 現在の状態を更新
      setCurrentState(restoredState)
      setBingoStateError(null)
    } catch (error) {
      setBingoStateError('ビンゴカードの状態の復元に失敗しました')
      console.error('ビンゴカードの状態の復元に失敗しました:', error)
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
    remoteStateString,
    activeFighters,
    usedFighters,
    currentState,
    localStateString,
    extractFighters,
    addFighter,
    removeFighter,
    toggleDashFighterExclusion,
    toggleDlcFighterExclusion,
    handleFighterClick,
    getFighterState,
    onSerializeState,
    onStateRestore,
    bingoStateError,
    setLocalStateString,
  }
}
