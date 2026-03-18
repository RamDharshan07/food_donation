export function formatTimeLeft(expiryIso: string) {
  const ms = new Date(expiryIso).getTime() - Date.now()
  if (ms <= 0) return 'Expired'
  const mins = Math.floor(ms / 60000)
  const secs = Math.floor((ms % 60000) / 1000)
  if (mins >= 60) {
    const h = Math.floor(mins / 60)
    const m = mins % 60
    return `${h}h ${m}m`
  }
  return `${mins}m ${secs}s`
}

