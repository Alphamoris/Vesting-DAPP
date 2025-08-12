import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Transaction, PublicKey } from '@solana/web3.js';
import { showToast } from '@/lib/toast-helpers';

export function useTransactionExecutor() {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();

  const executeTransaction = async (
    transactionBuilder: () => Promise<Transaction>,
    successMessage: string,
    errorMessage: string
  ) => {
    if (!publicKey || !sendTransaction) {
      throw new Error('Wallet not connected');
    }

    try {
      const transaction = await transactionBuilder();
      
      const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = publicKey;
      
      const signature = await sendTransaction(transaction, connection);
      
      await connection.confirmTransaction({
        signature,
        blockhash,
        lastValidBlockHeight,
      }, 'confirmed');
      
      showToast.success(successMessage);
      return signature;
    } catch (error: any) {
      console.error('Transaction failed:', error);
      showToast.error(`${errorMessage}: ${error.message || 'Unknown error'}`);
      throw error;
    }
  };

  return {
    executeTransaction,
    isConnected: !!publicKey,
  };
}
