'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Pool, categories } from '@/lib/store'
import { Search, MapPin, Users, Filter, Grid, List, SlidersHorizontal } from 'lucide-react'
import { motion } from 'framer-motion'

export default function ExplorePage() {
  const [pools, setPools] = useState<Pool[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [status, setStatus] = useState('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  useEffect(() => {
    async function fetchPools() {
      setLoading(true)
      try {
        const params = new URLSearchParams()
        if (search) params.set('search', search)
        if (category !== 'all') params.set('category', category)
        if (status !== 'all') params.set('status', status)
        
        const res = await fetch(`/api/pools?${params}`)
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
  }, [search, category, status])

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Explore Pools</h1>
          <p className="text-muted-foreground">Discover items to co-own with others</p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search pools..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-40">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="funding">Funding</SelectItem>
                <SelectItem value="active">Active</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex border border-border rounded-md">
              <Button
                variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                size="icon"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                size="icon"
                onClick={() => setViewMode('list')}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className={viewMode === 'grid' ? 'grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 'space-y-4'}>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="overflow-hidden animate-pulse">
                <div className={viewMode === 'grid' ? 'h-48 bg-muted' : 'flex'}>
                  {viewMode === 'list' && <div className="w-48 h-36 bg-muted shrink-0" />}
                </div>
                <CardContent className="p-4 space-y-3">
                  <div className="h-4 bg-muted rounded" />
                  <div className="h-3 bg-muted rounded w-2/3" />
                  <div className="h-2 bg-muted rounded" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : pools.length === 0 ? (
          <div className="text-center py-20">
            <SlidersHorizontal className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No pools found</h3>
            <p className="text-muted-foreground mb-4">Try adjusting your filters or search terms</p>
            <Button onClick={() => { setSearch(''); setCategory('all'); setStatus('all'); }}>
              Clear Filters
            </Button>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {pools.map((pool, idx) => (
              <motion.div
                key={pool.id || (pool as any)._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
              >
                <Link href={`/pool/${(pool as any)._id || pool.id}`}>
                  <Card className="overflow-hidden hover:border-primary/30 transition-all card-glow">
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
                      <Badge variant="secondary" className="absolute top-3 left-3">
                        {pool.category}
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
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Users className="w-3 h-3" />
                            {pool.members}
                          </div>
                          <span className="text-primary font-medium">${pool.sharePrice}/share</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {pools.map((pool, idx) => (
              <motion.div
                key={pool.id || (pool as any)._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
              >
                <Link href={`/pool/${(pool as any)._id || pool.id}`}>
                  <Card className="overflow-hidden hover:border-primary/30 transition-all card-glow">
                    <div className="flex">
                      <div className="relative w-48 h-36 shrink-0">
                        <Image
                          src={pool.images[0]}
                          alt={pool.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <CardContent className="flex-1 p-4 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-semibold">{pool.title}</h3>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <MapPin className="w-3 h-3" />
                                {pool.location}
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Badge variant="secondary">{pool.category}</Badge>
                              <Badge className={pool.status === 'active' ? 'bg-green-500/90' : 'bg-amber-500/90'}>
                                {pool.status}
                              </Badge>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2">{pool.description}</p>
                        </div>
                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-1">
                              <Users className="w-4 h-4 text-muted-foreground" />
                              {pool.members} members
                            </div>
                            <div>
                              <span className="text-muted-foreground">Funded:</span>{' '}
                              <span className="font-medium">
                                {Math.round(((pool.currentFunding || 0) / (pool.totalShares * pool.sharePrice)) * 100)}%
                              </span>
                            </div>
                          </div>
                          <span className="text-primary font-semibold">${pool.sharePrice}/share</span>
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}