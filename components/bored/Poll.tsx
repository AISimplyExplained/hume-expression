import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface PollProps {
  topic: string;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setBoredTime: React.Dispatch<React.SetStateAction<number>>
}

type Question = {
  question: string;
  options: string[];
};

const Poll: React.FC<PollProps> = ({ setIsOpen, topic,setBoredTime}) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [pollCompleted, setPollCompleted] = useState(false);

  const handleAnswer = (answerIndex: number) => {
    setSelectedAnswers((prev) => [...prev, answerIndex]);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setPollCompleted(true);
    }
  };

  const getRes = async () => {
    try {
      const res = await fetch("/api/polls", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ topic: topic }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      console.log("Data", data);
      setQuestions(data.res.polls);
      console.log("data", data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    if (questions.length === 0) {
      getRes();
    }
  }, []);

  if (questions.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="spinner-border animate-spin inline-block w-8 h-8 border-l-4 border-t-4 border-e-[1] rounded-full text-blue-500 mb-4" role="status">
          <span className="sr-only">Loading...</span>
        </div>
        <p className="text-lg text-gray-600">Loading questions...</p>
      </div>
    );
  }

  return (
    <Card className="w-full mx-auto my-auto">
      <CardHeader>
        <div className={`flex justify-between items-center ${pollCompleted ? 'hidden' : ""}`}>
          <h2 className="text-2xl font-bold">Poll</h2>
          {!pollCompleted && (
            <span className="text-lg">
              Question {currentQuestion + 1}/{questions.length}
            </span>
          )}
        </div>
        {!pollCompleted && (
          <Progress
            value={((currentQuestion + 1) / questions.length) * 100}
            className="mt-2"
          />
        )}
      </CardHeader>
      <CardContent className="w-full">
        {!pollCompleted ? (
          <>
            <h3 className="text-xl font-semibold mb-4">
              {questions[currentQuestion].question}
            </h3>
            <div className="space-y-2">
              {questions[currentQuestion].options.map((option, index) => (
                <Button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  className="w-full justify-start text-left text-lg "
                  variant="outline"
                >
                  {option}
                </Button>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-2">Poll Completed!</h3>
            <p className="text-lg">Thank you for participating!</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="justify-between">
        {pollCompleted && (
          <Button
            className="ml-auto"
            onClick={() => {
              setIsOpen(false);
              setBoredTime(0)
            }}
          >
            Close
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default Poll;
