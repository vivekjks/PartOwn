import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { User, Pool } from '@/lib/models'
import { uploadJSONToPinata } from '@/lib/pinata'
import { ethers } from 'ethers'

const POOL_FACTORY_ABI = [
  "function createPool(string memory name, string memory symbol, string memory metadataCID, uint256 totalShares, uint256 sharePrice, uint256 maintenancePct) external returns (address)"
]

export async function POST(req: NextRequest) {
  try {
    const { 
      creator, 
      title, 
      description, 
      category, 
      location, 
      images, 
      totalShares, 
      sharePrice, 
      maintenancePct, 
      depositAmount, 
      maxBookingDays 
    } = await req.json()

    if (!creator) {
      return NextResponse.json({ error: 'Creator address required' }, { status: 400 })
    }

    await connectDB()

    const user = await User.findOne({ address: creator.toLowerCase() })
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    if (user.createdPools >= 3) {
      return NextResponse.json({ 
        error: 'Pool creation limit reached. Please upgrade.',
        needsUpgrade: true 
      }, { status: 403 })
    }

    const metadata = {
      title,
      description,
      category,
      location,
      images
    }
    
    const metadataURI = await uploadJSONToPinata(metadata)

    const provider = new ethers.JsonRpcProvider(process.env.POLYGON_AMOY_RPC!)
    const signer = new ethers.Wallet(process.env.PRIVATE_KEY!, provider)
    const factory = new ethers.Contract(
      process.env.NEXT_PUBLIC_POOL_FACTORY_ADDRESS!,
      POOL_FACTORY_ABI,
      signer
    )

    const sharePriceWei = ethers.parseUnits(sharePrice.toString(), 6)
    
    // Generate symbol from title (first 3 letters uppercase)
    const symbol = title.slice(0, 3).toUpperCase() || 'POOL'

    const tx = await factory.createPool(
      title,
      symbol,
      metadataURI,
      totalShares,
      sharePriceWei,
      maintenancePct * 100 // Convert percentage to basis points
    )

    const receipt = await tx.wait()
    
    // Get pool address from PoolCreated event
    const poolCreatedEvent = receipt.logs.find((log: any) => {
      try {
        const parsed = factory.interface.parseLog(log)
        return parsed?.name === 'PoolCreated'
      } catch {
        return false
      }
    })
    
    let poolAddress
    if (poolCreatedEvent) {
      const parsed = factory.interface.parseLog(poolCreatedEvent)
      poolAddress = parsed?.args[0]
    } else {
      // Fallback: get from logs
      poolAddress = receipt.logs[0].address
    }

    const pool = await Pool.create({
      address: poolAddress.toLowerCase(),
      title,
      description,
      category,
      location,
      images,
      totalShares,
      sharePrice,
      maintenancePct,
      depositAmount,
      maxBookingDays,
      creator: creator.toLowerCase(),
      members: [],
      status: 'funding',
      currentFunding: 0
    })

    await User.findOneAndUpdate(
      { address: creator.toLowerCase() },
      { 
        $inc: { createdPools: 1 },
        $push: { joinedPools: poolAddress.toLowerCase() }
      }
    )

    return NextResponse.json({ 
      success: true, 
      poolAddress,
      poolId: pool._id.toString(),
      metadataURI
    })

  } catch (error: any) {
    console.error('Pool creation error:', error)
    return NextResponse.json({ 
      error: error.message || 'Failed to create pool' 
    }, { status: 500 })
  }
}