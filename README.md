# 🏠 PartOwn - Community Asset Pooling Platform

<div align="center">

**Co-own anything with on-chain shares on Polygon**

[![Built with Next.js](https://img.shields.io/badge/Built%20with-Next.js%2015-black)](https://nextjs.org/)
[![Polygon Amoy](https://img.shields.io/badge/Network-Polygon%20Amoy-8247E5)](https://polygon.technology/)
[![Smart Contracts](https://img.shields.io/badge/Smart%20Contracts-Solidity-blue)](https://soliditylang.org/)


</div>

---



## 📖 What is PartOwn?

PartOwn is a **decentralized platform** that enables fractional ownership of physical assets through blockchain technology. Whether it's cameras, drones, gaming setups, bikes, or any valuable equipment — PartOwn lets you **co-own with others**, share usage fairly, and earn from external rentals.

### 🎯 Key Features

- **🪙 Fractional Ownership** - Buy ERC-20 tokens representing ownership shares in high-value items
- **📅 Smart Scheduling** - AI-powered booking system with conflict resolution using Gemini AI
- **🔒 Secure Escrow** - Security deposits locked in smart contracts with automatic refunds
- **🏛️ DAO Governance** - Vote on repairs, rule changes, and buyouts with share-weighted voting
- **💰 Rental Revenue** - Rent to external users and earn revenue distributed pro-rata
- **🤖 AI-Powered** - Damage detection, receipt OCR, dispute resolution, and scheduling optimization
- **📱 Web3 Integration** - Connect with MetaMask, WalletConnect, and other Web3 wallets

---

## 🏗️ How It Works

### 1. **Create or Join a Pool**
Start a new pool for an item you want to co-own, or buy shares in existing pools. Each pool is backed by a deployed smart contract on Polygon Amoy.

### 2. **Book & Use**
Reserve time slots through our AI-powered scheduler. Check-in with photos, use the item, and check-out with damage detection.

### 3. **Govern & Earn**
- Vote on pool decisions (repairs, rule changes, buyouts)
- Split repair costs fairly from maintenance fund
- Earn from external rentals distributed to all token holders

---

## 🚀 Tech Stack

### **Frontend**
- **Next.js 15** (App Router) with TypeScript
- **TailwindCSS** for styling with custom design system
- **Radix UI** for accessible component primitives
- **Framer Motion** for animations
- **Wagmi v2** + **Viem** for blockchain interactions
- **WalletConnect** for multi-wallet support

### **Backend**
- **Next.js API Routes** (serverless functions)
- **MongoDB** with Mongoose for database
- **Pinata** for IPFS image storage
- **Google Gemini AI** for damage detection, OCR, scheduling

### **Blockchain**
- **Solidity 0.8.20** smart contracts
- **Hardhat** for development and deployment
- **Polygon Amoy Testnet** for fast, low-cost transactions
- **USDC** (Mock) for payments

---

## 📝 Smart Contract Architecture

### **Deployed Contracts (Polygon Amoy)**

| Contract | Address | Purpose |
|----------|---------|---------|
| **MockUSDC** | `0x1062B264e81b96b97fF6DD8eb883C276F687433B` | Test USDC token for payments |
| **PoolFactory** | `0x43Ef712ab45fcd879C77aEEa30EAC1e3fe2c685a` | Factory to deploy new pool contracts |

### **Smart Contracts Overview**

#### **1. MockUSDC**
- ERC-20 token contract for testnet payments
- Faucet function to mint test USDC
- Standard transfer/approve functionality

#### **2. PoolFactory**
- Deploys new `PartOwnPool` contracts
- Tracks all deployed pools
- Emits events for pool creation

#### **3. PartOwnPool** (Deployed per pool)
- ERC-20 tokens representing ownership shares
- Share purchase with USDC payments
- Booking deposits and refunds
- Maintenance fund management
- DAO voting for proposals
- Member buyouts

---

## 🛠️ Installation & Setup

### **Prerequisites**
- Node.js 18+ or Bun
- MongoDB database (local or Atlas)
- Pinata account for IPFS
- Google Gemini API key
- MetaMask or compatible Web3 wallet

 

### **2. Install Dependencies**
```bash
npm install
# or
bun install
```

### **3. Environment Variables**
Create a `.env` file in the root directory:

```env
# Blockchain
PRIVATE_KEY=your_wallet_private_key
POLYGON_AMOY_RPC=https://polygon-amoy.g.alchemy.com/v2/YOUR_KEY
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id

# Database
MONGODB_URI=your_mongodb_connection_string

# Storage
PINATA_API_KEY=your_pinata_api_key
PINATA_SECRET_KEY=your_pinata_secret_key

# AI
GEMINI_API_KEY=your_gemini_api_key

# Contract Addresses (Already Deployed)
NEXT_PUBLIC_USDC_ADDRESS=0x1062B264e81b96b97fF6DD8eb883C276F687433B
NEXT_PUBLIC_POOL_FACTORY_ADDRESS=0x43Ef712ab45fcd879C77aEEa30EAC1e3fe2c685a
```

### **4. Run Development Server**
```bash
npm run dev
# or
bun run dev
```

Open [http://localhost:3001](http://localhost:3001) in your browser.

---

## 🔗 API Routes

### **Authentication**
- `GET /api/auth/user?address={address}` - Get user profile
- `PATCH /api/auth/user` - Update user profile

### **Pools**
- `GET /api/pools` - List all pools (supports search, filters)
- `GET /api/pools/[address]` - Get pool details
- `POST /api/pools/create` - Create new pool (deploys contract)
- `POST /api/pools/[address]/buy-shares` - Purchase shares

### **Bookings**
- `GET /api/bookings` - List user bookings
- `POST /api/bookings/create` - Create booking
- `POST /api/bookings/[id]/checkin` - Check-in with damage detection

### **Proposals**
- `POST /api/proposals/create` - Create DAO proposal
- `POST /api/proposals/[id]/vote` - Vote on proposal

---

## 🎨 Pages

| Route | Description |
|-------|-------------|
| `/` | Landing page with features and stats |
| `/explore` | Browse all pools with search & filters |
| `/create` | Create new pool wizard |
| `/pool/[id]` | Pool detail page with buy shares & booking |
| `/dashboard` | User dashboard with pools, bookings, activity |
| `/profile` | User profile and settings |
| `/checkin/[bookingId]` | Check-in/out with photo upload |
| `/help` | Help center and FAQs |

---

## 🤝 User Flow

### **For New Users:**
1. Connect wallet (MetaMask/WalletConnect)
2. Complete profile setup (username, email)
3. Redirected to dashboard
4. Explore pools or create new one

### **Creating a Pool:**
1. Click "Create Pool" from navbar/dashboard
2. Fill in details (title, description, category, location)
3. Upload images (stored on IPFS via Pinata)
4. Set share price, maintenance %, deposit amount
5. Deploy contract (gas fee required)
6. Pool goes live in "funding" status

### **Joining a Pool:**
1. Browse explore page or pool detail
2. Click "Buy Shares"
3. Approve USDC spending
4. Transfer USDC to pool contract
5. Receive ownership tokens
6. Access booking and governance

### **Booking an Item:**
1. Go to pool detail page
2. Select dates in calendar
3. Pay deposit (held in escrow)
4. Receive booking confirmation
5. Check-in with photos before use
6. Check-out with photos after use
7. AI detects damage (if any)
8. Deposit refunded or deducted for repairs

---

## 🧪 Testing

### **Get Test USDC**
Call the `faucet()` function on MockUSDC contract:
```solidity
// Contract: 0x1062B264e81b96b97fF6DD8eb883C276F687433B
// Function: faucet()
// Mints: 1000 USDC to your address
```

### **Test Scenarios**
1. **Create Pool** - Test contract deployment
2. **Buy Shares** - Test USDC payment flow
3. **Booking** - Test deposit escrow
4. **Damage Detection** - Test AI check-in/out
5. **Proposals** - Test DAO voting

---

## 📚 Project Structure

```
partown-app/
├── contracts/              # Solidity smart contracts
│   ├── MockUSDC.sol
│   ├── PoolFactory.sol
│   └── PartOwnPool.sol
├── scripts/                # Deployment scripts
├── src/
│   ├── app/                # Next.js pages & API routes
│   │   ├── api/            # Backend API endpoints
│   │   ├── create/         # Create pool page
│   │   ├── dashboard/      # User dashboard
│   │   ├── explore/        # Browse pools
│   │   ├── pool/[id]/      # Pool detail
│   │   └── ...
│   ├── components/         # React components
│   │   ├── ui/             # Shadcn UI components
│   │   ├── navbar.tsx
│   │   └── ...
│   ├── lib/                # Utilities & config
│   │   ├── mongodb.ts      # Database connection
│   │   ├── models.ts       # Mongoose schemas
│   │   ├── gemini.ts       # AI services
│   │   ├── pinata.ts       # IPFS upload
│   │   └── wagmi-config.ts # Web3 config
│   └── hooks/              # Custom React hooks
├── .env                    # Environment variables
└── package.json
```

---

## 🛡️ Security Features

- **Smart Contract Escrow** - Deposits held on-chain, not by platform
- **Role-Based Access** - Only pool members can book & vote
- **Damage Detection AI** - Automatic photo comparison for accountability
- **Gas Optimized** - Efficient contract design to minimize fees
- **Testnet Deployment** - Safe testing environment

---

## 🌐 Network Details

**Polygon Amoy Testnet:**
- Chain ID: `80002`
- RPC URL: `https://rpc-amoy.polygon.technology/`
- Block Explorer: [https://www.oklink.com/amoy](https://www.oklink.com/amoy)
- Faucet: [https://faucet.polygon.technology/](https://faucet.polygon.technology/)

---

## 📞 Support & Contact

- **Issues:** [GitHub Issues](https://github.com/yourusername/partown-app/issues)
- **Documentation:** [GitHub Wiki](https://github.com/yourusername/partown-app/wiki)
- **Community:** Join our Discord (coming soon)

---

## 📄 License

This project is licensed under the MIT License.

---

## 🙏 Acknowledgments

- **Polygon** for scalable blockchain infrastructure
- **Next.js** for the amazing React framework
- **Gemini AI** for intelligent damage detection
- **Pinata** for decentralized storage
- **Shadcn UI** for beautiful components

---

<div align="center">

**Built with ❤️ for the decentralized future**

[Get Started](http://localhost:3001) · [Documentation](#) · [Report Bug](https://github.com/yourusername/partown-app/issues)

</div>
