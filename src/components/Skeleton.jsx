import { useState, useEffect } from 'react'

export function SkeletonGrid() {
  const [count, setCount] = useState(100)

  useEffect(() => {
    const calc = () => {
      const w = window.innerWidth
      const h = window.innerHeight
      const minColSize = w >= 768 ? 140 : 80
      const cols = Math.max(1, Math.floor(w / (minColSize + 2)))
      const rows = Math.max(1, Math.ceil((h - 60) / minColSize) + 3)
      setCount(cols * rows)
    }
    calc()
    window.addEventListener('resize', calc)
    return () => window.removeEventListener('resize', calc)
  }, [])

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(80px,1fr))] md:grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-[2px]">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="relative overflow-hidden bg-gray-100" style={{ borderRadius: 0 }}>
          <div className="animate-[blink_1s_ease-in-out_infinite] aspect-square w-full" />
          <div className="absolute bottom-0 left-0 right-0 px-2 pb-[6px]">
            <div className="animate-[blink_1s_ease-in-out_infinite] h-3 w-3/4 bg-[#ddd]" />
          </div>
        </div>
      ))}
    </div>
  )
}

export function SkeletonList({ count = 6 }) {
  return (
    <div className="mt-4 space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex animate-pulse items-center gap-3 p-2">
          <div className="h-14 w-14 flex-shrink-0 bg-gray-200" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-3/5 bg-gray-200" />
            <div className="h-3 w-2/5 bg-gray-100" />
          </div>
        </div>
      ))}
    </div>
  )
}

export function SaintOfTheDaySkeleton() {
  return (
    <div className="flex items-center justify-between bg-gray-50 px-4 py-3">
      <div className="min-w-0 flex-1 space-y-2">
        <div className="animate-[blink_1s_ease-in-out_infinite] h-3 w-28 bg-[#ddd]" />
        <div className="animate-[blink_1s_ease-in-out_infinite] h-3 w-40 bg-[#ddd]" />
        <div className="animate-[blink_1s_ease-in-out_infinite] h-3 w-24 bg-[#ddd]" />
      </div>
      <div className="animate-[blink_1s_ease-in-out_infinite] ml-3 h-12 w-12 flex-shrink-0 bg-gray-200" />
    </div>
  )
}
