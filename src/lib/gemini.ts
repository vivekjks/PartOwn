import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function analyzeImage(imageUrl: string, prompt: string): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

    const imageResponse = await fetch(imageUrl)
    const imageBuffer = await imageResponse.arrayBuffer()
    const base64Image = Buffer.from(imageBuffer).toString('base64')

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: base64Image,
          mimeType: 'image/jpeg'
        }
      }
    ])

    return result.response.text()
  } catch (error) {
    console.error('Gemini analysis error:', error)
    throw new Error('Failed to analyze image')
  }
}

export async function detectDamage(beforeImageUrl: string, afterImageUrl: string): Promise<{
  hasDamage: boolean
  damageDescription: string
  severity: 'minor' | 'moderate' | 'severe'
  estimatedCost: number
}> {
  const prompt = `Compare these two images of the same item. The first is the "before" image, the second is "after" use.
  
  Analyze for any damage, wear, or changes. Respond in JSON format:
  {
    "hasDamage": boolean,
    "damageDescription": "detailed description of any damage found",
    "severity": "minor" | "moderate" | "severe",
    "estimatedCost": estimated repair cost in USD
  }`

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

    const [beforeResponse, afterResponse] = await Promise.all([
      fetch(beforeImageUrl),
      fetch(afterImageUrl)
    ])

    const [beforeBuffer, afterBuffer] = await Promise.all([
      beforeResponse.arrayBuffer(),
      afterResponse.arrayBuffer()
    ])

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: Buffer.from(beforeBuffer).toString('base64'),
          mimeType: 'image/jpeg'
        }
      },
      {
        inlineData: {
          data: Buffer.from(afterBuffer).toString('base64'),
          mimeType: 'image/jpeg'
        }
      }
    ])

    const text = result.response.text()
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    
    if (!jsonMatch) {
      throw new Error('Invalid response format')
    }

    return JSON.parse(jsonMatch[0])
  } catch (error) {
    console.error('Damage detection error:', error)
    return {
      hasDamage: false,
      damageDescription: 'Unable to analyze damage',
      severity: 'minor',
      estimatedCost: 0
    }
  }
}

export async function analyzeItemCondition(imageUrl: string): Promise<{
  condition: 'excellent' | 'good' | 'fair' | 'poor'
  description: string
  suggestedPrice: number
}> {
  const prompt = `Analyze this item's condition based on the image. Consider wear, cleanliness, and overall state.
  
  Respond in JSON format:
  {
    "condition": "excellent" | "good" | "fair" | "poor",
    "description": "detailed condition assessment",
    "suggestedPrice": estimated market value in USD
  }`

  try {
    const analysis = await analyzeImage(imageUrl, prompt)
    const jsonMatch = analysis.match(/\{[\s\S]*\}/)
    
    if (!jsonMatch) {
      throw new Error('Invalid response format')
    }

    return JSON.parse(jsonMatch[0])
  } catch (error) {
    console.error('Condition analysis error:', error)
    return {
      condition: 'good',
      description: 'Unable to analyze condition',
      suggestedPrice: 0
    }
  }
}

export async function generateItemDescription(imageUrl: string): Promise<string> {
  const prompt = `Generate a detailed, appealing description for this item that would be suitable for a shared ownership platform. Include:
  - What the item is
  - Key features and specifications
  - Condition notes
  - Ideal use cases
  
  Keep it concise but informative (2-3 paragraphs).`

  try {
    return await analyzeImage(imageUrl, prompt)
  } catch (error) {
    console.error('Description generation error:', error)
    return 'Unable to generate description'
  }
}
