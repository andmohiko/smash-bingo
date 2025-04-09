/* eslint-disable @typescript-eslint/no-empty-function */
/**
 * ビンゴルームの管理
 * - ルームの作成
 * - ルームの更新
 * - ルームの購読
 * - ビンゴ部屋の作成の流れ
 *   1. ビンゴ部屋を作成する（addDocでドキュメントIDは自動生成する）
 *   2. ビンゴ部屋を購読する（作成したドキュメントをそのままsubscribeし、passcodeをUI上に表示する）
 *   3. ビンゴ部屋を更新する（購読しているドキュメントをupdateDocで更新する）
 *   4. ビンゴ部屋を購読解除する（useEffectのclean upで購読を解除する）
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'

import { generatePasscode, Room, RoomId } from '~/features/bingo/types/Room'
import {
  createRoomOperation,
  subscribeRoomByPasscodeOperation,
  updateRoomOperation,
} from '~/infrastructure/firestore/RoomOperations'
import { serverTimestamp } from '~/lib/firebase'

const BingoRoomContext = createContext<{
  roomId: RoomId | null
  room: Room | null
  passcode: string | null
  joinRoom: (passcode: string) => void
  createRoom: () => Promise<void>
  updateRoom: (cardNum: 1 | 2, serializedState: string) => Promise<void>
}>({
  roomId: null,
  room: null,
  passcode: null,
  joinRoom: async () => {},
  createRoom: async () => {},
  updateRoom: async () => {},
})

const BingoRoomProvider = ({
  children,
}: {
  children: React.ReactNode
}): React.ReactNode => {
  const [roomId, setRoomId] = useState<RoomId | null>(null)
  const [room, setRoom] = useState<Room | null>(null)
  const [passcode, setPasscode] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!passcode) {
      return
    }
    const unsubscribe = subscribeRoomByPasscodeOperation(passcode, setRoom)
    return () => unsubscribe()
  }, [passcode])

  const joinRoom = (passcode: string) => {
    setPasscode(passcode)
  }

  const createRoom = useCallback(async () => {
    try {
      const passcode = generatePasscode()
      const roomId = await createRoomOperation({
        card1State: null,
        card2State: null,
        createdAt: serverTimestamp,
        passcode,
        updatedAt: serverTimestamp,
      })
      setRoomId(roomId)
      setPasscode(passcode)
      setError(null)
    } catch (err) {
      setError('ルームの作成に失敗しました')
      console.error('Room creation error:', err)
    }
  }, [])

  const updateRoom = useCallback(
    async (cardNum: 1 | 2, serializedState: string) => {
      if (room) {
        if (cardNum === 1) {
          await updateRoomOperation(room.roomId, {
            updatedAt: serverTimestamp,
            card1State: serializedState,
          })
        } else if (cardNum === 2) {
          await updateRoomOperation(room.roomId, {
            updatedAt: serverTimestamp,
            card2State: serializedState,
          })
        } else {
          throw new Error('Invalid card number')
        }
      }
    },
    [room],
  )

  return (
    <BingoRoomContext.Provider
      value={{ roomId, room, passcode, joinRoom, createRoom, updateRoom }}
    >
      {children}
    </BingoRoomContext.Provider>
  )
}

export { BingoRoomContext, BingoRoomProvider }

export const useBingoRoomContext = () => useContext(BingoRoomContext)
