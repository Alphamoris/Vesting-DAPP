import { Connection, clusterApiUrl } from '@solana/web3.js';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type NetworkType = 'localnet' | 'devnet' | 'mainnet-beta';

interface NetworkState {
  network: NetworkType;
  connection: Connection;
  setNetwork: (network: NetworkType) => void;
}

// Network configurations
export const NETWORK_CONFIGS = {
  localnet: {
    name: 'Localnet',
    endpoint: 'http://127.0.0.1:8899',
    walletNetwork: WalletAdapterNetwork.Devnet, // Use devnet for wallet compatibility
  },
  devnet: {
    name: 'Devnet',
    endpoint: clusterApiUrl('devnet'),
    walletNetwork: WalletAdapterNetwork.Devnet,
  },
  'mainnet-beta': {
    name: 'Mainnet',
    endpoint: clusterApiUrl('mainnet-beta'),
    walletNetwork: WalletAdapterNetwork.Mainnet,
  },
} as const;

// Default to devnet for better compatibility
const DEFAULT_NETWORK: NetworkType = 'devnet';

// Get saved network from localStorage or use default
function getInitialNetwork(): NetworkType {
  if (typeof window === 'undefined') return DEFAULT_NETWORK;
  
  try {
    const saved = localStorage.getItem('solana-network');
    return (saved && Object.keys(NETWORK_CONFIGS).includes(saved)) 
      ? saved as NetworkType 
      : DEFAULT_NETWORK;
  } catch {
    return DEFAULT_NETWORK;
  }
}

// Create Zustand store for network management with persistence
export const useNetworkStore = create<NetworkState>()(
  persist(
    (set) => ({
      network: getInitialNetwork(),
      connection: new Connection(NETWORK_CONFIGS[getInitialNetwork()].endpoint, 'confirmed'),
      setNetwork: (network: NetworkType) => {
        const newConnection = new Connection(NETWORK_CONFIGS[network].endpoint, 'confirmed');
        set({ network, connection: newConnection });
        
        // Also save to localStorage for immediate access
        if (typeof window !== 'undefined') {
          localStorage.setItem('solana-network', network);
        }
      },
    }),
    {
      name: 'solana-network',
      partialize: (state) => ({ network: state.network }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Recreate connection after rehydration
          const newConnection = new Connection(NETWORK_CONFIGS[state.network].endpoint, 'confirmed');
          state.connection = newConnection;
        }
      },
    }
  )
);

// Hook for using current network connection
export function useNetworkConnection() {
  const { network, connection, setNetwork } = useNetworkStore();
  
  return {
    network,
    connection,
    setNetwork,
    networkConfig: NETWORK_CONFIGS[network],
    isLocalnet: network === 'localnet',
    isDevnet: network === 'devnet',
    isMainnet: network === 'mainnet-beta',
  };
}

// Utility to check if localnet is available
export async function checkLocalnetAvailability(): Promise<boolean> {
  try {
    const localConnection = new Connection('http://127.0.0.1:8899', 'confirmed');
    await localConnection.getVersion();
    return true;
  } catch {
    return false;
  }
}

// Utility to get the appropriate connection based on network availability
export async function getOptimalConnection(): Promise<{ connection: Connection; network: NetworkType }> {
  const isLocalnetAvailable = await checkLocalnetAvailability();
  
  if (isLocalnetAvailable) {
    return {
      connection: new Connection(NETWORK_CONFIGS.localnet.endpoint, 'confirmed'),
      network: 'localnet',
    };
  } else {
    return {
      connection: new Connection(NETWORK_CONFIGS.devnet.endpoint, 'confirmed'),
      network: 'devnet',
    };
  }
}

// Synchronous function to get default connection for non-hook usage
export function getDefaultConnection(): Connection {
  // Default to devnet for synchronous usage
  return new Connection(NETWORK_CONFIGS.devnet.endpoint, 'confirmed');
}
