"use client"
import React, { useEffect, useRef } from 'react';
import { Star, Trophy } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import Confetti, { ConfettiRef } from '../ui/confetti';

interface LevelDialogProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  title: string;
  description: string;
  level: number;
}

const LevelDialog: React.FC<LevelDialogProps> = ({
  open,
  setOpen,
  title,
  description,
  level
}) => {
  const confettiRef = useRef<ConfettiRef>(null);

  // useEffect(() => {
  //   confettiRef.current?.fire({});
  // }, [])

  return (
    <>
      <style jsx global>{`
        @keyframes rotate-z {
          0% {
            transform: rotateY(0deg);
          }
          100% {
            transform: rotateY(360deg);
          }
        }
        .animate-rotate-z {
          animation: rotate-z 3s linear infinite;
          transform-style: preserve-3d;
        }
      `}</style>
      <AlertDialog open={open} onOpenChange={setOpen} >
        <AlertDialogContent className="sm:max-w-[500px] bg-transparent border-none shadow-none h-screen flex flex-col justify-center">
            <div className="flex items-center justify-center text-2xl font-bold text-yellow-500">
              <div className="mr-2 animate-rotate-z">
                <Trophy className="size-16" />
              </div>
              {title}
            </div>
          <AlertDialogDescription className="text-center text-lg text-white">
            {description}
          </AlertDialogDescription>
          <AlertDialogFooter className='flex justify-center sm:justify-center'>
            <AlertDialogAction onClick={() => setOpen(false)} className="bg-yellow-500 hover:bg-yellow-600 z-10">
              {"Hurrah"}
            </AlertDialogAction>
          </AlertDialogFooter>
          <Confetti
            // options={{
            //   gravity: 0.5,
            //   particleCount: 50,
            // }}
            ref={confettiRef}
            // manualstart={false}
            className="absolute left-0 top-0 z-0 size-full"
          />
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default LevelDialog;