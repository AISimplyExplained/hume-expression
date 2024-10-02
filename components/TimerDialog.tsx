import React, { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useChapterEnded } from "@/lib/store";
import ReactMarkdown from "react-markdown";

interface Props {
  isPlaying: boolean;
}

type ActionType = "recap" | "continue";

const INTERVAL_SECONDS = 180;

const TimerDialog: React.FC<Props> = ({ isPlaying }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [secondsElapsed, setSecondsElapsed] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [answer, setAnswer] = useState<string | null>(null);
  const { content } = useChapterEnded();

  const handleClose = useCallback(async (action: ActionType, content:string): Promise<void> => {
    console.log(`User chose to ${action}`);
    if (action === "continue") {
      setIsOpen(false);
      setAnswer(null)
      setSecondsElapsed(0);
    } else {
      try {
        setIsLoading(true)
        const response = await fetch("/api/query", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            topic:
              content +
              ", Please summarize this in 40-50 words with markdown, and provide the title also.",
          }),
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
  }, []);

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;

    if (!isOpen) {
      intervalId = setInterval(() => {
        if (isPlaying) {
          setSecondsElapsed(0);
        } else {
          setSecondsElapsed((prev) => {
            if (prev >= INTERVAL_SECONDS - 1) {
              setIsOpen(true);
              return 0;
            }
            return prev + 1;
          });
        }
      }, 1000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-2xl">
        {answer ? (
          <>
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
            <Button onClick={() => handleClose("continue", content)}>
              Close
            </Button>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Take a Break?</DialogTitle>
              <DialogDescription>
                We noticed you&#39;ve been on this section for a while. Need a
                break or a quick refresher?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="">
              <Button
                onClick={() => handleClose("recap", content)}
                disabled={isLoading}
              >
                Yes, let&#39;s recap!
              </Button>
              <Button
                variant="outline"
                onClick={() => handleClose("continue", content)}
                disabled={isLoading}
              >
                I&#39;m ready to continue.
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default TimerDialog;
