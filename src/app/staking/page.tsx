'use client'

import { useState, useEffect } from 'react'
import { 
  Zap, 
  TrendingUp, 
  Lock, 
  Unlock,
  Clock,
  Gift,
  Star,
  Trophy,
  Target,
  Activity,
  ArrowRight,
  Plus,
  Info,
  AlertTriangle,
  CheckCircle,
  Sparkles
} from 'lucide-react'

export default function StakingPage() {
  const [mounted, setMounted] = useState(false)
  const [selectedPool, setSelectedPool] = useState(0)
  const [activeReward, setActiveReward] = useState(0)

  useEffect(() => {
    setMounted(true)
    const interval = setInterval(() => {
      setActiveReward((prev) => (prev + 1) % 4)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  if (!mounted) return null

  const stakingPools = [
    {
      name: 'SOL Power Pool',
      symbol: 'SOL',
      apy: '7.8%',
      totalStaked: '2.1M SOL',
      myStaked: '12.5 SOL',
      rewards: '0.24 SOL',
      lockPeriod: 'Flexible',
      minStake: '0.1 SOL',
      description: 'Oggy\'s favorite! Stake SOL and watch it grow like his appetite! 🐱',
      emoji: '⚡',
      bgColor: 'from-purple-500 to-blue-500',
      popular: true,
      risk: 'Low'
    },
    {
      name: 'USDC Stable Vault',
      symbol: 'USDC',
      apy: '8.5%',
      totalStaked: '5.8M USDC',
      myStaked: '2,500 USDC',
      rewards: '42.3 USDC',
      lockPeriod: '30 days',
      minStake: '100 USDC',
      description: 'Stable as Oggy\'s love for fish! No volatility, just steady gains.',
      emoji: '💰',
      bgColor: 'from-green-500 to-emerald-600',
      popular: false,
      risk: 'Very Low'
    },
    {
      name: 'Multi-Token Chaos',
      symbol: 'CHAOS',
      apy: '15.2%',
      totalStaked: '890K CHAOS',
      myStaked: '1,250 CHAOS',
      rewards: '78.9 CHAOS',
      lockPeriod: '90 days',
      minStake: '50 CHAOS',
      description: 'High risk, high reward! Like chasing cockroaches - chaotic but profitable! 🪳',
      emoji: '🌪️',
      bgColor: 'from-orange-500 to-red-600',
      popular: false,
      risk: 'High'
    },
    {
      name: 'LP Token Farm',
      symbol: 'LP',
      apy: '12.7%',
      totalStaked: '450K LP',
      myStaked: '89.2 LP',
      rewards: '5.67 LP',
      lockPeriod: '60 days',
      minStake: '10 LP',
      description: 'Provide liquidity and earn like Oggy earns his meals - consistently!',
      emoji: '🚜',
      bgColor: 'from-indigo-500 to-purple-600',
      popular: false,
      risk: 'Medium'
    }
  ]

  const stakingStats = [
    { label: 'Total Staked Value', value: '$2.4M', icon: <Trophy className="w-6 h-6" />, change: '+15.2%' },
    { label: 'Active Stakers', value: '8,943', icon: <Target className="w-6 h-6" />, change: '+12.8%' },
    { label: 'Rewards Distributed', value: '$156K', icon: <Gift className="w-6 h-6" />, change: '+34.1%' },
    { label: 'Average APY', value: '11.05%', icon: <TrendingUp className="w-6 h-6" />, change: '+2.3%' },
  ]

  const myStakingPositions = [
    {
      pool: 'SOL Power Pool',
      staked: '12.5 SOL',
      value: '$525',
      rewards: '0.24 SOL',
      rewardsValue: '$10.08',
      apy: '7.8%',
      timeLeft: 'Flexible',
      status: 'active',
      emoji: '⚡'
    },
    {
      pool: 'USDC Stable Vault',
      staked: '2,500 USDC',
      value: '$2,500',
      rewards: '42.3 USDC',
      rewardsValue: '$42.30',
      apy: '8.5%',
      timeLeft: '23 days',
      status: 'locked',
      emoji: '💰'
    },
    {
      pool: 'Multi-Token Chaos',
      staked: '1,250 CHAOS',
      value: '$875',
      rewards: '78.9 CHAOS',
      rewardsValue: '$55.23',
      apy: '15.2%',
      timeLeft: '67 days',
      status: 'locked',
      emoji: '🌪️'
    }
  ]

  const upcomingRewards = [
    {
      pool: 'SOL Power Pool',
      amount: '0.052 SOL',
      value: '$2.18',
      time: 'In 2 hours',
      type: 'hourly'
    },
    {
      pool: 'USDC Stable Vault',
      amount: '2.1 USDC',
      value: '$2.10',
      time: 'Tomorrow',
      type: 'daily'
    },
    {
      pool: 'Multi-Token Chaos',
      amount: '15.7 CHAOS',
      value: '$10.99',
      time: 'In 3 days',
      type: 'weekly'
    },
    {
      pool: 'LP Token Farm',
      amount: '0.89 LP',
      value: '$4.45',
      time: 'Next week',
      type: 'weekly'
    }
  ]

  return (
    <div className="min-h-screen space-y-12">
      <section className="staking-zone py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-8">
            <div className="flex justify-center items-center space-x-8 mb-8">
              <div className="oggy-character floating-element"></div>
              <div className="text-6xl animate-bounce">⚡</div>
              <div className="cockroach-character bouncing-element"></div>
              <div className="text-4xl wiggling-element">💰</div>
              <div className="cockroach-character floating-element"></div>
            </div>

            <h1 className="text-6xl md:text-8xl font-bold leading-tight">
              <span className="oggy-gradient">Stake</span>{' '}
              <span className="text-gray-800">&</span>{' '}
              <span className="cockroach-gradient">Earn</span>
              <br />
              <span className="solana-gradient text-5xl md:text-7xl">Passively</span>
            </h1>
            
            <div className="comic-speech-bubble max-w-3xl mx-auto">
              <p className="text-xl md:text-2xl text-gray-700 font-semibold">
                🎭 Let your tokens work while you sleep! Oggy guards your staked assets 
                while those cockroaches (inflation) can't touch your growing rewards! 
                Wake up richer every day! 💤✨
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button className="cartoon-btn text-lg px-8 py-4">
                ⚡ Start Staking
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
              <button className="cartoon-btn bg-gradient-to-br from-gray-600 via-gray-700 to-gray-800 text-lg px-8 py-4">
                🏆 View Leaderboard
                <Star className="w-5 h-5 ml-2" />
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4">
        <div className="max-w-7xl mx-auto">
          <div className="money-rain"></div>
          <div className="responsive-grid">
            {stakingStats.map((stat, index) => (
              <div key={index} className="chaos-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 text-white">
                    {stat.icon}
                  </div>
                  <div className="text-sm font-semibold text-green-600 bg-green-100 px-2 py-1 rounded-full">
                    {stat.change}
                  </div>
                </div>
                <div className="stats-counter">{stat.value}</div>
                <p className="text-gray-600 font-medium mt-2">{stat.label}</p>
                <div className="pulse-ring"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="oggy-gradient">Available Staking Pools</span>
            </h2>
            <div className="comic-speech-bubble max-w-2xl mx-auto">
              <p className="text-lg text-gray-600">
                Choose your staking adventure! Each pool is as unique as Oggy's chase scenes! 🏃‍♂️💨
              </p>
            </div>
          </div>

          <div className="responsive-grid">
            {stakingPools.map((pool, index) => (
              <div 
                key={index} 
                className={`chaos-card p-8 relative overflow-hidden cursor-pointer transition-all duration-300 ${
                  selectedPool === index ? 'ring-4 ring-purple-500 ring-opacity-50 scale-105' : 'hover:scale-102'
                }`}
                onClick={() => setSelectedPool(index)}
              >
                {pool.popular && (
                  <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold transform rotate-12">
                    <Star className="w-4 h-4 inline mr-1" />
                    Popular!
                  </div>
                )}
                
                <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${pool.bgColor} flex items-center justify-center text-2xl mb-6`}>
                  {pool.emoji}
                </div>
                
                <h3 className="text-2xl font-bold mb-4 text-gray-800">{pool.name}</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">{pool.description}</p>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">APY</span>
                    <span className="font-bold text-2xl text-green-600">{pool.apy}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Staked</span>
                    <span className="font-semibold">{pool.totalStaked}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Lock Period</span>
                    <span className="font-semibold">{pool.lockPeriod}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Min Stake</span>
                    <span className="font-semibold">{pool.minStake}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Risk Level</span>
                    <span className={`font-semibold text-xs px-2 py-1 rounded-full ${
                      pool.risk === 'Low' ? 'bg-green-100 text-green-700' :
                      pool.risk === 'Very Low' ? 'bg-blue-100 text-blue-700' :
                      pool.risk === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {pool.risk}
                    </span>
                  </div>
                </div>
                
                <button className="w-full cartoon-btn">
                  Stake {pool.symbol}
                  <Plus className="w-4 h-4 ml-2" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="cockroach-gradient">My Staking Positions</span>
            </h2>
            <div className="comic-speech-bubble max-w-2xl mx-auto">
              <p className="text-lg text-gray-600">
                Your active stakes - growing like Oggy's confidence when he finally catches those roaches! 🎯
              </p>
            </div>
          </div>

          <div className="responsive-grid">
            {myStakingPositions.map((position, index) => (
              <div key={index} className="chaos-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{position.emoji}</div>
                    <div>
                      <h3 className="font-bold text-gray-800">{position.pool}</h3>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">APY: {position.apy}</span>
                        {position.status === 'active' ? (
                          <Unlock className="w-4 h-4 text-green-500" />
                        ) : (
                          <Lock className="w-4 h-4 text-orange-500" />
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-lg">{position.staked}</div>
                    <div className="text-sm text-gray-600">{position.value}</div>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Rewards Earned</span>
                    <div className="text-right">
                      <div className="font-semibold text-green-600">{position.rewards}</div>
                      <div className="text-xs text-gray-500">{position.rewardsValue}</div>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Time Remaining</span>
                    <span className="font-semibold text-blue-600">{position.timeLeft}</span>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button className="flex-1 cartoon-btn text-sm py-2">
                    Claim Rewards
                    <Gift className="w-4 h-4 ml-1" />
                  </button>
                  {position.status === 'active' && (
                    <button className="flex-1 cartoon-btn bg-gradient-to-r from-gray-600 to-gray-800 text-sm py-2">
                      Unstake
                      <Unlock className="w-4 h-4 ml-1" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="oggy-gradient">Upcoming Rewards</span>
            </h2>
            <div className="comic-speech-bubble max-w-2xl mx-auto">
              <p className="text-lg text-gray-600">
                Your future earnings are cooking! Patience pays off like Oggy's schemes! ⏰
              </p>
            </div>
          </div>

          <div className="chaos-card p-8">
            <div className="space-y-6">
              {upcomingRewards.map((reward, index) => (
                <div 
                  key={index} 
                  className={`flex items-center justify-between p-4 rounded-xl transition-all duration-300 ${
                    activeReward === index 
                      ? 'bg-gradient-to-r from-purple-100 to-blue-100 border-2 border-purple-300 scale-105' 
                      : 'bg-gradient-to-r from-gray-50 to-white border border-gray-200'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-3 h-3 rounded-full ${
                      reward.type === 'hourly' ? 'bg-green-500 animate-pulse' :
                      reward.type === 'daily' ? 'bg-blue-500' :
                      'bg-purple-500'
                    }`}></div>
                    <div>
                      <div className="font-bold text-gray-800">{reward.pool}</div>
                      <div className="text-sm text-gray-600 capitalize">{reward.type} reward</div>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-green-600">{reward.amount}</div>
                    <div className="text-sm text-gray-600">{reward.value}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-blue-600">{reward.time}</div>
                    <div className="text-xs text-gray-500">Estimated</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 text-center">
              <button className="cartoon-btn">
                <Clock className="w-5 h-5 mr-2" />
                Set Reward Notifications
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="cockroach-zone py-16 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="flex justify-center items-center space-x-4 mb-8">
            <div className="cockroach-character floating-element"></div>
            <Zap className="w-12 h-12 text-yellow-400 animate-pulse" />
            <div className="cockroach-character bouncing-element"></div>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-white">
            Ready to Maximize Your Yields?
          </h2>
          
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Join thousands of users earning passive income! Your crypto works 24/7 
            while Oggy keeps the cockroaches away from your compounding rewards!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="cartoon-btn text-lg px-8 py-4 bg-white text-gray-800 hover:bg-gray-100">
              🚀 Start Earning Now
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
            <button className="cartoon-btn text-lg px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600">
              📊 Advanced Strategies
              <Sparkles className="w-5 h-5 ml-2" />
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
