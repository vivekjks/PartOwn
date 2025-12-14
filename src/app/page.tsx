'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Pool } from '@/lib/store'
import { 
  Users, 
  Shield, 
  Calendar, 
  Sparkles, 
  ArrowRight, 
  Wallet,
  Vote,
  PiggyBank,
  ChevronRight,
  MapPin
} from 'lucide-react'
import { motion } from 'framer-motion'

const features = [
  {
    icon: Users,
    title: 'Fractional Ownership',
    description: 'Buy shares in high-value items with friends. Each share is an on-chain token representing your ownership %.',
  },
  {
    icon: Calendar,
    title: 'Smart Scheduling',
    description: 'AI-powered booking system ensures fair usage. Get suggested slots and automatic conflict resolution.',
  },
  {
    icon: Shield,
    title: 'Escrow & Insurance',
    description: 'Security deposits locked in smart contracts. Automatic damage assessment and repair fund management.',
  },
  {
    icon: Vote,
    title: 'DAO Governance',
    description: 'Vote on repairs, rule changes, and buyouts. Share-weighted voting ensures fair decision making.',
  },
  {
    icon: PiggyBank,
    title: 'Rental Revenue',
    description: 'Rent to external users and earn. Revenue automatically distributed pro-rata to all token holders.',
  },
  {
    icon: Sparkles,
    title: 'AI-Powered',
    description: 'Gemini AI for damage detection, receipt OCR, dispute resolution, and scheduling optimization.',
  },
]

const faqs = [
  {
    q: 'How does ownership work?',
    a: 'When you buy shares in a pool, you receive ERC-20 tokens representing your ownership percentage. These tokens can be transferred or sold.',
  },
  {
    q: 'What happens if something breaks?',
    a: 'Our AI detects damage through photo comparison. Repair costs come from the maintenance fund, and members vote on repairs above a threshold.',
  },
  {
    q: 'Can I sell my shares?',
    a: 'Yes! You can propose a buyout, transfer to another user, or wait for a group sell proposal to pass.',
  },
  {
    q: 'What blockchain do you use?',
    a: 'PartOwn runs on Polygon Amoy testnet for low fees and fast transactions. All payments are in USDC.',
  },
]

export default function HomePage() {
  const [pools, setPools] = useState<Pool[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    activePools: 0,
    totalValue: 0,
    members: 0,
    satisfaction: 98
  })

  useEffect(() => {
    async function fetchPools() {
      try {
        const res = await fetch('/api/pools?limit=4')
        if (res.ok) {
          const data = await res.json()
          setPools(data.pools || [])
        }
      } catch (error) {
        console.error('Failed to fetch pools:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchPools()
  }, [])

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch('/api/pools')
        if (res.ok) {
          const data = await res.json()
          const allPools = data.pools || []
          const totalValue = allPools.reduce((sum: number, p: any) => sum + (p.totalShares * p.sharePrice), 0)
          const uniqueMembers = new Set(allPools.flatMap((p: any) => p.members || [])).size
          
          setStats({
            activePools: allPools.length,
            totalValue,
            members: uniqueMembers,
            satisfaction: 98
          })
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error)
      }
    }
    fetchStats()
  }, [])

  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="hero-glow top-0 left-1/4" />
        <div className="hero-glow bottom-0 right-1/4 bg-gradient-to-r from-cyan-500/10" />
        <div className="grid-pattern absolute inset-0" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <Badge variant="outline" className="mb-6 px-4 py-1 border-primary/30 bg-primary/5">
              <span className="text-primary">Built on Polygon Amoy</span>
            </Badge>
            
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight mb-6">
              Co-own anything with{' '}
              <span className="gradient-text">on-chain shares</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Split ownership of cameras, drones, gaming setups, bikes — any valuable item. 
              Smart contracts handle bookings, payments, repairs, and fair scheduling.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/create">
                <Button size="lg" className="gap-2 bg-gradient-to-r from-primary to-accent hover:opacity-90 text-lg px-8">
                  Create a Pool
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link href="/explore">
                <Button size="lg" variant="outline" className="gap-2 text-lg px-8">
                  Explore Pools
                </Button>
              </Link>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
          >
            {[
              { value: `${stats.activePools}`, label: 'Active Pools' },
              { value: `$${(stats.totalValue / 1000).toFixed(1)}K`, label: 'Total Value Locked' },
              { value: `${stats.members}`, label: 'Members' },
              { value: `${stats.satisfaction}%`, label: 'Satisfaction' },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-3xl font-bold gradient-text">{stat.value}</div>
                <div className="text-muted-foreground text-sm">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-card/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Everything you need for <span className="gradient-text">shared ownership</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              From fractional tokens to AI-powered scheduling, PartOwn handles the complexity 
              so you can focus on using and enjoying your shared items.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, idx) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full bg-card border-border hover:border-primary/30 transition-colors card-glow">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <feature.icon className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">Featured Pools</h2>
              <p className="text-muted-foreground">Join existing pools or create your own</p>
            </div>
            <Link href="/explore">
              <Button variant="ghost" className="gap-2">
                View all <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
          
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="overflow-hidden animate-pulse">
                  <div className="h-48 bg-muted" />
                  <CardContent className="p-4 space-y-3">
                    <div className="h-4 bg-muted rounded" />
                    <div className="h-3 bg-muted rounded w-2/3" />
                    <div className="h-2 bg-muted rounded" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {pools.map((pool, idx) => (
                <motion.div
                  key={pool.id || (pool as any)._id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: idx * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Link href={`/pool/${(pool as any)._id || pool.id}`} >
                    <Card className="overflow-hidden hover:border-primary/30 transition-all card-glow group">
                      <div className="relative h-48 overflow-hidden">
                        <Image
                          src={pool.images[0]}
                          alt={pool.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <Badge 
                          className={`absolute top-3 right-3 ${
                            pool.status === 'active' ? 'bg-green-500/90' : 'bg-amber-500/90'
                          }`}
                        >
                          {pool.status}
                        </Badge>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold mb-1 truncate">{pool.title}</h3>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
                          <MapPin className="w-3 h-3" />
                          {pool.location}
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Funded</span>
                            <span className="font-medium">
                              {Math.round(((pool.currentFunding || 0) / (pool.totalShares * pool.sharePrice)) * 100)}%
                            </span>
                          </div>
                          <Progress 
                            value={((pool.currentFunding || 0) / (pool.totalShares * pool.sharePrice)) * 100} 
                            className="h-2"
                          />
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">{pool.members} members</span>
                            <span className="text-primary font-medium">${pool.sharePrice}/share</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-20 bg-card/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                How it works
              </h2>
              <div className="space-y-6">
                {[
                  { step: '1', title: 'Create or Join', desc: 'Start a new pool for an item you want to co-own, or buy shares in existing pools.' },
                  { step: '2', title: 'Book & Use', desc: 'Reserve time slots through our AI scheduler. Check-in with photos and use the item.' },
                  { step: '3', title: 'Govern & Earn', desc: 'Vote on decisions, split repair costs fairly, and earn from external rentals.' },
                ].map((item) => (
                  <div key={item.step} className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shrink-0">
                      <span className="text-white font-bold">{item.step}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{item.title}</h3>
                      <p className="text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="gradient-border p-1 rounded-2xl">
                <div className="bg-card rounded-xl p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                      <Wallet className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <div className="font-semibold">Your Dashboard</div>
                      <div className="text-sm text-muted-foreground">Manage your pools & bookings</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-secondary rounded-lg p-3">
                      <div className="text-sm text-muted-foreground">Your Pools</div>
                      <div className="text-lg font-semibold">View All</div>
                    </div>
                    <div className="bg-secondary rounded-lg p-3">
                      <div className="text-sm text-muted-foreground">Bookings</div>
                      <div className="text-lg font-semibold">Manage</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link href="/dashboard" className="flex-1">
                      <Button className="w-full" size="sm">Go to Dashboard</Button>
                    </Link>
                    <Link href="/create" className="flex-1">
                      <Button variant="outline" className="w-full" size="sm">Create Pool</Button>
                    </Link>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-accent/20 rounded-full blur-3xl" />
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="bg-card">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{faq.q}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{faq.a}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="gradient-border p-8 sm:p-12 rounded-2xl text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Ready to start sharing?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Create your first pool in minutes. No coding required — just connect your wallet and describe your item.
            </p>
            <Link href="/create">
              <Button size="lg" className="gap-2 bg-gradient-to-r from-primary to-accent hover:opacity-90">
                Create Your Pool
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <span className="text-white font-bold text-sm">PO</span>
                </div>
                <span className="font-bold text-xl">PartOwn</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Community asset pools on Polygon. Own together, use fairly.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <Link href="/explore" className="block hover:text-foreground">Explore</Link>
                <Link href="/create" className="block hover:text-foreground">Create Pool</Link>
                <Link href="/dashboard" className="block hover:text-foreground">Dashboard</Link>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <Link href="/help" className="block hover:text-foreground">Help Center</Link>
                <a href="#" className="block hover:text-foreground">Documentation</a>
                <a href="#" className="block hover:text-foreground">API</a>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <a href="#" className="block hover:text-foreground">Privacy Policy</a>
                <a href="#" className="block hover:text-foreground">Terms of Service</a>
                <a href="#" className="block hover:text-foreground">Cookie Policy</a>
              </div>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
            © 2024 PartOwn. Built on Polygon Amoy Testnet.
          </div>
        </div>
      </footer>
    </div>
  )
}