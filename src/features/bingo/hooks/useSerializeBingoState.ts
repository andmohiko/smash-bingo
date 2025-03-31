import { useState } from 'react'

import { Fighter, FightersData } from '~/features/bingo/types/fighter'

/**
 * シリアライズされたビンゴカードの状態を表す型
 */
type SerializedBingoState = {
  /** 選択されたファイターのID配列 */
  s: Array<string>
  /** 必ず含めるファイターのID配列 */
  m: Array<string>
  /** 除外するファイターのID配列 */
  e: Array<string>
  /** ダッシュファイターを除外するかどうか */
  d: boolean
  /** DLCファイターを除外するかどうか */
  l: boolean
  /** アクティブなファイターのID配列 */
  a: Array<string>
}

/**
 * ビンゴカードの状態を表す型
 */
export type BingoState = {
  selectedFighters: Array<Fighter>
  mustIncludeFighters: Array<Fighter>
  excludeFighters: Array<Fighter>
  isExcludeDashFighters: boolean
  isExcludeDlcFighters: boolean
  activeFighters: Set<string>
}

export const useSerializeBingoState = (currentState: BingoState) => {
  const [stateString, setStateString] = useState<string>('')

  /**
   * ビンゴカードの状態を文字列に変換する
   */
  const serializeState = (): string => {
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
    stateString,
    serializeState,
    deserializeState,
  }
}
