'use client'

import { useState } from 'react'
import { PublicKey } from '@solana/web3.js'
import { useWallet } from '@solana/wallet-adapter-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AlertCircle, CheckCircle, Loader2 } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useBankingVestingTransactions } from './hooks/use-working-transactions'

export function WorkingTransactionTest() {
  const { publicKey, connected } = useWallet()
  const transactions = useBankingVestingTransactions()
  
  // Form states
  const [companyName, setCompanyName] = useState('Test Company')
  const [companySymbol, setCompanySymbol] = useState('TST')
  const [companySupply, setCompanySupply] = useState('1000000')
  const [depositAmount, setDepositAmount] = useState('0.1')
  const [withdrawAmount, setWithdrawAmount] = useState('0.05')
  const [stakeAmount, setStakeAmount] = useState('100')
  
  // Test results
  const [testResults, setTestResults] = useState<{
    [key: string]: { success: boolean; signature?: string; error?: string }
  }>({})

  const runTest = async (testName: string, testFn: () => Promise<string>) => {
    try {
      const signature = await testFn()
      setTestResults(prev => ({
        ...prev,
        [testName]: { success: true, signature }
      }))
    } catch (error: any) {
      setTestResults(prev => ({
        ...prev,
        [testName]: { success: false, error: error.message }
      }))
    }
  }

  const runAllTests = async () => {
    if (!connected || !publicKey) {
      alert('Please connect your wallet first!')
      return
    }

    // Clear previous results
    setTestResults({})

    // Test 1: Initialize Platform
    await runTest('Initialize Platform', () =>
      transactions.initializePlatform({
        admin: new PublicKey("11111111111111111111111111111111"),
        treasuryThreshold: 100,
      })
    )

    // Test 2: Create Company
    await runTest('Create Company', () =>
      transactions.createCompany({
        name: companyName,
        symbol: companySymbol,
        totalSupply: parseInt(companySupply),
      })
    )

    // Test 3: Deposit Funds
    await runTest('Deposit Funds', () =>
      transactions.depositFunds({
        amount: parseFloat(depositAmount),
      })
    )

    // Test 4: Stake Tokens
    await runTest('Stake Tokens', () =>
      transactions.stakeTokens({
        amount: parseInt(stakeAmount),
      })
    )

    // Test 5: Withdraw Funds
    await runTest('Withdraw Funds', () =>
      transactions.withdrawFunds({
        amount: parseFloat(withdrawAmount),
      })
    )
  }

  if (!connected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Transaction Testing Interface</CardTitle>
          <CardDescription>Connect your wallet to test transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Please connect your Solana wallet to test the transaction functionality.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>🧪 Working Transaction Test Interface</CardTitle>
          <CardDescription>
            This interface demonstrates working Solana transactions using the same pattern as the accounts section.
            All transactions are executed on-chain and confirmed.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Badge variant="outline" className="mb-2">Connected Wallet</Badge>
              <p className="text-sm font-mono">{publicKey?.toString()}</p>
            </div>
            <div>
              <Badge variant="outline" className="mb-2">Transaction Status</Badge>
              <p className="text-sm">Ready to execute transactions</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="individual" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="individual">Individual Tests</TabsTrigger>
          <TabsTrigger value="batch">Batch Test</TabsTrigger>
        </TabsList>

        <TabsContent value="individual" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Initialize Platform Test */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Initialize Platform</CardTitle>
                <CardDescription>Ensure you have enough funds or else airdrop yourself in the accounts section</CardDescription>
                <CardDescription>Test platform initialization</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  onClick={() => runTest('Initialize Platform', () =>
                    transactions.initializePlatform({
                      admin: new PublicKey("11111111111111111111111111111111"),
                      treasuryThreshold: 100,
                    })
                  )}
                  disabled={transactions.isInitializingPlatform}
                  className="w-full"
                >
                  {transactions.isInitializingPlatform ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Testing...
                    </>
                  ) : (
                    'Test Initialize'
                  )}
                </Button>
                {testResults['Initialize Platform'] && (
                  <TestResult result={testResults['Initialize Platform']} />
                )}
              </CardContent>
            </Card>

            {/* Create Company Test */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Create Company</CardTitle>
                <CardDescription>Test company creation</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  placeholder="Company Name"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                />
                <Input
                  placeholder="Symbol"
                  value={companySymbol}
                  onChange={(e) => setCompanySymbol(e.target.value)}
                />
                <Input
                  placeholder="Total Supply"
                  type="number"
                  value={companySupply}
                  onChange={(e) => setCompanySupply(e.target.value)}
                />
                <Button
                  onClick={() => runTest('Create Company', () =>
                    transactions.createCompany({
                      name: companyName,
                      symbol: companySymbol,
                      totalSupply: parseInt(companySupply),
                    })
                  )}
                  disabled={transactions.isCreatingCompany}
                  className="w-full"
                >
                  {transactions.isCreatingCompany ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Testing...
                    </>
                  ) : (
                    'Test Create Company'
                  )}
                </Button>
                {testResults['Create Company'] && (
                  <TestResult result={testResults['Create Company']} />
                )}
              </CardContent>
            </Card>

            {/* Deposit Funds Test */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Deposit Funds</CardTitle>
                <CardDescription>Test fund deposits</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  placeholder="Amount (SOL)"
                  type="number"
                  step="0.01"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                />
                <Button
                  onClick={() => runTest('Deposit Funds', () =>
                    transactions.depositFunds({
                      amount: parseFloat(depositAmount),
                    })
                  )}
                  disabled={transactions.isDepositingFunds}
                  className="w-full"
                >
                  {transactions.isDepositingFunds ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Testing...
                    </>
                  ) : (
                    'Test Deposit'
                  )}
                </Button>
                {testResults['Deposit Funds'] && (
                  <TestResult result={testResults['Deposit Funds']} />
                )}
              </CardContent>
            </Card>

            {/* Stake Tokens Test */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Stake Tokens</CardTitle>
                <CardDescription>Test token staking</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  placeholder="Amount"
                  type="number"
                  value={stakeAmount}
                  onChange={(e) => setStakeAmount(e.target.value)}
                />
                <Button
                  onClick={() => runTest('Stake Tokens', () =>
                    transactions.stakeTokens({
                      amount: parseInt(stakeAmount),
                    })
                  )}
                  disabled={transactions.isStakingTokens}
                  className="w-full"
                >
                  {transactions.isStakingTokens ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Testing...
                    </>
                  ) : (
                    'Test Stake'
                  )}
                </Button>
                {testResults['Stake Tokens'] && (
                  <TestResult result={testResults['Stake Tokens']} />
                )}
              </CardContent>
            </Card>

            {/* Withdraw Funds Test */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Withdraw Funds</CardTitle>
                <CardDescription>Test fund withdrawals</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  placeholder="Amount (SOL)"
                  type="number"
                  step="0.01"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                />
                <Button
                  onClick={() => runTest('Withdraw Funds', () =>
                    transactions.withdrawFunds({
                      amount: parseFloat(withdrawAmount),
                    })
                  )}
                  disabled={transactions.isWithdrawingFunds}
                  className="w-full"
                >
                  {transactions.isWithdrawingFunds ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Testing...
                    </>
                  ) : (
                    'Test Withdraw'
                  )}
                </Button>
                {testResults['Withdraw Funds'] && (
                  <TestResult result={testResults['Withdraw Funds']} />
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="batch" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Comprehensive Transaction Test</CardTitle>
              <CardDescription>
                Run all transaction tests in sequence to verify the entire system works correctly.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={runAllTests}
                disabled={Object.values(transactions).some(val => typeof val === 'boolean' && val)}
                className="w-full"
                size="lg"
              >
                {Object.values(transactions).some(val => typeof val === 'boolean' && val) ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Running Tests...
                  </>
                ) : (
                  'Run All Transaction Tests'
                )}
              </Button>

              {Object.keys(testResults).length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">Test Results:</h3>
                  {Object.entries(testResults).map(([testName, result]) => (
                    <div key={testName} className="border rounded p-3">
                      <div className="flex items-center gap-2 mb-2">
                        {result.success ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-red-500" />
                        )}
                        <span className="font-medium">{testName}</span>
                        <Badge variant={result.success ? 'default' : 'destructive'}>
                          {result.success ? 'PASSED' : 'FAILED'}
                        </Badge>
                      </div>
                      {result.signature && (
                        <p className="text-xs font-mono text-muted-foreground">
                          Signature: {result.signature}
                        </p>
                      )}
                      {result.error && (
                        <p className="text-xs text-red-500">
                          Error: {result.error}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function TestResult({ result }: { 
  result: { success: boolean; signature?: string; error?: string } 
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        {result.success ? (
          <CheckCircle className="h-4 w-4 text-green-500" />
        ) : (
          <AlertCircle className="h-4 w-4 text-red-500" />
        )}
        <Badge variant={result.success ? 'default' : 'destructive'}>
          {result.success ? 'SUCCESS' : 'FAILED'}
        </Badge>
      </div>
      {result.signature && (
        <p className="text-xs font-mono">
          {result.signature.slice(0, 16)}...
        </p>
      )}
      {result.error && (
        <p className="text-xs text-red-500">
          {result.error}
        </p>
      )}
    </div>
  )
}
