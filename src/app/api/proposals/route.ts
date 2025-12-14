import { NextResponse } from 'next/server'
import { mockProposals } from '@/lib/store'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const poolId = searchParams.get('poolId')
  
  const proposals = poolId 
    ? mockProposals.filter(p => p.poolId === poolId)
    : mockProposals
    
  return NextResponse.json({ proposals })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    const newProposal = {
      id: String(mockProposals.length + 1),
      ...body,
      votesFor: 0,
      votesAgainst: 0,
      quorum: 500,
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      status: 'active',
      createdAt: new Date(),
    }
    
    return NextResponse.json({ 
      success: true, 
      proposal: newProposal,
      message: 'Proposal created successfully'
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create proposal' }, { status: 500 })
  }
}
