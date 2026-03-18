import { useEffect, useMemo, useState } from 'react'
import type { LatLng } from './types'
import { demoNgo } from './demo'

type OriginMode = 'my' | 'ngo'

const LS_ORIGIN_MODE = 'fd_origin_mode'

export function useOrigin() {
  const [mode, setMode] = useState<OriginMode>(() => {
    const raw = localStorage.getItem(LS_ORIGIN_MODE)
    return raw === 'my' || raw === 'ngo' ? raw : 'my'
  })
  const [myLocation, setMyLocation] = useState<LatLng | null>(null)
  const [locError, setLocError] = useState<string | null>(null)
  const [locStatus, setLocStatus] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle')

  useEffect(() => {
    localStorage.setItem(LS_ORIGIN_MODE, mode)
  }, [mode])

  async function requestMyLocation() {
    setLocError(null)
    setLocStatus('loading')
    if (!('geolocation' in navigator)) {
      setLocStatus('error')
      setLocError('Geolocation not supported')
      return
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setMyLocation({ latitude: pos.coords.latitude, longitude: pos.coords.longitude })
        setLocStatus('ready')
      },
      (err) => {
        setLocStatus('error')
        setLocError(err.message || 'Failed to get location')
      },
      { enableHighAccuracy: true, timeout: 10_000, maximumAge: 5_000 }
    )
  }

  // auto-request when mode is "my"
  useEffect(() => {
    if (mode !== 'my') return
    if (myLocation) return
    requestMyLocation()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode])

  const origin = useMemo<LatLng>(() => {
    if (mode === 'my' && myLocation) return myLocation
    return demoNgo.location
  }, [mode, myLocation])

  const originLabel =
    mode === 'my' ? (myLocation ? 'My location' : 'My location (fallback)') : demoNgo.name

  return {
    mode,
    setMode,
    origin,
    originLabel,
    locStatus,
    locError,
    requestMyLocation,
  }
}

