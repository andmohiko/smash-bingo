/**
 * ビンゴカードの表示コンポーネント
 * @description 選択されたファイターのグリッド表示
 */
import Image from 'next/image'

import type { Fighter } from '~/features/bingo/types/fighter'

type Props = {
  selectedFighters: Array<Fighter>
  activeFighters: Set<string>
  onFighterClick: (fighterId: string) => void
}

export const BingoCardDisplay = ({
  selectedFighters,
  activeFighters,
  onFighterClick,
}: Props): React.ReactNode => {
  if (selectedFighters.length === 0) {
    return null
  }

  // const selectedFightersNumbers = selectedFighters
  //   .map((fighter) => fighter.number)
  //   .sort((a, b) => a - b)
  // const duplicatedNumbers = selectedFightersNumbers.filter(
  //   (number, index, self) => self.indexOf(number) !== index,
  // )
  // const dlcNumbers = selectedFighters
  //   .filter((fighter) => fighter.isDlc)
  //   .map((fighter) => fighter.number)

  return (
    <>
      <div className="grid grid-cols-5 gap-2 max-w-md w-full">
        {selectedFighters.map((fighter) => (
          <FighterCard
            key={fighter.fighterId}
            fighter={fighter}
            isActive={activeFighters.has(fighter.fighterId)}
            onClick={() => onFighterClick(fighter.fighterId)}
          />
        ))}
      </div>
      {/* <p>選択: {selectedFightersNumbers.join(',')}</p>
      <p>重複: {duplicatedNumbers.join(',')}</p>
      <p>DLC: {dlcNumbers.join(',')}</p> */}
    </>
  )
}

/**
 * ファイターカードコンポーネント
 * @param fighter - 表示するファイターの情報
 * @param isActive - カードがアクティブかどうか
 * @param onClick - クリック時のコールバック関数
 */
const FighterCard = ({
  fighter,
  isActive,
  onClick,
}: {
  fighter: Fighter
  isActive: boolean
  onClick: () => void
}) => {
  return (
    <div
      className={`relative aspect-square rounded-lg shadow-md p-2 transition-all cursor-pointer ${
        isActive ? 'bg-blue-900' : 'bg-white hover:bg-blue-200'
      }`}
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
