import React, { useEffect, useState } from 'react'
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';
import { Button } from './ui/button';
import { supabase } from '@/lib/utilities/supabase';
import { useBoredTime } from '@/lib/hooks/useBoredTime';

interface Props {
  sortedEmotion: {
    emotion: string;
    score: number;
  }[]
}

export default function Bored({ sortedEmotion }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [boredTime, setBoredTime] = useState(0);
  const { boredTime: boredServerTime } = useBoredTime()

  useEffect(() => {
    const interval = setInterval(() => {
      const isBored = () => {
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
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [sortedEmotion])

  useEffect(() => {
    if (boredTime >= boredServerTime) {
      setIsOpen(true);
    }
  }, [boredTime]);

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Warning</AlertDialogTitle>
          <AlertDialogDescription>
            I see that you&#39;re bored.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button onClick={() => setIsOpen(false)}>Okay</Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
