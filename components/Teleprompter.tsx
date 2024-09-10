import React, { useState, useRef, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { PlayIcon, PauseIcon, RotateCcwIcon } from 'lucide-react'
import ReactMarkdown from 'react-markdown'

interface TeleprompterProps {
  content: string;
}

const Teleprompter: React.FC<TeleprompterProps> = ({ content }) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(1)
  const [currentPosition, setCurrentPosition] = useState(0)
  const contentRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let startTime: number
    let animationFrame: number

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp - (currentPosition / speed) * 20
      const elapsed = timestamp - startTime

      if (contentRef.current && containerRef.current) {
        const contentHeight = contentRef.current.scrollHeight
        const containerHeight = containerRef.current.clientHeight
        const totalScrollDistance = contentHeight - containerHeight
        const duration = (totalScrollDistance / speed) * 20

        const yPosition = Math.min((elapsed / duration) * totalScrollDistance, totalScrollDistance)
        contentRef.current.style.transform = `translateY(-${yPosition}px)`
        setCurrentPosition(yPosition)

        if (yPosition < totalScrollDistance) {
          animationFrame = requestAnimationFrame(animate)
        } else {
          setIsPlaying(false)
        }
      }
    }

    if (isPlaying) {
      animationFrame = requestAnimationFrame(animate)
    }

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame)
      }
    }
  }, [isPlaying, speed, currentPosition])

  const togglePlay = () => setIsPlaying(!isPlaying)

  const handleSpeedChange = (newSpeed: number[]) => setSpeed(newSpeed[0])

  const resetTeleprompter = () => {
    setIsPlaying(false)
    setCurrentPosition(0)
    if (contentRef.current) {
      contentRef.current.style.transition = 'none'
      contentRef.current.style.transform = 'translateY(0)'
      contentRef.current.offsetHeight
      contentRef.current.style.transition = ''
    }
  }

  return (
    <div className="w-full h-full bg-background flex flex-col">
      <div
        ref={containerRef}
        className="flex-grow overflow-hidden bg-secondary relative"
      >
        <div className="absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-secondary to-transparent z-10"></div>
        <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-secondary to-transparent z-10"></div>
        <div
          ref={contentRef}
          className="absolute inset-x-0 top-0 pt-20 px-4 pb-4"
        >
          <ReactMarkdown
            className="text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed max-w-[90%] mx-auto"
            components={{
              h1: ({node, ...props}) => <h1 className="mt-8 mb-4 text-2xl font-bold" {...props} />,
              h2: ({node, ...props}) => <h2 className="mt-6 mb-3 text-xl font-semibold" {...props} />,
              h3: ({node, ...props}) => <h3 className="mt-4 mb-2 text-lg font-medium" {...props} />,
              h4: ({node, ...props}) => <h4 className="mt-3 mb-2 text-base font-medium" {...props} />,
              h5: ({node, ...props}) => <h5 className="mt-2 mb-1 text-sm font-medium" {...props} />,
              h6: ({node, ...props}) => <h6 className="mt-2 mb-1 text-sm font-medium" {...props} />,
              code: ({ node, inline, className, children, ...props }: any) => {
                const match = /language-(\w+)/.exec(className || '')
                return !inline ? (
                  <pre className="text-xs sm:text-sm md:text-base lg:text-lg bg-gray-800 text-white p-2 rounded whitespace-pre-wrap break-words my-4">
                    <code className={className} {...props}>
                      {children}
                    </code>
                  </pre>
                ) : (
                  <code className="bg-gray-200 dark:bg-gray-700 rounded px-1" {...props}>
                    {children}
                  </code>
                )
              }
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
      </div>
      <div className="bg-background p-2 border-t">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-2">
          <Button onClick={togglePlay} variant="outline" size="icon" className="w-10 h-10">
            {isPlaying ? <PauseIcon className="h-5 w-5" /> : <PlayIcon className="h-5 w-5" />}
          </Button>
          <div className="flex-1">
            <Slider
              min={0.5}
              max={2}
              step={0.1}
              value={[speed]}
              onValueChange={handleSpeedChange}
            />
          </div>
          <Button onClick={resetTeleprompter} variant="outline" size="icon" className="w-10 h-10">
            <RotateCcwIcon className="h-5 w-5" />
          </Button>
        </div>
        <div className="text-center text-sm text-muted-foreground mt-1">
          Speed: {speed.toFixed(1)}x
        </div>
      </div>
    </div>
  )
}

export default Teleprompter