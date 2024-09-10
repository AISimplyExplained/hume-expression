import React, { useState, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { BookOpen, ChevronDown, ChevronRight, FileText, Video, HelpCircle, CheckCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";

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
                className="w-full justify-between mb-2"
              >
                <span className="flex items-center">
                  <BookOpen className="mr-2 h-4 w-4" />
                  {module.title}
                </span>
                <span className="flex items-center">
                  <Progress value={getModuleProgress(module.id)} className="w-20 mr-2" />
                  {expandedModules.includes(module.id) ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </span>
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-2 pl-4 transition-all duration-300 ease-in-out">
              {module.chapters.map((chapter) => (
                <Button
                  key={chapter.id}
                  variant={selectedChapter?.chapterId === chapter.id ? "default" : "ghost"}
                  className="w-full justify-start relative"
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
              ))}
            </CollapsibleContent>
          </Collapsible>
        ))}
      </div>
    </div>
  );
};

export default Curriculum;