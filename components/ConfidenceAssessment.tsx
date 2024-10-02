import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useChapterEnded, useTitleStore } from "@/lib/store";
import { X } from "lucide-react";
import ReactMarkdown from "react-markdown";
import Quiz from "./FullQuiz";

type ConfidenceLevel =
  | "Very Confident"
  | "Somewhat Confident"
  | "I'm Unsure"
  | "";

interface ExplaneProp {
  answer: string;
}
const DeeperExplanation: React.FC<ExplaneProp> = ({ answer }) => {
  return <ReactMarkdown>{answer}</ReactMarkdown>;
};

const ConfidenceAssessment: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [confidenceLevel, setConfidenceLevel] = useState<ConfidenceLevel>("");
  const {
    chapterFinished: chapterEnded,
    changeChapterFinished,
    content,
  } = useChapterEnded();
  const { title } = useTitleStore();
  const [answer, setAnswer] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  React.useEffect(() => {
    if (chapterEnded) {
      setIsOpen(true);
    }
  }, [chapterEnded]);

  const renderContent = () => {
    const level = confidenceLevel;

    switch (level) {
      case "Very Confident":
        return (
          <>
            <DialogClose
              onClick={() => {
                changeChapterFinished(false);
                setConfidenceLevel("");
              }}
              className="absolute right-2 top-2 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </DialogClose>
            <Quiz topic={title} />
          </>
        );
      case "Somewhat Confident":
        return (
          <>
            <DialogClose
              onClick={() => {
                changeChapterFinished(false);
                setConfidenceLevel("");
                setAnswer("")
              }}
              className="absolute right-2 top-2 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </DialogClose>
            <DeeperExplanation answer={answer} />;
          </>
        );
      case "I'm Unsure":
        return (
          <>
            <DialogClose
              onClick={() => {
                changeChapterFinished(false);
                setConfidenceLevel("");
              }}
              className="absolute right-2 top-2 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </DialogClose>
            <div className="aspect-video">
              <iframe
                width="100%"
                height="100%"
                src={"https://www.youtube.com/embed/wjZofJX0v4M"}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </>
        );
      default:
        return (
          <>
            <DialogHeader>
              <DialogTitle>Confidence Check</DialogTitle>
              <DialogDescription>
                How confident are you about the Self-Attention Mechanism?
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-between mt-4">
              {(
                [
                  "Very Confident",
                  "Somewhat Confident",
                  "I'm Unsure",
                ] as ConfidenceLevel[]
              ).map((level) => (
                <Button
                  key={level}
                  onClick={() => handleConfidenceSelect(level)}
                  variant={confidenceLevel === level ? "default" : "outline"}
                  disabled={isLoading}
                >
                  {level}
                </Button>
              ))}
            </div>
          </>
        );
    }
  };

  const handleConfidenceSelect = async (level: ConfidenceLevel) => {
    if (level === "Somewhat Confident") {
      try {
        setIsLoading(true);
        const response = await fetch("/api/query", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            topic:
              content +
              ", Please summarize this in 60-70 words with markdown, and provide the title also.",
          }),
        });

        if (!response.ok) {
          throw new Error("API request failed");
        }

        const data = await response.json();
        setAnswer(data.res);
      } catch (error) {
      } finally {
        setIsLoading(false);
      }
    }

    setConfidenceLevel(level);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-4xl">{renderContent()}</DialogContent>
    </Dialog>
  );
};

export default ConfidenceAssessment;
