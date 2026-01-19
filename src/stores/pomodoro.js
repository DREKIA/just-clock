import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useSettingsStore } from './settings'

export const usePomodoroStore = defineStore('pomodoro', () => {
  const settingsStore = useSettingsStore()

  // 뽀모도로 상태
  const timeLeft = ref(25 * 60)
  const isRunning = ref(false)
  const isWorkTime = ref(true)
  const sessionsCompleted = ref(0)
  const totalSessionsToday = ref(0)
  let timer = null

  // 알람 사운드 재생
  const playAlarmSound = () => {
    const volume = settingsStore.settings.alarmVolume || 0.4
    const audioContext = new (window.AudioContext || window.webkitAudioContext)()

    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        const oscillator = audioContext.createOscillator()
        const gainNode = audioContext.createGain()

        oscillator.connect(gainNode)
        gainNode.connect(audioContext.destination)

        oscillator.frequency.value = 1000
        oscillator.type = 'sine'

        gainNode.gain.setValueAtTime(volume, audioContext.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3)

        oscillator.start(audioContext.currentTime)
        oscillator.stop(audioContext.currentTime + 0.3)
      }, i * 400)
    }
  }

  // 브라우저 알림 전송
  const sendBrowserNotification = (title, body) => {
    if (settingsStore.settings.browserNotificationEnabled && Notification.permission === 'granted') {
      new Notification(title, {
        body,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
      })
    }
  }

  // 브라우저 알림 권한 요청
  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission()
      return permission === 'granted'
    }
    return false
  }

  // 뽀모도로 토글
  const toggle = (showToast) => {
    if (isRunning.value) {
      clearInterval(timer)
      isRunning.value = false
      return
    }

    isRunning.value = true
    timer = setInterval(() => {
      timeLeft.value--
      if (timeLeft.value <= 0) {
        playAlarmSound()
        if (isWorkTime.value) {
          isWorkTime.value = false
          timeLeft.value = settingsStore.settings.pomodoroBreakMinutes * 60
          sessionsCompleted.value++
          totalSessionsToday.value++
          saveTodaysSessions()
          const message = settingsStore.settings.workTimeEndMessage
          showToast?.(message, 'success')
          sendBrowserNotification(settingsStore.t('pomodoro'), message)
        } else {
          isWorkTime.value = true
          timeLeft.value = settingsStore.settings.pomodoroWorkMinutes * 60
          const message = settingsStore.settings.breakTimeEndMessage
          showToast?.(message, 'success')
          sendBrowserNotification(settingsStore.t('pomodoro'), message)
        }
      }
    }, 1000)
  }

  // 뽀모도로 리셋
  const reset = () => {
    clearInterval(timer)
    isRunning.value = false
    isWorkTime.value = true
    timeLeft.value = settingsStore.settings.pomodoroWorkMinutes * 60
  }

  // 오늘 세션 저장
  const saveTodaysSessions = () => {
    const today = new Date().toISOString().split('T')[0]
    const sessionsData = JSON.parse(localStorage.getItem('pomodoroSessions') || '{}')
    sessionsData[today] = totalSessionsToday.value
    localStorage.setItem('pomodoroSessions', JSON.stringify(sessionsData))
  }

  // 오늘 세션 로드
  const loadTodaysSessions = () => {
    const today = new Date().toISOString().split('T')[0]
    const sessionsData = JSON.parse(localStorage.getItem('pomodoroSessions') || '{}')
    totalSessionsToday.value = sessionsData[today] || 0
  }

  // 시간 포맷
  const formattedTime = computed(() => {
    const mins = String(Math.floor(timeLeft.value / 60)).padStart(2, '0')
    const secs = String(timeLeft.value % 60).padStart(2, '0')
    return `${mins}:${secs}`
  })

  // 초기화
  const initialize = () => {
    timeLeft.value = settingsStore.settings.pomodoroWorkMinutes * 60
    loadTodaysSessions()
  }

  // 정리
  const cleanup = () => {
    clearInterval(timer)
  }

  return {
    timeLeft,
    isRunning,
    isWorkTime,
    sessionsCompleted,
    totalSessionsToday,
    formattedTime,
    toggle,
    reset,
    initialize,
    cleanup,
    playAlarmSound,
    requestNotificationPermission,
    sendBrowserNotification,
  }
})
