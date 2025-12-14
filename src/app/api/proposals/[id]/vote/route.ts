import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { Proposal } from '@/lib/models'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { voter, support } = await req.json()
    
    if (!voter || support === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    
    await connectDB()
    
    const proposal = await Proposal.findById(id)
    
    if (!proposal) {
      return NextResponse.json({ error: 'Proposal not found' }, { status: 404 })
    }
    
    if (proposal.status !== 'active') {
      return NextResponse.json({ error: 'Proposal is not active' }, { status: 400 })
    }
    
    if (proposal.voters.includes(voter.toLowerCase())) {
      return NextResponse.json({ error: 'Already voted' }, { status: 400 })
    }
    
    proposal.voters.push(voter.toLowerCase())
    
    if (support) {
      proposal.votesFor += 1
    } else {
      proposal.votesAgainst += 1
    }
    
    if (new Date() > proposal.endDate) {
      proposal.status = proposal.votesFor > proposal.votesAgainst ? 'passed' : 'rejected'
    }
    
    await proposal.save()
    
    return NextResponse.json({ success: true, proposal })
    
  } catch (error: any) {
    console.error('Vote error:', error)
    return NextResponse.json({ 
      error: error.message || 'Failed to process vote' 
    }, { status: 500 })
  }
}
