import React, { useState, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { BookOpen, ChevronDown, ChevronRight, FileText, Video, HelpCircle, CheckCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from 'framer-motion';

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

interface CurriculumProps {
  curriculum: Module[];
  onChapterSelect: (moduleIndex: number, chapterIndex: number) => void;
  completedChapters: Set<string>;
  onChapterComplete: (chapterId: string) => void;
}

const getChapterIcon = (type: ChapterType) => {
  switch (type) {
    case 'video': return <Video className="h-4 w-4" />;
    case 'text': return <FileText className="h-4 w-4" />;
    case 'quiz': return <HelpCircle className="h-4 w-4" />;
  }
};

const Curriculum: React.FC<CurriculumProps> = ({
  curriculum,
  onChapterSelect,
  completedChapters,
  onChapterComplete
}) => {
  const [expandedModules, setExpandedModules] = useState<string[]>([]);
  const [selectedChapter, setSelectedChapter] = useState<{ moduleId: string; chapterId: string } | null>(null);

  const toggleModule = useCallback((id: string) => {
    setExpandedModules(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  }, []);

  const handleChapterSelect = useCallback((moduleId: string, chapterId: string) => {
    setSelectedChapter({ moduleId, chapterId });
    const moduleIndex = curriculum.findIndex(m => m.id === moduleId);
    const chapterIndex = curriculum[moduleIndex].chapters.findIndex(c => c.id === chapterId);
    onChapterSelect(moduleIndex, chapterIndex);
  }, [curriculum, onChapterSelect]);

  const getModuleProgress = useCallback((moduleId: string) => {
    const module = curriculum.find(m => m.id === moduleId);
    if (!module) return 0;
    const totalChapters = module.chapters.length;
    const completedInModule = module.chapters.filter(c => completedChapters.has(c.id)).length;
    return (completedInModule / totalChapters) * 100;
  }, [curriculum, completedChapters]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <h2 className="text-xl font-bold mb-4 dark:text-white">Applied AI Curriculum</h2>
      <div className="space-y-2">
        {curriculum.map((module) => (
          <Collapsible
            key={module.id}
            open={expandedModules.includes(module.id)}
            onOpenChange={() => toggleModule(module.id)}
          >
            <CollapsibleTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-between mb-2 transition-all duration-300 ease-in-out"
              >
                <span className="flex items-center">
                  <BookOpen className="mr-2 h-4 w-4" />
                  {module.title}
                </span>
                <span className="flex items-center">
                  <Progress value={getModuleProgress(module.id)} className="w-20 mr-2" />
                  <motion.div
                    animate={{ rotate: expandedModules.includes(module.id) ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </motion.div>
                </span>
              </Button>
            </CollapsibleTrigger>
            <AnimatePresence>
              {expandedModules.includes(module.id) && (
                <CollapsibleContent
                  className="pl-4 overflow-hidden"
                  forceMount
                >
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                  >
                    <div className="space-y-2 py-2">
                      {module.chapters.map((chapter) => (
                        <motion.div
                          key={chapter.id}
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Button
                            variant={selectedChapter?.chapterId === chapter.id ? "default" : "ghost"}
                            className="w-full justify-start relative transition-all duration-200 ease-in-out"
                            onClick={() => handleChapterSelect(module.id, chapter.id)}
                          >
                            <span className="flex items-center">
                              {getChapterIcon(chapter.type)}
                              <span className="ml-2">{chapter.title}</span>
                            </span>
                            {completedChapters.has(chapter.id) && (
                              <CheckCircle className="h-4 w-4 text-green-500 absolute right-2" />
                            )}
                          </Button>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                </CollapsibleContent>
              )}
            </AnimatePresence>
          </Collapsible>
        ))}
      </div>
    </div>
  );
};

export default Curriculum;