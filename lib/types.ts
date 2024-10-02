export type TabId = "face" | "burst" | "prosody";

export interface Tab {
  id: TabId;
  label: string;
}

export const tabs: Tab[] = [
  { id: "face", label: "Facial expression" },
  { id: "burst", label: "Vocal Burst" },
  { id: "prosody", label: "Speech Prosody" },
];

export type Point = {
  time: string;
  emotion: EmotionName;
  score: number;
}

export type EmotionName =
  | "Disappointment"
  | "Boredom"
  | "Confusion"
  | "Doubt"
  | "Neutral"
  | "Calmness"
  | "Concentration"
  | "Interest"
  | "Joy";

export const emotions: EmotionName[] = [
  "Disappointment",
  "Boredom",
  "Confusion",
  "Doubt",
  "Neutral",
  "Calmness",
  "Concentration",
  "Interest",
  "Joy",
];


export type ExplorationOptionType =
  | "Show me a simple use-case"
  | "Give me a quick poll"
  | "Test me with a quiz"
  | "";

export type DialogState = "initial" | "no" | "yes";
