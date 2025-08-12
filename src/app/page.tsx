'use client';

import Link from 'next/link';
import { 
  Wallet, 
  TrendingUp, 
  Shield, 
  Clock, 
  Users, 
  DollarSign,
  ArrowRight,
  Star,
  Zap,
  Globe
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen page-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden banking-hero">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(251,146,60,0.4),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,rgba(59,130,246,0.4),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_10%,rgba(16,185,129,0.3),transparent_40%)]"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <div className="text-center">
            <div className="mb-6 sm:mb-8 relative">
              <img 
                src='/oc5.png'
                alt="Oggy Character"
                className="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 mx-auto bouncing-element transition-all duration-500 ease-in-out"
              />
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold bg-gradient-to-r from-orange-600 via-blue-600 to-green-600 bg-clip-text text-transparent mb-4 sm:mb-6">
              Welcome to Oggy's
              <br />
              <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl">DeFi Universe</span>
            </h1>
            
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-700 dark:text-gray-300 mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed">
              Chase your financial dreams with Oggy! Experience next-generation DeFi with vesting, staking, and governance on Solana.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center max-w-lg mx-auto">
              <Link
                href="/vesting"
                className="group w-full sm:w-auto inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-orange-600 to-orange-500 text-white rounded-full hover:from-orange-700 hover:to-orange-600 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl text-sm sm:text-base font-medium"
              >
                Start Vesting
                <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <Link
                href="/staking"
                className="group w-full sm:w-auto inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-full hover:from-blue-700 hover:to-blue-600 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl text-sm sm:text-base font-medium"
              >
                Explore Staking
                <Zap className="ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:rotate-12 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {[
              { label: 'Total Value Locked', value: '$12.5M', icon: DollarSign, bgColor: 'from-green-500 to-emerald-500' },
              { label: 'Active Users', value: '25,000+', icon: Users, bgColor: 'from-blue-500 to-cyan-500' },
              { label: 'Vesting Programs', value: '150+', icon: Clock, bgColor: 'from-purple-500 to-pink-500' },
              { label: 'APY Average', value: '12.5%', icon: TrendingUp, bgColor: 'from-orange-500 to-red-500' }
            ].map((stat, index) => (
              <div key={index} className="text-center group light-theme-card p-4 sm:p-6">
                <div className={`w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 rounded-full bg-gradient-to-r ${stat.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                </div>
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">{stat.value}</div>
                <div className="text-xs sm:text-sm text-gray-600 leading-tight">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 lg:py-20 staking-zone">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent mb-4 pb-2">
              Oggy's DeFi Features
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Catch the best DeFi opportunities with our comprehensive suite of financial tools
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                title: 'Token Vesting',
                description: 'Secure and transparent token vesting with customizable schedules and cliff periods.',
                icon: Clock,
                image: '/oc1.png',
                color: 'from-orange-500 to-red-500',
                link: '/vesting'
              },
              {
                title: 'Staking Rewards',
                description: 'Earn passive income by staking your tokens with competitive APY rates.',
                icon: TrendingUp,
                image: '/oc2.png',
                color: 'from-blue-500 to-cyan-500',
                link: '/staking'
              },
              {
                title: 'Governance',
                description: 'Participate in decentralized governance and shape the future of the protocol.',
                icon: Shield,
                image: '/oc3.png',
                color: 'from-purple-500 to-pink-500',
                link: '/governance'
              }
            ].map((feature, index) => (
              <div key={index} className="group relative light-theme-card p-6 sm:p-8 hover:-translate-y-2 transition-all duration-300">
                <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
                  <img 
                    src={feature.image} 
                    alt={`Oggy ${feature.title}`}
                    className="w-12 h-12 sm:w-16 sm:h-16 floating-element opacity-70 group-hover:opacity-100 transition-opacity"
                  />
                </div>
                
                <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
                </div>
                
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-3 sm:mb-4 group-hover:text-blue-600 transition-colors">
                  {feature.title}
                </h3>
                
                <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 leading-relaxed">
                  {feature.description}
                </p>
                
                <Link 
                  href={feature.link}
                  className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-700 transition-colors text-sm sm:text-base"
                >
                  Learn More
                  <ArrowRight className="ml-2 h-3 w-3 sm:h-4 sm:w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-orange-600 via-blue-600 to-green-600 relative overflow-hidden rounded-b-2xl">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute top-10 left-10">
          <img src="/oc4.png" alt="Oggy" className="w-24 h-24 floating-element opacity-30" />
        </div>
        <div className="absolute bottom-10 right-10">
          <img src="/oc5.png" alt="Oggy" className="w-32 h-32 wiggling-element opacity-30" />
        </div>
        
        <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Join Oggy's Adventure?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Connect your wallet and start your DeFi journey with the most entertaining and rewarding platform on Solana!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/dashboard"
              className="group inline-flex items-center px-8 py-4 bg-white text-gray-900 rounded-full hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl font-semibold"
            >
              <Wallet className="mr-2 h-5 w-5" />
              Connect Wallet
              <Star className="ml-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
            </Link>
            
            <Link
              href="/banking"
              className="group inline-flex items-center px-8 py-4 bg-transparent border-2 border-white text-white rounded-full hover:bg-white hover:text-gray-900 transform hover:scale-105 transition-all duration-300 font-semibold"
            >
              <Globe className="mr-2 h-5 w-5" />
              Explore Banking
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
