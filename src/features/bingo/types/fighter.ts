/**
 * ファイターの型定義
 * @description ファイターに関する型定義を管理するファイル
 */

/**
 * ファイターの型定義
 */
export type Fighter = {
  fighterId: string
  icon: string
  isDashFighter: boolean
  hasDashFighter: boolean
  hasSiblingFighter: boolean
  name: string
  nickname: string
  name_en: string
  number: number
  parent: string | null
  child: string | null
  isDlc: boolean
}

/**
 * ファイターデータの型定義
 */
export type FightersData = {
  [key: string]: Fighter
}
