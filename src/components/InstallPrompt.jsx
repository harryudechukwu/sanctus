import { useState, useEffect, useRef } from 'react'

export function InstallPrompt() {
  const deferredRef = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const beforeInstallHandler = (e) => {
      e.preventDefault()
      deferredRef.current = e
    }
    window.addEventListener('beforeinstallprompt', beforeInstallHandler)

    const showHandler = () => {
      if (deferredRef.current) setVisible(true)
    }
    window.addEventListener('show-install-prompt', showHandler)

    return () => {
      window.removeEventListener('beforeinstallprompt', beforeInstallHandler)
      window.removeEventListener('show-install-prompt', showHandler)
    }
  }, [])

  const close = () => setVisible(false)

  if (!visible || !deferredRef.current) return null

  const handleInstall = async () => {
    deferredRef.current.prompt()
    const result = await deferredRef.current.userChoice
    if (result.outcome === 'accepted') setVisible(false)
    deferredRef.current = null
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-[3px]" onClick={close} />
      <div className="relative z-10 mx-3 flex w-full max-w-md flex-col bg-white shadow-2xl">
        <img src="https://res.cloudinary.com/djksfpmee/image/upload/v1781970857/image_bvaviz.png" alt="" className="w-full" />
        <div className="flex flex-col items-center gap-[40px] md:gap-12 px-4 pt-8 pb-4">
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
    </div>
  )
}
