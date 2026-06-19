import { useState, useMemo, useEffect } from 'react'
import { CaretLeft } from 'phosphor-react'
import { useSaints } from '../hooks/useSaints'
import { SearchBar } from '../components/SearchBar'
import { SkeletonList } from '../components/Skeleton'
import { useOverlay } from '../context/OverlayContext'
import { resized, FALLBACK_ICON } from '../lib/image'

export function SearchOverlay() {
  const { closeOverlay, openDetail } = useOverlay()
  const { saints, loading } = useSaints()
  const [query, setQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 150)
    return () => clearTimeout(timer)
  }, [query])

  const results = useMemo(() => {
    if (!debouncedQuery.trim()) {
      return saints.slice(0, 30)
    }
    const lower = debouncedQuery.toLowerCase()
    return saints
      .filter(
        (s) =>
          s.name?.toLowerCase().includes(lower) ||
          s.patronage?.some((p) => p.toLowerCase().includes(lower)) ||
          s.origin_country?.toLowerCase().includes(lower),
      )
      .slice(0, 50)
  }, [debouncedQuery, saints])

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-[3px]" onClick={closeOverlay} />
      <div className="relative z-10 mx-3 flex aspect-[1/2] max-h-[90vh] w-full max-w-md flex-col overflow-hidden bg-white shadow-2xl">
        <div className="border-b border-gray-100 px-4 pt-3 pb-2">
          <button onClick={closeOverlay} className="flex items-center gap-1 text-gray-500 mb-3">
            <CaretLeft className="h-4 w-4" />
            <span className="text-base">Go back</span>
          </button>
          <SearchBar value={query} onChange={setQuery} placeholder="Type saint name here..." />
        </div>

        <div className="flex-1 overflow-y-auto px-4 pb-6">
          {loading ? (
            <SkeletonList count={6} />
          ) : debouncedQuery && results.length === 0 ? (
            <div className="mt-12 text-center">
              <p className="text-sm text-gray-500">
                Can't find who you're looking for?
              </p>
            </div>
          ) : (
            <div className="mt-4 space-y-1">
              {!debouncedQuery && (
                <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500">
                  Popular Saints
                </h2>
              )}
              {results.map((saint) => (
                <div
                  key={saint.id}
                  onClick={() => {
                    setQuery('')
                    openDetail(saint)
                  }}
                  className="flex cursor-pointer items-center gap-3 py-2 hover:bg-gray-50"
                >
                  <img
                    src={saint.image_url ? resized(saint.image_url) : FALLBACK_ICON}
                    alt={saint.name}
                    className="h-14 w-14 flex-shrink-0 object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-base font-bold text-gray-900">
                      {saint.name}
                    </p>
                    <p className="text-sm text-gray-500">{saint.feastDay}</p>
                    {saint.patronage?.[0] && (
                      <p className="truncate text-base text-gray-400">
                        Patron Saint {saint.patronage[0]}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
