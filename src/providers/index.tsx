import { BingoRoomProvider } from './BingoRoomProvider'

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return <BingoRoomProvider>{children}</BingoRoomProvider>
}
