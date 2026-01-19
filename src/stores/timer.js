import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useSettingsStore } from './settings'
import { usePomodoroStore } from './pomodoro'

export const useTimerStore = defineStore('timer', () => {
  const settingsStore = useSettingsStore()

  // 타이머 상태
  const inputMinutes = ref(0)
  const inputSeconds = ref(30)
  const timeLeft = ref(30)
  const isRunning = ref(false)
  let interval = null

  // 타이머 시작
  const start = (showToast) => {
    if (isRunning.value) {
      clearInterval(interval)
      isRunning.value = false
      return
    }

    // 입력값 검증
    if ((!inputMinutes.value && !inputSeconds.value) || (inputMinutes.value <= 0 && inputSeconds.value <= 0)) {
      showToast?.(settingsStore.t('invalidInput'), 'warning')
      inputMinutes.value = 1
      inputSeconds.value = 0
      return
    }

    timeLeft.value = Math.max(1, Math.floor(inputMinutes.value)) * 60 + Math.max(0, Math.floor(inputSeconds.value))
    isRunning.value = true

    interval = setInterval(() => {
      timeLeft.value--
      if (timeLeft.value <= 0) {
        clearInterval(interval)
        isRunning.value = false

        // 알람 재생
        const pomodoroStore = usePomodoroStore()
        pomodoroStore.playAlarmSound()

        const message = settingsStore.settings.timerEndMessage
        showToast?.(message, 'success')
        pomodoroStore.sendBrowserNotification(settingsStore.t('timer'), message)
      }
    }, 1000)
  }

  // 타이머 일시정지
  const pause = () => {
    isRunning.value = false
    clearInterval(interval)
  }

  // 타이머 리셋
  const reset = () => {
    clearInterval(interval)
    isRunning.value = false
    timeLeft.value = Math.max(1, Math.floor(inputMinutes.value)) * 60 + Math.max(0, Math.floor(inputSeconds.value))
  }

  // 시간 포맷
  const formattedTime = computed(() => {
    const mins = String(Math.floor(timeLeft.value / 60)).padStart(2, '0')
    const secs = String(timeLeft.value % 60).padStart(2, '0')
    return `${mins}:${secs}`
  })

  // 정리
  const cleanup = () => {
    clearInterval(interval)
  }

  return {
    inputMinutes,
    inputSeconds,
    timeLeft,
    isRunning,
    formattedTime,
    start,
    pause,
    reset,
    cleanup,
  }
})
