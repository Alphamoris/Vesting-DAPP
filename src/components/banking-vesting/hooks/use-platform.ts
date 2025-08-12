import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getBankingVestingProgram } from '@/lib/anchor-program';
import { useBankingVestingInstructions } from './use-instructions';
import {
  BANKING_VESTING_PROGRAM_ID,
} from '../../../../anchor/src/banking-vesting-exports';

export interface Platform {
  admin: PublicKey;
  treasury: PublicKey;
  treasuryThreshold: number;
  totalCompanies: bigint;
  totalVestingSchedules: bigint;
  totalValueLocked: bigint;
  isPaused: boolean;
  bump: number;
}

export function usePlatform() {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const queryClient = useQueryClient();
  const { initializePlatform: initializePlatformTx } = useBankingVestingInstructions();

  const {
    data: platform,
    isLoading: platformLoading,
    error: platformError,
    refetch: refetchPlatform,
  } = useQuery({
    queryKey: ['platform'],
    queryFn: async (): Promise<Platform | null> => {
      if (!publicKey) return null;
      
      try {
        const platformAccounts = await connection.getProgramAccounts(BANKING_VESTING_PROGRAM_ID, {
          filters: [
            { dataSize: 200 }
          ]
        });

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
      } catch (error) {
        console.error('Error fetching platform:', error);
        
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
    enabled: !!connection && !!publicKey,
    retry: 2,
    retryDelay: 1000,
    staleTime: 30000,
  });

  const initializePlatformMutation = useMutation({
    mutationFn: async (params: { admin: PublicKey; treasuryThreshold: number }) => {
      return initializePlatformTx(params);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['platform'] });
    },
  });

  const initializePlatform = async (params: { admin: PublicKey; treasuryThreshold: number }) => {
    return initializePlatformMutation.mutateAsync(params);
  };

  return {
    platform,
    platformLoading,
    platformError,
    initializePlatform,
    refetchPlatform,
    isInitializingPlatform: initializePlatformMutation.isPending,
    initializePlatformError: initializePlatformMutation.error,
  };
}
