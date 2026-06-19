import { useState, useEffect, useRef } from 'react'

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [visible, setVisible] = useState(false)
  const deferredRef = useRef(null)

  useEffect(() => {
    const beforeInstallHandler = (e) => {
      e.preventDefault()
      deferredRef.current = e
      setDeferredPrompt(e)
    }
    window.addEventListener('beforeinstallprompt', beforeInstallHandler)

    const showHandler = () => {
      if (!deferredRef.current) {
        deferredRef.current = { prompt: async () => {}, userChoice: Promise.resolve({ outcome: '' }) }
        setDeferredPrompt(deferredRef.current)
      }
      setVisible(true)
    }
    window.addEventListener('show-install-prompt', showHandler)

    return () => {
      window.removeEventListener('beforeinstallprompt', beforeInstallHandler)
      window.removeEventListener('show-install-prompt', showHandler)
    }
  }, [])

  const close = () => setVisible(false)

  if (!visible || !deferredPrompt) return null

  const handleInstall = async () => {
    deferredPrompt.prompt()
    const result = await deferredPrompt.userChoice
    if (result.outcome === 'accepted') setVisible(false)
    setDeferredPrompt(null)
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-[3px]" onClick={close} />
      <div className="relative z-10 mx-3 flex w-full max-w-md flex-col items-center gap-6 bg-white px-4 py-8 shadow-2xl">
        <img src="/icons/icon.png" alt="" className="h-16 w-16" />
        <div className="flex flex-col items-center gap-1">
        <h2 className="text-2xl font-bold text-gray-900">Install Sanctus</h2>
        <p className="text-center text-lg text-gray-600 leading-tight">
          Search 5,795 saints, bookmark your favorites, and discover a new saint every day. Saved bookmarks are stored on your device and will be available even when you're offline.
        </p>
        </div>
        <div className="flex flex-col gap-3 w-full">
          <button
            onClick={handleInstall}
            className="w-full bg-gray-900 py-3.5 text-base font-bold text-white"
          >
            Install
          </button>
          <button
            onClick={close}
            className="w-full bg-gray-100 py-3.5 text-base font-bold text-gray-600"
          >
            Not now
          </button>
        </div>
      </div>
    </div>
  )
}
