import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { Proposal } from '@/lib/models'

export async function POST(req: NextRequest) {
  try {
    const { poolAddress, proposer, title, description, type, durationDays } = await req.json()
    
    if (!poolAddress || !proposer || !title || !description || !type) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    
    await connectDB()
    
    const endDate = new Date()
    endDate.setDate(endDate.getDate() + (durationDays || 7))
    
    const proposal = await Proposal.create({
      poolAddress: poolAddress.toLowerCase(),
      proposer: proposer.toLowerCase(),
      title,
      description,
      type,
      endDate,
      voters: [],
      votesFor: 0,
      votesAgainst: 0,
      status: 'active'
    })
    
    return NextResponse.json({ success: true, proposal })
    
  } catch (error: any) {
    console.error('Proposal creation error:', error)
    return NextResponse.json({ 
      error: error.message || 'Failed to create proposal' 
    }, { status: 500 })
  }
}
