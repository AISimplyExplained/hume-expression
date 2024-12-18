"use client";
import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ErrorBoundary } from "react-error-boundary";
import Image from "next/image";
import {
  Menu,
  X,
  Moon,
  Sun,
  Webcam,
  Pause,
  RadioTower,
  ChartSpline,
  XIcon,
  Bot,
  ChevronDown,
} from "lucide-react";
import ExpressionGraph, { colors } from "@/components/ExpressionGraph";
import Curriculum from "@/components/Curriculum";
import { Emotion, EmotionMap } from "@/lib/data/emotion";
import Bored from "@/components/Bored";
import { lessonContent } from "../lessonContent";
import RenderChapterContent from "@/components/RenderChapterContent";
import { useTitleStore } from "@/lib/store";
import WebcamAlertDialog from "@/components/WebCamAlert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TimedFeedbackDialog } from "@/components/TimesFeedBack";
import ConfidenceAssessment from "@/components/ConfidenceAssessment";
import { EmotionName, Point } from "@/lib/types";
import AchievementAlertDialog from "@/components/AchievementAlertDialog";
import { EnergyIcon, EnergyBadge, StreakIcon } from "../../components/Energy";
import LevelDialog from "@/components/CustomDialogs/LevelDialog";
import Chatbot from "@/components/Chatbot";
import CourseFeedbackForm from "@/components/CourseFeedbackForm";
import PersonalizedLearningSummaryDialog from "@/components/PersonalizedLearningSummaryDialog";
import { updateStateOnServer } from "../actions";
import SendGraph from "@/components/SendGraph";
import EmotionSpiderChart from "@/components/EmotionSpider";

export type ChapterType = "video" | "text" | "quiz" | "game";

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
    <div
      role="alert"
      className="p-4 bg-red-100 dark:bg-red-900 text-red-900 dark:text-red-100 rounded-lg"
    >
      <h2 className="text-lg font-semibold mb-2">Something went wrong:</h2>
      <pre className="text-sm overflow-auto">{error.message}</pre>
      <Button onClick={resetErrorBoundary} className="mt-4">
        Try again
      </Button>
    </div>
  );
}

function DarkModeToggle() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className=""
      onClick={toggleTheme}
      aria-label="Toggle dark mode"
    >
      {theme === "dark" ? (
        <Sun className="h-5 w-5" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
    </Button>
  );
}

export default function LecturePage() {
  const [currentChapter, setCurrentChapter] = useState<Chapter | null>(null);
  const [completedChapters, setCompletedChapters] = useState<Set<string>>(
    new Set()
  );
  const [showEngagement, setShowEngagement] = useState<boolean>(false);
  const [progress, setProgress] = useState(0);
  const [courseCompletion, setCourseCompletion] = useState({
    quizzesTaken: 0,
    overallProgress: 0,
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
  const [currentLesson, setCurrentLesson] = useState<string>(
    "Applied Transformer Architecture"
  );
  const [showAchievement, setShowAchievement] = useState<boolean>(false);
  const [showLevelUpgrade, setShowLevelUpgrade] = useState<boolean>(false);
  const [engagementHistory, setEngagementHistory] = useState<Point[]>([
    { time: "00:00:00", emotion: "Concentration", score: 0.0 },
  ]);
  const [energy, setEnergy] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [level, setLevel] = useState<number>(0);
  const { setTitle } = useTitleStore();

  const navigationItems = useMemo(
    () => [
      { name: "Product", href: "#" },
      { name: "Personalization", href: "#" },
      { name: "Account", href: "#" },
      { name: "Contact Us", href: "#" },
    ],
    []
  );

  // useEffect(() => {
  //   const postToServer = async () => {
  //     await updateStateOnServer(energy, streak, level);
  //   };

  //   postToServer();
  // }, [energy, streak, level]);

  const curriculum: Module[] = [
    {
      id: "module1",
      title: "Applied Transformer Architecture",
      chapters: [
        {
          id: "1.1",
          title: "Introduction to Transformers",
          type: "video",
          content:
            "https://www.youtube.com/watch?v=wjZofJX0v4M&ab_channel=3Blue1Brown",
        },
        {
          id: "1.2",
          title: "Self-Attention Mechanism",
          type: "text",
          content:
            "The self-attention mechanism is a key component of transformer architectures...",
        },
        {
          id: "1.3",
          title: "Multi-Head Attention",
          type: "video",
          content:
            "https://www.youtube.com/watch?v=lmepFoddjgQ&ab_channel=learningcurve",
        },
        {
          id: "1.4",
          title: "Build Your Own Transformer",
          type: "game",
          content: "",
        },
        {
          id: "1.5",
          title: "Transformer Architecture Quiz",
          type: "quiz",
          content: JSON.stringify([
            {
              question:
                "What is the key component of transformer architecture?",
              options: ["CNN", "RNN", "Self-Attention", "LSTM"],
              correctAnswer: 2,
            },
            {
              question:
                "Which of the following is NOT a common application of transformers?",
              options: [
                "Natural Language Processing",
                "Image Classification",
                "Speech Recognition",
                "Time Series Forecasting",
              ],
              correctAnswer: 1,
            },
            {
              question:
                "What is the primary advantage of multi-head attention over single-head attention?",
              options: [
                "Faster computation",
                "Ability to focus on different parts of the input",
                "Reduced model size",
                "Increased interpretability",
              ],
              correctAnswer: 1,
            },
          ]),
        },
      ],
    },
    {
      id: "module2",
      title: "Transformers vs GANs",
      chapters: [
        {
          id: "2.1",
          title: "Overview of GANs",
          type: "video",
          content:
            "https://www.youtube.com/watch?v=8L11aMN5KY8&ab_channel=Serrano.Academy",
        },
        {
          id: "2.2",
          title: "Comparing Architectures",
          type: "text",
          content:
            "When comparing Transformers and GANs, it's important to consider their fundamental differences...",
        },
        {
          id: "2.3",
          title: "Use Cases and Applications",
          type: "text",
          content:
            "Transformers and GANs have distinct use cases in the field of AI...",
        },
        {
          id: "2.4",
          title: "Transformers vs GANs Quiz",
          type: "quiz",
          content: JSON.stringify([
            {
              question:
                "Which architecture is primarily used for generative tasks?",
              options: ["Transformers", "GANs", "Both", "Neither"],
              correctAnswer: 1,
            },
            {
              question:
                "What is a key difference between Transformers and GANs?",
              options: [
                "Transformers use attention, GANs use convolution",
                "Transformers are unsupervised, GANs are supervised",
                "Transformers are for text, GANs are for images",
                "Transformers have no generator, GANs have a generator-discriminator pair",
              ],
              correctAnswer: 3,
            },
            {
              question: "In which task would you typically NOT use a GAN?",
              options: [
                "Image generation",
                "Text summarization",
                "Data augmentation",
                "Style transfer",
              ],
              correctAnswer: 1,
            },
          ]),
        },
      ],
    },
  ];

  useEffect(() => {
    setCurrentChapter({
      id: "initial",
      title: currentLesson,
      type: "text",
      content: lessonContent[currentLesson as keyof typeof lessonContent],
    });
  }, [currentLesson]);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) =>
        prevProgress >= 100 ? 0 : prevProgress + 10
      );
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const completionTimer = setInterval(() => {
      setCourseCompletion((prev) => ({
        quizzesTaken: Math.min(prev.quizzesTaken + 0.5, 5),
        overallProgress: Math.min(prev.overallProgress + 2, 100),
      }));
    }, 5000);
    return () => clearInterval(completionTimer);
  }, []);

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
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

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  useEffect(() => {
    if (streak !== 0 && streak % 3 === 0) {
      setShowLevelUpgrade(true);
      setLevel(streak % 3);
    }
  }, [streak]);

  const toggleMobileMenu = useCallback(() => {
    setMobileMenuOpen((prev) => !prev);
  }, []);

  const handleNavigation = useCallback(
    (href: string) => {
      if (href.startsWith("#")) {
        router.push("/" + href);
      } else {
        router.push(href);
      }
      setMobileMenuOpen(false);
    },
    [router]
  );

  const handleChapterSelect = useCallback(
    (moduleIndex: number, chapterIndex: number) => {
      const selectedChapter = curriculum[moduleIndex].chapters[chapterIndex];
      setCurrentChapter(selectedChapter);
      setCurrentLesson(curriculum[moduleIndex].title);
      setTitle(curriculum[moduleIndex].title);
    },
    [curriculum]
  );

  const handleChapterComplete = useCallback(
    (chapterId: string) => {
      setCompletedChapters((prev) => new Set(prev).add(chapterId));
      setEnergy((prev) => prev + 100);
      const engagementPercentage =
        calculateEngagementPercentage(engagementHistory);
      // if (engagementPercentage > 50) setShowAchievement(true);
      setShowAchievement(true);
    },
    [engagementHistory, energy]
  );

  const socketRef = useRef<WebSocket | null>(null);
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const [socketStatus, setSocketStatus] = useState("Connecting...");
  const serverReadyRef = useRef(true);
  const activeTabRef = useRef<string>("face");
  const [emotionMap, setEmotionMap] = useState<EmotionMap | null>(null);
  const [warning, setWarning] = useState<string>("");
  const isStreamingRef = useRef<Boolean | null>(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showWebCamAlert, setShowWebCamAlert] = useState(false);
  const [isWebCamOn, setIsWebCamOn] = useState(false);

  useEffect(() => {
    console.log("Mounting component");
    console.log("Connecting to server");
    connect();

    return () => {
      console.log("Tearing down component");
      disconnect();
    };
  }, []);

  useEffect(() => {
    if (isPlaying) {
      if (!isWebCamOn) {
        setIsPlaying(false);
        setShowWebCamAlert(true);
      }
    }
  }, [isPlaying, isWebCamOn, showWebCamAlert]);

  const connect = async () => {
    const socketUrl = `wss://api.hume.ai/v0/stream/models?api_key=${process.env.NEXT_PUBLIC_HUME_API_KEY}`;

    serverReadyRef.current = true;
    console.log(`Connecting to websocket... `);

    setSocketStatus("Connecting...");

    socketRef.current = new WebSocket(socketUrl);
    socketRef.current.onopen = socketOnOpen;
    socketRef.current.onmessage = socketOnMessage;
    socketRef.current.onclose = socketOnClose;
    socketRef.current.onerror = socketOnError;
  };

  const socketOnOpen = async () => {
    console.log("Connected to websocket");
    setSocketStatus("Connected");
    setIsSocketConnected(true);
  };

  const socketOnMessage = async (event: MessageEvent) => {
    const data = JSON.parse(event.data as string);
    if (
      data[activeTabRef.current] &&
      data[activeTabRef.current].predictions &&
      data[activeTabRef.current].predictions.length > 0
    ) {
      const emotions: Emotion[] =
        data[activeTabRef.current].predictions[0].emotions;
      const map: EmotionMap = {};
      emotions.forEach(
        (emotion: Emotion) => (map[emotion.name] = emotion.score)
      );
      setEmotionMap(map);
    } else {
      const warning = data[activeTabRef.current]?.warning || "";
      console.log("warning:", warning);
      setWarning(warning);
      setEmotionMap(null);
    }
  };

  const socketOnClose = async (event: CloseEvent) => {
    setSocketStatus("Disconnected");
    disconnect();
    console.log("Socket closed");
    setIsSocketConnected(false);
  };

  const socketOnError = async (event: Event) => {
    console.error("Socket failed to connect: ", event);
  };

  function disconnect() {
    console.log("Stopping everything...");
    const socket = socketRef.current;

    if (socket) {
      console.log("Closing socket");
      socket.close();
      if (socket.readyState === WebSocket.CLOSING) {
        setSocketStatus("Closing...");
        socketRef.current = null;
      }
    } else console.warn("Could not close socket, not initialized yet");

    stopVideoStream();
  }

  const startSendingFrames = () => {
    let video = videoRef.current;
    const sendVideoFrames = () => {
      if (
        video &&
        canvasRef.current &&
        socketRef.current &&
        socketRef.current.readyState === WebSocket.OPEN
      ) {
        const context = canvasRef.current.getContext("2d");
        if (context && video) {
          canvasRef.current.width = video.videoWidth;
          canvasRef.current.height = video.videoHeight;
          context.drawImage(
            video,
            0,
            0,
            canvasRef.current.width,
            canvasRef.current.height
          );
          const imageData = canvasRef.current.toDataURL("image/jpeg", 0.8);
          const base64Data = imageData.split(",")[1];

          socketRef.current.send(
            JSON.stringify({
              data: base64Data,
              models: {
                face: {},
              },
            })
          );
        }
      }
    };
    sendVideoFramesIntervalRef.current = setInterval(sendVideoFrames, 1000);
  };

  const stopVideoStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsStreaming(false);
    setIsPlaying(false);
    setIsWebCamOn(false);
    if (sendVideoFramesIntervalRef.current) {
      clearInterval(sendVideoFramesIntervalRef.current);
    }
  };

  const startVideoStream = async () => {
    try {
      if (!isSocketConnected) {
        connect();
      }
      console.log("Attempting to access camera...");
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      console.log("Camera access successful, setting up video stream...");
      streamRef.current = stream;
      setMediaStream(stream);
      setShowWebCamAlert(false);
      setIsStreaming(true);
      setIsWebCamOn(true);
      console.log("isStreaming set to true");
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  };

  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = mediaStream;
      videoRef.current.play();
      console.log("Video element source set successfully");
      startSendingFrames();
    }
  }, [mediaStream, videoRef]);

  const toggleFullscreen = () => {
    if (contentRef.current) {
      if (isFullscreen) {
        contentRef.current.classList.remove("fullscreen-mode");
      } else {
        contentRef.current.classList.add("fullscreen-mode");
      }
      setIsFullscreen(!isFullscreen);
    }
  };

  const renderNavigationItems = useMemo(
    () =>
      navigationItems.map((item) => (
        <Button
          key={item.name}
          variant="ghost"
          onClick={() => handleNavigation(item.href)}
          className="text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 px-2 py-1 rounded-md text-xs font-medium whitespace-nowrap"
        >
          {item.name}
        </Button>
      )),
    [navigationItems, handleNavigation]
  );

  const renderMobileMenu = useMemo(
    () =>
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
      ),
    [mobileMenuOpen, navigationItems, handleNavigation]
  );

  const sortedEmotions = useMemo(() => {
    if (!emotionMap) return [];
    if (!isStreaming) return [];
    return Object.entries(emotionMap)
      .sort(([, a], [, b]) => b - a)
      .map(([emotion, score]) => ({ emotion, score }));
  }, [emotionMap]);

  const handleEngagementDialog = (isOpen: boolean) => {
    setShowEngagement(isOpen);
  };

  useEffect(() => {
    setEngagementHistory((prevData) => {
      if (!emotionMap) {
        return prevData;
      }

      let maxEmotion = null;
      let maxScore = -Infinity;

      colors.forEach(({ emotion }) => {
        const score = emotionMap[emotion];
        if (score > maxScore) {
          maxScore = score;
          maxEmotion = emotion;
        }
      });

      if (!maxEmotion) {
        return prevData;
      }

      const date = new Date().toLocaleTimeString();
      const selectedEmotion: Point = {
        time: date,
        emotion: maxEmotion as EmotionName,
        score: maxScore,
      };

      // insertData({
      //   date: date,
      //   emotion: selectedEmotion.emotion,
      //   score: selectedEmotion.score
      // })
      //   .then(() => console.log('Data inserted successfully!'))
      //   .catch(err => console.error('Error inserting data:', err));

      const newData = [...prevData, selectedEmotion];
      return newData; // Keep only the last 8 records
    });
  }, [emotionMap]);

  const calculateEngagementPercentage = (
    engagementHistory: Point[]
  ): number => {
    const stronglyEngagedEmotions = [
      "Concentration",
      "Interest",
      "Joy",
      "Doubt",
      "Calmness",
      "Confusion",
    ];
    const totalScore = engagementHistory.reduce(
      (acc, entry) => acc + entry.score,
      0
    );

    if (totalScore === 0) return 0;

    const stronglyEngagedScore = engagementHistory
      .filter((entry) => stronglyEngagedEmotions.includes(entry.emotion))
      .reduce((acc, entry) => acc + entry.score, 0);

    return (stronglyEngagedScore / totalScore) * 100;
  };

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <div className="flex flex-col h-screen bg-gray-100 dark:bg-gray-900">
        <header className="bg-white dark:bg-gray-800 shadow z-10 sticky top-0">
          <div className="mx-auto max-w-[95rem]">
            <div className="flex justify-between items-center h-16 ">
              <div className="flex items-center">
                <Button
                  variant="ghost"
                  size="icon"
                  className="mr-2 md:hidden"
                  onClick={toggleMobileMenu}
                  aria-label="Toggle menu"
                >
                  {mobileMenuOpen ? (
                    <X className="h-6 w-6" />
                  ) : (
                    <Menu className="h-6 w-6" />
                  )}
                </Button>
                <Button
                  variant="link"
                  onClick={() => router.push("/")}
                  className="text-2xl font-bold dark:text-white mr-4 flex items-center"
                >
                  <Image
                    src="/logo.png"
                    alt="Adaptive Learning Logo"
                    width={30}
                    height={30}
                    className="mr-2"
                  />
                  ADAPTIVE INTELLIGENCE (AI)
                </Button>
                <nav className="hidden md:flex space-x-2">
                  {renderNavigationItems}
                </nav>
              </div>

              <div className="flex items-center space-x-4">
                <StreakIcon count={streak} />
                <EnergyIcon energy={energy} />
                <DarkModeToggle />
                <Avatar className="h-8 w-8">
                  <AvatarFallback>AL</AvatarFallback>
                </Avatar>
              </div>
            </div>
          </div>
        </header>
        {renderMobileMenu}
        <main className="flex-1 p-4">
          <div className="max-w-[95rem] mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-8 gap-4">
              {/* Video Content on left */}
              <div
                ref={contentRef}
                className="md:col-span-5 bg-white dark:bg-gray-800 rounded-lg shadow p-4"
              >
                <h2 className="text-xl font-bold mb-7 dark:text-white">
                  {currentChapter
                    ? currentChapter.title
                    : "Welcome to Applied AI"}
                </h2>
                <RenderChapterContent
                  isPlaying={isPlaying}
                  setIsPlaying={setIsPlaying}
                  currentChapter={currentChapter}
                  currentLesson={currentLesson}
                  isOpen={isOpen}
                  handleChapterComplete={handleChapterComplete}
                  isFullscreen={isFullscreen}
                  lessonContent={lessonContent}
                  setCourseCompletion={setCourseCompletion}
                  toggleFullscreen={toggleFullscreen}
                  setEnergy={setEnergy}
                  setStreak={setStreak}
                />
              </div>

              {/* Engagement */}
              <div className="md:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold dark:text-white">
                    Engagement
                  </h2>
                  <div className="flex gap-2">
                    <Dialog
                      open={showEngagement}
                      onOpenChange={handleEngagementDialog}
                    >
                      <DialogTrigger className="bg-black rounded-md p-2">
                        <ChartSpline
                          onClick={() => setShowEngagement(true)}
                          color="white"
                        />
                      </DialogTrigger>
                      <DialogContent className="w-full md:w-3/5 h-3/4">
                        <DialogHeader className="flex flex-row justify-between items-center">
                          <DialogTitle className="text-lg">
                            Engagement Dashboard
                          </DialogTitle>
                          <XIcon
                            className="cursor-pointer size-8 rounded-md hover:bg-gray-200"
                            onClick={() => setShowEngagement(false)}
                          />
                        </DialogHeader>
                        <hr />
                        <DialogDescription>
                          <p>
                            {
                              "Your learning journey was dynamic! Here's how your focus levels shifted throughout the course. Based on this data, we've adjusted future content to match your preferred learning pace."
                            }
                          </p>
                        </DialogDescription>
                        <ExpressionGraph
                          sortedEmotion={sortedEmotions}
                          emotionMap={emotionMap}
                          engagementHistory={engagementHistory}
                          setEngagementHistory={setEngagementHistory}
                        />
                      </DialogContent>
                    </Dialog>
                    <Button
                      className={`${
                        isSocketConnected
                          ? "bg-green-500 hover:bg-green-500"
                          : "bg-red-400 hover:bg-red-300"
                      }`}
                      size={"icon"}
                      disabled={
                        socketStatus === "Connecting..." || isSocketConnected
                      }
                      onClick={() => {
                        if (!isSocketConnected) {
                          connect();
                        }
                      }}
                    >
                      <RadioTower />
                    </Button>
                  </div>
                </div>
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
                      <Webcam
                        strokeWidth={1}
                        className="animate-bounce rounded-full size-8 p-1 bg-gray-300 dark:bg-gray-600"
                      />
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Start Webcam
                      </p>
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
                      <Pause strokeWidth={1} fill="white" />
                    </Button>
                  )}
                </div>
                <div className="space-y-4">
                  <h2 className="text-xl font-bold mb-4 dark:text-white">
                    Course Progress
                  </h2>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium dark:text-white">
                      Quizzes Taken
                    </span>
                    <span className="text-sm font-medium dark:text-white">
                      {courseCompletion.quizzesTaken}/5
                    </span>
                  </div>
                  <Progress
                    value={(courseCompletion.quizzesTaken / 5) * 100}
                    className="w-full"
                  />

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium dark:text-white">
                      Overall Progress
                    </span>
                    <span className="text-sm font-medium dark:text-white">
                      {courseCompletion.overallProgress.toFixed(1)}%
                    </span>
                  </div>
                  <Progress
                    value={courseCompletion.overallProgress}
                    className="w-full"
                  />
                </div>
              </div>
              {/* Badges */}
              <div className="md:col-span-1 bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                <h2 className="text-xl w-full font-bold dark:text-white my-3">
                  Badges
                </h2>
                <hr />
                <div className="flex flex-col items-center justify-center pt-6">
                  {completedChapters && completedChapters.size > 0 ? (
                    Array.from(completedChapters).map((_, index) => (
                      <EnergyBadge key={index} energy={500} />
                    ))
                  ) : (
                    <p className="text-gray-600 dark:text-gray-300">
                      Finish chapter to earn badges
                    </p>
                  )}
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
        <Bored
          isPlaying={isPlaying}
          isStreaming={isStreaming}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          sortedEmotion={sortedEmotions}
        />
        <WebcamAlertDialog
          showAlertDialog={showWebCamAlert}
          setShowWebCamAlert={setShowWebCamAlert}
          startWebCam={startVideoStream}
        />
        <TimedFeedbackDialog isWebCamOn={isWebCamOn} />
        <AchievementAlertDialog
          open={showAchievement}
          setOpen={setShowAchievement}
          title="Achievement Unlocked!"
          description={`You've unlocked the '${currentLesson} Prodigy' badge for mastering ${currentLesson}. Keep going to unlock more achievements!`}
        />
        <LevelDialog
          open={showLevelUpgrade}
          setOpen={setShowLevelUpgrade}
          title="New Level Unlocked!"
          level={level}
          description={`Keep going to unlock more achievements!`}
        />
        <ConfidenceAssessment />
        <Chatbot />
        <CourseFeedbackForm />
        <PersonalizedLearningSummaryDialog
          setShowEngagement={setShowEngagement}
        />
        <SendGraph sortedEmotion={sortedEmotions} isStreaming={isStreaming} />
        <EmotionSpiderChart sortedEmotions={sortedEmotions} />
      </div>
    </ErrorBoundary>
  );
}
