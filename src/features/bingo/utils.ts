/**
 * 配列をシャッフルする
 * @param array - 対象の配列
 * @returns シャッフルされた配列
 */
export const shuffleArray = <T extends object>(array: Array<T>): Array<T> => {
  return [...array].sort(() => 0.5 - Math.random())
}

/**
 * 配列からランダムに指定数の要素を抽出する
 * @param array - 対象の配列
 * @param count - 抽出する要素の数
 * @returns ランダムに抽出された要素の配列
 */
export const getRandomElements = <T extends object>(
  array: Array<T>,
  count: number,
): Array<T> => {
  // 要素をランダムに並び替え
  const shuffled = shuffleArray(array)
  // 先頭からcount個の要素を抽出
  return shuffled.slice(0, count)
}
