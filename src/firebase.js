import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { getStorage } from 'firebase/storage'
import { getAnalytics } from 'firebase/analytics'

// Firebase 설정 (환경변수 사용)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
}

// Firebase 초기화
const app = initializeApp(firebaseConfig)

// Analytics 초기화 (선택사항)
const analytics = getAnalytics(app)

// Firebase 서비스 내보내기
export const db = getFirestore(app) // Firestore (클라우드 데이터베이스)
export const auth = getAuth(app) // Authentication (인증)
export const storage = getStorage(app) // Storage (파일 저장소)

export default app
