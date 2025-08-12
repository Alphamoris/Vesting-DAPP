'use client'

import { useState, useEffect } from 'react'
import { AlertTriangle, RefreshCw, Wifi, WifiOff } from 'lucide-react'

interface ErrorBoundaryProps {
  error?: any
  children?: React.ReactNode
  fallback?: React.ReactNode
}

export function NetworkErrorHandler({ error, children, fallback }: ErrorBoundaryProps) {
  const [isOnline, setIsOnline] = useState(true)
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const isNetworkError = error && (
    error.message?.includes('Failed to fetch') ||
    error.message?.includes('Network request failed') ||
    error.message?.includes('fetch') ||
    error.code === 'NETWORK_ERROR'
  )

  if (!isOnline) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-red-50 border border-red-200 rounded-xl">
        <WifiOff className="w-12 h-12 text-red-500 mb-4" />
        <h3 className="text-lg font-bold text-red-800 mb-2">No Internet Connection</h3>
        <p className="text-red-600 text-center mb-4">
          Please check your internet connection and try again.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Retry
        </button>
      </div>
    )
  }

  if (isNetworkError) {
    return fallback || (
      <div className="flex flex-col items-center justify-center p-8 bg-orange-50 border border-orange-200 rounded-xl">
        <div className="flex items-center mb-4">
          <img src="/oc1.png" alt="Sad Oggy" className="w-12 h-12 rounded-full mr-3" />
          <AlertTriangle className="w-8 h-8 text-orange-500" />
        </div>
        <h3 className="text-lg font-bold text-orange-800 mb-2">Connection Issue</h3>
        <p className="text-orange-600 text-center mb-4">
          Oggy is having trouble connecting to the Solana network. This might be due to:
        </p>
        <ul className="text-sm text-orange-600 mb-4 space-y-1">
          <li>• Network congestion</li>
          <li>• RPC endpoint issues</li>
          <li>• Temporary service interruption</li>
        </ul>
        <button
          onClick={() => {
            setRetryCount(prev => prev + 1)
            window.location.reload()
          }}
          className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Try Again {retryCount > 0 && `(${retryCount})`}
        </button>
        <p className="text-xs text-orange-500 mt-2">
          If the problem persists, try switching to a different network in your wallet.
        </p>
      </div>
    )
  }

  return <>{children}</>
}

export function ConnectionStatus() {
  const [isOnline, setIsOnline] = useState(true)

  useEffect(() => {
    setIsOnline(navigator.onLine)
    
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  if (!isOnline) {
    return (
      <div className="fixed top-20 right-4 z-50 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
        <WifiOff className="w-4 h-4" />
        <span className="text-sm">Offline</span>
      </div>
    )
  }

  return null
}
