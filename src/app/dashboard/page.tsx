'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useAccount } from 'wagmi'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Wallet, 
  Calendar, 
  TrendingUp, 
  Clock, 
  Plus,
  ArrowUpRight,
  Camera,
  AlertTriangle,
  CheckCircle,
  MapPin
} from 'lucide-react'
import { format } from 'date-fns'

export default function DashboardPage() {
  const { isConnected, address } = useAccount()
  const [loading, setLoading] = useState(true)
  const [userData, setUserData] = useState<any>(null)
  const [userPools, setUserPools] = useState<any[]>([])
  const [userBookings, setUserBookings] = useState<any[]>([])

  useEffect(() => {
    async function fetchDashboardData() {
      if (!isConnected || !address) return

      try {
        const [userRes, poolsRes, bookingsRes] = await Promise.all([
          fetch(`/api/auth/user?address=${address}`),
          fetch(`/api/pools?member=${address}`),
          fetch(`/api/bookings?user=${address}`)
        ])

        if (userRes.ok) {
          const user = await userRes.json()
          setUserData(user)
        }

        if (poolsRes.ok) {
          const poolsData = await poolsRes.json()
          setUserPools(poolsData.pools || [])
        }

        if (bookingsRes.ok) {
          const bookingsData = await bookingsRes.json()
          setUserBookings(bookingsData.bookings || [])
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [isConnected, address])

  if (!isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <Wallet className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-bold mb-2">Connect Your Wallet</h2>
            <p className="text-muted-foreground mb-4">
              Please connect your wallet to view your dashboard
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const totalValue = userPools.reduce((sum, pool) => sum + (pool.sharePrice * 10), 0)
  const claimable = userPools.length * 42.50

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
            <p className="text-muted-foreground font-mono">{address?.slice(0, 8)}...{address?.slice(-6)}</p>
          </div>
          <Link href="/create">
            <Button className="gap-2 bg-gradient-to-r from-primary to-accent hover:opacity-90">
              <Plus className="w-4 h-4" /> Create Pool
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            {[1, 2, 3, 4].map(i => (
              <Card key={i} className="animate-pulse">
                <CardContent className="pt-6">
                  <div className="h-20 bg-muted rounded" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-4 gap-4 mb-8">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Value</p>
                      <p className="text-2xl font-bold">${totalValue.toFixed(2)}</p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Wallet className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-sm mt-2 text-green-500">
                    <ArrowUpRight className="w-4 h-4" />
                    <span>Portfolio value</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Claimable</p>
                      <p className="text-2xl font-bold text-green-500">${claimable.toFixed(2)}</p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-green-500" />
                    </div>
                  </div>
                  <Button size="sm" className="mt-2 w-full">Claim All</Button>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Active Pools</p>
                      <p className="text-2xl font-bold">{userPools.length}</p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                      <Plus className="w-6 h-6 text-blue-500" />
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">Co-ownership pools</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Bookings</p>
                      <p className="text-2xl font-bold">{userBookings.length}</p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-amber-500" />
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">Total bookings</p>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="pools" className="space-y-6">
              <TabsList>
                <TabsTrigger value="pools">My Pools</TabsTrigger>
                <TabsTrigger value="bookings">Bookings</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
              </TabsList>

              <TabsContent value="pools" className="space-y-4">
                {userPools.length === 0 ? (
                  <Card>
                    <CardContent className="pt-6 text-center">
                      <Plus className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No pools yet</h3>
                      <p className="text-muted-foreground mb-4">
                        Join existing pools or create your own to get started
                      </p>
                      <div className="flex gap-2 justify-center">
                        <Link href="/explore">
                          <Button variant="outline">Explore Pools</Button>
                        </Link>
                        <Link href="/create">
                          <Button>Create Pool</Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid md:grid-cols-2 gap-6">
                    {userPools.map((pool) => (
                      <Link key={pool.address} href={`/pool/${pool.address}`}>
                        <Card className="overflow-hidden hover:border-primary/30 transition-all card-glow group">
                          <div className="relative h-48">
                            <Image
                              src={pool.images[0]}
                              alt={pool.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <Badge className="absolute top-3 right-3 bg-green-500/90">
                              {pool.status}
                            </Badge>
                          </div>
                          <CardContent className="p-4">
                            <h3 className="font-semibold mb-1">{pool.title}</h3>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
                              <MapPin className="w-3 h-3" />
                              {pool.location}
                            </div>
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Your shares</span>
                                <span className="font-medium">10 shares</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Value</span>
                                <span className="font-medium text-primary">${(pool.sharePrice * 10).toFixed(2)}</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="bookings" className="space-y-4">
                {userBookings.length === 0 ? (
                  <Card>
                    <CardContent className="pt-6 text-center">
                      <Calendar className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No bookings yet</h3>
                      <p className="text-muted-foreground">
                        Book a pool item to see your bookings here
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  userBookings.map((booking) => (
                    <Card key={booking._id}>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold">Booking #{booking._id.slice(-6)}</h3>
                              <Badge variant={booking.status === 'active' ? 'default' : 'secondary'}>
                                {booking.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-3">
                              {format(new Date(booking.startDate), 'MMM d, yyyy')} - {format(new Date(booking.endDate), 'MMM d, yyyy')}
                            </p>
                            {booking.damageDetected && (
                              <div className="flex items-center gap-2 text-amber-500 text-sm">
                                <AlertTriangle className="w-4 h-4" />
                                <span>Damage detected - under review</span>
                              </div>
                            )}
                          </div>
                          {booking.status === 'active' && (
                            <Link href={`/checkin/${booking._id}`}>
                              <Button size="sm" variant="outline" className="gap-2">
                                <Camera className="w-4 h-4" /> Check In/Out
                              </Button>
                            </Link>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </TabsContent>

              <TabsContent value="activity" className="space-y-4">
                <Card>
                  <CardContent className="pt-6 text-center">
                    <Clock className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Activity log</h3>
                    <p className="text-muted-foreground">
                      Your recent transactions and activities will appear here
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </div>
  )
}
