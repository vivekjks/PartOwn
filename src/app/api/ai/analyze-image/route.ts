import { NextRequest, NextResponse } from 'next/server'
import { analyzeItemCondition, generateItemDescription } from '@/lib/gemini'

export async function POST(req: NextRequest) {
  try {
    const { imageUrl, action } = await req.json()

    if (!imageUrl) {
      return NextResponse.json({ error: 'Image URL required' }, { status: 400 })
    }

    if (action === 'condition') {
      const result = await analyzeItemCondition(imageUrl)
      return NextResponse.json(result)
    } else if (action === 'description') {
      const description = await generateItemDescription(imageUrl)
      return NextResponse.json({ description })
    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error) {
    console.error('AI analysis error:', error)
    return NextResponse.json({ error: 'Analysis failed' }, { status: 500 })
  }
}
