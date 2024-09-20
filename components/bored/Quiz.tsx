import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Trophy, Star, ChevronRight, X } from "lucide-react";

interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
}

interface QuizProps {
  topic: string;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setBoredTime: React.Dispatch<React.SetStateAction<number>>
}

const Quiz: React.FC<QuizProps> = ({ setIsOpen, topic, setBoredTime }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const getRes = async () => {
    try {
      const res = await fetch("/api/quiz", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ topic: topic }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      setQuestions(data.res.quiz)
      console.log("data", data)
    } catch (error) {
      console.error('Error:', error);
    }
  }

  useEffect(() => {
    if (questions.length === 0) {
      getRes();
    }
  }, [])



  const handleAnswer = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    setShowResult(true);

    if (answerIndex === questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }
  };

  const nextQuestion = () => {
    setSelectedAnswer(null);
    setShowResult(false);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setQuizCompleted(true);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto border-none px-1">
      {quizCompleted && <Button
        variant={"ghost"}
        className="absolute right-2 top-2"
        onClick={() => {
          setBoredTime(0)
          setIsOpen(false)
        }}
      >
        <X className="h-5 w-5 text-gray-500 hover:text-gray-700" />
      </Button>}
      <CardHeader className='mb-3 space-y-4'>
        <div className={`flex items-center w-full gap-4 ${questions.length === 0 ? 'justify-center' : "justify-between"}`}>
          <h2 className="text-xl font-semibold text-center">Quiz Challenge</h2>
          {questions.length > 0 && (
            <Badge variant="secondary" className="text-lg">
              Question {currentQuestion + 1}/{questions.length}
            </Badge>
          )}
        </div>
        {questions.length > 0 && (
          <Progress value={((currentQuestion + 1) / questions.length) * 100} className="mt-2" />
        )}
      </CardHeader>
      <CardContent>
        {questions.length === 0 ? (
          <div className="text-center py-16">
            <div className="spinner-border animate-spin inline-block w-8 h-8 border-l-4 border-t-4 border-e-[1] rounded-full text-blue-500 mb-4" role="status">
              <span className="sr-only">Loading...</span>
            </div>
            <p className="text-lg text-gray-600">Loading questions...</p>
          </div>
        ) : !quizCompleted ? (
          <>
            <h3 className="text-xl font-semibold mb-4">{questions[currentQuestion].question}</h3>
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
                  {showResult && index === questions[currentQuestion].correctAnswer && (
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
            <p className="text-xl">Your score: {score}/{questions.length}</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="justify-between">
        {showResult && !quizCompleted && (
          <Button onClick={nextQuestion} className="ml-auto">
            {currentQuestion < questions.length - 1 ? "Next Question" : "Finish Quiz"} <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        )}
        {quizCompleted && <Button
          className='ml-auto'
          onClick={() => {
            setBoredTime(0)
            setIsOpen(false)
          }}
        >
          close
        </Button>}
      </CardFooter>
    </Card>
  );
};

export default Quiz;
