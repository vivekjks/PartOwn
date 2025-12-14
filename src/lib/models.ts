import mongoose, { Schema, model, models } from 'mongoose'

export interface IUser {
  address: string
  username?: string
  email?: string
  createdPools: number
  joinedPools: string[]
  bookings: string[]
  createdAt: Date
}

export interface IPool {
  address: string
  title: string
  description: string
  category: string
  location: string
  images: string[]
  totalShares: number
  sharePrice: number
  maintenancePct: number
  depositAmount: number
  maxBookingDays: number
  creator: string
  members: string[]
  currentFunding: number
  status: 'funding' | 'active' | 'closed'
  createdAt: Date
}

export interface IBooking {
  poolAddress: string
  user: string
  startDate: Date
  endDate: Date
  depositTxHash: string
  checkInImages?: string[]
  checkOutImages?: string[]
  damageDetected: boolean
  damageReport?: string
  status: 'pending' | 'active' | 'completed' | 'cancelled'
  createdAt: Date
}

export interface IProposal {
  poolAddress: string
  proposer: string
  title: string
  description: string
  type: 'maintenance' | 'rule' | 'upgrade' | 'other'
  votesFor: number
  votesAgainst: number
  voters: string[]
  status: 'active' | 'passed' | 'rejected'
  createdAt: Date
  endDate: Date
}

const UserSchema = new Schema<IUser>({
  address: { type: String, required: true, unique: true },
  username: String,
  email: { type: String, sparse: true },
  createdPools: { type: Number, default: 0 },
  joinedPools: [String],
  bookings: [String],
  createdAt: { type: Date, default: Date.now }
})

const PoolSchema = new Schema<IPool>({
  address: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  location: { type: String, required: true },
  images: [String],
  totalShares: { type: Number, required: true },
  sharePrice: { type: Number, required: true },
  maintenancePct: { type: Number, required: true },
  depositAmount: { type: Number, required: true },
  maxBookingDays: { type: Number, required: true },
  creator: { type: String, required: true },
  members: [String],
  currentFunding: { type: Number, default: 0 },
  status: { type: String, enum: ['funding', 'active', 'closed'], default: 'funding' },
  createdAt: { type: Date, default: Date.now }
})

const BookingSchema = new Schema<IBooking>({
  poolAddress: { type: String, required: true },
  user: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  depositTxHash: { type: String, required: true },
  checkInImages: [String],
  checkOutImages: [String],
  damageDetected: { type: Boolean, default: false },
  damageReport: String,
  status: { type: String, enum: ['pending', 'active', 'completed', 'cancelled'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
})

const ProposalSchema = new Schema<IProposal>({
  poolAddress: { type: String, required: true },
  proposer: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  type: { type: String, enum: ['maintenance', 'rule', 'upgrade', 'other'], required: true },
  votesFor: { type: Number, default: 0 },
  votesAgainst: { type: Number, default: 0 },
  voters: [String],
  status: { type: String, enum: ['active', 'passed', 'rejected'], default: 'active' },
  createdAt: { type: Date, default: Date.now },
  endDate: { type: Date, required: true }
})

export const User = models.User || model<IUser>('User', UserSchema)
export const Pool = models.Pool || model<IPool>('Pool', PoolSchema)
export const Booking = models.Booking || model<IBooking>('Booking', BookingSchema)
export const Proposal = models.Proposal || model<IProposal>('Proposal', ProposalSchema)