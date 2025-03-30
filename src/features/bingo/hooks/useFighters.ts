/**
 * ファイターデータ取得カスタムフック
 * @description fighters.jsonからファイターデータを取得する
 */
import { useEffect, useState } from 'react'

import type { FightersData } from '~/features/bingo/types/fighter'

export const useFighters = () => {
  const [fighters, setFighters] = useState<FightersData | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [isLoading, setIsLoading] = useState(true)

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
        setError(
          error instanceof Error
            ? error
            : new Error('不明なエラーが発生しました'),
        )
      } finally {
        setIsLoading(false)
      }
    }

    fetchFighters()
  }, [])

  return { fighters, error, isLoading }
}
