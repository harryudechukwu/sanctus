import { useState, useRef, useEffect } from 'react'
import { BookmarkSimple } from 'phosphor-react'
import { useSaints } from '../hooks/useSaints'
import { useScrollDirection } from '../hooks/useScrollDirection'
import { SaintOfTheDay } from '../components/SaintOfTheDay'
import { SearchBar } from '../components/SearchBar'
import { SkeletonGrid, SaintOfTheDaySkeleton } from '../components/Skeleton'
import { useOverlay } from '../context/OverlayContext'
import { resized, FALLBACK_ICON } from '../lib/image'

export function Home() {
  const { openSearch, openBookmarks, openDetail } = useOverlay()
  const { saints, loading } = useSaints()
  const [tappedId, setTappedId] = useState(null)
  const [minReady, setMinReady] = useState(false)
  const headerRef = useRef(null)
  useScrollDirection(headerRef)

  useEffect(() => {
    const timer = setTimeout(() => setMinReady(true), 3000)
    return () => clearTimeout(timer)
  }, [])

  const showGrid = !loading && minReady

  useEffect(() => {
    if (!showGrid) return
    const timer = setTimeout(() => {
      window.dispatchEvent(new CustomEvent('show-install-prompt'))
    }, 2000)
    return () => clearTimeout(timer)
  }, [showGrid])

  const handleImgError = (e) => {
    e.target.src = FALLBACK_ICON
  }

  const handleTap = (saint) => {
    setTappedId(saint.id)
    setTimeout(() => {
      setTappedId(null)
      openDetail(saint)
    }, 200)
  }

  return (
    <div>
      <header ref={headerRef} className="fixed inset-x-0 top-0 z-50">
        <div className="flex items-center justify-between max-md:gap-x-1.5 px-3 py-1.5">
          <div className="flex items-center justify-center bg-white py-1 w-12 flex-shrink-0">
            {showGrid ? (
              <img src="/favicon.svg" alt="Sanctus" className="h-10 w-10" />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center">
                <div className="animate-[blink_1s_ease-in-out_infinite] h-6 w-6 bg-gray-200" />
              </div>
            )}
          </div>
          <div className="flex-1 bg-white max-w-md py-1 max-md:max-w-[270px]">
            {showGrid ? (
              <SearchBar onClick={openSearch} />
            ) : (
              <div className="mx-auto flex h-10 w-40 items-center justify-center">
                <div className="animate-[blink_1s_ease-in-out_infinite] h-4 w-full bg-[#ddd]" />
              </div>
            )}
          </div>
          <div className="flex items-center justify-center bg-white py-1 w-12 flex-shrink-0">
            {showGrid ? (
              <button
                onClick={openBookmarks}
                className="flex h-10 w-10 items-center justify-center text-gray-600"
              >
                <BookmarkSimple className="h-6 w-6" />
              </button>
            ) : (
              <div className="flex h-10 w-10 items-center justify-center">
                <div className="animate-[blink_1s_ease-in-out_infinite] h-6 w-6 bg-gray-200" />
              </div>
            )}
          </div>
        </div>
      </header>

      <div>

        {!showGrid ? (
          <div className="relative left-1/2 -translate-x-1/2 w-screen">
            <SkeletonGrid />
          </div>
        ) : (
        <div className="relative left-1/2 -translate-x-1/2 w-screen">
        <div className="grid grid-cols-[repeat(auto-fill,minmax(80px,1fr))] md:grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-[2px]">
          {saints
            .slice().sort((a, b) => {
              if (a.image_url && !b.image_url) return -1
              if (!a.image_url && b.image_url) return 1
              return 0
            })
            .map((saint, index) => (
            <div
              key={saint.id}
              className="relative overflow-hidden cursor-pointer bg-gray-100"
              style={{ borderRadius: 0 }}
              onClick={() => handleTap(saint)}
            >
              {saint.image_url ? (
                <img
                  src={resized(saint.image_url)}
                  alt={saint.name}
                  onError={handleImgError}
                  className="w-full aspect-square object-cover transition-all duration-100 ease-out hover:scale-[1.1] hover:z-10 saturate-[0.15] hover:saturate-100"
                  loading={index < 12 ? undefined : 'lazy'}
                  {...(index < 12 ? { fetchpriority: 'high' } : {})}
                />
              ) : (
                <img src={FALLBACK_ICON} alt={saint.name} className="w-full aspect-square object-cover bg-gray-200 transition-all duration-100 ease-out saturate-[0.15] hover:saturate-100" />
              )}

              <div className="pointer-events-none absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/55 to-transparent pt-8 px-2 pb-[6px]">
                <span className="line-clamp-2 text-[15px] font-semibold leading-tight text-white">
                  {saint.name}
                </span>
              </div>

              {tappedId === saint.id && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 p-2">
                  <span className="text-center text-sm font-semibold leading-tight text-white">
                    {saint.name}
                  </span>
                  {saint.patronage?.[0] && (
                    <span className="mt-0.5 text-[11px] text-white/70">
                      {saint.patronage[0]}
                    </span>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
        </div>
        )}
      </div>

      <div className="fixed bottom-4 left-1/2 z-40 w-full max-w-lg -translate-x-1/2 px-3">
        {showGrid ? <SaintOfTheDay /> : <SaintOfTheDaySkeleton />}
      </div>
    </div>
  )
}
