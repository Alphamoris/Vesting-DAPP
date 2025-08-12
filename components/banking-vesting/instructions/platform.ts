import { PublicKey, TransactionInstruction } from '@solana/web3.js';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { getBankingVestingProgram } from '@/lib/anchor-program';

export interface InitializePlatformParams {
  admin: PublicKey;
  treasury: PublicKey;
  treasuryThreshold: number;
}

export function usePlatformInstructions() {
  const { connection } = useConnection();
  const wallet = useWallet();

  const createInitializePlatformInstruction = async (
    params: InitializePlatformParams
  ): Promise<TransactionInstruction> => {
    const program = getBankingVestingProgram(connection, wallet);

    return await program.methods
      .initializePlatform(params.admin, params.treasuryThreshold)
      .accounts({
        authority: wallet.publicKey!,
        treasury: params.treasury,
      })
      .instruction();
  };

  const createEmergencyPauseInstruction = async (): Promise<TransactionInstruction> => {
    const program = getBankingVestingProgram(connection, wallet);

    return await program.methods
      .emergencyPause()
      .accounts({
        authority: wallet.publicKey!,
      })
      .instruction();
  };

  const createEmergencyUnpauseInstruction = async (): Promise<TransactionInstruction> => {
    const program = getBankingVestingProgram(connection, wallet);

    return await program.methods
      .emergencyUnpause()
      .accounts({
        authority: wallet.publicKey!,
      })
      .instruction();
  };

  return {
    createInitializePlatformInstruction,
    createEmergencyPauseInstruction,
    createEmergencyUnpauseInstruction,
  };
}
