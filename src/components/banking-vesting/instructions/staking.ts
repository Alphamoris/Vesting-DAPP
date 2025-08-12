import { PublicKey, TransactionInstruction } from '@solana/web3.js';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { BN } from '@coral-xyz/anchor';
import { getBankingVestingProgram } from '@/lib/anchor-program';

export interface StakeTokensParams {
  amount: bigint;
  mint: PublicKey;
}

export interface UnstakeTokensParams {
  amount: bigint;
  mint: PublicKey;
}

export function useStakingInstructions() {
  const { connection } = useConnection();
  const wallet = useWallet();

  const createStakeTokensInstruction = async (
    params: StakeTokensParams
  ): Promise<TransactionInstruction> => {
    const program = getBankingVestingProgram(connection, wallet);

    return await program.methods
      .stakeTokens(new BN(params.amount.toString()))
      .accounts({
        user: wallet.publicKey!,
        mint: params.mint,
      })
      .instruction();
  };

  const createUnstakeTokensInstruction = async (
    params: UnstakeTokensParams
  ): Promise<TransactionInstruction> => {
    const program = getBankingVestingProgram(connection, wallet);

    return await program.methods
      .unstakeTokens(new BN(params.amount.toString()))
      .accounts({
        user: wallet.publicKey!,
        mint: params.mint,
      })
      .instruction();
  };

  return {
    createStakeTokensInstruction,
    createUnstakeTokensInstruction,
  };
}
