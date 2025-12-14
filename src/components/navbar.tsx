'use client'

import Link from 'next/link'
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { Button } from '@/components/ui/button'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { Wallet, Menu, X, ChevronDown, User, LogOut, LayoutDashboard, Settings } from 'lucide-react'
import { useState, useEffect } from 'react'
import { ProfileSetupModal } from './profile-setup-modal'

export function Navbar() {
  const { address, isConnected } = useAccount()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [showProfileSetup, setShowProfileSetup] = useState(false)
  const [profileChecked, setProfileChecked] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    async function checkProfile() {
      if (isConnected && address && !profileChecked) {
        try {
          const res = await fetch(`/api/auth/user?address=${address}`)
          if (res.ok) {
            const data = await res.json()
            if (!data.username) {
              setShowProfileSetup(true)
            }
          } else if (res.status === 404) {
            setShowProfileSetup(true)
          }
        } catch (error) {
          console.error('Failed to check profile:', error)
        } finally {
          setProfileChecked(true)
        }
      }
    }
    checkProfile()
  }, [isConnected, address, profileChecked])

  const truncateAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <img src="/logo.svg" alt="PartOwn" className="w-8 h-8" />
              <span className="font-bold text-xl gradient-text">PartOwn</span>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              <Link href="/explore" className="text-muted-foreground hover:text-foreground transition-colors">
                Explore
              </Link>
              <Link href="/create" className="text-muted-foreground hover:text-foreground transition-colors">
                Create Pool
              </Link>
              <Link href="/pricing" className="text-muted-foreground hover:text-foreground transition-colors">
                Pricing
              </Link>
              <Link href="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">
                Dashboard
              </Link>
              <Link href="/help" className="text-muted-foreground hover:text-foreground transition-colors">
                Help
              </Link>
            </div>

            <div className="hidden md:flex items-center gap-4">
              {mounted && isConnected ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="gap-2">
                      <Wallet className="w-4 h-4" />
                      {truncateAddress(address!) }
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard" className="flex items-center gap-2">
                        <LayoutDashboard className="w-4 h-4" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/payments" className="flex items-center gap-2">
                        <Settings className="w-4 h-4" />
                        Payments
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => disconnect()} className="text-destructive">
                      <LogOut className="w-4 h-4 mr-2" />
                      Disconnect
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button className="gap-2 bg-gradient-to-r from-primary to-accent hover:opacity-90">
                      <Wallet className="w-4 h-4" />
                      Connect Wallet
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {connectors.map((connector) => (
                      <DropdownMenuItem key={connector.id} onClick={() => connect({ connector })}>
                        {connector.name}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>

            <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden border-t border-border bg-background">
            <div className="px-4 py-4 space-y-4">
              <Link href="/explore" className="block text-muted-foreground hover:text-foreground" onClick={() => setMobileOpen(false)}>
                Explore
              </Link>
              <Link href="/create" className="block text-muted-foreground hover:text-foreground" onClick={() => setMobileOpen(false)}>
                Create Pool
              </Link>
              <Link href="/pricing" className="block text-muted-foreground hover:text-foreground" onClick={() => setMobileOpen(false)}>
                Pricing
              </Link>
              <Link href="/dashboard" className="block text-muted-foreground hover:text-foreground" onClick={() => setMobileOpen(false)}>
                Dashboard
              </Link>
              <Link href="/profile" className="block text-muted-foreground hover:text-foreground" onClick={() => setMobileOpen(false)}>
                Profile
              </Link>
              <Link href="/help" className="block text-muted-foreground hover:text-foreground" onClick={() => setMobileOpen(false)}>
                Help
              </Link>
              <div className="pt-4 border-t border-border">
                {mounted && isConnected ? (
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">{truncateAddress(address!)}</p>
                    <Button variant="destructive" size="sm" onClick={() => disconnect()}>
                      Disconnect
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {connectors.map((connector) => (
                      <Button key={connector.id} variant="outline" className="w-full" onClick={() => connect({ connector })}>
                        {connector.name}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      {showProfileSetup && address && (
        <ProfileSetupModal open={showProfileSetup} address={address} />
      )}
    </>
  )
}