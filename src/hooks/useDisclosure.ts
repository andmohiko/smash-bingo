/**
 * モーダルの開閉を管理するフック
 * @description モーダルの開閉を管理するフック
 * @returns [isOpen, handlers: {onOpen, onClose}]
 */

import { useState } from 'react'

export const useDisclosure = (): [
  boolean,
  { onOpen: () => void; onClose: () => void },
] => {
  const [isOpen, setIsOpen] = useState(false)

  const onOpen = () => setIsOpen(true)
  const onClose = () => setIsOpen(false)

  return [isOpen, { onOpen, onClose }]
}
