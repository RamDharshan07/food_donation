import { API_BASE } from './api'

export function resolveImageUrl(imageUrl?: string | null) {
  if (!imageUrl) return null
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) return imageUrl
  if (imageUrl.startsWith('/')) return `${API_BASE}${imageUrl}`
  return `${API_BASE}/${imageUrl}`
}

