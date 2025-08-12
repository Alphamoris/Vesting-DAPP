'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { NetworkIcon } from '@/components/icons/custom-icons'
import { ChevronDown, Wifi, WifiOff, Globe, Monitor, CheckCircle, AlertTriangle } from 'lucide-react'
import { useNetworkConnection, NetworkType, NETWORK_CONFIGS, checkLocalnetAvailability } from '@/lib/network-config'

export function NavbarNetworkSelector() {
  const { network, setNetwork, networkConfig, isLocalnet, isDevnet } = useNetworkConnection()
  const [isOpen, setIsOpen] = useState(false)
  const [localnetAvailable, setLocalnetAvailable] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Check localnet availability on mount
  useEffect(() => {
    if (isLocalnet) {
      checkLocalnetAvailability().then(setLocalnetAvailable)
    }
  }, [isLocalnet])

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
        return <Monitor className="w-3 h-3" />
      case 'devnet':
        return <Globe className="w-3 h-3" />
      case 'mainnet-beta':
        return <Wifi className="w-3 h-3" />
      default:
        return <WifiOff className="w-3 h-3" />
    }
  }

  const getNetworkStatus = (networkType: NetworkType) => {
    if (networkType === 'localnet') {
      return localnetAvailable ? 'online' : 'offline'
    }
    return 'online'
  }

  const getStatusColor = (networkType: NetworkType) => {
    if (networkType === 'localnet' && !localnetAvailable) {
      return 'destructive'
    }
    return 'default'
  }

  const handleNetworkChange = (newNetwork: NetworkType) => {
    setNetwork(newNetwork)
    setIsOpen(false)
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 h-8 bg-white/90 hover:bg-white border border-orange-300 hover:border-orange-400 transition-all duration-200 shadow-sm hover:shadow-md"
      >
        <NetworkIcon className="w-3.5 h-3.5" />
        <span className="text-xs font-medium">{networkConfig.name}</span>
        <div className="flex items-center gap-1">
          {network === 'localnet' ? (
            localnetAvailable ? (
              <CheckCircle className="w-2.5 h-2.5 text-green-500" />
            ) : (
              <AlertTriangle className="w-2.5 h-2.5 text-orange-500" />
            )
          ) : (
            <CheckCircle className="w-2.5 h-2.5 text-green-500" />
          )}
          <ChevronDown className={`w-3 h-3 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </Button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-64 bg-white border border-orange-200 rounded-lg shadow-lg z-50 overflow-hidden">
          <div className="bg-gradient-to-r from-orange-50 to-blue-50 px-3 py-2 border-b border-orange-200">
            <div className="flex items-center gap-2">
              <NetworkIcon className="w-4 h-4" />
              <span className="text-sm font-semibold text-gray-700">Network Selection</span>
            </div>
          </div>
          
          <div className="p-2 space-y-1">
            {Object.entries(NETWORK_CONFIGS).map(([key, config]) => (
              <button
                key={key}
                onClick={() => handleNetworkChange(key as NetworkType)}
                disabled={key === 'localnet' && !localnetAvailable}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-left transition-all duration-200 ${
                  network === key
                    ? 'bg-gradient-to-r from-orange-100 to-blue-100 text-orange-700 border border-orange-300'
                    : 'hover:bg-gray-50 text-gray-700'
                } ${key === 'localnet' && !localnetAvailable ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className="flex items-center gap-2">
                  {getNetworkIcon(key as NetworkType)}
                  <span className="text-sm font-medium">{config.name}</span>
                </div>
                
                <div className="ml-auto flex items-center gap-2">
                  <Badge 
                    variant={getStatusColor(key as NetworkType)} 
                    className={`text-xs px-2 py-0.5 ${
                      getNetworkStatus(key as NetworkType) === 'online' 
                        ? 'bg-green-100 text-green-700 border-green-300' 
                        : 'bg-red-100 text-red-700 border-red-300'
                    }`}
                  >
                    {getNetworkStatus(key as NetworkType)}
                  </Badge>
                  {network === key && (
                    <CheckCircle className="w-3.5 h-3.5 text-orange-500" />
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Network Info Footer */}
          <div className="bg-gray-50 px-3 py-2 border-t border-gray-200">
            <div className="text-xs text-gray-600">
              <div className="font-medium mb-1">Current Network:</div>
              <div className="text-gray-500 break-all">{networkConfig.endpoint}</div>
              <div className="mt-1 text-gray-500">
                {isLocalnet ? 'Local development' : 
                 isDevnet ? 'Test with SOL faucet' : 
                 'Production mainnet'}
              </div>
            </div>
          </div>

          {/* Localnet Warning */}
          {!localnetAvailable && (
            <div className="bg-orange-50 border-t border-orange-200 px-3 py-2">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-3 h-3 text-orange-500 mt-0.5 flex-shrink-0" />
                <div className="text-xs text-orange-700">
                  <span className="font-medium">Localnet offline</span>
                  <div className="mt-0.5">Run <code className="bg-orange-100 px-1 rounded text-xs">solana-test-validator</code></div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
