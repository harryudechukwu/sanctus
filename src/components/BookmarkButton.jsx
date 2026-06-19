import { BookmarkSimple } from 'phosphor-react'

export function BookmarkButton({ isBookmarked, onToggle, className }) {
  return (
    <button
      onClick={onToggle}
      className={`bg-white/80 p-2 backdrop-blur-sm ${className ?? ''}`}
    >
      <BookmarkSimple
        className={isBookmarked ? 'h-5 w-5 text-amber-500' : 'h-5 w-5 text-gray-600'}
        weight={isBookmarked ? 'fill' : 'regular'}
      />
    </button>
  )
}
