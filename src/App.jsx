import { Routes, Route } from 'react-router-dom'
import { OverlayProvider, useOverlay } from './context/OverlayContext'
import { Home } from './pages/Home'
import { SearchOverlay } from './overlays/SearchOverlay'
import { BookmarksOverlay } from './overlays/BookmarksOverlay'
import { DetailOverlay } from './overlays/DetailOverlay'
import { InstallPrompt } from './components/InstallPrompt'

function AppShell() {
  const { active } = useOverlay()

  return (
    <div className="mx-auto max-w-lg">
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
      <InstallPrompt />

      {active === 'search' && <SearchOverlay />}
      {active === 'bookmarks' && <BookmarksOverlay />}
      {active?.type === 'detail' && <DetailOverlay saint={active.saint} />}
    </div>
  )
}

function App() {
  return (
    <OverlayProvider>
      <AppShell />
    </OverlayProvider>
  )
}

export default App
