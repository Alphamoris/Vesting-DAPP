import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey, Transaction, SystemProgram, SYSVAR_RENT_PUBKEY } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID, getAssociatedTokenAddress } from '@solana/spl-token';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { BN } from '@coral-xyz/anchor';
import { getBankingVestingProgram, convertBNToBigInt, convertBigIntToBN } from '@/lib/anchor-program';
import {
  BANKING_VESTING_PROGRAM_ID,
  VestingType,
  AccountType,
  LoanStatus,
  getPlatformPDA,
  getCompanyPDA,
  getVestingSchedulePDA,
  getBankingAccountPDA,
  getStakingPoolPDA,
  getLoanRequestPDA,
  getSavingsAccountPDA,
  getUserProfilePDA,
  stringToFixedBytes,
  fixedBytesToString,
  Platform,
  Company,
  VestingSchedule,
  BankingAccount,
  StakingPool,
  LoanRequest,
  SavingsAccount,
  UserProfile
} from '../../../anchor/src/banking-vesting-exports';

export function useBankingVesting() {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const queryClient = useQueryClient();

  // Platform queries
  const { data: platform, isLoading: platformLoading } = useQuery({
    queryKey: ['platform'],
    queryFn: async (): Promise<Platform | null> => {
      if (!publicKey) return null;
      try {
        const program = getBankingVestingProgram(connection, { publicKey, sendTransaction } as any);
        const [platformPDA] = getPlatformPDA();
        const platformAccount = await program.account.platform.fetchNullable(platformPDA);

        if (!platformAccount) return null;
        
        return {
          admin: new PublicKey(platformAccount.admin),
          treasury: new PublicKey(platformAccount.treasury),
          treasuryThreshold: platformAccount.treasuryThreshold,
          totalCompanies: BigInt(platformAccount.totalCompanies.toString()),
          totalVestingSchedules: BigInt(platformAccount.totalVestingSchedules.toString()),
          totalValueLocked: BigInt(platformAccount.totalValueLocked.toString()),
          isPaused: platformAccount.isPaused,
          bump: platformAccount.bump,
        };
      } catch (error) {
        console.error('Error fetching platform:', error);
        const [platformPDA] = getPlatformPDA();
        const accountInfo = await connection.getAccountInfo(platformPDA);
        if (!accountInfo) return null;
        
        return {
          admin: new PublicKey("11111111111111111111111111111111"),
          treasury: new PublicKey("11111111111111111111111111111111"),
          treasuryThreshold: 0,
          totalCompanies: BigInt(0),
          totalVestingSchedules: BigInt(0),
          totalValueLocked: BigInt(0),
          isPaused: false,
          bump: 0,
        };
      }
    },
    enabled: !!connection && !!publicKey
  });

  // User's banking account
  const { data: bankingAccount, isLoading: bankingAccountLoading } = useQuery({
    queryKey: ['bankingAccount', publicKey?.toString()],
    queryFn: async (): Promise<BankingAccount | null> => {
      if (!publicKey) return null;
      try {
        const program = getBankingVestingProgram(connection, { publicKey, sendTransaction } as any);
        const [bankingAccountPDA] = getBankingAccountPDA(publicKey);
        const bankingAccountData = await program.account.bankingAccount.fetchNullable(bankingAccountPDA);

        if (!bankingAccountData) return null;

        // Convert Anchor enum to TypeScript enum
        let accountType: AccountType;
        if ('basic' in bankingAccountData.accountType) {
          accountType = AccountType.Basic;
        } else if ('premium' in bankingAccountData.accountType) {
          accountType = AccountType.Premium;
        } else if ('enterprise' in bankingAccountData.accountType) {
          accountType = AccountType.Enterprise;
        } else if ('institutional' in bankingAccountData.accountType) {
          accountType = AccountType.Institutional;
        } else {
          accountType = AccountType.Basic; // Default fallback
        }
        
        return {
          owner: new PublicKey(bankingAccountData.owner),
          balance: BigInt(bankingAccountData.balance.toString()),
          stakedAmount: BigInt(bankingAccountData.stakedAmount.toString()),
          earnedInterest: BigInt(bankingAccountData.earnedInterest.toString()),
          lastInteraction: BigInt(bankingAccountData.lastInteraction.toString()),
          accountType,
          tierLevel: bankingAccountData.tierLevel,
          bump: bankingAccountData.bump,
        };
      } catch (error) {
        console.error('Error fetching banking account:', error);
        return null;
      }
    },
    enabled: !!connection && !!publicKey
  });

  // User's profile
  const { data: userProfile, isLoading: userProfileLoading } = useQuery({
    queryKey: ['userProfile', publicKey?.toString()],
    queryFn: async (): Promise<UserProfile | null> => {
      if (!publicKey) return null;
      const [userProfilePDA] = getUserProfilePDA(publicKey);
      try {
        const accountInfo = await connection.getAccountInfo(userProfilePDA);
        if (!accountInfo) return null;
        // TODO: Deserialize the account data
        return null; // Placeholder
      } catch (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }
    },
    enabled: !!connection && !!publicKey
  });

  // Companies query
  const { data: companies, isLoading: companiesLoading } = useQuery({
    queryKey: ['companies'],
    queryFn: async (): Promise<Company[]> => {
      try {
        // TODO: Fetch all company accounts
        const accounts = await connection.getProgramAccounts(BANKING_VESTING_PROGRAM_ID, {
          filters: [
            {
              memcmp: {
                offset: 0,
                bytes: '' // TODO: Add proper discriminator
              }
            }
          ]
        });
        return []; // Placeholder
      } catch (error) {
        console.error('Error fetching companies:', error);
        return [];
      }
    },
    enabled: !!connection
  });

  // User's vesting schedules
  const { data: vestingSchedules, isLoading: vestingSchedulesLoading } = useQuery({
    queryKey: ['vestingSchedules', publicKey?.toString()],
    queryFn: async (): Promise<VestingSchedule[]> => {
      if (!publicKey) return [];
      try {
        // TODO: Fetch user's vesting schedules
        const accounts = await connection.getProgramAccounts(BANKING_VESTING_PROGRAM_ID, {
          filters: [
            {
              memcmp: {
                offset: 8 + 32, // Skip discriminator and company pubkey
                bytes: publicKey.toBase58()
              }
            }
          ]
        });
        return []; // Placeholder
      } catch (error) {
        console.error('Error fetching vesting schedules:', error);
        return [];
      }
    },
    enabled: !!connection && !!publicKey
  });

  // Mutations
  const initializePlatformMutation = useMutation({
    mutationFn: async ({ admin, treasuryThreshold }: { admin: PublicKey; treasuryThreshold: number }) => {
      if (!publicKey) throw new Error('Wallet not connected');
      
      const [platformPDA, platformBump] = getPlatformPDA();
      const treasury = publicKey; // Using wallet as treasury for now
      
      // TODO: Create the actual transaction instruction
      const transaction = new Transaction();
      // transaction.add(createInitializePlatformInstruction(...));
      
      const signature = await sendTransaction(transaction, connection);
      await connection.confirmTransaction(signature);
      return signature;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['platform'] });
    }
  });

  const createCompanyMutation = useMutation({
    mutationFn: async ({ name, symbol, totalSupply }: { name: string; symbol: string; totalSupply: bigint }) => {
      if (!publicKey) throw new Error('Wallet not connected');
      
      const nameBytes = stringToFixedBytes(name, 32);
      const symbolBytes = stringToFixedBytes(symbol, 8);
      const [companyPDA] = getCompanyPDA(publicKey, nameBytes);
      
      // TODO: Create the actual transaction instruction
      const transaction = new Transaction();
      // transaction.add(createCreateCompanyInstruction(...));
      
      const signature = await sendTransaction(transaction, connection);
      await connection.confirmTransaction(signature);
      return signature;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
    }
  });

  const createVestingScheduleMutation = useMutation({
    mutationFn: async ({
      companyAddress,
      beneficiary,
      totalAmount,
      startTime,
      cliffDuration,
      vestingDuration,
      vestingType
    }: {
      companyAddress: PublicKey;
      beneficiary: PublicKey;
      totalAmount: bigint;
      startTime: bigint;
      cliffDuration: bigint;
      vestingDuration: bigint;
      vestingType: VestingType;
    }) => {
      if (!publicKey) throw new Error('Wallet not connected');
      
      const [vestingSchedulePDA] = getVestingSchedulePDA(companyAddress, beneficiary);
      
      // TODO: Create the actual transaction instruction
      const transaction = new Transaction();
      // transaction.add(createCreateVestingScheduleInstruction(...));
      
      const signature = await sendTransaction(transaction, connection);
      await connection.confirmTransaction(signature);
      return signature;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vestingSchedules'] });
    }
  });

  const depositFundsMutation = useMutation({
    mutationFn: async ({ amount, mint }: { amount: bigint; mint: PublicKey }) => {
      if (!publicKey) throw new Error('Wallet not connected');
      
      const [bankingAccountPDA] = getBankingAccountPDA(publicKey);
      const userTokenAccount = await getAssociatedTokenAddress(mint, publicKey);
      const platformTokenAccount = await getAssociatedTokenAddress(mint, bankingAccountPDA, true);
      
      // TODO: Create the actual transaction instruction
      const transaction = new Transaction();
      // transaction.add(createDepositFundsInstruction(...));
      
      const signature = await sendTransaction(transaction, connection);
      await connection.confirmTransaction(signature);
      return signature;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bankingAccount'] });
    }
  });

  const withdrawFundsMutation = useMutation({
    mutationFn: async ({ amount, mint }: { amount: bigint; mint: PublicKey }) => {
      if (!publicKey) throw new Error('Wallet not connected');
      
      const [bankingAccountPDA] = getBankingAccountPDA(publicKey);
      const userTokenAccount = await getAssociatedTokenAddress(mint, publicKey);
      const platformTokenAccount = await getAssociatedTokenAddress(mint, bankingAccountPDA, true);
      
      // TODO: Create the actual transaction instruction
      const transaction = new Transaction();
      // transaction.add(createWithdrawFundsInstruction(...));
      
      const signature = await sendTransaction(transaction, connection);
      await connection.confirmTransaction(signature);
      return signature;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bankingAccount'] });
    }
  });

  const claimVestedTokensMutation = useMutation({
    mutationFn: async ({ vestingScheduleAddress }: { vestingScheduleAddress: PublicKey }) => {
      if (!publicKey) throw new Error('Wallet not connected');
      
      // TODO: Create the actual transaction instruction
      const transaction = new Transaction();
      // transaction.add(createClaimVestedTokensInstruction(...));
      
      const signature = await sendTransaction(transaction, connection);
      await connection.confirmTransaction(signature);
      return signature;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vestingSchedules'] });
      queryClient.invalidateQueries({ queryKey: ['bankingAccount'] });
    }
  });

  const stakeTokensMutation = useMutation({
    mutationFn: async ({ amount, mint }: { amount: bigint; mint: PublicKey }) => {
      if (!publicKey) throw new Error('Wallet not connected');
      
      const [stakingPoolPDA] = getStakingPoolPDA(mint);
      
      // TODO: Create the actual transaction instruction
      const transaction = new Transaction();
      // transaction.add(createStakeTokensInstruction(...));
      
      const signature = await sendTransaction(transaction, connection);
      await connection.confirmTransaction(signature);
      return signature;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bankingAccount'] });
    }
  });

  const createLoanRequestMutation = useMutation({
    mutationFn: async ({
      amount,
      duration,
      collateralAmount,
      mint
    }: {
      amount: bigint;
      duration: bigint;
      collateralAmount: bigint;
      mint: PublicKey;
    }) => {
      if (!publicKey) throw new Error('Wallet not connected');
      
      const [loanRequestPDA] = getLoanRequestPDA(publicKey, mint);
      
      // TODO: Create the actual transaction instruction
      const transaction = new Transaction();
      // transaction.add(createCreateLoanRequestInstruction(...));
      
      const signature = await sendTransaction(transaction, connection);
      await connection.confirmTransaction(signature);
      return signature;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['loanRequests'] });
    }
  });

  const createSavingsAccountMutation = useMutation({
    mutationFn: async ({ apyRate, mint }: { apyRate: number; mint: PublicKey }) => {
      if (!publicKey) throw new Error('Wallet not connected');
      
      const [savingsAccountPDA] = getSavingsAccountPDA(publicKey, mint);
      
      // TODO: Create the actual transaction instruction
      const transaction = new Transaction();
      // transaction.add(createCreateSavingsAccountInstruction(...));
      
      const signature = await sendTransaction(transaction, connection);
      await connection.confirmTransaction(signature);
      return signature;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savingsAccounts'] });
    }
  });

  // Utility functions
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

  const formatCompanyName = useCallback((nameBytes: Uint8Array): string => {
    return fixedBytesToString(nameBytes);
  }, []);

  const formatCompanySymbol = useCallback((symbolBytes: Uint8Array): string => {
    return fixedBytesToString(symbolBytes);
  }, []);

  return {
    // Data
    platform,
    bankingAccount,
    userProfile,
    companies,
    vestingSchedules,
    
    // Loading states
    platformLoading,
    bankingAccountLoading,
    userProfileLoading,
    companiesLoading,
    vestingSchedulesLoading,
    
    // Mutations
    initializePlatform: initializePlatformMutation.mutateAsync,
    createCompany: createCompanyMutation.mutateAsync,
    createVestingSchedule: createVestingScheduleMutation.mutateAsync,
    depositFunds: depositFundsMutation.mutateAsync,
    withdrawFunds: withdrawFundsMutation.mutateAsync,
    claimVestedTokens: claimVestedTokensMutation.mutateAsync,
    stakeTokens: stakeTokensMutation.mutateAsync,
    createLoanRequest: createLoanRequestMutation.mutateAsync,
    createSavingsAccount: createSavingsAccountMutation.mutateAsync,
    
    // Mutation states
    isInitializingPlatform: initializePlatformMutation.isPending,
    isCreatingCompany: createCompanyMutation.isPending,
    isCreatingVestingSchedule: createVestingScheduleMutation.isPending,
    isDepositingFunds: depositFundsMutation.isPending,
    isWithdrawingFunds: withdrawFundsMutation.isPending,
    isClaimingTokens: claimVestedTokensMutation.isPending,
    isStakingTokens: stakeTokensMutation.isPending,
    isCreatingLoanRequest: createLoanRequestMutation.isPending,
    isCreatingSavingsAccount: createSavingsAccountMutation.isPending,
    
    // Utilities
    calculateVestedAmount,
    formatCompanyName,
    formatCompanySymbol,
    
    // Constants
    BANKING_VESTING_PROGRAM_ID,
    VestingType,
    AccountType,
    LoanStatus
  };
}
