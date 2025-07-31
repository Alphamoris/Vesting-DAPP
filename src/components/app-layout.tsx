'use client'

import { ReactNode, useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Wallet, Bell, Settings, LogOut } from 'lucide-react'
import { WalletButton } from '@/components/solana/solana-provider'
import { ConnectionStatus } from '@/components/ui/error-boundary'

interface AppLayoutProps {
  children: ReactNode
  links?: { label: string; path: string }[]
}

export function AppLayout({ children, links = [] }: AppLayoutProps) {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const notificationRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false)
      }
    }

    if (showNotifications) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showNotifications])

  return (
    <div className="min-h-screen page-background">
      <ConnectionStatus />
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-5 left-5 sm:top-10 sm:left-10 w-20 h-20 sm:w-32 sm:h-32 opacity-30">
          <img src="/oc2.png" alt="Floating Oggy" className="w-full h-full object-contain animate-bounce" />
        </div>
        <div className="absolute top-10 right-10 sm:top-20 sm:right-20 w-16 h-16 sm:w-24 sm:h-24 opacity-25">
          <img src="/oc3.png" alt="Happy Oggy" className="w-full h-full object-contain" />
        </div>
        <div className="absolute bottom-10 left-10 sm:bottom-20 sm:left-20 w-18 h-18 sm:w-28 sm:h-28 opacity-30">
          <img src="/oc4.png" alt="Dancing Oggy" className="w-full h-full object-contain" />
        </div>
        <div className="absolute bottom-5 right-5 sm:bottom-10 sm:right-10 w-12 h-12 sm:w-20 sm:h-20 opacity-35">
          <img src="/oc5.png" alt="Cheerful Oggy" className="w-full h-full object-contain" />
        </div>
      </div>
      
      <header className="relative z-50 bg-white/95 backdrop-blur-md border-b border-orange-200 shadow-lg sticky top-0">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2 sm:space-x-3 hover:scale-105 transition-transform duration-300">
              <div className="relative">
                <img 
                  src="/oc6.png" 
                  alt="Oggy Bank Logo" 
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full shadow-lg bg-gradient-to-br from-orange-100 to-blue-100 p-1 border-2 border-orange-300"
                />
                <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 sm:w-5 sm:h-5 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">✨</span>
                </div>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-orange-500 via-blue-500 to-green-500 bg-clip-text text-transparent">
                  Oggy Bank
                </h1>
                <p className="text-xs sm:text-sm text-gray-600 font-medium">
                  🚀 Solana DeFi 🎉
                </p>
              </div>
            </Link>

            <nav className="hidden lg:flex space-x-1 xl:space-x-2">
              {links.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  className={`px-3 xl:px-4 py-2 rounded-lg font-medium text-xs xl:text-sm transition-all duration-300 hover:scale-105 ${
                    pathname === link.path
                      ? 'bg-gradient-to-r from-orange-400 via-blue-500 to-green-500 text-white shadow-lg'
                      : 'bg-white/70 text-gray-700 hover:bg-gradient-to-r hover:from-orange-100 hover:to-blue-100 hover:text-orange-600 border border-orange-200 hover:border-orange-400'
                  }`}
                >
                  <span className="mr-1 text-sm">
                    {link.label.includes('🏠') && '🏠'}
                    {link.label.includes('🏦') && '🏦'}
                    {link.label.includes('💎') && '⏰'}
                    {link.label.includes('💰') && '💰'}
                    {link.label.includes('🏛️') && '🗳️'}
                    {link.label.includes('📊') && '📊'}
                    {link.label.includes('👤') && '👤'}
                  </span>
                  {link.label.split(' ')[1] || link.label.replace(/🏠|🏦|💎|💰|🏛️|📊|👤/g, '').trim()}
                </Link>
              ))}
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              {/* Notifications */}
              <div className="relative" ref={notificationRef}>
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 rounded-lg bg-white border border-orange-300 hover:border-orange-400 transition-all duration-300 shadow-sm hover:shadow-md"
                >
                  <Bell className="w-4 h-4 text-orange-600" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">!</span>
                  </span>
                </button>
                
                {showNotifications && (
                  <div className="absolute right-0 left-0 sm:left-auto sm:right-0 mt-3 w-screen max-w-xs sm:max-w-sm md:w-80 lg:w-96 bg-white border border-orange-200 rounded-xl shadow-xl z-50 overflow-hidden mx-3 sm:mx-0">
                    <div className="bg-gradient-to-r from-orange-100 to-blue-100 p-3 border-b border-orange-200">
                      <div className="flex items-center gap-3">
                        <img src="/oc1.png" alt="Oggy Notification" className="w-6 h-6 rounded-full" />
                        <h3 className="font-bold text-gray-800 text-sm">📢 Oggy's Updates!</h3>
                      </div>
                    </div>
                    <div className="p-3 space-y-2 max-h-64 overflow-y-auto">
                      <div className="p-2 bg-green-50 rounded-lg border-l-4 border-green-400">
                        <p className="text-xs font-medium text-gray-800">🎉 Welcome to Oggy Bank!</p>
                        <p className="text-xs text-gray-600">Your DeFi adventure starts here!</p>
                      </div>
                      <div className="p-2 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                        <p className="text-xs font-medium text-gray-800">💰 New Staking Rewards Available</p>
                        <p className="text-xs text-gray-600">Earn up to 12% APY on your tokens!</p>
                      </div>
                      <div className="p-2 bg-purple-50 rounded-lg border-l-4 border-purple-400">
                        <p className="text-xs font-medium text-gray-800">🚀 Token Vesting Schedule Updated</p>
                        <p className="text-xs text-gray-600">Check your dashboard for details</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Wallet Connection */}
              <div className="wallet-container">
                <WalletButton />
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg bg-white border border-orange-300 hover:border-orange-400 transition-all duration-300 shadow-sm"
              >
                {isMobileMenuOpen ? 
                  <X className="w-4 h-4 text-orange-600" /> : 
                  <Menu className="w-4 h-4 text-orange-600" />
                }
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-md border-t border-orange-200 shadow-lg">
            <div className="px-4 py-4 space-y-1">
              <div className="flex items-center justify-center mb-4">
                <img 
                  src="/oc1.png" 
                  alt="Mobile Menu Oggy" 
                  className="w-12 h-12 rounded-full shadow-md bg-white p-1 border border-orange-300"
                />
              </div>
              {links.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-300 ${
                    pathname === link.path
                      ? 'bg-gradient-to-r from-orange-400 via-blue-500 to-green-500 text-white shadow-md'
                      : 'text-gray-700 hover:bg-gradient-to-r hover:from-orange-100 hover:to-blue-100 hover:text-orange-600'
                  }`}
                >
                  <span className="text-lg">
                    {link.label.includes('🏠') && '🏠'}
                    {link.label.includes('🏦') && '🏦'}
                    {link.label.includes('💎') && '⏰'}
                    {link.label.includes('💰') && '💰'}
                    {link.label.includes('🏛️') && '🗳️'}
                    {link.label.includes('📊') && '📊'}
                    {link.label.includes('👤') && '👤'}
                  </span>
                  <span className="text-sm">{link.label.split(' ')[1] || link.label.replace(/🏠|🏦|💎|💰|🏛️|📊|👤/g, '').trim()}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
        <div className="min-h-[80vh]">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 mt-16 bg-gradient-to-r from-white via-orange-50 to-blue-50 border-t border-orange-300 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="col-span-1 md:col-span-2 lg:col-span-1">
              <div className="flex items-center space-x-3 mb-4">
                <img src="/oc6.png" alt="Footer Logo" className="w-8 h-8 rounded-full shadow-md" />
                <img src="/oc1.png" alt="Happy Oggy" className="w-6 h-6 rounded-full" />
                <img src="/oc2.png" alt="Excited Oggy" className="w-6 h-6 rounded-full" />
                <img src="/oc3.png" alt="Dancing Oggy" className="w-6 h-6 rounded-full" />
              </div>
              <h3 className="text-lg font-bold bg-gradient-to-r from-orange-500 via-blue-500 to-green-500 bg-clip-text text-transparent mb-2">
                🏦 Oggy Banking & Vesting Platform
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                The most fun and secure DeFi banking platform on Solana! 🚀<br/>
                Join Oggy in his financial adventures! 🐱💰✨
              </p>
            </div>
            
            <div>
              <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2 text-sm">
                <span className="text-lg">🏦</span>
                Services
              </h4>
              <ul className="space-y-2 text-xs text-gray-600">
                <li className="flex items-center gap-2 hover:text-orange-600 transition-colors cursor-pointer">
                  <span>⏰</span> Token Vesting
                </li>
                <li className="flex items-center gap-2 hover:text-orange-600 transition-colors cursor-pointer">
                  <span>🏛️</span> Banking Services
                </li>
                <li className="flex items-center gap-2 hover:text-orange-600 transition-colors cursor-pointer">
                  <span>📈</span> Staking & Yields
                </li>
                <li className="flex items-center gap-2 hover:text-orange-600 transition-colors cursor-pointer">
                  <span>🤝</span> Lending & Borrowing
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2 text-sm">
                <span className="text-lg">🔗</span>
                Links
              </h4>
              <ul className="space-y-2 text-xs text-gray-600">
                <li className="flex items-center gap-2 hover:text-orange-600 transition-colors cursor-pointer">
                  <span>📚</span> Documentation
                </li>
                <li className="flex items-center gap-2 hover:text-orange-600 transition-colors cursor-pointer">
                  <span>🛡️</span> Security
                </li>
                <li className="flex items-center gap-2 hover:text-orange-600 transition-colors cursor-pointer">
                  <span>👥</span> Community
                </li>
                <li className="flex items-center gap-2 hover:text-orange-600 transition-colors cursor-pointer">
                  <span>🆘</span> Support
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2 text-sm">
                <span className="text-lg">👨‍💻</span>
                About the Builder
              </h4>
              <div className="mb-3 p-3 bg-gradient-to-r from-orange-100 via-blue-100 to-green-100 rounded-lg border border-orange-200 shadow-sm">
                <p className="text-lg font-black bg-gradient-to-r from-orange-600 via-blue-600 to-green-600 bg-clip-text text-transparent mb-1 tracking-wide">
                  ALPHAMORIS
                </p>
                <p className="text-sm font-semibold text-gray-700 italic">
                  ✨ Infinite Possibilities ✨
                </p>
              </div>
              <ul className="space-y-2 text-xs text-gray-600">
                <li>
                  <a 
                    href="https://github.com/Alphamoris" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 hover:text-orange-600 transition-colors"
                  >
                    <span>🐙</span> GitHub
                  </a>
                </li>
                <li>
                  <a 
                    href="https://www.linkedin.com/in/alphamoris" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 hover:text-orange-600 transition-colors"
                  >
                    <span>💼</span> LinkedIn
                  </a>
                </li>
                <li>
                  <a 
                    href="https://dhanush45portfolio.framer.website" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 hover:text-orange-600 transition-colors"
                  >
                    <span>🌐</span> Portfolio
                  </a>
                </li>
                <li>
                  <a 
                    href="https://x.com/@_Alpha_45" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 hover:text-orange-600 transition-colors"
                  >
                    <span>🐦</span> X (Twitter)
                  </a>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-orange-200 text-center">
            <div className="flex items-center justify-center gap-3 mb-3">
              <img src="/oc4.png" alt="Waving Oggy" className="w-6 h-6 rounded-full" />
              <img src="/oc5.png" alt="Cheerful Oggy" className="w-6 h-6 rounded-full" />
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">
              © 2024 Oggy Banking Platform • Built with ❤️ on Solana 🚀<br/>
              <span className="text-orange-600 font-medium">
                Keep calm and let Oggy manage your DeFi! 🐱✨
              </span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}