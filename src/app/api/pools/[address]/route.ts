import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { Pool } from '@/lib/models'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ address: string }> }
) {
  const { address } = await params
  
  await connectDB()
  
  const pool = await Pool.findOne({ address: address.toLowerCase() })
  
  if (!pool) {
    return NextResponse.json({ error: 'Pool not found' }, { status: 404 })
  }
  
  return NextResponse.json(pool)
}
