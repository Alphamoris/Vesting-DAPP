'use client';

import { useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

export default function StakingPage() {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const [stakeAmount, setStakeAmount] = useState('');

  const handleStake = async () => {
    if (!stakeAmount || !publicKey) return;
    console.log('Staking:', stakeAmount);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-orange-600 via-blue-600 to-green-600 bg-clip-text text-transparent">
          💰 Staking Platform
        </h1>
        <Badge variant="outline" className="text-xs sm:text-sm w-fit">
          {publicKey ? 'Connected' : 'Not Connected'}
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Stake Tokens</CardTitle>
          <CardDescription>Stake your tokens to earn rewards</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="stake-amount">Amount to Stake</label>
            <Input
              id="stake-amount"
              type="number"
              placeholder="Enter amount"
              value={stakeAmount}
              onChange={(e) => setStakeAmount(e.target.value)}
            />
          </div>
          <Button 
            onClick={handleStake}
            disabled={!stakeAmount || !publicKey}
          >
            Stake Tokens
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}