'use client'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Menu, X } from 'lucide-react'
import { ThemeSelect } from '@/components/theme-select'
import { ClusterUiSelect } from './cluster/cluster-ui'
import { WalletButton } from '@/components/solana/solana-provider'

export function AppHeader({ links = [] }: { links: { label: string; path: string }[] }) {
  const pathname = usePathname()
  const [showMenu, setShowMenu] = useState(false)

  function isActive(path: string) {
    return path === '/' ? pathname === '/' : pathname.startsWith(path)
  }

  return (
    <header className="relative z-50 px-4 py-4 bg-gradient-to-r from-orange-50 via-blue-50 to-green-50 dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900 border-b-2 border-orange-200 dark:border-neutral-700 shadow-lg">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link className="flex items-center gap-3 hover:scale-105 transition-transform duration-300" href="/">
            <img 
              src="/oc6.png" 
              alt="Oggy Bank Logo" 
              className="w-12 h-12 rounded-full shadow-lg bg-white p-1 border-2 border-orange-300"
            />
            <div className="flex flex-col">
              <span className="text-2xl font-bold bg-gradient-to-r from-orange-500 via-blue-500 to-green-500 bg-clip-text text-transparent">
                Oggy Bank
              </span>
              <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                Powered by Solana
              </span>
            </div>
          </Link>
          <div className="hidden md:flex items-center ml-8">
            <ul className="flex gap-6 flex-nowrap items-center">
              {links.map(({ label, path }) => (
                <li key={path}>
                  <Link
                    className={`px-4 py-2 rounded-full font-semibold transition-all duration-300 hover:scale-105 ${
                      isActive(path) 
                        ? 'bg-gradient-to-r from-orange-400 to-blue-500 text-white shadow-lg' 
                        : 'text-gray-700 dark:text-gray-300 hover:bg-orange-100 dark:hover:bg-neutral-700 hover:text-orange-600 dark:hover:text-orange-400'
                    }`}
                    href={path}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden p-2 rounded-full bg-white dark:bg-neutral-800 shadow-lg border-2 border-orange-200 dark:border-neutral-600 hover:border-orange-400 dark:hover:border-orange-400 transition-all duration-300" 
          onClick={() => setShowMenu(!showMenu)}
        >
          {showMenu ? <X className="h-6 w-6 text-orange-600" /> : <Menu className="h-6 w-6 text-orange-600" />}
        </Button>

        <div className="hidden md:flex items-center gap-4">
          <div className="flex items-center gap-3">
            <WalletButton />
            <ClusterUiSelect />
            <ThemeSelect />
          </div>
        </div>

        {showMenu && (
          <div className="md:hidden fixed inset-x-0 top-[84px] bottom-0 bg-gradient-to-br from-orange-50/95 via-blue-50/95 to-green-50/95 dark:from-neutral-900/95 dark:via-neutral-800/95 dark:to-neutral-900/95 backdrop-blur-md border-t-2 border-orange-200 dark:border-neutral-700">
            <div className="flex flex-col p-6 gap-6">
              <div className="flex items-center justify-center mb-4">
                <img 
                  src="/oc1.png" 
                  alt="Oggy Welcome" 
                  className="w-20 h-20 rounded-full shadow-xl bg-white p-2 border-3 border-orange-300 animate-bounce"
                />
              </div>
              <ul className="flex flex-col gap-4">
                {links.map(({ label, path }) => (
                  <li key={path}>
                    <Link
                      className={`flex items-center gap-3 px-6 py-3 rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-105 ${
                        isActive(path) 
                          ? 'bg-gradient-to-r from-orange-400 to-blue-500 text-white shadow-lg' 
                          : 'text-gray-700 dark:text-gray-300 hover:bg-white/70 dark:hover:bg-neutral-700/70 hover:text-orange-600 dark:hover:text-orange-400'
                      }`}
                      href={path}
                      onClick={() => setShowMenu(false)}
                    >
                      <span className="text-2xl">
                        {label === 'Home' && '🏠'}
                        {label === 'Banking' && '🏦'}
                        {label === 'Vesting' && '⏰'}
                        {label === 'Staking' && '💰'}
                        {label === 'Governance' && '🗳️'}
                        {label === 'Dashboard' && '📊'}
                        {label === 'Account' && '👤'}
                      </span>
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="flex flex-col gap-4 pt-4 border-t-2 border-orange-200 dark:border-neutral-700">
                <WalletButton />
                <ClusterUiSelect />
                <ThemeSelect />
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
