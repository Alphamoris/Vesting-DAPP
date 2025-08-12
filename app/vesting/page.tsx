'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Clock, 
  Calendar, 
  TrendingUp, 
  Wallet,
  Building2,
  Users,
  Activity,
  Plus,
  Unlock,
  Lock,
  AlertCircle,
  CheckCircle,
  DollarSign
} from 'lucide-react';
import { useWalletData } from '@/hooks/useWalletData';
import { useWallet } from '@solana/wallet-adapter-react';
import ClientSideWalletButton from '@/components/client-wallet-button';
import { useNetworkConnection } from '@/lib/network-config';
import { usePlatform } from '@/components/banking-vesting/hooks/use-platform';

interface VestingSchedule {
  id: string;
  company: string;
  companySymbol: string;
  totalAmount: number;
  vestedAmount: number;
  claimedAmount: number;
  startDate: Date;
  endDate: Date;
  cliffDate: Date;
  vestingType: 'linear' | 'milestone' | 'cliff';
  status: 'active' | 'completed' | 'cancelled';
  nextVestingDate: Date;
  nextVestingAmount: number;
}

interface Company {
  id: string;
  name: string;
  symbol: string;
  description: string;
  totalEmployees: number;
  totalVestingSchedules: number;
  totalValueLocked: number;
  userRole?: 'admin' | 'employee' | null;
}

// Mock vesting schedules - in real app, fetch from blockchain
const VESTING_SCHEDULES: VestingSchedule[] = [
  {
    id: '1',
    company: 'TechCorp Inc.',
    companySymbol: 'TECH',
    totalAmount: 10000,
    vestedAmount: 2500,
    claimedAmount: 1000,
    startDate: new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000), // 6 months ago
    endDate: new Date(Date.now() + 18 * 30 * 24 * 60 * 60 * 1000), // 18 months from now
    cliffDate: new Date(Date.now() - 3 * 30 * 24 * 60 * 60 * 1000), // 3 months ago
    vestingType: 'linear',
    status: 'active',
    nextVestingDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
    nextVestingAmount: 416.67
  },
  {
    id: '2',
    company: 'StartupDAO',
    companySymbol: 'SDAO',
    totalAmount: 5000,
    vestedAmount: 5000,
    claimedAmount: 5000,
    startDate: new Date(Date.now() - 24 * 30 * 24 * 60 * 60 * 1000), // 24 months ago
    endDate: new Date(Date.now() - 0 * 30 * 24 * 60 * 60 * 1000), // now
    cliffDate: new Date(Date.now() - 12 * 30 * 24 * 60 * 60 * 1000), // 12 months ago
    vestingType: 'linear',
    status: 'completed',
    nextVestingDate: new Date(Date.now()),
    nextVestingAmount: 0
  }
];

// Mock companies - in real app, fetch from blockchain
const COMPANIES: Company[] = [
  {
    id: '1',
    name: 'TechCorp Inc.',
    symbol: 'TECH',
    description: 'Leading technology company focused on blockchain innovation and DeFi solutions.',
    totalEmployees: 150,
    totalVestingSchedules: 85,
    totalValueLocked: 2500000,
    userRole: 'employee'
  },
  {
    id: '2',
    name: 'StartupDAO',
    symbol: 'SDAO',
    description: 'Decentralized autonomous organization building the future of work.',
    totalEmployees: 45,
    totalVestingSchedules: 32,
    totalValueLocked: 750000,
    userRole: 'employee'
  },
  {
    id: '3',
    name: 'CryptoCorp',
    symbol: 'CRYP',
    description: 'Cryptocurrency exchange and trading platform.',
    totalEmployees: 200,
    totalVestingSchedules: 120,
    totalValueLocked: 5000000,
    userRole: null
  }
];

export default function VestingPage() {
  const { connected } = useWallet();
  const { walletData, isLoading, refetchAll } = useWalletData();
  const { network, isLocalnet, isDevnet } = useNetworkConnection();
  const { platform } = usePlatform();
  
  const [selectedSchedule, setSelectedSchedule] = useState<VestingSchedule | null>(null);
  const [showCreateCompany, setShowCreateCompany] = useState(false);
  const [newCompany, setNewCompany] = useState({
    name: '',
    symbol: '',
    description: ''
  });

  const totalVested = VESTING_SCHEDULES.reduce((sum, schedule) => sum + schedule.vestedAmount, 0);
  const totalClaimed = VESTING_SCHEDULES.reduce((sum, schedule) => sum + schedule.claimedAmount, 0);
  const totalUnclaimed = totalVested - totalClaimed;
  const activeSchedules = VESTING_SCHEDULES.filter(s => s.status === 'active');

  if (!connected) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <Card className="w-full max-w-md mx-4">
            <CardHeader className="text-center p-4 sm:p-6">
              <Wallet className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <CardTitle className="text-lg sm:text-xl">Connect Your Wallet</CardTitle>
              <CardDescription className="text-sm sm:text-base">
                Connect your Solana wallet to view your vesting schedules
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

  const handleClaimVesting = async (scheduleId: string) => {
    // Mock claiming logic - in real app, call smart contract
    console.log(`Claiming vesting for schedule ${scheduleId}`);
    
    // Simulate transaction
    setTimeout(() => {
      alert('Vesting claimed successfully!');
      refetchAll();
    }, 1000);
  };

  const handleCreateCompany = async () => {
    if (!newCompany.name || !newCompany.symbol) return;
    
    // Mock company creation - in real app, call smart contract
    console.log('Creating company:', newCompany);
    
    // Simulate transaction
    setTimeout(() => {
      alert('Company created successfully!');
      setNewCompany({ name: '', symbol: '', description: '' });
      setShowCreateCompany(false);
    }, 1000);
  };

  const getVestingProgress = (schedule: VestingSchedule) => {
    return (schedule.vestedAmount / schedule.totalAmount) * 100;
  };

  const getTimeProgress = (schedule: VestingSchedule) => {
    const totalTime = schedule.endDate.getTime() - schedule.startDate.getTime();
    const elapsedTime = Date.now() - schedule.startDate.getTime();
    return Math.min((elapsedTime / totalTime) * 100, 100);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-orange-600 via-blue-600 to-green-600 bg-clip-text text-transparent">
            ⏰ Token Vesting
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            Manage your token vesting schedules and company equity
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={isLocalnet ? "secondary" : isDevnet ? "default" : "destructive"} className="text-xs">
            {network}
          </Badge>
          <Button 
            onClick={() => setShowCreateCompany(true)}
            variant="outline" 
            size="sm"
            className="text-xs sm:text-sm"
          >
            <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            Create Company
          </Button>
          <Button onClick={refetchAll} variant="outline" size="sm" className="text-xs sm:text-sm">
            <Activity className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {/* Total Vested */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Vested</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalVested.toLocaleString()} tokens</div>
            <p className="text-xs text-muted-foreground">
              Across {VESTING_SCHEDULES.length} schedules
            </p>
          </CardContent>
        </Card>

        {/* Unclaimed Amount */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unclaimed</CardTitle>
            <Unlock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{totalUnclaimed.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Ready to claim
            </p>
          </CardContent>
        </Card>

        {/* Active Schedules */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Schedules</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeSchedules.length}</div>
            <p className="text-xs text-muted-foreground">
              Currently vesting
            </p>
          </CardContent>
        </Card>

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
              Available SOL
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="schedules" className="space-y-4 sm:space-y-6">
        <TabsList className="grid w-full grid-cols-3 h-auto">
          <TabsTrigger value="schedules" className="text-xs sm:text-sm px-2 sm:px-4 py-2">
            My Vesting
          </TabsTrigger>
          <TabsTrigger value="companies" className="text-xs sm:text-sm px-2 sm:px-4 py-2">
            Companies
          </TabsTrigger>
          <TabsTrigger value="claimed" className="text-xs sm:text-sm px-2 sm:px-4 py-2">
            Claim History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="schedules" className="space-y-6">
          {VESTING_SCHEDULES.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {VESTING_SCHEDULES.map((schedule) => (
                <Card key={schedule.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start gap-2">
                      <div className="min-w-0 flex-1">
                        <CardTitle className="text-base sm:text-lg truncate">{schedule.company}</CardTitle>
                        <CardDescription className="text-xs sm:text-sm truncate">
                          {schedule.companySymbol} • {schedule.vestingType} vesting
                        </CardDescription>
                      </div>
                      <Badge 
                        variant={
                          schedule.status === 'active' ? 'default' : 
                          schedule.status === 'completed' ? 'secondary' : 'destructive'
                        }
                        className="text-xs whitespace-nowrap flex-shrink-0"
                      >
                        {schedule.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-xs sm:text-sm gap-2">
                        <span className="flex-shrink-0">Vesting Progress</span>
                        <span className="text-right font-mono truncate min-w-0">
                          {schedule.vestedAmount.toLocaleString()}/{schedule.totalAmount.toLocaleString()}
                        </span>
                      </div>
                      <Progress 
                        value={getVestingProgress(schedule)} 
                        className="h-2"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Time Progress</span>
                        <span>{getTimeProgress(schedule).toFixed(1)}%</span>
                      </div>
                      <Progress 
                        value={getTimeProgress(schedule)} 
                        className="h-2"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Vested:</span>
                        <p className="font-bold">{schedule.vestedAmount.toLocaleString()}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Claimed:</span>
                        <p className="font-bold">{schedule.claimedAmount.toLocaleString()}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Unclaimed:</span>
                        <p className="font-bold text-green-600">
                          {(schedule.vestedAmount - schedule.claimedAmount).toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Next Vest:</span>
                        <p className="font-bold">{schedule.nextVestingAmount.toFixed(0)}</p>
                      </div>
                    </div>

                    <Separator />

                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Started: {formatDate(schedule.startDate)}</span>
                      <span>Ends: {formatDate(schedule.endDate)}</span>
                    </div>

                    <div className="flex gap-2">
                      {schedule.vestedAmount > schedule.claimedAmount && (
                        <Button 
                          className="flex-1" 
                          onClick={() => handleClaimVesting(schedule.id)}
                        >
                          <Unlock className="h-4 w-4 mr-2" />
                          Claim ({(schedule.vestedAmount - schedule.claimedAmount).toLocaleString()})
                        </Button>
                      )}
                      <Button 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => setSelectedSchedule(schedule)}
                      >
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Clock className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No Vesting Schedules</h3>
              <p className="text-sm text-muted-foreground">
                You don't have any active vesting schedules yet
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="companies" className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
            {COMPANIES.map((company) => (
              <Card key={company.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start gap-2">
                    <div className="min-w-0 flex-1">
                      <CardTitle className="text-base sm:text-lg truncate">{company.name}</CardTitle>
                      <CardDescription className="text-xs sm:text-sm truncate">{company.symbol}</CardDescription>
                    </div>
                    {company.userRole && (
                      <Badge variant="outline" className="text-xs whitespace-nowrap flex-shrink-0">
                        {company.userRole}
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {company.description}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Employees:</span>
                      <p className="font-bold">{company.totalEmployees}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Schedules:</span>
                      <p className="font-bold">{company.totalVestingSchedules}</p>
                    </div>
                  </div>

                  <div>
                    <span className="text-muted-foreground text-sm">Total Value Locked:</span>
                    <p className="font-bold text-lg">${company.totalValueLocked.toLocaleString()}</p>
                  </div>

                  <Separator />

                  <div className="flex gap-2">
                    <Button className="flex-1" variant="outline" size="sm">
                      <Building2 className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                    {company.userRole === 'admin' && (
                      <Button className="flex-1" size="sm">
                        <Users className="h-4 w-4 mr-2" />
                        Manage
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="claimed" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Claim History</CardTitle>
              <CardDescription>Your vesting claim transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {VESTING_SCHEDULES.filter(s => s.claimedAmount > 0).map((schedule) => (
                  <div key={schedule.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <CheckCircle className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">{schedule.company}</h3>
                        <p className="text-sm text-muted-foreground">
                          {schedule.companySymbol} tokens
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{schedule.claimedAmount.toLocaleString()} tokens</p>
                      <p className="text-sm text-muted-foreground">
                        Claimed on {formatDate(new Date())}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              {VESTING_SCHEDULES.filter(s => s.claimedAmount > 0).length === 0 && (
                <div className="text-center py-8">
                  <DollarSign className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No Claims Yet</h3>
                  <p className="text-sm text-muted-foreground">
                    Your claimed vesting tokens will appear here
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create Company Modal */}
      {showCreateCompany && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Create New Company</CardTitle>
              <CardDescription>
                Register a new company for vesting management
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  id="companyName"
                  placeholder="Enter company name"
                  value={newCompany.name}
                  onChange={(e) => setNewCompany({ ...newCompany, name: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="companySymbol">Symbol</Label>
                <Input
                  id="companySymbol"
                  placeholder="e.g., TECH"
                  value={newCompany.symbol}
                  onChange={(e) => setNewCompany({ ...newCompany, symbol: e.target.value.toUpperCase() })}
                  maxLength={8}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="companyDescription">Description (Optional)</Label>
                <Input
                  id="companyDescription"
                  placeholder="Brief company description"
                  value={newCompany.description}
                  onChange={(e) => setNewCompany({ ...newCompany, description: e.target.value })}
                />
              </div>

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Creating a company requires SOL for transaction fees and will make you the company admin.
                </AlertDescription>
              </Alert>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowCreateCompany(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1"
                  onClick={handleCreateCompany}
                  disabled={!newCompany.name || !newCompany.symbol}
                >
                  Create Company
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Vesting Schedule Details Modal */}
      {selectedSchedule && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex justify-between items-start gap-3">
                <div className="min-w-0 flex-1">
                  <CardTitle className="text-lg sm:text-xl truncate">{selectedSchedule.company}</CardTitle>
                  <CardDescription className="text-sm truncate">
                    {selectedSchedule.companySymbol} • {selectedSchedule.vestingType} vesting
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Badge 
                    variant={
                      selectedSchedule.status === 'active' ? 'default' : 
                      selectedSchedule.status === 'completed' ? 'secondary' : 'destructive'
                    }
                    className="text-xs whitespace-nowrap"
                  >
                    {selectedSchedule.status}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedSchedule(null)}
                    className="h-6 w-6 p-0"
                  >
                    ✕
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <h4 className="font-medium mb-2">Vesting Progress</h4>
                  <div className="space-y-2">
                    <Progress 
                      value={getVestingProgress(selectedSchedule)} 
                      className="h-3"
                    />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>{selectedSchedule.vestedAmount.toLocaleString()} vested</span>
                      <span>{selectedSchedule.totalAmount.toLocaleString()} total</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Time Progress</h4>
                  <div className="space-y-2">
                    <Progress 
                      value={getTimeProgress(selectedSchedule)} 
                      className="h-3"
                    />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>{getTimeProgress(selectedSchedule).toFixed(1)}% complete</span>
                      <span>until {formatDate(selectedSchedule.endDate)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Start Date:</span>
                  <p className="font-medium">{formatDate(selectedSchedule.startDate)}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">End Date:</span>
                  <p className="font-medium">{formatDate(selectedSchedule.endDate)}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Cliff Date:</span>
                  <p className="font-medium">{formatDate(selectedSchedule.cliffDate)}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Next Vesting:</span>
                  <p className="font-medium">{formatDate(selectedSchedule.nextVestingDate)}</p>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 text-center">
                <div className="p-3 border rounded-lg min-w-0">
                  <div className="text-base sm:text-lg font-bold font-mono truncate">{selectedSchedule.totalAmount.toLocaleString()}</div>
                  <p className="text-xs sm:text-sm text-muted-foreground">Total Amount</p>
                </div>
                <div className="p-3 border rounded-lg min-w-0">
                  <div className="text-base sm:text-lg font-bold text-blue-600 font-mono truncate">{selectedSchedule.vestedAmount.toLocaleString()}</div>
                  <p className="text-xs sm:text-sm text-muted-foreground">Vested</p>
                </div>
                <div className="p-3 border rounded-lg min-w-0">
                  <div className="text-base sm:text-lg font-bold text-green-600 font-mono truncate">{(selectedSchedule.vestedAmount - selectedSchedule.claimedAmount).toLocaleString()}</div>
                  <p className="text-xs sm:text-sm text-muted-foreground">Unclaimed</p>
                </div>
              </div>

              {selectedSchedule.vestedAmount > selectedSchedule.claimedAmount && (
                <Button
                  className="w-full"
                  onClick={() => {
                    handleClaimVesting(selectedSchedule.id);
                    setSelectedSchedule(null);
                  }}
                  size="lg"
                >
                  <Unlock className="h-4 w-4 mr-2" />
                  Claim {(selectedSchedule.vestedAmount - selectedSchedule.claimedAmount).toLocaleString()} Tokens
                </Button>
              )}

              <Button
                variant="outline"
                className="w-full"
                onClick={() => setSelectedSchedule(null)}
              >
                Close
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

