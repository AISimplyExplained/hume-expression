import { EmotionName, emotions, Point } from "@/lib/types";
import { supabase } from "@/lib/utilities/supabase";
import React, { useEffect } from "react";

interface Props {
  sortedEmotion: {
    emotion: string;
    score: number;
  }[];
  isStreaming: boolean
}
export default function SendGraph({sortedEmotion, isStreaming}:Props) {
  useEffect(() => {
    const interval = setInterval(async () => {
      let selectedEmotion: Point | null = null;
      console.log("s", isStreaming, sortedEmotion)
      if(!isStreaming) return
      for (let i = 0; i < sortedEmotion.length; i++) {
        const emotion = sortedEmotion[i].emotion;
        for (let j = 0; j < emotions.length; j++) {
          if (emotion === emotions[j]) {
            const date = new Date().toLocaleTimeString();
            selectedEmotion = {
              time: date,
              emotion: sortedEmotion[i].emotion as EmotionName,
              score: sortedEmotion[i].score,
            };
            
            await insertData({
              date: date,
              emotion: selectedEmotion.emotion,
              score: selectedEmotion.score,
            }).then(() => {});
            break;
          }
        }
        if (selectedEmotion) {
          break;
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [sortedEmotion, isStreaming]);
  return null;
}

const insertData = async ({
  date,
  emotion,
  score,
}: {
  date: string;
  emotion: string;
  score: number;
}) => {
  
  const { data, error } = await supabase.from("graph").insert([
    {
      date: date,
      emotion: emotion,
      score: score,
    },
  ]);

  if (error) {
    console.error("Error inserting data:", error);
  }
};
