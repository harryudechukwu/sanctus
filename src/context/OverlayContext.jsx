import { createContext, useContext, useState, useCallback } from 'react'

const OverlayContext = createContext(null)

export function OverlayProvider({ children }) {
  const [active, setActive] = useState(null)

  const openSearch = useCallback(() => setActive('search'), [])
  const openBookmarks = useCallback(() => setActive('bookmarks'), [])
  const openDetail = useCallback((saint) => setActive({ type: 'detail', saint }), [])
  const closeOverlay = useCallback(() => setActive(null), [])

  return (
    <OverlayContext.Provider value={{ active, openSearch, openBookmarks, openDetail, closeOverlay }}>
      {children}
    </OverlayContext.Provider>
  )
}

export function useOverlay() {
  const ctx = useContext(OverlayContext)
  if (!ctx) throw new Error('useOverlay must be used within OverlayProvider')
  return ctx
}
