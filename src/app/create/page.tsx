'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useAccount } from 'wagmi'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { categories } from '@/lib/store'
import { 
  ArrowLeft, 
  ArrowRight, 
  Upload, 
  ImagePlus, 
  Check, 
  Wallet,
  Info,
  X
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const steps = [
  { id: 1, title: 'Item Details', description: 'Basic information about your item' },
  { id: 2, title: 'Financials', description: 'Price, shares, and target' },
  { id: 3, title: 'Rules', description: 'Booking and usage rules' },
  { id: 4, title: 'Tokenomics', description: 'Revenue and payout settings' },
  { id: 5, title: 'Review', description: 'Preview and deploy' },
]

export default function CreatePoolPage() {
  const router = useRouter()
  const { isConnected, address } = useAccount()
  const [step, setStep] = useState(1)
  const [images, setImages] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    location: '',
    totalShares: 1000,
    sharePrice: 10,
    targetRaise: 10000,
    depositAmount: 50,
    maxBookingDays: 3,
    advanceBookingDays: 7,
    requiresApproval: false,
    maintenancePct: 2,
    rentalEnabled: false,
    rentalPricePerDay: 0,
    platformFee: 2,
  })

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)
    toast.loading('Uploading to IPFS...')

    try {
      for (const file of Array.from(files)) {
        const formData = new FormData()
        formData.append('file', file)

        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        })

        if (!res.ok) throw new Error('Upload failed')

        const data = await res.json()
        setImages(prev => [...prev, data.ipfsUrl])
      }

      toast.dismiss()
      toast.success('Images uploaded successfully!')
    } catch (error) {
      console.error('Upload error:', error)
      toast.dismiss()
      toast.error('Failed to upload images')
    } finally {
      setUploading(false)
    }
  }

  const removeImage = (idx: number) => {
    setImages(images.filter((_, i) => i !== idx))
  }

  const handleNext = () => {
    if (step < 5) setStep(step + 1)
  }

  const handleBack = () => {
    if (step > 1) setStep(step - 1)
  }

  const handleDeploy = async () => {
    if (!isConnected) {
      toast.error('Please connect your wallet first')
      return
    }

    if (!formData.title || !formData.category || !formData.location || images.length === 0) {
      toast.error('Please fill in all required fields')
      return
    }

    try {
      toast.loading('Deploying pool contract...')

      const res = await fetch('/api/pools/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          images,
          creator: address
        })
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Failed to create pool')
      }

      const data = await res.json()

      toast.dismiss()
      toast.success('Pool created successfully!')
      router.push(`/pool/${data.poolId}`)
    } catch (error: any) {
      console.error('Deploy error:', error)
      toast.dismiss()
      toast.error(error.message || 'Failed to deploy pool')
    }
  }

  const progress = (step / 5) * 100

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <Button variant="ghost" onClick={() => router.back()} className="gap-2 mb-4">
            <ArrowLeft className="w-4 h-4" /> Back
          </Button>
          <h1 className="text-3xl font-bold mb-2">Create Asset Pool</h1>
          <p className="text-muted-foreground">
            Deploy a new pool contract for your shared item on Polygon Amoy
          </p>
        </div>

        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {steps.map((s) => (
              <div 
                key={s.id} 
                className={`flex items-center gap-2 ${step >= s.id ? 'text-primary' : 'text-muted-foreground'}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step > s.id ? 'bg-primary text-white' : step === s.id ? 'bg-primary/20 text-primary border-2 border-primary' : 'bg-muted'
                }`}>
                  {step > s.id ? <Check className="w-4 h-4" /> : s.id}
                </div>
                <span className="hidden md:block text-sm">{s.title}</span>
              </div>
            ))}
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {step === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle>Item Details</CardTitle>
                  <CardDescription>Tell us about the item you want to share</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Item Title</Label>
                    <Input
                      id="title"
                      placeholder="e.g., Sony A7 IV Camera Kit"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe the item, what's included, condition, etc."
                      rows={4}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Category</Label>
                      <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        placeholder="City, State"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Item Photos</Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {images.map((img, idx) => (
                        <div key={idx} className="relative aspect-square rounded-lg overflow-hidden bg-muted">
                          <img src={img} alt="" className="w-full h-full object-cover" />
                          <button 
                            onClick={() => removeImage(idx)}
                            className="absolute top-2 right-2 w-6 h-6 bg-black/50 rounded-full flex items-center justify-center hover:bg-black/70"
                          >
                            <X className="w-4 h-4 text-white" />
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        className="aspect-square rounded-lg border-2 border-dashed border-border hover:border-primary/50 flex flex-col items-center justify-center gap-2 transition-colors disabled:opacity-50"
                      >
                        {uploading ? (
                          <>
                            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                            <span className="text-xs text-muted-foreground">Uploading...</span>
                          </>
                        ) : (
                          <>
                            <ImagePlus className="w-8 h-8 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">Add Photo</span>
                          </>
                        )}
                      </button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">Photos will be stored on IPFS via Pinata</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {step === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle>Financials</CardTitle>
                  <CardDescription>Set up share pricing and funding target</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="totalShares">Total Shares</Label>
                      <Input
                        id="totalShares"
                        type="number"
                        value={formData.totalShares}
                        onChange={(e) => setFormData({ ...formData, totalShares: Number(e.target.value) })}
                      />
                      <p className="text-xs text-muted-foreground">Number of fractional tokens to mint</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sharePrice">Share Price (USDC)</Label>
                      <Input
                        id="sharePrice"
                        type="number"
                        value={formData.sharePrice}
                        onChange={(e) => setFormData({ ...formData, sharePrice: Number(e.target.value) })}
                      />
                      <p className="text-xs text-muted-foreground">Price per share token</p>
                    </div>
                  </div>

                  <div className="p-4 bg-secondary rounded-lg">
                    <div className="flex justify-between mb-2">
                      <span className="text-muted-foreground">Target Raise</span>
                      <span className="font-semibold">${(formData.totalShares * formData.sharePrice).toLocaleString()} USDC</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Each share represents</span>
                      <span className="font-semibold">{(100 / formData.totalShares).toFixed(3)}% ownership</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="depositAmount">Security Deposit (USDC)</Label>
                    <Input
                      id="depositAmount"
                      type="number"
                      value={formData.depositAmount}
                      onChange={(e) => setFormData({ ...formData, depositAmount: Number(e.target.value) })}
                    />
                    <p className="text-xs text-muted-foreground">Required deposit for each booking</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="maintenancePct">Maintenance Fund (%)</Label>
                    <Input
                      id="maintenancePct"
                      type="number"
                      min={0}
                      max={10}
                      value={formData.maintenancePct}
                      onChange={(e) => setFormData({ ...formData, maintenancePct: Number(e.target.value) })}
                    />
                    <p className="text-xs text-muted-foreground">Percentage of deposits reserved for repairs</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {step === 3 && (
              <Card>
                <CardHeader>
                  <CardTitle>Booking Rules</CardTitle>
                  <CardDescription>Configure how members can book and use the item</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="maxBookingDays">Max Booking Duration (days)</Label>
                      <Input
                        id="maxBookingDays"
                        type="number"
                        value={formData.maxBookingDays}
                        onChange={(e) => setFormData({ ...formData, maxBookingDays: Number(e.target.value) })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="advanceBookingDays">Advance Booking Window (days)</Label>
                      <Input
                        id="advanceBookingDays"
                        type="number"
                        value={formData.advanceBookingDays}
                        onChange={(e) => setFormData({ ...formData, advanceBookingDays: Number(e.target.value) })}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-secondary rounded-lg">
                    <div>
                      <Label>Require Approval</Label>
                      <p className="text-sm text-muted-foreground">Other members must approve bookings</p>
                    </div>
                    <Switch
                      checked={formData.requiresApproval}
                      onCheckedChange={(checked) => setFormData({ ...formData, requiresApproval: checked })}
                    />
                  </div>

                  <div className="p-4 border border-border rounded-lg space-y-3">
                    <div className="flex items-start gap-3">
                      <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">AI Scheduler</p>
                        <p className="text-sm text-muted-foreground">
                          Our AI will suggest optimal time slots based on member preferences, share ownership, 
                          and fairness algorithms to ensure equal access to weekends and holidays.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border border-border rounded-lg space-y-3">
                    <div className="flex items-start gap-3">
                      <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">Check-in/Check-out</p>
                        <p className="text-sm text-muted-foreground">
                          Members must upload photos before and after use. Our AI compares images to detect damage 
                          and can automatically file claims if issues are found.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {step === 4 && (
              <Card>
                <CardHeader>
                  <CardTitle>Tokenomics & Payouts</CardTitle>
                  <CardDescription>Configure revenue sharing and rental settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-secondary rounded-lg">
                    <div>
                      <Label>Enable External Rentals</Label>
                      <p className="text-sm text-muted-foreground">Allow non-members to rent the item</p>
                    </div>
                    <Switch
                      checked={formData.rentalEnabled}
                      onCheckedChange={(checked) => setFormData({ ...formData, rentalEnabled: checked })}
                    />
                  </div>

                  {formData.rentalEnabled && (
                    <div className="space-y-2">
                      <Label htmlFor="rentalPrice">Rental Price (USDC/day)</Label>
                      <Input
                        id="rentalPrice"
                        type="number"
                        value={formData.rentalPricePerDay}
                        onChange={(e) => setFormData({ ...formData, rentalPricePerDay: Number(e.target.value) })}
                      />
                    </div>
                  )}

                  <div className="p-4 bg-secondary rounded-lg space-y-4">
                    <h4 className="font-medium">Revenue Distribution</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Maintenance Fund</span>
                        <span>{formData.maintenancePct}%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Platform Fee</span>
                        <span>{formData.platformFee}%</span>
                      </div>
                      <div className="flex justify-between text-sm font-medium text-primary">
                        <span>Token Holders</span>
                        <span>{100 - formData.maintenancePct - formData.platformFee}%</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border border-border rounded-lg space-y-3">
                    <div className="flex items-start gap-3">
                      <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">Pro-rata Payouts</p>
                        <p className="text-sm text-muted-foreground">
                          Rental earnings are distributed to token holders based on their share percentage. 
                          Members can claim payouts anytime by calling the smart contract.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {step === 5 && (
              <Card>
                <CardHeader>
                  <CardTitle>Review & Deploy</CardTitle>
                  <CardDescription>Confirm your pool details before deploying</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-medium text-muted-foreground uppercase text-xs tracking-wider">Item Details</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Title</span>
                          <span className="font-medium">{formData.title || 'Not set'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Category</span>
                          <span className="font-medium">{formData.category || 'Not set'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Location</span>
                          <span className="font-medium">{formData.location || 'Not set'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Photos</span>
                          <span className="font-medium">{images.length} uploaded</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-medium text-muted-foreground uppercase text-xs tracking-wider">Financials</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Total Shares</span>
                          <span className="font-medium">{formData.totalShares.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Share Price</span>
                          <span className="font-medium">${formData.sharePrice} USDC</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Target Raise</span>
                          <span className="font-medium">${(formData.totalShares * formData.sharePrice).toLocaleString()} USDC</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Deposit</span>
                          <span className="font-medium">${formData.depositAmount} USDC</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-medium text-muted-foreground uppercase text-xs tracking-wider">Rules</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Max Booking</span>
                          <span className="font-medium">{formData.maxBookingDays} days</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Advance Booking</span>
                          <span className="font-medium">{formData.advanceBookingDays} days</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Approval Required</span>
                          <Badge variant={formData.requiresApproval ? 'default' : 'secondary'}>
                            {formData.requiresApproval ? 'Yes' : 'No'}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-medium text-muted-foreground uppercase text-xs tracking-wider">Revenue</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Maintenance</span>
                          <span className="font-medium">{formData.maintenancePct}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">External Rentals</span>
                          <Badge variant={formData.rentalEnabled ? 'default' : 'secondary'}>
                            {formData.rentalEnabled ? 'Enabled' : 'Disabled'}
                          </Badge>
                        </div>
                        {formData.rentalEnabled && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Rental Price</span>
                            <span className="font-medium">${formData.rentalPricePerDay}/day</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {!isConnected && (
                    <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg flex items-center gap-3">
                      <Wallet className="w-5 h-5 text-amber-500" />
                      <p className="text-amber-500">Connect your wallet to deploy this pool</p>
                    </div>
                  )}

                  <div className="p-4 bg-primary/10 border border-primary/30 rounded-lg">
                    <p className="text-sm">
                      Deploying this pool will create a new smart contract on <strong>Polygon Amoy testnet</strong>. 
                      You will be the pool creator and can manage settings after deployment.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-between mt-8">
          <Button variant="outline" onClick={handleBack} disabled={step === 1}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Button>
          {step < 5 ? (
            <Button onClick={handleNext}>
              Next <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={handleDeploy} className="bg-gradient-to-r from-primary to-accent hover:opacity-90">
              <Upload className="w-4 h-4 mr-2" /> Deploy Pool
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}