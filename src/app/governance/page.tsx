'use client'

import { useState, useEffect } from 'react'
import { 
  Vote, 
  Users, 
  Trophy, 
  Target,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Plus,
  MessageSquare,
  ThumbsUp,
  ThumbsDown
} from 'lucide-react'

export default function GovernancePage() {
  const [mounted, setMounted] = useState(false)
  const [selectedProposal, setSelectedProposal] = useState(0)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const proposals = [
    {
      id: 1,
      title: "Increase Staking Rewards for OGGY Pool",
      description: "Proposal to increase the APY for OGGY token staking from 15.5% to 18% to attract more stakers and improve token utility.",
      proposer: "Alice Johnson",
      status: "active",
      votesFor: 2847,
      votesAgainst: 392,
      totalVotes: 3239,
      quorum: 5000,
      timeLeft: "2 days, 14 hours",
      category: "Economic",
      emoji: "💰"
    },
    {
      id: 2,
      title: "Implement New Vesting Schedule Types",
      description: "Add support for performance-based vesting and milestone-based vesting to provide more flexibility for companies.",
      proposer: "Bob Smith",
      status: "active",
      votesFor: 1923,
      votesAgainst: 156,
      totalVotes: 2079,
      quorum: 3000,
      timeLeft: "5 days, 8 hours",
      category: "Feature",
      emoji: "🛠️"
    },
    {
      id: 3,
      title: "Treasury Fund Allocation for Marketing",
      description: "Allocate 100,000 OGGY tokens from treasury for marketing campaigns to increase platform adoption.",
      proposer: "Carol Wilson",
      status: "passed",
      votesFor: 4521,
      votesAgainst: 879,
      totalVotes: 5400,
      quorum: 4000,
      timeLeft: "Completed",
      category: "Treasury",
      emoji: "📢"
    },
    {
      id: 4,
      title: "Reduce Platform Fees by 0.1%",
      description: "Lower transaction fees to make the platform more competitive and user-friendly.",
      proposer: "Dave Brown",
      status: "failed",
      votesFor: 1234,
      votesAgainst: 3456,
      totalVotes: 4690,
      quorum: 3000,
      timeLeft: "Completed",
      category: "Economic",
      emoji: "💸"
    }
  ]

  const governanceStats = [
    { label: 'Active Proposals', value: '8', icon: <Vote className="w-5 h-5" /> },
    { label: 'Total Voters', value: '12.4K', icon: <Users className="w-5 h-5" /> },
    { label: 'Proposals Passed', value: '67', icon: <Trophy className="w-5 h-5" /> },
    { label: 'Your Voting Power', value: '1,250', icon: <Target className="w-5 h-5" /> },
  ]

  const votingHistory = [
    { proposal: "Increase SOL Staking APY", vote: "For", result: "Passed", date: "2 days ago" },
    { proposal: "New Treasury Multisig", vote: "For", result: "Passed", date: "1 week ago" },
    { proposal: "Platform Fee Reduction", vote: "Against", result: "Failed", date: "2 weeks ago" },
    { proposal: "Add New Token Pairs", vote: "For", result: "Passed", date: "3 weeks ago" }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-blue-100 text-blue-600 border-blue-300'
      case 'passed': return 'bg-green-100 text-green-600 border-green-300'
      case 'failed': return 'bg-red-100 text-red-600 border-red-300'
      default: return 'bg-gray-100 text-gray-600 border-gray-300'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Clock className="w-4 h-4" />
      case 'passed': return <CheckCircle className="w-4 h-4" />
      case 'failed': return <XCircle className="w-4 h-4" />
      default: return <AlertCircle className="w-4 h-4" />
    }
  }

  return (
    <div className="space-y-8 governance-bg min-h-screen p-4">
      {/* Header */}
      <div className="cartoon-card p-8 light-theme-card">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="oggy-character floating-element"></div>
            <div>
              <h1 className="text-4xl font-bold oggy-gradient">🏛️ Governance</h1>
              <p className="text-gray-700 mt-2">Shape the future of Oggy Bank together</p>
            </div>
          </div>
          
          <button className="light-theme-btn flex items-center space-x-2">
            <Plus className="w-5 h-5" />
            <span>Create Proposal</span>
          </button>
        </div>
      </div>

      {/* Governance Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {governanceStats.map((stat, index) => (
          <div key={stat.label} className={`stats-card text-center fade-in-up`} 
               style={{ animationDelay: `${index * 0.1}s` }}>
            <div className="flex justify-center mb-3">
              <div className="p-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full text-white">
                {stat.icon}
              </div>
            </div>
            <div className="text-3xl font-bold cockroach-gradient mb-1">{stat.value}</div>
            <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Active Proposals */}
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold cockroach-gradient mb-4">
            🗳️ Current Proposals
          </h2>
          <p className="text-gray-600">Have your say in the future of our platform</p>
        </div>

        <div className="space-y-6">
          {proposals.map((proposal, index) => (
            <div
              key={proposal.id}
              className={`cartoon-card p-6 cursor-pointer transition-all duration-300 ${
                selectedProposal === index ? 'pulse-glow scale-105' : ''
              }`}
              onClick={() => setSelectedProposal(index)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-4">
                  <div className="text-3xl">{proposal.emoji}</div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-800">{proposal.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold border-2 ${getStatusColor(proposal.status)}`}>
                        {getStatusIcon(proposal.status)}
                        <span className="ml-1 capitalize">{proposal.status}</span>
                      </span>
                    </div>
                    <p className="text-gray-600 mb-3">{proposal.description}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>By {proposal.proposer}</span>
                      <span>•</span>
                      <span>{proposal.category}</span>
                      <span>•</span>
                      <span>{proposal.timeLeft}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Voting Progress */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">Voting Progress</span>
                  <span className="text-sm text-gray-600">
                    {proposal.totalVotes.toLocaleString()} / {proposal.quorum.toLocaleString()} votes
                  </span>
                </div>
                
                <div className="cartoon-progress">
                  <div 
                    className="cartoon-progress-fill" 
                    style={{ width: `${Math.min((proposal.totalVotes / proposal.quorum) * 100, 100)}%` }}
                  ></div>
                </div>

                <div className="flex justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <ThumbsUp className="w-4 h-4 text-green-600" />
                    <span className="text-green-600 font-semibold">
                      {proposal.votesFor.toLocaleString()} For ({Math.round((proposal.votesFor / proposal.totalVotes) * 100)}%)
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <ThumbsDown className="w-4 h-4 text-red-600" />
                    <span className="text-red-600 font-semibold">
                      {proposal.votesAgainst.toLocaleString()} Against ({Math.round((proposal.votesAgainst / proposal.totalVotes) * 100)}%)
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              {proposal.status === 'active' && (
                <div className="flex space-x-3 mt-6">
                  <button className="cartoon-btn flex-1 text-sm">
                    <ThumbsUp className="w-4 h-4 mr-2" />
                    Vote For
                  </button>
                  <button className="cartoon-btn-secondary flex-1 text-sm">
                    <ThumbsDown className="w-4 h-4 mr-2" />
                    Vote Against
                  </button>
                  <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors">
                    <MessageSquare className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Voting History */}
      <div className="cartoon-card p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <Trophy className="w-6 h-6 mr-3 text-yellow-500" />
          Your Voting History
          <div className="cockroach-character ml-3 bouncing-element"></div>
        </h2>

        <div className="space-y-4">
          {votingHistory.map((vote, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gradient-to-r from-white to-gray-50 rounded-lg border-2 border-gray-200">
              <div className="flex items-center space-x-4">
                <div className={`p-2 rounded-full ${
                  vote.vote === 'For' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                }`}>
                  {vote.vote === 'For' ? <ThumbsUp className="w-5 h-5" /> : <ThumbsDown className="w-5 h-5" />}
                </div>
                <div>
                  <div className="font-semibold text-gray-800">{vote.proposal}</div>
                  <div className="text-sm text-gray-600">{vote.date}</div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="font-bold text-gray-800">Voted {vote.vote}</div>
                <div className={`text-sm font-semibold ${
                  vote.result === 'Passed' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {vote.result}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Governance Info */}
      <div className="cartoon-card p-8 bg-gradient-to-r from-yellow-50 to-orange-50">
        <div className="text-center space-y-6">
          <div className="flex justify-center items-center space-x-4">
            <div className="oggy-character floating-element"></div>
            <div className="text-4xl">🏛️</div>
            <div className="cockroach-character wiggling-element"></div>
          </div>
          
          <h2 className="text-3xl font-bold oggy-gradient">How Governance Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            {[
              {
                step: "1",
                title: "Proposal Creation",
                description: "Community members can create proposals for platform improvements, changes, or new features.",
                emoji: "📝"
              },
              {
                step: "2",
                title: "Community Voting",
                description: "Token holders vote using their OGGY tokens. More tokens = more voting power.",
                emoji: "🗳️"
              },
              {
                step: "3",
                title: "Implementation",
                description: "Passed proposals are implemented by the development team within specified timeframes.",
                emoji: "⚙️"
              }
            ].map((step) => (
              <div key={step.step} className="text-center">
                <div className="text-4xl mb-3">{step.emoji}</div>
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold mx-auto mb-3">
                  {step.step}
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">{step.title}</h3>
                <p className="text-sm text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="fixed bottom-20 right-20 z-50">
        <div className="relative">
          <div className="cockroach-character floating-element cursor-pointer hover:scale-110 transition-transform"></div>
          <div className="absolute -top-12 -left-16 bg-white border-2 border-purple-300 rounded-lg px-3 py-1 text-sm font-semibold shadow-lg">
            Vote responsibly! 🗳️
          </div>
        </div>
      </div>
    </div>
  )
}
