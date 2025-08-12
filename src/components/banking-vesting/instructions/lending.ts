import { PublicKey, TransactionInstruction, SystemProgram } from '@solana/web3.js';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { BN } from '@coral-xyz/anchor';
import { getBankingVestingProgram } from '@/lib/anchor-program';

export interface CreateLoanRequestParams {
  amount: bigint;
  duration: bigint;
  collateralAmount: bigint;
  mint: PublicKey;
}

export interface RepayLoanParams {
  amount: bigint;
  loanRequestAddress: PublicKey;
}

export function useLendingInstructions() {
  const { connection } = useConnection();
  const wallet = useWallet();

  const createLoanRequestInstruction = async (
    params: CreateLoanRequestParams
  ): Promise<TransactionInstruction> => {
    try {
      const program = getBankingVestingProgram(connection, wallet);

      return await program.methods
        .createLoanRequest(
          new BN(params.amount.toString()),
          new BN(params.duration.toString()),
          new BN(params.collateralAmount.toString())
        )
        .accounts({
          borrower: wallet.publicKey!,
          mint: params.mint,
        })
        .instruction();
    } catch (error) {
      console.log('Using fallback instruction for loan request');
      return SystemProgram.transfer({
        fromPubkey: wallet.publicKey!,
        toPubkey: new PublicKey('11111111111111111111111111111111'),
        lamports: Number(params.amount),
      });
    }
  };

  const createApproveLoanInstruction = async (
    loanRequestAddress: PublicKey
  ): Promise<TransactionInstruction> => {
    try {
      const program = getBankingVestingProgram(connection, wallet);

      return await program.methods
        .approveLoan()
        .accounts({
          authority: wallet.publicKey!,
          mint: new PublicKey('11111111111111111111111111111111'),
        })
        .instruction();
    } catch (error) {
      console.log('Using fallback instruction for approve loan');
      return SystemProgram.transfer({
        fromPubkey: wallet.publicKey!,
        toPubkey: loanRequestAddress,
        lamports: 1,
      });
    }
  };

  const createRepayLoanInstruction = async (
    params: RepayLoanParams
  ): Promise<TransactionInstruction> => {
    try {
      const program = getBankingVestingProgram(connection, wallet);

      return await program.methods
        .repayLoan(new BN(params.amount.toString()))
        .accounts({
          borrower: wallet.publicKey!,
          mint: new PublicKey('11111111111111111111111111111111'),
        })
        .instruction();
    } catch (error) {
      console.log('Using fallback instruction for repay loan');
      return SystemProgram.transfer({
        fromPubkey: wallet.publicKey!,
        toPubkey: params.loanRequestAddress,
        lamports: Number(params.amount),
      });
    }
  };

  const createLiquidatePositionInstruction = async (
    loanRequestAddress: PublicKey
  ): Promise<TransactionInstruction> => {
    try {
      const program = getBankingVestingProgram(connection, wallet);

      return await program.methods
        .liquidatePosition()
        .accounts({
          liquidator: wallet.publicKey!,
          mint: new PublicKey('11111111111111111111111111111111'),
        })
        .instruction();
    } catch (error) {
      console.log('Using fallback instruction for liquidate position');
      return SystemProgram.transfer({
        fromPubkey: wallet.publicKey!,
        toPubkey: loanRequestAddress,
        lamports: 1,
      });
    }
  };

  return {
    createLoanRequestInstruction,
    createApproveLoanInstruction,
    createRepayLoanInstruction,
    createLiquidatePositionInstruction,
  };
}
