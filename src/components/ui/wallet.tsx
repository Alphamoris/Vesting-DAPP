'use client'

import { useState, useEffect } from 'react'
import { useWallet, useConnection } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js'
import { Wallet, Copy, ExternalLink, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react'
import { Tooltip } from './modals'

interface WalletInfoProps {
  className?: string
}

export function WalletInfo({ className = '' }: WalletInfoProps) {
  const { publicKey, connected, disconnect } = useWallet()
  const { connection } = useConnection()
  const [balance, setBalance] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const fetchBalance = async () => {
    if (!publicKey || !connected) return
    
    setLoading(true)
    try {
      const balance = await connection.getBalance(publicKey)
      setBalance(balance / LAMPORTS_PER_SOL)
    } catch (error) {
      console.error('Error fetching balance:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBalance()
  }, [publicKey, connected])

  const copyAddress = async () => {
    if (!publicKey) return
    
    try {
      await navigator.clipboard.writeText(publicKey.toBase58())
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy address:', error)
    }
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  if (!connected || !publicKey) {
    return (
      <div className={`cartoon-card p-6 text-center ${className}`}>
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
          <Wallet className="w-8 h-8 text-gray-400" />
        </div>
        
        <h3 className="text-lg font-semibold mb-2">Connect Your Wallet</h3>
        <p className="text-gray-600 mb-6">
          Connect your Solana wallet to start using the banking and vesting features
        </p>
        
        <div className="flex justify-center">
          <WalletMultiButton className="cartoon-btn !bg-gradient-to-r !from-blue-500 !to-purple-600 !text-white !font-semibold !px-6 !py-3 !rounded-xl" />
        </div>
      </div>
    )
  }

  return (
    <div className={`cartoon-card p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold oggy-gradient">Wallet Connected</h3>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
          <span className="text-sm text-green-600 font-medium">Connected</span>
        </div>
      </div>
      
      <div className="space-y-4">
        {/* Address Section */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Address</span>
            <div className="flex items-center space-x-2">
              <Tooltip content={copied ? 'Copied!' : 'Copy address'}>
                <button
                  onClick={copyAddress}
                  className="p-1 hover:bg-gray-200 rounded transition-colors"
                >
                  {copied ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <Copy className="w-4 h-4 text-gray-600" />
                  )}
                </button>
              </Tooltip>
              
              <Tooltip content="View on Solana Explorer">
                <a
                  href={`https://explorer.solana.com/address/${publicKey.toBase58()}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1 hover:bg-gray-200 rounded transition-colors"
                >
                  <ExternalLink className="w-4 h-4 text-gray-600" />
                </a>
              </Tooltip>
            </div>
          </div>
          
          <div className="font-mono text-sm text-gray-800 bg-white px-3 py-2 rounded border">
            {formatAddress(publicKey.toBase58())}
          </div>
        </div>
        
        {/* Balance Section */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">SOL Balance</span>
            <button
              onClick={fetchBalance}
              disabled={loading}
              className="p-1 hover:bg-white/50 rounded transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 text-gray-600 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
          
          <div className="text-2xl font-bold oggy-gradient">
            {loading ? (
              <div className="animate-pulse bg-gray-200 h-8 w-24 rounded" />
            ) : balance !== null ? (
              `${balance.toFixed(4)} SOL`
            ) : (
              <span className="text-red-500 text-base">Failed to load</span>
            )}
          </div>
          
          {balance !== null && (
            <div className="text-sm text-gray-600 mt-1">
              ≈ ${(balance * 20).toFixed(2)} USD
            </div>
          )}
        </div>
        
        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={fetchBalance}
            className="flex items-center justify-center space-x-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span className="text-sm font-medium">Refresh</span>
          </button>
          
          <button
            onClick={disconnect}
            className="flex items-center justify-center space-x-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
          >
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm font-medium">Disconnect</span>
          </button>
        </div>
      </div>
    </div>
  )
}

interface NetworkStatusProps {
  className?: string
}

export function NetworkStatus({ className = '' }: NetworkStatusProps) {
  const { connection } = useConnection()
  const [networkInfo, setNetworkInfo] = useState<{
    slot: number
    tps: number
    blockTime: number | null
  } | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchNetworkInfo = async () => {
    try {
      const slot = await connection.getSlot()
      const recentPerformance = await connection.getRecentPerformanceSamples(1)
      const blockTime = await connection.getBlockTime(slot)
      
      setNetworkInfo({
        slot,
        tps: recentPerformance[0]?.numTransactions / recentPerformance[0]?.samplePeriodSecs || 0,
        blockTime
      })
    } catch (error) {
      console.error('Error fetching network info:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNetworkInfo()
    const interval = setInterval(fetchNetworkInfo, 30000) // Update every 30 seconds
    
    return () => clearInterval(interval)
  }, [])

  return (
    <div className={`cartoon-card p-4 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-semibold text-gray-700">Network Status</h4>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-xs text-green-600">Live</span>
        </div>
      </div>
      
      {loading ? (
        <div className="space-y-2">
          <div className="animate-pulse bg-gray-200 h-4 w-full rounded" />
          <div className="animate-pulse bg-gray-200 h-4 w-3/4 rounded" />
        </div>
      ) : networkInfo ? (
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Current Slot:</span>
            <span className="font-mono">{networkInfo.slot.toLocaleString()}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">TPS:</span>
            <span className="font-mono">{Math.round(networkInfo.tps)}</span>
          </div>
          
          {networkInfo.blockTime && (
            <div className="flex justify-between">
              <span className="text-gray-600">Block Time:</span>
              <span className="font-mono text-xs">
                {new Date(networkInfo.blockTime * 1000).toLocaleTimeString()}
              </span>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center text-red-500 text-sm">
          Failed to load network info
        </div>
      )}
    </div>
  )
}

interface TransactionStatusProps {
  signature?: string
  onClose?: () => void
  className?: string
}

export function TransactionStatus({ signature, onClose, className = '' }: TransactionStatusProps) {
  const { connection } = useConnection()
  const [status, setStatus] = useState<'pending' | 'confirmed' | 'failed' | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!signature) return

    const checkTransaction = async () => {
      setLoading(true)
      try {
        const result = await connection.confirmTransaction(signature)
        if (result.value.err) {
          setStatus('failed')
        } else {
          setStatus('confirmed')
        }
      } catch (error) {
        setStatus('failed')
      } finally {
        setLoading(false)
      }
    }

    setStatus('pending')
    checkTransaction()
  }, [signature, connection])

  if (!signature) return null

  return (
    <div className={`cartoon-card p-4 border-l-4 ${
      status === 'confirmed' ? 'border-green-500 bg-green-50' :
      status === 'failed' ? 'border-red-500 bg-red-50' :
      'border-yellow-500 bg-yellow-50'
    } ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            status === 'confirmed' ? 'bg-green-500' :
            status === 'failed' ? 'bg-red-500' :
            'bg-yellow-500'
          }`}>
            {loading ? (
              <RefreshCw className="w-4 h-4 text-white animate-spin" />
            ) : status === 'confirmed' ? (
              <CheckCircle className="w-4 h-4 text-white" />
            ) : status === 'failed' ? (
              <AlertCircle className="w-4 h-4 text-white" />
            ) : (
              <RefreshCw className="w-4 h-4 text-white animate-spin" />
            )}
          </div>
          
          <div>
            <h4 className="text-sm font-semibold">
              Transaction {status === 'confirmed' ? 'Confirmed' : status === 'failed' ? 'Failed' : 'Pending'}
            </h4>
            <p className="text-xs text-gray-600 font-mono">
              {signature.slice(0, 20)}...{signature.slice(-10)}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Tooltip content="View on Solana Explorer">
            <a
              href={`https://explorer.solana.com/tx/${signature}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1 hover:bg-gray-200 rounded transition-colors"
            >
              <ExternalLink className="w-4 h-4 text-gray-600" />
            </a>
          </Tooltip>
          
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-200 rounded transition-colors"
            >
              <AlertCircle className="w-4 h-4 text-gray-600" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
