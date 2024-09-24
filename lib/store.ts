import { create } from "zustand";

interface TitleStore {
  title: string;
  setTitle: (newTitle: string) => void;
}

export const useTitleStore = create<TitleStore>((set) => ({
  title: "",
  setTitle: (newTitle) => set({ title: newTitle }),
}));
