'use client'

import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import {
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  TransactionMessage,
  TransactionSignature,
  VersionedTransaction,
} from '@solana/web3.js'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export function useBankingVestingTransactions() {
  const { connection } = useConnection()
  const wallet = useWallet()
  const client = useQueryClient()

  const createCompanyTransaction = useMutation({
    mutationKey: ['create-company', { endpoint: connection.rpcEndpoint }],
    mutationFn: async (input: { name: string; symbol: string; totalSupply: number }) => {
      let signature: TransactionSignature = ''
      try {
        const { transaction, latestBlockhash } = await createDemoTransaction({
          publicKey: wallet.publicKey!,
          connection,
          description: `Create Company: ${input.name} (${input.symbol})`,
        })

        // Send transaction and await for signature
        signature = await wallet.sendTransaction!(transaction, connection)

        // Confirm transaction
        await connection.confirmTransaction({ signature, ...latestBlockhash }, 'confirmed')

        console.log('Company creation transaction signature:', signature)
        return signature
      } catch (error: unknown) {
        console.error('Create company transaction failed:', error)
        throw error
      }
    },
    onSuccess: async (signature) => {
      if (signature) {
        toast.success('Company created successfully!', {
          description: `Transaction: ${signature.slice(0, 8)}...${signature.slice(-8)}`,
        })
      }
    },
    onError: (error) => {
      toast.error('Failed to create company', {
        description: error.message || 'Transaction failed',
      })
    },
  })

  const depositFundsTransaction = useMutation({
    mutationKey: ['deposit-funds', { endpoint: connection.rpcEndpoint }],
    mutationFn: async (input: { amount: number }) => {
      let signature: TransactionSignature = ''
      try {
        const { transaction, latestBlockhash } = await createDemoTransaction({
          publicKey: wallet.publicKey!,
          connection,
          description: `Deposit ${input.amount} SOL`,
        })

        // Send transaction and await for signature
        signature = await wallet.sendTransaction!(transaction, connection)

        // Confirm transaction
        await connection.confirmTransaction({ signature, ...latestBlockhash }, 'confirmed')

        console.log('Deposit transaction signature:', signature)
        return signature
      } catch (error: unknown) {
        console.error('Deposit transaction failed:', error)
        throw error
      }
    },
    onSuccess: async (signature) => {
      if (signature) {
        toast.success('Funds deposited successfully!', {
          description: `Transaction: ${signature.slice(0, 8)}...${signature.slice(-8)}`,
        })
      }
    },
    onError: (error) => {
      toast.error('Failed to deposit funds', {
        description: error.message || 'Transaction failed',
      })
    },
  })

  const withdrawFundsTransaction = useMutation({
    mutationKey: ['withdraw-funds', { endpoint: connection.rpcEndpoint }],
    mutationFn: async (input: { amount: number }) => {
      let signature: TransactionSignature = ''
      try {
        const { transaction, latestBlockhash } = await createDemoTransaction({
          publicKey: wallet.publicKey!,
          connection,
          description: `Withdraw ${input.amount} SOL`,
        })

        // Send transaction and await for signature
        signature = await wallet.sendTransaction!(transaction, connection)

        // Confirm transaction
        await connection.confirmTransaction({ signature, ...latestBlockhash }, 'confirmed')

        console.log('Withdraw transaction signature:', signature)
        return signature
      } catch (error: unknown) {
        console.error('Withdraw transaction failed:', error)
        throw error
      }
    },
    onSuccess: async (signature) => {
      if (signature) {
        toast.success('Funds withdrawn successfully!', {
          description: `Transaction: ${signature.slice(0, 8)}...${signature.slice(-8)}`,
        })
      }
    },
    onError: (error) => {
      toast.error('Failed to withdraw funds', {
        description: error.message || 'Transaction failed',
      })
    },
  })

  const initializePlatformTransaction = useMutation({
    mutationKey: ['initialize-platform', { endpoint: connection.rpcEndpoint }],
    mutationFn: async (input: { admin: PublicKey; treasuryThreshold: number }) => {
      let signature: TransactionSignature = ''
      try {
        const { transaction, latestBlockhash } = await createDemoTransaction({
          publicKey: wallet.publicKey!,
          connection,
          description: `Initialize Platform with threshold ${input.treasuryThreshold}`,
        })

        // Send transaction and await for signature
        signature = await wallet.sendTransaction!(transaction, connection)

        // Confirm transaction
        await connection.confirmTransaction({ signature, ...latestBlockhash }, 'confirmed')

        console.log('Platform initialization transaction signature:', signature)
        return signature
      } catch (error: unknown) {
        console.error('Platform initialization transaction failed:', error)
        throw error
      }
    },
    onSuccess: async (signature) => {
      if (signature) {
        toast.success('Platform initialized successfully!', {
          description: `Transaction: ${signature.slice(0, 8)}...${signature.slice(-8)}`,
        })
      }
    },
    onError: (error) => {
      toast.error('Failed to initialize platform', {
        description: error.message || 'Transaction failed',
      })
    },
  })

  const stakeTokensTransaction = useMutation({
    mutationKey: ['stake-tokens', { endpoint: connection.rpcEndpoint }],
    mutationFn: async (input: { amount: number }) => {
      let signature: TransactionSignature = ''
      try {
        const { transaction, latestBlockhash } = await createDemoTransaction({
          publicKey: wallet.publicKey!,
          connection,
          description: `Stake ${input.amount} tokens`,
        })

        // Send transaction and await for signature
        signature = await wallet.sendTransaction!(transaction, connection)

        // Confirm transaction
        await connection.confirmTransaction({ signature, ...latestBlockhash }, 'confirmed')

        console.log('Stake tokens transaction signature:', signature)
        return signature
      } catch (error: unknown) {
        console.error('Stake tokens transaction failed:', error)
        throw error
      }
    },
    onSuccess: async (signature) => {
      if (signature) {
        toast.success('Tokens staked successfully!', {
          description: `Transaction: ${signature.slice(0, 8)}...${signature.slice(-8)}`,
        })
      }
    },
    onError: (error) => {
      toast.error('Failed to stake tokens', {
        description: error.message || 'Transaction failed',
      })
    },
  })

  return {
    createCompany: createCompanyTransaction.mutateAsync,
    depositFunds: depositFundsTransaction.mutateAsync,
    withdrawFunds: withdrawFundsTransaction.mutateAsync,
    initializePlatform: initializePlatformTransaction.mutateAsync,
    stakeTokens: stakeTokensTransaction.mutateAsync,
    
    // Loading states
    isCreatingCompany: createCompanyTransaction.isPending,
    isDepositingFunds: depositFundsTransaction.isPending,
    isWithdrawingFunds: withdrawFundsTransaction.isPending,
    isInitializingPlatform: initializePlatformTransaction.isPending,
    isStakingTokens: stakeTokensTransaction.isPending,
    
    // Connection status
    isConnected: !!wallet.publicKey,
  }
}

async function createDemoTransaction({
  publicKey,
  connection,
  description,
}: {
  publicKey: PublicKey
  connection: Connection
  description: string
}): Promise<{
  transaction: VersionedTransaction
  latestBlockhash: { blockhash: string; lastValidBlockHeight: number }
}> {
  // Get the latest blockhash to use in our transaction
  const latestBlockhash = await connection.getLatestBlockhash()

  // Create a demo instruction (zero-value transfer to self for demonstration)
  const instructions = [
    SystemProgram.transfer({
      fromPubkey: publicKey,
      toPubkey: publicKey,
      lamports: 0, // Zero value transfer for demo
    }),
  ]

  // Note: Demo transaction for ${description}

  // Create a new TransactionMessage with version and compile it to legacy
  const messageLegacy = new TransactionMessage({
    payerKey: publicKey,
    recentBlockhash: latestBlockhash.blockhash,
    instructions,
  }).compileToLegacyMessage()

  // Create a new VersionedTransaction which supports legacy and v0
  const transaction = new VersionedTransaction(messageLegacy)

  return {
    transaction,
    latestBlockhash,
  }
}
