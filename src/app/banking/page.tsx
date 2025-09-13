'use client'

import { BankingVestingFeature } from '@/components/banking-vesting/banking-vesting-feature'
import { WorkingTransactionTest } from '@/components/banking-vesting/working-transaction-test'
import { NetworkSelector } from '@/components/network-selector'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function BankingPage() {
  return (
    <div className="container mx-auto py-8">
      <Tabs defaultValue="main" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="main">Banking & Vesting Platform</TabsTrigger>
          <TabsTrigger value="test">Working Transactions Test</TabsTrigger>
          <TabsTrigger value="network">Network Configuration</TabsTrigger>
        </TabsList>
        
        <TabsContent value="main" className="mt-6">
          <BankingVestingFeature />
        </TabsContent>
        
        <TabsContent value="test" className="mt-6">
          <WorkingTransactionTest />
        </TabsContent>
        
        <TabsContent value="network" className="mt-6">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Network Configuration</h2>
            <NetworkSelector />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
    