'use client'

import { useState, useEffect } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { WalletButton } from '../solana/solana-provider'
import { 
  Wallet, 
  Shield, 
  Zap, 
  Users, 
  TrendingUp,
  Lock,
  CheckCircle,
  ArrowRight,
  Sparkles
} from 'lucide-react'
import { redirect } from 'next/navigation'

export default function AccountListFeature() {
  const { publicKey } = useWallet()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  if (publicKey) {
    return redirect(`/account/${publicKey.toString()}`)
  }

  const features = [
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Secure Wallet",
      description: "Connect your Solana wallet securely",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Fast Transactions",
      description: "Lightning-fast Solana transactions",
      gradient: "from-orange-500 to-red-500"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "DeFi Ecosystem",
      description: "Access to banking, vesting & staking",
      gradient: "from-green-500 to-emerald-500"
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Yield Farming",
      description: "Earn rewards on your holdings",
      gradient: "from-purple-500 to-pink-500"
    }
  ]

  const steps = [
    {
      step: "1",
      title: "Connect Wallet",
      description: "Choose your preferred Solana wallet",
      icon: <Wallet className="w-6 h-6" />
    },
    {
      step: "2", 
      title: "Verify Identity",
      description: "Quick security verification",
      icon: <Lock className="w-6 h-6" />
    },
    {
      step: "3",
      title: "Start Trading",
      description: "Access all DeFi features",
      icon: <CheckCircle className="w-6 h-6" />
    }
  ]

  return (
    <div className="min-h-screen relative">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-orange-50 via-blue-50 to-green-50 py-8 sm:py-12 lg:py-16 px-3 sm:px-4 lg:px-6 overflow-hidden">

        <div className="relative max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center mb-4 sm:mb-6">
            <img 
              src="/oc6.png" 
              alt="Oggy Account" 
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-full shadow-lg bg-white p-1 sm:p-2 border-2 sm:border-4 border-orange-300"
            />
          </div>
          
          <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold bg-gradient-to-r from-orange-500 via-blue-500 to-green-500 bg-clip-text text-transparent mb-4 sm:mb-6">
            Welcome to Your Account! 👤
          </h1>
          
          <p className="text-sm sm:text-base lg:text-lg xl:text-xl text-gray-600 mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
            Connect your wallet to access Oggy's amazing DeFi features! 🚀 
            Banking, vesting, staking and more await you! 🐱✨
          </p>

          <div className="bg-white/70 backdrop-blur-sm rounded-lg sm:rounded-xl lg:rounded-2xl p-4 sm:p-6 lg:p-8 shadow-lg lg:shadow-xl border border-orange-200">
            <div className="mb-4 sm:mb-6">
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 sm:mb-3 flex items-center justify-center gap-2">
                <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500" />
                Connect Your Wallet
              </h3>
              <p className="text-gray-600 text-xs sm:text-sm">
                Choose your preferred Solana wallet to get started
              </p>
            </div>
            
            <div className="flex justify-center">
              <WalletButton />
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-8 sm:py-12 lg:py-16 px-3 sm:px-4 lg:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-orange-500 via-blue-500 to-green-500 bg-clip-text text-transparent mb-3 sm:mb-4">
              Why Choose Oggy Bank? 🏦
            </h2>
            <p className="text-gray-600 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto px-4">
              Experience the most fun and secure DeFi platform on Solana!
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-lg border border-orange-100 hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-r ${feature.gradient} flex items-center justify-center text-white mb-3 sm:mb-4 mx-auto`}>
                  {feature.icon}
                </div>
                <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-2 text-center">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-xs sm:text-sm text-center">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How it Works Section */}
      <div className="py-8 sm:py-12 lg:py-16 px-3 sm:px-4 lg:px-6 bg-gradient-to-br from-orange-50 to-blue-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-orange-500 via-blue-500 to-green-500 bg-clip-text text-transparent mb-3 sm:mb-4">
              How It Works 🔧
            </h2>
            <p className="text-gray-600 text-sm sm:text-base lg:text-lg px-4">
              Get started in just 3 simple steps!
            </p>
          </div>

          <div className="space-y-4 sm:space-y-6 lg:space-y-8">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center gap-3 sm:gap-4 lg:gap-6 bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-lg border border-orange-100">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-r from-orange-500 to-blue-500 flex items-center justify-center text-white font-bold text-sm sm:text-lg">
                    {step.step}
                  </div>
                </div>
                <div className="flex-grow min-w-0">
                  <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                    <div className="text-orange-500 flex-shrink-0">
                      {step.icon}
                    </div>
                    <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-800 truncate">
                      {step.title}
                    </h3>
                  </div>
                  <p className="text-gray-600 text-xs sm:text-sm lg:text-base">
                    {step.description}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div className="flex-shrink-0 text-gray-400 hidden sm:block">
                    <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
