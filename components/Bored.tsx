import React, { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { Button } from "./ui/button";
import { useBoredTime } from "@/lib/hooks/useBoredTime";
import { X } from "lucide-react";
import Quiz from "./bored/Quiz";
import Poll from "./bored/Poll";
import UseCase from "./bored/UseCase";

interface Props {
  sortedEmotion: {
    emotion: string;
    score: number;
  }[];
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
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
) => {
  switch (selectedOption) {
    case "Show me a simple use-case":
      return (
        <UseCase topic="Transformer Architectures" setIsOpen={setIsOpen} />
      );

    case "Give me a quick poll":
      return <Poll topic="Transformer Architectures" setIsOpen={setIsOpen} />;

    case "Test me with a quiz":
      return <Quiz topic="Transformer Architectures" setIsOpen={setIsOpen} />;

    case "":
      return null;

    default:
      return null;
  }
};

export default function Bored({ sortedEmotion }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [boredTime, setBoredTime] = useState(0);
  const { boredTime: boredServerTime } = useBoredTime();
  const [dialogState, setDialogState] = useState<DialogState>("initial");
  const [exploreOpt, setExploreOpt] = useState<ExplorationOptionType>("");

  useEffect(() => {
    const interval = setInterval(() => {
      const isBored = () => {
        if (sortedEmotion.length === 0) {
          setIsOpen(false)
          return false;
        }
        for (let i = 0; i < sortedEmotion.length; i++) {
          if (sortedEmotion[i].score < 0.4) {
            return false;
          }
          if (sortedEmotion[i].emotion === "Boredom" || sortedEmotion[i].emotion === "Disappointment") {
            return true;
          }
        }
        return false;
      }
      if (isBored()) {
        setBoredTime(prev => prev + 1)
      } else {
        setBoredTime(0)
        setIsOpen(false)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [sortedEmotion])

  useEffect(() => {
    if (boredTime === boredServerTime && !isOpen) {
      setIsOpen(true);
    }

  }, [boredTime, isOpen, boredServerTime]);

  const handleOptionClick = (option: ExplorationOptionType): void => {
    console.log(`Selected option: ${option}`);
    setExploreOpt(option);
  };

  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent className="">
        {dialogState === "initial" && (
          <>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Need a Hand with Applied Transformer Architectures?
              </AlertDialogTitle>
              <AlertDialogDescription>
                We&#39;ve noticed you might be feeling a bit stuck or disengaged
                with the material. Can we help you explore this concept in a
                different way?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <Button
                variant={"ghost"}
                onClick={() => {
                  setDialogState("no");
                }}
              >
                NO, I&#39;m good to continue
              </Button>
              <Button
                onClick={() => {
                  setDialogState("yes");
                }}
              >
                YES, I need help
              </Button>
            </AlertDialogFooter>
          </>
        )}
        {dialogState === "no" && (
          <>
            <AlertDialogDescription>
              Great! We&#39;ll keep going with the lesson. Feel free to pause or ask
              for help anytime.
            </AlertDialogDescription>
            <Button
              onClick={() => {
                setIsOpen(false);
              }}
            >
              Close
            </Button>
          </>
        )}
        {dialogState === "yes" && exploreOpt === "" && (
          <>
            <AlertDialogHeader>
              <AlertDialogTitle>Explore this topic further</AlertDialogTitle>
              <AlertDialogDescription>
                No problem! How would you like to explore this topic further?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="flex flex-wrap gap-4 justify-center">
              {options.map((option) => (
                <Button key={option} onClick={() => handleOptionClick(option)}>
                  {option}
                </Button>
              ))}
            </div>
          </>
        )}
        {dialogState === "yes" && renderContent(exploreOpt, setIsOpen)}
      </AlertDialogContent>
    </AlertDialog>
  );
}
