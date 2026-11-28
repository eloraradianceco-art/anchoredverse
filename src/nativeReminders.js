// The daily check-in reminder inside the App Store app. Added 2026-11-28.
// The phone schedules it itself, so it arrives with the app closed or offline and needs no server and no account.
// The next 30 days are scheduled each time the app opens, so someone who stops opening the app gets a month of
// reminders and then they stop. The screen (ReminderSheet in AnchoredVerse.jsx) talks to this through `reminders`.
import { Capacitor } from '@capacitor/core'
import { LocalNotifications } from '@capacitor/local-notifications'
import { Preferences } from '@capacitor/preferences'

const PREF_KEY = 'av_daily_reminder'
const FIRST_ID = 3001
const DAYS = 30
const TEST_ID = 3999
const TITLE = 'Anchored Verse'
export const DEFAULT_TIME = '07:30'
const MESSAGES = [
  'How is your heart today? There is a word for it.',
  'Whatever you are carrying this morning, Scripture meets you there.',
  'Take one minute. Name what you feel. Find your anchor.',
  'Cast all your anxiety on Him, because He cares for you. (1 Peter 5:7)',
  'How is your heart right now? The real answer.',
  'The Lord is near to the brokenhearted. (Psalm 34:18) Check in today.',
  'One feeling. One verse. One minute with God.',
]

export const formatTime = (t) => {
  const [h, m] = String(t).split(':').map(Number)
  return `${((h + 11) % 12) + 1}:${String(m || 0).padStart(2, '0')} ${h < 12 ? 'AM' : 'PM'}`
}
const dayOfYear = (d) => Math.floor((d - new Date(d.getFullYear(), 0, 0)) / 86400000)

async function loadPref() {
  try {
    const { value } = await Preferences.get({ key: PREF_KEY })
    return value ? JSON.parse(value) : { enabled: false, time: DEFAULT_TIME }
  } catch { return { enabled: false, time: DEFAULT_TIME } }
}
const savePref = (pref) => Preferences.set({ key: PREF_KEY, value: JSON.stringify(pref) })

async function cancelScheduled() {
  const ids = Array.from({ length: DAYS }, (_, i) => ({ id: FIRST_ID + i }))
  try { await LocalNotifications.cancel({ notifications: ids }) } catch { /* nothing pending */ }
}

async function scheduleDays(time) {
  await cancelScheduled()
  const [h, m] = String(time).split(':').map(Number)
  const now = new Date()
  const notifications = []
  for (let i = 0; notifications.length < DAYS && i <= DAYS; i++) {
    const at = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i, h, m, 0, 0)
    if (at <= now) continue
    notifications.push({ id: FIRST_ID + notifications.length, title: TITLE, body: MESSAGES[dayOfYear(at) % MESSAGES.length], schedule: { at, allowWhileIdle: true } })
  }
  await LocalNotifications.schedule({ notifications })
}

// A test build can stand in for the phone with window.__AV_TEST_REMINDERS__ (same three functions).
const real = {
  async getState() {
    const pref = await loadPref()
    const perm = await LocalNotifications.checkPermissions()
    return { enabled: pref.enabled && perm.display === 'granted', time: pref.time || DEFAULT_TIME, denied: perm.display === 'denied' }
  },
  // Throws Error('denied') when the person has notifications turned off for the app in iOS Settings.
  async save({ enabled, time }) {
    if (enabled) {
      const perm = await LocalNotifications.requestPermissions()
      if (perm.display !== 'granted') throw new Error('denied')
      await scheduleDays(time)
    } else {
      await cancelScheduled()
    }
    await savePref({ enabled, time })
    return { enabled, time, denied: false }
  },
  async test() {
    const pref = await loadPref()
    await LocalNotifications.schedule({ notifications: [{ id: TEST_ID, title: TITLE, body: `Reminders are on. You'll hear from us every day at ${formatTime(pref.time || DEFAULT_TIME)}.`, schedule: { at: new Date(Date.now() + 3000) } }] })
  },
}
export const reminders = (typeof window !== 'undefined' && window.__AV_TEST_REMINDERS__) || real

// Keep a full month scheduled ahead every time the app opens.
export function installNativeReminders() {
  if (!Capacitor.isNativePlatform()) return
  loadPref().then(async (pref) => {
    if (!pref.enabled) return
    const perm = await LocalNotifications.checkPermissions()
    if (perm.display === 'granted') await scheduleDays(pref.time)
  }).catch(() => {})
}
