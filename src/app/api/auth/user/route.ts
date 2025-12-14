import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { User } from '@/lib/models'

export async function GET(req: NextRequest) {
  const address = req.nextUrl.searchParams.get('address')
  
  if (!address) {
    return NextResponse.json({ error: 'Address required' }, { status: 400 })
  }

  await connectDB()
  
  let user = await User.findOne({ address: address.toLowerCase() })
  
  if (!user) {
    user = await User.create({ address: address.toLowerCase() })
  }

  return NextResponse.json(user)
}

export async function PATCH(req: NextRequest) {
  const { address, username, email } = await req.json()
  
  if (!address) {
    return NextResponse.json({ error: 'Address required' }, { status: 400 })
  }

  await connectDB()
  
  const user = await User.findOneAndUpdate(
    { address: address.toLowerCase() },
    { username, email },
    { new: true, upsert: true }
  )

  return NextResponse.json(user)
}
