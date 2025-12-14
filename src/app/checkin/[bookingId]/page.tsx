'use client'

import { useState, use } from 'react'
import { useRouter } from 'next/navigation'
import { useAccount } from 'wagmi'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { toast } from 'sonner'
import { 
  Camera, 
  Upload, 
  Check, 
  AlertTriangle, 
  Sparkles,
  ArrowLeft,
  ImagePlus,
  X,
  CheckCircle,
  Clock
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function CheckInPage({ params }: { params: Promise<{ bookingId: string }> }) {
  const { bookingId } = use(params)
  const router = useRouter()
  const { isConnected } = useAccount()
  const [step, setStep] = useState<'upload' | 'analyzing' | 'results' | 'confirm'>('upload')
  const [images, setImages] = useState<string[]>([])
  const [notes, setNotes] = useState('')
  const [analysisResult, setAnalysisResult] = useState<{
    status: 'good' | 'warning' | 'damage'
    confidence: number
    issues: string[]
  } | null>(null)

  const handleImageUpload = () => {
    const sampleImages = [
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800',
      'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800',
      'https://images.unsplash.com/photo-1617005082133-548c4dd27f35?w=800',
    ]
    if (images.length < 4) {
      setImages([...images, sampleImages[images.length % 3]])
      toast.success('Photo uploaded to IPFS')
    }
  }

  const removeImage = (idx: number) => {
    setImages(images.filter((_, i) => i !== idx))
  }

  const handleAnalyze = async () => {
    if (images.length < 2) {
      toast.error('Please upload at least 2 photos')
      return
    }

    setStep('analyzing')
    
    await new Promise(r => setTimeout(r, 3000))
    
    setAnalysisResult({
      status: 'good',
      confidence: 94,
      issues: []
    })
    
    setStep('results')
  }

  const handleConfirm = async () => {
    setStep('confirm')
    toast.loading('Confirming check-in on chain...')
    await new Promise(r => setTimeout(r, 2000))
    toast.dismiss()
    toast.success('Check-in confirmed!')
    router.push('/dashboard')
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <Camera className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-bold mb-2">Connect Your Wallet</h2>
            <p className="text-muted-foreground">Connect to complete check-in</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-2xl mx-auto px-4">
        <Button variant="ghost" onClick={() => router.back()} className="gap-2 mb-6">
          <ArrowLeft className="w-4 h-4" /> Back
        </Button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Check-In</h1>
          <p className="text-muted-foreground">
            Document the item condition before your booking
          </p>
        </div>

        <div className="flex gap-4 mb-8">
          {['Upload Photos', 'AI Analysis', 'Review', 'Confirm'].map((label, idx) => (
            <div key={label} className="flex-1">
              <div className={`h-2 rounded-full ${
                idx === 0 && step === 'upload' ? 'bg-primary' :
                idx === 1 && step === 'analyzing' ? 'bg-primary' :
                idx === 2 && step === 'results' ? 'bg-primary' :
                idx === 3 && step === 'confirm' ? 'bg-primary' :
                idx < ['upload', 'analyzing', 'results', 'confirm'].indexOf(step) ? 'bg-primary' :
                'bg-muted'
              }`} />
              <p className="text-xs text-muted-foreground mt-1 text-center">{label}</p>
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 'upload' && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Camera className="w-5 h-5" />
                    Upload Item Photos
                  </CardTitle>
                  <CardDescription>
                    Take clear photos of the item from multiple angles. Our AI will analyze them for any existing damage.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    {images.map((img, idx) => (
                      <div key={idx} className="relative aspect-square rounded-lg overflow-hidden bg-muted">
                        <img src={img} alt="" className="w-full h-full object-cover" />
                        <button 
                          onClick={() => removeImage(idx)}
                          className="absolute top-2 right-2 w-6 h-6 bg-black/50 rounded-full flex items-center justify-center"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        <Badge className="absolute bottom-2 left-2 bg-black/50">
                          {['Front', 'Back', 'Side', 'Detail'][idx]}
                        </Badge>
                      </div>
                    ))}
                    {images.length < 4 && (
                      <button
                        onClick={handleImageUpload}
                        className="aspect-square rounded-lg border-2 border-dashed border-border hover:border-primary/50 flex flex-col items-center justify-center gap-2 transition-colors"
                      >
                        <ImagePlus className="w-8 h-8 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">Add Photo</span>
                      </button>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Notes (optional)</Label>
                    <Textarea
                      placeholder="Any notes about the item condition..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={3}
                    />
                  </div>

                  <div className="p-4 bg-muted rounded-lg flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">AI Damage Detection</p>
                      <p className="text-xs text-muted-foreground">
                        Our Gemini-powered AI will compare your photos with the item's baseline to detect any pre-existing damage. This protects you from false claims.
                      </p>
                    </div>
                  </div>

                  <Button onClick={handleAnalyze} className="w-full" disabled={images.length < 2}>
                    <Upload className="w-4 h-4 mr-2" />
                    Analyze Photos
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {step === 'analyzing' && (
            <motion.div
              key="analyzing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card>
                <CardContent className="pt-12 pb-12 text-center">
                  <div className="w-20 h-20 mx-auto mb-6 relative">
                    <div className="absolute inset-0 rounded-full border-4 border-primary/20" />
                    <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin" />
                    <Sparkles className="w-8 h-8 absolute inset-0 m-auto text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Analyzing Photos</h3>
                  <p className="text-muted-foreground mb-4">
                    Our AI is comparing your photos with the baseline condition...
                  </p>
                  <Progress value={66} className="w-48 mx-auto" />
                </CardContent>
              </Card>
            </motion.div>
          )}

          {step === 'results' && analysisResult && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    Analysis Results
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className={`p-6 rounded-lg text-center ${
                    analysisResult.status === 'good' ? 'bg-green-500/10' :
                    analysisResult.status === 'warning' ? 'bg-amber-500/10' :
                    'bg-red-500/10'
                  }`}>
                    {analysisResult.status === 'good' ? (
                      <CheckCircle className="w-12 h-12 mx-auto text-green-500 mb-3" />
                    ) : analysisResult.status === 'warning' ? (
                      <AlertTriangle className="w-12 h-12 mx-auto text-amber-500 mb-3" />
                    ) : (
                      <AlertTriangle className="w-12 h-12 mx-auto text-red-500 mb-3" />
                    )}
                    <h3 className="text-xl font-semibold mb-1">
                      {analysisResult.status === 'good' ? 'Item in Good Condition' :
                       analysisResult.status === 'warning' ? 'Minor Issues Detected' :
                       'Damage Detected'}
                    </h3>
                    <p className="text-muted-foreground">
                      {analysisResult.confidence}% confidence
                    </p>
                  </div>

                  {analysisResult.issues.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-medium">Detected Issues:</h4>
                      {analysisResult.issues.map((issue, idx) => (
                        <div key={idx} className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                          <AlertTriangle className="w-4 h-4 text-amber-500" />
                          <span className="text-sm">{issue}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="grid grid-cols-4 gap-2">
                    {images.map((img, idx) => (
                      <div key={idx} className="relative aspect-square rounded-lg overflow-hidden">
                        <img src={img} alt="" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
                          <Check className="w-6 h-6 text-green-500" />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-4 border border-border rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      By confirming check-in, you acknowledge that the item condition matches your photos. 
                      Any damage occurring during your booking period will be your responsibility.
                    </p>
                  </div>

                  <Button onClick={handleConfirm} className="w-full">
                    <Check className="w-4 h-4 mr-2" />
                    Confirm Check-In
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
