import { useState, useCallback } from 'react'
import { CaretLeft } from 'phosphor-react'
import { useBookmarks } from '../hooks/useBookmarks'
import { useOverlay } from '../context/OverlayContext'
import { resized, FALLBACK_ICON } from '../lib/image'

export function BookmarksOverlay() {
  const { closeOverlay, openDetail } = useOverlay()
  const { bookmarks, loading } = useBookmarks()
  const [tappedId, setTappedId] = useState(null)

  const handleTap = useCallback(
    (saint) => {
      setTappedId(saint.id)
      setTimeout(() => {
        setTappedId(null)
        openDetail(saint)
      }, 200)
    },
    [openDetail],
  )

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={closeOverlay} />
      <div className="relative z-10 mx-3 flex aspect-[1/2] max-h-[90vh] w-full max-w-md flex-col overflow-hidden bg-white shadow-2xl">
        <div className="border-b border-gray-100 px-4 pt-3 pb-2">
          <button onClick={closeOverlay} className="flex items-center gap-1 text-gray-500 mb-3">
            <CaretLeft className="h-4 w-4" />
            <span className="text-base">Go back</span>
          </button>
          <span className="text-sm font-semibold text-gray-900">Bookmarks</span>
        </div>

        <div className="flex-1 overflow-y-auto pb-4">
          {loading ? (
            <div className="px-4 pt-4">
              <p className="text-sm text-gray-500">Loading bookmarks...</p>
            </div>
          ) : bookmarks.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-4 pt-16 pb-8">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="h-10 w-10 text-gray-300"
              >
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
              </svg>
              <p className="mt-4 text-center text-sm text-gray-500">
                No saved saints yet. Tap the bookmark icon on any saint to save them here.
              </p>
            </div>
          ) : (
            <div className="px-2 pt-4">
              <div className="grid grid-cols-[repeat(auto-fill,minmax(80px,1fr))] md:grid-cols-[repeat(auto-fill,minmax(100px,1fr))] gap-[2px]">
                {bookmarks.map((saint) => (
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
                        className="w-full aspect-square object-cover transition-transform duration-100 ease-out hover:scale-[1.1] hover:z-10"
                        loading="lazy"
                      />
                    ) : (
                      <img src={FALLBACK_ICON} alt={saint.name} className="w-full aspect-square object-cover bg-gray-200" />
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
      </div>
    </div>
  )
}
