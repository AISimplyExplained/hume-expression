import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useTitleStore } from "@/lib/store";
import ReactMarkdown from "react-markdown";

type FeedbackOption =
  | "I got this! Next section."
  | "Show me more examples."
  | "Can we simplify that a bit?";

const Interval = 180;

export const TimedFeedbackDialog: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [timeRemaining, setTimeRemaining] = useState<number>(Interval);
  const [answer, setAnswer] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { title } = useTitleStore();

  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;
    if (!isOpen && timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining((prevTime) => {
          if (prevTime === 1) {
            clearInterval(timer);
            setIsOpen(true);
            return Interval;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isOpen, timeRemaining]);

  const handleOptionClick = async (option: FeedbackOption): Promise<void> => {
    if (option === "I got this! Next section.") {
      setIsOpen(false);
    } else {
      setIsLoading(true);
      const topic = title + option;

      try {
        const response = await fetch("/api/query", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ topic }),
        });

        if (!response.ok) {
          throw new Error("API request failed");
        }

        const data = await response.json();
        setAnswer(data.res);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="w-full max-w-4xl text-wrap max-h-[80vh] flex flex-col">
        {answer ? (
          <div className="flex flex-col h-full gap-4">
            <DialogTitle className="flex-shrink-0">{title}</DialogTitle>
            <div className="overflow-y-auto flex-grow">
              <ReactMarkdown
                components={{
                  img: ({ node, ...props }) => (
                    <img
                      style={{ maxWidth: "100%", height: "auto" }}
                      {...props}
                      alt={props.alt || ""}
                    />
                  ),
                  pre: ({ node, ...props }) => (
                    <pre
                      style={{
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-word",
                      }}
                      {...props}
                    />
                  ),
                }}
              >
                {answer}
              </ReactMarkdown>
            </div>
            <Button
              onClick={() => setAnswer(null)}
              className="mt-4 w-full flex-shrink-0"
            >
              Back to Options
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Feedback Time!</DialogTitle>
              <DialogDescription>
                Before we move on, how did you find that section? Rate your
                understanding or request a deeper dive.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex flex-col items-stretch gap-2 sm:items-center sm:justify-center">
              <Button
                onClick={() => handleOptionClick("I got this! Next section.")}
                className="w-full"
                disabled={isLoading}
              >
                I got this! Next section.
              </Button>
              <Button
                onClick={() => handleOptionClick("Show me more examples.")}
                className="w-full"
                disabled={isLoading}
              >
                Show me more examples.
              </Button>
              <Button
                onClick={() => handleOptionClick("Can we simplify that a bit?")}
                className="w-full"
                disabled={isLoading}
              >
                Can we simplify that a bit?
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
