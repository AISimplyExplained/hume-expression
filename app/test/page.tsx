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

  const startVideoStream = async () => {
    try {
      console.log('Attempting to access camera...');
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      console.log('Camera access successful, setting up video stream...');
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        console.log('Video element source set successfully');
      }
      setIsStreaming(true);
      console.log('isStreaming set to true');
      startSendingFrames();
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  };

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
      sendVideoFramesIntervalRef.current = null;
    }
  };

  const startSendingFrames = () => {
    sendVideoFramesIntervalRef.current = setInterval(() => {
      if (videoRef.current && canvasRef.current) {
        const context = canvasRef.current.getContext('2d');
        if (context) {
          canvasRef.current.width = videoRef.current.videoWidth;
          canvasRef.current.height = videoRef.current.videoHeight;
          context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
          // Here you would typically send the frame data to your server or process it
          console.log('Sending video frame');
        }
      }
    }, 1000);
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
              <div className="flex items-center">
                <DarkModeToggle />
                <Button variant="ghost" size="icon">
                  <Search className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Bell className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Settings className="h-5 w-5" />
                </Button>
                <Avatar className="h-8 w-8 ml-2">
                  <AvatarFallback>AM</AvatarFallback>
                </Avatar>
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
                <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg mb-4 flex items-center justify-center">
                  <Video className="h-16 w-16 text-gray-400" />
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium dark:text-white">Progress</span>
                  <span className="text-sm font-medium dark:text-white">{progress}%</span>
                </div>
                <Progress value={progress} className="mb-4" />
                <div className="flex justify-between items-center">
                  <Button variant="outline" size="icon">
                    <PlayCircle className="h-4 w-4" />
                  </Button>
                  <Slider defaultValue={[0]} max={100} step={1} className="w-[60%]" />
                  <span className="text-sm font-medium dark:text-white">10:30 / 45:00</span>
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
      </div>
    </ErrorBoundary>
  )
}

