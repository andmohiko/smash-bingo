/**
 * ビンゴカードの表示コンポーネント
 * @description 選択されたファイターのグリッド表示
 */
import Image from 'next/image'

import type { Fighter } from '~/features/bingo/types/fighter'

type BingoCardDisplayProps = {
  selectedFighters: Array<Fighter>
  activeFighters: Set<string>
  usedFighters: Set<string>
  onFighterClick: (fighterId: string) => void
}

export const BingoCardDisplay: React.FC<BingoCardDisplayProps> = ({
  selectedFighters,
  activeFighters,
  usedFighters,
  onFighterClick,
}) => {
  // 25マスの配列を生成
  const gridCells = Array.from({ length: 25 }, (_, index) => {
    const fighter = selectedFighters[index]
    return fighter || null
  })

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="grid grid-cols-5 gap-2">
        {gridCells.map((fighter, index) => (
          <div
            key={fighter?.fighterId || `empty-${index}`}
            className="aspect-square"
          >
            {fighter ? (
              <FighterCard
                fighter={fighter}
                isActive={activeFighters.has(fighter.fighterId)}
                isUsed={usedFighters.has(fighter.fighterId)}
                onClick={() => onFighterClick(fighter.fighterId)}
              />
            ) : (
              <div className="w-full h-full border-2 border-gray-200 rounded-lg bg-gray-50" />
            )}
          </div>
        ))}
      </div>
      {/* <p>選択: {selectedFightersNumbers.join(',')}</p>
      <p>重複: {duplicatedNumbers.join(',')}</p>
      <p>DLC: {dlcNumbers.join(',')}</p> */}
    </div>
  )
}

/**
 * ファイターカードコンポーネント
 * @param fighter - 表示するファイターの情報
 * @param isActive - カードがアクティブかどうか
 * @param isUsed - カードが使用済みかどうか
 * @param onClick - クリック時のコールバック関数
 */
const FighterCard = ({
  fighter,
  isActive,
  isUsed,
  onClick,
}: {
  fighter: Fighter
  isActive: boolean
  isUsed: boolean
  onClick: () => void
}) => {
  // 状態に応じたスタイルを決定
  const getCardStyle = () => {
    if (isActive) {
      return 'bg-blue-900 text-white'
    }
    if (isUsed) {
      return 'bg-gray-800 text-white opacity-40'
    }
    return 'bg-white hover:bg-blue-200'
  }

  return (
    <div
      className={`relative aspect-square rounded-lg shadow-md p-2 transition-all cursor-pointer ${getCardStyle()}`}
      onClick={onClick}
    >
      <div className="relative w-full h-full">
        <Image
          src={`/fighters/${fighter.icon}`}
          alt={fighter.name}
          fill
          className="object-contain"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
    </div>
  )
}
