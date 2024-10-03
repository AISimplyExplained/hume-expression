"use client"
import React, { useEffect } from 'react';
import { Trophy } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Button } from '../ui/button';
import confetti from "canvas-confetti";


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
  const handleClick = () => {
    const end = Date.now() + 2 * 1000; // 2 seconds
    const colors = ["#a786ff", "#fd8bbc", "#eca184", "#f8deb1"];
 
    const frame = () => {
      if (Date.now() > end) return;
 
      // confetti({
      //   particleCount: 2,
      //   angle: 60,
      //   spread: 55,
      //   startVelocity: 60,
      //   origin: { x: 0, y: 0.5 },
      //   colors: colors,
      // });
      confetti({
        particleCount: 2,
        angle: 150,
        spread: 80,
        startVelocity: 60,
        origin: { x: 1, y: 0.5 },
        colors: colors,
      });
 
      requestAnimationFrame(frame);
    };
 
    frame();
  };

  useEffect(() => {
    if(open)handleClick();
  }, [open])

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
        <AlertDialogContent className="sm:max-w-[500px] bg-transparent border-none shadow-none">
          <AlertDialogTitle >
            <div className="flex items-center justify-center text-2xl font-bold text-yellow-500">
              <div className="mr-2 animate-rotate-z">
                <Trophy className="size-16" />
              </div>
              {title}
            </div>
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center text-lg text-white">
            {description}
          </AlertDialogDescription>
          <AlertDialogFooter className='flex justify-center sm:justify-center'>
            <AlertDialogAction onClick={() => setOpen(false)} className="bg-yellow-500 hover:bg-yellow-600 z-10">
              {"Hurrah"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default LevelDialog;