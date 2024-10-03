import React, { useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Minimize, Maximize } from "lucide-react";
import Teleprompter from "./Teleprompter";
import Quiz from "./Quiz";
import { Chapter } from "./Curriculum";
import { useChapterEnded, useTitleStore } from "@/lib/store";
import TransformerGame from "./Game";

interface CourseCompletion {
  quizzesTaken: number;
  overallProgress: number;
  videosWatched: number;
  assignmentsCompleted: number;
}

interface ChapterContentProps {
  currentChapter: Chapter | null;
  isOpen: boolean;
  isFullscreen: boolean;
  toggleFullscreen: () => void;
  handleChapterComplete: (chapterId: string) => void;
  setCourseCompletion: React.Dispatch<React.SetStateAction<CourseCompletion>>;
  lessonContent: Record<string, string>;
  currentLesson: string;
  isPlaying: boolean;
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
  setEnergy: React.Dispatch<React.SetStateAction<number>>;
}

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

const ChapterContent: React.FC<ChapterContentProps> = ({
  currentChapter,
  isOpen,
  isFullscreen,
  toggleFullscreen,
  handleChapterComplete,
  setCourseCompletion,
  lessonContent,
  currentLesson,
  isPlaying,
  setIsPlaying,
  setEnergy
}) => {
  const {setTitle} = useTitleStore()
  const videoContentRef = useRef<HTMLVideoElement | null>(null);
  const youtubePlayerRef = useRef<any>(null);
  const [youtubeReady, setYoutubeReady] = useState(false);

  const pauseMedia = () => {
    if (currentChapter?.content.includes("youtube.com")) {
      if (youtubePlayerRef.current && youtubeReady) {
        youtubePlayerRef.current.pauseVideo();
        console.log("YouTube video paused");
      }
    } else if (videoContentRef.current) {
      videoContentRef.current.pause();
    }
  };

  useEffect(() => {
    if (isOpen) {
      pauseMedia();
    }
  }, [isOpen]);

  useEffect(() => {

    setTitle(currentLesson)
    // Load YouTube API
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName("script")[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

    window.onYouTubeIframeAPIReady = () => {
      setYoutubeReady(true);
    };
  }, []);

  const getYouTubeEmbedUrl = (url: string) => {
    const videoId = url.split("v=")[1];
    const ampersandPosition = videoId.indexOf("&");
    if (ampersandPosition !== -1) {
      return videoId.substring(0, ampersandPosition);
    }
    return videoId;
  };

  const fullscreenButton = (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleFullscreen}
      className="absolute top-2 right-2 z-20"
      aria-label="Toggle fullscreen"
    >
      {isFullscreen ? (
        <Minimize className="h-6 w-6" />
      ) : (
        <Maximize className="h-6 w-6" />
      )}
    </Button>
  );

  const {setContent} = useChapterEnded()

  useEffect(() => {
    if(currentChapter && currentChapter.type === "text") {
     setContent(currentChapter.content) 
    }
  },[currentChapter, setContent])

  const Render = () => {
    if (!currentChapter) return null;

    switch (currentChapter.type) {
      case "video":
        if (currentChapter.content.includes("youtube.com")) {
          const videoId = getYouTubeEmbedUrl(currentChapter.content);

          return (
            <EmbedYT
              fullscreenButton={fullscreenButton}
              videoId={videoId}
              youtubePlayerRef={youtubePlayerRef}
              youtubeReady={youtubeReady}
            />
          );
        } else {
          return (
            <div className="relative aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg mb-4">
              {fullscreenButton}
              <video
                ref={videoContentRef}
                src={currentChapter.content}
                controls
                className="w-full h-full"
              />
            </div>
          );
        }
      case "text":
        return (
          <div className="relative aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg mb-4 overflow-auto p-4">
            {fullscreenButton}
            <Teleprompter
              isPlaying={isPlaying}
              setIsPlaying={setIsPlaying}
              isOpen={isOpen}
              content={
                lessonContent[currentLesson as keyof typeof lessonContent]
              }
            />
          </div>
        );
      case "quiz":
        const quizData = JSON.parse(currentChapter.content);
        return (
          <div className="relative aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg mb-4 overflow-auto p-4">
            {fullscreenButton}
            <Quiz
              questions={quizData}
              onComplete={(score) => {
                console.log(`Quiz completed with score: ${score}`);
                handleChapterComplete(currentChapter.id);
                setCourseCompletion((prev) => ({
                  ...prev,
                  quizzesTaken: Math.min(prev.quizzesTaken + 1, 5),
                  overallProgress: Math.min(prev.overallProgress + 5, 100),
                }));
              }}
              setEnergy={setEnergy}
            />
          </div>
        );

      case "game":
        return <TransformerGame />
      default:
        return null;
    }
  };

  return Render();
};

function EmbedYT({
  youtubeReady,
  videoId,
  youtubePlayerRef,
  fullscreenButton,
}: {
  youtubeReady: boolean;
  youtubePlayerRef: React.MutableRefObject<any>;
  videoId: string;
  fullscreenButton: React.JSX.Element;
}) {
  useEffect(() => {
    if (youtubeReady) {
      youtubePlayerRef.current = new window.YT.Player(
        `youtube-player-${videoId}`,
        {
          videoId: videoId,
          events: {
            onReady: () => console.log("YouTube player is ready"),
          },
        }
      );
    }
  }, [youtubeReady, videoId]);

  return (
    <div className="relative aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg mb-4">
      {fullscreenButton}
      <div id={`youtube-player-${videoId}`} className="w-full h-full"></div>
    </div>
  );
}

export default ChapterContent;
