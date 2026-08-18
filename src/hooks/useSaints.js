import { useState, useEffect } from 'react'

const CACHE_KEY = 'sanctus_saints'
const CACHE_TTL = 24 * 60 * 60 * 1000

function getCached() {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const { data, timestamp } = JSON.parse(raw)
    if (Date.now() - timestamp > CACHE_TTL) return null
    return data
  } catch {
    return null
  }
}

function setCache(data) {
  try {
    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({ data, timestamp: Date.now() }),
    )
  } catch {}
}

export function useSaints() {
  const [saints, setSaints] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const cached = getCached()
    if (cached) {
      setSaints(cached)
      setLoading(false)
      return
    }

    fetch(`${import.meta.env.BASE_URL}saints.json`)
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load saints (${res.status})`)
        return res.json()
      })
      .then((data) => {
        if (data && data.length > 0) {
          setSaints(data)
          setCache(data)
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  return { saints, loading, error }
}
