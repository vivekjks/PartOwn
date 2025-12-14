import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { Booking, User, Pool } from '@/lib/models'

export async function POST(req: NextRequest) {
  try {
    const { poolAddress, user, startDate, endDate, depositTxHash } = await req.json()
    
    if (!poolAddress || !user || !startDate || !endDate || !depositTxHash) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    
    await connectDB()
    
    const pool = await Pool.findOne({ address: poolAddress.toLowerCase() })
    
    if (!pool) {
      return NextResponse.json({ error: 'Pool not found' }, { status: 404 })
    }
    
    const booking = await Booking.create({
      poolAddress: poolAddress.toLowerCase(),
      user: user.toLowerCase(),
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      depositTxHash,
      status: 'pending'
    })
    
    await User.findOneAndUpdate(
      { address: user.toLowerCase() },
      { $push: { bookings: booking._id.toString() } },
      { upsert: true }
    )
    
    return NextResponse.json({ success: true, booking })
    
  } catch (error: any) {
    console.error('Booking creation error:', error)
    return NextResponse.json({ 
      error: error.message || 'Failed to create booking' 
    }, { status: 500 })
  }
}
