'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { toast } from 'sonner'
import { 
  Search, 
  MessageCircle, 
  Book, 
  Shield, 
  Wallet, 
  Calendar,
  Vote,
  AlertTriangle,
  ExternalLink,
  Send
} from 'lucide-react'

const faqs = [
  {
    category: 'Getting Started',
    questions: [
      {
        q: 'How do I connect my wallet?',
        a: 'Click the "Connect Wallet" button in the navigation bar. We support MetaMask and other injected wallets. Make sure you\'re on the Polygon Amoy testnet.'
      },
      {
        q: 'How do I get testnet USDC?',
        a: 'Visit the Polygon Amoy faucet at faucet.polygon.technology to get free testnet MATIC. For USDC, you can use our built-in faucet in the Payments page.'
      },
      {
        q: 'What blockchain does PartOwn use?',
        a: 'PartOwn runs on Polygon Amoy testnet for fast, low-cost transactions. All payments are made in USDC stablecoin.'
      }
    ]
  },
  {
    category: 'Ownership & Shares',
    questions: [
      {
        q: 'How do ownership shares work?',
        a: 'When you buy shares in a pool, you receive ERC-20 tokens representing your ownership percentage. For example, if you own 100 shares out of 1000 total, you own 10% of the item.'
      },
      {
        q: 'Can I sell my shares?',
        a: 'Yes! You can transfer shares to another wallet, propose a buyout to other members, or participate in a group sale if the majority votes to sell the item.'
      },
      {
        q: 'How are rental earnings distributed?',
        a: 'Rental revenue is distributed pro-rata to all token holders. If you own 15% of shares, you receive 15% of the net rental income after platform fees and maintenance deductions.'
      }
    ]
  },
  {
    category: 'Bookings & Usage',
    questions: [
      {
        q: 'How do I book an item?',
        a: 'Go to the pool page, view the calendar, and select your dates. Pay the security deposit to confirm your booking. Some pools may require approval from other members.'
      },
      {
        q: 'What happens during check-in?',
        a: 'Take photos of the item before use and upload them through the app. Our AI analyzes the photos to establish the baseline condition. This protects you from being blamed for pre-existing damage.'
      },
      {
        q: 'What if I damage the item?',
        a: 'Report any damage immediately through the app. Upload photos and our AI will assess the severity. Repair costs come from the maintenance fund or may be deducted from your deposit.'
      }
    ]
  },
  {
    category: 'Governance & Voting',
    questions: [
      {
        q: 'How does voting work?',
        a: 'Each share equals one vote. Proposals need to reach a quorum (minimum participation) and majority approval to pass. You can vote on repairs, rule changes, and buyout offers.'
      },
      {
        q: 'What types of proposals can be created?',
        a: 'Members can propose repairs above a threshold, changes to booking rules, selling the item, or accepting buyout offers from members wanting to purchase remaining shares.'
      }
    ]
  }
]

export default function HelpPage() {
  const [search, setSearch] = useState('')
  const [contactForm, setContactForm] = useState({ email: '', subject: '', message: '' })

  const handleSubmit = async () => {
    if (!contactForm.email || !contactForm.message) {
      toast.error('Please fill in all required fields')
      return
    }
    toast.loading('Sending message...')
    await new Promise(r => setTimeout(r, 1500))
    toast.dismiss()
    toast.success('Message sent! We\'ll get back to you soon.')
    setContactForm({ email: '', subject: '', message: '' })
  }

  const filteredFaqs = faqs.map(category => ({
    ...category,
    questions: category.questions.filter(q => 
      q.q.toLowerCase().includes(search.toLowerCase()) ||
      q.a.toLowerCase().includes(search.toLowerCase())
    )
  })).filter(category => category.questions.length > 0)

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-4">Help Center</h1>
          <p className="text-muted-foreground mb-6">
            Find answers to common questions or contact our support team
          </p>
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search for help..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-4 mb-12">
          {[
            { icon: Book, label: 'Documentation', desc: 'Learn how PartOwn works' },
            { icon: Wallet, label: 'Payments', desc: 'USDC, deposits, payouts' },
            { icon: Calendar, label: 'Bookings', desc: 'Scheduling & check-in' },
            { icon: Vote, label: 'Governance', desc: 'Voting & proposals' },
          ].map((item) => (
            <Card key={item.label} className="hover:border-primary/30 transition-colors cursor-pointer">
              <CardContent className="pt-6 text-center">
                <item.icon className="w-8 h-8 mx-auto text-primary mb-3" />
                <h3 className="font-semibold">{item.label}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
          {filteredFaqs.length > 0 ? (
            <div className="space-y-6">
              {filteredFaqs.map((category) => (
                <div key={category.category}>
                  <h3 className="text-lg font-semibold mb-3 text-primary">{category.category}</h3>
                  <Accordion type="single" collapsible className="space-y-2">
                    {category.questions.map((faq, idx) => (
                      <AccordionItem key={idx} value={`${category.category}-${idx}`} className="border border-border rounded-lg px-4">
                        <AccordionTrigger className="hover:no-underline">
                          {faq.q}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">
                          {faq.a}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Search className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No results found for "{search}"</p>
              <Button variant="ghost" onClick={() => setSearch('')} className="mt-2">Clear search</Button>
            </div>
          )}
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              Contact Support
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={contactForm.email}
                onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                placeholder="Brief description of your issue"
                value={contactForm.subject}
                onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Message *</Label>
              <Textarea
                id="message"
                placeholder="Describe your issue or question in detail..."
                rows={5}
                value={contactForm.message}
                onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
              />
            </div>
            <Button onClick={handleSubmit} className="w-full gap-2">
              <Send className="w-4 h-4" /> Send Message
            </Button>
          </CardContent>
        </Card>

        <div className="mt-12 p-6 bg-muted rounded-xl">
          <div className="flex items-start gap-4">
            <AlertTriangle className="w-6 h-6 text-amber-500 shrink-0" />
            <div>
              <h3 className="font-semibold mb-2">Report a Dispute</h3>
              <p className="text-sm text-muted-foreground mb-3">
                If you have a dispute with another member regarding damage, bookings, or payouts, 
                you can file a formal dispute through the pool's governance system.
              </p>
              <Button variant="outline" size="sm">
                Learn About Disputes
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
