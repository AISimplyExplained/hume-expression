import React, { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { Button } from "./ui/button";
import { useBoredTime } from "@/lib/hooks/useBoredTime";
import { ThumbsDown, ThumbsUp, X } from "lucide-react";
import Quiz from "./bored/Quiz";
import Poll from "./bored/Poll";
import UseCase from "./bored/UseCase";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

interface Props {
  sortedEmotion: {
    emotion: string;
    score: number;
  }[];
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

type DialogState = "initial" | "no" | "yes";
type ExplorationOptionType =
  | "Show me a simple use-case"
  | "Give me a quick poll"
  | "Test me with a quiz"
  | "";

const options: ExplorationOptionType[] = [
  "Show me a simple use-case",
  "Give me a quick poll",
  "Test me with a quiz",
];

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

    case "":
      return null;

    default:
      return null;
  }
};

export default function Bored({ sortedEmotion, isOpen, setIsOpen }: Props) {
  const [boredTime, setBoredTime] = useState(0);
  const { boredTime: boredServerTime } = useBoredTime();
  const [dialogState, setDialogState] = useState<DialogState>("initial");
  const [exploreOpt, setExploreOpt] = useState<ExplorationOptionType>("");

  useEffect(() => {
    const interval = setInterval(() => {
      const isBored = () => {
        if (isOpen) {
          return false;
        }

        if (sortedEmotion.length === 0) {
          return false;
        }
        for (let i = 0; i < sortedEmotion.length; i++) {
          if (sortedEmotion[i].score < 0.4) {
            return false;
          }
          if (
            sortedEmotion[i].emotion === "Boredom" ||
            sortedEmotion[i].emotion === "Disappointment"
          ) {
            return true;
          }
        }
        return false;
      };
      const check = isBored();
      if (check) {
        setBoredTime((prev) => prev + 1);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [sortedEmotion]);

  useEffect(() => {
    if (boredTime === boredServerTime && !isOpen) {
      setDialogState("initial");
      setExploreOpt("");
      setIsOpen(true);
    }
  }, [boredTime, isOpen, boredServerTime]);

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
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              Need a Hand with Applied Transformer Architectures?
            </DialogTitle>
            <DialogDescription className="text-lg mx-1">
              We&#39;ve noticed you might be feeling a bit stuck or disengaged
              with the material. Can we help you explore this concept in a
              different way?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex mt-4 ">
            <Button onClick={() => handleClose()}>
              <ThumbsDown className="w-6 h-6 text-white" />
            </Button>
            <Button onClick={() => setDialogState("yes")}>
              <ThumbsUp className="w-6 h-6 text-white" />
            </Button>
          </DialogFooter>
        </DialogContent>
      )}
      {dialogState === "yes" && (
        <>
          {exploreOpt === "" ? (
            <DialogContent className="max-w-3xl  flex flex-col gap-8">
              <DialogHeader>
                <DialogTitle className="text-2xl">
                  Explore this topic further
                </DialogTitle>
                <DialogDescription className="mx-1 text-lg">
                  No problem! How would you like to explore this topic further?
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-wrap gap-4 justify-center">
                {options.map((option) => (
                  <Button
                    key={option}
                    onClick={() => handleOptionClick(option)}
                  >
                    {option}
                  </Button>
                ))}
              </div>
            </DialogContent>
          ) : (
            <DialogContent className="max-w-3xl h-[500px] flex flex-col gap-8">
              {renderContent(exploreOpt, setIsOpen, setBoredTime)}
            </DialogContent>
          )}
        </>
      )}
    </Dialog>
  );
}
