import { useSaintOfDay } from '../hooks/useSaintOfDay'
import { useOverlay } from '../context/OverlayContext'
import { resized, FALLBACK_ICON } from '../lib/image'

export function SaintOfTheDay() {
  const { openDetail } = useOverlay()
  const { saint, loading } = useSaintOfDay()

  if (loading || !saint) return null

  return (
    <div
      onClick={() => openDetail(saint)}
      className="flex cursor-pointer items-center justify-between bg-gray-50 px-4 py-3"
    >
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold uppercase tracking-wider text-gray-500">
          Saint of the Day
        </p>
        <p className="truncate text-sm font-medium text-gray-900">{saint.name}</p>
        <p className="text-sm text-gray-400">{saint.feastDay}</p>
      </div>
      {saint.image_url ? (
        <img
          src={resized(saint.image_url)}
          alt=""
          className="ml-3 h-12 w-12 flex-shrink-0 object-cover"
        />
      ) : (
        <img src={FALLBACK_ICON} alt="" className="ml-3 h-12 w-12 flex-shrink-0 object-cover bg-gray-200" />
      )}
    </div>
  )
}
