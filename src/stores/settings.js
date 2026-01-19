import { defineStore } from 'pinia'
import { ref } from 'vue'

// 테마 정의
export const themes = {
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

// 언어 번역
export const translations = {
  ko: {
    mode: '모드',
    settings: '시계 설정',
    confirm: '확인',
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
    start: '시작',
    pause: '일시정지',
    reset: '리셋',
    volume: '알람 볼륨',
    browserNotification: '브라우저 알림',
    enableNotification: '알림 활성화',
    worldClock: '세계 시계',
    addTimezone: '타임존 추가',
    pomodoroSessions: '뽀모도로 세션',
    sessionsCompleted: '완료 세션',
    keyboardShortcuts: '키보드 단축키',
    shortcutToggle: 'Space: 시작/정지',
    shortcutReset: 'R: 리셋',
    shortcutEscape: 'Esc: 설정 닫기',
    autoSystemTheme: '시스템 테마 따르기',
  },
  en: {
    mode: 'Mode',
    settings: 'Clock Settings',
    confirm: 'OK',
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
    volume: 'Alarm Volume',
    browserNotification: 'Browser Notification',
    enableNotification: 'Enable Notification',
    worldClock: 'World Clock',
    addTimezone: 'Add Timezone',
    pomodoroSessions: 'Pomodoro Sessions',
    sessionsCompleted: 'Sessions Completed',
    keyboardShortcuts: 'Keyboard Shortcuts',
    shortcutToggle: 'Space: Start/Stop',
    shortcutReset: 'R: Reset',
    shortcutEscape: 'Esc: Close Settings',
    autoSystemTheme: 'Follow System Theme',
  },
}

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
  language: 'en',
  theme: 'dark',
  workTimeEndMessage: '작업 시간 종료! 휴식 시간입니다.',
  breakTimeEndMessage: '휴식 시간 종료! 작업 시간입니다.',
  timerEndMessage: '타이머 종료!',
  // 새로운 설정들
  alarmVolume: 0.4,
  browserNotificationEnabled: false,
  autoSystemTheme: false,
  // 세계 시계 타임존
  worldClockTimezones: [],
}

export const useSettingsStore = defineStore('settings', () => {
  const settings = ref({ ...defaultSettings })
  const currentTheme = ref('dark')
  const settingsSaved = ref(false)

  // 번역 함수
  const t = (key) => {
    return translations[settings.value.language]?.[key] || translations.en[key]
  }

  // 네온 강도에 따른 text-shadow 계산
  const calculateNeonShadow = () => {
    if (!settings.value.neonEnabled) return 'none'
    const color = settings.value.neonGlowColor
    const intensity = settings.value.neonIntensity

    const baseBlur = [5, 10, 15, 20, 25][intensity - 1]
    const multiplier = [1, 1.5, 2, 2.5, 3][intensity - 1]

    const shadow1 = `0 0 ${baseBlur}px ${color}`
    const shadow2 = `0 0 ${baseBlur * multiplier}px ${color}`
    const shadow3 = `0 0 ${baseBlur * multiplier * 2}px ${color}`

    return `${shadow1}, ${shadow2}, ${shadow3}`
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
    // 시스템 테마 자동 감지
    if (settings.value.autoSystemTheme) {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      applyTheme(prefersDark ? 'dark' : 'light')
      return
    }

    const savedTheme = localStorage.getItem('clockTheme')
    if (savedTheme && themes[savedTheme]) {
      applyTheme(savedTheme)
    } else {
      applyTheme('dark')
    }
  }

  // 현재 언어 감지 및 설정
  const initializeLanguage = () => {
    const savedLang = localStorage.getItem('clockLanguage')
    if (savedLang) {
      settings.value.language = savedLang
    } else {
      const browserLang = navigator.language.toLowerCase()
      settings.value.language = browserLang.startsWith('ko') ? 'ko' : 'en'
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
    }
  }

  // 설정 불러오기 (로컬스토리지)
  const loadSettings = () => {
    try {
      const saved = localStorage.getItem('clockSettings')
      if (saved) {
        const parsedSettings = JSON.parse(saved)
        settings.value = { ...defaultSettings, ...parsedSettings }
      }
    } catch (error) {
      console.error('설정 불러오기 오류:', error)
    }
  }

  // 설정 초기화
  const resetSettings = () => {
    if (confirm(t('resetConfirm'))) {
      settings.value = { ...defaultSettings }
      initializeLanguage()
      return true
    }
    return false
  }

  // 시스템 테마 변경 감지
  const setupSystemThemeListener = () => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    mediaQuery.addEventListener('change', (e) => {
      if (settings.value.autoSystemTheme) {
        applyTheme(e.matches ? 'dark' : 'light')
      }
    })
  }

  return {
    settings,
    currentTheme,
    settingsSaved,
    themes,
    t,
    calculateNeonShadow,
    applyTheme,
    loadTheme,
    initializeLanguage,
    saveSettings,
    loadSettings,
    resetSettings,
    setupSystemThemeListener,
    defaultSettings,
  }
})
