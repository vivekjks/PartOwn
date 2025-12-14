import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { Booking } from '@/lib/models'

export async function GET(req: NextRequest) {
  try {
    await connectDB()
    
    const { searchParams } = new URL(req.url)
    const user = searchParams.get('user')
    const poolAddress = searchParams.get('poolAddress')
    const status = searchParams.get('status')
    
    const filter: any = {}
    if (user) filter.user = user.toLowerCase()
    if (poolAddress) filter.poolAddress = poolAddress.toLowerCase()
    if (status) filter.status = status
    
    const bookings = await Booking.find(filter).sort({ createdAt: -1 })
    
    return NextResponse.json({ bookings })
  } catch (error) {
    console.error('Error fetching bookings:', error)
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 })
  }
}
