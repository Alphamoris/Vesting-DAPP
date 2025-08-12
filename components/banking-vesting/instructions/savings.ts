import { PublicKey, TransactionInstruction } from '@solana/web3.js';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { BN } from '@coral-xyz/anchor';
import { getBankingVestingProgram } from '@/lib/anchor-program';

export interface CreateSavingsAccountParams {
  apyRate: number;
  mint: PublicKey;
}

export interface DepositToSavingsParams {
  amount: bigint;
  mint: PublicKey;
}

export interface WithdrawFromSavingsParams {
  amount: bigint;
  mint: PublicKey;
}

export function useSavingsInstructions() {
  const { connection } = useConnection();
  const wallet = useWallet();

  const createSavingsAccountInstruction = async (
    params: CreateSavingsAccountParams
  ): Promise<TransactionInstruction> => {
    const program = getBankingVestingProgram(connection, wallet);

    return await program.methods
      .createSavingsAccount(params.apyRate)
      .accounts({
        owner: wallet.publicKey!,
        mint: params.mint,
      })
      .instruction();
  };

  const createDepositToSavingsInstruction = async (
    params: DepositToSavingsParams
  ): Promise<TransactionInstruction> => {
    const program = getBankingVestingProgram(connection, wallet);

    return await program.methods
      .depositToSavings(new BN(params.amount.toString()))
      .accounts({
        owner: wallet.publicKey!,
        mint: params.mint,
      })
      .instruction();
  };

  const createWithdrawFromSavingsInstruction = async (
    params: WithdrawFromSavingsParams
  ): Promise<TransactionInstruction> => {
    const program = getBankingVestingProgram(connection, wallet);

    return await program.methods
      .withdrawFromSavings(new BN(params.amount.toString()))
      .accounts({
        owner: wallet.publicKey!,
        mint: params.mint,
      })
      .instruction();
  };

  const createCompoundInterestInstruction = async (
    mint: PublicKey
  ): Promise<TransactionInstruction> => {
    const program = getBankingVestingProgram(connection, wallet);

    return await program.methods
      .compoundInterest()
      .accounts({
        authority: wallet.publicKey!,
        mint: mint,
      })
      .instruction();
  };

  return {
    createSavingsAccountInstruction,
    createDepositToSavingsInstruction,
    createWithdrawFromSavingsInstruction,
    createCompoundInterestInstruction,
  };
}
