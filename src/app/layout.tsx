import type { Metadata } from 'next'
import './globals.css'
import { AppProviders } from '@/components/app-providers'
import { AppLayout } from '@/components/app-layout'
import React from 'react'

export const metadata: Metadata = {
  title: 'Solana DeFi',
  description: 'The most fun and secure banking & vesting platform on Solana, inspired by Oggy and the Cockroaches',
  keywords: ['Solana', 'DeFi', 'Banking', 'Vesting', 'Oggy', 'Cockroaches', 'Crypto'],
}

const links: { label: string; path: string }[] = [
  { label: '📊 Dashboard', path: '/dashboard' },
  { label: '🏦 Banking', path: '/banking' },
  { label: '💎 Vesting', path: '/vesting' },
  { label: '💰 Staking', path: '/staking' },
  { label: '🏛️ Governance', path: '/governance' },
  { label: '👤 Account', path: '/account' },
]

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="scrollbar-custom">
        <AppProviders>
          <AppLayout links={links}>{children}</AppLayout>
        </AppProviders>
      </body>
    </html>
  )
}
// Patch BigInt so we can log it using JSON.stringify without any errors
declare global {
  interface BigInt {
    toJSON(): string
  }
}

BigInt.prototype.toJSON = function () {
  return this.toString()
}
