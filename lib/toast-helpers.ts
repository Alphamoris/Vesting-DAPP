import { toast } from 'sonner'

export const showToast = {
  success: (message: string, description?: string) => {
    toast.success(message, { description })
  },
  
  error: (message: string, description?: string) => {
    toast.error(message, { description })
  },
  
  info: (message: string, description?: string) => {
    toast.info(message, { description })
  },
  
  loading: (message: string) => {
    return toast.loading(message)
  },
  
  networkError: (action?: string) => {
    toast.error('Network Connection Error', {
      description: `Unable to ${action || 'complete the request'}. Please check your internet connection and try again.`,
      action: {
        label: 'Retry',
        onClick: () => window.location.reload(),
      },
    })
  },
  
  solanaError: (action?: string) => {
    toast.error('Solana Network Issue', {
      description: `Having trouble connecting to Solana network. ${action ? `Unable to ${action}.` : 'Please try again later.'}`,
      action: {
        label: 'Switch Network',
        onClick: () => {
          toast.info('Network Switch', {
            description: 'Please switch to a different network in your wallet settings.',
          })
        },
      },
    })
  },
  
  walletError: () => {
    toast.error('Wallet Connection Required', {
      description: 'Please connect your wallet to continue.',
    })
  },
  
  transactionSuccess: (action: string, txHash?: string) => {
    toast.success(`${action} Successful!`, {
      description: txHash ? `Transaction: ${txHash.slice(0, 8)}...${txHash.slice(-8)}` : 'Your transaction has been completed.',
      action: txHash ? {
        label: 'View on Explorer',
        onClick: () => window.open(`https://explorer.solana.com/tx/${txHash}?cluster=devnet`, '_blank'),
      } : undefined,
    })
  },
  
  transactionError: (action: string, error?: any) => {
    const errorMessage = error?.message || error?.toString() || 'Unknown error occurred'
    toast.error(`${action} Failed`, {
      description: errorMessage.includes('User rejected') 
        ? 'Transaction was cancelled by user.' 
        : `Error: ${errorMessage.slice(0, 100)}${errorMessage.length > 100 ? '...' : ''}`,
    })
  },
}
