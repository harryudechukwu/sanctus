import { useState, useEffect } from 'react'
import { useSaints } from './useSaints'

const MONTHS = [
  'january', 'february', 'march', 'april', 'may', 'june',
  'july', 'august', 'september', 'october', 'november', 'december',
]
const STORAGE_KEY = 'sanctus_saint_of_day'

function getDateKey() {
  const d = new Date()
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
}

function loadCached() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const { dateKey, saint } = JSON.parse(raw)
    if (dateKey === getDateKey()) return saint
  } catch {}
  return null
}

function saveCache(saint) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ dateKey: getDateKey(), saint }),
    )
  } catch {}
}

export function useSaintOfDay() {
  const { saints, loading: saintsLoading } = useSaints()
  const [saint, setSaint] = useState(() => loadCached())
  const [loading, setLoading] = useState(!saint)

  useEffect(() => {
    if (saintsLoading) return

    const cached = loadCached()
    if (cached) {
      setSaint(cached)
      setLoading(false)
      return
    }

    const today = new Date()
    const todayStr = `${MONTHS[today.getMonth()].charAt(0).toUpperCase() + MONTHS[today.getMonth()].slice(1)} ${today.getDate()}`

    const found = saints.find((s) => s.feastDay === todayStr)
    const selected = found || (saints.length > 0
      ? saints[Math.floor(Math.random() * saints.length)]
      : null)

    if (selected) {
      saveCache(selected)
      setSaint(selected)
    }
    setLoading(false)
  }, [saints, saintsLoading])

  return { saint, loading }
}
