import { useState } from 'react'
import { CaretLeft } from 'phosphor-react'
import { useBookmarks } from '../hooks/useBookmarks'
import { BookmarkButton } from '../components/BookmarkButton'
import { useOverlay } from '../context/OverlayContext'
import { resized, FALLBACK_ICON } from '../lib/image'

export function DetailOverlay({ saint }) {
  const { closeOverlay } = useOverlay()
  const { isBookmarked, addBookmark, removeBookmark } = useBookmarks()
  const bookmarked = isBookmarked(saint.id)
  const [imgLoaded, setImgLoaded] = useState(false)

  const paragraphs = saint.full_bio?.split('\n').filter(Boolean) ?? []

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-[3px]" onClick={closeOverlay} />
      <div className="relative z-10 mx-3 flex aspect-[1/2] max-h-[90vh] w-full max-w-md flex-col overflow-hidden bg-white shadow-2xl">
        <div className="absolute left-2 top-2 z-10">
          <button
            onClick={closeOverlay}
            className="flex h-10 w-10 items-center justify-center bg-white text-gray-700 shadow-sm"
          >
            <CaretLeft className="h-5 w-5" />
          </button>
        </div>
        <div className="absolute right-2 top-2 z-10">
          <div className="flex h-10 w-10 items-center justify-center bg-white shadow-sm">
            <BookmarkButton
              isBookmarked={bookmarked}
              onToggle={() =>
                bookmarked ? removeBookmark(saint.id) : addBookmark(saint)
              }
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto pb-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <div className="relative bg-gray-100">
            {saint.image_url ? (
              <img
                src={resized(saint.image_url)}
                alt={saint.name}
                className={`w-full aspect-square object-cover transition-opacity duration-300 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
                onLoad={() => setImgLoaded(true)}
              />
            ) : (
              <img src={FALLBACK_ICON} alt={saint.name} className="w-full aspect-square object-cover bg-gray-200" />
            )}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 px-4 pb-4">
              <h1 className="text-2xl font-bold text-white drop-shadow-sm">{saint.name}</h1>
            </div>
          </div>
          <div className="px-4">
          <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-gray-500">
            {saint.feastDay && <span>{saint.feastDay}</span>}
            {(saint.feastDay && (saint.origin_country || saint.death_year)) && (
              <span className="text-gray-300">|</span>
            )}
            {saint.origin_country && <span>{saint.origin_country}</span>}
            {(saint.origin_country || saint.feastDay) && saint.death_year !== undefined && (
              <span className="text-gray-300">|</span>
            )}
            {saint.death_year === null ? (
              <span className="text-gray-400">Eternal</span>
            ) : saint.death_year ? (
              <span className="text-base">d. {saint.death_year}</span>
            ) : null}
            </div>

          {saint.patronage && saint.patronage.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {saint.patronage.map((p) => (
                <span
                  key={p}
                  className="bg-yellow-50 border border-yellow-500 px-3 py-1 text-sm font-medium text-yellow-800"
                >
                  Patron Saint {p}
                </span>
              ))}
            </div>
          )}

          {saint.symbols && saint.symbols.length > 0 && (
            <div className="mt-5">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500">
                Symbols
              </h2>
              <div className="mt-2 flex flex-wrap gap-2">
                {saint.symbols.map((s) => (
                  <span
                    key={s}
                    className="bg-gray-100 px-2.5 py-1 text-sm font-medium text-gray-700"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 space-y-4 text-base leading-relaxed text-gray-700">
            {paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          <p className="mt-8 text-sm text-gray-400 text-center">
            Data sourced from <a href="https://www.catholic.org" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-600">Catholic.org</a>
          </p>
        </div>
      </div>
    </div>
  </div>
  )
}
