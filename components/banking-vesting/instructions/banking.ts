import { PublicKey, TransactionInstruction } from '@solana/web3.js';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { BN } from '@coral-xyz/anchor';
import { getBankingVestingProgram } from '@/lib/anchor-program';

export interface DepositFundsParams {
  amount: bigint;
  mint: PublicKey;
}

export interface WithdrawFundsParams {
  amount: bigint;
  mint: PublicKey;
}

export function useBankingInstructions() {
  const { connection } = useConnection();
  const wallet = useWallet();

  const createDepositFundsInstruction = async (
    params: DepositFundsParams
  ): Promise<TransactionInstruction> => {
    const program = getBankingVestingProgram(connection, wallet);

    return await program.methods
      .depositFunds(new BN(params.amount.toString()))
      .accounts({
        user: wallet.publicKey!,
        mint: params.mint,
      })
      .instruction();
  };

  const createWithdrawFundsInstruction = async (
    params: WithdrawFundsParams
  ): Promise<TransactionInstruction> => {
    const program = getBankingVestingProgram(connection, wallet);

    return await program.methods
      .withdrawFunds(new BN(params.amount.toString()))
      .accounts({
        user: wallet.publicKey!,
        mint: params.mint,
      })
      .instruction();
  };

  return {
    createDepositFundsInstruction,
    createWithdrawFundsInstruction,
  };
}
