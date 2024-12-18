import { ThumbsDown, ThumbsUp } from "lucide-react";
import { Button } from "../ui/button";
import {
  DialogHeader,
  DialogFooter,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "../ui/dialog";

type DialogState = "initial" | "no" | "yes";

export const InitialDialog: React.FC<{
  handleClose: () => void;
  setDialogState: React.Dispatch<React.SetStateAction<DialogState>>;
  currentLesson: string
}> = ({ handleClose, setDialogState, currentLesson }) => (
  <DialogContent className="max-w-2xl">
    <DialogHeader>
      <DialogTitle className="text-2xl">
        Need a Hand with {currentLesson}?
      </DialogTitle>
      <DialogDescription className="text-lg mx-1">
        We&#39;ve noticed you might be feeling a bit stuck or disengaged with
        the material. Can we help you explore this concept in a different way?
      </DialogDescription>
    </DialogHeader>
    <DialogFooter className="flex mt-4 ">
      <Button onClick={handleClose}>
        No, I&#39;m good to proceed
      </Button>
      <Button onClick={() => setDialogState("yes")}>
        Yes, I could use some help
      </Button>
    </DialogFooter>
  </DialogContent>
);
