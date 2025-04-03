import { getAnalytics } from 'firebase/analytics'
import { initializeApp } from 'firebase/app'
import {
  getFirestore,
  serverTimestamp as getServerTimestamp,
  connectFirestoreEmulator,
} from 'firebase/firestore'

const config = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

const firebaseApp = initializeApp({ ...config })

export const db = getFirestore(firebaseApp)
export const serverTimestamp = getServerTimestamp()
// window オブジェクトがあるときだけ getAnalytics() を呼び出す
export const analytics = typeof window !== 'undefined' ? getAnalytics() : null

if (process.env.NEXT_PUBLIC_USE_EMULATOR === 'true') {
  connectFirestoreEmulator(db, 'localhost', 8080)
}
