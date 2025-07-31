'use client';

import { useState } from 'react';
import { PublicKey } from '@solana/web3.js';
import { useWallet } from '@solana/wallet-adapter-react';
import { useBankingVesting } from './banking-vesting-data-access';
import { VestingType } from '../../../anchor/src/banking-vesting-exports';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Badge } from '../ui/badge';
import { Loader2, Coins, TrendingUp, DollarSign, Clock, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { NetworkErrorHandler, ConnectionStatus } from '../ui/error-boundary';

export function BankingVestingFeature() {
  const { connected, publicKey } = useWallet();
  const {
    platform,
    bankingAccount,
    userProfile,
    companies,
    vestingSchedules,
    platformLoading,
    bankingAccountLoading,
    companiesLoading,
    vestingSchedulesLoading,
    initializePlatform,
    createCompany,
    createVestingSchedule,
    depositFunds,
    withdrawFunds,
    claimVestedTokens,
    stakeTokens,
    createLoanRequest,
    createSavingsAccount,
    calculateVestedAmount,
    formatCompanyName,
    formatCompanySymbol,
    VestingType: VestingTypeEnum,
    isInitializingPlatform,
    isCreatingCompany,
    isCreatingVestingSchedule,
    isDepositingFunds,
    isWithdrawingFunds,
    isClaimingTokens,
    isStakingTokens,
    isCreatingLoanRequest,
    isCreatingSavingsAccount
  } = useBankingVesting();

  const [companyForm, setCompanyForm] = useState({
    name: '',
    symbol: '',
    totalSupply: ''
  });

  const [vestingForm, setVestingForm] = useState({
    companyAddress: '',
    beneficiary: '',
    totalAmount: '',
    startTime: '',
    cliffDuration: '',
    vestingDuration: '',
    vestingType: VestingType.Linear
  });

  const [depositForm, setDepositForm] = useState({
    amount: '',
    mint: ''
  });

  const [withdrawForm, setWithdrawForm] = useState({
    amount: '',
    mint: ''
  });

  const [stakeForm, setStakeForm] = useState({
    amount: '',
    mint: ''
  });

  const [loanForm, setLoanForm] = useState({
    amount: '',
    duration: '',
    collateralAmount: '',
    mint: ''
  });

  const [savingsForm, setSavingsForm] = useState({
    apyRate: '',
    mint: ''
  });

  if (!connected) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-[400px]">
          <CardHeader className="text-center">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-orange-500" />
            <CardTitle>Wallet Not Connected</CardTitle>
            <CardDescription>
              Please connect your wallet to access the Banking & Vesting platform
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const handleCreateCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createCompany({
        name: companyForm.name,
        symbol: companyForm.symbol,
        totalSupply: BigInt(companyForm.totalSupply)
      });
      toast.success('Company created successfully!');
      setCompanyForm({ name: '', symbol: '', totalSupply: '' });
    } catch (error) {
      toast.error('Failed to create company');
      console.error(error);
    }
  };

  const handleCreateVestingSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createVestingSchedule({
        companyAddress: new PublicKey(vestingForm.companyAddress),
        beneficiary: new PublicKey(vestingForm.beneficiary),
        totalAmount: BigInt(vestingForm.totalAmount),
        startTime: BigInt(new Date(vestingForm.startTime).getTime() / 1000),
        cliffDuration: BigInt(Number(vestingForm.cliffDuration) * 24 * 60 * 60), // Convert days to seconds
        vestingDuration: BigInt(Number(vestingForm.vestingDuration) * 24 * 60 * 60),
        vestingType: vestingForm.vestingType
      });
      toast.success('Vesting schedule created successfully!');
      setVestingForm({
        companyAddress: '',
        beneficiary: '',
        totalAmount: '',
        startTime: '',
        cliffDuration: '',
        vestingDuration: '',
        vestingType: VestingType.Linear
      });
    } catch (error) {
      toast.error('Failed to create vesting schedule');
      console.error(error);
    }
  };

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await depositFunds({
        amount: BigInt(depositForm.amount),
        mint: new PublicKey(depositForm.mint)
      });
      toast.success('Funds deposited successfully!');
      setDepositForm({ amount: '', mint: '' });
    } catch (error) {
      toast.error('Failed to deposit funds');
      console.error(error);
    }
  };

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await withdrawFunds({
        amount: BigInt(withdrawForm.amount),
        mint: new PublicKey(withdrawForm.mint)
      });
      toast.success('Funds withdrawn successfully!');
      setWithdrawForm({ amount: '', mint: '' });
    } catch (error) {
      toast.error('Failed to withdraw funds');
      console.error(error);
    }
  };

  return (
    <>
      <ConnectionStatus />
      <NetworkErrorHandler>
        <div className="container mx-auto p-6 space-y-8 banking-bg min-h-screen">
          {/* Header */}
          <div className="text-center space-y-4 py-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              🐱 Oggy's Banking & Vesting Platform
            </h1>
            <p className="text-lg text-gray-700">
              Comprehensive DeFi banking, token vesting, and wealth management
            </p>
          </div>

      {/* Platform Status */}
      {platformLoading ? (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Loading platform data...</span>
            </div>
          </CardContent>
        </Card>
      ) : !platform ? (
        <Card>
          <CardHeader>
            <CardTitle>Initialize Platform</CardTitle>
            <CardDescription>
              The platform needs to be initialized before use
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => initializePlatform({ admin: publicKey!, treasuryThreshold: 80 })}
              disabled={isInitializingPlatform}
              className="w-full"
            >
              {isInitializingPlatform && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Initialize Platform
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Companies</CardTitle>
              <Coins className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{platform.totalCompanies.toString()}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Vesting Schedules</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{platform.totalVestingSchedules.toString()}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Value Locked</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{platform.totalValueLocked.toString()}</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Content */}
      <Tabs defaultValue="banking" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="banking">Banking</TabsTrigger>
          <TabsTrigger value="vesting">Vesting</TabsTrigger>
          <TabsTrigger value="companies">Companies</TabsTrigger>
          <TabsTrigger value="staking">Staking</TabsTrigger>
          <TabsTrigger value="loans">Loans</TabsTrigger>
        </TabsList>

        {/* Banking Tab */}
        <TabsContent value="banking" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Account Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Banking Account</CardTitle>
                <CardDescription>Your account balance and activity</CardDescription>
              </CardHeader>
              <CardContent>
                {bankingAccountLoading ? (
                  <div className="flex items-center space-x-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Loading account...</span>
                  </div>
                ) : bankingAccount ? (
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Balance:</span>
                      <Badge variant="secondary">{bankingAccount.balance.toString()}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Staked Amount:</span>
                      <Badge variant="outline">{bankingAccount.stakedAmount.toString()}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Earned Interest:</span>
                      <Badge variant="default">{bankingAccount.earnedInterest.toString()}</Badge>
                    </div>
                  </div>
                ) : (
                  <p className="text-muted-foreground">No banking account found</p>
                )}
              </CardContent>
            </Card>

            {/* Deposit/Withdraw */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Deposit Funds</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleDeposit} className="space-y-4">
                    <div>
                      <Label htmlFor="deposit-amount">Amount</Label>
                      <Input
                        id="deposit-amount"
                        type="number"
                        value={depositForm.amount}
                        onChange={(e) => setDepositForm(prev => ({ ...prev, amount: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="deposit-mint">Token Mint</Label>
                      <Input
                        id="deposit-mint"
                        value={depositForm.mint}
                        onChange={(e) => setDepositForm(prev => ({ ...prev, mint: e.target.value }))}
                        placeholder="Token mint address"
                        required
                      />
                    </div>
                    <Button type="submit" disabled={isDepositingFunds} className="w-full">
                      {isDepositingFunds && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                      Deposit
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Withdraw Funds</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleWithdraw} className="space-y-4">
                    <div>
                      <Label htmlFor="withdraw-amount">Amount</Label>
                      <Input
                        id="withdraw-amount"
                        type="number"
                        value={withdrawForm.amount}
                        onChange={(e) => setWithdrawForm(prev => ({ ...prev, amount: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="withdraw-mint">Token Mint</Label>
                      <Input
                        id="withdraw-mint"
                        value={withdrawForm.mint}
                        onChange={(e) => setWithdrawForm(prev => ({ ...prev, mint: e.target.value }))}
                        placeholder="Token mint address"
                        required
                      />
                    </div>
                    <Button type="submit" disabled={isWithdrawingFunds} className="w-full">
                      {isWithdrawingFunds && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                      Withdraw
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Vesting Tab */}
        <TabsContent value="vesting" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Vesting Schedules */}
            <Card>
              <CardHeader>
                <CardTitle>Your Vesting Schedules</CardTitle>
                <CardDescription>Active token vesting schedules</CardDescription>
              </CardHeader>
              <CardContent>
                {vestingSchedulesLoading ? (
                  <div className="flex items-center space-x-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Loading schedules...</span>
                  </div>
                ) : vestingSchedules && vestingSchedules.length > 0 ? (
                  <div className="space-y-4">
                    {vestingSchedules.map((schedule, index) => {
                      const vestedAmount = calculateVestedAmount(
                        schedule.totalAmount,
                        schedule.startTime,
                        schedule.cliffDuration,
                        schedule.vestingDuration
                      );
                      const claimableAmount = vestedAmount - schedule.claimedAmount;
                      
                      return (
                        <Card key={index} className="p-4">
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span>Total Amount:</span>
                              <Badge>{schedule.totalAmount.toString()}</Badge>
                            </div>
                            <div className="flex justify-between">
                              <span>Vested:</span>
                              <Badge variant="secondary">{vestedAmount.toString()}</Badge>
                            </div>
                            <div className="flex justify-between">
                              <span>Claimable:</span>
                              <Badge variant="default">{claimableAmount.toString()}</Badge>
                            </div>
                            {claimableAmount > 0 && (
                              <Button
                                size="sm"
                                onClick={() => claimVestedTokens({ vestingScheduleAddress: schedule.company })}
                                disabled={isClaimingTokens}
                                className="w-full"
                              >
                                {isClaimingTokens && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                Claim Tokens
                              </Button>
                            )}
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No vesting schedules found</p>
                )}
              </CardContent>
            </Card>

            {/* Create Vesting Schedule */}
            <Card>
              <CardHeader>
                <CardTitle>Create Vesting Schedule</CardTitle>
                <CardDescription>Set up a new token vesting schedule</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateVestingSchedule} className="space-y-4">
                  <div>
                    <Label htmlFor="company-address">Company Address</Label>
                    <Input
                      id="company-address"
                      value={vestingForm.companyAddress}
                      onChange={(e) => setVestingForm(prev => ({ ...prev, companyAddress: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="beneficiary">Beneficiary</Label>
                    <Input
                      id="beneficiary"
                      value={vestingForm.beneficiary}
                      onChange={(e) => setVestingForm(prev => ({ ...prev, beneficiary: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="total-amount">Total Amount</Label>
                    <Input
                      id="total-amount"
                      type="number"
                      value={vestingForm.totalAmount}
                      onChange={(e) => setVestingForm(prev => ({ ...prev, totalAmount: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="start-time">Start Time</Label>
                    <Input
                      id="start-time"
                      type="datetime-local"
                      value={vestingForm.startTime}
                      onChange={(e) => setVestingForm(prev => ({ ...prev, startTime: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="cliff-duration">Cliff Duration (days)</Label>
                    <Input
                      id="cliff-duration"
                      type="number"
                      value={vestingForm.cliffDuration}
                      onChange={(e) => setVestingForm(prev => ({ ...prev, cliffDuration: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="vesting-duration">Vesting Duration (days)</Label>
                    <Input
                      id="vesting-duration"
                      type="number"
                      value={vestingForm.vestingDuration}
                      onChange={(e) => setVestingForm(prev => ({ ...prev, vestingDuration: e.target.value }))}
                      required
                    />
                  </div>
                  <Button type="submit" disabled={isCreatingVestingSchedule} className="w-full">
                    {isCreatingVestingSchedule && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    Create Vesting Schedule
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Companies Tab */}
        <TabsContent value="companies" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Companies List */}
            <Card>
              <CardHeader>
                <CardTitle>Companies</CardTitle>
                <CardDescription>Registered companies on the platform</CardDescription>
              </CardHeader>
              <CardContent>
                {companiesLoading ? (
                  <div className="flex items-center space-x-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Loading companies...</span>
                  </div>
                ) : companies && companies.length > 0 ? (
                  <div className="space-y-4">
                    {companies.map((company, index) => (
                      <Card key={index} className="p-4">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="font-medium">{formatCompanyName(company.name)}</span>
                            <Badge>{formatCompanySymbol(company.symbol)}</Badge>
                          </div>
                          <div className="flex justify-between text-sm text-muted-foreground">
                            <span>Total Supply:</span>
                            <span>{company.totalSupply.toString()}</span>
                          </div>
                          <div className="flex justify-between text-sm text-muted-foreground">
                            <span>Employees:</span>
                            <span>{company.employeesCount.toString()}</span>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No companies found</p>
                )}
              </CardContent>
            </Card>

            {/* Create Company */}
            <Card>
              <CardHeader>
                <CardTitle>Create Company</CardTitle>
                <CardDescription>Register a new company</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateCompany} className="space-y-4">
                  <div>
                    <Label htmlFor="company-name">Company Name</Label>
                    <Input
                      id="company-name"
                      value={companyForm.name}
                      onChange={(e) => setCompanyForm(prev => ({ ...prev, name: e.target.value }))}
                      maxLength={31}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="company-symbol">Symbol</Label>
                    <Input
                      id="company-symbol"
                      value={companyForm.symbol}
                      onChange={(e) => setCompanyForm(prev => ({ ...prev, symbol: e.target.value }))}
                      maxLength={7}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="total-supply">Total Supply</Label>
                    <Input
                      id="total-supply"
                      type="number"
                      value={companyForm.totalSupply}
                      onChange={(e) => setCompanyForm(prev => ({ ...prev, totalSupply: e.target.value }))}
                      required
                    />
                  </div>
                  <Button type="submit" disabled={isCreatingCompany} className="w-full">
                    {isCreatingCompany && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    Create Company
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Staking Tab */}
        <TabsContent value="staking" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Token Staking</CardTitle>
              <CardDescription>Stake tokens to earn rewards</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={(e) => {
                e.preventDefault();
                stakeTokens({
                  amount: BigInt(stakeForm.amount),
                  mint: new PublicKey(stakeForm.mint)
                });
              }} className="space-y-4">
                <div>
                  <Label htmlFor="stake-amount">Amount to Stake</Label>
                  <Input
                    id="stake-amount"
                    type="number"
                    value={stakeForm.amount}
                    onChange={(e) => setStakeForm(prev => ({ ...prev, amount: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="stake-mint">Token Mint</Label>
                  <Input
                    id="stake-mint"
                    value={stakeForm.mint}
                    onChange={(e) => setStakeForm(prev => ({ ...prev, mint: e.target.value }))}
                    required
                  />
                </div>
                <Button type="submit" disabled={isStakingTokens} className="w-full">
                  {isStakingTokens && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Stake Tokens
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Loans Tab */}
        <TabsContent value="loans" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Create Loan Request</CardTitle>
              <CardDescription>Request a collateralized loan</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={(e) => {
                e.preventDefault();
                createLoanRequest({
                  amount: BigInt(loanForm.amount),
                  duration: BigInt(Number(loanForm.duration) * 24 * 60 * 60), // Convert days to seconds
                  collateralAmount: BigInt(loanForm.collateralAmount),
                  mint: new PublicKey(loanForm.mint)
                });
              }} className="space-y-4">
                <div>
                  <Label htmlFor="loan-amount">Loan Amount</Label>
                  <Input
                    id="loan-amount"
                    type="number"
                    value={loanForm.amount}
                    onChange={(e) => setLoanForm(prev => ({ ...prev, amount: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="loan-duration">Duration (days)</Label>
                  <Input
                    id="loan-duration"
                    type="number"
                    value={loanForm.duration}
                    onChange={(e) => setLoanForm(prev => ({ ...prev, duration: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="collateral-amount">Collateral Amount</Label>
                  <Input
                    id="collateral-amount"
                    type="number"
                    value={loanForm.collateralAmount}
                    onChange={(e) => setLoanForm(prev => ({ ...prev, collateralAmount: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="loan-mint">Token Mint</Label>
                  <Input
                    id="loan-mint"
                    value={loanForm.mint}
                    onChange={(e) => setLoanForm(prev => ({ ...prev, mint: e.target.value }))}
                    required
                  />
                </div>
                <Button type="submit" disabled={isCreatingLoanRequest} className="w-full">
                  {isCreatingLoanRequest && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Create Loan Request
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
        </div>
      </NetworkErrorHandler>
    </>
  );
}
