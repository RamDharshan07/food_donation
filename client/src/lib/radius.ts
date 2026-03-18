import { useEffect, useMemo, useState } from 'react'

export const RADIUS_OPTIONS_KM = [10, 12, 20, 30, 40] as const
export type RadiusKm = (typeof RADIUS_OPTIONS_KM)[number]

const LS_RADIUS = 'fd_radius_km'

export function useRadius(defaultRadius: RadiusKm = 10) {
  const [radiusKm, setRadiusKm] = useState<RadiusKm>(() => {
    const raw = Number(localStorage.getItem(LS_RADIUS))
    return (RADIUS_OPTIONS_KM as readonly number[]).includes(raw) ? (raw as RadiusKm) : defaultRadius
  })

  useEffect(() => {
    localStorage.setItem(LS_RADIUS, String(radiusKm))
  }, [radiusKm])

  const label = useMemo(() => `${radiusKm} km`, [radiusKm])

  return { radiusKm, setRadiusKm, label, options: RADIUS_OPTIONS_KM }
}

