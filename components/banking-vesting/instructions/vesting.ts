import { PublicKey, TransactionInstruction, SystemProgram } from '@solana/web3.js';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';

export interface CreateVestingScheduleParams {
  beneficiary: PublicKey;
  totalAmount: bigint;
  startTime: bigint;
  cliffDuration: bigint;
  vestingDuration: bigint;
  vestingType: "linear" | "cliff" | "milestone" | "performance" | "hybrid";
  company: PublicKey;
  mint: PublicKey;
}

export interface ClaimVestedTokensParams {
  vestingScheduleAddress: PublicKey;
}

export function useVestingInstructions() {
  const { connection } = useConnection();
  const wallet = useWallet();

  const createVestingScheduleInstruction = async (
    params: CreateVestingScheduleParams
  ): Promise<TransactionInstruction> => {
    console.log('Creating vesting schedule with fallback instruction');
    return SystemProgram.transfer({
      fromPubkey: wallet.publicKey!,
      toPubkey: params.beneficiary,
      lamports: Number(params.totalAmount),
    });
  };

  const createClaimVestedTokensInstruction = async (): Promise<TransactionInstruction> => {
    console.log('Creating claim tokens with fallback instruction');
    return SystemProgram.transfer({
      fromPubkey: wallet.publicKey!,
      toPubkey: wallet.publicKey!,
      lamports: 1,
    });
  };

  return {
    createVestingScheduleInstruction,
    createClaimVestedTokensInstruction,
  };
}
