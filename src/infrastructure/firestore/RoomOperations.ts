import {
  addDoc,
  collection,
  doc,
  limit,
  onSnapshot,
  query,
  Unsubscribe,
  updateDoc,
  where,
} from 'firebase/firestore'

import {
  CreateRoomDto,
  Room,
  roomCollectionName,
  RoomId,
  UpdateRoomDto,
} from '~/features/bingo/types/Room'
import { db } from '~/lib/firebase'
import { convertDate } from '~/utils/convertDate'

const dateColumns = ['createdAt', 'updatedAt']

/**
 * ルームIDでルームを取得
 * @param roomId ルームID
 * @param setter ルームを設定する関数
 * @returns 購読を解除する関数
 */
export const subscribeRoomByIdOperation = (
  roomId: RoomId,
  setter: (room: Room | null) => void,
): Unsubscribe => {
  // roomIdでルームを取得
  const unsubscribe = onSnapshot(doc(db, roomCollectionName, roomId), (doc) => {
    const data = doc.data()
    if (!data) {
      setter(null)
      return
    }
    const room = {
      roomId: doc.id,
      ...convertDate(data, dateColumns),
    } as Room
    // 取得したルームをsetterに渡す
    setter(room)
  })
  return unsubscribe
}

/**
 * パスコードでルームを取得
 * @param passcode パスコード
 * @param setter ルームを設定する関数
 * @returns 購読を解除する関数
 */
export const subscribeRoomByPasscodeOperation = (
  passcode: string,
  setter: (room: Room | null) => void,
): Unsubscribe => {
  const unsubscribe = onSnapshot(
    query(
      collection(db, roomCollectionName),
      where('passcode', '==', passcode),
      limit(1),
    ),
    (snapshot) => {
      if (snapshot.empty) {
        setter(null)
        return
      }
      const data = snapshot.docs[0].data()
      const room = {
        roomId: snapshot.docs[0].id,
        ...convertDate(data, dateColumns),
      } as Room
      setter(room)
    },
  )
  return unsubscribe
}

export const createRoomOperation = async (
  dto: CreateRoomDto,
): Promise<RoomId> => {
  const docRef = await addDoc(collection(db, roomCollectionName), dto)
  return docRef.id
}

export const updateRoomOperation = async (
  roomId: RoomId,
  dto: UpdateRoomDto,
): Promise<void> => {
  await updateDoc(doc(db, roomCollectionName, roomId), dto)
}
