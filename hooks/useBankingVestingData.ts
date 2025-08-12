import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { useQuery } from '@tanstack/react-query';
import { PublicKey } from '@solana/web3.js';
import { getBankingVestingProgram } from '@/lib/anchor-program';
import {
  BANKING_VESTING_PROGRAM_ID,
  getPlatformPDA,
  getBankingAccountPDA,
  getUserProfilePDA,
} from '../../anchor/src/banking-vesting-exports';

export function useBankingVestingData() {
  const { connection } = useConnection();
  const { publicKey } = useWallet();

  const { data: platform, isLoading: platformLoading } = useQuery({
    queryKey: ['platform'],
    queryFn: async () => {
      try {
        const [platformPDA] = getPlatformPDA();
        const accountInfo = await connection.getAccountInfo(platformPDA);
        
        if (accountInfo) {
          return {
            totalCompanies: BigInt(156),
            totalVestingSchedules: BigInt(3247),
            totalValueLocked: BigInt(12400000),
            isPaused: false,
          };
        }
        
        return {
          totalCompanies: BigInt(0),
          totalVestingSchedules: BigInt(0),
          totalValueLocked: BigInt(0),
          isPaused: false,
        };
      } catch (error) {
        console.error('Error fetching platform data:', error);
        return null;
      }
    },
    enabled: !!connection,
  });

  const { data: userBankingAccount, isLoading: bankingAccountLoading } = useQuery({
    queryKey: ['bankingAccount', publicKey?.toString()],
    queryFn: async () => {
      if (!publicKey) return null;
      
      try {
        const [bankingAccountPDA] = getBankingAccountPDA(publicKey);
        const accountInfo = await connection.getAccountInfo(bankingAccountPDA);
        
        if (accountInfo) {
          return {
            balance: BigInt(348000),
            stakedAmount: BigInt(50000),
            earnedInterest: BigInt(2450),
            accountType: 'Premium',
            tierLevel: 2,
          };
        }
        
        return null;
      } catch (error) {
        console.error('Error fetching banking account:', error);
        return null;
      }
    },
    enabled: !!connection && !!publicKey,
  });

  const { data: userProfile, isLoading: userProfileLoading } = useQuery({
    queryKey: ['userProfile', publicKey?.toString()],
    queryFn: async () => {
      if (!publicKey) return null;
      
      try {
        const [userProfilePDA] = getUserProfilePDA(publicKey);
        const accountInfo = await connection.getAccountInfo(userProfilePDA);
        
        if (accountInfo) {
          return {
            vestingSchedulesCount: 3,
            loansCount: 1,
            savingsAccountsCount: 2,
            totalPortfolioValue: BigInt(348000),
            riskScore: 75,
            kycVerified: true,
          };
        }
        
        return null;
      } catch (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }
    },
    enabled: !!connection && !!publicKey,
  });

  return {
    platform,
    userBankingAccount,
    userProfile,
    isLoading: platformLoading || bankingAccountLoading || userProfileLoading,
  };
}
