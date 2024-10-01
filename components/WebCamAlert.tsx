import React from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Camera } from 'lucide-react';
import { Button } from './ui/button';

interface Props {
  showAlertDialog: boolean;
  startWebCam: () => void;
  setShowWebCamAlert: React.Dispatch<React.SetStateAction<boolean>>;
}

const WebcamAlertDialog = ({showAlertDialog, startWebCam, setShowWebCamAlert}: Props) => {
  const handleAlert = () => {
    setShowWebCamAlert(false)
  }

  return (
    <AlertDialog open={showAlertDialog}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Enable Your Webcam</AlertDialogTitle>
          <AlertDialogDescription>
            We care about your learning experience! Enable your webcam to tailor your learning journey based on your engagement and emotions. Your data is secure and will only be used to help personalize your learning experience.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button onClick={handleAlert} variant={"outline"}>Cancel</Button>
          <AlertDialogAction onClick={startWebCam}>
            <Camera className="mr-2 h-4 w-4" />
            Start Webcam
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default WebcamAlertDialog;