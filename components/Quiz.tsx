import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Trophy, Star, ChevronRight } from "lucide-react";

interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
}

interface QuizProps {
  questions: Question[];
  onComplete: (score: number) => void;
}

const Quiz: React.FC<QuizProps> = ({ questions, onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);

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
      onComplete(score);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Quiz Challenge</h2>
          <Badge variant="secondary" className="text-lg">
            Question {currentQuestion + 1}/{questions.length}
          </Badge>
        </div>
        <Progress value={((currentQuestion + 1) / questions.length) * 100} className="mt-2" />
      </CardHeader>
      <CardContent>
        {!quizCompleted ? (
          <>
            <h3 className="text-xl font-semibold mb-4">{questions[currentQuestion].question}</h3>
            <div className="space-y-2">
              {questions[currentQuestion].options.map((option, index) => (
                <Button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  disabled={showResult}
                  variant={selectedAnswer === index ? (showResult ? (index === questions[currentQuestion].correctAnswer ? "default" : "destructive") : "default") : "outline"}
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
      </CardFooter>
    </Card>
  );
};

export default Quiz;