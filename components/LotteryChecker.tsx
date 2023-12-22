'use client'

import { DM_Mono } from 'next/font/google'
import React, { useEffect, useState } from 'react'

const dmMono = DM_Mono({ subsets: ['latin'], weight: '500' })

interface LotteryNumber {
  decimo: string
  prize: number
  prizeType: string
}

interface UserNumberInfo {
  number: string
  isWinner?: boolean
  prizeInfo?: string
}

export function LotteryChecker() {
  const [userNumbers, setUserNumbers] = useState<UserNumberInfo[]>(() => {
    if (typeof window !== 'undefined') {
      return JSON.parse(localStorage.getItem('userNumbers') || '[]')
    }
    return []
  })
  const [inputNumber, setInputNumber] = useState<string>('')
  const [lastChecked, setLastChecked] = useState<Date | null>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('userNumbers', JSON.stringify(userNumbers))
    }
  }, [userNumbers])

  const fetchData = (): void => {
    fetch('https://search-lot.atresmedia.com/christmas_2023/result.json')
      .then((response) => response.json())
      .then((data) => {
        const winningNumbers: LotteryNumber[] = data.compruebe
        setUserNumbers((prevNumbers) =>
          prevNumbers
            .filter((num) => /^[0-9]{5}$/.test(num.number)) // Remove invalid numbers
            .map((num) => {
              const userNumber = num.number.padStart(6, '0')

              const isWinner = winningNumbers.some(
                (winNum) => winNum.decimo === userNumber
              )
              const prizeInfo = winningNumbers
                .find((winNum) => winNum.decimo === userNumber)
                ?.prize.toString()

              return isWinner
                ? {
                    ...num,
                    isWinner,
                    prizeInfo: prizeInfo?.substring(0, prizeInfo.length - 2)
                  }
                : num
            })
        )
        setLastChecked(new Date())
      })
      .catch((error) => console.error('Error fetching data:', error))
  }

  useEffect(() => {
    const interval = setInterval(fetchData, 10000)
    return () => clearInterval(interval)
  }, [])

  const addNumber = (
    e:
      | React.KeyboardEvent<HTMLInputElement>
      | React.MouseEvent<HTMLButtonElement>
      | null = null
  ): void => {
    if (e) {
      if ('key' in e && e.key !== 'Enter') {
        return
      }
      e.preventDefault()
    }

    // Add leading zeros to inputNumber if it's less than 5 digits
    const paddedNumber = inputNumber.padStart(5, '0')

    if (
      paddedNumber &&
      !userNumbers.some((num) => num.number === paddedNumber)
    ) {
      let existingNumbers = JSON.parse(
        localStorage.getItem('userNumbers') || '[]'
      )

      existingNumbers.push({ number: paddedNumber })

      localStorage.setItem('userNumbers', JSON.stringify(existingNumbers))

      setUserNumbers(existingNumbers)
      setInputNumber('')
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setInputNumber(e.target.value)
  }

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault()
    addNumber()
  }

  const removeNumber = (numberToRemove: string): void => {
    const updatedNumbers = userNumbers.filter(
      (num) => num.number !== numberToRemove
    )
    setUserNumbers(updatedNumbers)
    localStorage.setItem('userNumbers', JSON.stringify(updatedNumbers))
  }

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-red-400'>
      <div className='min-w-80 p-6 bg-white shadow-md rounded'>
        <h1 className='text-xl font-bold mb-4'>
          T&apos;ha tocat o t&apos;ha fet aire?
        </h1>
        <div className='flex flex-col space-y-4'>
          <form onSubmit={handleFormSubmit} className='flex flex-col space-y-4'>
            <input
              className='p-2 border border-gray-300 rounded'
              onChange={handleInputChange}
              onKeyDown={addNumber}
              pattern='^[0-9]{1,5}$'
              placeholder='Introduïu un número'
              title='Si us plau, introduïu un nombre de fins a 5 dígits'
              type='text'
              value={inputNumber}
            />
            <button
              type='submit'
              className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
            >
              Enxufa-li
            </button>
          </form>
          <ul>
            {userNumbers.map((num, index) => (
              <li
                key={index}
                className='flex justify-between font-semibold gap-8'
              >
                <span>
                  <button
                    className='mr-4 text-sm'
                    onClick={() => removeNumber(num.number)}
                  >
                    ❌
                  </button>
                  <span className={dmMono.className}>{num.number}</span>
                </span>
                <span>
                  {num.isWinner
                    ? `🏆 T'han tocat ${num.prizeInfo}€`
                    : "😤 T'ha fet aire..."}
                </span>
              </li>
            ))}
          </ul>
          <p>
            {lastChecked ? (
              <>Última comprovació: {lastChecked.toLocaleString()}</>
            ) : (
              <>Espera la primera comprovació...</>
            )}
          </p>
        </div>
      </div>
    </div>
  )
}
