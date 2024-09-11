import React, { useEffect, useState } from 'react'
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';
import { Button } from './ui/button';
import { supabase } from '@/lib/utilities/supabase';
import { useBoredTime } from '@/lib/hooks/useBoredTime';

interface Props {
  sortedEmotion: {
    emotion: string;
    score: number;
  }[],

}

export default function Bored({ sortedEmotion }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const [boredTime, setBoredTime] = useState(0);
  const { boredTime: boredServerTime } = useBoredTime()

  useEffect(() => {
    const interval = setInterval(() => {
      const isBored = () => {
        if (sortedEmotion.length === 0) {
          setIsOpen(false)
          return false;
        }
        for (let i = 0; i < sortedEmotion.length; i++) {
          if (sortedEmotion[i].score < 0.4) {
            return false;
          }
          if (sortedEmotion[i].emotion === "Boredom" || sortedEmotion[i].emotion === "Disappointment") {
            return true;
          }
        }
        return false;
      }
      if (isBored()) {
        setBoredTime(prev => prev + 1)
      } else {
        setBoredTime(0)
        setIsOpen(false)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [sortedEmotion])

  useEffect(() => {
    if (boredTime === boredServerTime && !isOpen) {
      setIsOpen(true);
    }

  }, [boredTime, isOpen, boredServerTime]);

  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Warning</AlertDialogTitle>
          <AlertDialogDescription>
            I see that you&#39;re bored.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button onClick={() => {
            setBoredTime(0)
            setIsOpen(false)
          }}>Okay</Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
