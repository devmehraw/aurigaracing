"use client"

import { useState, useEffect } from "react"

function getEndOfDay() {
  const now = new Date()
  const end = new Date(now)
  end.setHours(23, 59, 59, 999)
  return end
}

function getTimeRemaining(endTime: Date) {
  const total = endTime.getTime() - new Date().getTime()
  if (total <= 0) return { hours: 0, minutes: 0, seconds: 0 }
  const seconds = Math.floor((total / 1000) % 60)
  const minutes = Math.floor((total / 1000 / 60) % 60)
  const hours = Math.floor(total / (1000 * 60 * 60))
  return { hours, minutes, seconds }
}

export function DealCountdown() {
  const [endTime] = useState(getEndOfDay)
  const [time, setTime] = useState(getTimeRemaining(endTime))

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(getTimeRemaining(endTime))
    }, 1000)
    return () => clearInterval(timer)
  }, [endTime])

  const pad = (n: number) => String(n).padStart(2, "0")

  return (
    <div className="flex gap-4 justify-center items-center">
      <div className="text-center">
        <div className="bg-black text-white px-6 py-4 rounded-lg text-2xl md:text-3xl font-bold min-w-[80px] tabular-nums">
          {pad(time.hours)}
        </div>
        <p className="text-sm mt-2 font-medium">Hours</p>
      </div>
      <div className="text-2xl font-bold">:</div>
      <div className="text-center">
        <div className="bg-black text-white px-6 py-4 rounded-lg text-2xl md:text-3xl font-bold min-w-[80px] tabular-nums">
          {pad(time.minutes)}
        </div>
        <p className="text-sm mt-2 font-medium">Minutes</p>
      </div>
      <div className="text-2xl font-bold">:</div>
      <div className="text-center">
        <div className="bg-black text-white px-6 py-4 rounded-lg text-2xl md:text-3xl font-bold min-w-[80px] tabular-nums">
          {pad(time.seconds)}
        </div>
        <p className="text-sm mt-2 font-medium">Seconds</p>
      </div>
    </div>
  )
}
