import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { Booking } from '@/lib/models'
import { detectDamage } from '@/lib/gemini'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { images } = await req.json()
    
    if (!images || !images.length) {
      return NextResponse.json({ error: 'Images required' }, { status: 400 })
    }
    
    await connectDB()
    
    const booking = await Booking.findById(id)
    
    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }
    
    const damageResults = await Promise.all(
      images.map((img: string) => detectDamage(img))
    )
    
    const damaged = damageResults.some(r => r.damaged)
    const reports = damageResults.filter(r => r.damaged).map(r => r.report)
    
    booking.checkInImages = images
    booking.damageDetected = damaged
    booking.damageReport = reports.join('\n\n')
    booking.status = 'active'
    await booking.save()
    
    return NextResponse.json({ 
      success: true, 
      booking,
      damaged,
      report: booking.damageReport
    })
    
  } catch (error: any) {
    console.error('Check-in error:', error)
    return NextResponse.json({ 
      error: error.message || 'Failed to process check-in' 
    }, { status: 500 })
  }
}
