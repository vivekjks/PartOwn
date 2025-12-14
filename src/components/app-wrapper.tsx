'use client'

import { useState, useEffect } from 'react'
import { SplashScreen } from './splash-screen'

export function AppWrapper({ children }: { children: React.ReactNode }) {
  const [showSplash, setShowSplash] = useState(true)
  const [splashComplete, setSplashComplete] = useState(false)

  useEffect(() => {
    const hasSeenSplash = sessionStorage.getItem('splash-shown')
    if (hasSeenSplash) {
      setShowSplash(false)
      setSplashComplete(true)
    }
  }, [])

  const handleSplashComplete = () => {
    sessionStorage.setItem('splash-shown', 'true')
    setSplashComplete(true)
  }

  if (!splashComplete) {
    return <SplashScreen onComplete={handleSplashComplete} />
  }

  return <>{children}</>
}
