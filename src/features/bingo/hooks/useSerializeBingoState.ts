import { useCallback } from 'react'

import type {
  BingoState,
  SerializedBingoState,
} from '~/features/bingo/types/bingo'
import type { Fighter, FightersData } from '~/features/bingo/types/fighter'

export const useSerializeBingoState = () => {
  /**
   * ビンゴカードの状態を文字列に変換する
   * @param currentState - ビンゴカードの状態
   * @returns ビンゴカードの状態を文字列に変換したもの
   */
  const serializeState = useCallback((currentState: BingoState): string => {
    const state: SerializedBingoState = {
      s: currentState.selectedFighters.map((f) => f.fighterId),
      m: currentState.mustIncludeFighters.map((f) => f.fighterId),
      e: currentState.excludeFighters.map((f) => f.fighterId),
      d: currentState.isExcludeDashFighters,
      l: currentState.isExcludeDlcFighters,
      a: Array.from(currentState.activeFighters),
    }
    const serialized = btoa(JSON.stringify(state))
    return serialized
  }, [])

  /**
   * 文字列からビンゴカードの状態を復元する
   * @param stateString - ビンゴカードの状態を文字列に変換したもの
   * @param fighters - ファイターデータ
   * @returns ビンゴカードの状態
   */
  const deserializeState = useCallback(
    (stateString: string, fighters: FightersData): BingoState => {
      try {
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
      } catch (error) {
        console.error('状態の復元に失敗しました:', error)
        throw error
      }
    },
    [],
  )

  return {
    serializeState,
    deserializeState,
  }
}
