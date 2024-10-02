import { EnergyBadge } from '@/components/Energy'
import React from 'react'

type Props = {}

export default function page({}: Props) {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-800">
      <EnergyBadge energy={687} />
    </div> 

    )
}