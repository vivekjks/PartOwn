'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'
import QRCode from 'qrcode'
import { 
  Share2, 
  Copy, 
  QrCode as QrCodeIcon, 
  Mail, 
  Twitter, 
  MessageCircle,
  Wallet,
  Check
} from 'lucide-react'

interface SharePoolDialogProps {
  poolId: string
  poolTitle: string
}

export function SharePoolDialog({ poolId, poolTitle }: SharePoolDialogProps) {
  const [qrCode, setQrCode] = useState('')
  const [copied, setCopied] = useState(false)
  const [walletAddress, setWalletAddress] = useState('')
  const [inviting, setInviting] = useState(false)
  
  const poolUrl = typeof window !== 'undefined' ? `${window.location.origin}/pool/${poolId}` : ''

  useEffect(() => {
    if (poolUrl) {
      QRCode.toDataURL(poolUrl, {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#ffffff'
        }
      }).then(setQrCode)
    }
  }, [poolUrl])

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    toast.success('Copied to clipboard!')
    setTimeout(() => setCopied(false), 2000)
  }

  const shareToSocial = (platform: 'twitter' | 'whatsapp' | 'email') => {
    const text = `Check out this co-ownership pool: ${poolTitle}`
    const urls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(poolUrl)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(text + ' ' + poolUrl)}`,
      email: `mailto:?subject=${encodeURIComponent(poolTitle)}&body=${encodeURIComponent(text + '\n\n' + poolUrl)}`
    }
    window.open(urls[platform], '_blank')
  }

  const inviteByWallet = async () => {
    if (!walletAddress || !/^0x[a-fA-F0-9]{40}$/.test(walletAddress)) {
      toast.error('Please enter a valid wallet address')
      return
    }

    setInviting(true)
    try {
      const res = await fetch('/api/pools/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          poolId,
          walletAddress: walletAddress.toLowerCase()
        })
      })

      if (!res.ok) throw new Error('Failed to send invite')

      toast.success('Invite sent successfully!')
      setWalletAddress('')
    } catch (error) {
      console.error('Invite error:', error)
      toast.error('Failed to send invite')
    } finally {
      setInviting(false)
    }
  }

  const downloadQR = () => {
    const link = document.createElement('a')
    link.download = `${poolId}-qr-code.png`
    link.href = qrCode
    link.click()
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Share2 className="w-4 h-4" />
          Share Pool
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Pool</DialogTitle>
          <DialogDescription>
            Share this pool with friends or invite members by wallet address
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="link" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="link">Link</TabsTrigger>
            <TabsTrigger value="qr">QR Code</TabsTrigger>
            <TabsTrigger value="invite">Invite</TabsTrigger>
          </TabsList>
          
          <TabsContent value="link" className="space-y-4">
            <div className="space-y-2">
              <Label>Share Link</Label>
              <div className="flex gap-2">
                <Input value={poolUrl} readOnly className="font-mono text-sm" />
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => copyToClipboard(poolUrl)}
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Share on Social</Label>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  className="flex-1 gap-2"
                  onClick={() => shareToSocial('twitter')}
                >
                  <Twitter className="w-4 h-4" />
                  Twitter
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1 gap-2"
                  onClick={() => shareToSocial('whatsapp')}
                >
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1 gap-2"
                  onClick={() => shareToSocial('email')}
                >
                  <Mail className="w-4 h-4" />
                  Email
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="qr" className="space-y-4">
            <div className="flex flex-col items-center space-y-4">
              {qrCode ? (
                <>
                  <div className="bg-white p-4 rounded-lg">
                    <img src={qrCode} alt="QR Code" className="w-64 h-64" />
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline"
                      onClick={downloadQR}
                      className="gap-2"
                    >
                      <QrCodeIcon className="w-4 h-4" />
                      Download QR Code
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => copyToClipboard(poolUrl)}
                      className="gap-2"
                    >
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      Copy Link
                    </Button>
                  </div>
                </>
              ) : (
                <div className="w-64 h-64 bg-muted animate-pulse rounded-lg" />
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="invite" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="wallet">Wallet Address</Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Wallet className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="wallet"
                    placeholder="0x..."
                    value={walletAddress}
                    onChange={(e) => setWalletAddress(e.target.value)}
                    className="pl-10 font-mono text-sm"
                  />
                </div>
                <Button 
                  onClick={inviteByWallet}
                  disabled={inviting}
                >
                  {inviting ? 'Sending...' : 'Invite'}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Send a direct invitation to a wallet address. They'll receive a notification to join this pool.
              </p>
            </div>
            
            <div className="p-4 bg-secondary rounded-lg space-y-2">
              <h4 className="font-medium text-sm">Benefits of inviting:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Invited members get priority access</li>
                <li>• Track who joined through your invite</li>
                <li>• Build trusted co-owner networks</li>
              </ul>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
