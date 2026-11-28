// Helpers for the iPhone/iPad app build (Capacitor). Added 2026-11-28.
// On the website every check below is false, so the web app behaves exactly as before.
import { Capacitor } from '@capacitor/core'
import { Share } from '@capacitor/share'
import { Filesystem, Directory } from '@capacitor/filesystem'
import { StatusBar, Style } from '@capacitor/status-bar'

export const isNative = Capacitor.isNativePlatform()

export async function nativeShareText({ title, text }) {
  try { await Share.share({ title, text, dialogTitle: title }) } catch (e) { /* the person closed the share sheet */ }
}

// The share card (a PNG data URL) goes through the phone's own share sheet.
export async function nativeShareImage(dataUrl, fileName, title) {
  const { uri } = await Filesystem.writeFile({ path: fileName, data: dataUrl.split(',')[1], directory: Directory.Cache })
  try { await Share.share({ title, files: [uri], dialogTitle: title }) } catch (e) { /* closed */ }
}

// The app is always dark, so the clock and battery at the top are light.
export function syncStatusBar() {
  if (!isNative) return
  StatusBar.setStyle({ style: Style.Dark }).catch(() => {})
}
