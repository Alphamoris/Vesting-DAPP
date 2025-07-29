'use client'

import { ReactNode, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Wallet, Bell, Settings, LogOut } from 'lucide-react'
import { WalletButton } from '@/components/solana/solana-provider'

interface AppLayoutProps {
  children: ReactNode
  links?: { label: string; path: string }[]
}

export function AppLayout({ children, links = [] }: AppLayoutProps) {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)

  return (
    <div className="min-h-screen bg-hero-gradient dark:bg-dark-hero-gradient">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 w-32 h-32 opacity-30">
          <img src="/oc2.png" alt="Floating Oggy" className="w-full h-full object-contain animate-float-gentle" />
        </div>
        <div className="absolute top-20 right-20 w-24 h-24 opacity-25">
          <img src="/oc3.png" alt="Happy Oggy" className="w-full h-full object-contain animate-float-gentle" />
        </div>
        <div className="absolute bottom-20 left-20 w-28 h-28 opacity-30">
          <img src="/oc4.png" alt="Dancing Oggy" className="w-full h-full object-contain animate-float-gentle" />
        </div>
        <div className="absolute bottom-10 right-10 w-20 h-20 opacity-35">
          <img src="/oc5.png" alt="Cheerful Oggy" className="w-full h-full object-contain animate-float-gentle" />
        </div>
      </div>
      
      <header className="relative z-50 glass-strong border-b border-soft-gray-300 dark:border-charcoal-700 shadow-xl sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link href="/" className="flex items-center space-x-4 hover:scale-105 transition-transform duration-300">
              <div className="relative">
                <img 
                  src="/oc6.png" 
                  alt="Oggy Bank Logo" 
                  className="w-16 h-16 rounded-2xl shadow-xl bg-gradient-to-br from-light-blue to-soft-gray p-2 border-2 border-vibrant-blue-300 animate-float-gentle"
                />
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-success-gradient rounded-full flex items-center justify-center">
                  <span className="text-pure-white text-xs font-bold">✨</span>
                </div>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-headline-large font-playfair text-gradient-primary">
                  Oggy Bank
                </h1>
                <p className="text-label-medium text-charcoal-600 dark:text-soft-gray-400 font-inter">
                  🚀 Powered by Solana • DeFi Made Fun! 🎉
                </p>
              </div>
            </Link>

            <nav className="hidden lg:flex space-x-3">
              {links.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  className={`px-6 py-3 rounded-xl font-medium text-body-medium font-inter transition-all duration-300 hover:scale-105 shadow-lg ${
                    pathname === link.path
                      ? 'btn-primary'
                      : 'btn-secondary hover:bg-light-blue hover:text-vibrant-blue-700'
                  }`}
                >
                  <span className="mr-2 text-lg">
                    {link.label === 'Home' && '🏠'}
                    {link.label === 'Banking' && '🏦'}
                    {link.label === 'Vesting' && '⏰'}
                    {link.label === 'Staking' && '💰'}
                    {link.label === 'Governance' && '🗳️'}
                    {link.label === 'Dashboard' && '📊'}
                    {link.label === 'Account' && '👤'}
                  </span>
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-3 rounded-xl glass border border-soft-gray-300 dark:border-charcoal-600 hover:border-vibrant-blue-400 transition-all duration-300 shadow-lg hover:shadow-xl group"
                >
                  <Bell className="w-5 h-5 text-vibrant-blue group-hover:text-vibrant-blue-600" />
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-warning-gradient rounded-full flex items-center justify-center">
                    <span className="text-pure-white text-xs font-bold">!</span>
                  </span>
                </button>
                
                {showNotifications && (
                  <div className="absolute right-0 mt-3 w-96 card z-50">
                    <div className="card-header bg-primary-gradient text-pure-white">
                      <div className="flex items-center gap-3">
                        <img src="/oc1.png" alt="Oggy Notification" className="w-8 h-8 rounded-full" />
                        <h3 className="text-title-medium font-bold">📢 Oggy's Updates!</h3>
                      </div>
                    </div>
                    <div className="card-content space-y-3 max-h-80 overflow-y-auto scrollbar-modern">
                      <div className="p-3 bg-success-green-50 dark:bg-success-green-900/20 rounded-xl border-l-4 border-success-green">
                        <p className="text-body-medium font-medium text-charcoal dark:text-pure-white">🎉 Welcome to Oggy Bank!</p>
                        <p className="text-body-small text-charcoal-600 dark:text-soft-gray-400">Your DeFi adventure starts here!</p>
                      </div>
                      <div className="p-3 bg-vibrant-blue-50 dark:bg-vibrant-blue-900/20 rounded-xl border-l-4 border-vibrant-blue">
                        <p className="text-body-medium font-medium text-charcoal dark:text-pure-white">💰 New Staking Rewards Available</p>
                        <p className="text-body-small text-charcoal-600 dark:text-soft-gray-400">Earn up to 12% APY on your tokens!</p>
                      </div>
                      <div className="p-3 bg-warning-orange-50 dark:bg-warning-orange-900/20 rounded-xl border-l-4 border-warning-orange">
                        <p className="text-body-medium font-medium text-charcoal dark:text-pure-white">🚀 Token Vesting Schedule Updated</p>
                        <p className="text-body-small text-charcoal-600 dark:text-soft-gray-400">Check your dashboard for details</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Wallet Connection */}
              <div className="bg-primary-gradient p-0.5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="bg-pure-white dark:bg-deep-navy rounded-xl">
                  <WalletButton />
                </div>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-3 rounded-xl glass border border-soft-gray-300 dark:border-charcoal-600 hover:border-vibrant-blue-400 transition-all duration-300 shadow-lg"
              >
                {isMobileMenuOpen ? 
                  <X className="w-5 h-5 text-vibrant-blue" /> : 
                  <Menu className="w-5 h-5 text-vibrant-blue" />
                }
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 glass-strong border-t border-soft-gray-200 dark:border-charcoal-700 shadow-2xl">
            <div className="px-4 py-6 space-y-2">
              <div className="flex items-center justify-center mb-6">
                <img 
                  src="/oc1.png" 
                  alt="Mobile Menu Oggy" 
                  className="w-16 h-16 rounded-2xl shadow-lg bg-pure-white p-2 border-2 border-vibrant-blue-300 animate-float-gentle"
                />
              </div>
              {links.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-4 px-6 py-4 rounded-xl font-medium text-body-medium transition-all duration-300 hover:scale-105 ${
                    pathname === link.path
                      ? 'btn-primary'
                      : 'btn-ghost hover:bg-light-blue hover:text-vibrant-blue-700'
                  }`}
                >
                  <span className="text-2xl">
                    {link.label === 'Home' && '🏠'}
                    {link.label === 'Banking' && '🏦'}
                    {link.label === 'Vesting' && '⏰'}
                    {link.label === 'Staking' && '💰'}
                    {link.label === 'Governance' && '🗳️'}
                    {link.label === 'Dashboard' && '📊'}
                    {link.label === 'Account' && '👤'}
                  </span>
                  <span className="text-title-medium">{link.label}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="min-h-[80vh]">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 mt-20 bg-pure-white dark:bg-deep-navy border-t-4 border-vibrant-blue shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-4 mb-6">
                <img src="/oc6.png" alt="Footer Logo" className="w-12 h-12 rounded-2xl shadow-lg" />
                <img src="/oc1.png" alt="Happy Oggy" className="w-10 h-10 rounded-full animate-float-gentle" />
                <img src="/oc2.png" alt="Excited Oggy" className="w-10 h-10 rounded-full animate-float-gentle" />
                <img src="/oc3.png" alt="Dancing Oggy" className="w-10 h-10 rounded-full animate-float-gentle" />
              </div>
              <h3 className="text-headline-small font-manrope text-gradient-primary mb-3">
                🏦 Oggy Banking & Vesting Platform
              </h3>
              <p className="text-body-medium text-charcoal-600 dark:text-soft-gray-400 leading-relaxed">
                The most fun and secure DeFi banking platform on Solana! 🚀<br/>
                Join Oggy in his financial adventures while keeping those 
                pesky bugs away from your funds! Let's make DeFi simple and enjoyable! 🐱💰✨
              </p>
            </div>
            
            <div>
              <h4 className="text-title-large font-bold text-charcoal dark:text-pure-white mb-4 flex items-center gap-2">
                <span className="text-2xl">🏦</span>
                Services
              </h4>
              <ul className="space-y-3 text-body-medium text-charcoal-600 dark:text-soft-gray-400">
                <li className="flex items-center gap-2 hover:text-vibrant-blue dark:hover:text-vibrant-blue-400 transition-colors cursor-pointer">
                  <span>⏰</span> Token Vesting
                </li>
                <li className="flex items-center gap-2 hover:text-vibrant-blue dark:hover:text-vibrant-blue-400 transition-colors cursor-pointer">
                  <span>🏛️</span> Banking Services
                </li>
                <li className="flex items-center gap-2 hover:text-vibrant-blue dark:hover:text-vibrant-blue-400 transition-colors cursor-pointer">
                  <span>📈</span> Staking & Yields
                </li>
                <li className="flex items-center gap-2 hover:text-vibrant-blue dark:hover:text-vibrant-blue-400 transition-colors cursor-pointer">
                  <span>🤝</span> Lending & Borrowing
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-title-large font-bold text-charcoal dark:text-pure-white mb-4 flex items-center gap-2">
                <span className="text-2xl">🔗</span>
                Links
              </h4>
              <ul className="space-y-3 text-body-medium text-charcoal-600 dark:text-soft-gray-400">
                <li className="flex items-center gap-2 hover:text-vibrant-blue dark:hover:text-vibrant-blue-400 transition-colors cursor-pointer">
                  <span>📚</span> Documentation
                </li>
                <li className="flex items-center gap-2 hover:text-vibrant-blue dark:hover:text-vibrant-blue-400 transition-colors cursor-pointer">
                  <span>🛡️</span> Security
                </li>
                <li className="flex items-center gap-2 hover:text-vibrant-blue dark:hover:text-vibrant-blue-400 transition-colors cursor-pointer">
                  <span>👥</span> Community
                </li>
                <li className="flex items-center gap-2 hover:text-vibrant-blue dark:hover:text-vibrant-blue-400 transition-colors cursor-pointer">
                  <span>🆘</span> Support
                </li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t-2 border-soft-gray-200 dark:border-charcoal-700 text-center">
            <div className="flex items-center justify-center gap-4 mb-4">
              <img src="/oc4.png" alt="Waving Oggy" className="w-8 h-8 rounded-full animate-float-gentle" />
              <img src="/oc5.png" alt="Cheerful Oggy" className="w-8 h-8 rounded-full animate-float-gentle" />
            </div>
            <p className="text-body-small text-charcoal-500 dark:text-soft-gray-400 leading-relaxed">
              © 2024 Oggy Banking Platform • Built with ❤️ on Solana 🚀<br/>
              <span className="text-vibrant-blue dark:text-vibrant-blue-400 font-medium">
                Keep calm and let Oggy manage your DeFi! 🐱✨
              </span>
            </p>
          </div>
        </div>
      </footer>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-4">
        <div className="relative group">
          <img 
            src="/oc2.png" 
            alt="Help Oggy" 
            className="w-14 h-14 rounded-2xl shadow-2xl bg-primary-gradient p-1 cursor-pointer hover:scale-110 transition-all duration-300 animate-float-gentle border-2 border-pure-white"
            title="Need help? Click Oggy! 🐱💬"
          />
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-warning-gradient rounded-full flex items-center justify-center animate-pulse">
            <span className="text-pure-white text-xs font-bold">?</span>
          </div>
        </div>
        
        <div className="relative group">
          <img 
            src="/oc3.png" 
            alt="Notifications Oggy" 
            className="w-12 h-12 rounded-2xl shadow-xl bg-success-gradient p-1 cursor-pointer hover:scale-110 transition-all duration-300 animate-float-gentle border-2 border-pure-white"
            title="Latest updates from Oggy! 🔔"
          />
        </div>
      </div>
    </div>
  )
}
              </div>
              {links.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-4 px-6 py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105 ${
                    pathname === link.path
                      ? 'bg-gradient-to-r from-orange-400 via-blue-500 to-green-500 text-white shadow-xl'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-orange-100 hover:to-blue-100 dark:hover:from-neutral-700 dark:hover:to-neutral-600 hover:text-orange-600 dark:hover:text-orange-400'
                  }`}
                >
                  <span className="text-2xl">
                    {link.label === 'Home' && '🏠'}
                    {link.label === 'Banking' && '🏦'}
                    {link.label === 'Vesting' && '⏰'}
                    {link.label === 'Staking' && '💰'}
                    {link.label === 'Governance' && '🗳️'}
                    {link.label === 'Dashboard' && '📊'}
                    {link.label === 'Account' && '👤'}
                  </span>
                  <span className="text-lg">{link.label}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="min-h-[80vh]">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 mt-20 bg-gradient-to-r from-white via-orange-50 to-blue-50 dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900 border-t-4 border-orange-300 dark:border-neutral-700 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-4 mb-6">
                <img src="/oc6.png" alt="Footer Logo" className="w-12 h-12 rounded-full shadow-lg" />
                <img src="/oc1.png" alt="Happy Oggy" className="w-10 h-10 rounded-full bouncing-element" />
                <img src="/oc2.png" alt="Excited Oggy" className="w-10 h-10 rounded-full wiggling-element" />
                <img src="/oc3.png" alt="Dancing Oggy" className="w-10 h-10 rounded-full floating-element" />
              </div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-orange-500 via-blue-500 to-green-500 bg-clip-text text-transparent mb-3">
                🏦 Oggy Banking & Vesting Platform
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                The most fun and secure DeFi banking platform on Solana! 🚀<br/>
                Join Oggy in his financial adventures while keeping those 
                pesky bugs away from your funds! Let's make DeFi simple and enjoyable! 🐱💰✨
              </p>
            </div>
            
            <div>
              <h4 className="font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
                <span className="text-2xl">🏦</span>
                Services
              </h4>
              <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                <li className="flex items-center gap-2 hover:text-orange-600 dark:hover:text-orange-400 transition-colors cursor-pointer">
                  <span>⏰</span> Token Vesting
                </li>
                <li className="flex items-center gap-2 hover:text-orange-600 dark:hover:text-orange-400 transition-colors cursor-pointer">
                  <span>🏛️</span> Banking Services
                </li>
                <li className="flex items-center gap-2 hover:text-orange-600 dark:hover:text-orange-400 transition-colors cursor-pointer">
                  <span>📈</span> Staking & Yields
                </li>
                <li className="flex items-center gap-2 hover:text-orange-600 dark:hover:text-orange-400 transition-colors cursor-pointer">
                  <span>🤝</span> Lending & Borrowing
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
                <span className="text-2xl">🔗</span>
                Links
              </h4>
              <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                <li className="flex items-center gap-2 hover:text-orange-600 dark:hover:text-orange-400 transition-colors cursor-pointer">
                  <span>📚</span> Documentation
                </li>
                <li className="flex items-center gap-2 hover:text-orange-600 dark:hover:text-orange-400 transition-colors cursor-pointer">
                  <span>🛡️</span> Security
                </li>
                <li className="flex items-center gap-2 hover:text-orange-600 dark:hover:text-orange-400 transition-colors cursor-pointer">
                  <span>👥</span> Community
                </li>
                <li className="flex items-center gap-2 hover:text-orange-600 dark:hover:text-orange-400 transition-colors cursor-pointer">
                  <span>🆘</span> Support
                </li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t-2 border-orange-200 dark:border-neutral-700 text-center">
            <div className="flex items-center justify-center gap-4 mb-4">
              <img src="/oc4.png" alt="Waving Oggy" className="w-8 h-8 rounded-full floating-element" />
              <img src="/oc5.png" alt="Cheerful Oggy" className="w-8 h-8 rounded-full wiggling-element" />
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
              © 2024 Oggy Banking Platform • Built with ❤️ on Solana 🚀<br/>
              <span className="text-orange-600 dark:text-orange-400 font-medium">
                Keep calm and let Oggy manage your DeFi! 🐱✨
              </span>
            </p>
          </div>
        </div>
      </footer>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-4">
        <div className="relative group">
          <img 
            src="/oc2.png" 
            alt="Help Oggy" 
            className="w-14 h-14 rounded-full shadow-2xl bg-gradient-to-r from-orange-400 to-blue-500 p-1 cursor-pointer hover:scale-110 transition-all duration-300 floating-element border-3 border-white"
            title="Need help? Click Oggy! 🐱💬"
          />
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center animate-pulse">
            <span className="text-white text-xs font-bold">?</span>
          </div>
        </div>
        
        <div className="relative group">
          <img 
            src="/oc3.png" 
            alt="Notifications Oggy" 
            className="w-12 h-12 rounded-full shadow-xl bg-gradient-to-r from-green-400 to-blue-500 p-1 cursor-pointer hover:scale-110 transition-all duration-300 wiggling-element border-2 border-white"
            title="Latest updates from Oggy! 🔔"
          />
        </div>
      </div>
    </div>
  )
}