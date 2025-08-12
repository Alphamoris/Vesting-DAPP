'use client'

import React, { useState, useRef, useEffect } from 'react'
import { ChevronDown, Wifi, WifiOff, Globe, Monitor, CheckCircle, AlertTriangle } from 'lucide-react'
import { useNetworkConnection, NetworkType, NETWORK_CONFIGS, checkLocalnetAvailability } from '@/lib/network-config'

export function CompactNetworkSelector() {
  const { network, setNetwork, networkConfig } = useNetworkConnection()
  const [isOpen, setIsOpen] = useState(false)
  const [localnetAvailable, setLocalnetAvailable] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Check localnet availability on mount and periodically
  useEffect(() => {
    const checkAvailability = async () => {
      const available = await checkLocalnetAvailability()
      setLocalnetAvailable(available)
    }
    
    // Check immediately
    checkAvailability()
    
    // Check every 10 seconds when dropdown is open
    let interval: NodeJS.Timeout
    if (isOpen) {
      interval = setInterval(checkAvailability, 10000)
    }
    
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isOpen])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const getNetworkIcon = (networkType: NetworkType) => {
    switch (networkType) {
      case 'localnet':
        return <Monitor className="w-3.5 h-3.5" />
      case 'devnet':
        return <Globe className="w-3.5 h-3.5" />
      case 'mainnet-beta':
        return <Wifi className="w-3.5 h-3.5" />
      default:
        return <WifiOff className="w-3.5 h-3.5" />
    }
  }

  const getNetworkColor = (networkType: NetworkType) => {
    switch (networkType) {
      case 'localnet':
        return localnetAvailable ? 'text-blue-600' : 'text-orange-500'
      case 'devnet':
        return 'text-yellow-600'
      case 'mainnet-beta':
        return 'text-green-600'
      default:
        return 'text-gray-500'
    }
  }

  const getStatusIndicator = (networkType: NetworkType) => {
    if (networkType === 'localnet') {
      return localnetAvailable ? (
        <CheckCircle className="w-2 h-2 text-green-500" />
      ) : (
        <AlertTriangle className="w-2 h-2 text-orange-500" />
      )
    }
    return <CheckCircle className="w-2 h-2 text-green-500" />
  }

  const handleNetworkChange = (newNetwork: NetworkType) => {
    if (newNetwork === 'localnet' && !localnetAvailable) {
      // Show user feedback that localnet is not available
      console.warn('Localnet is not available. Please start solana-test-validator.')
      return
    }
    setNetwork(newNetwork)
    setIsOpen(false)
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Compact Trigger Button - matches wallet adapter style */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md"
      >
        <div className={`${getNetworkColor(network)} bg-white rounded-full p-0.5`}>
          {getNetworkIcon(network)}
        </div>
        <span className="hidden sm:inline">{networkConfig.name}</span>
        <span className="sm:hidden text-xs">{networkConfig.name.slice(0, 3)}</span>
        <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-72 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 px-4 py-3 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
              <span className="text-sm font-semibold text-gray-700">Network Selection</span>
            </div>
          </div>
          
          {/* Network Options */}
          <div className="p-2">
            {Object.entries(NETWORK_CONFIGS).map(([key, config]) => (
              <button
                key={key}
                onClick={() => handleNetworkChange(key as NetworkType)}
                disabled={key === 'localnet' && !localnetAvailable}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200 ${
                  network === key
                    ? 'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border border-purple-200'
                    : 'hover:bg-gray-50 text-gray-700'
                } ${key === 'localnet' && !localnetAvailable ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className={`${getNetworkColor(key as NetworkType)} bg-gray-100 rounded-full p-1.5`}>
                  {getNetworkIcon(key as NetworkType)}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{config.name}</span>
                    {network === key && (
                      <CheckCircle className="w-3.5 h-3.5 text-purple-500" />
                    )}
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    {key === 'localnet' ? 'Local development' :
                     key === 'devnet' ? 'Test with SOL faucet' :
                     'Production mainnet'}
                  </div>
                </div>
                
                <div className="flex flex-col items-end">
                  {getStatusIndicator(key as NetworkType)}
                  {key === 'localnet' && !localnetAvailable && (
                    <span className="text-xs text-orange-600 mt-1">Offline</span>
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Current Network Info */}
          <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
            <div className="text-xs text-gray-600">
              <div className="font-medium mb-1">Current Endpoint:</div>
              <div className="text-gray-500 break-all font-mono text-xs">{networkConfig.endpoint}</div>
            </div>
          </div>

          {/* Localnet Warning */}
          {!localnetAvailable && (
            <div className="bg-orange-50 border-t border-orange-200 px-4 py-3">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-3.5 h-3.5 text-orange-500 mt-0.5 flex-shrink-0" />
                <div className="text-xs text-orange-700">
                  <span className="font-medium">Localnet unavailable</span>
                  <div className="mt-1">Start with: <code className="bg-orange-100 px-1 rounded">solana-test-validator</code></div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
