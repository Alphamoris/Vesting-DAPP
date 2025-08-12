'use client'

import { PublicKey } from '@solana/web3.js'
import { useMemo, useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { ExplorerLink } from '../cluster/cluster-ui'
import { AccountBalance, AccountButtons, AccountTokens, AccountTransactions } from './account-ui'
import { ellipsify } from '@/lib/utils'
import { 
  User, 
  Wallet, 
  Activity, 
  TrendingUp,
  Eye,
  Copy,
  ExternalLink,
  Sparkles
} from 'lucide-react'

export default function AccountDetailFeature() {
  const params = useParams()
  const [mounted, setMounted] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const address = useMemo(() => {
    if (!params.address) {
      return
    }
    try {
      return new PublicKey(params.address)
    } catch (e) {
      console.log(`Invalid public key`, e)
    }
  }, [params])

  if (!mounted) return null

  if (!address) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4">
            <img src="/oc1.png" alt="Error Oggy" className="w-full h-full rounded-full" />
          </div>
          <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 mb-2">Invalid Account Address</h1>
          <p className="text-sm sm:text-base text-gray-600">The provided address is not a valid Solana public key.</p>
        </div>
      </div>
    )
  }

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(address.toString())
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy address:', err)
    }
  }

  return (
    <div className="min-h-screen relative">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-orange-50 via-blue-50 to-green-50 py-6 sm:py-8 lg:py-12 px-3 sm:px-4 lg:px-6 overflow-hidden">

        <div className="relative max-w-4xl mx-auto">
          <div className="text-center mb-6 sm:mb-8">
            <div className="flex items-center justify-center mb-3 sm:mb-4">
              <img 
                src="/oc6.png" 
                alt="Account Avatar" 
                className="w-12 h-12 sm:w-16 sm:h-16 rounded-full shadow-lg bg-white p-1 sm:p-2 border-2 sm:border-4 border-orange-300"
              />
            </div>
            
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-orange-500 via-blue-500 to-green-500 bg-clip-text text-transparent mb-3 sm:mb-4">
              Account Overview 👤
            </h1>
            
            <div className="bg-white/70 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-lg border border-orange-200 max-w-full sm:max-w-2xl mx-auto">
              <div className="flex items-center justify-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                <Wallet className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />
                <span className="text-xs sm:text-sm font-medium text-gray-600">Wallet Address</span>
              </div>
              
              <div className="flex items-center justify-center gap-1 sm:gap-2 mb-3 sm:mb-4 flex-wrap">
                <code className="text-xs sm:text-sm font-mono bg-gray-100 px-2 sm:px-3 py-1 rounded border break-all">
                  {ellipsify(address.toString())}
                </code>
                <button 
                  onClick={handleCopyAddress}
                  className="p-1 hover:bg-gray-100 rounded transition-colors flex-shrink-0"
                  title="Copy full address"
                >
                  <Copy className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />
                </button>
              </div>

              {copied && (
                <div className="text-green-600 text-xs sm:text-sm font-medium mb-2">
                  ✓ Address copied to clipboard!
                </div>
              )}

              <div className="flex justify-center">
                <ExplorerLink path={`account/${address}`} label="View on Explorer">
                  <div className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-orange-500 to-blue-500 text-white rounded-md sm:rounded-lg hover:from-orange-600 hover:to-blue-600 transition-all duration-300 text-xs sm:text-sm font-medium">
                    <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">View on </span>Explorer
                  </div>
                </ExplorerLink>
              </div>
            </div>
          </div>

          {/* Account Balance Card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-lg sm:shadow-xl border border-orange-200">
            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-800">Account Balance</h2>
            </div>
            <AccountBalance address={address} />
          </div>

          {/* Quick Actions */}
          <div className="mt-4 sm:mt-6">
            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-800">Quick Actions</h2>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-lg sm:shadow-xl border border-orange-200">
              <AccountButtons address={address} />
            </div>
          </div>
        </div>
      </div>

      {/* Account Details Section */}
      <div className="py-6 sm:py-8 lg:py-12 px-3 sm:px-4 lg:px-6">
        <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6 lg:space-y-8">
          {/* Tokens Section */}
          <div className="bg-white rounded-lg sm:rounded-xl shadow-lg border border-orange-100 overflow-hidden">
            <div className="bg-gradient-to-r from-orange-100 to-blue-100 px-4 sm:px-6 py-3 sm:py-4 border-b border-orange-200">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                  <Wallet className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-gray-800">Token Holdings</h3>
              </div>
            </div>
            <div className="p-4 sm:p-6">
              <AccountTokens address={address} />
            </div>
          </div>

          {/* Transactions Section */}
          <div className="bg-white rounded-lg sm:rounded-xl shadow-lg border border-orange-100 overflow-hidden">
            <div className="bg-gradient-to-r from-orange-100 to-blue-100 px-4 sm:px-6 py-3 sm:py-4 border-b border-orange-200">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center">
                  <Activity className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-gray-800">Recent Transactions</h3>
              </div>
            </div>
            <div className="p-4 sm:p-6">
              <AccountTransactions address={address} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
