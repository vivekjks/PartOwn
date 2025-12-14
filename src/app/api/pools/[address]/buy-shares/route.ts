import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { Pool, User } from '@/lib/models'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ address: string }> }
) {
  try {
    const { address } = await params
    const { buyer, shares, txHash } = await req.json()
    
    await connectDB()
    
    const pool = await Pool.findOne({ address: address.toLowerCase() })
    
    if (!pool) {
      return NextResponse.json({ error: 'Pool not found' }, { status: 404 })
    }
    
    if (!pool.members.includes(buyer.toLowerCase())) {
      pool.members.push(buyer.toLowerCase())
      await pool.save()
      
      await User.findOneAndUpdate(
        { address: buyer.toLowerCase() },
        { $push: { joinedPools: address.toLowerCase() } },
        { upsert: true }
      )
    }
    
    return NextResponse.json({ success: true, pool })
    
  } catch (error: any) {
    console.error('Buy shares error:', error)
    return NextResponse.json({ 
      error: error.message || 'Failed to process purchase' 
    }, { status: 500 })
  }
}
