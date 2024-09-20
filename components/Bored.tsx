import { useBoredTime } from "@/lib/hooks/useBoredTime";
import { useState, useEffect } from "react";
import { ExploreOptions } from "./bored/ExploreOption";
import { InitialDialog } from "./bored/InitialDialog";
import Poll from "./bored/Poll";
import UseCase from "./bored/UseCase";
import Quiz from "./bored/Quiz";
import { Dialog, DialogContent } from "./ui/dialog";

type ExplorationOptionType =
  | "Show me a simple use-case"
  | "Give me a quick poll"
  | "Test me with a quiz"
  | "";


type DialogState = "initial" | "no" | "yes";


const renderContent = (
  selectedOption: ExplorationOptionType,
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>,
  setBoredTime: React.Dispatch<React.SetStateAction<number>>
) => {
  switch (selectedOption) {
    case "Show me a simple use-case":
      return (
        <UseCase
          topic="Transformer Architectures"
          setIsOpen={setIsOpen}
          setBoredTime={setBoredTime}
        />
      );
    case "Give me a quick poll":
      return (
        <Poll
          topic="Transformer Architectures"
          setIsOpen={setIsOpen}
          setBoredTime={setBoredTime}
        />
      );
    case "Test me with a quiz":
      return (
        <Quiz
          setBoredTime={setBoredTime}
          topic="Transformer Architectures"
          setIsOpen={setIsOpen}
        />
      );
    default:
      return null;
  }
};

interface BoredProps {
  sortedEmotion: {
    emotion: string;
    score: number;
  }[];
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Bored: React.FC<BoredProps> = ({ sortedEmotion, isOpen, setIsOpen }) => {
  const [boredTime, setBoredTime] = useState(0);
  const { boredTime: boredServerTime } = useBoredTime();
  const [dialogState, setDialogState] = useState<DialogState>("initial");
  const [exploreOpt, setExploreOpt] = useState<ExplorationOptionType>("");

  useEffect(() => {
    const interval = setInterval(() => {
      const isBored = () => {
        if (isOpen || sortedEmotion.length === 0) return false;
        for (let i = 0; i < sortedEmotion.length; i++) {
          if (sortedEmotion[i].score < 0.4) return false;
          if (["Boredom", "Disappointment"].includes(sortedEmotion[i].emotion))
            return true;
        }
        return false;
      };
      if (isBored()) setBoredTime((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [sortedEmotion, isOpen]);

  useEffect(() => {
    if (boredTime === boredServerTime && !isOpen) {
      setDialogState("initial");
      setExploreOpt("");
      setIsOpen(true);
    }
  }, [boredTime, isOpen, boredServerTime, setIsOpen]);

  useEffect(() => {
    if (dialogState !== "initial" && boredTime === 0) {
      setDialogState("initial");
    }
  }, [boredTime, dialogState]);

  const handleOptionClick = (option: ExplorationOptionType): void => {
    console.log(`Selected option: ${option}`);
    setExploreOpt(option);
  };

  const handleClose = () => {
    setIsOpen(false);
    setBoredTime(0);
    setDialogState("initial");
    setExploreOpt("");
  };

  return (
    <Dialog open={isOpen}>
      {dialogState === "initial" && (
        <InitialDialog
          handleClose={handleClose}
          setDialogState={setDialogState}
        />
      )}
      {dialogState === "yes" && (
        <>
          {exploreOpt === "" ? (
            <ExploreOptions handleOptionClick={handleOptionClick} />
          ) : (
            <DialogContent className="max-w-3xl h-[500px] flex flex-col gap-8">
              {renderContent(exploreOpt, setIsOpen, setBoredTime)}
            </DialogContent>
          )}
        </>
      )}
    </Dialog>
  );
};

export default Bored;
