'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { 
  Check, 
  Zap, 
  Sparkles, 
  Crown, 
  Rocket,
  Shield,
  Users,
  TrendingUp,
  Heart
} from 'lucide-react'

const plans = [
  {
    name: 'Free',
    description: 'Perfect for trying out PartOwn',
    price: { monthly: 0, annual: 0 },
    icon: Heart,
    features: [
      '1 Active Pool',
      'Up to 10 members per pool',
      'Basic booking system',
      'Community support',
      'Standard AI scheduling',
      '5% platform fee'
    ],
    limitations: [
      'No external rentals',
      'No custom branding',
      'Limited analytics'
    ],
    cta: 'Get Started',
    popular: false
  },
  {
    name: 'Pro',
    description: 'For serious co-owners',
    price: { monthly: 29, annual: 290 },
    icon: Zap,
    features: [
      '5 Active Pools',
      'Unlimited members',
      'Priority AI scheduling',
      'External rental revenue',
      'Advanced analytics',
      'Priority support',
      '3% platform fee',
      'Custom pool branding',
      'Damage detection AI'
    ],
    limitations: [],
    cta: 'Start Pro Trial',
    popular: true
  },
  {
    name: 'Enterprise',
    description: 'For organizations & communities',
    price: { monthly: 99, annual: 990 },
    icon: Crown,
    features: [
      'Unlimited Pools',
      'Unlimited members',
      'White-label options',
      'Custom smart contracts',
      'API access',
      'Dedicated account manager',
      '1.5% platform fee',
      'Advanced AI features',
      'Custom integrations',
      'On-chain governance tools'
    ],
    limitations: [],
    cta: 'Contact Sales',
    popular: false
  }
]

const features = [
  {
    icon: Shield,
    title: 'Smart Contract Security',
    description: 'All pools secured by audited smart contracts on Polygon'
  },
  {
    icon: Users,
    title: 'DAO Governance',
    description: 'Democratic voting on repairs, rules, and proposals'
  },
  {
    icon: TrendingUp,
    title: 'Revenue Sharing',
    description: 'Automatic pro-rata distribution of rental income'
  },
  {
    icon: Sparkles,
    title: 'AI-Powered',
    description: 'Damage detection, scheduling, and dispute resolution'
  }
]

export default function PricingPage() {
  const [annual, setAnnual] = useState(false)

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4">Pricing</Badge>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            Choose your <span className="gradient-text">ownership plan</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Start free and scale as you grow. All plans include blockchain security and AI features.
          </p>
          
          <div className="flex items-center justify-center gap-3">
            <span className={!annual ? 'font-medium' : 'text-muted-foreground'}>Monthly</span>
            <Switch checked={annual} onCheckedChange={setAnnual} />
            <span className={annual ? 'font-medium' : 'text-muted-foreground'}>
              Annual <Badge variant="secondary" className="ml-2">Save 20%</Badge>
            </span>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan) => (
            <Card 
              key={plan.name}
              className={`relative ${plan.popular ? 'border-primary shadow-xl scale-105' : ''}`}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary to-accent">
                  Most Popular
                </Badge>
              )}
              
              <CardHeader className="text-center pb-8">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <plan.icon className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="mt-4">
                  <div className="text-4xl font-bold">
                    ${annual ? plan.price.annual : plan.price.monthly}
                    {plan.price.monthly > 0 && (
                      <span className="text-lg text-muted-foreground font-normal">
                        /{annual ? 'year' : 'month'}
                      </span>
                    )}
                  </div>
                  {annual && plan.price.monthly > 0 && (
                    <p className="text-sm text-muted-foreground mt-1">
                      ${(plan.price.annual / 12).toFixed(2)}/month billed annually
                    </p>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
                
                <Button 
                  className={`w-full ${plan.popular ? 'bg-gradient-to-r from-primary to-accent hover:opacity-90' : ''}`}
                  variant={plan.popular ? 'default' : 'outline'}
                  asChild
                >
                  <Link href={plan.name === 'Enterprise' ? '/contact' : '/create'}>
                    {plan.cta}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">
            Why choose PartOwn?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <Card key={feature.title} className="text-center">
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
          <CardHeader className="text-center">
            <Rocket className="w-12 h-12 text-primary mx-auto mb-4" />
            <CardTitle className="text-2xl">Ready to start co-owning?</CardTitle>
            <CardDescription>
              Join thousands of people sharing ownership of cameras, drones, bikes, and more
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center gap-4">
            <Button size="lg" asChild>
              <Link href="/create">Create Your Pool</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/explore">Explore Pools</Link>
            </Button>
          </CardContent>
        </Card>

        <div className="mt-16">
          <h3 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h3>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              {
                q: 'Can I upgrade or downgrade anytime?',
                a: 'Yes! You can change your plan at any time. Upgrades take effect immediately, and downgrades at the end of your billing period.'
              },
              {
                q: 'What payment methods do you accept?',
                a: 'We accept USDC payments on Polygon Amoy for pool transactions. Subscription payments can be made with credit cards or crypto.'
              },
              {
                q: 'Is there a free trial for paid plans?',
                a: 'Yes! Pro and Enterprise plans come with a 14-day free trial. No credit card required to start.'
              },
              {
                q: 'What happens to my pools if I cancel?',
                a: 'Your pools remain on-chain forever. You can always view and manage them, but new features will be limited to the Free plan.'
              }
            ].map((faq, idx) => (
              <Card key={idx}>
                <CardHeader>
                  <CardTitle className="text-lg">{faq.q}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{faq.a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
