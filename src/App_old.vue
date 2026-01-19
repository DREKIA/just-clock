<script setup>
import { ref, onMounted, onUnmounted, computed, watch, nextTick } from 'vue'
import Toast from './components/Toast.vue'

// Toast 상태
const toastMessage = ref('')
const toastType = ref('info')

// Toast 표시 함수
const showToast = (message, type = 'info') => {
  toastMessage.value = message
  toastType.value = type
}

// 상태 관리
const time = ref('')
const ampm = ref('')
const currentDate = ref('')
const isFullscreen = ref(false)
const showSettings = ref(false)
const clockMode = ref('clock') // 'clock' | 'timer' | 'stopwatch' | 'pomodoro'
const showModeMenu = ref(false)
const activeWidget = ref({
  pomodoro: false,
  timer: false,
  stopwatch: false,
})
const showWidgetMenu = ref(false)

// 뽀모도로 상태
const pomodoroWorkTime = ref(25 * 60) // 25분
const pomodoroBreakTime = ref(5 * 60) // 5분
const pomodoroTimeLeft = ref(25 * 60)
const pomodoroIsRunning = ref(false)
const pomodoroIsWorkTime = ref(true)
let pomodoroTimer

// 타이머 상태
const timerInputMinutes = ref(0)
const timerInputSeconds = ref(30)
const timerTimeLeft = ref(30)
const timerIsRunning = ref(false)
let timerInterval

// 스탑워치 상태
const stopwatchTime = ref(0)
const stopwatchIsRunning = ref(false)
const stopwatchRecords = ref([])
const stopwatchLastRecordTime = ref(0)
let stopwatchInterval

// 드래그 상태
const pomodoroPosition = ref({ x: 100, y: 0 })
const isDraggingPomodoro = ref(false)
const dragStartPos = ref({ x: 0, y: 0 })

const timerPosition = ref({ x: 280, y: 100 })
const isDraggingTimer = ref(false)
const dragStartPosTimer = ref({ x: 0, y: 0 })

const stopwatchPosition = ref({ x: 280, y: 300 })
const isDraggingStopwatch = ref(false)
const dragStartPosStopwatch = ref({ x: 0, y: 0 })

// 설정 저장 피드백
const settingsSaved = ref(false)

// 테마 정의
const themes = {
  dark: {
    name: '다크',
    backgroundColor: '#0F0F1F',
    timeColor: '#ffffff',
    ampmColor: '#E0E7FF',
    dateColor: '#A78BFA',
    neonGlowColor: '#7C3AED',
    primary: '#7C3AED',
  },
  light: {
    name: '라이트',
    backgroundColor: '#FFFFFF',
    timeColor: '#1F2937',
    ampmColor: '#4B5563',
    dateColor: '#6B7280',
    neonGlowColor: '#9333EA',
    primary: '#7C3AED',
  },
  neon: {
    name: '네온',
    backgroundColor: '#0A0A0F',
    timeColor: '#FF00FF',
    ampmColor: '#00FFFF',
    dateColor: '#FFFF00',
    neonGlowColor: '#FF00FF',
    primary: '#FF00FF',
  },
  sunset: {
    name: '일몰',
    backgroundColor: '#1a0f0a',
    timeColor: '#FF6B35',
    ampmColor: '#FFA500',
    dateColor: '#FF8C42',
    neonGlowColor: '#FF4500',
    primary: '#FF6B35',
  },
  ocean: {
    name: '오션',
    backgroundColor: '#0a1628',
    timeColor: '#00D9FF',
    ampmColor: '#0099CC',
    dateColor: '#00CCFF',
    neonGlowColor: '#00D9FF',
    primary: '#00D9FF',
  },
  forest: {
    name: '포레스트',
    backgroundColor: '#0a1a0a',
    timeColor: '#00FF6B',
    ampmColor: '#00CC55',
    dateColor: '#00DD55',
    neonGlowColor: '#00FF6B',
    primary: '#00FF6B',
  },
}

// 테마 선택 상태
const currentTheme = ref('dark')

// 설정 상태
const settings = ref({
  showAmPm: true,
  showDate: false,
  showDigital: true,
  showAnalog: false,
  neonEnabled: false,
  neonIntensity: 3, // 1-5 강도
  timeColor: '#ffffff',
  ampmColor: '#E0E7FF',
  dateColor: '#A78BFA',
  fontSize: 1,
  neonGlowColor: '#7C3AED',
  backgroundColor: '#0F0F1F',
  fontFamily: 'Orbitron',
  use24Hour: false,
  pomodoroWorkMinutes: 25,
  pomodoroBreakMinutes: 5,
  language: 'ko', // 'ko' or 'en'
  theme: 'dark',
  // 알림 메시지 커스터마이징
  workTimeEndMessage: '작업 시간 종료! 휴식 시간입니다.',
  breakTimeEndMessage: '휴식 시간 종료! 작업 시간입니다.',
  timerEndMessage: '타이머 종료!',
})

const defaultSettings = {
  showAmPm: true,
  showDate: false,
  showDigital: true,
  showAnalog: false,
  neonEnabled: false,
  neonIntensity: 3,
  timeColor: '#ffffff',
  ampmColor: '#E0E7FF',
  dateColor: '#A78BFA',
  fontSize: 1,
  neonGlowColor: '#7C3AED',
  backgroundColor: '#0F0F1F',
  fontFamily: 'Orbitron',
  use24Hour: false,
  pomodoroWorkMinutes: 25,
  pomodoroBreakMinutes: 5,
  language: 'ko',
  theme: 'dark',
  workTimeEndMessage: '작업 시간 종료! 휴식 시간입니다.',
  breakTimeEndMessage: '휴식 시간 종료! 작업 시간입니다.',
  timerEndMessage: '타이머 종료!',
}

// 언어 번역
const translations = {
  ko: {
    mode: '모드',
    settings: '시계 설정',
    clockFormat: '시계 형식',
    digital: '디지털',
    analog: '아날로그',
    showAmPm: 'AM/PM 표시',
    showDate: '날짜 표시',
    neonEffect: '네온 효과',
    neonIntensity: '네온 강도',
    clockSize: '시계 크기',
    bgColor: '배경 색상',
    timeFormat24h: '24시간 형식',
    pomodoroWorkTime: '뽀모도로 작업 시간',
    pomodoroBreakTime: '뽀모도로 휴식 시간',
    minutes: '분',
    font: '폰트',
    timeColor: '시간 색상',
    ampmColor: 'AM/PM 색상',
    dateColor: '날짜 색상',
    neonColor: '네온 색상',
    resetBtn: '초기화',
    work: '작업',
    break: '휴식',
    pomodoro: '뽀모도로',
    timer: '타이머',
    stopwatch: '스탑워치',
    clock: '시계',
    fullscreen: 'FULL',
    resetConfirm: '설정을 초기값으로 초기화하시겠습니까?',
    workTimeEnd: '작업 시간 종료! 휴식 시간입니다.',
    breakTimeEnd: '휴식 시간 종료! 작업 시간입니다.',
    timerEnd: '타이머 종료!',
    invalidInput: '1분 이상의 유효한 시간을 입력해주세요.',
    language: '언어',
    close: '닫기',
    widgets: '위젯',
    theme: '테마',
    dark: '다크',
    light: '라이트',
    neon: '네온',
    sunset: '일몰',
    ocean: '오션',
    forest: '포레스트',
    notificationSettings: '알림 설정',
    workTimeEndMessage: '작업 종료 메시지',
    breakTimeEndMessage: '휴식 종료 메시지',
    timerEndMessage: '타이머 종료 메시지',
  },
  en: {
    mode: 'Mode',
    settings: 'Clock Settings',
    clockFormat: 'Clock Format',
    digital: 'Digital',
    analog: 'Analog',
    showAmPm: 'Show AM/PM',
    showDate: 'Show Date',
    neonEffect: 'Neon Effect',
    neonIntensity: 'Neon Intensity',
    clockSize: 'Clock Size',
    bgColor: 'Background Color',
    timeFormat24h: '24-hour Format',
    pomodoroWorkTime: 'Pomodoro Work Time',
    pomodoroBreakTime: 'Pomodoro Break Time',
    minutes: 'min',
    font: 'Font',
    timeColor: 'Time Color',
    ampmColor: 'AM/PM Color',
    dateColor: 'Date Color',
    neonColor: 'Neon Color',
    resetBtn: 'Reset',
    work: 'Work',
    break: 'Break',
    pomodoro: 'Pomodoro',
    timer: 'Timer',
    stopwatch: 'Stopwatch',
    clock: 'Clock',
    fullscreen: 'FULL',
    resetConfirm: 'Reset settings to default?',
    workTimeEnd: 'Work time finished! Time to take a break.',
    breakTimeEnd: 'Break time finished! Time to work.',
    timerEnd: 'Timer finished!',
    invalidInput: 'Please enter a valid time of 1 minute or more.',
    language: 'Language',
    close: 'Close',
    widgets: 'Widgets',
    start: 'Start',
    pause: 'Pause',
    reset: 'Reset',
    theme: 'Theme',
    dark: 'Dark',
    light: 'Light',
    neon: 'Neon',
    sunset: 'Sunset',
    ocean: 'Ocean',
    forest: 'Forest',
    notificationSettings: 'Notification Settings',
    workTimeEndMessage: 'Work Time End Message',
    breakTimeEndMessage: 'Break Time End Message',
    timerEndMessage: 'Timer End Message',
  },
}

// 현재 언어 감지 및 설정
const initializeLanguage = () => {
  const savedLang = localStorage.getItem('clockLanguage')
  if (savedLang) {
    settings.value.language = savedLang
  } else {
    // 브라우저 언어 감지
    const browserLang = navigator.language.toLowerCase()
    settings.value.language = browserLang.startsWith('ko') ? 'ko' : 'en'
  }
}

// 테마 적용 함수
const applyTheme = (themeName) => {
  const theme = themes[themeName]
  if (theme) {
    settings.value.theme = themeName
    settings.value.backgroundColor = theme.backgroundColor
    settings.value.timeColor = theme.timeColor
    settings.value.ampmColor = theme.ampmColor
    settings.value.dateColor = theme.dateColor
    settings.value.neonGlowColor = theme.neonGlowColor
    currentTheme.value = themeName
    localStorage.setItem('clockTheme', themeName)
  }
}

// 테마 로드 함수
const loadTheme = () => {
  const savedTheme = localStorage.getItem('clockTheme')
  if (savedTheme && themes[savedTheme]) {
    applyTheme(savedTheme)
  } else {
    applyTheme('dark')
  }
}

// 네온 강도에 따른 text-shadow 계산
const calculateNeonShadow = () => {
  if (!settings.value.neonEnabled) return 'none'
  const color = settings.value.neonGlowColor
  const intensity = settings.value.neonIntensity

  // 강도에 따라 다른 blur radius와 색상 불투명도 적용
  const baseBlur = [5, 10, 15, 20, 25][intensity - 1]
  const multiplier = [1, 1.5, 2, 2.5, 3][intensity - 1]

  const shadow1 = `0 0 ${baseBlur}px ${color}`
  const shadow2 = `0 0 ${baseBlur * multiplier}px ${color}`
  const shadow3 = `0 0 ${baseBlur * multiplier * 2}px ${color}`

  return `${shadow1}, ${shadow2}, ${shadow3}`
}

// 번역 함수
const t = (key) => {
  return translations[settings.value.language]?.[key] || translations.en[key]
}

// 시간 업데이트
const updateTime = () => {
  const now = new Date()
  const m = String(now.getMinutes()).padStart(2, '0')
  const s = String(now.getSeconds()).padStart(2, '0')

  if (settings.value.use24Hour) {
    // 24시간 형식
    const h = String(now.getHours()).padStart(2, '0')
    time.value = `${h}:${m}:${s}`
    ampm.value = ''
  } else {
    // 12시간 형식
    let h = now.getHours()
    const isAm = h < 12
    ampm.value = isAm ? 'AM' : 'PM'
    h = h % 12
    h = h ? h : 12
    const hourString = String(h).padStart(2, '0')
    time.value = `${hourString}:${m}:${s}`
  }

  // 날짜
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const date = String(now.getDate()).padStart(2, '0')
  currentDate.value = `${year}-${month}-${date}`
}

// 전체화면 진입
const enterFullscreen = async () => {
  try {
    await document.documentElement.requestFullscreen()
    isFullscreen.value = true
  } catch (err) {
    console.error(`전체화면 진입 실패: ${err}`)
  }
}

// 전체화면 해제
const exitFullscreen = async () => {
  try {
    if (document.fullscreenElement) {
      await document.exitFullscreen()
      isFullscreen.value = false
    }
  } catch (err) {
    console.error(`전체화면 해제 실패: ${err}`)
  }
}

// 설정 토글
const toggleSettings = () => {
  showSettings.value = !showSettings.value
}

// 배경 클릭시 설정창 닫기
const closeSettingsByBackground = (e) => {
  if (e.target.classList.contains('settings-panel')) {
    showSettings.value = false
  }
}
const handleClickOrKey = (e) => {
  // 드롭다운 메뉴 외부 클릭 시 닫기
  const widgetDropdown = document.querySelector('.widget-dropdown')
  if (widgetDropdown && !widgetDropdown.contains(e.target)) {
    showWidgetMenu.value = false
  }

  // 모드 메뉴 외부 클릭 시 닫기
  const modeDropdown = document.querySelector('.mode-dropdown')
  if (modeDropdown && !modeDropdown.contains(e.target)) {
    showModeMenu.value = false
  }

  if (isFullscreen.value && showSettings.value === false) {
    exitFullscreen()
  }
}

// 설정 저장 (로컬스토리지)
const saveSettings = () => {
  try {
    localStorage.setItem('clockSettings', JSON.stringify(settings.value))
    settingsSaved.value = true
    setTimeout(() => {
      settingsSaved.value = false
    }, 2000)
  } catch (error) {
    console.error('설정 저장 오류:', error)
    showToast('설정 저장 실패', 'error')
  }
}

// 설정 불러오기 (로컬스토리지)
const loadSettings = () => {
  try {
    const saved = localStorage.getItem('clockSettings')
    if (saved) {
      settings.value = JSON.parse(saved)
    }
  } catch (error) {
    console.error('설정 불러오기 오류:', error)
  }
}

// 설정 초기화
const resetSettings = () => {
  if (confirm(t('resetConfirm'))) {
    settings.value = JSON.parse(JSON.stringify(defaultSettings))
    initializeLanguage()
    showToast(t('resetBtn') + ' 완료', 'success')
  }
}

// 시간 계산 (아날로그)
const getAnalogTime = computed(() => {
  const parts = time.value.split(':')
  const h = parseInt(parts[0])
  const m = parseInt(parts[1])
  const s = parseInt(parts[2])
  return {
    hourDegree: (h % 12) * 30 + m * 0.5,
    minuteDegree: m * 6 + s * 0.1,
    secondDegree: s * 6,
  }
})

const timeChars = computed(() => time.value.split(''))

// 뽀모도로 함수
const togglePomodoro = () => {
  // 중복 실행 방지
  if (pomodoroIsRunning.value) {
    clearInterval(pomodoroTimer)
    pomodoroIsRunning.value = false
    return
  }

  pomodoroIsRunning.value = true
  pomodoroTimer = setInterval(() => {
    pomodoroTimeLeft.value--
    if (pomodoroTimeLeft.value <= 0) {
      playAlarmSound()
      if (pomodoroIsWorkTime.value) {
        pomodoroIsWorkTime.value = false
        pomodoroTimeLeft.value = settings.value.pomodoroBreakMinutes * 60
        showToast(settings.value.workTimeEndMessage, 'success')
      } else {
        pomodoroIsWorkTime.value = true
        pomodoroTimeLeft.value = settings.value.pomodoroWorkMinutes * 60
        showToast(settings.value.breakTimeEndMessage, 'success')
      }
    }
  }, 1000)
}

const resetPomodoro = () => {
  clearInterval(pomodoroTimer)
  pomodoroIsRunning.value = false
  pomodoroIsWorkTime.value = true
  pomodoroTimeLeft.value = settings.value.pomodoroWorkMinutes * 60
}

const formatTime = (seconds) => {
  const mins = String(Math.floor(seconds / 60)).padStart(2, '0')
  const secs = String(seconds % 60).padStart(2, '0')
  return `${mins}:${secs}`
}

// 스톱워치 시간 포맷 (밀리초 포함)
const formatStopwatchTime = (milliseconds) => {
  const totalSeconds = Math.floor(milliseconds / 1000)
  const mins = String(Math.floor(totalSeconds / 60)).padStart(2, '0')
  const secs = String(totalSeconds % 60).padStart(2, '0')
  const ms = String(Math.floor((milliseconds % 1000) / 10)).padStart(2, '0')
  return `${mins}:${secs}.${ms}`
}
const playAlarmSound = () => {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)()

  // 3번 반복 비프음
  for (let i = 0; i < 3; i++) {
    setTimeout(() => {
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      oscillator.frequency.value = 1000
      oscillator.type = 'sine'

      gainNode.gain.setValueAtTime(0.4, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3)

      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.3)
    }, i * 400)
  }
}

// 타이머 함수
const startTimer = () => {
  // 중복 실행 방지 & 유효성 검사
  if (timerIsRunning.value) {
    clearInterval(timerInterval)
    timerIsRunning.value = false
    return
  }

  // 입력값 검증
  if ((!timerInputMinutes.value && !timerInputSeconds.value) || (timerInputMinutes.value <= 0 && timerInputSeconds.value <= 0)) {
    showToast(t('invalidInput'), 'warning')
    timerInputMinutes.value = 1
    timerInputSeconds.value = 0
    return
  }

  timerTimeLeft.value = Math.max(1, Math.floor(timerInputMinutes.value)) * 60 + Math.max(0, Math.floor(timerInputSeconds.value))
  timerIsRunning.value = true
  timerInterval = setInterval(() => {
    timerTimeLeft.value--
    if (timerTimeLeft.value <= 0) {
      clearInterval(timerInterval)
      timerIsRunning.value = false
      playAlarmSound()
      showToast(settings.value.timerEndMessage, 'success')
    }
  }, 1000)
}

const pauseTimer = () => {
  timerIsRunning.value = false
  clearInterval(timerInterval)
}

const resetTimerWidget = () => {
  clearInterval(timerInterval)
  timerIsRunning.value = false
  timerTimeLeft.value = Math.max(1, Math.floor(timerInputMinutes.value)) * 60 + Math.max(0, Math.floor(timerInputSeconds.value))
}

// 스탑워치 함수
const toggleStopwatch = () => {
  stopwatchIsRunning.value = !stopwatchIsRunning.value
  if (stopwatchIsRunning.value) {
    stopwatchInterval = setInterval(() => {
      stopwatchTime.value += 10 // 10ms 단위로 증가
    }, 10)
  } else {
    clearInterval(stopwatchInterval)
  }
}

const recordStopwatch = () => {
  if (stopwatchIsRunning.value) {
    const lapTime = stopwatchTime.value - stopwatchLastRecordTime.value
    stopwatchRecords.value.unshift({
      totalTime: stopwatchTime.value,
      lapTime: lapTime,
    })
    stopwatchLastRecordTime.value = stopwatchTime.value
    // 자동 스크롤
    nextTick(() => {
      const recordsList = document.querySelector('.records-list')
      if (recordsList) {
        recordsList.scrollTop = 0
      }
      const widgetRecordsList = document.querySelector('.widget-records-list')
      if (widgetRecordsList) {
        widgetRecordsList.scrollTop = 0
      }
    })
  }
}

const resetStopwatch = () => {
  clearInterval(stopwatchInterval)
  stopwatchIsRunning.value = false
  stopwatchTime.value = 0
  stopwatchRecords.value = []
  stopwatchLastRecordTime.value = 0
}

// 드래그 함수
const startDragPomodoro = (e) => {
  isDraggingPomodoro.value = true
  dragStartPos.value = {
    x: e.clientX - pomodoroPosition.value.x,
    y: e.clientY - pomodoroPosition.value.y,
  }
}

const moveDragPomodoro = (e) => {
  if (!isDraggingPomodoro.value) return
  const newX = e.clientX - dragStartPos.value.x
  const newY = e.clientY - dragStartPos.value.y

  // 화면 경계 제약 (200px 크기 기준)
  pomodoroPosition.value = {
    x: Math.max(0, Math.min(newX, window.innerWidth - 200)),
    y: Math.max(0, Math.min(newY, window.innerHeight - 200)),
  }
}

const endDragPomodoro = () => {
  isDraggingPomodoro.value = false
}

// 타이머 드래그 함수
const startDragTimer = (e) => {
  isDraggingTimer.value = true
  dragStartPosTimer.value = {
    x: e.clientX - timerPosition.value.x,
    y: e.clientY - timerPosition.value.y,
  }
}

const moveDragTimer = (e) => {
  if (!isDraggingTimer.value) return
  const newX = e.clientX - dragStartPosTimer.value.x
  const newY = e.clientY - dragStartPosTimer.value.y

  // 화면 경계 제약 (200px 크기 기준)
  timerPosition.value = {
    x: Math.max(0, Math.min(newX, window.innerWidth - 200)),
    y: Math.max(0, Math.min(newY, window.innerHeight - 200)),
  }
}

const endDragTimer = () => {
  isDraggingTimer.value = false
}

// 스탑워치 드래그 함수
const startDragStopwatch = (e) => {
  isDraggingStopwatch.value = true
  dragStartPosStopwatch.value = {
    x: e.clientX - stopwatchPosition.value.x,
    y: e.clientY - stopwatchPosition.value.y,
  }
}

const moveDragStopwatch = (e) => {
  if (!isDraggingStopwatch.value) return
  const newX = e.clientX - dragStartPosStopwatch.value.x
  const newY = e.clientY - dragStartPosStopwatch.value.y

  // 화면 경계 제약 (200px 크기 기준)
  stopwatchPosition.value = {
    x: Math.max(0, Math.min(newX, window.innerWidth - 200)),
    y: Math.max(0, Math.min(newY, window.innerHeight - 200)),
  }
}

const endDragStopwatch = () => {
  isDraggingStopwatch.value = false
}

// 뽀모도로 리사이즈 함수 (제거됨)
// 타이머 리사이즈 함수 (제거됨)
// 스톱워치 리사이즈 함수 (제거됨)

let timer

onMounted(() => {
  loadSettings()
  initializeLanguage()
  loadTheme()

  // 뽀모도로 초기값 설정
  pomodoroWorkTime.value = settings.value.pomodoroWorkMinutes * 60
  pomodoroBreakTime.value = settings.value.pomodoroBreakMinutes * 60
  pomodoroTimeLeft.value = settings.value.pomodoroWorkMinutes * 60

  // 설정 변경 시 뽀모도로 시간 동기화 (중복 제거)
  watch(() => settings.value.pomodoroWorkMinutes, (newVal) => {
    pomodoroWorkTime.value = newVal * 60
    if (!pomodoroIsRunning.value && pomodoroIsWorkTime.value) {
      pomodoroTimeLeft.value = newVal * 60
    }
  })
  watch(() => settings.value.pomodoroBreakMinutes, (newVal) => {
    pomodoroBreakTime.value = newVal * 60
    if (!pomodoroIsRunning.value && !pomodoroIsWorkTime.value) {
      pomodoroTimeLeft.value = newVal * 60
    }
  })

  updateTime()
  timer = setInterval(updateTime, 1000)
  document.addEventListener('click', handleClickOrKey)
  document.addEventListener('keydown', handleClickOrKey)
  document.addEventListener('mousemove', moveDragPomodoro)
  document.addEventListener('mouseup', endDragPomodoro)
  document.addEventListener('mousemove', moveDragTimer)
  document.addEventListener('mouseup', endDragTimer)
  document.addEventListener('mousemove', moveDragStopwatch)
  document.addEventListener('mouseup', endDragStopwatch)
  document.addEventListener('fullscreenchange', () => {
    isFullscreen.value = !!document.fullscreenElement
  })
})

onUnmounted(() => {
  clearInterval(timer)
  clearInterval(pomodoroTimer)
  clearInterval(timerInterval)
  clearInterval(stopwatchInterval)
  document.removeEventListener('click', handleClickOrKey)
  document.removeEventListener('keydown', handleClickOrKey)
  document.removeEventListener('mousemove', moveDragPomodoro)
  document.removeEventListener('mouseup', endDragPomodoro)
  document.removeEventListener('mousemove', moveDragTimer)
  document.removeEventListener('mouseup', endDragTimer)
  document.removeEventListener('mousemove', moveDragStopwatch)
  document.removeEventListener('mouseup', endDragStopwatch)
})

// 감시자
watch(settings, saveSettings, { deep: true })
watch(() => settings.value.language, (newLang) => {
  localStorage.setItem('clockLanguage', newLang)
})
watch(() => settings.value.theme, (newTheme) => {
  localStorage.setItem('clockTheme', newTheme)
})
</script>

<template>
  <div class="clock-container" :style="{ backgroundColor: settings.backgroundColor, fontFamily: settings.fontFamily }" :key="settings.fontFamily">
    <!-- Toast 알림 -->
    <Toast :message="toastMessage" :type="toastType" />

    <!-- 상단 버튼들 -->
    <div class="top-bar">
      <!-- 왼쪽: 모드 메뉴 & 설정 버튼 -->
      <div class="left-buttons" v-if="!isFullscreen">
        <!-- 모드 드롭다운 메뉴 -->
        <div class="mode-dropdown" @click.stop>
          <button class="mode-menu-btn" @click="showModeMenu = !showModeMenu" title="모드">
            {{ t('mode') }}
          </button>
          <div v-if="showModeMenu" class="dropdown-menu" @click.stop>
            <button
              class="dropdown-item"
              :class="{ active: clockMode === 'clock' }"
              @click="clockMode = 'clock'; showModeMenu = false"
            >
              🕐 {{ t('clock') }}
            </button>
            <button
              class="dropdown-item"
              :class="{ active: clockMode === 'timer' }"
              @click="clockMode = 'timer'; showModeMenu = false"
            >
              ⏲️ {{ t('timer') }}
            </button>
            <button
              class="dropdown-item"
              :class="{ active: clockMode === 'stopwatch' }"
              @click="clockMode = 'stopwatch'; showModeMenu = false"
            >
              ⏱️ {{ t('stopwatch') }}
            </button>
            <button
              class="dropdown-item"
              :class="{ active: clockMode === 'pomodoro' }"
              @click="clockMode = 'pomodoro'; showModeMenu = false"
            >
              🍅 {{ t('pomodoro') }}
            </button>
          </div>
        </div>

        <button class="settings-btn" @click="toggleSettings" title="설정">
          ⚙️
        </button>
      </div>

      <!-- 오른쪽: 기능 버튼들 -->
      <div class="feature-buttons" v-if="!isFullscreen">
        <!-- 위젯 드롭다운 메뉴 -->
        <div class="widget-dropdown" @click.stop>
          <button class="widget-menu-btn" @click="showWidgetMenu = !showWidgetMenu" title="위젯">
            {{ t('widgets') }}
          </button>
          <div v-if="showWidgetMenu" class="dropdown-menu" @click.stop>
            <button
              class="dropdown-item"
              :class="{ active: activeWidget.pomodoro }"
              @click="activeWidget.pomodoro = !activeWidget.pomodoro"
            >
              {{ activeWidget.pomodoro ? '✓ ' : '' }}{{ t('pomodoro') }}
            </button>
            <button
              class="dropdown-item"
              :class="{ active: activeWidget.timer }"
              @click="activeWidget.timer = !activeWidget.timer"
            >
              {{ activeWidget.timer ? '✓ ' : '' }}{{ t('timer') }}
            </button>
            <button
              class="dropdown-item"
              :class="{ active: activeWidget.stopwatch }"
              @click="activeWidget.stopwatch = !activeWidget.stopwatch"
            >
              {{ activeWidget.stopwatch ? '✓ ' : '' }}{{ t('stopwatch') }}
            </button>
          </div>
        </div>

        <button class="fullscreen-btn" @click="enterFullscreen" title="전체화면">
          ⛶ FULL
        </button>
      </div>
    </div>

    <!-- 설정 패널 -->
    <div v-if="showSettings" class="settings-panel" @click="closeSettingsByBackground">
      <div class="settings-header">
        <h2>{{ t('settings') }}</h2>
        <div class="settings-header-status">
          <span v-if="settingsSaved" class="saved-indicator">✓ Saved</span>
        </div>
        <button class="close-btn" @click="toggleSettings">✕</button>
      </div>

      <div class="settings-content">
        <!-- 시계 타입 선택 -->
        <div class="setting-group">
          <label>{{ t('clockFormat') }}</label>
          <div class="checkbox-group">
            <label>
              <input type="checkbox" v-model="settings.showDigital" />
              {{ t('digital') }}
            </label>
            <label>
              <input type="checkbox" v-model="settings.showAnalog" />
              {{ t('analog') }}
            </label>
          </div>
        </div>

        <!-- AM/PM 표시 -->
        <div class="setting-group">
          <label>
            <input type="checkbox" v-model="settings.showAmPm" />
            {{ t('showAmPm') }}
          </label>
        </div>

        <!-- 날짜 표시 -->
        <div class="setting-group">
          <label>
            <input type="checkbox" v-model="settings.showDate" />
            {{ t('showDate') }}
          </label>
        </div>

        <!-- 네온 효과 -->
        <div class="setting-group">
          <label>
            <input type="checkbox" v-model="settings.neonEnabled" />
            {{ t('neonEffect') }}
          </label>
        </div>

        <!-- 시계 크기 조절 -->
        <div class="setting-group">
          <label>{{ t('clockSize') }}: {{ Math.round(settings.fontSize * 100) }}%</label>
          <input type="range" v-model.number="settings.fontSize" min="0.5" max="1" step="0.1" />
        </div>

        <!-- 배경색상 설정 -->
        <div class="setting-group">
          <label>{{ t('bgColor') }}</label>
          <input type="color" v-model="settings.backgroundColor" />
        </div>

        <!-- 24시간 형식 -->
        <div class="setting-group">
          <label>
            <input type="checkbox" v-model="settings.use24Hour" />
            {{ t('timeFormat24h') }}
          </label>
        </div>

        <!-- 뽀모도로 작업 시간 -->
        <div class="setting-group">
          <label>{{ t('pomodoroWorkTime') }}</label>
          <div class="time-input-group">
            <button class="time-btn" @click="settings.pomodoroWorkMinutes = Math.max(1, settings.pomodoroWorkMinutes - 1)">−</button>
            <input v-model.number="settings.pomodoroWorkMinutes" type="number" min="1" max="60" class="time-input" />
            <span class="time-unit">{{ t('minutes') }}</span>
            <button class="time-btn" @click="settings.pomodoroWorkMinutes = Math.min(60, settings.pomodoroWorkMinutes + 1)">+</button>
          </div>
        </div>

        <!-- 뽀모도로 휴식 시간 -->
        <div class="setting-group">
          <label>{{ t('pomodoroBreakTime') }}</label>
          <div class="time-input-group">
            <button class="time-btn" @click="settings.pomodoroBreakMinutes = Math.max(1, settings.pomodoroBreakMinutes - 1)">−</button>
            <input v-model.number="settings.pomodoroBreakMinutes" type="number" min="1" max="30" class="time-input" />
            <span class="time-unit">{{ t('minutes') }}</span>
            <button class="time-btn" @click="settings.pomodoroBreakMinutes = Math.min(30, settings.pomodoroBreakMinutes + 1)">+</button>
          </div>
        </div>

        <!-- 폰트 선택 -->
        <div class="setting-group">
          <label>{{ t('font') }}</label>
          <select v-model="settings.fontFamily" class="font-select">
            <option value="Orbitron">Orbitron</option>
            <option value="Arial">Arial</option>
            <option value="Helvetica">Helvetica</option>
            <option value="Verdana">Verdana</option>
            <option value="Georgia">Georgia</option>
            <option value="Times New Roman">Times New Roman</option>
            <option value="Courier New">Courier New</option>
          </select>
        </div>

        <!-- 색상 설정 -->
        <div class="setting-group">
          <label>{{ t('timeColor') }}</label>
          <input type="color" v-model="settings.timeColor" />
        </div>

        <div class="setting-group">
          <label>{{ t('ampmColor') }}</label>
          <input type="color" v-model="settings.ampmColor" />
        </div>

        <div class="setting-group">
          <label>{{ t('dateColor') }}</label>
          <input type="color" v-model="settings.dateColor" />
        </div>

        <!-- 네온 글로우 색상 및 강도 -->
        <div v-if="settings.neonEnabled" class="setting-group">
          <label>{{ t('neonColor') }}</label>
          <input type="color" v-model="settings.neonGlowColor" />
        </div>

        <div v-if="settings.neonEnabled" class="setting-group">
          <label>{{ t('neonIntensity') }}: {{ settings.neonIntensity }}</label>
          <div class="intensity-slider-container">
            <input
              type="range"
              v-model.number="settings.neonIntensity"
              min="1"
              max="5"
              class="intensity-slider"
            />
            <div class="intensity-labels">
              <span>약</span>
              <span>강</span>
            </div>
          </div>
        </div>

        <!-- 테마 설정 -->
        <div class="setting-group">
          <label>{{ t('theme') }}</label>
          <div class="theme-selector">
            <button
              v-for="(theme, themeName) in themes"
              :key="themeName"
              class="theme-btn"
              :class="{ active: settings.theme === themeName }"
              :title="theme.name"
              @click="applyTheme(themeName)"
            >
              <span class="theme-color" :style="{ backgroundColor: theme.primary }"></span>
              {{ theme.name }}
            </button>
          </div>
        </div>

        <!-- 언어 설정 -->
        <div class="setting-group">
          <label>{{ t('language') }}</label>
          <select v-model="settings.language" class="font-select">
            <option value="ko">{{ t('language') }}</option>
            <option value="en">{{ t('language') }}</option>
          </select>
        </div>

        <!-- 알림 메시지 커스터마이징 -->
        <div class="settings-divider"></div>
        <div class="setting-group">
          <label style="font-weight: 600; font-size: 1.1rem;">{{ t('notificationSettings') }}</label>
        </div>

        <div class="setting-group">
          <label>{{ t('workTimeEndMessage') }}</label>
          <textarea
            v-model="settings.workTimeEndMessage"
            class="notification-textarea"
            rows="2"
          ></textarea>
        </div>

        <div class="setting-group">
          <label>{{ t('breakTimeEndMessage') }}</label>
          <textarea
            v-model="settings.breakTimeEndMessage"
            class="notification-textarea"
            rows="2"
          ></textarea>
        </div>

        <div class="setting-group">
          <label>{{ t('timerEndMessage') }}</label>
          <textarea
            v-model="settings.timerEndMessage"
            class="notification-textarea"
            rows="2"
          ></textarea>
        </div>

        <!-- 초기화 버튼 -->
        <div class="setting-group">
          <button class="reset-btn" @click="resetSettings">{{ t('resetBtn') }}</button>
        </div>
      </div>
    </div>

    <!-- 뽀모도로 위젯 -->
    <div v-if="activeWidget.pomodoro" class="pomodoro-widget" :style="{ left: pomodoroPosition.x + 'px', top: pomodoroPosition.y + 'px' }">
      <div class="widget-box" @mousedown="startDragPomodoro" :class="{ dragging: isDraggingPomodoro }">
        <div class="widget-header">
          <h3>🍅</h3>
          <button class="widget-close" @click="activeWidget.pomodoro = false">✕</button>
        </div>
        <div class="timer-display-small">{{ formatTime(pomodoroTimeLeft) }}</div>
        <div class="timer-status">{{ pomodoroIsWorkTime ? t('work') : t('break') }}</div>
        <div class="widget-buttons">
          <button class="action-btn-small" @click="togglePomodoro">
            {{ pomodoroIsRunning ? '⏸' : '▶️' }}
          </button>
          <button class="action-btn-small reset" @click="resetPomodoro">🔄</button>
        </div>
      </div>
    </div>

    <!-- 타이머 위젯 -->
    <div v-if="activeWidget.timer" class="timer-widget" :style="{ left: timerPosition.x + 'px', top: timerPosition.y + 'px' }">
      <div class="widget-box" @mousedown="startDragTimer" :class="{ dragging: isDraggingTimer }">
        <div class="widget-header">
          <h3>⏲️</h3>
          <button class="widget-close" @click="activeWidget.timer = false">✕</button>
        </div>
        <div v-if="!timerIsRunning" class="timer-input-widget">
          <div class="timer-input-widget-group">
            <div class="timer-input-widget-item">
              <button class="time-btn-compact" @click="timerInputMinutes = Math.max(0, timerInputMinutes - 1)">−</button>
              <input v-model.number="timerInputMinutes" type="number" min="0" max="59" class="time-input-compact" />
              <span class="time-unit-compact">m</span>
              <button class="time-btn-compact" @click="timerInputMinutes = Math.min(59, timerInputMinutes + 1)">+</button>
            </div>
            <div class="timer-input-widget-item">
              <button class="time-btn-compact" @click="timerInputSeconds = Math.max(0, timerInputSeconds - 1)">−</button>
              <input v-model.number="timerInputSeconds" type="number" min="0" max="59" class="time-input-compact" />
              <span class="time-unit-compact">s</span>
              <button class="time-btn-compact" @click="timerInputSeconds = Math.min(59, timerInputSeconds + 1)">+</button>
            </div>
          </div>
        </div>
        <div class="timer-display-small">{{ formatTime(timerTimeLeft) }}</div>
        <div class="widget-buttons">
          <button v-if="!timerIsRunning" class="action-btn-small" @click="startTimer">▶️</button>
          <button v-if="timerIsRunning" class="action-btn-small" @click="pauseTimer">⏸</button>
          <button class="action-btn-small reset" @click="resetTimerWidget">🔄</button>
        </div>
      </div>
    </div>

    <!-- 스탑워치 위젯 -->
    <div v-if="activeWidget.stopwatch" class="stopwatch-widget" :style="{ left: stopwatchPosition.x + 'px', top: stopwatchPosition.y + 'px' }">
      <div class="widget-box stopwatch-widget-box" @mousedown="startDragStopwatch" :class="{ dragging: isDraggingStopwatch }">
        <div class="widget-header">
          <h3>⏱️</h3>
          <button class="widget-close" @click="activeWidget.stopwatch = false">✕</button>
        </div>
        <div class="timer-display-small">{{ formatStopwatchTime(stopwatchTime) }}</div>
        <div class="widget-buttons">
          <button class="action-btn-small" @click="toggleStopwatch">
            {{ stopwatchIsRunning ? '⏸' : '▶️' }}
          </button>
          <button v-if="stopwatchIsRunning" class="action-btn-small record" @click="recordStopwatch">📍</button>
          <button class="action-btn-small reset" @click="resetStopwatch">🔄</button>
        </div>
        <!-- Records List in Widget -->
        <div v-if="stopwatchRecords.length > 0" class="widget-records">
          <div class="widget-records-title">Records</div>
          <div class="widget-records-list">
            <div v-for="(record, index) in stopwatchRecords" :key="index" class="widget-record-item">
              <span class="widget-record-num">#{{ index + 1 }}</span>
              <span class="widget-record-time">{{ formatStopwatchTime(record.lapTime) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 시계 표시 영역 -->
    <div v-if="clockMode === 'clock'"
      class="clock-box"
      :class="{
        'neon-enabled': settings.neonEnabled,
        fullscreen: isFullscreen,
      }"
      :style="{
        '--time-color': settings.timeColor,
        '--ampm-color': settings.ampmColor,
        '--date-color': settings.dateColor,
        '--neon-color': settings.neonGlowColor,
        '--font-size': settings.fontSize,
        '--text-shadow': calculateNeonShadow(),
      }"
    >
      <!-- 디지털 시계 -->
      <div v-if="settings.showDigital && !settings.showAnalog" class="digital-clock">
        <div class="time" :style="{ color: settings.timeColor, fontFamily: getDigitalClockFont }">
          <span
            v-for="(char, index) in timeChars"
            :key="index"
            class="time-char"
            :class="{ separator: char === ':' }"
          >
            {{ char }}
          </span>
        </div>
        <div v-if="settings.showAmPm" class="ampm" :style="{ color: settings.ampmColor }">
          {{ ampm }}
        </div>
        <div v-if="settings.showDate" class="date" :style="{ color: settings.dateColor }">
          {{ currentDate }}
        </div>
      </div>

      <!-- 아날로그 시계 -->
      <div v-if="settings.showAnalog && !settings.showDigital" class="analog-clock">
        <div class="clock-face">
          <!-- 숫자 마커 (12부터 11까지) -->
          <div class="marker marker-12">12</div>
          <div class="marker marker-1">1</div>
          <div class="marker marker-2">2</div>
          <div class="marker marker-3">3</div>
          <div class="marker marker-4">4</div>
          <div class="marker marker-5">5</div>
          <div class="marker marker-6">6</div>
          <div class="marker marker-7">7</div>
          <div class="marker marker-8">8</div>
          <div class="marker marker-9">9</div>
          <div class="marker marker-10">10</div>
          <div class="marker marker-11">11</div>

          <!-- 바늘 -->
          <div
            class="hand hour-hand"
            :style="{ transform: `rotate(${getAnalogTime.hourDegree}deg)` }"
          ></div>
          <div
            class="hand minute-hand"
            :style="{ transform: `rotate(${getAnalogTime.minuteDegree}deg)` }"
          ></div>
          <div
            class="hand second-hand"
            :style="{ transform: `rotate(${getAnalogTime.secondDegree}deg)` }"
          ></div>
          <div class="center-dot"></div>
        </div>
        <div v-if="settings.showAmPm" class="ampm-analog" :style="{ color: settings.ampmColor }">
          {{ ampm }}
        </div>
        <div v-if="settings.showDate" class="date" :style="{ color: settings.dateColor }">
          {{ currentDate }}
        </div>
      </div>

      <!-- 디지털+아날로그 시계 -->
      <div v-if="settings.showDigital && settings.showAnalog" class="combined-clock">
        <!-- 아날로그 시계 (위에 표시) -->
        <div class="analog-clock">
          <div class="clock-face">
            <!-- 숫자 마커 (12부터 11까지) -->
            <div class="marker marker-12">12</div>
            <div class="marker marker-1">1</div>
            <div class="marker marker-2">2</div>
            <div class="marker marker-3">3</div>
            <div class="marker marker-4">4</div>
            <div class="marker marker-5">5</div>
            <div class="marker marker-6">6</div>
            <div class="marker marker-7">7</div>
            <div class="marker marker-8">8</div>
            <div class="marker marker-9">9</div>
            <div class="marker marker-10">10</div>
            <div class="marker marker-11">11</div>

            <!-- 바늘 -->
            <div
              class="hand hour-hand"
              :style="{ transform: `rotate(${getAnalogTime.hourDegree}deg)` }"
            ></div>
            <div
              class="hand minute-hand"
              :style="{ transform: `rotate(${getAnalogTime.minuteDegree}deg)` }"
            ></div>
            <div
              class="hand second-hand"
              :style="{ transform: `rotate(${getAnalogTime.secondDegree}deg)` }"
            ></div>
            <div class="center-dot"></div>
          </div>
        </div>

        <!-- 디지털 시계 (아래에 표시) -->
        <div class="digital-clock">
          <div class="time" :style="{ color: settings.timeColor, fontFamily: getDigitalClockFont }">
            <span
              v-for="(char, index) in timeChars"
              :key="index"
              class="time-char"
              :class="{ separator: char === ':' }"
            >
              {{ char }}
            </span>
          </div>
          <div v-if="settings.showAmPm" class="ampm" :style="{ color: settings.ampmColor }">
            {{ ampm }}
          </div>
          <div v-if="settings.showDate" class="date" :style="{ color: settings.dateColor }">
            {{ currentDate }}
          </div>
        </div>
      </div>
    </div>

    <!-- 타이머 모드 -->
    <div v-if="clockMode === 'timer'" class="mode-box fullscreen-mode">
      <!-- 모드 선택 메뉴 -->
      <div class="mode-menu-top">
        <button class="mode-switch-btn" @click="clockMode = 'clock'" title="시계">🕐</button>
        <button class="mode-switch-btn active" @click="clockMode = 'timer'" title="타이머">⏲️</button>
        <button class="mode-switch-btn" @click="clockMode = 'stopwatch'" title="스톱워치">⏱️</button>
        <button class="mode-switch-btn" @click="clockMode = 'pomodoro'" title="뽀모도로">🍅</button>
        <button class="mode-switch-btn fullscreen-btn-mode" @click="enterFullscreen" title="전체화면">⛶</button>
      </div>
      <div class="mode-display">
        <div class="mode-title">{{ t('timer') }}</div>
        <div v-if="!timerIsRunning" class="timer-input-large">
          <div class="timer-input-group-large">
            <div class="timer-input-item">
              <button class="time-btn-large" @click="timerInputMinutes = Math.max(0, timerInputMinutes - 1)">−</button>
              <input v-model.number="timerInputMinutes" type="number" min="0" max="59" class="timer-input-large-field" />
              <span class="timer-input-label">min</span>
              <button class="time-btn-large" @click="timerInputMinutes = Math.min(59, timerInputMinutes + 1)">+</button>
            </div>
            <div class="timer-input-item">
              <button class="time-btn-large" @click="timerInputSeconds = Math.max(0, timerInputSeconds - 1)">−</button>
              <input v-model.number="timerInputSeconds" type="number" min="0" max="59" class="timer-input-large-field" />
              <span class="timer-input-label">sec</span>
              <button class="time-btn-large" @click="timerInputSeconds = Math.min(59, timerInputSeconds + 1)">+</button>
            </div>
          </div>
          <div v-if="timerInputMinutes === 0 && timerInputSeconds === 0" class="timer-warning">
            ⚠ 최소 1초 이상 설정해주세요
          </div>
        </div>
        <div class="timer-display-large">{{ formatTime(timerTimeLeft) }}</div>
        <div class="mode-buttons">
          <button v-if="!timerIsRunning" class="action-btn-large" @click="startTimer">▶️ {{ t('start') }}</button>
          <button v-if="timerIsRunning" class="action-btn-large" @click="pauseTimer">⏸ {{ t('pause') }}</button>
          <button class="action-btn-large reset" @click="resetTimerWidget">🔄 {{ t('reset') }}</button>
        </div>
      </div>
    </div>

    <!-- 스톱워치 모드 -->
    <div v-if="clockMode === 'stopwatch'" class="mode-box fullscreen-mode">
      <!-- 모드 선택 메뉴 -->
      <div class="mode-menu-top">
        <button class="mode-switch-btn" @click="clockMode = 'clock'" title="시계">🕐</button>
        <button class="mode-switch-btn" @click="clockMode = 'timer'" title="타이머">⏲️</button>
        <button class="mode-switch-btn active" @click="clockMode = 'stopwatch'" title="스톱워치">⏱️</button>
        <button class="mode-switch-btn" @click="clockMode = 'pomodoro'" title="뽀모도로">🍅</button>
        <button class="mode-switch-btn fullscreen-btn-mode" @click="enterFullscreen" title="전체화면">⛶</button>
      </div>
      <div class="mode-display stopwatch-mode-container">
        <div class="stopwatch-left">
          <div class="mode-title">{{ t('stopwatch') }}</div>
          <div class="timer-display-large">{{ formatStopwatchTime(stopwatchTime) }}</div>
          <div class="mode-buttons">
            <button class="action-btn-large" @click="toggleStopwatch">
              {{ stopwatchIsRunning ? '⏸ ' + t('pause') : '▶️ ' + t('start') }}
            </button>
            <button v-if="stopwatchIsRunning" class="action-btn-large record-btn" @click="recordStopwatch">📍 Record</button>
            <button class="action-btn-large reset" @click="resetStopwatch">🔄 {{ t('reset') }}</button>
          </div>
        </div>
        <!-- Records List on the right -->
        <div class="stopwatch-right">
          <div class="records-title">Records</div>
          <div class="records-list">
            <div v-if="stopwatchRecords.length === 0" class="records-empty">
              No records yet
            </div>
            <div v-for="(record, index) in stopwatchRecords" :key="index" class="record-item">
              <span class="record-item-label">#{{ index + 1 }}</span>
              <div class="record-item-times">
                <div class="record-item-lap">
                  <span class="record-item-lap-label">Lap</span>
                  <span>{{ formatStopwatchTime(record.lapTime) }}</span>
                </div>
                <div class="record-item-total">
                  <span class="record-item-total-label">Total</span>
                  <span>{{ formatStopwatchTime(record.totalTime) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 뽀모도로 모드 -->
    <div v-if="clockMode === 'pomodoro'" class="mode-box fullscreen-mode">
      <!-- 모드 선택 메뉴 -->
      <div class="mode-menu-top">
        <button class="mode-switch-btn" @click="clockMode = 'clock'" title="시계">🕐</button>
        <button class="mode-switch-btn" @click="clockMode = 'timer'" title="타이머">⏲️</button>
        <button class="mode-switch-btn" @click="clockMode = 'stopwatch'" title="스톱워치">⏱️</button>
        <button class="mode-switch-btn active" @click="clockMode = 'pomodoro'" title="뽀모도로">🍅</button>
        <button class="mode-switch-btn fullscreen-btn-mode" @click="enterFullscreen" title="전체화면">⛶</button>
      </div>
      <div class="mode-display">
        <div class="mode-title">{{ t('pomodoro') }} - {{ pomodoroIsWorkTime ? t('work') : t('break') }}</div>
        <div class="timer-display-large">{{ formatTime(pomodoroTimeLeft) }}</div>
        <div class="mode-buttons">
          <button class="action-btn-large" @click="togglePomodoro">
            {{ pomodoroIsRunning ? '⏸ ' + t('pause') : '▶️ ' + t('start') }}
          </button>
          <button class="action-btn-large reset" @click="resetPomodoro">🔄 {{ t('reset') }}</button>
        </div>
        <!-- Pomodoro 시간 설정 -->
        <div class="pomodoro-settings">
          <div class="pomodoro-setting-item">
            <label>{{ t('work') }}</label>
            <div class="time-input-group-compact">
              <button class="time-btn-compact" @click="settings.pomodoroWorkMinutes = Math.max(1, settings.pomodoroWorkMinutes - 1)">−</button>
              <input v-model.number="settings.pomodoroWorkMinutes" type="number" min="1" max="60" class="time-input-compact" />
              <span class="time-unit-compact">min</span>
              <button class="time-btn-compact" @click="settings.pomodoroWorkMinutes = Math.min(60, settings.pomodoroWorkMinutes + 1)">+</button>
            </div>
          </div>
          <div class="pomodoro-setting-item">
            <label>{{ t('break') }}</label>
            <div class="time-input-group-compact">
              <button class="time-btn-compact" @click="settings.pomodoroBreakMinutes = Math.max(1, settings.pomodoroBreakMinutes - 1)">−</button>
              <input v-model.number="settings.pomodoroBreakMinutes" type="number" min="1" max="30" class="time-input-compact" />
              <span class="time-unit-compact">min</span>
              <button class="time-btn-compact" @click="settings.pomodoroBreakMinutes = Math.min(30, settings.pomodoroBreakMinutes + 1)">+</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap');

:root {
  --time-color: #7C3AED;
  --ampm-color: #E0E7FF;
  --date-color: #7C3AED;
  --neon-color: #5B21B6;
  --font-size: 1;
}

html,
body,
#app {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: #0F0F1F;
  font-family: inherit;
}

.clock-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 버튼 스타일은 하단에서 통합 */

/* 설정 패널 */
.settings-panel {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(2px);
}

.settings-header {
  position: absolute;
  top: 20px;
  left: 20px;
  right: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #A78BFA;
}

.settings-header h2 {
  margin: 0;
  font-family: inherit;
  font-size: 1.5rem;
}

.settings-header-status {
  flex: 1;
  text-align: center;
}

.saved-indicator {
  color: #10b981;
  font-size: 0.9rem;
  font-weight: 600;
  animation: fadeInOut 2s ease-in-out;
}

@keyframes fadeInOut {
  0% {
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

.close-btn {
  background: none;
  border: none;
  color: #A78BFA;
  font-size: 1.5rem;
  cursor: pointer;
  transition: transform 0.2s;
}

.close-btn:hover {
  transform: scale(1.2);
}

.settings-content {
  position: absolute;
  top: 80px;
  left: 50%;
  transform: translateX(-50%);
  width: 85%;
  max-width: 350px;
  max-height: calc(100% - 120px);
  overflow-y: auto;
  background-color: rgba(5, 5, 5, 0.98);
  border: 2px solid #7C3AED;
  border-radius: 10px;
  padding: 15px;
}

.setting-group {
  margin-bottom: 20px;
  font-family: inherit;
  color: #A78BFA;
}

.setting-group label {
  display: block;
  margin-bottom: 8px;
  cursor: pointer;
}

.setting-group input[type='checkbox'],
.setting-group input[type='radio'] {
  margin-right: 8px;
  cursor: pointer;
}

.radio-group,
.checkbox-group {
  display: flex;
  gap: 15px;
  margin-left: 20px;
}

.setting-group input[type='range'] {
  width: 100%;
  margin-top: 8px;
}

.setting-group input[type='color'] {
  width: 50px;
  height: 40px;
  margin-top: 8px;
  cursor: pointer;
}

/* 알림 메시지 텍스트 영역 */
.notification-textarea {
  width: 100%;
  padding: 10px;
  margin-top: 8px;
  background-color: rgba(124, 58, 237, 0.1);
  color: #A78BFA;
  border: 1px solid #7C3AED;
  border-radius: 6px;
  font-family: 'Orbitron', monospace;
  font-size: 0.9rem;
  line-height: 1.4;
  resize: vertical;
  transition: all 0.2s ease;
}

.notification-textarea:focus {
  outline: none;
  background-color: rgba(124, 58, 237, 0.15);
  border-color: #A78BFA;
  box-shadow: 0 0 10px rgba(124, 58, 237, 0.4);
}

.notification-textarea::placeholder {
  color: rgba(167, 139, 250, 0.5);
}

/* 설정 구분선 */
.settings-divider {
  height: 1px;
  background: linear-gradient(to right, transparent, #7C3AED, transparent);
  margin: 25px 0;
}

/* 네온 강도 슬라이더 */
.intensity-slider-container {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 12px;
}

.intensity-slider {
  flex: 1;
  height: 6px;
  -webkit-appearance: none;
  appearance: none;
  background: linear-gradient(to right, rgba(124, 58, 237, 0.2), rgba(124, 58, 237, 0.5));
  border-radius: 3px;
  outline: none;
  cursor: pointer;
}

.intensity-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: linear-gradient(135deg, #7C3AED, #A78BFA);
  cursor: pointer;
  box-shadow: 0 0 10px rgba(124, 58, 237, 0.6), inset 0 0 5px rgba(0, 0, 0, 0.2);
  transition: all 0.2s ease;
}

.intensity-slider::-webkit-slider-thumb:hover {
  box-shadow: 0 0 15px rgba(124, 58, 237, 0.8), inset 0 0 5px rgba(0, 0, 0, 0.2);
  transform: scale(1.15);
}

.intensity-slider::-moz-range-thumb {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: linear-gradient(135deg, #7C3AED, #A78BFA);
  cursor: pointer;
  border: none;
  box-shadow: 0 0 10px rgba(124, 58, 237, 0.6), inset 0 0 5px rgba(0, 0, 0, 0.2);
  transition: all 0.2s ease;
}

.intensity-slider::-moz-range-thumb:hover {
  box-shadow: 0 0 15px rgba(124, 58, 237, 0.8), inset 0 0 5px rgba(0, 0, 0, 0.2);
  transform: scale(1.15);
}

.intensity-labels {
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  color: #9F7AEA;
  width: 40px;
}

/* 시계 박스 */
.clock-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  font-family: inherit;
  padding: 40px;
}

.clock-box.neon-enabled {
  text-shadow: var(--text-shadow);
}

.clock-box.fullscreen {
  width: 100%;
  height: 100%;
}

/* 디지털 시계 */
.digital-clock {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
}

.time {
  font-size: calc(10vw * var(--font-size));
  font-weight: 700;
  line-height: 1;
  font-variant-numeric: tabular-nums;
  font-feature-settings: 'tnum' 1;
  letter-spacing: 0.05em;
  min-height: calc(10vw * var(--font-size));
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Courier New', monospace;
}

.time-char {
  display: inline-block;
  min-width: 1em;
  text-align: center;
  width: 1em;
}

.time-char.separator {
  opacity: 1;
}

.ampm {
  font-size: calc(10vw * var(--font-size));
  font-weight: 400;
}

.date {
  font-size: calc(3vw * var(--font-size));
  font-weight: 400;
  opacity: 0.8;
}

/* 아날로그 시계 */
.analog-clock {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.clock-face {
  position: relative;
  width: calc(300px * var(--font-size));
  height: calc(300px * var(--font-size));
  border: 4px solid #7C3AED;
  border-radius: 50%;
  background: radial-gradient(circle at 30% 30%, rgba(124, 58, 237, 0.1), rgba(0, 0, 0, 0.5));
}

.twelve-marker {
  position: absolute;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  color: #00ffcc;
  font-weight: 700;
}

.hand {
  position: absolute;
  bottom: 50%;
  left: 50%;
  transform-origin: center bottom;
  background: #A78BFA;
}

.hour-hand {
  width: 6px;
  height: 80px;
  margin-left: -3px;
}

.minute-hand {
  width: 4px;
  height: 110px;
  margin-left: -2px;
}

.second-hand {
  width: 2px;
  height: 120px;
  margin-left: -1px;
  background: #ff0055;
}

.center-dot {
  position: absolute;
  width: 12px;
  height: 12px;
  background: #7C3AED;
  border-radius: 50%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.ampm-analog {
  font-size: calc(5vw * var(--font-size));
  font-weight: 400;
}

/* 아날로그 시계 숫자 마커 */
.marker {
  position: absolute;
  top: 50%;
  left: 50%;
  width: auto;
  height: auto;
  transform-origin: center;
  font-size: calc(1.5vw * var(--font-size));
  font-weight: 700;
  color: var(--time-color);
}

.marker-12 {
  transform: translate(-50%, -50%) rotate(0deg) translateY(-130px) rotate(0deg);
}

.marker-1 {
  transform: translate(-50%, -50%) rotate(30deg) translateY(-130px) rotate(-30deg);
}

.marker-2 {
  transform: translate(-50%, -50%) rotate(60deg) translateY(-130px) rotate(-60deg);
}

.marker-3 {
  transform: translate(-50%, -50%) rotate(90deg) translateY(-130px) rotate(-90deg);
}

.marker-4 {
  transform: translate(-50%, -50%) rotate(120deg) translateY(-130px) rotate(-120deg);
}

.marker-5 {
  transform: translate(-50%, -50%) rotate(150deg) translateY(-130px) rotate(-150deg);
}

.marker-6 {
  transform: translate(-50%, -50%) rotate(180deg) translateY(-130px) rotate(-180deg);
}

.marker-7 {
  transform: translate(-50%, -50%) rotate(210deg) translateY(-130px) rotate(-210deg);
}

.marker-8 {
  transform: translate(-50%, -50%) rotate(240deg) translateY(-130px) rotate(-240deg);
}

.marker-9 {
  transform: translate(-50%, -50%) rotate(270deg) translateY(-130px) rotate(-270deg);
}

.marker-10 {
  transform: translate(-50%, -50%) rotate(300deg) translateY(-130px) rotate(-300deg);
}

.marker-11 {
  transform: translate(-50%, -50%) rotate(330deg) translateY(-130px) rotate(-330deg);
}

.reset-btn {
  width: 100%;
  padding: 10px;
  background-color: rgba(124, 58, 237, 0.15);
  color: #A78BFA;
  border: 2px solid #7C3AED;
  border-radius: 5px;
  font-family: 'Orbitron', sans-serif;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.reset-btn:hover {
  background-color: rgba(124, 58, 237, 0.25);
  box-shadow: 0 0 10px rgba(124, 58, 237, 0.5);
}

/* 디지털+아날로그 결합 시계 */
.combined-clock {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 30px;
}

.combined-clock .analog-clock {
  display: flex;
  align-items: center;
  justify-content: center;
}

.combined-clock .digital-clock {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.combined-clock .digital-clock .time {
  font-size: calc(12vw * var(--font-size));
  font-weight: 700;
  line-height: 1;
}

.combined-clock .digital-clock .ampm {
  font-size: calc(6vw * var(--font-size));
  font-weight: 400;
}

.combined-clock .date {
  font-size: calc(2vw * var(--font-size));
  opacity: 0.8;
}

/* 상단 바 */
.top-bar {
  position: absolute;
  top: 20px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  pointer-events: none;
}

.top-bar > * {
  pointer-events: auto;
}

.left-buttons {
  display: flex;
  gap: 10px;
  align-items: center;
}

.feature-buttons {
  display: flex;
  gap: 10px;
  align-items: center;
}

.widget-dropdown {
  position: relative;
}

.widget-menu-btn {
  padding: 10px 20px;
  font-size: 1rem;
  font-weight: 600;
  font-family: 'Orbitron', sans-serif;
  background-color: rgba(124, 58, 237, 0.15);
  color: #A78BFA;
  border: 2px solid #7C3AED;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-shadow: 0 0 8px rgba(124, 58, 237, 0.4);
  box-shadow: 0 0 12px rgba(124, 58, 237, 0.2);
  white-space: nowrap;
}

.widget-menu-btn:hover {
  background-color: rgba(124, 58, 237, 0.25);
  box-shadow: 0 0 20px rgba(124, 58, 237, 0.5);
  transform: scale(1.05);
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  background-color: rgba(15, 15, 31, 0.98);
  border: 2px solid #7C3AED;
  border-radius: 6px;
  min-width: 140px;
  margin-top: 5px;
  z-index: 1000;
  box-shadow: 0 0 20px rgba(124, 58, 237, 0.4);
  backdrop-filter: blur(10px);
}

.dropdown-item {
  display: block;
  width: 100%;
  padding: 12px 15px;
  background: none;
  color: #A78BFA;
  border: none;
  text-align: left;
  cursor: pointer;
  font-family: 'Orbitron', sans-serif;
  font-size: 1rem;
  font-weight: 600;
  transition: all 0.2s ease;
  border-left: 3px solid transparent;
}

.dropdown-item:hover {
  background-color: rgba(124, 58, 237, 0.2);
  border-left-color: #7C3AED;
  color: #ffffff;
}

.dropdown-item.active {
  background-color: rgba(124, 58, 237, 0.3);
  border-left-color: #7C3AED;
  color: #ffffff;
  font-weight: 600;
}

.settings-btn,
.feature-btn,
.fullscreen-btn {
  padding: 10px 15px;
  font-size: 1.2rem;
  font-family: 'Orbitron', sans-serif;
  background-color: rgba(124, 58, 237, 0.15);
  color: #A78BFA;
  border: 2px solid #7C3AED;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-shadow: 0 0 8px rgba(124, 58, 237, 0.4);
  box-shadow: 0 0 12px rgba(124, 58, 237, 0.2);
}

.settings-btn:hover,
.feature-btn:hover,
.fullscreen-btn:hover {
  background-color: rgba(124, 58, 237, 0.25);
  box-shadow: 0 0 20px rgba(124, 58, 237, 0.5);
  transform: scale(1.05);
}

/* 기능 패널 */
.feature-panel {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
  backdrop-filter: blur(2px);
}

.panel-content {
  position: relative;
  background-color: rgba(5, 5, 5, 0.98);
  border: 2px solid #7C3AED;
  border-radius: 10px;
  padding: 30px;
  min-width: 300px;
  max-width: 350px;
  text-align: center;
  color: #A78BFA;
  font-family: inherit;
}

.panel-content h2 {
  margin: 0 0 20px 0;
  font-size: 1.5rem;
}

.timer-display {
  font-size: 4rem;
  font-weight: 700;
  margin: 20px 0;
  font-variant-numeric: tabular-nums;
  font-feature-settings: 'tnum' 1;
  letter-spacing: 0.1em;
}

.timer-status {
  font-size: 1.2rem;
  margin-bottom: 20px;
  opacity: 0.8;
}

.timer-input {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.timer-input label {
  font-size: 1rem;
}

.timer-input input {
  width: 80px;
  padding: 8px;
  font-size: 1.2rem;
  background-color: rgba(124, 58, 237, 0.1);
  color: #A78BFA;
  border: 2px solid #7C3AED;
  border-radius: 5px;
  font-family: 'Orbitron', sans-serif;
  text-align: center;
}

.timer-input input:focus {
  outline: none;
  box-shadow: 0 0 10px rgba(124, 58, 237, 0.5);
}

.button-group {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.action-btn {
  flex: 1;
  padding: 10px;
  background-color: rgba(124, 58, 237, 0.2);
  color: #A78BFA;
  border: 2px solid #7C3AED;
  border-radius: 5px;
  font-family: inherit;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.action-btn:hover {
  background-color: rgba(124, 58, 237, 0.3);
  box-shadow: 0 0 10px rgba(124, 58, 237, 0.5);
}

.action-btn.reset {
  background-color: rgba(255, 0, 85, 0.2);
  color: #ff0055;
  border-color: #ff0055;
}

.action-btn.reset:hover {
  background-color: rgba(255, 0, 85, 0.3);
  box-shadow: 0 0 10px rgba(255, 0, 85, 0.5);
}

.close-panel-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  color: #A78BFA;
  font-size: 1.5rem;
  cursor: pointer;
  transition: transform 0.2s;
}

.close-panel-btn:hover {
  transform: scale(1.2);
}

/* 뽀모도로 위젯 */
.pomodoro-widget {
  position: fixed;
  z-index: 100;
  animation: slideInRight 0.3s ease-out;
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.widget-box {
  background-color: rgba(5, 5, 5, 0.95);
  border: 2px solid #7C3AED;
  border-radius: 10px;
  padding: 15px;
  min-width: 200px;
  text-align: center;
  color: #A78BFA;
  font-family: inherit;
  box-shadow: 0 0 20px rgba(124, 58, 237, 0.3);
  transition: all 0.3s ease;
  cursor: default;
  user-select: none;
  position: relative;
}

.widget-box.dragging {
  cursor: grabbing;
  box-shadow: 0 0 40px rgba(124, 58, 237, 0.8);
}

.pomodoro-widget:hover .widget-box {
  background-color: rgba(5, 5, 5, 0.98);
  border-color: #7C3AED;
  box-shadow: 0 0 30px rgba(124, 58, 237, 0.6);
  transform: scale(1.05);
  cursor: grab;
}

.widget-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.widget-header h3 {
  margin: 0;
  font-size: 1.5rem;
}

.widget-close {
  background: none;
  border: none;
  color: #A78BFA;
  font-size: 1rem;
  cursor: pointer;
  transition: transform 0.2s;
  padding: 0;
  width: 20px;
  height: 20px;
}

.widget-close:hover {
  transform: scale(1.2);
}

.timer-display-small {
  font-size: 2rem;
  font-weight: 700;
  margin: 10px 0;
  font-variant-numeric: tabular-nums;
  font-feature-settings: 'tnum' 1;
}

.timer-status {
  font-size: 0.85rem;
  margin-bottom: 10px;
  opacity: 0.8;
}

.widget-buttons {
  display: flex;
  gap: 8px;
}

.action-btn-small {
  flex: 1;
  padding: 8px;
  background-color: rgba(124, 58, 237, 0.2);
  color: #A78BFA;
  border: 1px solid #7C3AED;
  border-radius: 5px;
  font-family: inherit;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.action-btn-small:hover {
  background-color: rgba(124, 58, 237, 0.3);
  box-shadow: 0 0 8px rgba(124, 58, 237, 0.5);
}

.action-btn-small.reset {
  background-color: rgba(255, 0, 85, 0.2);
  color: #ff0055;
  border-color: #ff0055;
}

.action-btn-small.reset:hover {
  background-color: rgba(255, 0, 85, 0.3);
  box-shadow: 0 0 8px rgba(255, 0, 85, 0.5);
}

/* 타이머 위젯 */
.timer-widget {
  position: fixed;
  z-index: 100;
  animation: slideInRight 0.3s ease-out;
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.timer-widget:hover .widget-box,
.stopwatch-widget:hover .widget-box {
  background-color: rgba(5, 5, 5, 0.98);
  border-color: #7C3AED;
  box-shadow: 0 0 30px rgba(124, 58, 237, 0.6);
  transform: scale(1.05);
  cursor: grab;
}

.timer-widget .widget-box.dragging,
.stopwatch-widget .widget-box.dragging {
  cursor: grabbing;
  box-shadow: 0 0 40px rgba(124, 58, 237, 0.8);
}

/* 스탑워치 위젯 */
.stopwatch-widget {
  position: fixed;
  z-index: 100;
  animation: slideInRight 0.3s ease-out;
}

.stopwatch-widget-box {
  max-width: 280px;
  max-height: 500px;
  display: flex;
  flex-direction: column;
}

.widget-records {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid rgba(124, 58, 237, 0.3);
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.widget-records-title {
  font-size: 11px;
  color: #A78BFA;
  font-weight: 600;
  text-transform: uppercase;
  margin-bottom: 6px;
  letter-spacing: 0.5px;
}

.widget-records-list {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.widget-record-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 6px;
  background-color: rgba(124, 58, 237, 0.1);
  border-left: 2px solid #A78BFA;
  border-radius: 3px;
  font-size: 11px;
}

.widget-record-num {
  color: #A78BFA;
  font-weight: 600;
  min-width: 25px;
}

.widget-record-time {
  color: #DDD6FE;
  font-family: 'Courier New', monospace;
  font-weight: 500;
}

.widget-records-list::-webkit-scrollbar {
  width: 4px;
}

.widget-records-list::-webkit-scrollbar-track {
  background: rgba(124, 58, 237, 0.05);
  border-radius: 2px;
}

.widget-records-list::-webkit-scrollbar-thumb {
  background: rgba(124, 58, 237, 0.3);
  border-radius: 2px;
}

.widget-records-list::-webkit-scrollbar-thumb:hover {
  background: rgba(124, 58, 237, 0.5);
}


.timer-input-widget {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin-bottom: 8px;
  font-size: 0.85rem;
}

.timer-input-widget-group {
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: center;
}

.timer-input-widget-item {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 6px;
  background-color: rgba(124, 58, 237, 0.1);
  border: 1px solid #7C3AED;
  border-radius: 4px;
}

.timer-input-widget input {
  width: 50px;
  padding: 4px;
  font-size: 0.85rem;
  background-color: rgba(124, 58, 237, 0.1);
  color: #A78BFA;
  border: 1px solid #7C3AED;
  border-radius: 3px;
  font-family: 'Orbitron', sans-serif;
  text-align: center;
}

.timer-input-widget input:focus {
  outline: none;
  box-shadow: 0 0 6px rgba(124, 58, 237, 0.5);
}

.timer-input-group-large {
  display: flex;
  gap: 20px;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
}

.timer-input-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 15px;
  background-color: rgba(124, 58, 237, 0.1);
  border: 1px solid #7C3AED;
  border-radius: 8px;
}

.time-btn-large {
  background-color: rgba(124, 58, 237, 0.2);
  color: #A78BFA;
  border: 1px solid #7C3AED;
  border-radius: 4px;
  padding: 6px 10px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.2s ease;
}

.time-btn-large:hover {
  background-color: rgba(124, 58, 237, 0.3);
  box-shadow: 0 0 15px rgba(124, 58, 237, 0.3);
}

.timer-input-large-field {
  width: 50px;
  background-color: rgba(124, 58, 237, 0.1);
  border: 1px solid #7C3AED;
  color: #A78BFA;
  text-align: center;
  border-radius: 4px;
  padding: 6px;
  font-size: 14px;
  font-weight: 600;
}

.timer-input-large-field:focus {
  outline: none;
  box-shadow: 0 0 10px rgba(124, 58, 237, 0.4);
}

.timer-warning {
  margin-top: 12px;
  text-align: center;
  color: #fbbf24;
  font-size: 12px;
  font-weight: 600;
  animation: pulse 1s infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
}

.font-select {
  width: 100%;
  padding: 8px;
  font-size: 1rem;
  background-color: rgba(124, 58, 237, 0.1);
  color: #A78BFA;
  border: 2px solid #7C3AED;
  border-radius: 5px;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 8px;
}

.font-select:focus {
  outline: none;
  box-shadow: 0 0 10px rgba(124, 58, 237, 0.5);
  background-color: rgba(124, 58, 237, 0.2);
}

.font-select option {
  background-color: #0F0F1F;
  color: #A78BFA;
}

/* 뽀모도로 시간 설정 입력 */
.time-input-group {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
}

.time-btn {
  width: 32px;
  height: 32px;
  padding: 0;
  background-color: rgba(124, 58, 237, 0.2);
  color: #A78BFA;
  border: 1px solid #7C3AED;
  border-radius: 4px;
  font-family: 'Orbitron', sans-serif;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.time-btn:hover {
  background-color: rgba(124, 58, 237, 0.4);
  box-shadow: 0 0 8px rgba(124, 58, 237, 0.5);
}

.time-btn:active {
  transform: scale(0.95);
}

.time-input {
  width: 60px;
  padding: 6px 8px;
  font-size: 1rem;
  background-color: rgba(124, 58, 237, 0.1);
  color: #A78BFA;
  border: 2px solid #7C3AED;
  border-radius: 4px;
  font-family: 'Orbitron', sans-serif;
  text-align: center;
  transition: all 0.2s ease;
}

.time-input:focus {
  outline: none;
  box-shadow: 0 0 10px rgba(124, 58, 237, 0.5);
  background-color: rgba(124, 58, 237, 0.2);
}

.time-input::-webkit-outer-spin-button,
.time-input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.time-input[type=number] {
  -moz-appearance: textfield;
  appearance: textfield;
}

.time-unit {
  color: #A78BFA;
  font-weight: 600;
  min-width: 24px;
}

/* 모드 메뉴 */
.mode-dropdown {
  position: relative;
}

.mode-menu-btn {
  padding: 10px 15px;
  font-size: 1.2rem;
  font-family: 'Orbitron', sans-serif;
  background-color: rgba(124, 58, 237, 0.15);
  color: #A78BFA;
  border: 2px solid #7C3AED;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-shadow: 0 0 8px rgba(124, 58, 237, 0.4);
  box-shadow: 0 0 12px rgba(124, 58, 237, 0.2);
}

.mode-menu-btn:hover {
  background-color: rgba(124, 58, 237, 0.25);
  box-shadow: 0 0 20px rgba(124, 58, 237, 0.5);
  transform: scale(1.05);
}

/* 모드 박스 */
.mode-box {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #0F0F1F;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 100;
}

/* 모드 메뉴 */
.mode-menu-top {
  position: absolute;
  top: 30px;
  left: 20px;
  right: 20px;
  display: flex;
  align-items: center;
  gap: 15px;
  z-index: 101;
}

.mode-switch-btn {
  padding: 12px 18px;
  font-size: 1.5rem;
  background-color: rgba(124, 58, 237, 0.15);
  color: #A78BFA;
  border: 2px solid #7C3AED;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 0 12px rgba(124, 58, 237, 0.2);
}

.mode-switch-btn:hover {
  background-color: rgba(124, 58, 237, 0.25);
  box-shadow: 0 0 20px rgba(124, 58, 237, 0.5);
  transform: scale(1.1);
}

.mode-switch-btn.active {
  background-color: rgba(124, 58, 237, 0.35);
  box-shadow: 0 0 25px rgba(124, 58, 237, 0.6);
  color: #ffffff;
  font-weight: 700;
}

.fullscreen-btn-mode {
  padding: 12px 15px;
  font-size: 1.3rem;
  background-color: rgba(124, 58, 237, 0.15);
  color: #A78BFA;
  border: 2px solid #7C3AED;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 0 12px rgba(124, 58, 237, 0.2);
  margin-left: auto;
}

.fullscreen-btn-mode:hover {
  background-color: rgba(124, 58, 237, 0.25);
  box-shadow: 0 0 20px rgba(124, 58, 237, 0.5);
  transform: scale(1.05);
}

.mode-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 40px;
}

.mode-title {
  font-size: 3rem;
  font-weight: 700;
  color: #A78BFA;
  text-shadow: 0 0 20px rgba(124, 58, 237, 0.5);
  font-family: 'Orbitron', sans-serif;
}

.timer-display-large {
  font-size: 8rem;
  font-weight: 700;
  font-family: 'Courier New', monospace;
  color: #7C3AED;
  text-shadow: 0 0 30px rgba(124, 58, 237, 0.6), 0 0 60px rgba(124, 58, 237, 0.3);
  line-height: 1;
  min-width: 400px;
  text-align: center;
}

.timer-input-large {
  display: flex;
  align-items: center;
  gap: 20px;
  font-size: 2rem;
}

.timer-input-large-field {
  width: 150px;
  padding: 15px;
  font-size: 2rem;
  background-color: rgba(124, 58, 237, 0.1);
  color: #A78BFA;
  border: 3px solid #7C3AED;
  border-radius: 8px;
  font-family: 'Orbitron', sans-serif;
  text-align: center;
}

.timer-input-large-field:focus {
  outline: none;
  box-shadow: 0 0 20px rgba(124, 58, 237, 0.6);
  background-color: rgba(124, 58, 237, 0.2);
}

.timer-input-label {
  color: #A78BFA;
  font-weight: 600;
  font-size: 1.5rem;
  font-family: 'Orbitron', sans-serif;
}

.mode-buttons {
  display: flex;
  gap: 30px;
}

.action-btn-large {
  padding: 20px 40px;
  font-size: 1.8rem;
  font-weight: 700;
  font-family: 'Orbitron', sans-serif;
  background-color: rgba(124, 58, 237, 0.2);
  color: #A78BFA;
  border: 3px solid #7C3AED;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-shadow: 0 0 10px rgba(124, 58, 237, 0.4);
  box-shadow: 0 0 20px rgba(124, 58, 237, 0.3);
}

.action-btn-large:hover {
  background-color: rgba(124, 58, 237, 0.35);
  box-shadow: 0 0 40px rgba(124, 58, 237, 0.6);
  transform: scale(1.05);
}

.action-btn-large:active {
  transform: scale(0.98);
}

.action-btn-large.reset {
  background-color: rgba(239, 68, 68, 0.2);
  color: #FCA5A5;
  border-color: #EF4444;
  text-shadow: 0 0 10px rgba(239, 68, 68, 0.4);
}

.action-btn-large.reset:hover {
  background-color: rgba(239, 68, 68, 0.3);
  box-shadow: 0 0 40px rgba(239, 68, 68, 0.5);
}

.record-btn {
  background-color: rgba(168, 85, 247, 0.2);
  color: #D8B4FE;
  border: 2px solid #A855F7;
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-shadow: 0 0 10px rgba(168, 85, 247, 0.4);
}

.record-btn:hover {
  background-color: rgba(168, 85, 247, 0.3);
  box-shadow: 0 0 40px rgba(168, 85, 247, 0.5);
}

.records-title {
  font-size: 14px;
  font-weight: 600;
  color: #A78BFA;
  margin-top: 20px;
  margin-bottom: 10px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.records-list {
  margin-top: 15px;
  max-height: 300px;
  overflow-y: auto;
  padding: 10px 0;
}

.record-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  margin: 5px 0;
  background-color: rgba(124, 58, 237, 0.1);
  border-left: 3px solid #A78BFA;
  border-radius: 4px;
  font-size: 13px;
  color: #DDD6FE;
}

.record-item-label {
  color: #A78BFA;
  font-weight: 600;
  min-width: 40px;
}

.record-item-times {
  display: flex;
  gap: 20px;
  text-align: right;
}

.record-item-lap {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.record-item-lap-label {
  font-size: 11px;
  color: #9F7AEA;
  margin-bottom: 2px;
}

.record-item-total {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.record-item-total-label {
  font-size: 11px;
  color: #9F7AEA;
  margin-bottom: 2px;
}

.records-list::-webkit-scrollbar {
  width: 6px;
}

.records-list::-webkit-scrollbar-track {
  background: rgba(124, 58, 237, 0.1);
  border-radius: 3px;
}

.records-list::-webkit-scrollbar-thumb {
  background: rgba(124, 58, 237, 0.4);
  border-radius: 3px;
}

.records-list::-webkit-scrollbar-thumb:hover {
  background: rgba(124, 58, 237, 0.6);
}

.stopwatch-mode-container {
  display: flex;
  flex-direction: row;
  gap: 30px;
  align-items: flex-start;
  justify-content: flex-start;
}

.stopwatch-left {
  flex: 0 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.stopwatch-right {
  flex: 0 0 auto;
  min-width: 250px;
  max-width: 350px;
  margin-left: auto;
}

.records-empty {
  text-align: center;
  padding: 40px 10px;
  color: #9F7AEA;
  font-size: 13px;
}

.pomodoro-settings {
  display: flex;
  gap: 30px;
  margin-top: 20px;
  justify-content: center;
}

.pomodoro-setting-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.pomodoro-setting-item label {
  font-size: 12px;
  color: #A78BFA;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.time-input-group-compact {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
  background-color: rgba(124, 58, 237, 0.1);
  border: 1px solid #7C3AED;
  border-radius: 6px;
}

.time-btn-compact {
  background-color: rgba(124, 58, 237, 0.2);
  color: #A78BFA;
  border: 1px solid #7C3AED;
  border-radius: 4px;
  padding: 4px 8px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
  transition: all 0.2s ease;
}

.time-btn-compact:hover {
  background-color: rgba(124, 58, 237, 0.3);
  box-shadow: 0 0 15px rgba(124, 58, 237, 0.3);
}

.time-input-compact {
  width: 40px;
  background-color: rgba(124, 58, 237, 0.1);
  border: 1px solid #7C3AED;
  color: #A78BFA;
  text-align: center;
  border-radius: 4px;
  padding: 4px;
  font-size: 12px;
  font-weight: 600;
}

.time-input-compact:focus {
  outline: none;
  box-shadow: 0 0 10px rgba(124, 58, 237, 0.4);
}

.time-unit-compact {
  font-size: 11px;
  color: #9F7AEA;
  font-weight: 600;
}

/* ============================================
   반응형 디자인 (모바일)
   ============================================ */

/* 태블릿/소형 화면 (768px 이하) */
@media (max-width: 768px) {
  .top-bar {
    top: 10px;
    padding: 0 10px;
  }

  .left-buttons,
  .feature-buttons {
    gap: 5px;
  }

  .mode-menu-btn,
  .widget-menu-btn,
  .settings-btn,
  .fullscreen-btn {
    padding: 8px 12px;
    font-size: 0.9rem;
  }

  .dropdown-menu {
    min-width: 120px;
  }

  .settings-content {
    width: 90%;
    max-width: 300px;
    padding: 12px;
  }

  .setting-group {
    margin-bottom: 15px;
  }

  .clock-box {
    padding: 20px;
    gap: 15px;
  }

  .time {
    font-size: calc(8vw * var(--font-size));
  }

  .ampm {
    font-size: calc(8vw * var(--font-size));
  }

  .date {
    font-size: calc(2.5vw * var(--font-size));
  }

  .clock-face {
    width: calc(250px * var(--font-size));
    height: calc(250px * var(--font-size));
    border: 3px solid #7C3AED;
  }

  .marker {
    font-size: calc(1.2vw * var(--font-size));
  }

  .combined-clock .digital-clock .time {
    font-size: calc(10vw * var(--font-size));
  }

  .combined-clock .digital-clock .ampm {
    font-size: calc(5vw * var(--font-size));
  }

  /* 위젯 조정 */
  .widget-box {
    min-width: 180px;
    padding: 12px;
  }

  .timer-display-small {
    font-size: 1.5rem;
  }

  .widget-header h3 {
    font-size: 1.2rem;
  }

  .action-btn-small {
    padding: 6px;
    font-size: 0.75rem;
  }

  /* 모드 박스 조정 */
  .mode-menu-top {
    top: 20px;
    left: 10px;
    right: 10px;
    gap: 10px;
  }

  .mode-switch-btn {
    padding: 10px 14px;
    font-size: 1.2rem;
  }

  .fullscreen-btn-mode {
    padding: 10px 12px;
    font-size: 1rem;
  }

  .mode-title {
    font-size: 2rem;
  }

  .timer-display-large {
    font-size: 5rem;
    min-width: 280px;
  }

  .timer-input-large {
    gap: 15px;
    font-size: 1.5rem;
  }

  .timer-input-item {
    gap: 6px;
    padding: 8px 12px;
  }

  .time-btn-large {
    padding: 4px 8px;
    font-size: 12px;
  }

  .timer-input-large-field {
    width: 100px;
    padding: 10px;
    font-size: 1.5rem;
  }

  .timer-input-label {
    font-size: 1.2rem;
  }

  .mode-buttons {
    gap: 15px;
  }

  .action-btn-large {
    padding: 15px 30px;
    font-size: 1.3rem;
  }

  .stopwatch-mode-container {
    flex-direction: column;
    gap: 20px;
    align-items: center;
    width: 100%;
  }

  .stopwatch-left {
    width: 100%;
  }

  .stopwatch-right {
    width: 100%;
    max-width: none;
    margin-left: 0;
  }

  .records-list {
    max-height: 250px;
  }

  .pomodoro-settings {
    gap: 20px;
  }
}

/* 스마트폰 (480px 이하) */
@media (max-width: 480px) {
  .top-bar {
    top: 8px;
    padding: 0 8px;
    flex-wrap: wrap;
    gap: 8px;
  }

  .left-buttons,
  .feature-buttons {
    gap: 4px;
    width: 100%;
    justify-content: space-between;
  }

  .mode-menu-btn,
  .widget-menu-btn,
  .settings-btn,
  .fullscreen-btn {
    padding: 6px 10px;
    font-size: 0.8rem;
    font-weight: 500;
  }

  .settings-header {
    top: 10px;
    left: 10px;
    right: 10px;
  }

  .settings-header h2 {
    font-size: 1.2rem;
  }

  .settings-content {
    top: 70px;
    width: 95%;
    max-width: none;
    max-height: calc(100% - 100px);
    padding: 10px;
  }

  .setting-group {
    margin-bottom: 12px;
  }

  .setting-group label {
    font-size: 0.9rem;
  }

  .setting-group input[type='range'] {
    height: 5px;
  }

  .setting-group input[type='color'] {
    width: 40px;
    height: 35px;
  }

  .notification-textarea {
    font-size: 0.85rem;
    padding: 8px;
  }

  .settings-divider {
    margin: 15px 0;
  }

  .clock-box {
    padding: 15px;
    gap: 10px;
  }

  .time {
    font-size: calc(7vw * var(--font-size));
  }

  .ampm {
    font-size: calc(6vw * var(--font-size));
  }

  .date {
    font-size: calc(2vw * var(--font-size));
  }

  .clock-face {
    width: calc(200px * var(--font-size));
    height: calc(200px * var(--font-size));
    border: 2px solid #7C3AED;
  }

  .marker {
    font-size: calc(1vw * var(--font-size));
  }

  .combined-clock {
    gap: 20px;
  }

  .combined-clock .digital-clock .time {
    font-size: calc(8vw * var(--font-size));
  }

  .combined-clock .digital-clock .ampm {
    font-size: calc(4vw * var(--font-size));
  }

  /* 위젯 - 모바일에서는 작게 표시 */
  .widget-box {
    min-width: 160px;
    padding: 10px;
    font-size: 0.9rem;
  }

  .timer-display-small {
    font-size: 1.3rem;
  }

  .widget-header h3 {
    font-size: 1rem;
  }

  .widget-buttons {
    gap: 6px;
  }

  .action-btn-small {
    padding: 5px;
    font-size: 0.7rem;
  }

  .widget-close {
    width: 18px;
    height: 18px;
    font-size: 0.9rem;
  }

  /* 모드 박스 - 스마트폰 최적화 */
  .mode-menu-top {
    top: 15px;
    left: 8px;
    right: 8px;
    gap: 8px;
    flex-wrap: wrap;
  }

  .fullscreen-btn-mode {
    padding: 8px 10px;
    font-size: 0.9rem;
    margin-left: 0;
  }

  .mode-switch-btn {
    padding: 8px 12px;
    font-size: 1rem;
  }

  .mode-display {
    gap: 30px;
    padding: 0 15px;
  }

  .mode-title {
    font-size: 1.5rem;
  }

  .timer-display-large {
    font-size: 3.5rem;
    min-width: auto;
    padding: 0 10px;
  }

  .timer-input-large {
    flex-direction: column;
    gap: 12px;
    font-size: 1.2rem;
  }

  .timer-input-group-large {
    flex-direction: column;
    gap: 15px;
  }

  .timer-input-item {
    gap: 5px;
    padding: 6px 10px;
    width: 100%;
    justify-content: center;
  }

  .time-btn-large {
    padding: 3px 6px;
    font-size: 11px;
  }

  .timer-input-large-field {
    width: 80px;
    padding: 8px;
    font-size: 1.2rem;
  }

  .timer-input-label {
    font-size: 1rem;
  }

  .timer-warning {
    font-size: 11px;
  }

  .mode-buttons {
    flex-direction: column;
    gap: 12px;
    width: 100%;
    padding: 0 15px;
  }

  .action-btn-large {
    padding: 12px 25px;
    font-size: 1.1rem;
    width: 100%;
  }

  .stopwatch-mode-container {
    flex-direction: column;
    gap: 15px;
    padding: 0 10px;
  }

  .stopwatch-left {
    width: 100%;
  }

  .stopwatch-right {
    width: 100%;
    min-width: auto;
  }

  .records-title {
    font-size: 12px;
  }

  .records-list {
    max-height: 200px;
  }

  .record-item {
    padding: 6px 8px;
    font-size: 11px;
  }

  .pomodoro-settings {
    flex-direction: column;
    gap: 15px;
    width: 100%;
  }

  .pomodoro-setting-item {
    width: 100%;
  }

  .pomodoro-setting-item label {
    font-size: 11px;
  }

  .time-input-group-compact {
    width: 100%;
    gap: 5px;
    padding: 5px 8px;
  }

  .time-btn-compact {
    padding: 3px 6px;
    font-size: 11px;
  }

  .time-input-compact {
    width: 35px;
    padding: 3px;
    font-size: 11px;
  }

  .time-unit-compact {
    font-size: 10px;
  }
}

/* 초소형 스마트폰 (320px 이하) */
@media (max-width: 320px) {
  .mode-menu-btn,
  .widget-menu-btn,
  .settings-btn,
  .fullscreen-btn {
    padding: 5px 8px;
    font-size: 0.7rem;
  }

  .time {
    font-size: calc(6vw * var(--font-size));
  }

  .ampm {
    font-size: calc(5vw * var(--font-size));
  }

  .clock-face {
    width: calc(180px * var(--font-size));
    height: calc(180px * var(--font-size));
  }

  .timer-display-large {
    font-size: 2.8rem;
  }

  .action-btn-large {
    padding: 10px 20px;
    font-size: 1rem;
  }
}

/* 테마 선택 스타일 */
.theme-selector {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  margin-top: 10px;
}

.theme-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px;
  background-color: rgba(124, 58, 237, 0.1);
  color: #A78BFA;
  border: 2px solid #7C3AED;
  border-radius: 6px;
  font-family: inherit;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
}

.theme-btn:hover {
  background-color: rgba(124, 58, 237, 0.2);
  box-shadow: 0 0 10px rgba(124, 58, 237, 0.4);
  transform: scale(1.02);
}

.theme-btn.active {
  background-color: rgba(124, 58, 237, 0.3);
  border-color: #A78BFA;
  color: #ffffff;
  box-shadow: 0 0 15px rgba(124, 58, 237, 0.6);
  font-weight: 600;
}

.theme-color {
  width: 16px;
  height: 16px;
  border-radius: 3px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  display: inline-block;
  flex-shrink: 0;
}

/* 테마 선택 반응형 */
@media (max-width: 480px) {
  .theme-selector {
    grid-template-columns: repeat(2, 1fr);
    gap: 6px;
  }

  .theme-btn {
    padding: 8px;
    font-size: 0.8rem;
  }

  .theme-color {
    width: 14px;
    height: 14px;
  }
}

@media (max-width: 320px) {
  .theme-selector {
    grid-template-columns: 1fr;
  }

  .theme-btn {
    padding: 6px;
    font-size: 0.75rem;
  }
}
</style>
