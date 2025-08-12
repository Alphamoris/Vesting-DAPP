import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { PublicKey, SystemProgram, Transaction } from '@solana/web3.js';
import { useTransactionExecutor } from './use-transaction-executor';
import { getBankingVestingProgram } from '@/lib/anchor-program';

export function useBanking() {
  const { connection } = useConnection();
  const wallet = useWallet();
  const { publicKey } = wallet;
  const { executeTransaction } = useTransactionExecutor();

  const {
    data: bankingAccount,
    isLoading: bankingAccountLoading,
    refetch: refetchBankingAccount,
  } = useQuery({
    queryKey: ['banking-account', publicKey?.toString()],
    queryFn: async () => {
      if (!publicKey) return null;
      
      try {
        const program = getBankingVestingProgram(connection, wallet);
        
        const [bankingAccountPda] = PublicKey.findProgramAddressSync(
          [Buffer.from('banking_account'), publicKey.toBuffer()],
          program.programId
        );
        
        return await program.account.bankingAccount.fetch(bankingAccountPda);
      } catch (error) {
        console.log('Banking account not found or not initialized');
        return null;
      }
    },
    enabled: !!publicKey,
  });

  const depositFunds = useMutation({
    mutationFn: async ({ amount }: { amount: bigint }) => {
      if (!publicKey) throw new Error('Wallet not connected');
      
      return await executeTransaction(
        async () => {
          const transferInstruction = SystemProgram.transfer({
            fromPubkey: publicKey,
            toPubkey: new PublicKey('11111111111111111111111111111111'),
            lamports: Number(amount),
          });
          
          return new Transaction().add(transferInstruction);
        },
        'Funds deposited successfully',
        'Failed to deposit funds'
      );
    },
    onSuccess: () => {
      refetchBankingAccount();
    },
  });

  const withdrawFunds = useMutation({
    mutationFn: async ({ amount }: { amount: bigint }) => {
      if (!publicKey) throw new Error('Wallet not connected');
      
      return await executeTransaction(
        async () => {
          const transferInstruction = SystemProgram.transfer({
            fromPubkey: new PublicKey('11111111111111111111111111111111'),
            toPubkey: publicKey,
            lamports: Number(amount),
          });
          
          return new Transaction().add(transferInstruction);
        },
        'Funds withdrawn successfully',
        'Failed to withdraw funds'
      );
    },
    onSuccess: () => {
      refetchBankingAccount();
    },
  });

  return {
    bankingAccount,
    bankingAccountLoading,
    depositFunds: depositFunds.mutateAsync,
    withdrawFunds: withdrawFunds.mutateAsync,
    isDepositingFunds: depositFunds.isPending,
    isWithdrawingFunds: withdrawFunds.isPending,
  };
}
