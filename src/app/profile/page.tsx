'use client'

import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Wallet, Mail, User, Shield, Edit2, Save, Camera } from 'lucide-react'
import { toast } from 'sonner'

export default function ProfilePage() {
  const { address, isConnected } = useAccount()
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState({
    name: '',
    email: '',
    avatar: '',
    kycStatus: 'none' as const
  })

  useEffect(() => {
    if (!isConnected || !address) return

    async function fetchUser() {
      try {
        const res = await fetch('/api/auth/user')
        if (res.ok) {
          const data = await res.json()
          setUser(data)
        }
      } catch (error) {
        console.error('Failed to fetch user:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchUser()
  }, [address, isConnected])

  const handleSave = async () => {
    try {
      toast.loading('Saving profile...')
      const res = await fetch('/api/auth/user', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
      })

      if (!res.ok) throw new Error('Failed to update profile')

      toast.dismiss()
      toast.success('Profile updated successfully!')
      setEditing(false)
    } catch (error: any) {
      toast.dismiss()
      toast.error(error.message || 'Failed to save profile')
    }
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <Wallet className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-bold mb-2">Connect Your Wallet</h2>
            <p className="text-muted-foreground">
              Please connect your wallet to view your profile
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Profile Settings</h1>

        <div className="grid md:grid-cols-3 gap-8">
          <Card className="md:col-span-1">
            <CardContent className="pt-6 text-center">
              <div className="relative inline-block mb-4">
                <Avatar className="w-32 h-32">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback className="text-3xl">
                    {user.name?.[0] || address?.slice(2, 4).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                {editing && (
                  <Button
                    size="icon"
                    className="absolute bottom-0 right-0 rounded-full"
                  >
                    <Camera className="w-4 h-4" />
                  </Button>
                )}
              </div>
              <h2 className="font-bold text-xl mb-1">{user.name || 'Anonymous'}</h2>
              <p className="text-sm text-muted-foreground font-mono mb-4">
                {address?.slice(0, 6)}...{address?.slice(-4)}
              </p>
              <Badge
                variant={
                  user.kycStatus === 'verified' ? 'default' :
                  user.kycStatus === 'pending' ? 'secondary' : 'outline'
                }
                className="gap-1"
              >
                <Shield className="w-3 h-3" />
                KYC: {user.kycStatus}
              </Badge>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Personal Information</CardTitle>
              {!editing ? (
                <Button onClick={() => setEditing(true)} size="sm" variant="outline" className="gap-2">
                  <Edit2 className="w-4 h-4" /> Edit
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button onClick={handleSave} size="sm" className="gap-2">
                    <Save className="w-4 h-4" /> Save
                  </Button>
                  <Button onClick={() => setEditing(false)} size="sm" variant="outline">
                    Cancel
                  </Button>
                </div>
              )}
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2">
                  <User className="w-4 h-4" /> Display Name
                </Label>
                <Input
                  id="name"
                  value={user.name}
                  onChange={(e) => setUser({ ...user, name: e.target.value })}
                  disabled={!editing}
                  placeholder="Enter your name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="w-4 h-4" /> Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={user.email}
                  onChange={(e) => setUser({ ...user, email: e.target.value })}
                  disabled={!editing}
                  placeholder="your@email.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="wallet" className="flex items-center gap-2">
                  <Wallet className="w-4 h-4" /> Wallet Address
                </Label>
                <Input
                  id="wallet"
                  value={address || ''}
                  disabled
                  className="font-mono"
                />
              </div>

              <div className="pt-4 border-t">
                <h3 className="font-semibold mb-4">Verification</h3>
                {user.kycStatus === 'none' && (
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm mb-3">
                      Complete KYC verification to unlock higher transaction limits and exclusive features.
                    </p>
                    <Button size="sm" className="gap-2">
                      <Shield className="w-4 h-4" /> Start KYC Verification
                    </Button>
                  </div>
                )}
                {user.kycStatus === 'pending' && (
                  <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                    <p className="text-sm text-amber-700 dark:text-amber-400">
                      Your KYC verification is being reviewed. This typically takes 24-48 hours.
                    </p>
                  </div>
                )}
                {user.kycStatus === 'verified' && (
                  <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <p className="text-sm text-green-700 dark:text-green-400 flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      Your account is verified and has full access to all features.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold gradient-text">3</div>
                <div className="text-sm text-muted-foreground">Pools Joined</div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold gradient-text">$2,450</div>
                <div className="text-sm text-muted-foreground">Total Investment</div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold gradient-text">12</div>
                <div className="text-sm text-muted-foreground">Bookings</div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold gradient-text">$127.50</div>
                <div className="text-sm text-muted-foreground">Total Earned</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
