'use client'

import { LotteryChecker } from '@/components/LotteryChecker'
import { Snowflakes } from '@/components/Snowflakes'
import { useEffect, useState } from 'react'

export default function Home() {
  const [isSSR, setIsSSR] = useState<boolean>(true)

  useEffect(() => {
    setIsSSR(false)
  }, [])

  return (
    <main suppressHydrationWarning>
      <Snowflakes />
      {!isSSR && <LotteryChecker />}
    </main>
  )
}
