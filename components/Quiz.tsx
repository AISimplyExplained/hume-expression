import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Trophy, Star, ChevronRight } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import OpenAI from "openai";
import { useModule } from "@/lib/store";
import { updateCurrentQuestionOnServer } from "@/app/actions";

const removeLastPart = (str: string): string => {
  const lastSpaceIndex = str.lastIndexOf(" ");
  if (lastSpaceIndex === -1) {
    return str;
  }
  return str.substring(0, lastSpaceIndex);
};

interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
}

interface QuizProps {
  questions: Question[];
  onComplete: (score: number) => void;
  setEnergy: React.Dispatch<React.SetStateAction<number>>;
  setStreak: React.Dispatch<React.SetStateAction<number>>;
  content: string;
}

const Quiz: React.FC<QuizProps> = ({
  questions,
  onComplete,
  setEnergy,
  setStreak,
  content,
}) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [hintLoading, setHintLoading] = useState(false);
  const [hint, setHint] = useState("");
  
  useEffect(() => {
    setHint("");
    setHintLoading(false);
  }, [currentQuestion, selectedAnswer]);

  useEffect(() => {
    const postToServer = async () => {
      await updateCurrentQuestionOnServer(questions[currentQuestion])
    };
    postToServer();
  }, [currentQuestion])

  const { changeModuleFinished } = useModule();

  const handleAnswer = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    setShowResult(true);

    if (answerIndex === questions[currentQuestion].correctAnswer) {
      setEnergy((prev) => prev + 20);
      setStreak((prev) => prev + 1);
      setScore(score + 1);
    } else setStreak(0);
  };

  const nextQuestion = () => {
    setSelectedAnswer(null);
    setShowResult(false);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setQuizCompleted(true);
      onComplete(score);
      changeModuleFinished({
        isFinished: true,
        title: removeLastPart(content),
      });
    }
  };

  async function getHint() {
    setHintLoading(true);
    try {
      const res = await fetch("/api/hints", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: `Can you give a hint for this question in a single line: ${JSON.stringify(
            questions[currentQuestion]
          )}`,
        }),
      });

      if (!res.ok) {
        console.error("Failed to fetch hint");
        return;
      }
      const data = await res.json(); // Parse the response JSON
      setHint(data.res);
    } catch (error) {
      console.error("Error fetching hint:", error);
    } finally {
      setHintLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Quiz Challenge</h2>
          <Badge variant="secondary" className="text-lg">
            Question {currentQuestion + 1}/{questions.length}
          </Badge>
          <Button onClick={getHint} disabled={hintLoading}>
            {"Ask Transformer AI"}
            {hintLoading && (
              <svg
                className="animate-spin ml-2 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8v-8H4z"
                ></path>
              </svg>
            )}
          </Button>
        </div>
        <Progress
          value={((currentQuestion + 1) / questions.length) * 100}
          className="mt-2"
        />
      </CardHeader>
      <CardContent>
        {!quizCompleted ? (
          <>
            <h3 className="text-xl font-semibold mb-4">
              {questions[currentQuestion].question}
            </h3>
            <div className="space-y-2">
              {questions[currentQuestion].options.map((option, index) => (
                <Button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  disabled={showResult}
                  variant={
                    selectedAnswer === index
                      ? showResult
                        ? index === questions[currentQuestion].correctAnswer
                          ? "default"
                          : "destructive"
                        : "default"
                      : "outline"
                  }
                  className="w-full justify-start text-left"
                >
                  {option}
                  {showResult &&
                    index === questions[currentQuestion].correctAnswer && (
                      <Star className="ml-2 h-4 w-4 text-yellow-400" />
                    )}
                </Button>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center">
            <Trophy className="h-16 w-16 text-yellow-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">Quiz Completed!</h3>
            <p className="text-xl">
              Your score: {score}/{questions.length}
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter className="justify-between">
        {hint && (
          <div>
            <hr className="w-full" />
            <p className="mt-4 text-sm font-bold">Hints by Transformer AI</p>
            <div className="mt-2">
              <p className="text-xs text-gray-700">{hint}</p>
            </div>
          </div>
        )}
        {showResult && !quizCompleted && (
          <Button onClick={nextQuestion} className="ml-auto">
            {currentQuestion < questions.length - 1
              ? "Next Question"
              : "Finish Quiz"}{" "}
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default Quiz;
