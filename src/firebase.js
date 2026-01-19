import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { getStorage } from 'firebase/storage'
import { getAnalytics } from 'firebase/analytics'

// Firebase 설정
const firebaseConfig = {
  apiKey: 'AIzaSyDbjh4H2lPMM45IHj7QPEDjLJ8W0FIHofY',
  authDomain: 'just-clock-p.firebaseapp.com',
  projectId: 'just-clock-p',
  storageBucket: 'just-clock-p.firebasestorage.app',
  messagingSenderId: '1054107518490',
  appId: '1:1054107518490:web:c663b9c4a1c5042a39b3a3',
  measurementId: 'G-0WER9W8F08'
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
