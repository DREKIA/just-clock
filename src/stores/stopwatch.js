import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useStopwatchStore = defineStore('stopwatch', () => {
  // 스탑워치 상태
  const time = ref(0) // 밀리초
  const isRunning = ref(false)
  const records = ref([])
  const lastRecordTime = ref(0)
  let interval = null

  // 스탑워치 토글
  const toggle = () => {
    isRunning.value = !isRunning.value
    if (isRunning.value) {
      interval = setInterval(() => {
        time.value += 10 // 10ms 단위로 증가
      }, 10)
    } else {
      clearInterval(interval)
    }
  }

  // 기록 추가
  const record = () => {
    if (isRunning.value) {
      const lapTime = time.value - lastRecordTime.value
      records.value.unshift({
        totalTime: time.value,
        lapTime: lapTime,
      })
      lastRecordTime.value = time.value
    }
  }

  // 스탑워치 리셋
  const reset = () => {
    clearInterval(interval)
    isRunning.value = false
    time.value = 0
    records.value = []
    lastRecordTime.value = 0
  }

  // 시간 포맷 (밀리초 포함)
  const formattedTime = computed(() => {
    const totalSeconds = Math.floor(time.value / 1000)
    const mins = String(Math.floor(totalSeconds / 60)).padStart(2, '0')
    const secs = String(totalSeconds % 60).padStart(2, '0')
    const ms = String(Math.floor((time.value % 1000) / 10)).padStart(2, '0')
    return `${mins}:${secs}.${ms}`
  })

  // 정리
  const cleanup = () => {
    clearInterval(interval)
  }

  return {
    time,
    isRunning,
    records,
    formattedTime,
    toggle,
    record,
    reset,
    cleanup,
  }
})

// 시간 포맷 유틸 함수
export const formatStopwatchTime = (milliseconds) => {
  const totalSeconds = Math.floor(milliseconds / 1000)
  const mins = String(Math.floor(totalSeconds / 60)).padStart(2, '0')
  const secs = String(totalSeconds % 60).padStart(2, '0')
  const ms = String(Math.floor((milliseconds % 1000) / 10)).padStart(2, '0')
  return `${mins}:${secs}.${ms}`
}
