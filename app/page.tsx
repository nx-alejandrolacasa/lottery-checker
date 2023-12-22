import { LotteryChecker } from '@/components/LotteryChecker'
import { Snowflakes } from '@/components/Snowflakes'

export default function Home() {
  return (
    <main suppressHydrationWarning>
      <Snowflakes />
      <LotteryChecker />
    </main>
  )
}
