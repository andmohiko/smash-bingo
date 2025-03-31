import { Fighter } from './fighter'

/**
 * シリアライズされたビンゴカードの状態を表す型
 */
export type SerializedBingoState = {
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
