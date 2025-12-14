import { NextRequest, NextResponse } from 'next/server'
import { detectDamage } from '@/lib/gemini'

export async function POST(req: NextRequest) {
  try {
    const { beforeImageUrl, afterImageUrl } = await req.json()

    if (!beforeImageUrl || !afterImageUrl) {
      return NextResponse.json(
        { error: 'Both before and after images required' },
        { status: 400 }
      )
    }

    const result = await detectDamage(beforeImageUrl, afterImageUrl)
    return NextResponse.json(result)
  } catch (error) {
    console.error('Damage detection error:', error)
    return NextResponse.json({ error: 'Detection failed' }, { status: 500 })
  }
}
