import { ThumbsDown, ThumbsUp } from "lucide-react";
import { Button } from "../ui/button";
import { DialogHeader, DialogFooter, DialogContent, DialogDescription, DialogTitle } from "../ui/dialog";

type DialogState = "initial" | "no" | "yes";

export const InitialDialog: React.FC<{
  handleClose: () => void;
  setDialogState: React.Dispatch<React.SetStateAction<DialogState>>;
}> = ({ handleClose, setDialogState }) => (
  <DialogContent className="max-w-2xl">
    <DialogHeader>
      <DialogTitle className="text-2xl">
        Need a Hand with Applied Transformer Architectures?
      </DialogTitle>
      <DialogDescription className="text-lg mx-1">
        We've noticed you might be feeling a bit stuck or disengaged
        with the material. Can we help you explore this concept in a
        different way?
      </DialogDescription>
    </DialogHeader>
    <DialogFooter className="flex mt-4 ">
      <Button onClick={handleClose}>
        <ThumbsDown className="w-6 h-6 text-white outline-none border-none" />
      </Button>
      <Button onClick={() => setDialogState("yes")}>
        <ThumbsUp className="w-6 h-6 text-white outline-none border-none" />
      </Button>
    </DialogFooter>
  </DialogContent>
);