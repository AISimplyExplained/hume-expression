import React, { useEffect, useState } from 'react'
import { Button } from '../ui/button'
import { X } from 'lucide-react'

interface Props {
  topic: string
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  setBoredTime: React.Dispatch<React.SetStateAction<number>>
}

export default function UseCase({ setIsOpen, topic , setBoredTime}: Props) {
  const [uses, setUses] = useState<string[]>([])

  const getRes = async () => {
    setUses([])
    try {
      const res = await fetch("/api/use-case", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ topic: topic }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      setUses(data.res.points)
    } catch (error) {
      console.error('Error:', error);
    }
  }

  useEffect(() => {
    if (uses.length === 0) {
      getRes();
    }
  }, [])


  return (
    <div className="p-1">
      <Button
        variant={"ghost"}
        className="absolute right-2 top-2"
        onClick={() => {
          setIsOpen(false)
          setBoredTime(-2)
        }}
      >
        <X className="h-5 w-5 text-gray-500 hover:text-gray-700" />
      </Button>

      <h3 className="text-2xl font-bold text-center text-gray-800 mb-4">
        Real-world Application
      </h3>

      <h1 className="text-xl font-semibold text-center text-blue-600 mb-4">
        {topic}
      </h1>

      {uses.length <= 0 ? (
        <div className="text-center text-gray-500">Loading...</div>
      ) : (
        <>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            {uses.map((val, i) => (
              <li key={i + "val"} className="pl-2 text-lg">
                {val}
              </li>
            ))}
          </ul>
          <Button className='w-full mt-4' onClick={getRes} >New Use Case</Button>
        </>
      )}
    </div>
  )
}
