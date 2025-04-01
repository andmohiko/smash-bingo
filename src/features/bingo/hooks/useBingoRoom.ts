import { useEffect, useState } from 'react'

import {
  createRoomOperation,
  subscribeRoomByIdOperation,
  updateRoomOperation,
} from '~/infrastructure/firestore/RoomOperations'

type Room = {
  roomId: string
  cardStateStrings: Array<string>
  createdAt: Date
  updatedAt: Date
}

/**
 * ビンゴルームの管理
 * - ルームの作成
 * - ルームの更新
 * - ルームの購読
 */
export const useBingoRoom = () => {
  const [room, setRoom] = useState<Room | null>(null)
  const [passcode, setPasscode] = useState<string | null>(null)

  useEffect(() => {
    if (passcode) {
      subscribeRoomByIdOperation(passcode, setRoom)
    }
  }, [passcode])

  const joinRoom = async (passcode: string) => {
    setPasscode(passcode)
    console.log('joinRoom', passcode)
  }

  const createRoom = async (passcode: string) => {
    await createRoomOperation(passcode)
    setPasscode(passcode)
    console.log('createRoom', passcode)
  }

  const updateRoom = async () => {
    if (room?.roomId) {
      await updateRoomOperation(room.roomId)
    }
  }

  return {
    room,
    passcode,
    joinRoom,
    createRoom,
    updateRoom,
  }
}
