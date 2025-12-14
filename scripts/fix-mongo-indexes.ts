import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://squizzy143:8Y8RtvZlsI4qr49C@nikhil2.gt73u.mongodb.net/?retryWrites=true&w=majority&appName=nikhil2'

async function fixIndexes() {
  try {
    await mongoose.connect(MONGODB_URI)
    console.log('Connected to MongoDB')

    const db = mongoose.connection.db
    if (!db) throw new Error('Database connection not established')

    // Drop the problematic email index on users collection
    try {
      await db.collection('users').dropIndex('email_1')
      console.log('✓ Dropped email_1 index')
    } catch (error: any) {
      if (error.code === 27) {
        console.log('Index email_1 does not exist, skipping')
      } else {
        console.error('Error dropping index:', error.message)
      }
    }

    // Recreate with sparse option
    await db.collection('users').createIndex({ email: 1 }, { sparse: true, unique: true })
    console.log('✓ Created sparse unique index on email')

    await mongoose.disconnect()
    console.log('✓ Done! Indexes fixed successfully')
  } catch (error) {
    console.error('Error fixing indexes:', error)
    process.exit(1)
  }
}

fixIndexes()
