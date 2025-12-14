# PartOwn Deployment Guide

## Smart Contract Deployment

### Option 1: Deploy via Remix IDE (Recommended - Easiest)

1. Go to [Remix IDE](https://remix.ethereum.org/)
2. Create new files and copy contracts from `/contracts/` folder:
   - `MockUSDC.sol`
   - `PartOwnPool.sol`
   - `PoolFactory.sol`

3. Install OpenZeppelin contracts in Remix:
   - Click on the "Plugin Manager" icon
   - Activate "OPENZEPPELIN CONTRACTS" plugin

4. Compile contracts:
   - Select Solidity compiler 0.8.20
   - Click "Compile"

5. Deploy to Polygon Amoy:
   - Switch to "Deploy & Run Transactions" tab
   - Select "Injected Provider - MetaMask" environment
   - In MetaMask, switch to Polygon Amoy network (Chain ID: 80002)
   - Deploy in this order:
     a. Deploy **MockUSDC** (no constructor args)
     b. Copy MockUSDC address
     c. Deploy **PoolFactory** with MockUSDC address as constructor arg
     d. Copy PoolFactory address

6. Add addresses to `.env`:
```
NEXT_PUBLIC_USDC_ADDRESS=0x...
NEXT_PUBLIC_POOL_FACTORY_ADDRESS=0x...
```

### Option 2: Deploy via Hardhat (Advanced)

```bash
# Revert package.json type module change if needed
npx hardhat compile
npx hardhat run scripts/deploy.ts --network amoy
```

##Get Testnet Tokens

Get test POL/MATIC from faucets:
- https://faucet.polygon.technology/
- https://www.alchemy.com/faucets/polygon-amoy

## Environment Variables

Ensure your `.env` file has:

```env
# Blockchain
PRIVATE_KEY=0x...
POLYGON_AMOY_RPC=https://polygon-amoy.g.alchemy.com/v2/...
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=...
NEXT_PUBLIC_WC_PROJECT_ID=...

# After deployment
NEXT_PUBLIC_USDC_ADDRESS=0x...
NEXT_PUBLIC_POOL_FACTORY_ADDRESS=0x...

# Database
MONGODB_URI=mongodb+srv://...

# Storage
PINATA_API_KEY=...
PINATA_SECRET_KEY=...

# AI
GEMINI_API_KEY=...
```

## Test the Deployment

1. Get test USDC:
```
Visit your deployed MockUSDC contract on Amoy Polygonscan
Call `faucet()` function to mint 1000 USDC to your wallet
```

2. Create a test pool:
- Go to `/create` in the app
- Fill in pool details
- Deploy pool (requires POL for gas)

3. Purchase shares:
- Approve USDC spending
- Buy shares in the pool

## Verification (Optional)

Verify contracts on Polygonscan:
```bash
npx hardhat verify --network amoy <CONTRACT_ADDRESS> <CONSTRUCTOR_ARGS>
```

## Frontend

The app is already configured. Just ensure:
1. Smart contracts are deployed
2. `.env` has all required variables
3. Run `npm run dev` or `bun dev`
4. Connect your wallet to Polygon Amoy testnet
