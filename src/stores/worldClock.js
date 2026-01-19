import { defineStore } from 'pinia'
import { ref } from 'vue'

// 주요 타임존 목록
export const availableTimezones = [
  { id: 'Asia/Seoul', name: '서울', nameEn: 'Seoul' },
  { id: 'Asia/Tokyo', name: '도쿄', nameEn: 'Tokyo' },
  { id: 'Asia/Shanghai', name: '상하이', nameEn: 'Shanghai' },
  { id: 'Asia/Singapore', name: '싱가포르', nameEn: 'Singapore' },
  { id: 'Asia/Dubai', name: '두바이', nameEn: 'Dubai' },
  { id: 'Europe/London', name: '런던', nameEn: 'London' },
  { id: 'Europe/Paris', name: '파리', nameEn: 'Paris' },
  { id: 'Europe/Berlin', name: '베를린', nameEn: 'Berlin' },
  { id: 'Europe/Moscow', name: '모스크바', nameEn: 'Moscow' },
  { id: 'America/New_York', name: '뉴욕', nameEn: 'New York' },
  { id: 'America/Los_Angeles', name: 'LA', nameEn: 'Los Angeles' },
  { id: 'America/Chicago', name: '시카고', nameEn: 'Chicago' },
  { id: 'America/Denver', name: '덴버', nameEn: 'Denver' },
  { id: 'America/Sao_Paulo', name: '상파울루', nameEn: 'Sao Paulo' },
  { id: 'Australia/Sydney', name: '시드니', nameEn: 'Sydney' },
  { id: 'Pacific/Auckland', name: '오클랜드', nameEn: 'Auckland' },
  { id: 'Pacific/Honolulu', name: '호놀룰루', nameEn: 'Honolulu' },
]

export const useWorldClockStore = defineStore('worldClock', () => {
  // 선택된 타임존 목록
  const selectedTimezones = ref([])
  const worldClockTimes = ref({})
  let interval = null

  // 타임존 추가
  const addTimezone = (timezoneId) => {
    if (!selectedTimezones.value.includes(timezoneId)) {
      selectedTimezones.value.push(timezoneId)
      saveTimezones()
    }
  }

  // 타임존 제거
  const removeTimezone = (timezoneId) => {
    const index = selectedTimezones.value.indexOf(timezoneId)
    if (index > -1) {
      selectedTimezones.value.splice(index, 1)
      saveTimezones()
    }
  }

  // 타임존 저장
  const saveTimezones = () => {
    localStorage.setItem('worldClockTimezones', JSON.stringify(selectedTimezones.value))
  }

  // 타임존 로드
  const loadTimezones = () => {
    const saved = localStorage.getItem('worldClockTimezones')
    if (saved) {
      selectedTimezones.value = JSON.parse(saved)
    }
  }

  // 시간 업데이트
  const updateTimes = () => {
    const now = new Date()
    const times = {}

    selectedTimezones.value.forEach(tz => {
      try {
        const options = {
          timeZone: tz,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        }
        times[tz] = now.toLocaleTimeString('en-US', options)
      } catch {
        times[tz] = '--:--:--'
      }
    })

    worldClockTimes.value = times
  }

  // 초기화
  const initialize = () => {
    loadTimezones()
    updateTimes()
    interval = setInterval(updateTimes, 1000)
  }

  // 정리
  const cleanup = () => {
    clearInterval(interval)
  }

  // 타임존 정보 가져오기
  const getTimezoneInfo = (timezoneId) => {
    return availableTimezones.find(tz => tz.id === timezoneId)
  }

  return {
    selectedTimezones,
    worldClockTimes,
    availableTimezones,
    addTimezone,
    removeTimezone,
    initialize,
    cleanup,
    getTimezoneInfo,
  }
})
