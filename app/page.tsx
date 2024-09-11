'use client';
import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ErrorBoundary } from "react-error-boundary";
import { BookOpen, List, PlayCircle, User, Video, Menu, Search, Bell, Settings, X, Moon, Sun, Webcam, Pause, ChevronDown, ChevronRight, FileText, HelpCircle, Maximize, Minimize } from "lucide-react";
import Teleprompter from '@/components/Teleprompter';
import EmotionSpiderChart from "@/components/EmotionSpider";
import ExpressionGraph from "@/components/ExpressionGraph";
import Curriculum from '@/components/Curriculum';
import Quiz from "@/components/Quiz";
import { Emotion, EmotionMap } from '@/lib/data/emotion';
import Bored from '@/components/Bored';
import { lessonContent } from './lessonContent';

export type ChapterType = 'video' | 'text' | 'quiz';

export interface Chapter {
  id: string;
  title: string;
  type: ChapterType;
  content: string;
}

export interface Module {
  id: string;
  title: string;
  chapters: Chapter[];
}

interface FallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div role="alert" className="p-4 bg-red-100 dark:bg-red-900 text-red-900 dark:text-red-100 rounded-lg">
      <h2 className="text-lg font-semibold mb-2">Something went wrong:</h2>
      <pre className="text-sm overflow-auto">{error.message}</pre>
      <Button onClick={resetErrorBoundary} className="mt-4">Try again</Button>
    </div>
  );
}

function DarkModeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      aria-label="Toggle dark mode"
    >
      {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </Button>
  );
}

export default function LecturePage() {
  const [currentChapter, setCurrentChapter] = useState<Chapter | null>(null);
  const [completedChapters, setCompletedChapters] = useState<Set<string>>(new Set());
  const [progress, setProgress] = useState(0);
  const [courseCompletion, setCourseCompletion] = useState({
    videosWatched: 0,
    quizzesTaken: 0,
    assignmentsCompleted: 0,
    overallProgress: 0
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const sendVideoFramesIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [currentLesson, setCurrentLesson] = useState<string>("Applied Transformer Architecture");

  const navigationItems = useMemo(() => [
    { name: "Product", href: "#" },
      { name: "Personalization", href: "#" },
      { name: "Account", href: "#" },
      { name: "Contact Us", href: "#" },
  ], []);

  const curriculum: Module[] = [
    {
      id: "module1",
      title: "Applied Transformer Architecture",
      chapters: [
        { id: "1.1", title: "Introduction to Transformers", type: "video", content: "https://www.youtube.com/watch?v=wjZofJX0v4M&ab_channel=3Blue1Brown" },
        { id: "1.2", title: "Self-Attention Mechanism", type: "text", content: "The self-attention mechanism is a key component of transformer architectures..." },
        { id: "1.3", title: "Multi-Head Attention", type: "video", content: "https://www.youtube.com/watch?v=lmepFoddjgQ&ab_channel=learningcurve" },
        {
          id: "1.4", title: "Transformer Architecture Quiz", type: "quiz", content: JSON.stringify([
            {
              question: "What is the key component of transformer architecture?",
              options: ["CNN", "RNN", "Self-Attention", "LSTM"],
              correctAnswer: 2
            },
            {
              question: "Which of the following is NOT a common application of transformers?",
              options: ["Natural Language Processing", "Image Classification", "Speech Recognition", "Time Series Forecasting"],
              correctAnswer: 1
            },
            {
              question: "What is the primary advantage of multi-head attention over single-head attention?",
              options: ["Faster computation", "Ability to focus on different parts of the input", "Reduced model size", "Increased interpretability"],
              correctAnswer: 1
            }
          ])
        },
      ]
    },
    {
      id: "module2",
      title: "Transformers vs GANs",
      chapters: [
        { id: "2.1", title: "Overview of GANs", type: "video", content: "https://www.youtube.com/watch?v=8L11aMN5KY8&ab_channel=Serrano.Academy" },
        { id: "2.2", title: "Comparing Architectures", type: "text", content: "When comparing Transformers and GANs, it's important to consider their fundamental differences..." },
        { id: "2.3", title: "Use Cases and Applications", type: "text", content: "Transformers and GANs have distinct use cases in the field of AI..." },
        {
          id: "2.4", title: "Transformers vs GANs Quiz", type: "quiz", content: JSON.stringify([
            {
              question: "Which architecture is primarily used for generative tasks?",
              options: ["Transformers", "GANs", "Both", "Neither"],
              correctAnswer: 1
            },
            {
              question: "What is a key difference between Transformers and GANs?",
              options: ["Transformers use attention, GANs use convolution", "Transformers are unsupervised, GANs are supervised", "Transformers are for text, GANs are for images", "Transformers have no generator, GANs have a generator-discriminator pair"],
              correctAnswer: 3
            },
            {
              question: "In which task would you typically NOT use a GAN?",
              options: ["Image generation", "Text summarization", "Data augmentation", "Style transfer"],
              correctAnswer: 1
            }
          ])
        },
      ]
    },
  ];

  useEffect(() => {
    setCurrentChapter({
      id: "initial",
      title: currentLesson,
      type: "text",
      content: lessonContent[currentLesson as keyof typeof lessonContent]
    });
  }, [currentLesson]);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) => (prevProgress >= 100 ? 0 : prevProgress + 10));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const completionTimer = setInterval(() => {
      setCourseCompletion(prev => ({
        videosWatched: Math.min(prev.videosWatched + 1, 10),
        quizzesTaken: Math.min(prev.quizzesTaken + 0.5, 5),
        assignmentsCompleted: Math.min(prev.assignmentsCompleted + 0.25, 3),
        overallProgress: Math.min(prev.overallProgress + 2, 100)
      }));
    }, 5000);
    return () => clearInterval(completionTimer);
  }, []);

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (sendVideoFramesIntervalRef.current) {
        clearInterval(sendVideoFramesIntervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const toggleMobileMenu = useCallback(() => {
    setMobileMenuOpen((prev) => !prev);
  }, []);

  const handleNavigation = useCallback((href: string) => {
    if (href.startsWith('#')) {
      router.push('/' + href);
    } else {
      router.push(href);
    }
    setMobileMenuOpen(false);
  }, [router]);

  const handleChapterSelect = useCallback((moduleIndex: number, chapterIndex: number) => {
    const selectedChapter = curriculum[moduleIndex].chapters[chapterIndex];
    setCurrentChapter(selectedChapter);
  }, [curriculum]);

  const handleChapterComplete = useCallback((chapterId: string) => {
    setCompletedChapters(prev => new Set(prev).add(chapterId));
  }, []);

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
  }, [])

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
  }

  function disconnect() {
    console.log("Stopping everything...");
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

          socketRef.current.send(JSON.stringify({
            data: base64Data,
            models: {
              face: {}
            }
          }));
        }
      }
    }
    sendVideoFramesIntervalRef.current = setInterval(sendVideoFrames, 1000);
  }

  const stopVideoStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsStreaming(false);
    if (sendVideoFramesIntervalRef.current) {
      clearInterval(sendVideoFramesIntervalRef.current);
    }
  };

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
  }

  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null)
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = mediaStream;
      videoRef.current.play();
      console.log('Video element source set successfully');
      startSendingFrames();
    }
  }, [mediaStream, videoRef])

  const getYouTubeEmbedUrl = (url: string) => {
    const videoId = url.split('v=')[1];
    const ampersandPosition = videoId.indexOf('&');
    if (ampersandPosition !== -1) {
      return `https://www.youtube.com/embed/${videoId.substring(0, ampersandPosition)}`;
    }
    return `https://www.youtube.com/embed/${videoId}`;
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      if (contentRef.current?.requestFullscreen) {
        contentRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  const renderChapterContent = () => {
    if (!currentChapter) return null;

    const fullscreenButton = (
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleFullscreen}
        className="absolute top-2 right-2 z-20"
        aria-label="Toggle fullscreen"
      >
        {isFullscreen ? <Minimize className="h-6 w-6" /> : <Maximize className="h-6 w-6" />}
      </Button>
    );

    switch (currentChapter.type) {
      case 'video':
        if (currentChapter.content.includes('youtube.com')) {
          const embedUrl = getYouTubeEmbedUrl(currentChapter.content);
          return (
            <div className="relative aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg mb-4">
              {fullscreenButton}
              <iframe
                src={embedUrl}
                title={currentChapter.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
          );
        } else {
          return (
            <div className="relative aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg mb-4">
              {fullscreenButton}
              <video src={currentChapter.content} controls className="w-full h-full" />
            </div>
          );
        }

      case 'text':
        return (
          <div className="relative aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg mb-4 overflow-auto p-4">
            {fullscreenButton}
            <Teleprompter content={lessonContent[currentLesson as keyof typeof lessonContent]} />
          </div>
        );

      case 'quiz':
        const quizData = JSON.parse(currentChapter.content);
        return (
          <div className="relative aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg mb-4 overflow-auto p-4">
            {fullscreenButton}
            <Quiz
              questions={quizData}
              onComplete={(score) => {
                console.log(`Quiz completed with score: ${score}`);
                handleChapterComplete(currentChapter.id);
                setCourseCompletion(prev => ({
                  ...prev,
                  quizzesTaken: Math.min(prev.quizzesTaken + 1, 5),
                  overallProgress: Math.min(prev.overallProgress + 5, 100)
                }));
              }}
            />
          </div>
        );

      default:
        return null;
    }
  };

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
  ), [navigationItems, handleNavigation]);

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
  ), [mobileMenuOpen, navigationItems, handleNavigation]);

  const sortedEmotions = useMemo(() => {
    if (!emotionMap) return [];
    return Object.entries(emotionMap)
      .sort(([, a], [, b]) => b - a)
      .map(([emotion, score]) => ({ emotion, score }));
  }, [emotionMap]);

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
              <div className="flex items-center">
                <DarkModeToggle />
              </div>
            </div>
          </div>
        </header>
        {renderMobileMenu}
        <main className="flex-1 overflow-auto p-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div ref={contentRef} className="md:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                <h2 className="text-xl font-bold mb-4 dark:text-white">
                  {currentChapter ? currentChapter.title : "Welcome to Applied AI"}
                </h2>
                {renderChapterContent()}
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                <h2 className="text-xl font-bold mb-4 dark:text-white">Engagement</h2>
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
                  <h2 className="text-xl font-bold mb-4 dark:text-white">Course Progress</h2>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium dark:text-white">Videos Watched</span>
                    <span className="text-sm font-medium dark:text-white">{courseCompletion.videosWatched}/10</span>
                  </div>
                  <Progress value={(courseCompletion.videosWatched / 10) * 100} className="w-full"/>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium dark:text-white">Quizzes Taken</span>
                    <span className="text-sm font-medium dark:text-white">{courseCompletion.quizzesTaken}/5</span>
                  </div>
                  <Progress value={(courseCompletion.quizzesTaken / 5) * 100} className="w-full"/>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium dark:text-white">Assignments Completed</span>
                    <span className="text-sm font-medium dark:text-white">{courseCompletion.assignmentsCompleted}/3</span>
                  </div>
                  <Progress value={(courseCompletion.assignmentsCompleted / 3) * 100} className="w-full"/>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium dark:text-white">Overall Progress</span>
                    <span className="text-sm font-medium dark:text-white">{courseCompletion.overallProgress.toFixed(1)}%</span>
                  </div>
                  <Progress value={courseCompletion.overallProgress} className="w-full"/>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <Curriculum
                curriculum={curriculum}
                onChapterSelect={handleChapterSelect}
                completedChapters={completedChapters}
                onChapterComplete={handleChapterComplete}
              />
            </div>
          </div>
        </main>
        <EmotionSpiderChart sortedEmotions={sortedEmotions} />
        <ExpressionGraph sortedEmotion={sortedEmotions} />
        <Bored sortedEmotion={sortedEmotions} />
      </div>
    </ErrorBoundary>
  );
}