'use client'

import { useState, useEffect } from 'react'
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  DollarSign,
  Users,
  Activity,
  Calendar,
  Bell,
  Sparkles,
  Target,
  Award,
  Zap,
  Clock,
  Coins,
  Shield,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  Plus,
  Eye,
  Settings
} from 'lucide-react'

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    setMounted(true)
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  if (!mounted) return null

  const portfolioData = [
    { name: 'SOL', value: 145000, percentage: 42, color: 'from-purple-500 to-blue-500', change: '+12.4%' },
    { name: 'USDC', value: 98000, percentage: 28, color: 'from-blue-500 to-green-500', change: '+2.1%' },
    { name: 'BONK', value: 67000, percentage: 19, color: 'from-orange-500 to-red-500', change: '+45.8%' },
    { name: 'JUP', value: 38000, percentage: 11, color: 'from-green-500 to-teal-500', change: '+8.9%' },
  ]

  const recentTransactions = [
    {
      type: 'vest',
      description: 'TECH tokens vested',
      amount: '+2,500 TECH',
      value: '$1,250',
      time: '2 min ago',
      status: 'completed',
      icon: '🎯'
    },
    {
      type: 'stake',
      description: 'SOL staked in pool',
      amount: '10 SOL',
      value: '$420',
      time: '15 min ago',
      status: 'pending',
      icon: '⚡'
    },
    {
      type: 'claim',
      description: 'Rewards claimed',
      amount: '+156 USDC',
      value: '$156',
      time: '1 hour ago',
      status: 'completed',
      icon: '💎'
    },
    {
      type: 'loan',
      description: 'Loan payment made',
      amount: '-500 USDC',
      value: '$500',
      time: '3 hours ago',
      status: 'completed',
      icon: '🏦'
    }
  ]

  const activeVestingSchedules = [
    {
      company: 'TechCorp',
      position: 'Senior Developer',
      totalTokens: '50,000 TECH',
      vestedAmount: '15,000 TECH',
      nextVesting: '2024-08-15',
      progress: 30,
      cliffPassed: true,
      avatar: '🏢'
    },
    {
      company: 'StartupDAO',
      position: 'Product Manager',
      totalTokens: '25,000 START',
      vestedAmount: '0 START',
      nextVesting: '2024-09-01',
      progress: 0,
      cliffPassed: false,
      avatar: '🚀'
    },
    {
      company: 'GameFi Inc',
      position: 'UI Designer',
      totalTokens: '75,000 GAME',
      vestedAmount: '45,000 GAME',
      nextVesting: '2024-08-20',
      progress: 60,
      cliffPassed: true,
      avatar: '🎮'
    }
  ]

  const quickActions = [
    { title: 'Create Schedule', description: 'Set up new vesting', icon: '⏰', color: 'from-blue-500 to-cyan-500' },
    { title: 'Claim Tokens', description: 'Get vested rewards', icon: '💰', color: 'from-green-500 to-emerald-500' },
    { title: 'Stake Assets', description: 'Earn passive income', icon: '⚡', color: 'from-purple-500 to-pink-500' },
    { title: 'Get Loan', description: 'Borrow against assets', icon: '🏦', color: 'from-orange-500 to-red-500' },
  ]

  return (
    <div className="min-h-screen dashboard-bg space-y-8 p-4">
      <section className="banking-hero py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center justify-between space-y-6 lg:space-y-0">
            <div className="flex items-center space-x-6">
              <div className="oggy-character floating-element"></div>
              <div>
                <h1 className="text-4xl md:text-5xl font-bold">
                  <span className="oggy-gradient">Dashboard</span>
                </h1>
                <p className="text-xl text-gray-700 mt-2">
                  Welcome back! Oggy's been watching your portfolio 👀
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="cockroach-character bouncing-element"></div>
              <div className="comic-speech-bubble p-4">
                <div className="text-sm text-gray-600">Current Time</div>
                <div className="text-lg font-bold text-gray-800">
                  {currentTime.toLocaleTimeString()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto space-y-8">
        <div className="responsive-grid">
          <div className="chaos-card p-6 lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-800">Portfolio Overview</h3>
              <div className="text-3xl animate-pulse">💼</div>
            </div>
            
            <div className="space-y-4">
              <div className="text-center mb-6">
                <div className="stats-counter text-4xl mb-2">$348,000</div>
                <div className="text-gray-600">Total Portfolio Value</div>
                <div className="text-green-600 font-semibold text-sm">+18.7% this month</div>
              </div>
              
              <div className="space-y-3">
                {portfolioData.map((asset, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-gray-50 to-white">
                    <div className="flex items-center space-x-3">
                      <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${asset.color}`}></div>
                      <span className="font-semibold">{asset.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">${asset.value.toLocaleString()}</div>
                      <div className="text-sm text-green-600">{asset.change}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="chaos-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">Quick Actions</h3>
              <Sparkles className="w-6 h-6 text-purple-500" />
            </div>
            
            <div className="space-y-3">
              {quickActions.map((action, index) => (
                <button 
                  key={index} 
                  className="w-full p-3 rounded-xl bg-gradient-to-r from-white to-gray-50 border border-gray-200 hover:border-purple-300 transition-all duration-300 hover:scale-105 text-left"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${action.color} flex items-center justify-center text-lg`}>
                      {action.icon}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800">{action.title}</div>
                      <div className="text-sm text-gray-600">{action.description}</div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400 ml-auto" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="responsive-grid">
          <div className="chaos-card p-6 lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-800">Active Vesting Schedules</h3>
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-blue-500" />
                <span className="text-sm text-gray-600">{activeVestingSchedules.length} active</span>
              </div>
            </div>
            
            <div className="space-y-4">
              {activeVestingSchedules.map((schedule, index) => (
                <div key={index} className="p-4 rounded-xl bg-gradient-to-r from-white via-gray-50 to-white border border-gray-200">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">{schedule.avatar}</div>
                      <div>
                        <div className="font-bold text-gray-800">{schedule.company}</div>
                        <div className="text-sm text-gray-600">{schedule.position}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-600">Next vesting</div>
                      <div className="font-semibold">{schedule.nextVesting}</div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{schedule.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${schedule.progress}%` }}
                      ></div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="text-sm">
                        <span className="text-gray-600">Vested: </span>
                        <span className="font-semibold text-green-600">{schedule.vestedAmount}</span>
                        <span className="text-gray-600"> / {schedule.totalTokens}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {schedule.cliffPassed ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-yellow-500" />
                        )}
                        <span className="text-xs text-gray-500">
                          {schedule.cliffPassed ? 'Cliff passed' : 'In cliff period'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="chaos-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">Recent Activity</h3>
              <Activity className="w-5 h-5 text-blue-500" />
            </div>
            
            <div className="space-y-3">
              {recentTransactions.map((tx, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 rounded-xl bg-gradient-to-r from-gray-50 to-white">
                  <div className="text-xl">{tx.icon}</div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-800 text-sm">{tx.description}</div>
                    <div className="text-xs text-gray-500">{tx.time}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-sm">{tx.amount}</div>
                    <div className="text-xs text-gray-600">{tx.value}</div>
                  </div>
                  <div className={`w-2 h-2 rounded-full ${
                    tx.status === 'completed' ? 'bg-green-500' : 'bg-yellow-500'
                  }`}></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="cockroach-zone rounded-3xl p-8">
          <div className="text-center space-y-6">
            <div className="flex justify-center items-center space-x-4">
              <div className="cockroach-character floating-element"></div>
              <Shield className="w-12 h-12 text-white animate-pulse" />
              <div className="cockroach-character bouncing-element"></div>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Your Assets Are Safe with Oggy! 🐱
            </h2>
            
            <p className="text-lg text-white/90 max-w-2xl mx-auto">
              While you focus on building amazing things, Oggy keeps those pesky cockroaches (bugs) 
              away from your funds. Multi-sig security, time-locks, and audit trails protect everything!
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button className="cartoon-btn bg-white text-gray-800 hover:bg-gray-100">
                🔒 Security Settings
                <Settings className="w-4 h-4 ml-2" />
              </button>
              <button className="cartoon-btn bg-gradient-to-r from-purple-600 to-blue-600">
                📊 View Analytics
                <Eye className="w-4 h-4 ml-2" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
