// いらなかったら消す
import { ChangeEvent, useCallback, useState } from 'react'

// import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'

// import { storage } from '@/lib/firebase'

export type SetFileInput = (event: ChangeEvent<HTMLInputElement>) => Promise<{
  name: string
  url: string
}>

// <input type="file"> に使うためのフック
export const useFileInput = (
  path = '',
  defaultValue = '',
): [string, SetFileInput, boolean] => {
  const [fileURL, setFileURL] = useState(defaultValue)
  const [loading, setLoading] = useState<boolean>(false)

  const onChange = useCallback<SetFileInput>(
    async (e) => {
      setLoading(true)
      const files = e.target.files
      if (!files || files.length === 0) {
        return { name: '', url: '' }
      }

      const file = files[0]
      const name = files[0].name

      const uploadPath = `${path}/${name}`
      try {
        const fileUrl = await uploadFile(uploadPath, file)
        setFileURL(fileUrl)
        setLoading(false)
        return { name, url: fileUrl }
      } catch {
        console.error('error')
      }
      return { name: '', url: '' }
    },
    [path, setFileURL],
  )

  return [fileURL, onChange, loading]
}

// Firebase Storageの場合
// すきなストレージに書き換える
const uploadFile = async (path: string, blob: Blob): Promise<string> => {
  // const imageRef = ref(storage, path)
  // const snapShot = await uploadBytesResumable(imageRef, blob)
  // return getDownloadURL(snapShot.ref)
  await console.log('upload', path, blob)
  return 'file url'
}
