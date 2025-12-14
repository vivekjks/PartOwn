'use client'

import { useState } from 'react'
import { useAccount } from 'wagmi'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownLeft, 
  History, 
  RefreshCw,
  Download,
  ExternalLink,
  CreditCard,
  TrendingUp
} from 'lucide-react'
import { format } from 'date-fns'

export default function PaymentsPage() {
  const { isConnected, address } = useAccount()
  const [depositAmount, setDepositAmount] = useState('')

  const handleDeposit = async () => {
    if (!depositAmount) return
    toast.loading('Processing deposit...')
    await new Promise(r => setTimeout(r, 2000))
    toast.dismiss()
    toast.success(`Deposited ${depositAmount} USDC`)
    setDepositAmount('')
  }

  const handleWithdraw = async () => {
    toast.loading('Processing withdrawal...')
    await new Promise(r => setTimeout(r, 2000))
    toast.dismiss()
    toast.success('Withdrawal successful')
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <Wallet className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-bold mb-2">Connect Your Wallet</h2>
            <p className="text-muted-foreground">Connect your wallet to manage payments</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-5xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Payments & Finance</h1>

        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">USDC Balance</p>
                <CreditCard className="w-5 h-5 text-muted-foreground" />
              </div>
              <p className="text-3xl font-bold">$1,250.00</p>
              <p className="text-sm text-muted-foreground">Available for deposits</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">Locked Deposits</p>
                <Wallet className="w-5 h-5 text-muted-foreground" />
              </div>
              <p className="text-3xl font-bold">$150.00</p>
              <p className="text-sm text-muted-foreground">3 active bookings</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">Total Earnings</p>
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
              <p className="text-3xl font-bold text-green-500">$847.50</p>
              <p className="text-sm text-muted-foreground">All time</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="transactions" className="space-y-6">
          <TabsList>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="deposit">Deposit</TabsTrigger>
            <TabsTrigger value="payouts">Payouts</TabsTrigger>
          </TabsList>

          <TabsContent value="transactions">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Transaction History</CardTitle>
                <Button variant="outline" size="sm" className="gap-2">
                  <Download className="w-4 h-4" /> Export CSV
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { type: 'payout', amount: '+$42.50', desc: 'Rental payout - Camera Kit', date: new Date(), hash: '0x1234...' },
                    { type: 'deposit_return', amount: '+$50.00', desc: 'Deposit returned - Camera Kit', date: new Date(Date.now() - 86400000), hash: '0xabcd...' },
                    { type: 'deposit', amount: '-$50.00', desc: 'Booking deposit - Drone', date: new Date(Date.now() - 86400000 * 2), hash: '0x5678...' },
                    { type: 'shares', amount: '-$500.00', desc: 'Purchased 50 shares - PS5 Setup', date: new Date(Date.now() - 86400000 * 5), hash: '0xefgh...' },
                    { type: 'payout', amount: '+$85.00', desc: 'Rental payout - Camera Kit', date: new Date(Date.now() - 86400000 * 7), hash: '0x9012...' },
                  ].map((tx, idx) => (
                    <div key={idx} className="flex items-center gap-4 p-4 border border-border rounded-lg">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        tx.amount.startsWith('+') ? 'bg-green-500/10' : 'bg-red-500/10'
                      }`}>
                        {tx.amount.startsWith('+') ? (
                          <ArrowDownLeft className="w-5 h-5 text-green-500" />
                        ) : (
                          <ArrowUpRight className="w-5 h-5 text-red-500" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{tx.desc}</p>
                        <p className="text-sm text-muted-foreground">{format(tx.date, 'MMM d, yyyy')}</p>
                      </div>
                      <div className="text-right">
                        <p className={`font-semibold ${tx.amount.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                          {tx.amount}
                        </p>
                        <a 
                          href={`https://amoy.polygonscan.com/tx/${tx.hash}`} 
                          target="_blank" 
                          rel="noopener"
                          className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1"
                        >
                          {tx.hash} <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="deposit">
            <Card>
              <CardHeader>
                <CardTitle>Top Up USDC</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 bg-secondary rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Your Wallet</p>
                  <p className="font-mono">{address}</p>
                </div>

                <div className="space-y-2">
                  <Label>Amount (USDC)</Label>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                  />
                  <div className="flex gap-2 mt-2">
                    {[50, 100, 250, 500].map((amt) => (
                      <Button key={amt} variant="outline" size="sm" onClick={() => setDepositAmount(String(amt))}>
                        ${amt}
                      </Button>
                    ))}
                  </div>
                </div>

                <Button onClick={handleDeposit} className="w-full" disabled={!depositAmount}>
                  Deposit USDC
                </Button>

                <div className="p-4 border border-border rounded-lg text-sm">
                  <p className="font-medium mb-2">Get Testnet USDC</p>
                  <p className="text-muted-foreground mb-2">
                    For testing, you can get USDC from the Polygon Amoy faucet.
                  </p>
                  <Button variant="outline" size="sm" asChild>
                    <a href="https://faucet.polygon.technology/" target="_blank" rel="noopener">
                      Open Faucet <ExternalLink className="w-4 h-4 ml-2" />
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payouts">
            <Card>
              <CardHeader>
                <CardTitle>Claimable Payouts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { pool: 'Sony A7 IV Camera Kit', amount: 42.50, shares: 150 },
                  { pool: 'DJI Mavic 3 Pro Drone', amount: 65.00, shares: 80 },
                  { pool: 'Electric Mountain Bike', amount: 20.00, shares: 45 },
                ].map((payout, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div>
                      <p className="font-medium">{payout.pool}</p>
                      <p className="text-sm text-muted-foreground">{payout.shares} shares</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-green-500">${payout.amount.toFixed(2)}</p>
                      <Button size="sm" variant="outline" className="mt-1">Claim</Button>
                    </div>
                  </div>
                ))}

                <div className="pt-4 border-t border-border">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-lg font-semibold">Total Claimable</span>
                    <span className="text-2xl font-bold text-green-500">$127.50</span>
                  </div>
                  <Button onClick={handleWithdraw} className="w-full">
                    Claim All Payouts
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
