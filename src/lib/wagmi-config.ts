import { http, createConfig } from 'wagmi'
import { polygonAmoy } from 'wagmi/chains'
import { injected, walletConnect } from '@wagmi/connectors'

export const config = createConfig({
  chains: [polygonAmoy],
  connectors: [
    injected(),
    walletConnect({
      projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
    }),
  ],
  transports: {
    [polygonAmoy.id]: http(),
  },
})

export const USDC_ADDRESS = process.env.NEXT_PUBLIC_USDC_ADDRESS! as `0x${string}`
export const POOL_FACTORY_ADDRESS = process.env.NEXT_PUBLIC_POOL_FACTORY_ADDRESS! as `0x${string}`