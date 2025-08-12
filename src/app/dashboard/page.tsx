'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  Wallet, 
  TrendingUp, 
  Clock, 
  Shield, 
  DollarSign, 
  Building2, 
  Users, 
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Coins
} from 'lucide-react';
import { useWalletData } from '@/hooks/useWalletData';
import { useWallet } from '@solana/wallet-adapter-react';
import ClientSideWalletButton from '@/components/client-wallet-button';
import { useNetworkConnection } from '@/lib/network-config';
import { usePlatform } from '@/components/banking-vesting/hooks/use-platform';

export default function DashboardPage() {
  const { connected } = useWallet();
  const { walletData, isLoading, refetchAll } = useWalletData();
  const { network, isLocalnet, isDevnet } = useNetworkConnection();
  const { platform, platformLoading } = usePlatform();

  if (!connected) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <Card className="w-full max-w-md mx-4">
            <CardHeader className="text-center p-4 sm:p-6">
              <Wallet className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <CardTitle className="text-lg sm:text-xl">Connect Your Wallet</CardTitle>
              <CardDescription className="text-sm sm:text-base">
                Connect your Solana wallet to view your dashboard
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center p-4 sm:p-6">
              <ClientSideWalletButton />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome to your Banking & Vesting Platform dashboard
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={isLocalnet ? "secondary" : isDevnet ? "default" : "destructive"}>
            {network}
          </Badge>
          <Button onClick={refetchAll} variant="outline" size="sm">
            <Activity className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {/* Wallet Balance */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Wallet Balance</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? 'Loading...' : walletData.formattedBalance}
            </div>
            <p className="text-xs text-muted-foreground">
              Network: {network}
            </p>
          </CardContent>
        </Card>

        {/* Total Companies */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Companies</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {platformLoading ? 'Loading...' : platform?.totalCompanies?.toString() || '0'}
            </div>
            <p className="text-xs text-muted-foreground">
              Registered companies
            </p>
          </CardContent>
        </Card>

        {/* Active Vesting */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vesting Schedules</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {platformLoading ? 'Loading...' : platform?.totalVestingSchedules?.toString() || '0'}
            </div>
            <p className="text-xs text-muted-foreground">
              Active schedules
            </p>
          </CardContent>
        </Card>

        {/* Token Holdings */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Token Holdings</CardTitle>
            <Coins className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? 'Loading...' : walletData.tokens.length}
            </div>
            <p className="text-xs text-muted-foreground">
              Different tokens
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="transactions">Recent Transactions</TabsTrigger>
          <TabsTrigger value="tokens">Token Holdings</TabsTrigger>
          <TabsTrigger value="platform">Platform Stats</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Wallet Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Wallet Overview</CardTitle>
                <CardDescription>Your current wallet status and activity</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Public Key</span>
                  <span className="text-sm text-muted-foreground font-mono">
                    {walletData.publicKey?.toString().slice(0, 8)}...
                    {walletData.publicKey?.toString().slice(-8)}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Balance</span>
                  <span className="text-sm font-bold">{walletData.formattedBalance}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Network</span>
                  <Badge variant={isLocalnet ? "secondary" : "default"}>{network}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Recent Transactions</span>
                  <span className="text-sm text-muted-foreground">
                    {walletData.transactions.length} transactions
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Platform Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Platform Overview</CardTitle>
                <CardDescription>Banking & Vesting Platform statistics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {platform ? (
                  <>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Platform Admin</span>
                      <span className="text-sm text-muted-foreground font-mono">
                        {platform.admin.toString().slice(0, 8)}...
                        {platform.admin.toString().slice(-8)}
                      </span>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Treasury Threshold</span>
                      <span className="text-sm font-bold">
                        {platform.treasuryThreshold / 1000000000} SOL
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Total Companies</span>
                      <span className="text-sm text-muted-foreground">
                        {platform.totalCompanies.toString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Total Vesting</span>
                      <span className="text-sm text-muted-foreground">
                        {platform.totalVestingSchedules.toString()}
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-sm text-muted-foreground">
                      Platform not initialized yet
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>Your latest wallet transactions</CardDescription>
            </CardHeader>
            <CardContent>
              {walletData.transactions.length > 0 ? (
                <div className="space-y-4">
                  {walletData.transactions.slice(0, 10).map((tx, index) => (
                    <div key={tx.signature} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        {tx.err ? (
                          <ArrowDownRight className="h-4 w-4 text-red-500" />
                        ) : (
                          <ArrowUpRight className="h-4 w-4 text-green-500" />
                        )}
                        <div>
                          <p className="text-sm font-medium">
                            Transaction #{walletData.transactions.length - index}
                          </p>
                          <p className="text-xs text-muted-foreground font-mono">
                            {tx.signature.slice(0, 16)}...{tx.signature.slice(-16)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          {tx.err ? 'Failed' : 'Success'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {tx.blockTime ? new Date(tx.blockTime * 1000).toLocaleString() : 'Unknown'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Activity className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No transactions found</h3>
                  <p className="text-sm text-muted-foreground">
                    Start using the platform to see your transaction history
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tokens" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Token Holdings</CardTitle>
              <CardDescription>Your SPL token balances</CardDescription>
            </CardHeader>
            <CardContent>
              {walletData.tokens.length > 0 ? (
                <div className="space-y-4">
                  {walletData.tokens.map((token, index) => (
                    <div key={token.pubkey} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Coins className="h-8 w-8 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Token #{index + 1}</p>
                          <p className="text-xs text-muted-foreground font-mono">
                            {token.mint.slice(0, 16)}...{token.mint.slice(-16)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold">
                          {token.tokenAmount.uiAmountString || '0'} tokens
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Decimals: {token.tokenAmount.decimals}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Coins className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No tokens found</h3>
                  <p className="text-sm text-muted-foreground">
                    You don't have any SPL tokens in this wallet
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="platform" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Platform Statistics</CardTitle>
              <CardDescription>Banking & Vesting Platform metrics</CardDescription>
            </CardHeader>
            <CardContent>
              {platform ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Platform Status</p>
                      <Badge variant="default" className="w-fit">
                        <Shield className="h-3 w-3 mr-1" />
                        Active
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Network</p>
                      <Badge variant={isLocalnet ? "secondary" : "default"}>
                        {network}
                      </Badge>
                    </div>
                  </div>
                  <Separator />
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Companies Progress</span>
                        <span className="text-sm text-muted-foreground">
                          {platform.totalCompanies.toString()}/100
                        </span>
                      </div>
                      <Progress 
                        value={Math.min(Number(platform.totalCompanies) * 10, 100)} 
                        className="h-2"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Vesting Schedules</span>
                        <span className="text-sm text-muted-foreground">
                          {platform.totalVestingSchedules.toString()}/500
                        </span>
                      </div>
                      <Progress 
                        value={Math.min(Number(platform.totalVestingSchedules) * 2, 100)} 
                        className="h-2"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Building2 className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">Platform Not Initialized</h3>
                  <p className="text-sm text-muted-foreground">
                    The platform needs to be initialized by an admin
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
