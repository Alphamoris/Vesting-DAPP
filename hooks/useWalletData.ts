import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { useQuery } from '@tanstack/react-query';
import { useNetworkConnection } from '@/lib/network-config';

export interface WalletData {
  publicKey: PublicKey | null;
  balance: number;
  formattedBalance: string;
  isConnected: boolean;
  network: string;
  transactions: any[];
  tokens: any[];
}

export function useWalletData() {
  const { connection: walletConnection } = useConnection();
  const { connection: networkConnection, network } = useNetworkConnection();
  const { publicKey, connected } = useWallet();
  
  // Use network connection if available, fallback to wallet connection
  const connection = networkConnection || walletConnection;

  // Query wallet balance
  const {
    data: balance = 0,
    isLoading: balanceLoading,
    refetch: refetchBalance,
  } = useQuery({
    queryKey: ['wallet-balance', publicKey?.toString(), network],
    queryFn: async (): Promise<number> => {
      if (!publicKey || !connection) return 0;
      
      try {
        const balance = await connection.getBalance(publicKey);
        return balance / LAMPORTS_PER_SOL;
      } catch (error) {
        console.error('Error fetching wallet balance:', error);
        return 0;
      }
    },
    enabled: !!publicKey && !!connection && connected,
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Query recent transactions
  const {
    data: transactions = [],
    isLoading: transactionsLoading,
    refetch: refetchTransactions,
  } = useQuery({
    queryKey: ['wallet-transactions', publicKey?.toString(), network],
    queryFn: async (): Promise<any[]> => {
      if (!publicKey || !connection) return [];
      
      try {
        const signatures = await connection.getSignaturesForAddress(publicKey, { limit: 10 });
        const transactions = await Promise.all(
          signatures.map(async (sig) => {
            try {
              const tx = await connection.getTransaction(sig.signature, {
                maxSupportedTransactionVersion: 0,
              });
              return {
                signature: sig.signature,
                slot: sig.slot,
                blockTime: sig.blockTime,
                err: sig.err,
                transaction: tx,
              };
            } catch (error) {
              return {
                signature: sig.signature,
                slot: sig.slot,
                blockTime: sig.blockTime,
                err: sig.err,
                transaction: null,
              };
            }
          })
        );
        return transactions;
      } catch (error) {
        console.error('Error fetching wallet transactions:', error);
        return [];
      }
    },
    enabled: !!publicKey && !!connection && connected,
    refetchInterval: 60000, // Refresh every minute
  });

  // Query token accounts
  const {
    data: tokens = [],
    isLoading: tokensLoading,
    refetch: refetchTokens,
  } = useQuery({
    queryKey: ['wallet-tokens', publicKey?.toString(), network],
    queryFn: async (): Promise<any[]> => {
      if (!publicKey || !connection) return [];
      
      try {
        const tokenAccounts = await connection.getParsedTokenAccountsByOwner(publicKey, {
          programId: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'),
        });
        
        return tokenAccounts.value.map((account) => ({
          pubkey: account.pubkey.toString(),
          mint: account.account.data.parsed.info.mint,
          tokenAmount: account.account.data.parsed.info.tokenAmount,
          owner: account.account.data.parsed.info.owner,
        }));
      } catch (error) {
        console.error('Error fetching wallet tokens:', error);
        return [];
      }
    },
    enabled: !!publicKey && !!connection && connected,
    refetchInterval: 60000,
  });

  const walletData: WalletData = {
    publicKey,
    balance,
    formattedBalance: `${balance.toFixed(4)} SOL`,
    isConnected: connected && !!publicKey,
    network,
    transactions,
    tokens,
  };

  return {
    walletData,
    isLoading: balanceLoading || transactionsLoading || tokensLoading,
    refetchAll: () => {
      refetchBalance();
      refetchTransactions();
      refetchTokens();
    },
  };
}
