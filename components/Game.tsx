import React, { useState } from "react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

import Editor from "react-simple-code-editor";

// @ts-ignore
import { highlight, languages } from "prismjs/components/prism-core";
import "prismjs/components/prism-python";
import "prismjs/themes/prism.css";
import { title } from "process";
import { Check } from "lucide-react";

const challenges = [
  {
    id: 1,
    title: "Positional Encoding",
    description:
      "Implement a function to generate positional encodings for a Transformer model.",
    hint: "Use sine and cosine functions of different frequencies for encoding positions.",
    initialCode: `import numpy as np

def positional_encoding(seq_len, d_model):
    """
    Generate positional encoding for a given sequence length and model dimension.
    seq_len: length of the input sequence
    d_model: dimension of the model
    
    Return: numpy array of shape (seq_len, d_model)
    """
    # Your code here
    pass`,
    completedCode: `import numpy as np

def positional_encoding(seq_len, d_model):
    """
    Generate positional encoding for a given sequence length and model dimension.
    seq_len: length of the input sequence
    d_model: dimension of the model
    
    Return: numpy array of shape (seq_len, d_model)
    """
    position = np.arange(seq_len)[:, np.newaxis]
    div_term = np.exp(np.arange(0, d_model, 2) * -(np.log(10000.0) / d_model))
    pos_encoding = np.zeros((seq_len, d_model))
    pos_encoding[:, 0::2] = np.sin(position * div_term)
    pos_encoding[:, 1::2] = np.cos(position * div_term)
    return pos_encoding`,
  },
  {
    id: 2,
    title: "Scaled Dot-Product Attention",
    description: "Implement the scaled dot-product attention mechanism.",
    hint: "Remember to scale the dot product by the square root of the dimension.",
    initialCode: `import numpy as np

def scaled_dot_product_attention(query, key, value, mask=None):
    """
    Compute scaled dot-product attention.
    query, key, value: numpy arrays
    mask: optional mask array
    
    Return: numpy array
    """
    # Your code here
    pass`,
    completedCode: `import numpy as np

def scaled_dot_product_attention(query, key, value, mask=None):
    """
    Compute scaled dot-product attention.
    query, key, value: numpy arrays
    mask: optional mask array
    
    Return: numpy array
    """
    d_k = query.shape[-1]
    attention_scores = np.matmul(query, key.transpose(-2, -1)) / np.sqrt(d_k)
    
    if mask is not None:
        attention_scores += (mask * -1e9)
    
    attention_weights = softmax(attention_scores)
    return np.matmul(attention_weights, value)

def softmax(x):
    e_x = np.exp(x - np.max(x, axis=-1, keepdims=True))
    return e_x / np.sum(e_x, axis=-1, keepdims=True)`,
  },
  {
    id: 3,
    title: "Multi-Head Attention",
    description: "Implement multi-head attention for a Transformer model.",
    hint: "Split the input into multiple heads, apply attention, and concatenate the results.",
    initialCode: `import numpy as np

def multi_head_attention(query, key, value, num_heads, d_model, mask=None):
    """
    Perform multi-head attention.
    query, key, value: numpy arrays
    num_heads: number of attention heads
    d_model: dimension of the model
    mask: optional mask array
    
    Return: numpy array
    """
    # Your code here
    pass`,
    completedCode: `import numpy as np

def multi_head_attention(query, key, value, num_heads, d_model, mask=None):
    """
    Perform multi-head attention.
    query, key, value: numpy arrays
    num_heads: number of attention heads
    d_model: dimension of the model
    mask: optional mask array
    
    Return: numpy array
    """
    d_k = d_model // num_heads
    
    q = np.reshape(query, (-1, num_heads, query.shape[1], d_k))
    k = np.reshape(key, (-1, num_heads, key.shape[1], d_k))
    v = np.reshape(value, (-1, num_heads, value.shape[1], d_k))
    
    attention = scaled_dot_product_attention(q, k, v, mask)
    
    return np.reshape(attention, (-1, attention.shape[2], d_model))`,
  },
  {
    id: 4,
    title: "Feed-Forward Network",
    description:
      "Implement a simple feed-forward network for a Transformer layer.",
    hint: "Use a single hidden layer with ReLU activation.",
    initialCode: `import numpy as np

def feed_forward(x, d_ff):
    """
    Apply a simple feed-forward network.
    x: input numpy array
    d_ff: dimension of the feed-forward network
    
    Return: numpy array
    """
    # Your code here
    pass`,
    completedCode: `import numpy as np

def feed_forward(x, d_ff):
    """
    Apply a simple feed-forward network.
    x: input numpy array
    d_ff: dimension of the feed-forward network
    
    Return: numpy array
    """
    return np.maximum(np.dot(x, np.random.randn(x.shape[-1], d_ff)), 0)`,
  },
  {
    id: 5,
    title: "Layer Normalization",
    description: "Implement layer normalization for a Transformer model.",
    hint: "Normalize the inputs across the last dimension.",
    initialCode: `import numpy as np

def layer_norm(x, epsilon=1e-6):
    """
    Apply layer normalization.
    x: input numpy array
    epsilon: small number for numerical stability
    
    Return: numpy array
    """
    # Your code here
    pass`,
    completedCode: `import numpy as np

def layer_norm(x, epsilon=1e-6):
    """
    Apply layer normalization.
    x: input numpy array
    epsilon: small number for numerical stability
    
    Return: numpy array
    """
    mean = np.mean(x, axis=-1, keepdims=True)
    variance = np.var(x, axis=-1, keepdims=True)
    return (x - mean) / np.sqrt(variance + epsilon)`,
  },
  {
    id: 6,
    title: "Transformer Encoder Layer",
    description: "Implement a single Transformer encoder layer.",
    hint: "Combine multi-head attention and feed-forward network with layer normalization.",
    initialCode: `import numpy as np

def transformer_encoder_layer(x, num_heads, d_model, d_ff, mask=None):
    """
    Implement a single Transformer encoder layer.
    x: input numpy array
    num_heads: number of attention heads
    d_model: dimension of the model
    d_ff: dimension of the feed-forward network
    mask: optional mask array
    
    Return: numpy array
    """
    # Your code here
    pass`,
    completedCode: `import numpy as np

def transformer_encoder_layer(x, num_heads, d_model, d_ff, mask=None):
    """
    Implement a single Transformer encoder layer.
    x: input numpy array
    num_heads: number of attention heads
    d_model: dimension of the model
    d_ff: dimension of the feed-forward network
    mask: optional mask array
    
    Return: numpy array
    """
    # Multi-head attention
    attention_output = multi_head_attention(x, x, x, num_heads, d_model, mask)
    attention_output = layer_norm(x + attention_output)
    
    # Feed-forward network
    ff_output = feed_forward(attention_output, d_ff)
    return layer_norm(attention_output + ff_output)`,
  },
  {
    id: 7,
    title: "Create Transformer",
    description: "Create a basic Transformer model.",
    hint: "Stack multiple Transformer encoder layers and add positional encoding.",
    initialCode: `import numpy as np

def create_transformer(seq_len, num_layers, num_heads, d_model, d_ff):
    """
    Create a basic Transformer model.
    seq_len: length of the input sequence
    num_layers: number of Transformer layers
    num_heads: number of attention heads
    d_model: dimension of the model
    d_ff: dimension of the feed-forward network
    
    Return: function that applies the Transformer to an input
    """
    # Your code here
    pass`,
    completedCode: `import numpy as np

def create_transformer(seq_len, num_layers, num_heads, d_model, d_ff):
    """
    Create a basic Transformer model.
    seq_len: length of the input sequence
    num_layers: number of Transformer layers
    num_heads: number of attention heads
    d_model: dimension of the model
    d_ff: dimension of the feed-forward network
    
    Return: function that applies the Transformer to an input
    """
    def transformer(x):
        x = x + positional_encoding(seq_len, d_model)
        for _ in range(num_layers):
            x = transformer_encoder_layer(x, num_heads, d_model, d_ff)
        return x
    
    return transformer`,
  },
];

const TransformerGame = () => {
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [progress, setProgress] = useState(0);
  const [code, setCode] = useState(challenges[0].initialCode);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  const handleNextChallenge = async () => {
    if (!code) {
      setError("Please write code.");
      return;
    }
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/code-check", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userCode: code,
          completedCode: challenges[currentChallenge].completedCode,
        }),
      });

      const data = await response.json();

      if (data.res) {
        if (currentChallenge === challenges.length - 1) {
          setIsComplete(true);
          setShowHint(false);
        } else if (currentChallenge < challenges.length - 1) {
          setCurrentChallenge((prev) => prev + 1);
          setShowHint(false);
          setCode(challenges[currentChallenge + 1].initialCode);
          setProgress(((currentChallenge + 2) / challenges.length) * 100);
        }
      } else {
        setError(data.reason);
      }
    } catch (error) {
      setError("An error occurred while checking your code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleHint = () => {
    setShowHint(!showHint);
  };

  return (
    <div className="container mx-auto p-4 ">
      <Progress value={progress} className="w-full mb-4" />
      <Card className="h-ful">
        <CardHeader>
          <h2 className="text-xl font-semibold">
            Challenge {currentChallenge + 1}:{" "}
            {challenges[currentChallenge].title}
          </h2>
        </CardHeader>
        <CardContent className="h-full">
          <p>{challenges[currentChallenge].description}</p>
          <Editor
            value={code}
            onValueChange={(code) => setCode(code)}
            highlight={(code) => highlight(code, languages.python)}
            padding={10}
            className="min-h-80 mt-4 "
            style={{
              fontFamily: '"Fira code", "Fira Mono", monospace',
              fontSize: 12,
              backgroundColor: "#f5f5f5",
              borderRadius: 4,
            }}
          />
          {showHint && (
            <div className="mt-4 p-2 bg-yellow-100 rounded">
              <strong>Hint:</strong> {challenges[currentChallenge].hint}
            </div>
          )}
          {error && (
            <div className="mt-4 p-2 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-end gap-6 mx-4">
          {isComplete ? (
            <Button size={"icon"} className="rounded-full bg-green-400">
              <Check />
            </Button>
          ) : (
            <>
              <Button variant="outline" onClick={toggleHint}>
                {showHint ? "Hide Hint" : "Show Hint"}
              </Button>
              <Button onClick={handleNextChallenge} disabled={isLoading}>
                {currentChallenge === challenges.length - 1
                  ? "Finish"
                  : "Next Challenge"}
              </Button>
            </>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default TransformerGame;
