'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Vote, 
  Users, 
  Clock, 
  Shield, 
  CheckCircle, 
  XCircle, 
  Activity,
  Plus,
  Eye,
  Wallet,
  AlertCircle,
  Calendar,
  Gavel
} from 'lucide-react';
import { useWalletData } from '@/hooks/useWalletData';
import { useWallet } from '@solana/wallet-adapter-react';
import ClientSideWalletButton from '@/components/client-wallet-button';
import { useNetworkConnection } from '@/lib/network-config';
import { usePlatform } from '@/components/banking-vesting/hooks/use-platform';

interface Proposal {
  id: string;
  title: string;
  description: string;
  proposer: string;
  status: 'active' | 'passed' | 'rejected' | 'expired';
  votesFor: number;
  votesAgainst: number;
  totalVotes: number;
  quorum: number;
  startTime: Date;
  endTime: Date;
  executed: boolean;
  category: 'treasury' | 'platform' | 'governance' | 'technical';
  userVote?: 'for' | 'against' | null;
}

// Mock proposals - in real app, fetch from blockchain
const PROPOSALS: Proposal[] = [
  {
    id: '1',
    title: 'Increase Treasury Threshold',
    description: 'Proposal to increase the platform treasury threshold from 10 SOL to 100 SOL to ensure better platform security and liquidity.',
    proposer: 'Admin',
    status: 'active',
    votesFor: 750,
    votesAgainst: 120,
    totalVotes: 870,
    quorum: 1000,
    startTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    endTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    executed: false,
    category: 'treasury',
    userVote: null
  },
  {
    id: '2',
    title: 'New Staking Pool Implementation',
    description: 'Add a new high-yield staking pool with 20% APY for long-term stakers (1 year minimum lock period).',
    proposer: 'Community',
    status: 'active',
    votesFor: 450,
    votesAgainst: 200,
    totalVotes: 650,
    quorum: 1000,
    startTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    endTime: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
    executed: false,
    category: 'platform',
    userVote: 'for'
  },
  {
    id: '3',
    title: 'Platform Fee Reduction',
    description: 'Reduce platform transaction fees from 0.5% to 0.3% to encourage more usage and attract new users.',
    proposer: 'Community',
    status: 'passed',
    votesFor: 1200,
    votesAgainst: 300,
    totalVotes: 1500,
    quorum: 1000,
    startTime: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    endTime: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    executed: true,
    category: 'platform',
    userVote: 'for'
  }
];

export default function GovernancePage() {
  const { connected } = useWallet();
  const { walletData, isLoading, refetchAll } = useWalletData();
  const { network, isLocalnet, isDevnet } = useNetworkConnection();
  const { platform } = usePlatform();
  
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
  const [newProposal, setNewProposal] = useState({
    title: '',
    description: '',
    category: 'platform' as Proposal['category']
  });
  const [showCreateProposal, setShowCreateProposal] = useState(false);

  const activeProposals = PROPOSALS.filter(p => p.status === 'active');
  const userVotingPower = walletData.balance * 10; // Mock: 1 SOL = 10 voting power

  if (!connected) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <Card className="w-full max-w-md mx-4">
            <CardHeader className="text-center p-4 sm:p-6">
              <Wallet className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <CardTitle className="text-lg sm:text-xl">Connect Your Wallet</CardTitle>
              <CardDescription className="text-sm sm:text-base">
                Connect your Solana wallet to participate in governance
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

  const handleVote = async (proposalId: string, vote: 'for' | 'against') => {
    // Mock voting logic - in real app, call smart contract
    console.log(`Voting ${vote} on proposal ${proposalId}`);
    
    // Simulate transaction
    setTimeout(() => {
      alert(`Successfully voted ${vote} on proposal!`);
      refetchAll();
    }, 1000);
  };

  const handleCreateProposal = async () => {
    if (!newProposal.title || !newProposal.description) return;
    
    // Mock proposal creation - in real app, call smart contract
    console.log('Creating proposal:', newProposal);
    
    // Simulate transaction
    setTimeout(() => {
      alert('Proposal created successfully!');
      setNewProposal({ title: '', description: '', category: 'platform' });
      setShowCreateProposal(false);
    }, 1000);
  };

  const getStatusColor = (status: Proposal['status']) => {
    switch (status) {
      case 'active': return 'default';
      case 'passed': return 'default';
      case 'rejected': return 'destructive';
      case 'expired': return 'secondary';
      default: return 'secondary';
    }
  };

  const getCategoryIcon = (category: Proposal['category']) => {
    switch (category) {
      case 'treasury': return <Shield className="h-4 w-4" />;
      case 'platform': return <Activity className="h-4 w-4" />;
      case 'governance': return <Vote className="h-4 w-4" />;
      case 'technical': return <Gavel className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-orange-600 via-blue-600 to-green-600 bg-clip-text text-transparent">
            🗳️ Governance
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            Participate in platform governance and shape the future of Banking & Vesting
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={isLocalnet ? "secondary" : isDevnet ? "default" : "destructive"} className="text-xs">
            {network}
          </Badge>
          <Button 
            onClick={() => setShowCreateProposal(true)}
            variant="outline" 
            size="sm"
            className="text-xs sm:text-sm"
          >
            <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            Create Proposal
          </Button>
          <Button onClick={refetchAll} variant="outline" size="sm" className="text-xs sm:text-sm">
            <Activity className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {/* Voting Power */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Voting Power</CardTitle>
            <Vote className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userVotingPower.toFixed(0)}</div>
            <p className="text-xs text-muted-foreground">
              Based on {walletData.formattedBalance}
            </p>
          </CardContent>
        </Card>

        {/* Active Proposals */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Proposals</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeProposals.length}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting votes
            </p>
          </CardContent>
        </Card>

        {/* Your Votes */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Your Votes</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {PROPOSALS.filter(p => p.userVote).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Total participation
            </p>
          </CardContent>
        </Card>

        {/* Proposals Passed */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Proposals Passed</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {PROPOSALS.filter(p => p.status === 'passed').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Successfully executed
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="active" className="space-y-6">
        <TabsList>
          <TabsTrigger value="active">Active Proposals</TabsTrigger>
          <TabsTrigger value="all">All Proposals</TabsTrigger>
          <TabsTrigger value="my-votes">My Votes</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-6">
          {activeProposals.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {activeProposals.map((proposal) => (
                <Card key={proposal.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        {getCategoryIcon(proposal.category)}
                        <div>
                          <CardTitle className="text-lg">{proposal.title}</CardTitle>
                          <CardDescription>
                            by {proposal.proposer} • {proposal.category}
                          </CardDescription>
                        </div>
                      </div>
                      <Badge variant={getStatusColor(proposal.status)}>
                        {proposal.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {proposal.description}
                    </p>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{proposal.totalVotes}/{proposal.quorum} votes</span>
                      </div>
                      <Progress 
                        value={(proposal.totalVotes / proposal.quorum) * 100} 
                        className="h-2"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-sm">
                      <div className="flex justify-between">
                        <span>For:</span>
                        <span className="font-bold text-green-600">{proposal.votesFor}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Against:</span>
                        <span className="font-bold text-red-600">{proposal.votesAgainst}</span>
                      </div>
                    </div>

                    <Separator />

                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Ends: {proposal.endTime.toLocaleDateString()}</span>
                      <span>{Math.ceil((proposal.endTime.getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days left</span>
                    </div>

                    {proposal.userVote ? (
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>You voted: <strong>{proposal.userVote}</strong></span>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <Button 
                          className="flex-1" 
                          onClick={() => handleVote(proposal.id, 'for')}
                          size="sm"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Vote For
                        </Button>
                        <Button 
                          variant="outline" 
                          className="flex-1"
                          onClick={() => handleVote(proposal.id, 'against')}
                          size="sm"
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Vote Against
                        </Button>
                      </div>
                    )}

                    <Button 
                      variant="ghost" 
                      className="w-full"
                      onClick={() => setSelectedProposal(proposal)}
                      size="sm"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Vote className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No Active Proposals</h3>
              <p className="text-sm text-muted-foreground">
                Create a new proposal to start the governance process
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="all" className="space-y-6">
          <div className="space-y-4">
            {PROPOSALS.map((proposal) => (
              <Card key={proposal.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {getCategoryIcon(proposal.category)}
                      <div>
                        <h3 className="font-medium">{proposal.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          by {proposal.proposer} • {proposal.category}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right text-sm">
                        <p className="font-medium">{proposal.votesFor}/{proposal.votesAgainst}</p>
                        <p className="text-muted-foreground">For/Against</p>
                      </div>
                      <Badge variant={getStatusColor(proposal.status)}>
                        {proposal.status}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="my-votes" className="space-y-6">
          <div className="space-y-4">
            {PROPOSALS.filter(p => p.userVote).map((proposal) => (
              <Card key={proposal.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {getCategoryIcon(proposal.category)}
                      <div>
                        <h3 className="font-medium">{proposal.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          by {proposal.proposer} • {proposal.category}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right text-sm">
                        <p className="font-medium">Your vote: <strong>{proposal.userVote}</strong></p>
                        <p className="text-muted-foreground">{proposal.status}</p>
                      </div>
                      <Badge variant={getStatusColor(proposal.status)}>
                        {proposal.status}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Create Proposal Modal */}
      {showCreateProposal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Create New Proposal</CardTitle>
              <CardDescription>
                Submit a proposal for community voting
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Proposal Title</Label>
                <Input
                  id="title"
                  placeholder="Enter proposal title"
                  value={newProposal.title}
                  onChange={(e) => setNewProposal({ ...newProposal, title: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  className="w-full p-2 border rounded-md"
                  value={newProposal.category}
                  onChange={(e) => setNewProposal({ ...newProposal, category: e.target.value as Proposal['category'] })}
                >
                  <option value="platform">Platform</option>
                  <option value="treasury">Treasury</option>
                  <option value="governance">Governance</option>
                  <option value="technical">Technical</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your proposal in detail..."
                  rows={6}
                  value={newProposal.description}
                  onChange={(e) => setNewProposal({ ...newProposal, description: e.target.value })}
                />
              </div>

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Creating a proposal requires a minimum stake and will be subject to community voting.
                  The voting period lasts 7 days with a quorum requirement.
                </AlertDescription>
              </Alert>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowCreateProposal(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1"
                  onClick={handleCreateProposal}
                  disabled={!newProposal.title || !newProposal.description}
                >
                  Create Proposal
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Proposal Details Modal */}
      {selectedProposal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl">{selectedProposal.title}</CardTitle>
                  <CardDescription>
                    by {selectedProposal.proposer} • {selectedProposal.category}
                  </CardDescription>
                </div>
                <Badge variant={getStatusColor(selectedProposal.status)}>
                  {selectedProposal.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-medium mb-2">Description</h4>
                <p className="text-sm text-muted-foreground">{selectedProposal.description}</p>
              </div>

              <Separator />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <h4 className="font-medium mb-2">Voting Progress</h4>
                  <div className="space-y-2">
                    <Progress 
                      value={(selectedProposal.totalVotes / selectedProposal.quorum) * 100} 
                      className="h-3"
                    />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>{selectedProposal.totalVotes} votes</span>
                      <span>{selectedProposal.quorum} required</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Vote Distribution</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>For:</span>
                      <span className="font-bold text-green-600">{selectedProposal.votesFor}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Against:</span>
                      <span className="font-bold text-red-600">{selectedProposal.votesAgainst}</span>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Started:</span>
                  <p>{selectedProposal.startTime.toLocaleDateString()}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Ends:</span>
                  <p>{selectedProposal.endTime.toLocaleDateString()}</p>
                </div>
              </div>

              {!selectedProposal.userVote && selectedProposal.status === 'active' && (
                <div className="flex gap-2">
                  <Button 
                    className="flex-1" 
                    onClick={() => {
                      handleVote(selectedProposal.id, 'for');
                      setSelectedProposal(null);
                    }}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Vote For
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => {
                      handleVote(selectedProposal.id, 'against');
                      setSelectedProposal(null);
                    }}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Vote Against
                  </Button>
                </div>
              )}

              <Button
                variant="outline"
                className="w-full"
                onClick={() => setSelectedProposal(null)}
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
