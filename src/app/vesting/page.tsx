'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Clock, 
  Users, 
  Target, 
  Award, 
  Gem,
  TrendingUp,
  Calendar,
  CheckCircle,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  Trophy,
  Star
} from 'lucide-react'

export default function VestingPage() {
  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState(0)

  useEffect(() => {
    setMounted(true)
    const interval = setInterval(() => {
      setActiveTab((prev) => (prev + 1) % 4)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  if (!mounted) return null

  const vestingStats = [
    { label: "Active Schedules", value: "3,247", icon: <Target className="w-6 h-6" />, change: "+12%" },
    { label: "Companies", value: "156", icon: <Users className="w-6 h-6" />, change: "+8%" },
    { label: "Tokens Vested", value: "24.8M", icon: <Gem className="w-6 h-6" />, change: "+34%" },
    { label: "Total Value", value: "$12.4M", icon: <Award className="w-6 h-6" />, change: "+28%" },
  ]

  const vestingTypes = [
    {
      type: "Linear Vesting",
      description: "Smooth token release over time - like Oggy's steady cat food supply!",
      emoji: "🐱",
      bgColor: "from-orange-400 to-orange-600",
      features: ["Continuous release", "No cliff period", "Predictable flow"],
      popular: true
    },
    {
      type: "Cliff Vesting",
      description: "Wait, then BOOM! All at once - like cockroaches appearing suddenly!",
      emoji: "🪳",
      bgColor: "from-gray-600 to-gray-800",
      features: ["Delayed start", "Bulk release", "High commitment"],
      popular: false
    },
    {
      type: "Milestone Vesting",
      description: "Earn tokens by hitting targets - Oggy gets treats for catching roaches!",
      emoji: "🎯",
      bgColor: "from-green-500 to-emerald-600",
      features: ["Performance based", "Achievement rewards", "Flexible timing"],
      popular: false
    },
    {
      type: "Hybrid Vesting",
      description: "Mix and match for ultimate flexibility - chaos but organized!",
      emoji: "🌪️",
      bgColor: "from-purple-500 to-pink-600",
      features: ["Multiple models", "Custom schedules", "Advanced control"],
      popular: false
    }
  ]

  const recentActivity = [
    {
      company: "TechCorp",
      action: "New vesting schedule created",
      amount: "500K TECH",
      time: "2 hours ago",
      type: "create",
      avatar: "🏢"
    },
    {
      company: "StartupDAO",
      action: "Tokens claimed by employee",
      amount: "25K START",
      time: "4 hours ago",
      type: "claim",
      avatar: "🚀"
    },
    {
      company: "GameFi Inc",
      action: "Vesting schedule modified",
      amount: "1.2M GAME",
      time: "6 hours ago",
      type: "modify",
      avatar: "🎮"
    },
    {
      company: "DeFi Labs",
      action: "Bulk employee onboarding",
      amount: "50 employees",
      time: "1 day ago",
      type: "bulk",
      avatar: "🔬"
    }
  ]

  return (
    <div className="min-h-screen space-y-12">
      <section className="vesting-section py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-8">
            <div className="flex justify-center items-center space-x-6 mb-8">
              <div className="oggy-character floating-element"></div>
              <div className="text-6xl animate-bounce">⏰</div>
              <div className="cockroach-character bouncing-element"></div>
              <div className="text-4xl wiggling-element">💰</div>
              <div className="cockroach-character floating-element"></div>
            </div>

            <h1 className="text-6xl md:text-8xl font-bold leading-tight">
              <span className="oggy-gradient">Token</span>{' '}
              <span className="cockroach-gradient">Vesting</span>
              <br />
              <span className="solana-gradient text-5xl md:text-7xl">Made Simple</span>
            </h1>
            
            <div className="comic-speech-bubble max-w-3xl mx-auto">
              <p className="text-xl md:text-2xl text-gray-700 font-semibold">
                🎭 Watch Oggy manage your token schedules while keeping those 
                sneaky cockroaches (bugs) away from your precious allocations! 
                Time-locked, secure, and hilarious! 🐱✨
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button className="cartoon-btn text-lg px-8 py-4">
                ⏰ Create Schedule
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
              <button className="cartoon-btn bg-gradient-to-br from-gray-600 via-gray-700 to-gray-800 text-lg px-8 py-4">
                🪳 View All Vesting
                <Sparkles className="w-5 h-5 ml-2" />
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4">
        <div className="max-w-7xl mx-auto">
          <div className="money-rain"></div>
          <div className="responsive-grid">
            {vestingStats.map((stat, index) => (
              <div key={index} className="chaos-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 text-white">
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
              <span className="oggy-gradient">Vesting Types</span>{' '}
              <span className="text-gray-800">Available</span>
            </h2>
            <div className="comic-speech-bubble max-w-2xl mx-auto">
              <p className="text-lg text-gray-600">
                Choose your token release strategy - each as unique as Oggy's chase scenes! 🏃‍♂️💨
              </p>
            </div>
          </div>

          <div className="responsive-grid">
            {vestingTypes.map((vesting, index) => (
              <div 
                key={index} 
                className={`chaos-card p-8 relative overflow-hidden ${
                  activeTab === index ? 'ring-4 ring-purple-500 ring-opacity-50' : ''
                }`}
              >
                {vesting.popular && (
                  <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold transform rotate-12">
                    <Star className="w-4 h-4 inline mr-1" />
                    Popular!
                  </div>
                )}
                
                <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${vesting.bgColor} flex items-center justify-center text-2xl mb-6`}>
                  {vesting.emoji}
                </div>
                
                <h3 className="text-2xl font-bold mb-4 text-gray-800">{vesting.type}</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">{vesting.description}</p>
                
                <div className="space-y-2 mb-6">
                  {vesting.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      {feature}
                    </div>
                  ))}
                </div>
                
                <button className="w-full cartoon-btn">
                  Choose {vesting.type.split(' ')[0]}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="cockroach-gradient">Recent</span>{' '}
              <span className="oggy-gradient">Activity</span>
            </h2>
            <div className="comic-speech-bubble max-w-2xl mx-auto">
              <p className="text-lg text-gray-600">
                See what's happening in the vesting world - Oggy's keeping track! 👀
              </p>
            </div>
          </div>

          <div className="chaos-card p-8">
            <div className="space-y-6">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center space-x-4 p-4 rounded-xl bg-gradient-to-r from-gray-50 to-white border border-gray-200">
                  <div className="text-3xl">{activity.avatar}</div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-gray-800">{activity.company}</span>
                      <span className="text-sm text-gray-500">{activity.time}</span>
                    </div>
                    <p className="text-gray-600">{activity.action}</p>
                    <p className="font-semibold text-purple-600">{activity.amount}</p>
                  </div>
                  <div className={`w-3 h-3 rounded-full ${
                    activity.type === 'create' ? 'bg-green-500' :
                    activity.type === 'claim' ? 'bg-blue-500' :
                    activity.type === 'modify' ? 'bg-yellow-500' :
                    'bg-purple-500'
                  }`}></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="oggy-container py-16 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="flex justify-center items-center space-x-4 mb-8">
            <div className="oggy-character floating-element"></div>
            <Trophy className="w-12 h-12 text-yellow-500 animate-pulse" />
            <div className="cockroach-character bouncing-element"></div>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-white">
            Ready to Start Vesting?
          </h2>
          
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Join Oggy in creating the most secure and entertaining token vesting experience on Solana! 
            Your employees will love the journey as much as the destination.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/dashboard" className="cartoon-btn text-lg px-8 py-4 bg-white text-orange-600 hover:bg-gray-100">
              🚀 Launch Dashboard
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            <Link href="/banking" className="cartoon-btn text-lg px-8 py-4 bg-gradient-to-r from-gray-800 to-black">
              🏦 Explore Banking
              <Sparkles className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

