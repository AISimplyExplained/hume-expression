import { create } from "zustand";

interface TitleStore {
  title: string;
  setTitle: (newTitle: string) => void;
}

export const useTitleStore = create<TitleStore>((set) => ({
  title: "",
  setTitle: (newTitle) => set({ title: newTitle }),
}));

interface ChapterStore {
  chapterFinished: boolean;
  changeChapterFinished: (isFinished: boolean) => void;
  content: string;
  setContent: (newContent: string) => void;
}

export const useChapterEnded = create<ChapterStore>((set) => ({
  chapterFinished: false,
  changeChapterFinished: (isFinished) => set({ chapterFinished: isFinished }),
  content: "",
  setContent: (newContent) => set({ content: newContent }),
}));

interface ModuleStore {
  moduleFinished: boolean;
  title: string;
  showSummary: boolean;
  changeModuleFinished: ({
    isFinished,
    title,
  }: {
    isFinished: boolean;
    title: string;
  }) => void;
  changeSummary: (isFinished: boolean) => void;
}

export const useModule = create<ModuleStore>((set) => ({
  changeModuleFinished: ({ isFinished, title }) =>
    set({ moduleFinished: isFinished, title }),
  moduleFinished: false,
  title: "",
  showSummary: false,
  changeSummary: (isFinished) => set({ showSummary: isFinished }),
}));
