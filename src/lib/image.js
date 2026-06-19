const PROXY = 'https://wsrv.nl'

export const FALLBACK_ICON = '/icons/icon.png'

export function resized(url, width = 400) {
  if (!url) return url
  return `${PROXY}/?url=${encodeURIComponent(url)}&w=${width}&output=webp`
}
