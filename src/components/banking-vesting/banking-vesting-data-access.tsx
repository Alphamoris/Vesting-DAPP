import { useCallback } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { usePlatform } from './hooks/use-platform';
import { useBanking } from './hooks/use-banking';
import { useBankingVestingTransactions } from './hooks/use-working-transactions';
import {
  BANKING_VESTING_PROGRAM_ID,
  VestingType,
  AccountType,
  LoanStatus,
} from '../../../anchor/src/banking-vesting-exports';

export function useBankingVesting() {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  
  const platformHook = usePlatform();
  const bankingHook = useBanking();
  const workingTransactions = useBankingVestingTransactions();

  const calculateVestedAmount = useCallback((
    totalAmount: bigint,
    startTime: bigint,
    cliffDuration: bigint,
    vestingDuration: bigint,
    currentTime: bigint = BigInt(Date.now() / 1000)
  ): bigint => {
    if (currentTime < startTime) return BigInt(0);
    
    const elapsedTime = currentTime - startTime;
    
    if (elapsedTime < cliffDuration) return BigInt(0);
    
    if (elapsedTime >= vestingDuration) return totalAmount;
    
    return (totalAmount * elapsedTime) / vestingDuration;
  }, []);

  return {
    platform: platformHook.platform,
    bankingAccount: bankingHook.bankingAccount,
    userProfile: null,
    companies: [],
    vestingSchedules: [],
    
    platformLoading: platformHook.platformLoading,
    bankingAccountLoading: bankingHook.bankingAccountLoading,
    userProfileLoading: false,
    companiesLoading: false,
    vestingSchedulesLoading: false,
    
    initializePlatform: platformHook.initializePlatform,
    createCompany: async (params: { name: string; symbol: string; totalSupply: bigint }) => {
      return workingTransactions.createCompany({
        name: params.name,
        symbol: params.symbol,
        totalSupply: Number(params.totalSupply),
      });
    },
    createVestingSchedule: async () => {},
    depositFunds: async (params: { amount: bigint }) => {
      return workingTransactions.depositFunds({
        amount: Number(params.amount) / 1000000000, // Convert to SOL
      });
    },
    withdrawFunds: async (params: { amount: bigint }) => {
      return workingTransactions.withdrawFunds({
        amount: Number(params.amount) / 1000000000, // Convert to SOL
      });
    },
    claimVestedTokens: async () => {},
    stakeTokens: async (params: { amount: bigint }) => {
      return workingTransactions.stakeTokens({
        amount: Number(params.amount),
      });
    },
    createLoanRequest: async () => {},
    createSavingsAccount: async () => {},
    
    isInitializingPlatform: platformHook.isInitializingPlatform,
    isCreatingCompany: workingTransactions.isCreatingCompany,
    isCreatingVestingSchedule: false,
    isDepositingFunds: workingTransactions.isDepositingFunds,
    isWithdrawingFunds: workingTransactions.isWithdrawingFunds,
    isClaimingTokens: false,
    isStakingTokens: workingTransactions.isStakingTokens,
    isCreatingLoanRequest: false,
    isCreatingSavingsAccount: false,
    
    calculateVestedAmount,
    formatCompanyName: (nameBytes: Uint8Array) => new TextDecoder().decode(nameBytes).replace(/\0/g, ''),
    formatCompanySymbol: (symbolBytes: Uint8Array) => new TextDecoder().decode(symbolBytes).replace(/\0/g, ''),
    
    BANKING_VESTING_PROGRAM_ID,
    VestingType,
    AccountType,
    LoanStatus,
  };
}
