type RoomId = string

export const subscribeRoomByIdOperation = (
  passcode: string,
  setter: (room: Room) => void,
) => {
  // passcodeでルームを取得
  // 取得したルームをsetterに渡す
}

export const createRoomOperation = async (passcode: string): Promise<void> => {}

export const updateRoomOperation = async (roomId: RoomId): Promise<void> => {}
