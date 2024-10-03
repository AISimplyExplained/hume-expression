import React, { useState } from "react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

const challenges = [
  {
    id: 1,
    title: "Token Embedding",
    description: "Implement a function to convert input tokens to embeddings.",
    hint: "Think about mapping each token to a vector representation.",
  },
  {
    id: 2,
    title: "Positional Encoding",
    description: "Add positional information to the token embeddings.",
    hint: "Consider using sine and cosine functions of different frequencies.",
  },
  {
    id: 3,
    title: "Self-Attention Mechanism",
    description: "Implement the self-attention mechanism for the Transformer.",
    hint: "Focus on computing query, key, and value matrices.",
  },
  {
    id: 4,
    title: "Multi-Head Attention",
    description: "Extend the self-attention to multi-head attention.",
    hint: "Think about running multiple attention operations in parallel.",
  },
  {
    id: 5,
    title: "Feed-Forward Network",
    description:
      "Implement the feed-forward network component of the Transformer.",
    hint: "This typically involves two linear transformations with a ReLU in between.",
  },
  {
    id: 6,
    title: "Layer Normalization",
    description: "Add layer normalization to your Transformer model.",
    hint: "Normalize the inputs across the features.",
  },
  {
    id: 7,
    title: "Complete Transformer",
    description: "Combine all components to create a full Transformer model.",
    hint: "Stack the attention and feed-forward layers with residual connections.",
  },
];

const TransformerGame = () => {
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleNextChallenge = () => {
    if (currentChallenge < challenges.length - 1) {
      setCurrentChallenge(currentChallenge + 1);
      setShowHint(false);
      setProgress(((currentChallenge + 2) / challenges.length) * 100);
    } else if(currentChallenge === challenges.length - 1) {
      setProgress(0)
      setShowHint(false)
      setCurrentChallenge(0)
    }
  };

  const toggleHint = () => {
    setShowHint(!showHint);
  };

  return (
    <div className="container mx-auto p-4">
      {/* <h1 className="text-2xl font-bold mb-4">Build Your Own Transformer</h1> */}
      <Progress value={progress} className="w-full mb-4" />
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">
            Challenge {currentChallenge + 1}:{" "}
            {challenges[currentChallenge].title}
          </h2>
        </CardHeader>
        <CardContent>
          <p>{challenges[currentChallenge].description}</p>
          {showHint && (
            <div className="mt-4 p-2 bg-yellow-100 rounded">
              <strong>Hint:</strong> {challenges[currentChallenge].hint}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={toggleHint}>
            {showHint ? "Hide Hint" : "Show Hint"}
          </Button>
          <Button
            onClick={handleNextChallenge}
          >
            {currentChallenge === challenges.length - 1
              ? "Reset"
              : "Next Challenge"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default TransformerGame;
