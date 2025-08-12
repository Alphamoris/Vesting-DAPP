import { AnchorProvider, BN, Program } from '@coral-xyz/anchor';
import { Connection, PublicKey } from '@solana/web3.js';
import { WalletContextState } from '@solana/wallet-adapter-react';
import * as bankingVestingIdl from '../../anchor/target/idl/banking_vesting.json';
import { BankingVesting } from '../../anchor/target/types/banking_vesting';
import { getDefaultConnection } from './network-config';

export function getBankingVestingProgram(
  connection?: Connection,
  wallet?: WalletContextState
): Program<BankingVesting> {
  // Use default connection if not provided
  const finalConnection = connection || getDefaultConnection();
  
  const provider = new AnchorProvider(finalConnection, wallet as any, {
    commitment: 'confirmed',
  });
  
  return new Program(bankingVestingIdl as BankingVesting, provider);
}

export function convertBNToNumber(bn: BN): number {
  return bn.toNumber();
}

export function convertBNToBigInt(bn: BN): bigint {
  return BigInt(bn.toString());
}

export function convertNumberToBN(num: number): BN {
  return new BN(num);
}

export function convertBigIntToBN(bigint: bigint): BN {
  return new BN(bigint.toString());
}

export const LAMPORTS_PER_SOL = 1000000000;

export function convertLamportsToSol(lamports: number | BN | bigint): number {
  if (typeof lamports === 'number') {
    return lamports / LAMPORTS_PER_SOL;
  }
  if (lamports instanceof BN) {
    return lamports.toNumber() / LAMPORTS_PER_SOL;
  }
  return Number(lamports) / LAMPORTS_PER_SOL;
}

export function convertSolToLamports(sol: number): number {
  return Math.floor(sol * LAMPORTS_PER_SOL);
}
