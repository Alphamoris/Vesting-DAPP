'use client';

import { useState } from 'react';
import { PublicKey } from '@solana/web3.js';
import { useBankingVesting } from './banking-vesting-data-access';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

export function BankingVestingFeature() {
  const {
    platform,
    bankingAccount,
    platformLoading,
    bankingAccountLoading,
    initializePlatform,
    createCompany,
    depositFunds,
    withdrawFunds,
    stakeTokens,
    isInitializingPlatform,
    isDepositingFunds,
    isWithdrawingFunds,
  } = useBankingVesting();

  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [companySymbol, setCompanySymbol] = useState('');
  const [companySupply, setCompanySupply] = useState('');

  const handleInitializePlatform = async () => {
    try {
      await initializePlatform({
        admin: new PublicKey("11111111111111111111111111111111"),
        treasuryThreshold: 100,
      });
    } catch (error) {
      console.error('Failed to initialize platform:', error);
    }
  };

  const handleCreateCompany = async () => {
    if (!companyName || !companySymbol || !companySupply) return;
    
    try {
      await createCompany({
        name: companyName,
        symbol: companySymbol,
        totalSupply: BigInt(companySupply),
      });
      setCompanyName('');
      setCompanySymbol('');
      setCompanySupply('');
    } catch (error) {
      console.error('Failed to create company:', error);
    }
  };

  const handleDeposit = async () => {
    if (!depositAmount) return;
    
    try {
      await depositFunds({
        amount: BigInt(depositAmount),
      });
      setDepositAmount('');
    } catch (error) {
      console.error('Failed to deposit funds:', error);
    }
  };

  const handleWithdraw = async () => {
    if (!withdrawAmount) return;
    
    try {
      await withdrawFunds({
        amount: BigInt(withdrawAmount),
      });
      setWithdrawAmount('');
    } catch (error) {
      console.error('Failed to withdraw funds:', error);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Platform Status</CardTitle>
            <CardDescription>Current platform information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {platformLoading ? (
              <div>Loading platform data...</div>
            ) : platform ? (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Total Companies:</span>
                  <Badge variant="secondary">{platform.totalCompanies.toString()}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Total Vesting Schedules:</span>
                  <Badge variant="secondary">{platform.totalVestingSchedules.toString()}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  <Badge variant={platform.isPaused ? "destructive" : "default"}>
                    {platform.isPaused ? "Paused" : "Active"}
                  </Badge>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div>Platform not initialized</div>
                <Button 
                  onClick={handleInitializePlatform}
                  disabled={isInitializingPlatform}
                >
                  {isInitializingPlatform ? 'Initializing...' : 'Initialize Platform'}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Banking Account</CardTitle>
            <CardDescription>Your account balance and activity</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {bankingAccountLoading ? (
              <div>Loading account data...</div>
            ) : bankingAccount ? (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Balance:</span>
                  <Badge variant="secondary">{bankingAccount.balance.toString()}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Staked Amount:</span>
                  <Badge variant="secondary">{bankingAccount.stakedAmount.toString()}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Account Type:</span>
                  <Badge variant="outline">{JSON.stringify(bankingAccount.accountType)}</Badge>
                </div>
              </div>
            ) : (
              <div>No banking account found</div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Create Company</CardTitle>
            <CardDescription>Register a new company</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Company Name"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
            />
            <Input
              placeholder="Symbol"
              value={companySymbol}
              onChange={(e) => setCompanySymbol(e.target.value)}
            />
            <Input
              placeholder="Total Supply"
              type="number"
              value={companySupply}
              onChange={(e) => setCompanySupply(e.target.value)}
            />
            <Button 
              onClick={handleCreateCompany}
              disabled={!companyName || !companySymbol || !companySupply}
              className="w-full"
            >
              Create Company
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Deposit Funds</CardTitle>
            <CardDescription>Add funds to your account</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Amount"
              type="number"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
            />
            <Button 
              onClick={handleDeposit}
              disabled={!depositAmount || isDepositingFunds}
              className="w-full"
            >
              {isDepositingFunds ? 'Depositing...' : 'Deposit'}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Withdraw Funds</CardTitle>
            <CardDescription>Withdraw from your account</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Amount"
              type="number"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
            />
            <Button 
              onClick={handleWithdraw}
              disabled={!withdrawAmount || isWithdrawingFunds}
              className="w-full"
            >
              {isWithdrawingFunds ? 'Withdrawing...' : 'Withdraw'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}