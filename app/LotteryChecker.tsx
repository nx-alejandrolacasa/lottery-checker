'use client'

import React, { useEffect, useState } from 'react'

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

const LotteryChecker: React.FC = () => {
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

              return isWinner ? { ...num, isWinner, prizeInfo } : num
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

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-red-400'>
      <div className='p-6 bg-white shadow-md rounded'>
        <h1 className='text-xl font-bold mb-4'>Lottery Number Checker</h1>
        <div className='flex flex-col space-y-4'>
          <input
            className='p-2 border border-gray-300 rounded'
            onChange={handleInputChange}
            onKeyDown={addNumber}
            pattern='^[0-9]{1,5}$'
            placeholder='Enter a number'
            title='Please enter a number up to 5 digits'
            type='text'
            value={inputNumber}
          />
          <button
            onClick={addNumber}
            className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
          >
            Add Number
          </button>
          <ul>
            {userNumbers.map((num, index) => (
              <li key={index} className='flex justify-between font-semibold'>
                <span>{num.number}</span>
                <span>
                  {num.isWinner ? `🏆 - Prize: ${num.prizeInfo}` : '❌'}
                </span>
              </li>
            ))}
          </ul>
          {lastChecked && <p>Last checked: {lastChecked.toLocaleString()}</p>}
        </div>
      </div>
    </div>
  )
}

export default LotteryChecker
