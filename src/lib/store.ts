export interface Pool {
  id: string
  address: string
  title: string
  description: string
  images: string[]
  metadataCID: string
  totalShares: number
  sharePrice: number
  maintenancePct: number
  creator: string
  status: 'funding' | 'active' | 'closed'
  category: string
  location: string
  currentFunding: number
  members: number
  createdAt: Date
}

export interface Booking {
  id: string
  poolId: string
  user: string
  start: Date
  end: Date
  deposit: number
  status: 'requested' | 'approved' | 'active' | 'completed' | 'disputed'
  preUseCID?: string
  postUseCID?: string
  damageReportCID?: string
}

export interface Proposal {
  id: string
  poolId: string
  proposer: string
  type: 'repair' | 'sell' | 'rule_change' | 'buyout'
  title: string
  description: string
  data: string
  votesFor: number
  votesAgainst: number
  quorum: number
  deadline: Date
  status: 'active' | 'passed' | 'rejected' | 'executed'
}

export interface User {
  wallet: string
  email?: string
  name?: string
  avatar?: string
  kycStatus: 'none' | 'pending' | 'verified'
}

export const mockPools: Pool[] = [
  {
    id: '1',
    address: '0x1234567890abcdef1234567890abcdef12345678',
    title: 'Sony A7 IV Camera Kit',
    description: 'Professional mirrorless camera with 3 lenses, tripod, and lighting kit. Perfect for content creators and photographers.',
    images: [
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800',
      'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800'
    ],
    metadataCID: 'QmXyz...',
    totalShares: 1000,
    sharePrice: 10,
    maintenancePct: 200,
    creator: '0xabcdef1234567890abcdef1234567890abcdef12',
    status: 'active',
    category: 'Electronics',
    location: 'New York, NY',
    currentFunding: 8500,
    members: 12,
    createdAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    address: '0xabcdef1234567890abcdef1234567890abcdef12',
    title: 'DJI Mavic 3 Pro Drone',
    description: 'High-end professional drone with 4/3 CMOS Hasselblad camera, 46-min flight time, and advanced obstacle sensing.',
    images: [
      'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=800',
      'https://images.unsplash.com/photo-1507582020474-9a35b7d455d9?w=800'
    ],
    metadataCID: 'QmAbc...',
    totalShares: 500,
    sharePrice: 20,
    maintenancePct: 300,
    creator: '0x9876543210fedcba9876543210fedcba98765432',
    status: 'active',
    category: 'Electronics',
    location: 'Los Angeles, CA',
    currentFunding: 10000,
    members: 8,
    createdAt: new Date('2024-02-20'),
  },
  {
    id: '3',
    address: '0x9876543210fedcba9876543210fedcba98765432',
    title: 'PlayStation 5 Gaming Setup',
    description: 'PS5 Digital Edition with 2 controllers, VR2 headset, and 15 top games. Ideal for gaming enthusiasts.',
    images: [
      'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=800',
      'https://images.unsplash.com/photo-1592155931584-901ac15763e3?w=800'
    ],
    metadataCID: 'QmDef...',
    totalShares: 200,
    sharePrice: 5,
    maintenancePct: 100,
    creator: '0x1111222233334444555566667777888899990000',
    status: 'funding',
    category: 'Gaming',
    location: 'Chicago, IL',
    currentFunding: 650,
    members: 5,
    createdAt: new Date('2024-03-10'),
  },
  {
    id: '4',
    address: '0x1111222233334444555566667777888899990000',
    title: 'Electric Mountain Bike',
    description: 'Specialized Turbo Levo SL e-MTB with carbon frame, 150km range, and full suspension for trail adventures.',
    images: [
      'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=800',
      'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=800'
    ],
    metadataCID: 'QmGhi...',
    totalShares: 800,
    sharePrice: 15,
    maintenancePct: 250,
    creator: '0xaaaa bbbbccccddddeeeeffffgggghhhhiiiijjjj',
    status: 'active',
    category: 'Sports',
    location: 'Denver, CO',
    currentFunding: 12000,
    members: 15,
    createdAt: new Date('2024-01-05'),
  },
]

export const mockBookings: Booking[] = [
  {
    id: '1',
    poolId: '1',
    user: '0xuser1...',
    start: new Date('2024-12-15'),
    end: new Date('2024-12-17'),
    deposit: 50,
    status: 'approved',
  },
  {
    id: '2',
    poolId: '1',
    user: '0xuser2...',
    start: new Date('2024-12-20'),
    end: new Date('2024-12-22'),
    deposit: 50,
    status: 'requested',
  },
]

export const mockProposals: Proposal[] = [
  {
    id: '1',
    poolId: '1',
    proposer: '0xuser1...',
    type: 'repair',
    title: 'Replace camera lens cap',
    description: 'The original lens cap was lost during last booking. Estimated cost: 25 USDC',
    data: '0x...',
    votesFor: 850,
    votesAgainst: 50,
    quorum: 500,
    deadline: new Date('2024-12-20'),
    status: 'active',
  },
]

export const categories = [
  'Electronics',
  'Gaming',
  'Sports',
  'Photography',
  'Music',
  'Tools',
  'Vehicles',
  'Other',
]
