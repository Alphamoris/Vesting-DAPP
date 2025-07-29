'use client'

import { useState, useCallback, createContext, useContext, ReactNode } from 'react'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { Transaction, TransactionSignature, SendOptions } from '@solana/web3.js'
import { Notification } from './modals'

interface NotificationState {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  isVisible: boolean
  duration?: number
}

interface TransactionState {
  signature?: string
  status: 'idle' | 'pending' | 'confirming' | 'confirmed' | 'failed'
  error?: string
}

interface NotificationContextType {
  notifications: NotificationState[]
  showNotification: (notification: Omit<NotificationState, 'id' | 'isVisible'>) => string
  hideNotification: (id: string) => void
  clearAllNotifications: () => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<NotificationState[]>([])

  const showNotification = useCallback((notification: Omit<NotificationState, 'id' | 'isVisible'>) => {
    const id = Math.random().toString(36).substr(2, 9)
    const newNotification: NotificationState = {
      ...notification,
      id,
      isVisible: true
    }

    setNotifications(prev => [...prev, newNotification])
    return id
  }, [])

  const hideNotification = useCallback((id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, isVisible: false }
          : notification
      )
    )

    // Remove from array after animation
    setTimeout(() => {
      setNotifications(prev => prev.filter(notification => notification.id !== id))
    }, 300)
  }, [])

  const clearAllNotifications = useCallback(() => {
    setNotifications([])
  }, [])

  return (
    <NotificationContext.Provider value={{
      notifications,
      showNotification,
      hideNotification,
      clearAllNotifications
    }}>
      {children}
      
      {/* Render notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-3">
        {notifications.map(notification => (
          <Notification
            key={notification.id}
            type={notification.type}
            title={notification.title}
            message={notification.message}
            isVisible={notification.isVisible}
            onClose={() => hideNotification(notification.id)}
            duration={notification.duration}
          />
        ))}
      </div>
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider')
  }
  return context
}

interface UseTransactionOptions {
  onSuccess?: (signature: string) => void
  onError?: (error: Error) => void
  showNotifications?: boolean
}

export function useTransaction(options: UseTransactionOptions = {}) {
  const { connection } = useConnection()
  const { publicKey, sendTransaction } = useWallet()
  const { showNotification } = useNotifications()
  const [transactionState, setTransactionState] = useState<TransactionState>({
    status: 'idle'
  })

  const executeTransaction = useCallback(async (
    transaction: Transaction,
    sendOptions?: SendOptions
  ): Promise<TransactionSignature | null> => {
    if (!publicKey) {
      const error = new Error('Wallet not connected')
      if (options.showNotifications !== false) {
        showNotification({
          type: 'error',
          title: 'Wallet Error',
          message: 'Please connect your wallet first'
        })
      }
      options.onError?.(error)
      return null
    }

    setTransactionState({ status: 'pending' })

    if (options.showNotifications !== false) {
      showNotification({
        type: 'info',
        title: 'Transaction Pending',
        message: 'Please approve the transaction in your wallet',
        duration: 3000
      })
    }

    try {
      const signature = await sendTransaction(transaction, connection, sendOptions)
      
      setTransactionState({ 
        status: 'confirming', 
        signature 
      })

      if (options.showNotifications !== false) {
        showNotification({
          type: 'info',
          title: 'Transaction Submitted',
          message: 'Waiting for confirmation...',
          duration: 5000
        })
      }

      // Confirm transaction
      const confirmation = await connection.confirmTransaction(signature)
      
      if (confirmation.value.err) {
        throw new Error(`Transaction failed: ${confirmation.value.err}`)
      }

      setTransactionState({ 
        status: 'confirmed', 
        signature 
      })

      if (options.showNotifications !== false) {
        showNotification({
          type: 'success',
          title: 'Transaction Confirmed',
          message: 'Your transaction has been processed successfully',
          duration: 5000
        })
      }

      options.onSuccess?.(signature)
      return signature

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      
      setTransactionState({ 
        status: 'failed', 
        error: errorMessage 
      })

      if (options.showNotifications !== false) {
        showNotification({
          type: 'error',
          title: 'Transaction Failed',
          message: errorMessage,
          duration: 8000
        })
      }

      options.onError?.(error as Error)
      return null
    }
  }, [publicKey, sendTransaction, connection, showNotification, options])

  const reset = useCallback(() => {
    setTransactionState({ status: 'idle' })
  }, [])

  return {
    executeTransaction,
    transactionState,
    reset,
    isLoading: transactionState.status === 'pending' || transactionState.status === 'confirming',
    isSuccess: transactionState.status === 'confirmed',
    isError: transactionState.status === 'failed'
  }
}

// Common transaction helpers
export class TransactionHelper {
  static formatError(error: unknown): string {
    if (error instanceof Error) {
      // Handle common Solana errors
      if (error.message.includes('User rejected')) {
        return 'Transaction was cancelled by user'
      }
      if (error.message.includes('insufficient funds')) {
        return 'Insufficient funds to complete transaction'
      }
      if (error.message.includes('blockhash not found')) {
        return 'Transaction expired, please try again'
      }
      if (error.message.includes('custom program error')) {
        return 'Program execution failed, please check your inputs'
      }
      return error.message
    }
    return 'An unknown error occurred'
  }

  static getExplorerUrl(signature: string, network: 'mainnet-beta' | 'testnet' | 'devnet' = 'devnet'): string {
    const cluster = network === 'mainnet-beta' ? '' : `?cluster=${network}`
    return `https://explorer.solana.com/tx/${signature}${cluster}`
  }

  static shortenSignature(signature: string): string {
    return `${signature.slice(0, 8)}...${signature.slice(-8)}`
  }

  static formatSOL(lamports: number): string {
    return (lamports / 1_000_000_000).toFixed(4)
  }

  static formatUSD(amount: number, solPrice: number = 20): string {
    return (amount * solPrice).toFixed(2)
  }
}

// Transaction status component for displaying current transaction state
interface TransactionStatusDisplayProps {
  transactionState: TransactionState
  className?: string
}

export function TransactionStatusDisplay({ 
  transactionState, 
  className = '' 
}: TransactionStatusDisplayProps) {
  if (transactionState.status === 'idle') return null

  const getStatusColor = () => {
    switch (transactionState.status) {
      case 'pending': return 'bg-yellow-100 border-yellow-300 text-yellow-800'
      case 'confirming': return 'bg-blue-100 border-blue-300 text-blue-800'
      case 'confirmed': return 'bg-green-100 border-green-300 text-green-800'
      case 'failed': return 'bg-red-100 border-red-300 text-red-800'
      default: return 'bg-gray-100 border-gray-300 text-gray-800'
    }
  }

  const getStatusText = () => {
    switch (transactionState.status) {
      case 'pending': return 'Preparing transaction...'
      case 'confirming': return 'Confirming transaction...'
      case 'confirmed': return 'Transaction confirmed!'
      case 'failed': return 'Transaction failed'
      default: return 'Unknown status'
    }
  }

  const getStatusIcon = () => {
    switch (transactionState.status) {
      case 'pending': return '⏳'
      case 'confirming': return '🔄'
      case 'confirmed': return '✅'
      case 'failed': return '❌'
      default: return '❓'
    }
  }

  return (
    <div className={`rounded-lg border-2 p-4 ${getStatusColor()} ${className}`}>
      <div className="flex items-center space-x-3">
        <span className="text-2xl">{getStatusIcon()}</span>
        <div className="flex-1">
          <h4 className="font-semibold">{getStatusText()}</h4>
          
          {transactionState.signature && (
            <p className="text-sm opacity-75 font-mono">
              {TransactionHelper.shortenSignature(transactionState.signature)}
            </p>
          )}
          
          {transactionState.error && (
            <p className="text-sm mt-1">
              {TransactionHelper.formatError(transactionState.error)}
            </p>
          )}
        </div>
        
        {transactionState.signature && (
          <a
            href={TransactionHelper.getExplorerUrl(transactionState.signature)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm underline hover:no-underline"
          >
            View →
          </a>
        )}
      </div>
    </div>
  )
}

// Hook for batch transactions
export function useBatchTransaction(options: UseTransactionOptions = {}) {
  const { connection } = useConnection()
  const { publicKey, sendTransaction } = useWallet()
  const { showNotification } = useNotifications()
  const [batchState, setBatchState] = useState<{
    status: 'idle' | 'executing' | 'completed' | 'failed'
    current: number
    total: number
    signatures: string[]
    errors: string[]
  }>({
    status: 'idle',
    current: 0,
    total: 0,
    signatures: [],
    errors: []
  })

  const executeBatch = useCallback(async (
    transactions: Transaction[],
    sendOptions?: SendOptions
  ) => {
    if (!publicKey) {
      if (options.showNotifications !== false) {
        showNotification({
          type: 'error',
          title: 'Wallet Error',
          message: 'Please connect your wallet first'
        })
      }
      return
    }

    setBatchState({
      status: 'executing',
      current: 0,
      total: transactions.length,
      signatures: [],
      errors: []
    })

    const signatures: string[] = []
    const errors: string[] = []

    for (let i = 0; i < transactions.length; i++) {
      setBatchState(prev => ({ ...prev, current: i + 1 }))

      try {
        const signature = await sendTransaction(transactions[i], connection, sendOptions)
        await connection.confirmTransaction(signature)
        signatures.push(signature)
        
        if (options.showNotifications !== false) {
          showNotification({
            type: 'info',
            title: `Transaction ${i + 1}/${transactions.length}`,
            message: 'Completed successfully',
            duration: 2000
          })
        }
      } catch (error) {
        const errorMessage = TransactionHelper.formatError(error)
        errors.push(errorMessage)
        
        if (options.showNotifications !== false) {
          showNotification({
            type: 'error',
            title: `Transaction ${i + 1} Failed`,
            message: errorMessage,
            duration: 5000
          })
        }
      }
    }

    setBatchState({
      status: errors.length === transactions.length ? 'failed' : 'completed',
      current: transactions.length,
      total: transactions.length,
      signatures,
      errors
    })

    if (options.showNotifications !== false) {
      showNotification({
        type: signatures.length > 0 ? 'success' : 'error',
        title: 'Batch Complete',
        message: `${signatures.length}/${transactions.length} transactions successful`,
        duration: 8000
      })
    }
  }, [publicKey, sendTransaction, connection, showNotification, options])

  return {
    executeBatch,
    batchState,
    isExecuting: batchState.status === 'executing',
    progress: batchState.total > 0 ? (batchState.current / batchState.total) * 100 : 0
  }
}
