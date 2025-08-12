'use client';

import dynamic from 'next/dynamic';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

const ClientSideWalletButton = dynamic(
  () => Promise.resolve(WalletMultiButton),
  { 
    ssr: false,
    loading: () => (
      <button className="wallet-adapter-button wallet-adapter-button-trigger">
        Loading...
      </button>
    )
  }
);

export default ClientSideWalletButton;
