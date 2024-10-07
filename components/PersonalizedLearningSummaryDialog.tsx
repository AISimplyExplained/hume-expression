import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useModule } from "@/lib/store";

interface Props {
  setShowEngagement: React.Dispatch<React.SetStateAction<boolean>>;
}

const PersonalizedLearningSummaryDialog: React.FC<Props> = ({setShowEngagement}) => {
  const {showSummary,changeSummary,changeModuleFinished} = useModule()

  const handleReviewJourney = () => {
    setShowEngagement(true)
  };

  const handleContinueLearning = () => {
    console.log("Navigating to continue learning page");
    changeModuleFinished({isFinished: false, title: ""})
    changeSummary(false)
  };

  return (
    <Dialog open={showSummary}>
      <DialogTrigger asChild>
        <Button variant="outline">View Learning Summary</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Learning Summary</DialogTitle>
          <DialogDescription>
            Your personalized progress report
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-gray-500">
            Here's your personalized learning summary: You excelled in Transformer
            Architectures with 85% engagement. We've identified areas where you
            could improve, and we've added refresher modules to your dashboard.
          </p>
        </div>
        <DialogFooter className="flex justify-between">
          <Button variant="outline" onClick={handleReviewJourney}>
            Review Your Journey
          </Button>
          <Button onClick={handleContinueLearning}>Continue Learning</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PersonalizedLearningSummaryDialog;