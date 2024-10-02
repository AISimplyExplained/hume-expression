import React from 'react';
import { Star } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

interface AchievementAlertDialogProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  title: string;
  description: string;
  buttonText?: string;
}

const AchievementAlertDialog: React.FC<AchievementAlertDialogProps> = ({
  open,
  setOpen,
  title,
  description,
  buttonText = "Awesome!"
}) => {
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
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent className="sm:max-w-[500px]">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center justify-center text-2xl font-bold text-yellow-500">
              <div className="mr-2 animate-rotate-z">
                <Star className="size-16" />
              </div>
              {title}
            </AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription className="text-center text-lg">
            {description}
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setOpen(false)} className="w-full bg-yellow-500 hover:bg-yellow-600">
              {buttonText}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default AchievementAlertDialog;