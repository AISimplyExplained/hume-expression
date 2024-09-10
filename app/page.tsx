'use client'

import { useState, useEffect, useMemo, useCallback, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Slider } from "@/components/ui/slider"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { BookOpen, List, PlayCircle, User, Video, Menu, Search, Bell, Settings, X, Moon, Sun, Webcam, Pause } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ErrorBoundary } from "react-error-boundary"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useTheme } from 'next-themes'
import { FallbackProps } from 'react-error-boundary'
import Teleprompter from '@/components/Teleprompter' // Make sure this path is correct
import { Emotion, EmotionMap } from "@/lib/data/emotion"
import EmotionSpiderChart from "@/components/EmotionSpider"
import Expression from "@/components/Expression"
import ExpressionGraph from "@/components/ExpressionGraph"

function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div role="alert" className="p-4 bg-red-100 dark:bg-red-900 text-red-900 dark:text-red-100 rounded-lg">
      <h2 className="text-lg font-semibold mb-2">Something went wrong:</h2>
      <pre className="text-sm overflow-auto">{error.message}</pre>
      <Button onClick={resetErrorBoundary} className="mt-4">Try again</Button>
    </div>
  )
}

function DarkModeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      aria-label="Toggle dark mode"
    >
      {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </Button>
  )
}

export default function LecturePage() {
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0)
  const [currentLessonTitle, setCurrentLessonTitle] = useState("Applied Transformer Architecture")
  const [progress, setProgress] = useState(0)
  const [courseCompletion, setCourseCompletion] = useState({
    videosWatched: 0,
    quizzesTaken: 0,
    assignmentsCompleted: 0,
    overallProgress: 0
  })
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isStreaming, setIsStreaming] = useState(false)
  const router = useRouter()
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const sendVideoFramesIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const lessons = useMemo(() => [
    "Applied Transformer Architecture",
    "Transformers vs GANs",
    "Attention Head",
    "Softmax in Detail",
    "Vectors and Tokens"
  ], [])

  const navigationItems = useMemo(() => [
    { name: "Product", href: "/lecture" },
    { name: "Personalization", href: "/#personalization" },
    { name: "Account", href: "/#account" },
    { name: "Contact Us", href: "/#contact" }
  ], [])

  const lessonContent = useMemo(() => ({
    "Applied Transformer Architecture": `
# Applied Transformer Architecture

## Introduction
Transformers have revolutionized the field of natural language processing and beyond. Let's explore their architecture in detail.

## Key Components
1. **Self-Attention Mechanism**
   - Allows the model to weigh the importance of different words in the input
   - Enables parallel processing of input sequences

Here's a simple Python implementation of self-attention:

\`\`\`python
import numpy as np

def self_attention(query, key, value):
    # Compute attention scores
    scores = np.dot(query, key.T) / np.sqrt(key.shape[1])
    
    # Apply softmax to get attention weights
    weights = np.exp(scores) / np.sum(np.exp(scores), axis=1, keepdims=True)
    
    # Compute weighted sum of values
    output = np.dot(weights, value)
    
    return output

# Example usage
query = np.random.randn(1, 64)
key = np.random.randn(10, 64)
value = np.random.randn(10, 64)

attention_output = self_attention(query, key, value)
print(attention_output.shape)  # Output: (1, 64)
\`\`\`

2. **Multi-Head Attention**
   - Multiple attention mechanisms run in parallel
   - Captures different types of relationships in the data

Here's how you might implement multi-head attention:

\`\`\`python
def multi_head_attention(query, key, value, num_heads):
    head_dim = query.shape[1] // num_heads
    
    # Split input for each head
    queries = np.split(query, num_heads, axis=1)
    keys = np.split(key, num_heads, axis=1)
    values = np.split(value, num_heads, axis=1)
    
    # Compute attention for each head
    head_outputs = [self_attention(q, k, v) for q, k, v in zip(queries, keys, values)]
    
    # Concatenate head outputs
    return np.concatenate(head_outputs, axis=1)

# Example usage
query = np.random.randn(1, 256)
key = np.random.randn(10, 256)
value = np.random.randn(10, 256)

multi_head_output = multi_head_attention(query, key, value, num_heads=4)
print(multi_head_output.shape)  # Output: (1, 256)
\`\`\`

3. **Feedforward Neural Networks**
   - Processes the output of the attention layer
   - Introduces non-linearity into the model

## Advantages
- Handles long-range dependencies effectively
- Parallelizable, leading to faster training
- Versatile, applicable to various tasks beyond NLP

## Conclusion
Understanding the Transformer architecture is crucial for working with modern AI models like GPT and BERT.
    `,
    "Transformers vs GANs": `
# Transformers vs GANs

## Introduction
While both Transformers and GANs have revolutionized AI, they serve different purposes and have distinct architectures.

## Transformers
- Primarily used for sequence-to-sequence tasks
- Excel in natural language processing
- Use self-attention mechanisms

Here's a basic outline of a Transformer in PyTorch:

\`\`\`python
import torch
import torch.nn as nn

class Transformer(nn.Module):
    def __init__(self, d_model, nhead, num_encoder_layers, num_decoder_layers):
        super(Transformer, self).__init__()
        self.transformer = nn.Transformer(
            d_model=d_model,
            nhead=nhead,
            num_encoder_layers=num_encoder_layers,
            num_decoder_layers=num_decoder_layers
        )
    
    def forward(self, src, tgt):
        return self.transformer(src, tgt)

# Example usage
model = Transformer(d_model=512, nhead=8, num_encoder_layers=6, num_decoder_layers=6)
src = torch.rand(10, 32, 512)  # (seq_len, batch_size, d_model)
tgt = torch.rand(20, 32, 512)
out = model(src, tgt)
print(out.shape)  # Output: torch.Size([20, 32, 512])
\`\`\`

## GANs (Generative Adversarial Networks)
- Used for generating new data
- Consist of a generator and a discriminator
- Excel in image generation and style transfer

Here's a basic outline of a GAN in PyTorch:

\`\`\`python
import torch.nn as nn

class Generator(nn.Module):
    def __init__(self, latent_dim, img_shape):
        super(Generator, self).__init__()
        self.model = nn.Sequential(
            nn.Linear(latent_dim, 128),
            nn.LeakyReLU(0.2),
            nn.Linear(128, 256),
            nn.BatchNorm1d(256),
            nn.LeakyReLU(0.2),
            nn.Linear(256, img_shape),
            nn.Tanh()
        )

    def forward(self, z):
        img = self.model(z)
        return img

class Discriminator(nn.Module):
    def __init__(self, img_shape):
        super(Discriminator, self).__init__()
        self.model = nn.Sequential(
            nn.Linear(img_shape, 128),
            nn.LeakyReLU(0.2),
            nn.Linear(128, 1),
            nn.Sigmoid()
        )

    def forward(self, img):
        validity = self.model(img)
        return validity

# Example usage
latent_dim = 100
img_shape = 784  # 28x28 flattened
generator = Generator(latent_dim, img_shape)
discriminator = Discriminator(img_shape)

z = torch.randn(64, latent_dim)
generated_imgs = generator(z)
validity = discriminator(generated_imgs)
\`\`\`

## Key Differences
1. **Purpose**: Transformers for understanding and generating sequences, GANs for creating new data
2. **Architecture**: Transformers use attention, GANs use adversarial training
3. **Applications**: Transformers in NLP, GANs in computer vision (though there's overlap)

## Conclusion
Both architectures have their strengths and are pushing the boundaries of AI in different domains.
    `,
    // Add content for other lessons here
  }), [])
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) => (prevProgress >= 100 ? 0 : prevProgress + 10))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    // Simulating course completion progress
    const completionTimer = setInterval(() => {
      setCourseCompletion(prev => ({
        videosWatched: Math.min(prev.videosWatched + 1, 10),
        quizzesTaken: Math.min(prev.quizzesTaken + 0.5, 5),
        assignmentsCompleted: Math.min(prev.assignmentsCompleted + 0.25, 3),
        overallProgress: Math.min(prev.overallProgress + 2, 100)
      }))
    }, 5000)
    return () => clearInterval(completionTimer)
  }, [])

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
      if (sendVideoFramesIntervalRef.current) {
        clearInterval(sendVideoFramesIntervalRef.current)
      }
    }
  }, [])

  const toggleMobileMenu = useCallback(() => {
    setMobileMenuOpen((prev) => !prev)
  }, [])

  const selectLesson = useCallback((index: number) => {
    setCurrentLessonIndex(index)
    setCurrentLessonTitle(lessons[index])
  }, [lessons])

  const handleNavigation = useCallback((href: string) => {
    if (href.startsWith('#')) {
      router.push('/' + href)
    } else {
      router.push(href)
    }
    setMobileMenuOpen(false)
  }, [router])

  const socketRef = useRef<WebSocket | null>(null);
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const [socketStatus, setSocketStatus] = useState("Connecting...");
  const serverReadyRef = useRef(true);
  const activeTabRef = useRef<string>('face');
  const [emotionMap, setEmotionMap] = useState<EmotionMap | null>(null);
  const [warning, setWarning] = useState<string>("");
  const isStreamingRef = useRef<Boolean | null>(false);

  useEffect(() => {
    console.log("Mounting component");
    console.log("Connecting to server");
    connect();

    return () => {
      console.log("Tearing down component");
      disconnect();
    };
  }, []);


  const connect = async () => {
    const socketUrl = `wss://api.hume.ai/v0/stream/models?api_key=${process.env.NEXT_PUBLIC_HUME_API_KEY}`;

    serverReadyRef.current = true;
    console.log(`Connecting to websocket... (using ${socketUrl})`);

    setSocketStatus('Connecting...')

    socketRef.current = new WebSocket(socketUrl);
    socketRef.current.onopen = socketOnOpen;
    socketRef.current.onmessage = socketOnMessage;
    socketRef.current.onclose = socketOnClose;
    socketRef.current.onerror = socketOnError;
  }

  const socketOnOpen = async () => {
    console.log("Connected to websocket");
    setSocketStatus("Connected");
    setIsSocketConnected(true);
  }

  const socketOnMessage = async (event: MessageEvent) => {
    console.log("event", event)
    const data = JSON.parse(event.data as string);
    if (data[activeTabRef.current] && data[activeTabRef.current].predictions && data[activeTabRef.current].predictions.length > 0) {
      const emotions: Emotion[] = data[activeTabRef.current].predictions[0].emotions;
      console.log(data)
      const map: EmotionMap = {};
      emotions.forEach((emotion: Emotion) => map[emotion.name] = emotion.score);
      setEmotionMap(map);
    }
    else {
      const warning = data[activeTabRef.current]?.warning || "";
      console.log("warning:", warning)
      setWarning(warning)
      setEmotionMap(null)
    }

  }

  const socketOnClose = async (event: CloseEvent) => {
    setSocketStatus('Disconnected');
    disconnect();
    console.log("Socket closed");
    setIsSocketConnected(false)
  }

  const socketOnError = async (event: Event) => {
    console.error("Socket failed to connect: ", event);
    // if(numReconnects.current < maxReconnects) {
    //     setSocketStatus('Reconnecting');
    //     numReconnects.current++;
    //     connect();
    // }
  }

  function disconnect() {
    console.log("Stopping everything...");
    // mountRef.current = true;
    const socket = socketRef.current;

    if (socket) {
      console.log("Closing socket");
      socket.close();
      if (socket.readyState === WebSocket.CLOSING) {
        setSocketStatus('Closing...');
        socketRef.current = null;
      }
    } else console.warn("Could not close socket, not initialized yet");

    stopVideoStream();
  }

  const startSendingFrames = () => {
    let video = videoRef.current;
    const sendVideoFrames = () => {
      if (video && canvasRef.current && socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
        const context = canvasRef.current.getContext('2d');
        if (context && video) {
          canvasRef.current.width = video.videoWidth;
          canvasRef.current.height = video.videoHeight;
          context.drawImage(video, 0, 0, canvasRef.current.width, canvasRef.current.height);
          const imageData = canvasRef.current.toDataURL('image/jpeg', 0.8);
          const base64Data = imageData.split(',')[1];

          // setCapturedImage(imageData);

          // Send the image data via WebSocket
          socketRef.current.send(JSON.stringify({
            data: base64Data,
            models: {
              face: {}
            }
          }));
        }
      }
    };

    sendVideoFramesIntervalRef.current = setInterval(sendVideoFrames, 1000);
  };

  const stopVideoStream = () => {
    console.log('Stopping video stream')
    // Stop the sending frames interval
    isStreamingRef.current = false;

    if (streamRef.current) {
      streamRef.current?.getTracks()?.forEach(track => track.stop());
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    // if (socketRef.current) {
    //   socketRef.current.close();
    // }
    setIsStreaming(false);
    setEmotionMap(null);
    // Stop the interval that sends frames
    if (sendVideoFramesIntervalRef.current) {
      clearInterval(sendVideoFramesIntervalRef.current);
      sendVideoFramesIntervalRef.current = null;
    }
  };


  const sortedEmotions = useMemo(() => {
    if (!emotionMap) return [];
    return Object.entries(emotionMap)
      .sort(([, a], [, b]) => b - a)
      .map(([emotion, score]) => ({ emotion, score }));
  }, [emotionMap]);

  console.log("sorted emotion", sortedEmotions)


  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null)

  const startVideoStream = async () => {
    try {
      console.log('Attempting to access camera...');
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      console.log('Camera access successful, setting up video stream...');
      streamRef.current = stream;
      setMediaStream(stream)
      setIsStreaming(true);
      console.log('isStreaming set to true');
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  };

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = mediaStream;
      videoRef.current.play();
      console.log('Video element source set successfully');
      startSendingFrames();
    }
  }, [mediaStream, videoRef])


  const renderNavigationItems = useMemo(() => (
    navigationItems.map((item) => (
      <Button
        key={item.name}
        variant="ghost"
        onClick={() => handleNavigation(item.href)}
        className="text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 px-2 py-1 rounded-md text-xs font-medium whitespace-nowrap"
      >
        {item.name}
      </Button>
    ))
  ), [navigationItems, handleNavigation])

  const renderMobileMenu = useMemo(() => (
    mobileMenuOpen && (
      <div className="md:hidden bg-white dark:bg-gray-800 shadow">
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {navigationItems.map((item) => (
            <Button
              key={item.name}
              variant="ghost"
              onClick={() => handleNavigation(item.href)}
              className="w-full text-left text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 block px-3 py-2 rounded-md text-base font-medium"
            >
              {item.name}
            </Button>
          ))}
        </div>
      </div>
    )
  ), [mobileMenuOpen, navigationItems, handleNavigation])

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <div className="flex flex-col h-screen bg-gray-100 dark:bg-gray-900">
        <header className="bg-white dark:bg-gray-800 shadow z-10 sticky top-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <Button variant="ghost" size="icon" className="mr-2 md:hidden" onClick={toggleMobileMenu} aria-label="Toggle menu">
                  {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </Button>
                <Button variant="link" onClick={() => router.push('/')} className="text-2xl font-bold dark:text-white mr-4">ADAPTIVE LEARNING</Button>
                <nav className="hidden md:flex space-x-2">
                  {renderNavigationItems}
                </nav>
              </div>

            </div>
          </div>
        </header>
        {renderMobileMenu}
        <main className="flex-1 overflow-auto p-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                <h2 className="text-xl font-bold mb-4 dark:text-white">{currentLessonTitle}</h2>
                <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg mb-4">
                  <Teleprompter content={lessonContent[currentLessonTitle as keyof typeof lessonContent]} />
                </div>

              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                <h2 className="text-xl font-bold mb-4 dark:text-white">Course Progress</h2>
                <div className="relative w-full aspect-video mb-4">
                  {isStreaming ? (
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="absolute inset-0 w-full h-full object-cover rounded-lg z-10"
                    />
                  ) : (
                    <div
                      onClick={startVideoStream}
                      className="absolute inset-0 w-full h-full rounded bg-gray-200 dark:bg-gray-700 flex cursor-pointer flex-col justify-center items-center"
                    >
                      <Webcam strokeWidth={1} className='animate-bounce rounded-full size-8 p-1 bg-gray-300 dark:bg-gray-600' />
                      <p className='text-sm text-gray-600 dark:text-gray-300'>Start Webcam</p>
                    </div>
                  )}
                  <canvas
                    ref={canvasRef}
                    className="absolute inset-0 w-full h-full hidden"
                  />
                  {isStreaming && (
                    <Button
                      variant="destructive"
                      size="sm"
                      className="rounded-full absolute bottom-2 left-2 z-20"
                      onClick={stopVideoStream}
                    >
                      <Pause strokeWidth={1} fill='white' />
                    </Button>
                  )}
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium dark:text-white">Videos Watched</span>
                    <span className="text-sm font-medium dark:text-white">{courseCompletion.videosWatched}/10</span>
                  </div>
                  <Progress value={(courseCompletion.videosWatched / 10) * 100} className="w-full" />
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium dark:text-white">Quizzes Taken</span>
                    <span className="text-sm font-medium dark:text-white">{courseCompletion.quizzesTaken}/5</span>
                  </div>
                  <Progress value={(courseCompletion.quizzesTaken / 5) * 100} className="w-full" />
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium dark:text-white">Assignments Completed</span>
                    <span className="text-sm font-medium dark:text-white">{courseCompletion.assignmentsCompleted}/3</span>
                  </div>
                  <Progress value={(courseCompletion.assignmentsCompleted / 3) * 100} className="w-full" />
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium dark:text-white">Overall Progress</span>
                    <span className="text-sm font-medium dark:text-white">{courseCompletion.overallProgress.toFixed(1)}%</span>
                  </div>
                  <Progress value={courseCompletion.overallProgress} className="w-full" />
                </div>
              </div>
            </div>
            <div className="mt-4 bg-white dark:bg-gray-800 rounded-lg shadow p-4">
              <h2 className="text-xl font-bold mb-4 dark:text-white">Applied AI Curriculum</h2>
              <div className="space-y-2">
                {lessons.map((lesson, index) => (
                  <Button
                    key={index}
                    variant={currentLessonIndex === index ? "default" : "outline"}
                    className="w-full justify-start"
                    onClick={() => selectLesson(index)}
                  >
                    <BookOpen className="mr-2 h-4 w-4" />
                    {lesson}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </main>
        <EmotionSpiderChart sortedEmotions={sortedEmotions} />
        <ExpressionGraph sortedEmotion={sortedEmotions} />
      </div>
    </ErrorBoundary>
  )
}