import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { Pool } from '@/lib/models'

export async function GET(req: NextRequest) {
  try {
    await connectDB()
    
    const { searchParams } = new URL(req.url)
    const limit = parseInt(searchParams.get('limit') || '20')
    const search = searchParams.get('search')
    const category = searchParams.get('category')
    const status = searchParams.get('status')
    const member = searchParams.get('member')
    
    const filter: any = {}
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } }
      ]
    }
    if (category) filter.category = category
    if (status) filter.status = status
    if (member) filter.members = member.toLowerCase()
    
    const pools = await Pool.find(filter).sort({ createdAt: -1 }).limit(limit)
    
    return NextResponse.json({ pools })
  } catch (error) {
    console.error('Error fetching pools:', error)
    return NextResponse.json({ error: 'Failed to fetch pools' }, { status: 500 })
  }
}