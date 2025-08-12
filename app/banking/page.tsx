'use client'

import { BankingVestingFeature } from '@/components/banking-vesting/banking-vesting-feature'
import { WorkingTransactionTest } from '@/components/banking-vesting/working-transaction-test'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function BankingPage() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-orange-600 via-blue-600 to-green-600 bg-clip-text text-transparent mb-2">
          Banking & DeFi Operations
        </h1>
        <p className="text-sm sm:text-base text-gray-600 max-w-2xl">
          Manage your DeFi banking operations and test transactions. Network settings are available in the navbar.
        </p>
      </div>
      
      <Tabs defaultValue="main" className="w-full">
        <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-0 h-auto sm:h-10">
          <TabsTrigger value="main" className="text-xs sm:text-sm p-2 sm:p-3">
            Banking & Vesting Platform
          </TabsTrigger>
          <TabsTrigger value="test" className="text-xs sm:text-sm p-2 sm:p-3">
            Working Transactions Test
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="main" className="mt-6">
          <BankingVestingFeature />
        </TabsContent>
        
        <TabsContent value="test" className="mt-6">
          <WorkingTransactionTest />
        </TabsContent>
      </Tabs>
    </div>
  )
}
    