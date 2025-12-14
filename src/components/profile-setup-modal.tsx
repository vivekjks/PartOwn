'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { User } from 'lucide-react'

export function ProfileSetupModal({ 
  open, 
  address 
}: { 
  open: boolean
  address: string
}) {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const handleComplete = async () => {
    if (!username.trim()) {
      toast.error('Please enter a username')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/auth/user', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address, username, email })
      })

      if (!res.ok) throw new Error('Failed to update profile')

      toast.success('Profile completed!')
      router.push('/dashboard')
    } catch (error: any) {
      toast.error(error.message || 'Failed to complete profile')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-md" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-4">
            <User className="w-6 h-6 text-white" />
          </div>
          <DialogTitle className="text-center text-2xl">Complete Your Profile</DialogTitle>
          <DialogDescription className="text-center">
            Welcome to PartOwn! Let's set up your profile to get started.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username *</Label>
            <Input
              id="username"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email (Optional)</Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>
        </div>

        <Button 
          onClick={handleComplete} 
          disabled={loading || !username.trim()}
          className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90"
        >
          {loading ? 'Setting up...' : 'Complete Profile & Continue'}
        </Button>
      </DialogContent>
    </Dialog>
  )
}
