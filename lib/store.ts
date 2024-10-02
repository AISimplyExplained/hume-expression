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
  setContent: (newContent) => set({content:newContent})
}));
