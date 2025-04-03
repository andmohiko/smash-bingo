import { FieldValue } from 'firebase/firestore'

export const roomCollectionName = 'rooms'

export type RoomId = string

export type Room = {
  roomId: RoomId
  card1State: string | null
  card2State: string | null
  createdAt: Date
  passcode: string
  updatedAt: Date
}

export type CreateRoomDto = Omit<Room, 'roomId' | 'createdAt' | 'updatedAt'> & {
  createdAt: FieldValue
  updatedAt: FieldValue
}

export type UpdateRoomDto = {
  card1State?: Room['card1State']
  card2State?: Room['card2State']
  updatedAt: FieldValue
}

export const passcodeChars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
export const passcodeLength = 6

export const generatePasscode = (): string => {
  return Array.from(
    { length: passcodeLength },
    () => passcodeChars[Math.floor(Math.random() * passcodeChars.length)],
  ).join('')
}
