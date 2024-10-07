import React, { useState, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Star } from "lucide-react";
import { useModule } from "@/lib/store";

const CourseFeedbackForm: React.FC = () => {
  const [rating, setRating] = useState<number>(0);
  const [feedback, setFeedback] = useState<string>("");
 
  const { moduleFinished, changeModuleFinished, title, changeSummary } = useModule();

  const handleRating = (selectedRating: number): void => {
    setRating(selectedRating);
  };

  const handleFeedback = (event: ChangeEvent<HTMLTextAreaElement>): void => {
    setFeedback(event.target.value);
  };

  const handleSubmit = (): void => {
    console.log("Rating:", rating);
    console.log("Feedback:", feedback);
    
    changeModuleFinished({ isFinished: false, title });
    changeSummary(true)
  };

  return (
    <Dialog open={moduleFinished}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Course Feedback</DialogTitle>
          <DialogDescription>
            Congratulations on completing the course! Please rate your
            understanding and provide feedback.
          </DialogDescription>
        </DialogHeader>
       
        
          <div className="mb-4">
            <p className="mb-2">
              How would you rate your understanding of {title}?
            </p>
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={24}
                  onClick={() => handleRating(star)}
                  fill={star <= rating ? "gold" : "none"}
                  stroke={star <= rating ? "gold" : "currentColor"}
                  className="cursor-pointer"
                />
              ))}
            </div>
          </div>
          <div className="mb-4">
            <Textarea
              placeholder="What could have helped you engage more deeply?"
              value={feedback}
              onChange={handleFeedback}
              className="mt-2"
            />
          </div>
        <DialogFooter>
          <Button onClick={handleSubmit}>Submit Feedback</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CourseFeedbackForm;