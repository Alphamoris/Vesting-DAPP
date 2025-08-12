import { PublicKey, TransactionInstruction } from '@solana/web3.js';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { BN } from '@coral-xyz/anchor';
import { getBankingVestingProgram } from '@/lib/anchor-program';

export interface CreateCompanyParams {
  name: string;
  symbol: string;
  totalSupply: bigint;
}

export function useCompanyInstructions() {
  const { connection } = useConnection();
  const wallet = useWallet();

  const createCompanyInstruction = async (
    params: CreateCompanyParams
  ): Promise<TransactionInstruction> => {
    const program = getBankingVestingProgram(connection, wallet);

    return await program.methods
      .createCompany(params.name, params.symbol, new BN(params.totalSupply.toString()))
      .accounts({
        authority: wallet.publicKey!,
      })
      .instruction();
  };

  return {
    createCompanyInstruction,
  };
}
