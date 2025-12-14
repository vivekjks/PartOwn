'use client'

import { useState, use, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useAccount, useWriteContract, useReadContract } from 'wagmi'
import { parseUnits } from 'viem'
import { toast } from 'sonner'
import { 
  ArrowLeft, 
  MapPin, 
  Users, 
  Calendar as CalendarIcon, 
  ExternalLink,
  Share2,
  Wallet,
  Clock,
  Shield,
  Vote,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Check,
  X
} from 'lucide-react'
import { motion } from 'framer-motion'
import { format, addDays } from 'date-fns'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Calendar } from '@/components/ui/calendar'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

const mockProposals: any[] = []

export default function PoolDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { isConnected, address } = useAccount()
  const { writeContractAsync } = useWriteContract()
  
  const [pool, setPool] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [sharesToBuy, setSharesToBuy] = useState(10)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [bookingDays, setBookingDays] = useState(1)

  useEffect(() => {
    async function fetchPool() {
      try {
        const res = await fetch(`/api/pools`)
        if (res.ok) {
          const data = await res.json()
          const foundPool = data.pools?.find((p: any) => p._id === id || p.id === id || p.address === id)
          if (foundPool) {
            setPool({
              ...foundPool,
              currentFunding: foundPool.currentFunding || 0
            })
          }
        }
      } catch (error) {
        console.error('Failed to fetch pool:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchPool()
  }, [id])
    
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading pool...</p>
        </div>
      </div>
    )
  }

  if (!pool) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Pool not found</h1>
          <Link href="/explore">
            <Button>Back to Explore</Button>
          </Link>
        </div>
      </div>
    )
  }

  const fundingPercent = (pool.currentFunding / (pool.totalShares * pool.sharePrice)) * 100
  const totalCost = sharesToBuy * pool.sharePrice
  const ownershipPercent = ((sharesToBuy / pool.totalShares) * 100).toFixed(2)

  const handleBuyShares = async () => {
    if (!isConnected) {
      toast.error('Please connect your wallet first')
      return
    }
    
    try {
      toast.loading('Approving USDC...')
      
      // Call API to process share purchase
      const res = await fetch(`/api/pools/${pool.address}/buy-shares`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          buyer: address,
          shares: sharesToBuy
        })
      })
      
      if (!res.ok) throw new Error('Failed to buy shares')
      
      toast.dismiss()
      toast.success(`Successfully purchased ${sharesToBuy} shares!`)
      
      // Refresh pool data
      const poolRes = await fetch(`/api/pools/${id}`)
      if (poolRes.ok) {
        const data = await poolRes.json()
        setPool(data)
      }
    } catch (error: any) {
      toast.dismiss()
      toast.error(error.message || 'Failed to buy shares')
    }
  }

  const handleBook = async () => {
    if (!isConnected || !selectedDate) {
      toast.error('Please connect your wallet and select a date')
      return
    }
    
    try {
      toast.loading('Creating booking...')
      
      const endDate = addDays(selectedDate, bookingDays)
      
      const res = await fetch('/api/bookings/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          poolId: pool.id,
          user: address,
          start: selectedDate.toISOString(),
          end: endDate.toISOString(),
          deposit: 50
        })
      })
      
      if (!res.ok) throw new Error('Failed to create booking')
      
      toast.dismiss()
      toast.success('Booking request submitted!')
    } catch (error: any) {
      toast.dismiss()
      toast.error(error.message || 'Failed to create booking')
    }
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4">
        <Button variant="ghost" asChild className="gap-2 mb-6">
          <Link href="/explore">
            <ArrowLeft className="w-4 h-4" /> Back to Explore
          </Link>
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="space-y-4">
              <div className="relative aspect-video rounded-xl overflow-hidden">
                <Image
                  src={pool.images[selectedImage]}
                  alt={pool.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-between px-4">
                  <Button 
                    size="icon" 
                    variant="secondary" 
                    className="rounded-full"
                    onClick={() => setSelectedImage(Math.max(0, selectedImage - 1))}
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </Button>
                  <Button 
                    size="icon" 
                    variant="secondary" 
                    className="rounded-full"
                    onClick={() => setSelectedImage(Math.min(pool.images.length - 1, selectedImage + 1))}
                  >
                    <ChevronRight className="w-5 h-5" />
                  </Button>
                </div>
                <Badge className="absolute top-4 right-4 bg-green-500/90">{pool.status}</Badge>
              </div>
              <div className="flex gap-2">
                {pool.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImage === idx ? 'border-primary' : 'border-transparent'
                    }`}
                  >
                    <Image src={img} alt="" fill className="object-cover" />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <Badge variant="secondary" className="mb-2">{pool.category}</Badge>
                  <h1 className="text-3xl font-bold">{pool.title}</h1>
                  <div className="flex items-center gap-4 mt-2 text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {pool.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {pool.members} members
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon">
                    <Share2 className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <a href={`https://amoy.polygonscan.com/address/${pool.address}`} target="_blank" rel="noopener">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Contract
                    </a>
                  </Button>
                </div>
              </div>
              <p className="text-muted-foreground">{pool.description}</p>
            </div>

            <Tabs defaultValue="calendar" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="calendar">Calendar</TabsTrigger>
                <TabsTrigger value="members">Members</TabsTrigger>
                <TabsTrigger value="proposals">Proposals</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
              </TabsList>

              <TabsContent value="calendar" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CalendarIcon className="w-5 h-5" />
                      Booking Calendar
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={setSelectedDate}
                          className="rounded-md border"
                        />
                      </div>
                      <div className="space-y-4">
                        <div className="p-4 bg-secondary rounded-lg">
                          <div className="flex items-center gap-2 mb-3">
                            <Sparkles className="w-5 h-5 text-primary" />
                            <span className="font-medium">AI Suggestion</span>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">
                            Based on your ownership and past bookings, we suggest:
                          </p>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm p-2 bg-primary/10 rounded">
                              <span>{format(addDays(new Date(), 3), 'MMM d')} - {format(addDays(new Date(), 5), 'MMM d')}</span>
                              <Badge variant="outline" className="text-xs">Weekend</Badge>
                            </div>
                            <div className="flex justify-between text-sm p-2 bg-muted rounded">
                              <span>{format(addDays(new Date(), 10), 'MMM d')} - {format(addDays(new Date(), 12), 'MMM d')}</span>
                              <Badge variant="outline" className="text-xs">Weekday</Badge>
                            </div>
                          </div>
                        </div>

                        {selectedDate && (
                          <div className="space-y-3">
                            <Label>Booking Duration</Label>
                            <div className="flex items-center gap-2">
                              <Button variant="outline" size="sm" onClick={() => setBookingDays(Math.max(1, bookingDays - 1))}>-</Button>
                              <span className="w-16 text-center">{bookingDays} day{bookingDays > 1 ? 's' : ''}</span>
                              <Button variant="outline" size="sm" onClick={() => setBookingDays(Math.min(3, bookingDays + 1))}>+</Button>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {format(selectedDate, 'MMM d')} - {format(addDays(selectedDate, bookingDays), 'MMM d, yyyy')}
                            </p>
                            <div className="p-3 bg-muted rounded-lg">
                              <div className="flex justify-between text-sm mb-1">
                                <span>Security Deposit</span>
                                <span>$50 USDC</span>
                              </div>
                              <p className="text-xs text-muted-foreground">Refundable if no damage</p>
                            </div>
                            <Button onClick={handleBook} className="w-full">
                              Request Booking
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="members" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Ownership Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { address: '0x1234...5678', shares: 250, pct: 25 },
                        { address: '0xabcd...efgh', shares: 200, pct: 20 },
                        { address: '0x9876...5432', shares: 150, pct: 15 },
                        { address: '0xfedc...ba98', shares: 100, pct: 10 },
                        { address: 'Others', shares: 300, pct: 30 },
                      ].map((member, idx) => (
                        <div key={idx} className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-medium">
                            {idx + 1}
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between mb-1">
                              <span className="font-mono text-sm">{member.address}</span>
                              <span className="text-sm">{member.shares} shares ({member.pct}%)</span>
                            </div>
                            <Progress value={member.pct} className="h-2" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="proposals" className="mt-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Active Proposals</CardTitle>
                    <Button size="sm">Create Proposal</Button>
                  </CardHeader>
                  <CardContent>
                    {mockProposals.length > 0 ? (
                      <div className="space-y-4">
                        {mockProposals.map((proposal) => (
                          <div key={proposal.id} className="p-4 border border-border rounded-lg">
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <Badge variant="outline" className="mb-2">{proposal.type}</Badge>
                                <h4 className="font-medium">{proposal.title}</h4>
                                <p className="text-sm text-muted-foreground">{proposal.description}</p>
                              </div>
                              <Badge className={proposal.status === 'active' ? 'bg-amber-500' : 'bg-green-500'}>
                                {proposal.status}
                              </Badge>
                            </div>
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span>For: {proposal.votesFor}</span>
                                <span>Against: {proposal.votesAgainst}</span>
                              </div>
                              <Progress value={(proposal.votesFor / (proposal.votesFor + proposal.votesAgainst)) * 100} className="h-2" />
                              <div className="flex gap-2 mt-3">
                                <Button size="sm" className="flex-1 gap-1">
                                  <Check className="w-4 h-4" /> Vote For
                                </Button>
                                <Button size="sm" variant="outline" className="flex-1 gap-1">
                                  <X className="w-4 h-4" /> Vote Against
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Vote className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                        <p className="text-muted-foreground">No active proposals</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="activity" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { type: 'booking', user: '0x1234...5678', action: 'completed booking', time: '2 hours ago' },
                        { type: 'shares', user: '0xabcd...efgh', action: 'purchased 50 shares', time: '1 day ago' },
                        { type: 'vote', user: '0x9876...5432', action: 'voted on repair proposal', time: '2 days ago' },
                        { type: 'payout', user: 'System', action: 'distributed $125 USDC to holders', time: '3 days ago' },
                      ].map((activity, idx) => (
                        <div key={idx} className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            activity.type === 'booking' ? 'bg-blue-500/20 text-blue-500' :
                            activity.type === 'shares' ? 'bg-green-500/20 text-green-500' :
                            activity.type === 'vote' ? 'bg-purple-500/20 text-purple-500' :
                            'bg-amber-500/20 text-amber-500'
                          }`}>
                            {activity.type === 'booking' ? <CalendarIcon className="w-5 h-5" /> :
                             activity.type === 'shares' ? <Wallet className="w-5 h-5" /> :
                             activity.type === 'vote' ? <Vote className="w-5 h-5" /> :
                             <Shield className="w-5 h-5" />}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm">
                              <span className="font-mono">{activity.user}</span> {activity.action}
                            </p>
                            <p className="text-xs text-muted-foreground">{activity.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-6">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Buy Shares</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Funding Progress</span>
                    <span className="font-medium">{Math.round(fundingPercent)}%</span>
                  </div>
                  <Progress value={fundingPercent} className="h-3" />
                  <div className="flex justify-between text-sm mt-2">
                    <span>${(pool.currentFunding || 0).toLocaleString()}</span>
                    <span className="text-muted-foreground">/ ${(pool.totalShares * pool.sharePrice).toLocaleString()} USDC</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 p-4 bg-secondary rounded-lg">
                  <div>
                    <p className="text-sm text-muted-foreground">Share Price</p>
                    <p className="text-xl font-bold">${pool.sharePrice}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Available</p>
                    <p className="text-xl font-bold">{pool.totalShares - Math.floor(pool.currentFunding / pool.sharePrice)}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Number of Shares</Label>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => setSharesToBuy(Math.max(1, sharesToBuy - 10))}>-10</Button>
                    <Input 
                      type="number" 
                      value={sharesToBuy} 
                      onChange={(e) => setSharesToBuy(Number(e.target.value))}
                      className="text-center"
                    />
                    <Button variant="outline" size="sm" onClick={() => setSharesToBuy(sharesToBuy + 10)}>+10</Button>
                  </div>
                </div>

                <div className="space-y-2 p-4 bg-muted rounded-lg">
                  <div className="flex justify-between text-sm">
                    <span>Shares</span>
                    <span>{sharesToBuy}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Ownership</span>
                    <span>{ownershipPercent}%</span>
                  </div>
                  <div className="flex justify-between font-medium pt-2 border-t border-border">
                    <span>Total Cost</span>
                    <span className="text-primary">${totalCost.toLocaleString()} USDC</span>
                  </div>
                </div>

                <Button onClick={handleBuyShares} className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90">
                  <Wallet className="w-4 h-4 mr-2" />
                  {isConnected ? 'Buy Shares' : 'Connect Wallet'}
                </Button>

                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Shield className="w-4 h-4" />
                  <span>Secured by smart contract on Polygon Amoy</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Pool Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Maintenance Fund</span>
                  <span>{pool.maintenancePct / 100}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Deposit Required</span>
                  <span>$50 USDC</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Max Booking</span>
                  <span>3 days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Created</span>
                  <span>{format(pool.createdAt, 'MMM d, yyyy')}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}