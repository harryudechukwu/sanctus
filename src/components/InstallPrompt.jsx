import { useState, useEffect } from 'react'

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
    }
    window.addEventListener('beforeinstallprompt', handler)

    const timer = setTimeout(() => {
      if (deferredPrompt !== null || !window.matchMedia('(display-mode: standalone)').matches) {
        setVisible(true)
      }
    }, 30000)

    window.addEventListener('appinstalled', () => {
      setVisible(false)
    })

    return () => {
      window.removeEventListener('beforeinstallprompt', handler)
      clearTimeout(timer)
    }
  }, [deferredPrompt])

  if (!visible || !deferredPrompt) return null

  const handleInstall = async () => {
    deferredPrompt.prompt()
    const result = await deferredPrompt.userChoice
    if (result.outcome === 'accepted') {
      setVisible(false)
    }
    setDeferredPrompt(null)
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-gray-200 bg-white px-4 py-3 shadow-lg">
      <p className="text-sm text-gray-700">
        Install Sanctus for quick access to saints anytime, even offline.
      </p>
      <div className="mt-2 flex gap-2">
        <button
          onClick={handleInstall}
          className="bg-gray-900 px-4 py-1.5 text-sm font-medium text-white"
        >
          Install
        </button>
        <button
          onClick={() => setVisible(false)}
          className="bg-gray-100 px-4 py-1.5 text-sm font-medium text-gray-600"
        >
          Not now
        </button>
      </div>
    </div>
  )
}
